import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { renderWithProviders } from '../../test/renderWithProviders';
import RootLayout from '../../app/_layout';
import { AppConfig } from '../../config';
import { BetaService } from '../beta/BetaService';
import { AuthService } from '../auth/AuthService';
import { LessonCatalogService } from '../content/services/LessonCatalogService';
import { SyncQueueService } from '../sync/SyncQueueService';
import { TelemetryService } from '../telemetry/TelemetryService';
import { JourneyProgressService } from '../journey/services/JourneyProgressService';
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

// `__DEV__` é sempre `true` sob jest-expo, então `AppConfig.SHOW_DEV_TOOLS`
// real é sempre `true` e `shouldEnforceBetaGate` real nunca fica `true` na
// suíte — o ramo do beta gate ficaria estruturalmente inalcançável. Mockar o
// módulo de config inteiro (só os dois campos que `_layout.tsx` lê) é o que
// permite construir os dois estados de propósito.
jest.mock('../../config', () => ({
  AppConfig: { ENABLE_BETA_GATE: false, SHOW_DEV_TOOLS: true },
}));

jest.mock('../beta/BetaService', () => ({
  BetaService: { checkAccess: jest.fn(() => Promise.resolve(true)) },
}));

// Dublê do gate: o que importa aqui é só se ele chegou a ser montado, não a
// UI real de código de convite — essa tem sua própria cobertura.
jest.mock('../beta/screens/BetaGateScreen', () => {
  const ReactActual = require('react');
  const { Text } = require('react-native');
  function BetaGateScreenStub() {
    return ReactActual.createElement(Text, { testID: 'beta-gate' }, 'BETA_GATE_STUB');
  }
  return { __esModule: true, default: BetaGateScreenStub };
});

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

