/**
 * Agenda o lembrete personalizado (F6). Idempotente: o app tem no máximo um
 * lembrete pendente, com identificador fixo e gatilho de data que não se repete.
 * Por isso quem some recebe no máximo um retorno: nada se reagenda sem o app aberto.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type * as ExpoNotifications from 'expo-notifications';
import { planReminder, type ReminderContext } from './composeReminder';
import { LAST_SCHEDULED_KEY, gatherReminderContext } from './reminderContext';

export const PERSONALIZED_REMINDER_ID = 'radiant.lembrete.personalizado';

export type ReminderNotifications = Pick<typeof ExpoNotifications,
    'SchedulableTriggerInputTypes' | 'getPermissionsAsync' | 'cancelAllScheduledNotificationsAsync' | 'scheduleNotificationAsync'>;

export type ScheduleOutcome = 'scheduled' | 'cancelled_not_opted_in' | 'cancelled_no_permission' | 'cancelled_nothing_to_say';

export async function schedulePersonalizedReminder(
    notifications: ReminderNotifications,
    opts: { optedIn: boolean },
    deps: { gather?: (now: Date) => Promise<ReminderContext>; now?: () => Date } = {},
): Promise<ScheduleOutcome> {
    const cancel = async (outcome: ScheduleOutcome) => {
        await notifications.cancelAllScheduledNotificationsAsync();
        await AsyncStorage.removeItem(LAST_SCHEDULED_KEY);
        return outcome;
    };
    if (!opts.optedIn) return cancel('cancelled_not_opted_in');
    // A permissão real, não a guardada: quem negou nos Ajustes do sistema para de receber no próximo foco.
    const { status } = await notifications.getPermissionsAsync();
    if (status !== 'granted') return cancel('cancelled_no_permission');

    const now = (deps.now ?? (() => new Date()))();
    const decision = planReminder(await (deps.gather ?? gatherReminderContext)(now));
    if ('skip' in decision) return cancel('cancelled_nothing_to_say');

    await notifications.cancelAllScheduledNotificationsAsync();
    await notifications.scheduleNotificationAsync({
        identifier: PERSONALIZED_REMINDER_ID,
        content: { title: decision.title, body: decision.body, data: { url: decision.route, kind: decision.kind } },
        trigger: { type: notifications.SchedulableTriggerInputTypes.DATE, date: decision.fireAt },
    });
    await AsyncStorage.setItem(LAST_SCHEDULED_KEY, decision.fireAt.toISOString());
    return 'scheduled';
}
