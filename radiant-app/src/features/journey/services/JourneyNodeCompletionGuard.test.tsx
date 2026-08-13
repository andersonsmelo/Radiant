import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import type { JourneyProgressStore } from '../../../types/journey';
import type { LessonBlock } from '../../../types/lessonFlow';
import type { ContentLesson, LearningTrack, LessonCatalogSummary } from '../../content/content.types';
import { LessonCatalogService } from '../../content/services/LessonCatalogService';
import { SpacedRepetitionService } from '../../spaced-repetition/services/SpacedRepetitionService';
import { LessonFlowService } from '../../lesson-flow/services/LessonFlowService';
import LessonFlowScreen from '../../lesson-flow/screens/LessonFlowScreen';
import CheckpointScreen from '../../checkpoint/screens/CheckpointScreen';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { JourneyProgressService } from './JourneyProgressService';

// ─────────────────────────────────────────────────────────────────────────────
// Este arquivo é o contraponto dos testes de tela: aqui o
// `JourneyProgressService` é REAL. Os testes de fluxo de cada tela mockam o
// serviço, então provam o que a tela chama — nunca o que o serviço aceita. Foi
// nessa lacuna que a autorização de conquista morou: a guarda estava na tela de
// reward, e três caminhos diferentes chegavam à escrita sem passar por ela.
//
// Cada teste abaixo alcança `markNodeCompleted` por um caminho distinto, e
// afirma sobre o que foi PERSISTIDO — não sobre o que a tela mostrou.
// ─────────────────────────────────────────────────────────────────────────────

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  },
}));

jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

jest.mock('../../../ui/motion', () => ({
  duration: { micro: 0, ui: 0, celebrate: 0 },
  useFadeInUp: () => ({ style: {}, animateIn: jest.fn() }),
  useScalePop: () => ({ style: {}, animateIn: jest.fn() }),
  useCardEnter: () => ({ animatedStyle: {}, reset: jest.fn(), animateIn: jest.fn() }),
  usePressScale: () => ({ animatedStyle: {}, onPressIn: jest.fn(), onPressOut: jest.fn() }),
  useShakeError: () => ({ style: {}, animateIn: jest.fn() }),
}));

jest.mock('../../../components/ui/AppButton', () => {
  const ReactLocal = require('react');
  const { Pressable, Text } = require('react-native');

  return {
    AppButton: ({
      children,
      label,
      onPress,
      disabled,
    }: {
      children?: React.ReactNode;
      label?: string;
      onPress: () => void;
      disabled?: boolean;
    }) =>
      ReactLocal.createElement(
        Pressable,
        { accessibilityRole: 'button', onPress, disabled },
        ReactLocal.createElement(Text, null, children ?? label)
      ),
  };
});

jest.mock('../../../components/ui/PixelHeroSplit', () => ({
  PixelHeroSplit: () => null,
}));

jest.mock('../../../ui/components/StarfieldBackground', () => ({
  StarfieldBackground: () => null,
}));

jest.mock('../../../ui/components/HUD', () => ({
  HUD: () => null,
}));

jest.mock('../../lesson-flow/components/LessonVisualPanel', () => ({
  LessonVisualPanel: () => null,
}));

jest.mock('../../lesson-flow/services/LessonFlowService', () => ({
  LessonFlowService: {
    getBlockById: jest.fn(),
  },
}));

jest.mock('../../lesson-flow/services/LessonOutcomeService', () => ({
  LessonOutcomeService: {
    recordCompletion: jest.fn().mockResolvedValue({ award: null, rewarded: true }),
  },
}));

jest.mock('../../gamification/services/GamificationService', () => ({
  GamificationService: {
    getSnapshot: jest.fn().mockResolvedValue({
      totalXp: 0,
      streakDays: 0,
      hearts: 5,
      maxHearts: 5,
    }),
  },
}));

