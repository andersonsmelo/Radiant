import React from 'react';
import { screen, waitFor } from '@testing-library/react-native';
import JourneyHomeScreen from './JourneyHomeScreen';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { JourneyProgressService } from '../services/JourneyProgressService';
import { TelemetryService } from '../../telemetry/TelemetryService';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
  useFocusEffect: (callback: () => void) => {
    const React = require('react');
    React.useEffect(() => {
      callback();
    }, [callback]);
  },
}));

jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

jest.mock('../../../components/ui/AppButton', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');

  return {
    AppButton: ({
      children,
      onPress,
      disabled,
      accessibilityLabel,
      accessibilityHint,
    }: {
      children: React.ReactNode;
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
        <Text>{children}</Text>
      </Pressable>
    ),
  };
});

jest.mock('../../../ui/components/StarfieldBackground', () => ({
  StarfieldBackground: () => null,
}));

jest.mock('../../../ui/components/HUD', () => ({
  HUD: () => null,
}));

jest.mock('../../../ui/accessibility/useReducedMotionPreference', () => ({
  useReducedMotionPreference: () => false,
}));

jest.mock('../../gamification/services/GamificationService', () => ({
  GamificationService: {
    getSnapshot: jest.fn().mockResolvedValue({
      totalXp: 80,
      streakDays: 2,
      lastActiveDate: null,
      hearts: 5,
      maxHearts: 5,
    }),
  },
}));

jest.mock('../../../ui/characters/PixelIllustration', () => {
  const React = require('react');
  const { Text, View } = require('react-native');

  return {
    PIXEL_SIZE_MAP: { sm: 60, md: 108, lg: 176 },
    PixelIllustration: ({ expression = 'neutro' }: { expression?: string }) => (
      <View>
        <Text testID="journey-hero-expression">{expression}</Text>
      </View>
    ),
  };
});

jest.mock('../components/JourneyTrail', () => {
  const React = require('react');
  const { Text, View } = require('react-native');

  return {
    JourneyTrail: ({ segments }: { segments: { trackтатTitle?: string }[] }) => (
      <View testID="journey-trail">
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
      hearts: 5,
      maxHearts: 5,
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

describe('JourneyHomeScreen — a revisão não é objetivo da Home', () => {
  // A revisão pertence à trilha, onde é um nó do percurso. Até 2026-08-14 a
  // Home a promovia a manchete: a linha "Próximo" lia "Revisão · Revisão
  // pedida" — a mesma palavra duas vezes, em tom de cobrança — e o CTA virava
  // "Fazer revisão". A escolha do que ANUNCIAR é da Home; a de o que é
  // ELEGÍVEL continua do serviço, que alimenta Galáxia e roteamento também.
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
    return base;
  }

  it('anuncia a próxima etapa de aprendizado quando a recomendação é uma revisão', async () => {
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

    // O que sobreviveu à remoção do card "Foco de hoje": a escolha do que o CTA
    // anuncia. As asserções sobre a linha "Próximo · Lição · Disponível" caíram
    // com o card em 2026-08-21 — a trilha diz isso melhor, destacando o nó. O
    // comportamento sob teste nunca foi o texto da linha, e sim `homeNextNode`
    // não deixar a revisão virar manchete.
    await waitFor(() => expect(screen.getByText('Continuar jornada')).toBeTruthy());
    expect(screen.queryByText('Fazer revisão')).toBeNull();
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
});
