import AsyncStorage from '@react-native-async-storage/async-storage';
import { DAILY_GOAL_STORAGE_KEY } from '../../../constants/dailyGoal';
import { DailyGoalService } from './DailyGoalService';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

const mockedStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('DailyGoalService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('persiste o reset quando a leitura encontra o progresso de um dia anterior', async () => {
    mockedStorage.getItem.mockResolvedValue(JSON.stringify({
      dateKey: '2026-08-12',
      completedToday: 20,
      goalPerDay: 20,
      tierId: 'rhythm',
    }));

    const snapshot = await DailyGoalService.getSnapshot(new Date('2026-08-13T09:00:00'));

    expect(snapshot).toMatchObject({
      dateKey: '2026-08-13',
      earnedXpToday: 0,
      goalXp: 20,
      tierId: 'rhythm',
      isCompleted: false,
    });
    expect(mockedStorage.setItem).toHaveBeenCalledWith(
      DAILY_GOAL_STORAGE_KEY,
      expect.stringContaining('"dateKey":"2026-08-13"'),
    );
  });

  describe('schema desconhecido (G7)', () => {
    // Gravado por uma versão mais nova do app, que passou a versionar a meta.
    // Esta versão nunca gravou `schemaVersion`, então não conhece nenhuma: usa
    // os campos que entende, em memória, e não regrava o que não entende.
    const futuro = (dateKey: string) => JSON.stringify({
      schemaVersion: 2,
      dateKey,
      completedToday: 5,
      goalPerDay: 20,
      tierId: 'rhythm',
      campoNovo: true,
    });

    it('getSnapshot na virada do dia não grava por cima', async () => {
      mockedStorage.getItem.mockResolvedValue(futuro('2026-08-12'));

      const snapshot = await DailyGoalService.getSnapshot(new Date('2026-08-13T09:00:00'));

      expect(snapshot).toMatchObject({ dateKey: '2026-08-13', earnedXpToday: 0, goalXp: 20 });
      expect(mockedStorage.setItem).not.toHaveBeenCalled();
    });

    it('recordXp soma em memória e não grava por cima', async () => {
      mockedStorage.getItem.mockResolvedValue(futuro('2026-08-13'));

      const snapshot = await DailyGoalService.recordXp(10, new Date('2026-08-13T09:00:00'));

      expect(snapshot).toMatchObject({ earnedXpToday: 15, goalXp: 20 });
      expect(mockedStorage.setItem).not.toHaveBeenCalled();
    });
  });
});
