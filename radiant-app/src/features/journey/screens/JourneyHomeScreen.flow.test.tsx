import React from 'react';
import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';
import JourneyHomeScreen from './JourneyHomeScreen';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { JourneyProgressService } from '../services/JourneyProgressService';
import { TelemetryService } from '../../telemetry/TelemetryService';
import { router } from 'expo-router';
import { subscriptionService } from '../../subscription/SubscriptionService';
import { StyleSheet } from 'react-native';

// Tamanho de fonte do sistema simulado: `fontScale` é o que o iOS entrega a
// `useWindowDimensions` quando o aluno aumenta o texto (XXXL ≈ 1,35; AX5 ≈ 3,1).
const mockWindow = { width: 402, height: 874, scale: 3, fontScale: 1 };
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: () => mockWindow,
}));
afterEach(() => {
  mockWindow.fontScale = 1;
});


const mockedRouter = router as jest.Mocked<typeof router>;
const mockedSubscription = subscriptionService as jest.Mocked<typeof subscriptionService>;

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Foco controlável: a trilha recarrega ao voltar de outra rota (a tela da
// assinatura, por exemplo), e o teste precisa simular essa volta.
const mockFocusCallbacks = new Set<() => void>();
function voltarParaATela() {
  act(() => mockFocusCallbacks.forEach(callback => callback()));
}

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
  useFocusEffect: (callback: () => void) => {
    const React = require('react');
    React.useEffect(() => {
      mockFocusCallbacks.add(callback);
      callback();
      return () => {
        mockFocusCallbacks.delete(callback);
      };
    }, [callback]);
  },
}));

jest.mock('../../subscription/SubscriptionService', () => ({
  subscriptionService: { storeAvailable: jest.fn(() => false) },
}));

jest.mock('../../hearts/components/HeartsSheet', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');
  return {
    HeartsSheet: ({ visible, storeAvailable, onSubscribe }: { visible: boolean; storeAvailable: boolean; onSubscribe: () => void }) =>
      visible ? (
        <>
          <Text>Folha de vidas aberta</Text>
          <Text>{storeAvailable ? 'folha: com assinatura' : 'folha: sem assinatura'}</Text>
          <Pressable accessibilityRole="button" onPress={onSubscribe}><Text>Assinar pela folha</Text></Pressable>
        </>
      ) : null,
  };
});

jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

jest.mock('../../../components/ui/AppButton', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');

  return {
    AppButton: ({
      children,
      label,
      onPress,
      disabled,
      accessibilityLabel,
      accessibilityHint,
    }: {
      children?: React.ReactNode;
      label?: string;
      onPress: () => void;
      disabled?: boolean;
      accessibilityLabel?: string;
      accessibilityHint?: string;
    }) => (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        disabled={disabled}
        onPress={onPress}
      >
        <Text>{label ?? children}</Text>
      </Pressable>
    ),
  };
});

jest.mock('../../../ui/components/StarfieldBackground', () => ({
  StarfieldBackground: () => null,
}));

jest.mock('../../../ui/components/HUD', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');
  return {
    HUD: ({ heartsSnapshot, onHeartsPress }: { heartsSnapshot?: { status: string }; onHeartsPress?: () => void }) => (
      <Pressable accessibilityRole="button" onPress={onHeartsPress}>
        <Text>{`HUD vidas: ${heartsSnapshot?.status ?? 'carregando'}`}</Text>
      </Pressable>
    ),
  };
});

jest.mock('../../../ui/accessibility/useReducedMotionPreference', () => ({
  useReducedMotionPreference: () => false,
}));

jest.mock('../../gamification/services/GamificationService', () => ({
  GamificationService: {
    getSnapshot: jest.fn().mockResolvedValue({
      totalXp: 80,
      streakDays: 2,
      lastActiveDate: null,
    }),
  },
}));

jest.mock('../../hearts/HeartsRepository', () => ({
  heartsRepository: {
    getSnapshot: jest.fn().mockResolvedValue({
      count: 5,
      status: 'full',
      nextRefillAt: null,
      unlimitedUntil: null,
    }),
  },
}));

