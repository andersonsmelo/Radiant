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
});
