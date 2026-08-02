import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirstRunService } from './FirstRunService';
import { TelemetryService } from '../telemetry/TelemetryService';
import { OnboardingService } from '../onboarding/OnboardingService';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
}));

jest.mock('../telemetry/TelemetryService', () => ({
    TelemetryService: { track: jest.fn() },
}));

jest.mock('../onboarding/OnboardingService', () => ({
    OnboardingService: { dismissIntro: jest.fn().mockResolvedValue(undefined) },
}));

const mockedStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const telemetryTrack = TelemetryService.track as jest.MockedFunction<typeof TelemetryService.track>;
const dismissIntro = OnboardingService.dismissIntro as jest.MockedFunction<
    typeof OnboardingService.dismissIntro
>;

describe('FirstRunService', () => {
    beforeEach(async () => {
        jest.clearAllMocks();
        mockedStorage.getItem.mockResolvedValue(null);
        mockedStorage.setItem.mockResolvedValue();
        mockedStorage.removeItem.mockResolvedValue();
        await FirstRunService.resetForTests();
    });

    it('mostra a apresentação quando a chave não existe', async () => {
        await FirstRunService.bootstrap();

        expect(FirstRunService.shouldShowWelcome()).toBe(true);
        expect(telemetryTrack).toHaveBeenCalledWith(
            'first_run_started',
            expect.objectContaining({ entry_surface: 'first_run' })
        );
    });

    it('não mostra de novo depois de concluir', async () => {
        await FirstRunService.bootstrap();
        await FirstRunService.markSeen('completed', 3);

        expect(FirstRunService.shouldShowWelcome()).toBe(false);
        expect(mockedStorage.setItem).toHaveBeenCalledWith(
            '@radiant/first_run_v1',
            expect.stringContaining('"exitReason":"completed"')
        );
        expect(telemetryTrack).toHaveBeenCalledWith(
            'first_run_completed',
            expect.objectContaining({ step: 3 })
        );
    });

    it('não mostra de novo depois de pular, e registra o passo', async () => {
        await FirstRunService.bootstrap();
        await FirstRunService.markSeen('skipped', 1);

        expect(FirstRunService.shouldShowWelcome()).toBe(false);
        expect(telemetryTrack).toHaveBeenCalledWith(
            'first_run_skipped',
            expect.objectContaining({ step: 1 })
        );
    });

    it('dispensa o card Day-0 ao sair, para não dar boas-vindas duas vezes', async () => {
        await FirstRunService.bootstrap();
        await FirstRunService.markSeen('completed', 3);

        expect(dismissIntro).toHaveBeenCalledTimes(1);
    });

    it('mostra uma vez para instalação antiga, que não tem a chave nova', async () => {
        mockedStorage.getItem.mockResolvedValue(null);

        await FirstRunService.bootstrap();

        expect(FirstRunService.shouldShowWelcome()).toBe(true);
    });

    it('não mostra quando a chave já existe com saída registrada', async () => {
        mockedStorage.getItem.mockResolvedValue(
            JSON.stringify({ seenAt: 1, exitedAt: 2, exitReason: 'skipped', exitStep: 2 })
        );

        await FirstRunService.bootstrap();

        expect(FirstRunService.shouldShowWelcome()).toBe(false);
    });

    it('não trava a abertura quando a leitura do armazenamento falha', async () => {
        mockedStorage.getItem.mockRejectedValue(new Error('storage indisponível'));

        await expect(FirstRunService.bootstrap()).resolves.toBeUndefined();
        expect(FirstRunService.shouldShowWelcome()).toBe(true);
    });

    it('emite um evento por tela vista', async () => {
        await FirstRunService.bootstrap();
        FirstRunService.markStepViewed(2);

        expect(telemetryTrack).toHaveBeenCalledWith(
            'first_run_step_viewed',
            expect.objectContaining({ step: 2 })
        );
    });
});