jest.mock('../components/JourneyTrail', () => {
  const React = require('react');
  const { Text, View } = require('react-native');

  return {
    JourneyTrail: ({ segments, header }: { segments: { trackтатTitle?: string }[]; header?: React.ReactNode }) => (
      <View testID="journey-trail">
        {header}
        <Text>{`percurso com ${segments.length} trecho(s)`}</Text>
      </View>
    ),
  };
});

jest.mock('../services/JourneyCurriculumService', () => ({
  JourneyCurriculumService: {
    getCurriculumTrail: jest.fn().mockResolvedValue({
      segments: [
        {
          trackId: 'track-radiology-foundations',
          trackTitle: 'Fundamentos de radiologia',
          order: 0,
          unlocked: true,
          completed: false,
          units: [],
        },
      ],
      recommendedNodeId: 'node-foundations-lesson',
    }),
  },
}));

jest.mock('../services/JourneyProgressService', () => ({
  JourneyProgressService: {
    bootstrap: jest.fn(),
    selectTrack: jest.fn(),
    setCurrentNode: jest.fn(),
  },
}));

jest.mock('../../daily-goal/services/DailyGoalService', () => ({
  DailyGoalService: {
    getSnapshot: jest.fn().mockResolvedValue({
      completedToday: 0,
      goalPerDay: 1,
    }),
  },
}));

jest.mock('../../content/services/LessonCatalogService', () => ({
  LessonCatalogService: {
    bootstrap: jest.fn(),
  },
}));

