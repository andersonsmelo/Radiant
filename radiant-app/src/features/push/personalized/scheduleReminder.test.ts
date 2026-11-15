import AsyncStorage from '@react-native-async-storage/async-storage';
import { PERSONALIZED_REMINDER_ID, schedulePersonalizedReminder, type ReminderNotifications } from './scheduleReminder';
import { ALL_ON, type ReminderContext } from './composeReminder';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

type Request = { identifier: string; content: { title: string; body: string; data: Record<string, unknown> }; trigger: { type: string; date: Date; repeats?: boolean } };

/** Central falsa: guarda a lista agendada como o sistema guarda, por identificador. */
function fakeCenter(permission = 'granted') {
  let scheduled: Request[] = [];
  const api: ReminderNotifications = {
    SchedulableTriggerInputTypes: { DATE: 'date' } as never,
    getPermissionsAsync: jest.fn(async () => ({ status: permission }) as never),
    cancelAllScheduledNotificationsAsync: jest.fn(async () => { scheduled = []; }),
    scheduleNotificationAsync: jest.fn(async (req: never) => {
      const r = req as Request & { identifier?: string };
      const identifier = r.identifier ?? `auto-${scheduled.length}`;
      scheduled = [...scheduled.filter(s => s.identifier !== identifier), { ...r, identifier }];
      return identifier;
    }),
  };
  return { api, list: () => scheduled };
}

const NOW = new Date(2026, 10, 15, 10);
const context = (over: Partial<ReminderContext> = {}): ReminderContext => ({
  now: NOW, lastStudyDateKey: '2026-11-14', streakDays: 5, dueReviews: 2, nextLessonTitle: 'Colimação',
  goalCompletedToday: false, usualHour: 20, league: null, firedTodayAlready: false, preferences: ALL_ON, ...over,
});

beforeEach(() => AsyncStorage.clear());

describe('schedulePersonalizedReminder', () => {
  it('agenda um único lembrete, com gatilho de data que não se repete, e a rota no dado', async () => {
    const center = fakeCenter();
    await schedulePersonalizedReminder(center.api, { optedIn: true }, { gather: async () => context() });
    expect(center.list()).toHaveLength(1);
    const [req] = center.list();
    expect(req.identifier).toBe(PERSONALIZED_REMINDER_ID);
    expect(req.trigger).toEqual({ type: 'date', date: new Date(2026, 10, 15, 20) });
    expect(req.content.data).toEqual({ url: '/', kind: 'sequencia' });
    expect(req.content.body.startsWith('Pixel: ')).toBe(true);
    expect(await AsyncStorage.getItem('push.lastScheduled.v1')).toBe(new Date(2026, 10, 15, 20).toISOString());
  });

  it('reabrir o app três vezes não duplica nem acumula: a lista continua com um', async () => {
    const center = fakeCenter();
    for (const over of [{}, { dueReviews: 0 }, { streakDays: 1 }]) {
      await schedulePersonalizedReminder(center.api, { optedIn: true }, { gather: async () => context(over) });
    }
    expect(center.list()).toHaveLength(1);
    expect(center.list()[0].content.data.kind).toBe('revisao');
  });

  it('o lembrete antigo da 1.5.0 também sai: no app há no máximo um pendente', async () => {
    const center = fakeCenter();
    await center.api.scheduleNotificationAsync({ content: { title: 'Meta do dia' }, trigger: null } as never);
    await schedulePersonalizedReminder(center.api, { optedIn: true }, { gather: async () => context() });
    expect(center.list().map(r => r.identifier)).toEqual([PERSONALIZED_REMINDER_ID]);
  });

  it.each([
    ['sem aceite', { optedIn: false }, 'granted'],
    ['permissão negada', { optedIn: true }, 'denied'],
  ])('%s: nada fica agendado, nem o que já estava', async (_caso, opts, permission) => {
    const center = fakeCenter(permission);
    await center.api.scheduleNotificationAsync({ identifier: PERSONALIZED_REMINDER_ID, content: {}, trigger: null } as never);
    const result = await schedulePersonalizedReminder(center.api, opts, { gather: async () => context() });
    expect(center.list()).toEqual([]);
    expect(result).toBe(opts.optedIn ? 'cancelled_no_permission' : 'cancelled_not_opted_in');
  });

  it('nada a dizer: cancela o pendente e esquece o horário', async () => {
    const center = fakeCenter();
    await schedulePersonalizedReminder(center.api, { optedIn: true }, { gather: async () => context() });
    const off = { sequencia: false, revisao: false, aula: false, meta: false, liga: false };
    expect(await schedulePersonalizedReminder(center.api, { optedIn: true }, { gather: async () => context({ preferences: off }) }))
      .toBe('cancelled_nothing_to_say');
    expect(center.list()).toEqual([]);
    expect(await AsyncStorage.getItem('push.lastScheduled.v1')).toBeNull();
  });
});
