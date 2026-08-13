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
    OnboardingService: {
        init: jest.fn().mockResolvedValue(undefined),
        dismissIntro: jest.fn().mockResolvedValue(undefined),
    },
}));

const mockedStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const telemetryTrack = TelemetryService.track as jest.MockedFunction<typeof TelemetryService.track>;
const onboardingInit = OnboardingService.init as jest.MockedFunction<typeof OnboardingService.init>;
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
    });

    it('bootstrap() NÃO emite first_run_started: ler o disco não é começar o primeiro uso', async () => {
        // O bootstrap roda antes de o beta gate ser avaliado. Emitir ali fazia
        // quem e barrado gerar um `started` sem nenhum `step_viewed`, inflando o
        // topo do funil. O evento agora sai quando a apresentacao e de fato
        // vista — o que so acontece depois do gate.
        await FirstRunService.bootstrap();

        expect(
            telemetryTrack.mock.calls.filter(([event]) => event === 'first_run_started')
        ).toHaveLength(0);
    });

    it('first_run_started sai na primeira tela vista, uma vez só, e antes do step_viewed', async () => {
        await FirstRunService.bootstrap();

        FirstRunService.markStepViewed(1);
        FirstRunService.markStepViewed(2);
        FirstRunService.markStepViewed(3);

        const events = telemetryTrack.mock.calls.map(([event]) => event);
        expect(events.filter((e) => e === 'first_run_started')).toHaveLength(1);
        expect(events.indexOf('first_run_started')).toBeLessThan(
            events.indexOf('first_run_step_viewed')
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

    it('inicializa o onboarding antes de dispensar o card Day-0, numa instalação limpa', async () => {
        // Instalação limpa: nem a chave do first-run nem a do onboarding existem.
        mockedStorage.getItem.mockResolvedValue(null);

        await FirstRunService.bootstrap();
        await FirstRunService.markSeen('completed', 3);

        // dismissIntro() grava o state do OnboardingService direto em disco. Se
        // init() não rodar antes, essa gravação parte do DEFAULT_STATE
        // (startedAt: null) e sequestra o "first launch ever" para sempre.
        expect(onboardingInit).toHaveBeenCalledTimes(1);
        expect(dismissIntro).toHaveBeenCalledTimes(1);
        expect(onboardingInit.mock.invocationCallOrder[0]).toBeLessThan(
            dismissIntro.mock.invocationCallOrder[0]
        );
    });

    it('a chave nova é o único gatilho: instalação antiga com onboarding gravado ainda vê a apresentação', async () => {
        // Instalação antiga: o onboarding já rodou e tem estado no disco; só a
        // chave do first-run é que nunca existiu. O que este caso prova é o
        // gatilho — que a decisão olha `@radiant/first_run_v1` e nada mais.
        //
        // Ele NÃO prova que o startedAt do onboarding sobrevive: o
        // OnboardingService está mockado neste arquivo, então o efeito em disco
        // não é observável daqui. Essa prova, com controle negativo, vive em
        // OnboardingService.test.ts; o par com o caso de ordem acima é o que
        // fecha a garantia.
        mockedStorage.getItem.mockImplementation(async (key: string) => {
            if (key === '@radiant/onboarding') {
                return JSON.stringify({
                    startedAt: 1700000000000,
                    dismissedIntro: false,
                    firstQuizAt: null,
                    firstReviewAt: null,
                    completed: false,
                });
            }
            return null;
        });

        await FirstRunService.bootstrap();

        expect(mockedStorage.getItem).toHaveBeenCalledWith('@radiant/first_run_v1');
        expect(FirstRunService.shouldShowWelcome()).toBe(true);
    });

    it('não mostra quando a chave já existe com saída registrada', async () => {
        mockedStorage.getItem.mockResolvedValue(
            JSON.stringify({ seenAt: 1, exitedAt: 2, exitReason: 'skipped', exitStep: 2 })
        );

        await FirstRunService.bootstrap();

        expect(FirstRunService.shouldShowWelcome()).toBe(false);
    });

    it('dois bootstrap() concorrentes leem o disco uma vez só', async () => {
        // A guarda `initialized` sozinha nao cobre concorrencia: ela e checada
        // antes do await, entao duas chamadas paralelas passam as duas. Hoje o
        // unico call site e protegido pelo useRef do _layout — este teste prende
        // a garantia no servico, que e onde ela precisa morar se aparecer um
        // segundo call site.
        mockedStorage.getItem.mockImplementation(
            () => new Promise((resolve) => setTimeout(() => resolve(null), 10))
        );

        await Promise.all([FirstRunService.bootstrap(), FirstRunService.bootstrap()]);

        expect(mockedStorage.getItem).toHaveBeenCalledTimes(1);
    });

    it('não propaga falha de gravação em markSeen(), e ainda dispensa o card Day-0', async () => {
        // O erro ja era engolido de proposito — o pior caso e a apresentacao
        // voltar uma vez. O que faltava era prender que engolir NAO aborta o
        // resto do metodo: sem isso, uma futura reordenacao poderia deixar o
        // onboarding sem init/dismiss quando o disco falha.
        await FirstRunService.bootstrap();
        mockedStorage.setItem.mockRejectedValueOnce(new Error('disco cheio'));

        await expect(FirstRunService.markSeen('skipped', 2)).resolves.toBeUndefined();

        expect(OnboardingService.init).toHaveBeenCalled();
        expect(OnboardingService.dismissIntro).toHaveBeenCalled();
        expect(telemetryTrack).toHaveBeenCalledWith(
            'first_run_skipped',
            expect.objectContaining({ step: 2 })
        );
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
