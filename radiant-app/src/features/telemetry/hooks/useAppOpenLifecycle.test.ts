import { renderHook } from '@testing-library/react-native';
import { PushService } from '../../push/services/PushService';
import { TelemetryService } from '../TelemetryService';
import { useAppOpenLifecycle } from './useAppOpenLifecycle';

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

describe('useAppOpenLifecycle', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('emite app_open uma vez por montagem', () => {
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
        // A versão inline na home legada tinha callbacks de identidade instável
        // nas dependências do efeito. Cada mudança reemitia `app_open`, e a
        // contagem que libera o prompt de avaliação e o paywall subia sem que
        // ninguém tivesse aberto o app.
        const { rerender } = renderHook(() => useAppOpenLifecycle());

        rerender({});
        rerender({});

        expect(TelemetryService.track).toHaveBeenCalledTimes(1);
        expect(TelemetryService.markDayOpen).toHaveBeenCalledTimes(1);
        expect(PushService.onAppOpen).toHaveBeenCalledTimes(1);
    });

    it('conta uma abertura por montagem, que é a semântica que os gates leem', () => {
        // Três montagens = três `app_open`. É o que faz o `MIN_APP_OPENS = 3`
        // do RatingPromptService ser alcançável, e o que o flow Maestro
        // exercita com três relaunches.
        renderHook(() => useAppOpenLifecycle()).unmount();
        renderHook(() => useAppOpenLifecycle()).unmount();
        renderHook(() => useAppOpenLifecycle());

        expect(TelemetryService.track).toHaveBeenCalledTimes(3);
    });
});
