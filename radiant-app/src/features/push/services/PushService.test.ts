import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { PushService } from './PushService';
import { DailyGoalService } from '../../daily-goal/services/DailyGoalService';
import { SpacedRepetitionService } from '../../spaced-repetition/services/SpacedRepetitionService';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

jest.mock('expo-notifications', () => ({
  SchedulableTriggerInputTypes: { DATE: 'date' },
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  scheduleNotificationAsync: jest.fn().mockResolvedValue('id-1'),
  cancelAllScheduledNotificationsAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../telemetry/TelemetryService', () => ({
  TelemetryService: { track: jest.fn().mockResolvedValue(undefined) },
}));

jest.mock('../../spaced-repetition/services/SpacedRepetitionService', () => ({
  SpacedRepetitionService: { getDueLessons: jest.fn().mockResolvedValue([]) },
}));

jest.mock('../../daily-goal/services/DailyGoalService', () => ({
  DailyGoalService: { getSnapshot: jest.fn().mockResolvedValue({ isCompleted: false }) },
}));

const notifications = Notifications as jest.Mocked<typeof Notifications>;
const dailyGoal = DailyGoalService as jest.Mocked<typeof DailyGoalService>;
const spacedRepetition = SpacedRepetitionService as jest.Mocked<typeof SpacedRepetitionService>;

