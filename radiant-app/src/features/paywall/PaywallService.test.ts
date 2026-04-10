import AsyncStorage from '@react-native-async-storage/async-storage';
import { PaywallService } from './PaywallService';
import { SyncQueueService } from '../sync/SyncQueueService';
import { TelemetryService } from '../telemetry/TelemetryService';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('../../config', () => ({
  AppConfig: {
    APP_ENV: 'preview',
    ENABLE_PAYWALL: true,
  },
}));

jest.mock('../sync/SyncQueueService', () => ({
  SyncQueueService: {
    getSummary: jest.fn().mockResolvedValue({
      pending: 0,
      retrying: 0,
      lastError: null,
      oldestPendingAt: null,
    }),
  },
}));

jest.mock('../telemetry/TelemetryService', () => ({
  TelemetryService: {
    track: jest.fn().mockResolvedValue(undefined),
    hasEvent: jest.fn().mockResolvedValue(true),
    countEvents: jest.fn().mockResolvedValue(5),
    getInstallDate: jest.fn().mockResolvedValue('2026-03-01'),
  },
}));

const mockedStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const mockedSyncQueueService = SyncQueueService as jest.Mocked<typeof SyncQueueService>;
const mockedTelemetryService = TelemetryService as jest.Mocked<typeof TelemetryService>;

describe('PaywallService', () => {
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
    mockedTelemetryService.countEvents.mockResolvedValue(5);
    mockedTelemetryService.getInstallDate.mockResolvedValue('2026-03-01');
    await PaywallService.reset();
  });

  it('returns an offer when the session is eligible', async () => {
    const offer = await PaywallService.maybePresentOffer({
      trigger: 'reward_complete',
      entrySurface: 'reward',
      lessonId: 'reward-1',
    });

    expect(offer).toEqual(
      expect.objectContaining({
        offerId: 'monthly_plus',
        trigger: 'reward_complete',
      })
    );
    expect(mockedTelemetryService.track).toHaveBeenCalledWith(
      'paywall_view',
      expect.objectContaining({
        offer_id: 'monthly_plus',
      })
    );
  });

  it('records a blocked outcome when sync health is degraded', async () => {
    mockedSyncQueueService.getSummary.mockResolvedValue({
      pending: 1,
      retrying: 1,
      lastError: 'temporary upstream failure',
      oldestPendingAt: null,
    });

    const offer = await PaywallService.maybePresentOffer({
      trigger: 'reward_complete',
      entrySurface: 'reward',
      lessonId: 'reward-1',
    });

    expect(offer).toBeNull();
    expect(mockedTelemetryService.track).toHaveBeenCalledWith(
      'paywall_outcome',
      expect.objectContaining({
        outcome: 'blocked',
        reason: 'sync_error_present',
      })
    );
  });
});