jest.mock('../journey/services/JourneyProgressService', () => ({
  JourneyProgressService: {
    bootstrap: jest.fn(() => Promise.resolve()),
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
  const { Pressable, Text, View } = require('react-native');
  function WelcomeFlowScreenStub({ onFinish }: { onFinish: (reason: string, step: number) => void }) {
    return ReactActual.createElement(
      View,
      null,
      ReactActual.createElement(
        Pressable,
        { testID: 'welcome-finish', onPress: () => onFinish('completed', 3) },
        ReactActual.createElement(Text, null, 'WELCOME_STUB'),
      ),
      ReactActual.createElement(
        Pressable,
        { testID: 'welcome-skip', onPress: () => onFinish('skipped', 1) },
        ReactActual.createElement(Text, null, 'SKIP_STUB'),
      ),
    );
  }
  return {
    __esModule: true,
    default: WelcomeFlowScreenStub,
  };
});

const LESSON_NODE = {
  id: 'node:lesson-1',
  unitId: 'unit-1',
  type: 'lesson',
  title: 'Primeira lição',
  blockId: 'block:lesson-1:intro',
  status: 'available',
} as const;

function snapshotWith(nextRecommendedNode: unknown) {
  return { nextRecommendedNode } as Awaited<ReturnType<typeof JourneyProgressService.bootstrap>>;
}

describe('gate de abertura em RootLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Baseline determinística: `clearAllMocks` zera as chamadas mas não
    // desfaz `mockReturnValue`/`mockResolvedValue`/atribuições diretas
    // herdadas de um teste anterior. Reatribuir aqui evita que o cenário de
    // um caso vaze para o próximo (ex.: `shouldShowWelcome` continuar `true`,
    // ou o beta gate continuar reforçado, num teste que não pediu isso).
    AppConfig.ENABLE_BETA_GATE = false;
    AppConfig.SHOW_DEV_TOOLS = true;
    (BetaService.checkAccess as jest.Mock).mockResolvedValue(true);
    (AuthService.bootstrap as jest.Mock).mockResolvedValue(undefined);
    (LessonCatalogService.bootstrap as jest.Mock).mockResolvedValue(undefined);
    (SyncQueueService.flush as jest.Mock).mockResolvedValue(undefined);
    (TelemetryService.track as jest.Mock).mockResolvedValue(undefined);
    (TelemetryService.captureError as jest.Mock).mockResolvedValue(undefined);
    (FirstRunService.bootstrap as jest.Mock).mockResolvedValue(undefined);
    (FirstRunService.shouldShowWelcome as jest.Mock).mockReturnValue(false);
    (FirstRunService.markSeen as jest.Mock).mockResolvedValue(undefined);
    (JourneyProgressService.bootstrap as jest.Mock).mockResolvedValue(snapshotWith(LESSON_NODE));
    (router.replace as jest.Mock).mockImplementation(() => undefined);
  });

  it('mostra a apresentação de boas-vindas em vez do Stack quando o beta gate está desativado e o primeiro uso ainda não foi visto', async () => {
    (FirstRunService.shouldShowWelcome as jest.Mock).mockReturnValue(true);

    renderWithProviders(<RootLayout />);

    expect(
      await screen.findByTestId('welcome-finish', {}, { timeout: FIRST_RENDER_TIMEOUT_MS }),
    ).toBeTruthy();
    expect(screen.queryByTestId('stack-root')).toBeNull();
  });

  it('ao concluir, persiste a saída, monta o Stack e abre o próximo nó elegível', async () => {
    (FirstRunService.shouldShowWelcome as jest.Mock).mockReturnValue(true);
    (router.replace as jest.Mock).mockImplementation(() => {
      expect(screen.getByTestId('stack-root')).toBeTruthy();
    });

    renderWithProviders(<RootLayout />);

    const finishButton = await screen.findByTestId('welcome-finish', {}, { timeout: FIRST_RENDER_TIMEOUT_MS });
    fireEvent.press(finishButton);

    expect(FirstRunService.markSeen).toHaveBeenCalledWith('completed', 3);

    await waitFor(() => {
      expect(screen.getByTestId('stack-root')).toBeTruthy();
    });
    expect(screen.queryByTestId('welcome-finish')).toBeNull();
    expect(JourneyProgressService.bootstrap).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenCalledWith({
      pathname: '/learn',
      params: {
        nodeId: 'node:lesson-1',
        blockId: 'block:lesson-1:intro',
      },
    });
  });

  it('aguarda markSeen antes de consultar a jornada ou navegar', async () => {
    (FirstRunService.shouldShowWelcome as jest.Mock).mockReturnValue(true);
    let releaseMarkSeen: (() => void) | undefined;
    (FirstRunService.markSeen as jest.Mock).mockReturnValue(
      new Promise<void>((resolve) => {
        releaseMarkSeen = resolve;
      }),
    );

    renderWithProviders(<RootLayout />);

    fireEvent.press(
      await screen.findByTestId('welcome-finish', {}, { timeout: FIRST_RENDER_TIMEOUT_MS }),
    );

    expect(JourneyProgressService.bootstrap).not.toHaveBeenCalled();
    expect(router.replace).not.toHaveBeenCalled();
    expect(screen.queryByTestId('stack-root')).toBeNull();

    releaseMarkSeen?.();

    await waitFor(() => expect(router.replace).toHaveBeenCalledTimes(1));
  });

  it('Pular persiste a saída e abre a Home sem consultar a jornada', async () => {
    (FirstRunService.shouldShowWelcome as jest.Mock).mockReturnValue(true);

    renderWithProviders(<RootLayout />);

    fireEvent.press(
      await screen.findByTestId('welcome-skip', {}, { timeout: FIRST_RENDER_TIMEOUT_MS }),
    );

    await waitFor(() => expect(screen.getByTestId('stack-root')).toBeTruthy());
    expect(FirstRunService.markSeen).toHaveBeenCalledWith('skipped', 1);
    expect(JourneyProgressService.bootstrap).not.toHaveBeenCalled();
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('recusa toque duplo enquanto a saída está em voo', async () => {
    (FirstRunService.shouldShowWelcome as jest.Mock).mockReturnValue(true);
    let releaseMarkSeen: (() => void) | undefined;
    (FirstRunService.markSeen as jest.Mock).mockReturnValue(
      new Promise<void>((resolve) => {
        releaseMarkSeen = resolve;
      }),
    );

    renderWithProviders(<RootLayout />);

    const finishButton = await screen.findByTestId(
      'welcome-finish',
      {},
      { timeout: FIRST_RENDER_TIMEOUT_MS },
    );
    fireEvent.press(finishButton);
    fireEvent.press(finishButton);

    expect(FirstRunService.markSeen).toHaveBeenCalledTimes(1);

    releaseMarkSeen?.();
    await waitFor(() => expect(router.replace).toHaveBeenCalledTimes(1));
  });

  it('cai na Home quando não existe próximo nó navegável', async () => {
    (FirstRunService.shouldShowWelcome as jest.Mock).mockReturnValue(true);
    (JourneyProgressService.bootstrap as jest.Mock).mockResolvedValue(snapshotWith(null));

    renderWithProviders(<RootLayout />);

    fireEvent.press(
      await screen.findByTestId('welcome-finish', {}, { timeout: FIRST_RENDER_TIMEOUT_MS }),
    );

    await waitFor(() => expect(screen.getByTestId('stack-root')).toBeTruthy());
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('cai na Home quando a recomendação existe mas ainda está bloqueada', async () => {
    (FirstRunService.shouldShowWelcome as jest.Mock).mockReturnValue(true);
    (JourneyProgressService.bootstrap as jest.Mock).mockResolvedValue(
      snapshotWith({ ...LESSON_NODE, status: 'locked' }),
    );

    renderWithProviders(<RootLayout />);

    fireEvent.press(
      await screen.findByTestId('welcome-finish', {}, { timeout: FIRST_RENDER_TIMEOUT_MS }),
    );

    await waitFor(() => expect(screen.getByTestId('stack-root')).toBeTruthy());
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('cai na Home e registra a falha quando a jornada não carrega', async () => {
    (FirstRunService.shouldShowWelcome as jest.Mock).mockReturnValue(true);
    (JourneyProgressService.bootstrap as jest.Mock).mockRejectedValue(
      new Error('jornada indisponível'),
    );
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    renderWithProviders(<RootLayout />);

    fireEvent.press(
      await screen.findByTestId('welcome-finish', {}, { timeout: FIRST_RENDER_TIMEOUT_MS }),
    );

    await waitFor(() => expect(screen.getByTestId('stack-root')).toBeTruthy());
    expect(router.replace).not.toHaveBeenCalled();
    expect(TelemetryService.captureError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ phase: 'first_run_exit', reason: 'completed' }),
    );

    consoleError.mockRestore();
  });

  it('preserva uma revisão recomendada em instalação que já tinha progresso', async () => {
    (FirstRunService.shouldShowWelcome as jest.Mock).mockReturnValue(true);
    (JourneyProgressService.bootstrap as jest.Mock).mockResolvedValue(
      snapshotWith({
        ...LESSON_NODE,
        id: 'node:review:lesson-1',
        type: 'review',
        title: 'Revisar primeira lição',
        blockId: 'block:review:lesson-1',
        status: 'due-review',
      }),
    );

    renderWithProviders(<RootLayout />);

    fireEvent.press(
      await screen.findByTestId('welcome-finish', {}, { timeout: FIRST_RENDER_TIMEOUT_MS }),
    );

    await waitFor(() =>
      expect(router.replace).toHaveBeenCalledWith({
        pathname: '/learn',
        params: {
          nodeId: 'node:review:lesson-1',
          blockId: 'block:review:lesson-1',
        },
      }),
    );
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

  it('o beta gate tem precedência sobre a apresentação: acesso negado mostra o gate, não a apresentação, mesmo com o primeiro uso pendente', async () => {
    AppConfig.ENABLE_BETA_GATE = true;
    AppConfig.SHOW_DEV_TOOLS = false;
    (BetaService.checkAccess as jest.Mock).mockResolvedValue(false);
    (FirstRunService.shouldShowWelcome as jest.Mock).mockReturnValue(true);

    renderWithProviders(<RootLayout />);

    expect(
      await screen.findByTestId('beta-gate', {}, { timeout: FIRST_RENDER_TIMEOUT_MS }),
    ).toBeTruthy();
    expect(screen.queryByTestId('welcome-finish')).toBeNull();
    expect(screen.queryByTestId('stack-root')).toBeNull();

    // O topo do funil não pode existir para quem foi barrado. `first_run_started`
    // viaja junto do primeiro `markStepViewed()` justamente para herdar esta
    // garantia: nenhum passo visto, nenhum `started`.
    expect(FirstRunService.markStepViewed).not.toHaveBeenCalled();
  });

  it('dev tools desarmam o gate mesmo com ENABLE_BETA_GATE ligado — e é essa a combinação de todos os perfis do eas.json', async () => {
    // `shouldEnforceBetaGate = ENABLE_BETA_GATE && !SHOW_DEV_TOOLS`. Os dois
    // lados ja tinham caso proprio; faltava o `&&`. Nao e hipotetico: medido em
    // 2026-08-03, os dois perfis do `eas.json` que ligam o gate ligam TAMBEM o
    // DEV_TOOLS, entao nenhum perfil aplica o gate. Este teste prende esse fato
    // — se um perfil futuro quiser barrar de verdade, ele precisa desligar as
    // dev tools, e e aqui que isso fica dito.
    AppConfig.ENABLE_BETA_GATE = true;
    AppConfig.SHOW_DEV_TOOLS = true;
    (BetaService.checkAccess as jest.Mock).mockResolvedValue(false);
    (FirstRunService.shouldShowWelcome as jest.Mock).mockReturnValue(true);

    renderWithProviders(<RootLayout />);

    expect(
      await screen.findByTestId('welcome-finish', {}, { timeout: FIRST_RENDER_TIMEOUT_MS }),
    ).toBeTruthy();
    expect(screen.queryByTestId('beta-gate')).toBeNull();
    expect(BetaService.checkAccess).not.toHaveBeenCalled();
  });

  it('uma vez liberado o acesso ao beta, a apresentação aparece no lugar do gate', async () => {
    AppConfig.ENABLE_BETA_GATE = true;
    AppConfig.SHOW_DEV_TOOLS = false;
    (BetaService.checkAccess as jest.Mock).mockResolvedValue(true);
    (FirstRunService.shouldShowWelcome as jest.Mock).mockReturnValue(true);

    renderWithProviders(<RootLayout />);

    expect(
      await screen.findByTestId('welcome-finish', {}, { timeout: FIRST_RENDER_TIMEOUT_MS }),
    ).toBeTruthy();
    expect(screen.queryByTestId('beta-gate')).toBeNull();
  });

  it('retry chama FirstRunService.bootstrap() de novo depois de uma falha e consegue completar — a promise rejeitada não fica presa no ref', async () => {
    (FirstRunService.bootstrap as jest.Mock)
      .mockRejectedValueOnce(new Error('falha ao ler o estado do primeiro uso'))
      .mockResolvedValue(undefined);

    renderWithProviders(<RootLayout />);

    const retryButton = await screen.findByText('Tentar novamente', {}, { timeout: FIRST_RENDER_TIMEOUT_MS });
    expect(FirstRunService.bootstrap).toHaveBeenCalledTimes(1);

    fireEvent.press(retryButton);

    await waitFor(() => {
      expect(screen.getByTestId('stack-root')).toBeTruthy();
    });

    expect(FirstRunService.bootstrap).toHaveBeenCalledTimes(2);
  });
});
