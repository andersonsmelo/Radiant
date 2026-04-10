import AsyncStorage from '@react-native-async-storage/async-storage';
import { RatingPromptService } from './RatingPromptService';
import { SyncQueueService } from '../features/sync/SyncQueueService';
import { TelemetryService } from '../features/telemetry/TelemetryService';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('expo-store-review', () => ({
  hasAction: jest.fn(() => true),
  isAvailableAsync: jest.fn().mockResolvedValue(true),
  requestReview: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../config', () => ({
  AppConfig: {
    APP_ENV: 'production',
    ENABLE_REVIEW: true,
  },
}));

jest.mock('../features/sync/SyncQueueService', () => ({
  SyncQueueService: {
    getSummary: jest.fn().mockResolvedValue({
      pending: 0,
      retrying: 0,
      lastError: null,
      oldestPendingAt: null,
    }),
  },
}));

jest.mock('../features/telemetry/TelemetryService', () => ({
  TelemetryService: {
    track: jest.fn().mockResolvedValue(undefined),
    hasEvent: jest.fn().mockResolvedValue(true),
    countEvents: jest.fn().mockResolvedValue(3),
  },
}));

const mockedStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const mockedSyncQueueService = SyncQueueService as jest.Mocked<typeof SyncQueueService>;
const mockedTelemetryService = TelemetryService as jest.Mocked<typeof TelemetryService>;

describe('RatingPromptService', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    mockedStorage.getItem.mockResolvedValue(null);
    mockedStorage.setItem.mockResolvedValue();
    mockedStorage.removeItem.mockResolvedValue();
    mockedSyncQueueService.getSummary.mockResolvedValue({
      pending: 0,
      retrying: 0,
      lastError: null,
      oldestPendingAt: null,
    });
    mockedTelemetryService.hasEvent.mockResolvedValue(true);
    mockedTelemetryService.countEvents.mockResolvedValue(3);
    await RatingPromptService.reset();
  });

  it('shows the rating prompt when the session is eligible', async () => {
    const shown = await RatingPromptService.maybePromptForReview({
      trigger: 'reward_complete',
      entrySurface: 'reward',
      lessonId: 'reward-1',
    });

    expect(shown).toBe(true);
    expect(mockedTelemetryService.track).toHaveBeenCalledWith(
      'rating_prompt_eligible',
      expect.objectContaining({
        trigger: 'reward_complete',
        entry_surface: 'reward',
      })
    );
    expect(mockedTelemetryService.track).toHaveBeenCalledWith(
      'rating_prompt_shown',
      expect.objectContaining({
        trigger: 'reward_complete',
      })
    );
  });

  it('blocks the prompt when sync health is degraded', async () => {
    mockedSyncQueueService.getSummary.mockResolvedValue({
      pending: 1,
      retrying: 1,
      lastError: 'temporary upstream failure',
      oldestPendingAt: null,
    });

    const shown = await RatingPromptService.maybePromptForReview({
      trigger: 'quiz_complete',
      entrySurface: 'quiz_summary',
      lessonId: 'lesson-1',
      scorePercentage: 90,
    });

    expect(shown).toBe(false);
    expect(mockedTelemetryService.track).toHaveBeenCalledWith(
      'rating_prompt_blocked',
      expect.objectContaining({
        reason: 'sync_error_present',
      })
    );
  });
});
