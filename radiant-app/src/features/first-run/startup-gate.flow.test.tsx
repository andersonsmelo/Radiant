import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '../../test/renderWithProviders';
import RootLayout from '../../app/_layout';
import { BetaService } from '../beta/BetaService';
import { AuthService } from '../auth/AuthService';
import { LessonCatalogService } from '../content/services/LessonCatalogService';
import { SyncQueueService } from '../sync/SyncQueueService';
import { TelemetryService } from '../telemetry/TelemetryService';
import { FirstRunService } from './FirstRunService';

// O primeiro render deste arquivo monta a árvore inteira do _layout (fontes,
// splash screen, todos os bootstraps). Sob `--no-cache` isso paga o custo
// único de transformar módulos do react-native carregados sob demanda — o
// mesmo padrão documentado em HomeScreen.flow.test.tsx. A folga é ambiental,
// não uma espera por dado: todo mock abaixo é síncrono ou resolve no
// primeiro microtask.
const FIRST_RENDER_TIMEOUT_MS = 4000;

jest.mock('@expo-google-fonts/sora', () => ({
    useFonts: () => [true],
    Sora_400Regular: 'Sora_400Regular',
    Sora_500Medium: 'Sora_500Medium',
    Sora_600SemiBold: 'Sora_600SemiBold',
    Sora_700Bold: 'Sora_700Bold',
    Sora_800ExtraBold: 'Sora_800ExtraBold',
}));

jest.mock('expo-splash-screen', () => ({
    preventAutoHideAsync: jest.fn(() => Promise.resolve()),
    hideAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-router', () => {
    const ReactActual = require('react');
    const { Text } = require('react-native');
    // Só nos importa se o Stack (controle de acesso já liberado, presentação
    // já resolvida) chegou a ser montado — não a árvore real de rotas.
    function StackComponent() {
        return ReactActual.createElement(Text, { testID: 'stack-root' }, 'STACK');
    }
    function StackScreenStub() {
        return null;
    }
    StackComponent.Screen = StackScreenStub;
    return {
        router: { replace: jest.fn() },
        Stack: StackComponent,
    };
});

jest.mock('../../ui/accessibility/useReducedMotionPreference', () => ({
    useReducedMotionPreference: () => false,
}));

jest.mock('../telemetry/bootstrap', () => ({
    initializeObservability: jest.fn(),
    wrapRootWithObservability: (Component: unknown) => Component,
}));

jest.mock('../beta/BetaService', () => ({
    BetaService: { checkAccess: jest.fn(() => Promise.resolve(true)) },
}));

jest.mock('../auth/AuthService', () => ({
    AuthService: { bootstrap: jest.fn(() => Promise.resolve()) },
}));

jest.mock('../content/services/LessonCatalogService', () => ({
    LessonCatalogService: { bootstrap: jest.fn(() => Promise.resolve()) },
}));

jest.mock('../sync/SyncQueueService', () => ({
    SyncQueueService: { flush: jest.fn(() => Promise.resolve()) },
}));

jest.mock('../telemetry/TelemetryService', () => ({
    TelemetryService: {
        track: jest.fn(() => Promise.resolve()),
        captureError: jest.fn(() => Promise.resolve()),
    },
}));

jest.mock('./FirstRunService', () => ({
    FirstRunService: {
        bootstrap: jest.fn(() => Promise.resolve()),
        shouldShowWelcome: jest.fn(() => false),
        markStepViewed: jest.fn(),
        markSeen: jest.fn(() => Promise.resolve()),
    },
}));

// Dublê da apresentação real: ela já tem sua própria suíte
// (WelcomeFlowScreen.flow.test.tsx) cobrindo navegação entre telas, avisos e
// motivos de saída. Aqui só precisamos de um jeito de disparar `onFinish`
// para testar o que o _layout faz com o resultado — não repetir aquela
// cobertura.
jest.mock('./screens/WelcomeFlowScreen', () => {
    const ReactActual = require('react');
    const { Pressable, Text } = require('react-native');
    function WelcomeFlowScreenStub({ onFinish }: { onFinish: (reason: string, step: number) => void }) {
        return ReactActual.createElement(
            Pressable,
            { testID: 'welcome-finish', onPress: () => onFinish('completed', 3) },
            ReactActual.createElement(Text, null, 'WELCOME_STUB'),
        );
    }
    return {
        __esModule: true,
        default: WelcomeFlowScreenStub,
    };
});

describe('gate de abertura em RootLayout', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Baseline determinística: `clearAllMocks` zera as chamadas mas não
        // desfaz `mockReturnValue`/`mockResolvedValue` herdado de um teste
        // anterior. Reatribuir aqui evita que o cenário de um caso vaze para
        // o próximo (ex.: `shouldShowWelcome` continuar `true` no teste do
        // retry).
        (BetaService.checkAccess as jest.Mock).mockResolvedValue(true);
        (AuthService.bootstrap as jest.Mock).mockResolvedValue(undefined);
        (LessonCatalogService.bootstrap as jest.Mock).mockResolvedValue(undefined);
        (SyncQueueService.flush as jest.Mock).mockResolvedValue(undefined);
        (TelemetryService.track as jest.Mock).mockResolvedValue(undefined);
        (TelemetryService.captureError as jest.Mock).mockResolvedValue(undefined);
        (FirstRunService.bootstrap as jest.Mock).mockResolvedValue(undefined);
        (FirstRunService.shouldShowWelcome as jest.Mock).mockReturnValue(false);
        (FirstRunService.markSeen as jest.Mock).mockResolvedValue(undefined);
    });

    it('mostra a apresentação de boas-vindas em vez do Stack quando o beta gate está liberado e o primeiro uso ainda não foi visto', async () => {
        (FirstRunService.shouldShowWelcome as jest.Mock).mockReturnValue(true);

        renderWithProviders(<RootLayout />);

        expect(
            await screen.findByTestId('welcome-finish', {}, { timeout: FIRST_RENDER_TIMEOUT_MS }),
        ).toBeTruthy();
        expect(screen.queryByTestId('stack-root')).toBeNull();
    });

    it('ao concluir a apresentação, persiste a saída via FirstRunService.markSeen e libera o Stack', async () => {
        (FirstRunService.shouldShowWelcome as jest.Mock).mockReturnValue(true);

        renderWithProviders(<RootLayout />);

        const finishButton = await screen.findByTestId('welcome-finish', {}, { timeout: FIRST_RENDER_TIMEOUT_MS });
        fireEvent.press(finishButton);

        expect(FirstRunService.markSeen).toHaveBeenCalledWith('completed', 3);

        await waitFor(() => {
            expect(screen.getByTestId('stack-root')).toBeTruthy();
        });
        expect(screen.queryByTestId('welcome-finish')).toBeNull();
    });

    it('não chama FirstRunService.bootstrap() de novo quando o retry reexecuta o efeito de bootstrap', async () => {
        (AuthService.bootstrap as jest.Mock)
            .mockRejectedValueOnce(new Error('falha de rede'))
            .mockResolvedValue(undefined);

        renderWithProviders(<RootLayout />);

        const retryButton = await screen.findByText('Tentar novamente', {}, { timeout: FIRST_RENDER_TIMEOUT_MS });
        expect(FirstRunService.bootstrap).toHaveBeenCalledTimes(1);

        fireEvent.press(retryButton);

        await waitFor(() => {
            expect(screen.getByTestId('stack-root')).toBeTruthy();
        });

        expect(AuthService.bootstrap).toHaveBeenCalledTimes(2);
        expect(FirstRunService.bootstrap).toHaveBeenCalledTimes(1);
    });
});