jest.mock('../../paywall/PaywallService', () => ({
  PaywallService: {
    maybePresentOffer: jest.fn().mockResolvedValue(null),
    recordOutcome: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('../../paywall/UpgradeInterestService', () => ({
  UpgradeInterestService: {
    captureInterest: jest.fn().mockResolvedValue({ id: 'interest-1', email: null }),
  },
}));

jest.mock('../../paywall/components/PaywallOfferCard', () => ({
  PaywallOfferCard: () => null,
}));

jest.mock('../../spaced-repetition/services/SpacedRepetitionService', () => ({
  SpacedRepetitionService: {
    getTrackedLessonIds: jest.fn(),
    getDueLessons: jest.fn(),
  },
}));

jest.mock('../../content/services/LessonCatalogService', () => ({
  LessonCatalogService: {
    listTracks: jest.fn(),
    listLessonSummaries: jest.fn(),
    getLessonById: jest.fn(),
  },
}));

const storage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const mockedSpacedRepetition = SpacedRepetitionService as jest.Mocked<typeof SpacedRepetitionService>;
const mockedLessonCatalog = LessonCatalogService as jest.Mocked<typeof LessonCatalogService>;
const mockedLessonFlowService = LessonFlowService as jest.Mocked<typeof LessonFlowService>;

// A trilha de teste sai do mesmo gerador que a de produção
// (`JourneyDefinitionService.buildUnit`), então os ids abaixo não são
// literais escolhidos: são o que o app constrói para duas lições.
const REWARD_NODE_ID = 'node:reward:foundations';
const CHECKPOINT_NODE_ID = 'node:checkpoint:foundations';
const LESSON_BLOCK_ID = 'block:foundation-1:intro';

const trackFixtures: LearningTrack[] = [
  {
    id: 'track-radiology-foundations',
    slug: 'radiology-foundations',
    title: 'Fundamentos',
    description: 'Base inicial.',
    lessonIds: ['foundation-1', 'foundation-2'],
  },
];

const lessonSummaries: LessonCatalogSummary[] = [
  {
    id: 'foundation-1',
    slug: 'foundation-1',
    title: 'Densidade',
    difficulty: 'beginner',
    trackId: 'track-radiology-foundations',
    order: 1,
  },
  {
    id: 'foundation-2',
    slug: 'foundation-2',
    title: 'Incidência',
    difficulty: 'beginner',
    trackId: 'track-radiology-foundations',
    order: 2,
  },
];

function createLesson(id: string, title: string): ContentLesson {
  return {
    id,
    title,
    difficulty: 'beginner',
    questions: [
      {
        id: `${id}-q1`,
        type: 'multiple-choice',
        prompt: `Pergunta de ${title}`,
        options: [{ label: 'A' }, { label: 'B' }],
        correctAnswerIndex: 0,
        explanation: 'Explicação curta.',
      },
    ],
  };
}

const lessonsById: Record<string, ContentLesson> = {
  'foundation-1': createLesson('foundation-1', 'Densidade'),
  'foundation-2': createLesson('foundation-2', 'Incidência'),
};

// Um bloco de UM passo declarativo: o objetivo é chegar ao "Continuar" final
// com o mínimo de percurso. O que este teste exercita é a fronteira de escrita,
// não o motor de passos — esse tem suite própria.
const singleStepBlock: LessonBlock = {
  id: LESSON_BLOCK_ID,
  lessonId: 'foundation-1',
  steps: [
    {
      contract: {
        id: 'foundation-1-context',
        type: 'context',
        completionRule: 'displayed',
        retryRule: 'allow_continue',
        branching: 'none',
      },
      step: {
        type: 'context',
        payload: {
          eyebrow: 'Unidade 1',
          title: 'Densidade',
          body: 'Leitura inicial da cena.',
        },
      },
    },
  ],
};

function readStoredProgress(): JourneyProgressStore | null {
  const lastPayload = storage.setItem.mock.calls
    .filter(([key]) => key === STORAGE_KEYS.JOURNEY_PROGRESS)
    .at(-1)?.[1];

  return lastPayload ? (JSON.parse(lastPayload) as JourneyProgressStore) : null;
}

function storedTrack(): JourneyProgressStore['tracks'][string] {
  const store = readStoredProgress();
  if (!store) {
    throw new Error('Journey progress was never persisted');
  }

  return store.tracks['track-radiology-foundations'];
}

describe('markNodeCompleted authorization boundary', () => {
  const storageState: Record<string, string> = {};
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    Object.keys(storageState).forEach((key) => {
      delete storageState[key];
    });

    storage.getItem.mockImplementation(async (key) => storageState[key] ?? null);
    storage.setItem.mockImplementation(async (key, value) => {
      storageState[key] = value;
    });
    storage.removeItem.mockImplementation(async (key) => {
      delete storageState[key];
    });

    mockedSpacedRepetition.getTrackedLessonIds.mockResolvedValue([]);
    mockedSpacedRepetition.getDueLessons.mockResolvedValue([]);
    mockedLessonCatalog.listTracks.mockReturnValue(trackFixtures);
    mockedLessonCatalog.listLessonSummaries.mockReturnValue(lessonSummaries);
    mockedLessonCatalog.getLessonById.mockImplementation((lessonId) => lessonsById[lessonId] ?? null);
    mockedLessonFlowService.getBlockById.mockReturnValue(singleStepBlock);

    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('recusa a chamada direta de serviço para uma conquista bloqueada', async () => {
    // Caminho 1: o serviço é público e chamável. Nenhuma tela intermedia.
    await JourneyProgressService.bootstrap();

    const snapshot = await JourneyProgressService.markNodeCompleted(REWARD_NODE_ID);

    expect(snapshot.progress.completedNodeIds).not.toContain(REWARD_NODE_ID);
    expect(snapshot.progress.lastCompletedNodeId).toBeUndefined();
    expect(snapshot.progress.pendingSyncEvents).toEqual([]);
    expect(storedTrack().completedNodeIds).not.toContain(REWARD_NODE_ID);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining(`Refused to complete locked node "${REWARD_NODE_ID}"`));
  });

  it('recusa a conquista alcançada por /learn com nodeId de deep link', async () => {
    // Caminho 2: `src/app/learn.tsx` repassa `params.nodeId` verbatim, e
    // `LessonFlowScreen` o entrega a `markNodeCompleted` ao fim do bloco. Com
    // um `blockId` de lição real e um `nodeId` de conquista bloqueada, o
    // deep link `radiantapp://learn?nodeId=…&blockId=…` gravava a conquista da
    // unidade e emitia `reward_awarded` sem uma lição concluída.
    renderWithProviders(<LessonFlowScreen blockId={LESSON_BLOCK_ID} nodeId={REWARD_NODE_ID} />);

    const continueButton = await screen.findByText('Concluir e voltar');
    fireEvent.press(continueButton);

    // A espera é pela SAÍDA da tela, não pelo aviso: `handleContinue` só chama
    // `router.replace` depois de a escrita ter ido e voltado. Esperar pelo
    // `console.warn` faria o teste medir o log em vez do efeito.
    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/(tabs)');
    });

    const progress = storedTrack();
    expect(progress.completedNodeIds).not.toContain(REWARD_NODE_ID);
    expect(progress.pendingSyncEvents.map((event) => event.type)).not.toContain('reward_awarded');
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining(`Refused to complete locked node "${REWARD_NODE_ID}"`)
    );
  });

  it('recusa o checkpoint bloqueado alcançado pela tela de checkpoint', async () => {
    // Caminho 3: `CheckpointScreen` resolve o nó por id filtrando por TIPO e
    // não por status, então um checkpoint ainda bloqueado é alcançável por
    // deep link e o botão de concluir aparece igual.
    renderWithProviders(<CheckpointScreen nodeId={CHECKPOINT_NODE_ID} />);

    const completeButton = await screen.findByText('Concluir checkpoint');
    fireEvent.press(completeButton);

    // A tela não pode comemorar o que foi recusado. Ela compara o nó com o
    // snapshot que o serviço devolveu e cai no estado de erro que já existia,
    // e é esse estado que serve de ponto de sincronia: ele só aparece depois
    // de a escrita ter ido e voltado.
    await waitFor(() => {
      expect(screen.getByText('Nao foi possivel concluir o checkpoint agora.')).toBeTruthy();
    });
    expect(screen.queryByText('CONQUISTA DESBLOQUEADA')).toBeNull();

    const progress = storedTrack();
    expect(progress.completedNodeIds).not.toContain(CHECKPOINT_NODE_ID);
    expect(progress.pendingSyncEvents.map((event) => event.nodeId)).not.toContain(CHECKPOINT_NODE_ID);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining(`Refused to complete locked node "${CHECKPOINT_NODE_ID}"`)
    );
  });

  it('continua gravando o nó cuja regra de destravamento está satisfeita', async () => {
    // A guarda tem de recusar o bloqueado sem recusar o legítimo. A primeira
    // lição não tem `unlockRule`, então ela é o piso do caminho feliz — e é o
    // que impede a correção de virar "nada mais grava".
    await JourneyProgressService.bootstrap();

    const snapshot = await JourneyProgressService.markNodeCompleted('node:foundation-1');

    expect(snapshot.progress.completedNodeIds).toContain('node:foundation-1');
    expect(snapshot.progress.pendingSyncEvents.map((event) => event.type)).toEqual(['node_completed']);

    // E o checkpoint que dependia dela passa a ser gravável — a mesma guarda,
    // agora respondendo "sim", que é o que prova que ela lê a regra e não um
    // literal.
    const afterCheckpoint = await JourneyProgressService.markNodeCompleted(CHECKPOINT_NODE_ID);
    expect(afterCheckpoint.progress.completedNodeIds).toContain(CHECKPOINT_NODE_ID);
  });

  it('continua gravando a revisão vencida, que lê como bloqueada sem estar', async () => {
    // `resolveNodeStatus` devolve 'locked' para um nó de revisão fora da fila
    // do dia. Se a guarda olhasse o status cru em vez da regra, a conclusão de
    // revisão — legítima — pararia de gravar. Este teste é o que fixa a régua.
    await JourneyProgressService.bootstrap();
    await JourneyProgressService.markNodeCompleted('node:foundation-1');

    const snapshot = await JourneyProgressService.markNodeCompleted('node:review:foundation-1');

    expect(snapshot.progress.completedNodeIds).toContain('node:review:foundation-1');
    expect(snapshot.progress.pendingSyncEvents.map((event) => event.type)).toContain('review_completed');
  });
});
