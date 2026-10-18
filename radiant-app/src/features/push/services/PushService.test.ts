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