// Até 2026-10-16 `PUSH_SHADOW_MODE` era fixo em `true`: o serviço registrava a
// intenção e nunca agendava nada. O dono decidiu ligar o lembrete (ADR de
// 2026-10-16). Estes casos usam a configuração REAL, sem mock de `PushConfig`.
describe('PushService — lembrete diário de verdade', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
    jest.useFakeTimers({ doNotFake: ['nextTick', 'setImmediate', 'queueMicrotask'] });
    // 10:00 local: a janela de 18 h a 21 h ainda está no futuro.
    jest.setSystemTime(new Date(2026, 9, 16, 10, 0, 0));
    dailyGoal.getSnapshot.mockResolvedValue({ isCompleted: false } as never);
    spacedRepetition.getDueLessons.mockResolvedValue([]);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('com aceite e permissão, agenda um lembrete de verdade para a noite', async () => {
    await AsyncStorage.setItem('push.optin.v1', 'true');

    await PushService.scheduleDailyIfEligible({ reason: 'teste' });

    expect(notifications.scheduleNotificationAsync).toHaveBeenCalledTimes(1);
    // O formato de 0.32: um `Date` cru é recusado em tempo de execução ("needs
    // to contain a `type` or `channelId` entry"), visto no simulador em
    // 2026-10-16 no primeiro agendamento real. O mock não valida o contrato,
    // então este caso o afirma.
    const trigger = notifications.scheduleNotificationAsync.mock.calls[0][0].trigger as { type: string; date: Date };
    expect(trigger.type).toBe('date');
    expect(trigger.date.getHours()).toBeGreaterThanOrEqual(18);
    expect(trigger.date.getHours()).toBeLessThan(21);
  });

  it('sem aceite, não agenda nada', async () => {
    await PushService.scheduleDailyIfEligible({ reason: 'teste' });

    expect(notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it('com a meta fechada e sem revisão, cancela o lembrete que já estava marcado', async () => {
    // O lembrete da noite diz "sua meta do dia segue disponível". Se o aluno
    // fecha a meta depois de agendado, ele chegaria mentindo.
    await AsyncStorage.setItem('push.optin.v1', 'true');
    await AsyncStorage.setItem('push.lastScheduled.v1', new Date(2026, 9, 16, 19, 0, 0).toISOString());
    dailyGoal.getSnapshot.mockResolvedValue({ isCompleted: true } as never);

    await PushService.scheduleDailyIfEligible({ reason: 'teste' });

    expect(notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalledTimes(1);
    expect(notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    expect(await AsyncStorage.getItem('push.lastScheduled.v1')).toBeNull();
  });
});

const storage = jest.mocked(AsyncStorage);
const originalRead = storage.getItem.getMockImplementation()!;
const originalWrite = storage.setItem.getMockImplementation()!;
function barrier<T>() { let resolve!: (value: T) => void; let reject!: (cause: Error) => void; const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; }
const flushIO = () => new Promise<void>(resolve => setImmediate(resolve));

describe('PushService — transação inteira entre portas', () => {
  beforeEach(async () => {
    jest.restoreAllMocks(); jest.clearAllMocks();
    storage.getItem.mockImplementation(originalRead); storage.setItem.mockImplementation(originalWrite); await AsyncStorage.clear();
    notifications.getPermissionsAsync.mockReset().mockResolvedValue({ status: 'granted' } as never);
    notifications.requestPermissionsAsync.mockReset().mockResolvedValue({ status: 'granted' } as never);
    notifications.scheduleNotificationAsync.mockReset().mockResolvedValue('id-1');
    notifications.cancelAllScheduledNotificationsAsync.mockReset().mockResolvedValue(undefined);
    dailyGoal.getSnapshot.mockResolvedValue({ isCompleted: false } as never); spacedRepetition.getDueLessons.mockResolvedValue([]);
    jest.useFakeTimers({ doNotFake: ['setImmediate', 'nextTick', 'queueMicrotask'], now: new Date(2026, 9, 29, 10) });
  });
  afterEach(() => jest.useRealTimers());

  it('leitor, scheduler externo e setOptIn legado esperam inclusive a segunda permissão e rollback', async () => {
    const gate = barrier<Notifications.NotificationPermissionsStatus>(); const entered = barrier<void>();
    notifications.getPermissionsAsync.mockResolvedValueOnce({ status: 'granted' } as never).mockImplementationOnce(async () => { entered.resolve(); return gate.promise; });
    notifications.requestPermissionsAsync.mockResolvedValue({ status: 'denied' } as never);
    const decision = PushService.changeReminderPreference(true); await entered.promise;
    let readDone = false; let scheduled = false; let wrote = false;
    const read = PushService.getOptIn().then(value => { readDone = true; return value; });
    const externalSchedule = PushService.scheduleDailyIfEligible({ reason: 'journey_focus' }).then(() => { scheduled = true; });
    const legacyWrite = PushService.setOptIn(false).then(() => { wrote = true; });
    try {
      await flushIO(); expect({ readDone, scheduled, wrote }).toEqual({ readDone: false, scheduled: false, wrote: false });
      expect(await AsyncStorage.getItem('push.optin.v1')).toBe('true');
      expect(notifications.getPermissionsAsync).toHaveBeenCalledTimes(2);
      gate.resolve({ status: 'denied' } as never);
      expect(await decision).toBe(false); expect(await read).toBe(false); await externalSchedule; await legacyWrite;
      expect(notifications.scheduleNotificationAsync).not.toHaveBeenCalled(); expect(await PushService.getOptIn()).toBe(false);
    } finally { gate.resolve({ status: 'denied' } as never); await Promise.allSettled([decision, read, externalSchedule, legacyWrite]); }
  });
  it('fila continua retida durante o agendamento e scheduler externo não duplica a notificação', async () => {
    const gate = barrier<string>(); const entered = barrier<void>();
    notifications.scheduleNotificationAsync.mockImplementationOnce(async () => { entered.resolve(); return gate.promise; });
    const decision = PushService.changeReminderPreference(true); await entered.promise;
    let readDone = false; const read = PushService.getOptIn().then(value => { readDone = true; return value; });
    const scheduled = PushService.scheduleDailyIfEligible({ reason: 'external' });
    try { await flushIO(); expect(readDone).toBe(false); expect(notifications.scheduleNotificationAsync).toHaveBeenCalledTimes(1);
      gate.resolve('id-1'); expect(await decision).toBe(true); expect(await read).toBe(true); await scheduled;
      expect(notifications.scheduleNotificationAsync).toHaveBeenCalledTimes(1);
    } finally { gate.resolve('id-1'); await Promise.allSettled([decision, read, scheduled]); }
  });
  it('rollback pendente também retém leitura pública, sem true intermediário', async () => {
    const gate = barrier<void>(); const entered = barrier<void>();
    notifications.getPermissionsAsync.mockResolvedValue({ status: 'denied' } as never); notifications.requestPermissionsAsync.mockResolvedValue({ status: 'denied' } as never);
    storage.setItem.mockImplementation(async (key, value) => { if (key === 'push.optin.v1' && value === 'false') { entered.resolve(); await gate.promise; } return originalWrite(key, value); });
    const decision = PushService.changeReminderPreference(true); await entered.promise;
    let readDone = false; const read = PushService.getOptIn().then(value => { readDone = true; return value; });
    try { await flushIO(); expect(readDone).toBe(false); gate.resolve(); expect(await decision).toBe(false); expect(await read).toBe(false);
    } finally { gate.resolve(); await Promise.allSettled([decision, read]); }
  });
  it('setOptIn legado conserva true mesmo com negação, sem herdar rollback da linha', async () => {
    notifications.getPermissionsAsync.mockResolvedValue({ status: 'denied' } as never); notifications.requestPermissionsAsync.mockResolvedValue({ status: 'denied' } as never);
    await PushService.setOptIn(true); expect(await PushService.getOptIn()).toBe(true);
    expect(notifications.requestPermissionsAsync).toHaveBeenCalledTimes(1); expect(notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });
  it('rejeição de agendamento é pública, cauda recupera e próxima decisão termina', async () => {
    notifications.scheduleNotificationAsync.mockRejectedValueOnce(new Error('schedule'));
    await expect(PushService.changeReminderPreference(true)).rejects.toThrow('schedule');
    await expect(PushService.getOptIn()).resolves.toBe(true);
    await expect(PushService.changeReminderPreference(false)).resolves.toBe(false);
    await expect(PushService.getDebugState()).resolves.toMatchObject({ optIn: false });
  });
  it('rejeição de gravação não fabrica sucesso nem envenena leitura e nova escrita', async () => {
    storage.setItem.mockRejectedValueOnce(new Error('disk'));
    await expect(PushService.changeReminderPreference(true)).rejects.toThrow('disk');
    await expect(PushService.getOptIn()).resolves.toBeNull();
    await expect(PushService.changeReminderPreference(true)).resolves.toBe(true);
  });
  it('grant, deny e false completos não reenfileiram chamadas internas nem travam', async () => {
    await expect(PushService.changeReminderPreference(true)).resolves.toBe(true);
    const track = jest.requireMock('../../telemetry/TelemetryService').TelemetryService.track;
    const events = track.mock.calls.map(([name]: [string]) => name);
    expect(events.filter((name: string) => name === 'push_permission_granted')).toHaveLength(2);
    expect(events.indexOf('push_optin_accepted')).toBeGreaterThan(events.lastIndexOf('push_permission_granted'));
    await expect(PushService.changeReminderPreference(false)).resolves.toBe(false);
    notifications.getPermissionsAsync.mockResolvedValue({ status: 'denied' } as never); notifications.requestPermissionsAsync.mockResolvedValue({ status: 'denied' } as never);
    await expect(PushService.changeReminderPreference(true)).resolves.toBe(false);
    await expect(PushService.onAppOpen()).resolves.toBeUndefined();
    await expect(PushService.simulateIgnoredPush()).resolves.toBeUndefined();
    await expect(PushService.cancelAll()).resolves.toBeUndefined();
  });
});

jest.mock('../personalized/reminderContext', () => ({ gatherReminderContext: jest.fn() }));

// F6 da 1.6 (ADR 2026-11-15). A flag nasce desligada: o caso desligado é a contraprova
// de que o lembrete da 1.5.0 continua exatamente o mesmo.
describe('PushService — lembrete personalizado atrás de ENABLE_PERSONALIZED_NOTIFICATIONS', () => {
  const { AppConfig } = require('../../../config') as typeof import('../../../config');
  const gather = jest.requireMock('../personalized/reminderContext').gatherReminderContext as jest.Mock;
  const original = AppConfig.ENABLE_PERSONALIZED_NOTIFICATIONS;

  beforeEach(async () => {
    jest.clearAllMocks();
    storage.getItem.mockImplementation(originalRead); storage.setItem.mockImplementation(originalWrite);
    await AsyncStorage.clear();
    await AsyncStorage.setItem('push.optin.v1', 'true');
    notifications.getPermissionsAsync.mockResolvedValue({ status: 'granted' } as never);
    notifications.scheduleNotificationAsync.mockResolvedValue('id-1');
    dailyGoal.getSnapshot.mockResolvedValue({ isCompleted: false } as never); spacedRepetition.getDueLessons.mockResolvedValue([]);
    jest.useFakeTimers({ doNotFake: ['setImmediate', 'nextTick', 'queueMicrotask'], now: new Date(2026, 10, 15, 10) });
    gather.mockResolvedValue({
      now: new Date(2026, 10, 15, 10), lastStudyDateKey: '2026-11-14', streakDays: 1, dueReviews: 0, nextLessonTitle: 'Colimação',
      goalCompletedToday: false, usualHour: 20, league: null, firedTodayAlready: false,
      preferences: { sequencia: true, revisao: true, aula: true, meta: true, liga: true },
    });
  });
  afterEach(() => { AppConfig.ENABLE_PERSONALIZED_NOTIFICATIONS = original; jest.useRealTimers(); });

  it('padrão desligado', () => {
    expect(original).toBe(false);
  });

  it('desligada (contraprova): o lembrete é o da 1.5.0, sem rota nem identificador', async () => {
    AppConfig.ENABLE_PERSONALIZED_NOTIFICATIONS = false;
    await PushService.scheduleDailyIfEligible({ reason: 'journey_focus' });
    expect(gather).not.toHaveBeenCalled();
    const [request] = notifications.scheduleNotificationAsync.mock.calls[0];
    expect(request.content.data).toEqual({ type: 'goal' });
    expect(request).not.toHaveProperty('identifier');
  });

  it('ligada: o texto e o horário vêm do contexto do aluno, e o toque leva à rota', async () => {
    AppConfig.ENABLE_PERSONALIZED_NOTIFICATIONS = true;
    await PushService.scheduleDailyIfEligible({ reason: 'journey_focus' });
    expect(spacedRepetition.getDueLessons).not.toHaveBeenCalled();
    expect(notifications.scheduleNotificationAsync).toHaveBeenCalledTimes(1);
    const [request] = notifications.scheduleNotificationAsync.mock.calls[0];
    expect(request).toMatchObject({ identifier: 'radiant.lembrete.personalizado', content: { title: 'Próxima aula: Colimação', data: { url: '/', kind: 'aula' } } });
    expect((request.trigger as { date: Date }).date).toEqual(new Date(2026, 10, 15, 20));
  });

  it('ligada e sem aceite: cancela e não agenda', async () => {
    AppConfig.ENABLE_PERSONALIZED_NOTIFICATIONS = true;
    await AsyncStorage.setItem('push.optin.v1', 'false');
    await PushService.scheduleDailyIfEligible({ reason: 'journey_focus' });
    expect(notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
    expect(notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });
});
