import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingService } from './OnboardingService';
import { TelemetryService } from '../telemetry/TelemetryService';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('../telemetry/TelemetryService', () => ({
  TelemetryService: {
    track: jest.fn(),
  },
}));

const mockedStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const telemetryTrack = TelemetryService.track as jest.MockedFunction<typeof TelemetryService.track>;

describe('OnboardingService', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    mockedStorage.getItem.mockResolvedValue(null);
    mockedStorage.setItem.mockResolvedValue();
    mockedStorage.removeItem.mockResolvedValue();
    await OnboardingService.reset();
    telemetryTrack.mockClear();
  });

  it('emits first value moment only once on the first meaningful action', async () => {
    await OnboardingService.markAction('quiz_complete');
    await OnboardingService.markAction('review_complete');

    expect(telemetryTrack).toHaveBeenCalledWith(
      'first_value_moment_reached',
      expect.objectContaining({
        action: 'quiz_complete',
        entry_surface: 'onboarding',
        build_channel: expect.any(String),
      })
    );
    expect(
      telemetryTrack.mock.calls.filter(([eventName]) => eventName === 'first_value_moment_reached')
    ).toHaveLength(1);
  });
});