jest.mock('../../telemetry/TelemetryService', () => ({
  TelemetryService: {
    track: jest.fn().mockResolvedValue(undefined),
    markDayOpen: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('../../push/services/PushService', () => ({
  PushService: { onAppOpen: jest.fn().mockResolvedValue(undefined) },
}));

// O primeiro teste do arquivo paga um custo único de ~900ms dentro da janela do
// findByTestId: o mount pós-carregamento monta componentes do react-native que são
// carregados sob demanda (ScrollView, Pressable etc.) e, sob `--no-cache`, cada um
// passa pelo transform do Babel nesse momento. Com `--runInBand` e contenção de CI,
// isso excede intermitentemente o timeout padrão de 1000ms. Os mocks já são
// determinísticos; o atraso é ambiental, então damos folga apenas à primeira espera.
const FIRST_RENDER_TIMEOUT_MS = 4000;

const mockedJourneyProgressService = JourneyProgressService as jest.Mocked<typeof JourneyProgressService>;
const mockedTelemetryService = TelemetryService as jest.Mocked<typeof TelemetryService>;

const tracks = [
  {
    id: 'track-radiology-foundations',
    slug: 'fundamentos',
    title: 'Fundamentos',
    description: 'Base da radiologia.',
    lessonIds: ['lesson-foundations'],
  },
  {
    id: 'track-thorax-patterns',
    slug: 'torax',
    title: 'Tórax',
    description: 'Padrões do tórax.',
    lessonIds: ['lesson-thorax'],
  },
  {
    id: 'track-abdomen-patterns',
    slug: 'abdome',
    title: 'Abdome',
    description: 'Padrões do abdome.',
    lessonIds: ['lesson-abdomen'],
  },
] as any;

const catalogManifest = {
  version: 'test-v1',
  initialLessonId: 'lesson-foundations',
  tracks,
  lessons: tracks.map((track: any, index: number) => ({
    id: track.lessonIds[0],
    slug: track.lessonIds[0],
    title: track.title,
    difficulty: 'beginner',
    trackId: track.id,
    order: index + 1,
  })),
};

function createSnapshot(trackId: string, nodeTitle: string, nodeId: string, blockId: string) {
  const track = tracks.find((entry: any) => entry.id === trackId);

  return {
    track: {
      id: track.id,
      title: track.title,
      initialUnitId: `${trackId}:unit-1`,
      units: [
        {
          id: `${trackId}:unit-1`,
          title: track.title,
          nodes: [
            {
              id: nodeId,
              unitId: `${trackId}:unit-1`,
              type: 'lesson',
              title: nodeTitle,
              status: 'available',
              blockId,
            },
          ],
        },
      ],
    },
    progress: {
      schemaVersion: 'journey-progress.v2',
      activeTrackId: trackId,
      currentUnitId: `${trackId}:unit-1`,
      currentNodeId: null,
      completedNodeIds: [],
      pendingReviewNodeIds: [],
      lastUpdatedAt: '2026-04-09T00:00:00.000Z',
      pendingSyncEvents: [],
    },
    nextRecommendedNode: {
      id: nodeId,
      unitId: `${trackId}:unit-1`,
      type: 'lesson',
      title: nodeTitle,
      status: 'available',
      blockId,
    },
    nextDecision: {
      nodeId,
      reason: 'next-lesson',
      dueReviewCount: 0,
    },
    completedCount: 0,
    dueReviewCount: 0,
  } as any;
}

describe('JourneyHomeScreen track flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const { GamificationService } = require('../../gamification/services/GamificationService');
    GamificationService.getSnapshot.mockResolvedValue({
      totalXp: 80,
      streakDays: 2,
      lastActiveDate: null,
    });

    const { LessonCatalogService } = require('../../content/services/LessonCatalogService');
    LessonCatalogService.bootstrap.mockResolvedValue(catalogManifest);

    mockedJourneyProgressService.bootstrap.mockResolvedValue(
      createSnapshot(
        'track-radiology-foundations',
        'Fundamentos de radiologia',
        'node-foundations-lesson',
        'block-foundations'
      )
    );
    mockedJourneyProgressService.setCurrentNode.mockResolvedValue(undefined as any);
  });

  it('emits app_open, because this screen is the reachable home', async () => {
    // A home oficial responde pela abertura do app. Enquanto o evento vivia só
    // na `HomeScreen` legada — que `(tabs)/index.tsx` só renderiza com
    // `ENABLE_LEARNING_ROAD=false`, e nenhum perfil declara isso —,
    // `countEvents('app_open')` era zero para sempre e travava os gates do
    // prompt de avaliação e do paywall em `insufficient_sessions`. Esta
    // asserção existe para que trocar a home de novo falhe aqui.
    renderWithProviders(<JourneyHomeScreen />);

    await waitFor(() => {
      expect(mockedTelemetryService.track).toHaveBeenCalledWith('app_open');
    });

    expect(mockedTelemetryService.markDayOpen).toHaveBeenCalledTimes(1);
  });

  it('keeps track selection out of Home because Galaxy owns exploration', async () => {
    renderWithProviders(<JourneyHomeScreen />);

    await screen.findByTestId('journey-trail', {}, { timeout: FIRST_RENDER_TIMEOUT_MS });

    expect(screen.queryByTestId('journey-track-shelf')).toBeNull();
    expect(mockedJourneyProgressService.selectTrack).not.toHaveBeenCalled();
  });

  it('É a trilha: renderiza o percurso e não o painel de retomada', async () => {
    // Este caso afirmava o contrário até 2026-08-21 — "keeps the JourneyMap out
    // of Home because the Galaxy tab owns that surface". A Galáxia deixou de
    // existir como superfície e a trilha subiu para cá, então o que era a
    // garantia virou o defeito. O caso fica invertido, e não apagado, porque a
    // inversão é o registro da mudança de topologia.
    renderWithProviders(<JourneyHomeScreen />);

    await screen.findByTestId('journey-trail', {}, { timeout: FIRST_RENDER_TIMEOUT_MS });

    expect(screen.queryByText('Foco de hoje')).toBeNull();
    expect(screen.queryByText('Disponível agora')).toBeNull();
  });

  it('abre com o cabeçalho do estágio, e não com o hero do mascote', async () => {
    // Este caso afirmava o contrário até 2026-08-21: que a Home mostrava a fala
    // esporádica do Pixel. O hero saiu por decisão do dono — ele ocupava a
    // primeira tela inteira e empurrava a trilha para baixo da dobra, numa aba
    // cuja função É a trilha. O caso fica invertido, e não apagado, porque a
    // inversão é o registro da mudança.
    renderWithProviders(<JourneyHomeScreen />);

    await screen.findByTestId('journey-trail', {}, { timeout: FIRST_RENDER_TIMEOUT_MS });

    expect(screen.getByTestId('journey-stage-progress-fill')).toBeTruthy();
    expect(screen.queryByTestId('journey-hero-bubble')).toBeNull();
  });
});

describe('JourneyHomeScreen — a trilha soberana decide o próximo nó', () => {
  function snapshotWithReviewRecommended(extraNodes: any[]) {
    const base = createSnapshot(
      'track-radiology-foundations',
      'Fundamentos de radiologia',
      'node-foundations-lesson',
      'block-foundations',
    );
    const review = {
      id: 'node-review',
      unitId: base.progress.currentUnitId,
      type: 'review',
      title: 'Revisar Fundamentos',
      status: 'due-review',
      blockId: 'block-foundations',
    };

    base.track.units[0].nodes = [review, ...extraNodes];
    base.nextRecommendedNode = review;
    base.nextDecision = {
      nodeId: review.id,
      reason: 'due-review',
      dueReviewCount: 2,
    };
    base.dueReviewCount = 2;
    return base;
  }

  it('não pula uma revisão devida para promover uma lição nova', async () => {
    mockedJourneyProgressService.bootstrap.mockResolvedValue(
      snapshotWithReviewRecommended([
        {
          id: 'node-next-lesson',
          unitId: 'track-radiology-foundations:unit-1',
          type: 'lesson',
          title: 'Princípios de Tomografia',
          status: 'available',
          blockId: 'block-foundations',
        },
      ]),
    );

    renderWithProviders(<JourneyHomeScreen />);

    await waitFor(() => expect(screen.getByText('Fazer revisão')).toBeTruthy());
    expect(screen.queryByText('Continuar jornada')).toBeNull();
  });

  it('quando a revisão é a única coisa aberta, o botão diz o que vai abrir', async () => {
    // O fallback é onde é fácil errar depois: silenciar a revisão aqui daria um
    // botão apontando para lugar nenhum, ou pior, prometendo lição e abrindo
    // revisão. Nomear é o comportamento correto — e é este caso que impede
    // alguém de "limpar" o fallback achando que é resíduo.
    mockedJourneyProgressService.bootstrap.mockResolvedValue(snapshotWithReviewRecommended([]));

    renderWithProviders(<JourneyHomeScreen />);

    await waitFor(() => expect(screen.getByText('Fazer revisão')).toBeTruthy());
    expect(screen.queryByText('Continuar jornada')).toBeNull();
  });

  it('mostra um esqueleto sem inventar estado enquanto carrega', async () => {
    let release: ((value: ReturnType<typeof createSnapshot>) => void) | undefined;
    mockedJourneyProgressService.bootstrap.mockReturnValue(
      new Promise(resolve => {
        release = resolve;
      }) as never,
    );

    renderWithProviders(<JourneyHomeScreen />);

    expect(screen.getByText('Preparando sua trilha…')).toBeTruthy();
    release?.(createSnapshot(
      'track-radiology-foundations',
      'Fundamentos de radiologia',
      'node-foundations-lesson',
      'block-foundations',
    ));
    await screen.findByTestId('journey-trail');
  });

  it('voltar à aba relê a trilha sem trocá-la pelo carregamento', async () => {
    // Visto no simulador em 2026-10-16: o aluno rolava até o PRÓXIMO, ia ao
    // Perfil e voltava com a trilha no topo. A releitura do foco punha o
    // esqueleto no lugar da lista, e a lista desmontada perdia a posição.
    renderWithProviders(<JourneyHomeScreen />);
    const trilha = await screen.findByTestId('journey-trail', {}, { timeout: FIRST_RENDER_TIMEOUT_MS });

    let release: ((value: ReturnType<typeof createSnapshot>) => void) | undefined;
    mockedJourneyProgressService.bootstrap.mockReturnValue(
      new Promise(resolve => {
        release = resolve;
      }) as never,
    );
    voltarParaATela();

    expect(screen.queryByText('Preparando sua trilha…')).toBeNull();
    expect(screen.getByTestId('journey-trail')).toBe(trilha);

    await act(async () => {
      release?.(createSnapshot(
        'track-radiology-foundations',
        'Fundamentos de radiologia',
        'node-foundations-lesson',
        'block-foundations',
      ));
    });
    expect(screen.getByTestId('journey-trail')).toBe(trilha);
  });

  it('oferece tentar novamente quando a leitura local falha', async () => {
    mockedJourneyProgressService.bootstrap.mockRejectedValueOnce(new Error('storage unavailable'));

    renderWithProviders(<JourneyHomeScreen />);

    expect(await screen.findByText('Não foi possível carregar a jornada.')).toBeTruthy();
    mockedJourneyProgressService.bootstrap.mockResolvedValue(
      createSnapshot(
        'track-radiology-foundations',
        'Fundamentos de radiologia',
        'node-foundations-lesson',
        'block-foundations',
      ),
    );
    fireEvent.press(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(await screen.findByTestId('journey-trail')).toBeTruthy();
  });

  it('informa ausência de etapas sem prometer um novo arco', async () => {
    const complete = createSnapshot(
      'track-radiology-foundations',
      'Fundamentos de radiologia',
      'node-foundations-lesson',
      'block-foundations',
    );
    complete.nextRecommendedNode = null;
    complete.nextDecision = null;
    complete.track.units[0].nodes[0].status = 'completed';
    mockedJourneyProgressService.bootstrap.mockResolvedValue(complete);

    renderWithProviders(<JourneyHomeScreen />);

    expect(await screen.findByText('Nenhuma etapa disponível agora')).toBeTruthy();
  });

  describe('folha de vidas e a loja', () => {
    const vazia = { count: 0, status: 'empty', nextRefillAt: '2026-09-14T12:30:00.000Z', unlimitedUntil: null };
    const ilimitada = { count: 0, status: 'unlimited', nextRefillAt: null, unlimitedUntil: '2026-10-14T12:00:00.000Z' };
    const heartsRepository = () =>
      require('../../hearts/HeartsRepository').heartsRepository as { getSnapshot: jest.Mock };

    async function abrirAFolha() {
      heartsRepository().getSnapshot.mockResolvedValue(vazia);
      renderWithProviders(<JourneyHomeScreen />);
      fireEvent.press(await screen.findByText('HUD vidas: empty'));
      expect(screen.getByText('Folha de vidas aberta')).toBeTruthy();
    }

    afterEach(() => {
      heartsRepository().getSnapshot.mockResolvedValue({ count: 5, status: 'full', nextRefillAt: null, unlimitedUntil: null });
    });

    it('com loja no binário, a folha oferece a assinatura e leva à tela dela', async () => {
      mockedSubscription.storeAvailable.mockReturnValue(true);
      await abrirAFolha();

      expect(screen.getByText('folha: com assinatura')).toBeTruthy();
      fireEvent.press(screen.getByText('Assinar pela folha'));

      expect(mockedRouter.push).toHaveBeenCalledWith('/subscription');
      expect(screen.queryByText('Folha de vidas aberta')).toBeNull();
    });

    it('sem loja no binário, a folha não oferece a assinatura', async () => {
      mockedSubscription.storeAvailable.mockReturnValue(false);
      await abrirAFolha();

      expect(screen.getByText('folha: sem assinatura')).toBeTruthy();
    });

    it('voltando da compra, a trilha relê as vidas: o cabeçalho recebe o ilimitado e a folha não abre mais', async () => {
      mockedSubscription.storeAvailable.mockReturnValue(true);
      await abrirAFolha();
      fireEvent.press(screen.getByText('Assinar pela folha'));

      heartsRepository().getSnapshot.mockResolvedValue(ilimitada);
      voltarParaATela();

      fireEvent.press(await screen.findByText('HUD vidas: unlimited'));
      expect(screen.queryByText('Folha de vidas aberta')).toBeNull();
    });
  });

  // Achado 2 do gate H4, conferido em AX5 (2026-09-24): o título do estágio,
  // fixo acima da trilha, ocupava a tela inteira, a trilha ficava com altura
  // zero e o CTA ia para baixo da barra de abas. Com texto grande o cabeçalho
  // entra na rolagem da trilha; o header padrão agora também rola.
  describe('texto grande', () => {
    function headerIsInsideTrail() {
      const header = screen.getByLabelText(/etapas concluídas\.$/u);
      for (let node = header.parent; node; node = node.parent) {
        if (node.props.testID === 'journey-trail') return true;
      }
      return false;
    }

    it('põe o cabeçalho do estágio dentro da rolagem da trilha', async () => {
      mockWindow.fontScale = 3.1;
      renderWithProviders(<JourneyHomeScreen />);
      await screen.findByTestId('journey-trail', {}, { timeout: FIRST_RENDER_TIMEOUT_MS });

      expect(headerIsInsideTrail()).toBe(true);
    });

    it('põe também o cabeçalho padrão na rolagem da trilha', async () => {
      renderWithProviders(<JourneyHomeScreen />);
      await screen.findByTestId('journey-trail', {}, { timeout: FIRST_RENDER_TIMEOUT_MS });

      expect(headerIsInsideTrail()).toBe(true);
    });
  });
});


describe('JourneyHomeScreen — recomendação acionável', () => {
  beforeEach(() => { jest.clearAllMocks(); });
  function base() { return createSnapshot('track-radiology-foundations', 'Lição atual', 'lesson-1', 'block-1'); }
  it('renderiza o Pixel pequeno real como decoração oculta na recomendação da Home', async () => {
    mockedJourneyProgressService.bootstrap.mockResolvedValue(base());
    renderWithProviders(<JourneyHomeScreen />);
    await screen.findByRole('button', { name: 'Continuar jornada' });

    expect(screen.queryByLabelText('Mascote Pixel')).toBeNull();
    const pixel = screen.getByLabelText('Mascote Pixel', { includeHiddenElements: true });
    expect(StyleSheet.flatten(pixel.props.style).width).toBe(60);
    expect(pixel.props.source).toBeTruthy();
    let wrapper = pixel.parent;
    while (wrapper && wrapper.props.importantForAccessibility !== 'no-hide-descendants') wrapper = wrapper.parent;
    expect(wrapper).not.toBeNull();
    expect(wrapper?.props.accessible).toBe(false);
    expect(wrapper?.props.accessibilityElementsHidden).toBe(true);
    expect(wrapper?.props.pointerEvents).toBe('none');
  });
  it('retoma a lição com o cursor real na rota', async () => {
    const snapshot = base();
    snapshot.nextRecommendedNode.status = 'resumable';
    snapshot.nextDecision = { nodeId: 'lesson-1', reason: 'paused-lesson', resumeStepIndex: 3, dueReviewCount: 0 };
    mockedJourneyProgressService.bootstrap.mockResolvedValue(snapshot);
    renderWithProviders(<JourneyHomeScreen />);
    fireEvent.press(await screen.findByRole('button', { name: 'Retomar lição' }));
    await waitFor(() => expect(mockedRouter.push).toHaveBeenCalledWith({ pathname: '/learn', params: { nodeId: 'lesson-1', blockId: 'block-1', resumeCursorId: 'step-4' } }));
    expect(mockedJourneyProgressService.setCurrentNode).toHaveBeenCalledWith('lesson-1');
  });
  it.each([
    ['review', 'resumable', 'Retomar revisão', '/learn'],
    ['checkpoint', 'resumable', 'Retomar avaliação', '/checkpoint'],
    ['review', 'due-review', 'Fazer revisão', '/learn'],
    ['checkpoint', 'available', 'Fazer avaliação', '/checkpoint'],
    ['reward', 'available', 'Receber conquista', '/reward'],
  ])('abre %s/%s com ação %s e rota real', async (type, status, action, pathname) => {
    const snapshot = base();
    Object.assign(snapshot.nextRecommendedNode, { type, status });
    snapshot.nextDecision.reason = status === 'resumable' ? 'paused-lesson' : 'next-lesson';
    snapshot.nextDecision.resumeStepIndex = status === 'resumable' ? 2 : undefined;
    mockedJourneyProgressService.bootstrap.mockResolvedValue(snapshot);
    renderWithProviders(<JourneyHomeScreen />);

    fireEvent.press(await screen.findByRole('button', { name: action }));
    const params = pathname === '/learn'
      ? { nodeId: 'lesson-1', blockId: 'block-1', ...(status === 'resumable' ? { resumeCursorId: 'step-3' } : {}) }
      : { nodeId: 'lesson-1' };
    await waitFor(() => expect(mockedRouter.push).toHaveBeenCalledWith({ pathname, params }));
    expect(mockedRouter.push).toHaveBeenCalledTimes(1);
    expect(mockedJourneyProgressService.setCurrentNode).toHaveBeenCalledWith('lesson-1');
    expect(screen.getAllByTestId('journey-recommendation-action')).toHaveLength(1);
  });

  it('conquista já coletada não oferece nem executa uma nova coleta', async () => {
    const snapshot = base();
    Object.assign(snapshot.nextRecommendedNode, { type: 'reward', status: 'completed' });
    mockedJourneyProgressService.bootstrap.mockResolvedValue(snapshot);
    renderWithProviders(<JourneyHomeScreen />);

    expect(await screen.findByText('Nenhuma etapa disponível agora')).toBeTruthy();
    expect(screen.queryByTestId('journey-recommendation-action')).toBeNull();
    expect(mockedRouter.push).not.toHaveBeenCalled();
    expect(mockedJourneyProgressService.setCurrentNode).not.toHaveBeenCalled();
  });

  it('próxima lição continua acionável junto da data real de revisão futura', async () => {
    const snapshot = base();
    const availableAt = Date.now() + 86400000;
    snapshot.track.units[0].nodes.push({ ...snapshot.nextRecommendedNode, id: 'future-review', type: 'review', status: 'locked', reviewAvailableAtMs: availableAt });
    mockedJourneyProgressService.bootstrap.mockResolvedValue(snapshot);
    renderWithProviders(<JourneyHomeScreen />);

    const action = await screen.findByRole('button', { name: 'Continuar jornada' });
    const date = new Date(availableAt);
    const dateText = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()} às ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    expect(screen.getByText(`Próxima revisão em ${dateText}`)).toBeTruthy();
    fireEvent.press(action);
    await waitFor(() => expect(mockedRouter.push).toHaveBeenCalledWith({ pathname: '/learn', params: { nodeId: 'lesson-1', blockId: 'block-1' } }));
  });

  it('revisão ainda futura não ganha ação mesmo com status stale de disponível', async () => {
    const snapshot = base();
    Object.assign(snapshot.nextRecommendedNode, { type: 'review', reviewAvailableAtMs: Date.now() + 86400000 });
    snapshot.track.units[0].nodes = [snapshot.nextRecommendedNode];
    mockedJourneyProgressService.bootstrap.mockResolvedValue(snapshot);
    renderWithProviders(<JourneyHomeScreen />);

    expect(await screen.findByText('Nenhuma etapa disponível agora')).toBeTruthy();
    expect(screen.queryByTestId('journey-recommendation-action')).toBeNull();
    expect(screen.getByText(/^Próxima revisão em /)).toBeTruthy();
    expect(mockedRouter.push).not.toHaveBeenCalled();
  });

  it('ausência de data não fabrica prazo de revisão', async () => {
    mockedJourneyProgressService.bootstrap.mockResolvedValue(base());
    renderWithProviders(<JourneyHomeScreen />);
    await screen.findByRole('button', { name: 'Continuar jornada' });
    expect(screen.queryByText(/^Próxima revisão em /)).toBeNull();
  });

  it('sem próxima etapa não promete novo arco nem mostra CTA inerte', async () => {
    const snapshot = base(); snapshot.nextRecommendedNode = null;
    mockedJourneyProgressService.bootstrap.mockResolvedValue(snapshot);
    renderWithProviders(<JourneyHomeScreen />);
    expect(await screen.findByText('Nenhuma etapa disponível agora')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Aguardando nova etapa' })).toBeNull();
    expect(screen.queryByText('Novo arco em breve')).toBeNull();
    expect(mockedRouter.push).not.toHaveBeenCalled();
  });
});
