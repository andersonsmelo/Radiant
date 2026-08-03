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

  // Os dois casos abaixo são um par: efeito e controle negativo. Existem por
  // causa de um defeito real — o FirstRunService chamava dismissIntro() sem
  // init(), e a gravação partia do estado em memória, sequestrando o
  // "first launch ever" para sempre. Sem o controle negativo, o primeiro caso
  // passaria mesmo se dismissIntro() nunca lesse o disco.
  it('preserva o startedAt gravado quando init() roda antes de dismissIntro()', async () => {
    mockedStorage.getItem.mockResolvedValue(
      JSON.stringify({
        startedAt: 1700000000000,
        dismissedIntro: false,
        firstQuizAt: null,
        firstReviewAt: null,
        completed: false,
      })
    );

    await OnboardingService.init();
    await OnboardingService.dismissIntro();

    const lastWrite = mockedStorage.setItem.mock.calls.at(-1);
    expect(lastWrite?.[0]).toBe('@radiant/onboarding');
    expect(JSON.parse(String(lastWrite?.[1]))).toMatchObject({
      startedAt: 1700000000000,
      dismissedIntro: true,
    });
  });

  it('controle negativo: sem init() antes, dismissIntro() grava a memória por cima do disco', async () => {
    // O disco tem um startedAt; a memória tem outro. dismissIntro() é
    // write-through sem leitura, então o valor do disco é perdido — é
    // exatamente o que acontecia em instalação limpa, onde a memória era o
    // DEFAULT_STATE com startedAt null.
    mockedStorage.getItem.mockResolvedValue(
      JSON.stringify({
        startedAt: 1700000000000,
        dismissedIntro: false,
        firstQuizAt: null,
        firstReviewAt: null,
        completed: false,
      })
    );

    await OnboardingService.dismissIntro();

    const lastWrite = mockedStorage.setItem.mock.calls.at(-1);
    expect(JSON.parse(String(lastWrite?.[1])).startedAt).not.toBe(1700000000000);
  });
});
