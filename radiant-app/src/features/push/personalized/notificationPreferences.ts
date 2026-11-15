import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import { ALL_ON, type NotificationPreferences, type ReminderPreferenceId } from './composeReminder';

/** Por tipo de lembrete. O liga-desliga geral continua sendo `push.optin.v1`. */
export const NOTIFICATION_PREFERENCES_KEY = STORAGE_KEYS.NOTIFICATION_PREFERENCES;

export async function readNotificationPreferences(): Promise<NotificationPreferences> {
    try {
        const value = JSON.parse((await AsyncStorage.getItem(NOTIFICATION_PREFERENCES_KEY)) ?? 'null') as Record<string, unknown> | null;
        if (!value || value.schemaVersion !== 1) return ALL_ON;
        const prefs = { ...ALL_ON };
        for (const id of Object.keys(ALL_ON) as ReminderPreferenceId[]) {
            if (typeof value[id] === 'boolean') prefs[id] = value[id] as boolean;
        }
        return prefs;
    } catch {
        return ALL_ON;
    }
}

export async function setNotificationPreference(id: ReminderPreferenceId, enabled: boolean): Promise<NotificationPreferences> {
    const next = { ...(await readNotificationPreferences()), [id]: enabled };
    await AsyncStorage.setItem(NOTIFICATION_PREFERENCES_KEY, JSON.stringify({ schemaVersion: 1, ...next }));
    return next;
}
