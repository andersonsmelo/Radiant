import { renderHook } from '@testing-library/react-native';
import { PushService } from '../../push/services/PushService';
import { TelemetryService } from '../TelemetryService';
import { useAppOpenLifecycle, __resetAppOpenForTests } from './useAppOpenLifecycle';

jest.mock('../TelemetryService', () => ({
    TelemetryService: {
        track: jest.fn().mockResolvedValue(undefined),
        markDayOpen: jest.fn().mockResolvedValue(undefined),
    },
}));

jest.mock('../../push/services/PushService', () => ({
    PushService: {
        onAppOpen: jest.fn().mockResolvedValue(undefined),
    },
}));

/**
 * Reencena um LANÇAMENTO DE PROCESSO. É o único jeito honesto de testar a
 * propriedade que interessa: a trava vive no módulo, então zerá-la é o
 * equivalente em teste a matar e reabrir o app.
 */
function relaunchProcess(): void {
    __resetAppOpenForTests();
}

describe('useAppOpenLifecycle', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        relaunchProcess();
    });

    it('emite app_open no lançamento do processo', () => {
        renderHook(() => useAppOpenLifecycle());

        expect(TelemetryService.track).toHaveBeenCalledTimes(1);
        expect(TelemetryService.track).toHaveBeenCalledWith('app_open');
    });

    it('marca o dia aberto, que é onde a coorte de instalação nasce', () => {
        // `markDayOpen()` é o único ponto que inicializa `cohort.installDate`.
        // Sem ele o `PaywallService` para em `missing_install_date` e D1/D7
        // nunca são medidos — por isso ele viaja junto do evento, não depois.
        renderHook(() => useAppOpenLifecycle());

        expect(TelemetryService.markDayOpen).toHaveBeenCalledTimes(1);
    });

    it('reseta o backoff de push na abertura', () => {
        renderHook(() => useAppOpenLifecycle());

        expect(PushService.onAppOpen).toHaveBeenCalledTimes(1);
    });

    it('não reemite quando o consumidor re-renderiza', () => {
        const { rerender } = renderHook(() => useAppOpenLifecycle());

        rerender({});
        rerender({});

        expect(TelemetryService.track).toHaveBeenCalledTimes(1);
        expect(TelemetryService.markDayOpen).toHaveBeenCalledTimes(1);
        expect(PushService.onAppOpen).toHaveBeenCalledTimes(1);
    });

    it('não reemite quando a home REMONTA dentro do mesmo processo', () => {
        // Esta é a propriedade que a versão anterior não tinha, e o defeito que
        // ela deixou passar. `LessonFlowScreen` e a tela de conquista fazem
        // `router.replace('/(tabs)')` ao concluir: a home remonta a cada lição
        // terminada. Contando por montagem, três lições numa sessão abriam o
        // gate de `MIN_APP_OPENS = 3` do `RatingPromptService` sem ninguém ter
        // aberto o app três vezes.
        renderHook(() => useAppOpenLifecycle()).unmount();
        renderHook(() => useAppOpenLifecycle()).unmount();
        renderHook(() => useAppOpenLifecycle());

        expect(TelemetryService.track).toHaveBeenCalledTimes(1);
        expect(TelemetryService.markDayOpen).toHaveBeenCalledTimes(1);
        expect(PushService.onAppOpen).toHaveBeenCalledTimes(1);
    });

    it('não reemite quando as duas homes montam o hook no mesmo processo', () => {
        // `HomeScreen` e `JourneyHomeScreen` consomem o mesmo hook. A trava é de
        // módulo justamente para que dois consumidores não virem duas aberturas.
        renderHook(() => useAppOpenLifecycle());
        renderHook(() => useAppOpenLifecycle());

        expect(TelemetryService.track).toHaveBeenCalledTimes(1);
    });

    it('conta uma abertura por LANÇAMENTO DE PROCESSO — N lançamentos, N eventos', () => {
        // É o que faz o `MIN_APP_OPENS = 3` do RatingPromptService ser
        // alcançável, e é o que o flow Maestro exercita: `rating-prompt.yaml`
        // faz três `launchApp`, e cada um é um processo novo.
        renderHook(() => useAppOpenLifecycle()).unmount();

        relaunchProcess();
        renderHook(() => useAppOpenLifecycle()).unmount();

        relaunchProcess();
        renderHook(() => useAppOpenLifecycle());

        expect(TelemetryService.track).toHaveBeenCalledTimes(3);
        expect(TelemetryService.markDayOpen).toHaveBeenCalledTimes(3);
        expect(PushService.onAppOpen).toHaveBeenCalledTimes(3);
    });
});
