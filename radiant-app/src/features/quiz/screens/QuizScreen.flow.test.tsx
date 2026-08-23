import React from 'react';
import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';
import type { QuizLesson } from '../../../types/quiz';
import QuizScreen from './QuizScreen';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { SpacedRepetitionService } from '../../spaced-repetition/services/SpacedRepetitionService';
import { SyncQueueService } from '../../sync/SyncQueueService';
import { GamificationService } from '../../gamification/services/GamificationService';
import { DailyGoalService } from '../../daily-goal/services/DailyGoalService';
import { PixelMood } from '../../pixel-mood/PixelMood';
import { PIXEL_MOMENTS } from '../../pixel-mood/pixelPhrases';
import { LearningAttemptsRepository } from '../../progress/services/LearningAttemptsRepository';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
    removeItem: jest.fn().mockResolvedValue(undefined),
  },
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
  duration: {
    micro: 0,
    ui: 0,
    celebrate: 0,
  },
  useFadeInUp: () => ({ style: {}, animateIn: jest.fn() }),
  // `scale` precisa existir: LessonSummary/SummaryStar chama
  // `scale.setValue(1)` quando `animate` é false (marca sem melhora — o
  // fallback de leitura rejeitada do QuizScreen produz exatamente esse
  // estado). Faltando aqui, o componente lança dentro do efeito e a árvore
  // desmonta antes de qualquer asserção rodar.
  useScalePop: () => ({ scale: { setValue: jest.fn() }, style: {}, animateIn: jest.fn() }),
  useCardEnter: () => ({ animatedStyle: {}, reset: jest.fn(), animateIn: jest.fn() }),
  usePressScale: () => ({
    animatedStyle: {},
    onPressIn: jest.fn(),
    onPressOut: jest.fn(),
  }),
  useShakeError: () => ({ style: {}, animateIn: jest.fn() }),
}));

jest.mock('../../../components/ui/AppButton', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');

  return {
    // `label` é a prop que o LessonSummary usa para o botão Continuar;
    // `children` é o estilo usado pelos botões que já existiam neste
    // arquivo. O mock precisa dos dois — sem `label` aqui, nenhum teste
    // consegue pressionar "Continuar".
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
    }) => (
      <Pressable accessibilityRole="button" onPress={onPress} disabled={disabled}>
        <Text>{children ?? label}</Text>
      </Pressable>
    ),
  };
});

jest.mock('../../../components/ui/PixelHeroSplit', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    PixelHeroSplit: ({ children }: { children?: React.ReactNode }) => <View>{children}</View>,
  };
});

jest.mock('../../../components/ui/ProgressRing', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    ProgressRing: () => <View />,
  };
});

jest.mock('../../../ui/components/HUD', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    HUD: () => null,
    HeartsDisplay: () => <View />,
  };
});

jest.mock('../../../ui/components/StarfieldBackground', () => ({
  StarfieldBackground: () => null,
}));

jest.mock('../../../ui/characters/PixelIllustration', () => {
  const React = require('react');
  const { Text, View } = require('react-native');

  return {
    PixelIllustration: ({ expression }: { expression?: string }) => (
      <View>
        <Text testID="quiz-feedback-expression">{expression ?? 'sem-expression'}</Text>
      </View>
    ),
  };
});

jest.mock('../../push/components/PushOptInCard', () => ({
  PushOptInCard: () => null,
}));

jest.mock('../../push/services/PushService', () => ({
  PushService: {
    getOptIn: jest.fn().mockResolvedValue(false),
  },
}));

jest.mock('../../../services/RatingPromptService', () => ({
  RatingPromptService: {
    maybePromptForReview: jest.fn().mockResolvedValue(false),
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
    captureInterest: jest.fn().mockResolvedValue({
      id: 'interest-quiz-1',
      email: 'user@example.com',
    }),
  },
}));

jest.mock('../../paywall/components/PaywallOfferCard', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    PaywallOfferCard: () => <View />,
  };
});

jest.mock('../../onboarding/OnboardingService', () => ({
  OnboardingService: {
    init: jest.fn().mockResolvedValue(undefined),
    markAction: jest.fn().mockResolvedValue(undefined),
    getSummaryHelper: jest.fn(() => null),
  },
}));

jest.mock('../../spaced-repetition/services/SpacedRepetitionService', () => ({
  SpacedRepetitionService: {
    recordQuizResult: jest.fn().mockResolvedValue(undefined),
    getCardState: jest.fn().mockResolvedValue(null),
  },
}));

jest.mock('../../sync/SyncQueueService', () => ({
  SyncQueueService: {
    enqueueLessonProgressFromQuizResult: jest.fn().mockResolvedValue(undefined),
    enqueueReviewCard: jest.fn().mockResolvedValue(undefined),
    flush: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('../../gamification/services/GamificationService', () => ({
  GamificationService: {
    getSnapshot: jest.fn().mockResolvedValue({
      totalXp: 120,
      streakDays: 3,
      hearts: 5,
      maxHearts: 5,
    }),
    loseHeart: jest.fn().mockResolvedValue({ hearts: 4, maxHearts: 5 }),
    recordQuizCompletion: jest.fn().mockResolvedValue({
      award: { baseXp: 10, bonusXp: 2, totalXpAwarded: 12, reason: 'quiz_complete' },
    }),
  },
}));

jest.mock('../../daily-goal/services/DailyGoalService', () => ({
  DailyGoalService: {
    getSnapshot: jest.fn().mockResolvedValue({
      completedToday: 0,
      goalPerDay: 3,
      isCompleted: false,
      dateKey: '2026-04-02',
    }),
    recordXp: jest.fn().mockResolvedValue({
      earnedXpToday: 12,
      goalXp: 10,
      isCompleted: false,
      dateKey: '2026-04-02',
    }),
  },
}));

jest.mock('../../journey/services/JourneyProgressService', () => ({
  JourneyProgressService: {
    markLessonNodeCompleted: jest.fn().mockResolvedValue(null),
    markReviewNodeCompleted: jest.fn().mockResolvedValue(null),
    getSnapshot: jest.fn().mockResolvedValue({
      track: {
        id: 'track-1',
        title: 'Trilha Radiológica',
        initialUnitId: 'unit-1',
        units: [
          {
            id: 'unit-1',
            title: 'Unidade 1',
            nodes: [
              {
                id: 'node-lesson-1',
                unitId: 'unit-1',
                type: 'lesson',
                title: 'Lição 1',
                lessonId: 'lesson-1',
                status: 'completed',
              },
              {
                id: 'node-lesson-2',
                unitId: 'unit-1',
                type: 'lesson',
                title: 'Lição 2',
                lessonId: 'lesson-2',
                status: 'available',
              },
            ],
          },
        ],
      },
      progress: {
        schemaVersion: 'journey-progress.v2',
        activeTrackId: 'track-1',
        currentUnitId: 'unit-1',
        currentNodeId: null,
        completedNodeIds: ['node-lesson-1'],
        pendingReviewNodeIds: [],
        lastUpdatedAt: '2026-08-14T00:00:00.000Z',
        pendingSyncEvents: [],
      },
      nextRecommendedNode: null,
      completedCount: 1,
      dueReviewCount: 0,
      recommendationReason: 'default',
    }),
  },
}));

jest.mock('../../content/services/LessonCatalogService', () => ({
  LessonCatalogService: {
    getLessonById: jest.fn(),
    getInitialLesson: jest.fn(),
  },
}));

const mockedSpacedRepetitionService = SpacedRepetitionService as jest.Mocked<typeof SpacedRepetitionService>;
const mockedSyncQueueService = SyncQueueService as jest.Mocked<typeof SyncQueueService>;
const mockedGamificationService = GamificationService as jest.Mocked<typeof GamificationService>;
const mockedDailyGoalService = DailyGoalService as jest.Mocked<typeof DailyGoalService>;

const lessonFixture: QuizLesson = {
  id: 'lesson-1',
  title: 'Radiografia de Tórax',
  difficulty: 'beginner',
  questions: [
    {
      id: 'question-1',
      type: 'multiple-choice',
      prompt: 'Qual padrão radiográfico está presente?',
      options: [
        { label: 'Pneumotórax' },
        { label: 'Consolidação alveolar' },
      ],
      correctAnswerIndex: 1,
      explanation: 'A opacidade focal com broncograma aéreo sugere consolidação alveolar.',
    },
  ],
};

const lessonTresQuestoes: QuizLesson = {
  id: 'lesson-3q',
  title: 'Sequência de três',
  difficulty: 'beginner',
  questions: [1, 2, 3].map((n) => ({
    id: `question-${n}`,
    type: 'multiple-choice',
    prompt: `Pergunta ${n}?`,
    options: [{ label: `Errada ${n}` }, { label: `Certa ${n}` }],
    correctAnswerIndex: 1,
    explanation: `Explicação ${n}.`,
  })),
};

const lessonQuatroQuestoes: QuizLesson = {
  ...lessonTresQuestoes,
  id: 'lesson-4q',
  title: 'Sequência de quatro',
  questions: [
    ...lessonTresQuestoes.questions,
    {
      id: 'question-4',
      type: 'multiple-choice',
      prompt: 'Pergunta 4?',
      options: [{ label: 'Errada 4' }, { label: 'Certa 4' }],
      correctAnswerIndex: 1,
      explanation: 'Explicação 4.',
    },
  ],
};

function montarQuiz(lesson: QuizLesson) {
  const { LessonCatalogService } = jest.requireMock(
    '../../content/services/LessonCatalogService',
  ) as { LessonCatalogService: { getLessonById: jest.Mock; getInitialLesson: jest.Mock } };
  LessonCatalogService.getLessonById.mockReturnValue(lesson);
  LessonCatalogService.getInitialLesson.mockReturnValue(lesson);
  renderWithProviders(<QuizScreen mode="normal" lessonId={lesson.id} />);
}

async function flushPixelMoodResolution() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
  });
}

async function responder(label: string) {
  fireEvent.press(screen.getByLabelText(label));
  await act(async () => {
    await Promise.resolve();
  });
}

describe('QuizScreen flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    PixelMood.resetSession();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    PixelMood.resetSession();
  });

  it('mostra a contagem de questões e nenhum cabeçalho redundante', async () => {
    montarQuiz(lessonTresQuestoes);
    await waitFor(() => expect(screen.getByText('Pergunta 1 de 3')).toBeTruthy());
    expect(screen.queryByText('Quiz')).toBeNull();
    expect(screen.queryByText('1/3')).toBeNull();
    expect(screen.queryByLabelText('Questões')).toBeNull();
  });

  it('completes a quiz and syncs the result', async () => {
    const { LessonCatalogService } = jest.requireMock('../../content/services/LessonCatalogService') as {
      LessonCatalogService: {
        getLessonById: jest.Mock;
        getInitialLesson: jest.Mock;
      };
    };

    LessonCatalogService.getLessonById.mockReturnValue(lessonFixture);
    LessonCatalogService.getInitialLesson.mockReturnValue(lessonFixture);

    renderWithProviders(<QuizScreen mode="normal" lessonId="lesson-1" />);

    expect(await screen.findByText('Qual padrão radiográfico está presente?')).toBeTruthy();

    fireEvent.press(screen.getByLabelText('Consolidação alveolar'));

    expect(await screen.findByText('Próxima')).toBeTruthy();
    fireEvent.press(screen.getByText('Próxima'));

    expect(await screen.findByText('A lição foi concluída')).toBeTruthy();

    await waitFor(() => {
      expect(mockedSpacedRepetitionService.recordQuizResult).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockedSyncQueueService.enqueueLessonProgressFromQuizResult).toHaveBeenCalled();
      expect(mockedSyncQueueService.flush).toHaveBeenCalled();
      expect(mockedGamificationService.recordQuizCompletion).toHaveBeenCalled();
      expect(mockedDailyGoalService.recordXp).toHaveBeenCalledWith(12, expect.anything());
    });
  });

  it('persiste a tentativa do quiz no mesmo histórico que alimenta a melhor marca', async () => {
    const appendAttempt = jest.spyOn(LearningAttemptsRepository, 'append').mockResolvedValue(undefined);
    const { LessonCatalogService } = jest.requireMock('../../content/services/LessonCatalogService') as {
      LessonCatalogService: { getLessonById: jest.Mock; getInitialLesson: jest.Mock };
    };
    LessonCatalogService.getLessonById.mockReturnValue(lessonFixture);
    LessonCatalogService.getInitialLesson.mockReturnValue(lessonFixture);

    renderWithProviders(<QuizScreen mode="normal" lessonId="lesson-1" />);
    fireEvent.press(await screen.findByLabelText('Consolidação alveolar'));
    fireEvent.press(await screen.findByText('Próxima'));

    await waitFor(() =>
      expect(appendAttempt).toHaveBeenCalledWith(
        expect.objectContaining({
          lessonId: 'lesson-1',
          topicId: 'unit-1',
          correctAnswers: 1,
          totalQuestions: 1,
        }),
      ),
    );
  });

  it('não abre o prompt nativo da App Store na conclusão que já pede a avaliação da aula', async () => {
    const { RatingPromptService } = jest.requireMock('../../../services/RatingPromptService') as {
      RatingPromptService: { maybePromptForReview: jest.Mock };
    };
    const { LessonCatalogService } = jest.requireMock('../../content/services/LessonCatalogService') as {
      LessonCatalogService: { getLessonById: jest.Mock; getInitialLesson: jest.Mock };
    };
    LessonCatalogService.getLessonById.mockReturnValue(lessonFixture);
    LessonCatalogService.getInitialLesson.mockReturnValue(lessonFixture);

    renderWithProviders(<QuizScreen mode="normal" lessonId="lesson-1" />);
    fireEvent.press(await screen.findByLabelText('Consolidação alveolar'));
    fireEvent.press(await screen.findByText('Próxima'));

    await screen.findByText('Avalie a aula');
    expect(RatingPromptService.maybePromptForReview).not.toHaveBeenCalled();
  });

  it('usa o snapshot devolvido pela própria marcação da lição, não uma leitura solta que pode chegar antes da escrita', async () => {
    // Mutação que este teste pega: voltar a resolver o progresso da unidade
    // lendo JourneyProgressService.getSnapshot() à parte, em vez de
    // encadear a partir do retorno de markLessonNodeCompleted. As duas
    // leituras correm em paralelo com a escrita da marcação — getSnapshot()
    // não espera por ela — e nada garante qual das duas Promises resolve
    // primeiro. Este teste configura os dois mocks com valores DIFERENTES
    // de propósito: getSnapshot() devolve a contagem de ANTES da lição
    // contar como concluída (a leitura desatualizada que vence a corrida na
    // prática), markLessonNodeCompleted devolve a contagem já correta,
    // pós-conclusão. Contra o código antigo (racing), a tela mostraria
    // "0 de 2 lições"; a asserção abaixo só passa contra o código corrigido.
    // Ver Achado Importante 1 do review final da branch.
    const { LessonCatalogService } = jest.requireMock('../../content/services/LessonCatalogService') as {
      LessonCatalogService: { getLessonById: jest.Mock; getInitialLesson: jest.Mock };
    };
    const { JourneyProgressService: mockedJourneyProgressService } = jest.requireMock(
      '../../journey/services/JourneyProgressService',
    ) as {
      JourneyProgressService: { markLessonNodeCompleted: jest.Mock; getSnapshot: jest.Mock };
    };

    LessonCatalogService.getLessonById.mockReturnValue(lessonFixture);
    LessonCatalogService.getInitialLesson.mockReturnValue(lessonFixture);

    const buildSnapshot = (lesson1Status: 'available' | 'completed') => ({
      track: {
        id: 'track-1',
        title: 'Trilha Radiológica',
        initialUnitId: 'unit-1',
        units: [
          {
            id: 'unit-1',
            title: 'Unidade 1',
            nodes: [
              {
                id: 'node-lesson-1',
                unitId: 'unit-1',
                type: 'lesson',
                title: 'Lição 1',
                lessonId: 'lesson-1',
                status: lesson1Status,
              },
              {
                id: 'node-lesson-2',
                unitId: 'unit-1',
                type: 'lesson',
                title: 'Lição 2',
                lessonId: 'lesson-2',
                status: 'available',
              },
            ],
          },
        ],
      },
      progress: {
        schemaVersion: 'journey-progress.v2',
        activeTrackId: 'track-1',
        currentUnitId: 'unit-1',
        currentNodeId: null,
        completedNodeIds: lesson1Status === 'completed' ? ['node-lesson-1'] : [],
        pendingReviewNodeIds: [],
        lastUpdatedAt: '2026-08-14T00:00:00.000Z',
        pendingSyncEvents: [],
      },
      nextRecommendedNode: null,
      completedCount: lesson1Status === 'completed' ? 1 : 0,
      dueReviewCount: 0,
      recommendationReason: 'default',
    });

    // Stale de propósito: é o que uma leitura paralela via getSnapshot()
    // veria se corresse ANTES da escrita da marcação pousar.
    const staleSnapshotBeforeMark = buildSnapshot('available');
    // Fresco: exatamente o que markLessonNodeCompleted devolve, já
    // consistente com a conclusão desta lição.
    const freshSnapshotFromMark = buildSnapshot('completed');

    mockedJourneyProgressService.getSnapshot.mockResolvedValueOnce(staleSnapshotBeforeMark);
    mockedJourneyProgressService.markLessonNodeCompleted.mockResolvedValueOnce(freshSnapshotFromMark);

    renderWithProviders(<QuizScreen mode="normal" lessonId="lesson-1" />);

    expect(await screen.findByText('Qual padrão radiográfico está presente?')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Consolidação alveolar'));
    fireEvent.press(await screen.findByText('Próxima'));

    await waitFor(() => expect(screen.getByText('A lição foi concluída')).toBeTruthy());
    expect(await screen.findByText('1 de 2 etapas')).toBeTruthy();
    expect(screen.queryByText('0 de 2 etapas')).toBeNull();
  });

  it('conclui a lição sem oferta de assinatura nem pedido de notificação', async () => {
    const { LessonCatalogService } = jest.requireMock('../../content/services/LessonCatalogService') as {
      LessonCatalogService: {
        getLessonById: jest.Mock;
        getInitialLesson: jest.Mock;
      };
    };

    LessonCatalogService.getLessonById.mockReturnValue(lessonFixture);
    LessonCatalogService.getInitialLesson.mockReturnValue(lessonFixture);

    renderWithProviders(<QuizScreen mode="normal" lessonId="lesson-1" />);

    expect(await screen.findByText('Qual padrão radiográfico está presente?')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Consolidação alveolar'));
    fireEvent.press(await screen.findByText('Próxima'));

    await waitFor(() => expect(screen.getByText('A lição foi concluída')).toBeTruthy());
    expect(screen.queryByText(/Radiant Plus/)).toBeNull();
    expect(screen.queryByText(/Próxima decisão/)).toBeNull();
    expect(screen.queryByText(/notificaç/i)).toBeNull();
  });

  it('avança para a próxima lição da fila de revisão ao pressionar Continuar', async () => {
    // Mutação que este teste pega: onContinue sempre roteando para '/(tabs)'
    // em vez de chamar onNextLesson quando ainda há lição na fila de review.
    const { LessonCatalogService } = jest.requireMock('../../content/services/LessonCatalogService') as {
      LessonCatalogService: {
        getLessonById: jest.Mock;
        getInitialLesson: jest.Mock;
      };
    };

    LessonCatalogService.getLessonById.mockImplementation((id: string) =>
      id === 'lesson-1' ? lessonFixture : id === 'lesson-3q' ? lessonTresQuestoes : null
    );

    renderWithProviders(<QuizScreen mode="review" lessonIds={['lesson-1', 'lesson-3q']} />);

    expect(await screen.findByText('Qual padrão radiográfico está presente?')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Consolidação alveolar'));
    fireEvent.press(await screen.findByText('Próxima'));

    await waitFor(() => expect(screen.getByText('A lição foi concluída')).toBeTruthy());
    fireEvent.press(screen.getByText('Continuar'));

    expect(await screen.findByText('Pergunta 1?')).toBeTruthy();
    expect(screen.queryByText('A lição foi concluída')).toBeNull();
  });

  it('finaliza a fila de revisão e registra review_complete ao concluir a última lição', async () => {
    // Mutação que este teste pega: onFinishReview nunca sendo chamado a
    // partir do resumo, o que deixaria o marco firstReviewAt inalcançável
    // por esta rota.
    const { LessonCatalogService } = jest.requireMock('../../content/services/LessonCatalogService') as {
      LessonCatalogService: {
        getLessonById: jest.Mock;
        getInitialLesson: jest.Mock;
      };
    };
    const { OnboardingService: mockedOnboardingService } = jest.requireMock(
      '../../onboarding/OnboardingService'
    ) as { OnboardingService: { markAction: jest.Mock } };
    const { router: mockedRouter } = jest.requireMock('expo-router') as {
      router: { replace: jest.Mock };
    };

    LessonCatalogService.getLessonById.mockReturnValue(lessonFixture);

    renderWithProviders(<QuizScreen mode="review" lessonIds={['lesson-1']} />);

    expect(await screen.findByText('Qual padrão radiográfico está presente?')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Consolidação alveolar'));
    fireEvent.press(await screen.findByText('Próxima'));

    await waitFor(() => expect(screen.getByText('A lição foi concluída')).toBeTruthy());
    fireEvent.press(screen.getByText('Continuar'));

    await waitFor(() => {
      expect(mockedOnboardingService.markAction).toHaveBeenCalledWith('review_complete');
      expect(mockedRouter.replace).toHaveBeenCalledWith('/(tabs)');
    });
  });

  it('ainda chega no Continuar quando a leitura de tentativas/nota falha', async () => {
    // Mutação que este teste pega: remover o try/catch do efeito de resumo
    // deixaria `summary` preso em null para sempre quando a leitura rejeita
    // — a tela ficaria sem nenhum botão.
    const { LessonCatalogService } = jest.requireMock('../../content/services/LessonCatalogService') as {
      LessonCatalogService: {
        getLessonById: jest.Mock;
        getInitialLesson: jest.Mock;
      };
    };

    LessonCatalogService.getLessonById.mockReturnValue(lessonFixture);
    LessonCatalogService.getInitialLesson.mockReturnValue(lessonFixture);

    jest.spyOn(LearningAttemptsRepository, 'getAll').mockRejectedValueOnce(new Error('falha de leitura'));
    jest.spyOn(console, 'error').mockImplementation(() => undefined);

    renderWithProviders(<QuizScreen mode="normal" lessonId="lesson-1" />);

    expect(await screen.findByText('Qual padrão radiográfico está presente?')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Consolidação alveolar'));
    fireEvent.press(await screen.findByText('Próxima'));

    await waitFor(() => expect(screen.getByText('A lição foi concluída')).toBeTruthy());
    expect(screen.getByText('Continuar')).toBeTruthy();
  });

  it('solta frase e expressão de sequência após três acertos seguidos', async () => {
    // Mutação que esta assertiva pega: remover o gatilho no terceiro acerto ou
    // deixar de encaminhar moodPhrase/moodExpression até PixelIllustration.
    montarQuiz(lessonTresQuestoes);

    for (const n of [1, 2, 3]) {
      expect(await screen.findByText(`Pergunta ${n}?`)).toBeTruthy();
      await responder(`Certa ${n}`);
      if (n < 3) {
        fireEvent.press(await screen.findByText('Próxima'));
      }
    }

    await flushPixelMoodResolution();
    const frases = PIXEL_MOMENTS['acertou-em-sequencia'].phrases;
    await waitFor(() => {
      expect(frases.some((f) => screen.queryByText(f) !== null)).toBe(true);
    });
    expect(screen.getByTestId('quiz-feedback-expression')).toHaveTextContent('orgulhoso');
  });

  it('solta frase e expressão de teimosia após dois erros seguidos', async () => {
    // Mutação que esta assertiva pega: trocar o limiar para três erros ou não
    // entregar a expressão revirando pela fronteira do PixelIllustration.
    montarQuiz(lessonTresQuestoes);

    for (const n of [1, 2]) {
      expect(await screen.findByText(`Pergunta ${n}?`)).toBeTruthy();
      await responder(`Errada ${n}`);
      if (n < 2) {
        fireEvent.press(await screen.findByText('Próxima'));
      }
    }

    await flushPixelMoodResolution();
    const frases = PIXEL_MOMENTS['errou-duas-vezes'].phrases;
    await waitFor(() => {
      expect(frases.some((f) => screen.queryByText(f) !== null)).toBe(true);
    });
    expect(screen.getByTestId('quiz-feedback-expression')).toHaveTextContent('revirando');
  });

  it('limpa o momento antes do feedback da próxima questão', async () => {
    // Mutação que esta assertiva pega: remover a limpeza de mood ao avançar
    // deixa a frase e orgulhoso vazarem para o feedback da quarta questão.
    montarQuiz(lessonQuatroQuestoes);

    for (const n of [1, 2, 3]) {
      expect(await screen.findByText(`Pergunta ${n}?`)).toBeTruthy();
      await responder(`Certa ${n}`);
      if (n < 3) {
        fireEvent.press(await screen.findByText('Próxima'));
      }
    }

    await flushPixelMoodResolution();
    await waitFor(() => {
      expect(
        PIXEL_MOMENTS['acertou-em-sequencia'].phrases.some((frase) => screen.queryByText(frase) !== null),
      ).toBe(true);
    });
    expect(screen.getByTestId('quiz-feedback-expression')).toHaveTextContent('orgulhoso');
    fireEvent.press(screen.getByText('Próxima'));
    expect(await screen.findByText('Pergunta 4?')).toBeTruthy();
    await responder('Errada 4');

    expect(screen.getByText('Incorreto')).toBeTruthy();
    expect(screen.getByTestId('quiz-feedback-expression')).toHaveTextContent('neutro');
    expect(
      PIXEL_MOMENTS['acertou-em-sequencia'].phrases.some((frase) => screen.queryByText(frase) !== null),
    ).toBe(false);
  });

  it('não ressuscita o momento se a resolução chega após avançar', async () => {
    // Mutação que esta assertiva pega: remover o guard de geração deixa uma
    // Promise tardia colocar orgulhoso no feedback posterior.
    let resolveMood: (value: { expression: 'orgulhoso'; phrase: string; phraseIndex: number }) => void;
    jest.spyOn(PixelMood, 'resolve').mockImplementation(
      () => new Promise((resolve) => { resolveMood = resolve; }),
    );
    montarQuiz(lessonQuatroQuestoes);

    for (const n of [1, 2, 3]) {
      expect(await screen.findByText(`Pergunta ${n}?`)).toBeTruthy();
      await responder(`Certa ${n}`);
      fireEvent.press(await screen.findByText('Próxima'));
    }

    expect(await screen.findByText('Pergunta 4?')).toBeTruthy();
    await responder('Errada 4');

    await act(async () => {
      resolveMood({
        expression: 'orgulhoso',
        phrase: PIXEL_MOMENTS['acertou-em-sequencia'].phrases[0],
        phraseIndex: 0,
      });
      await Promise.resolve();
    });

    expect(screen.getByText('Incorreto')).toBeTruthy();
    expect(screen.getByTestId('quiz-feedback-expression')).toHaveTextContent('neutro');
  });

  it('não soma acertos separados por erro', async () => {
    // Mutação que esta assertiva pega: deixar de zerar acertosSeguidos ao errar
    // faz Certa 1, Errada 2, Certa 3, Certa 4 disparar orgulhoso indevidamente.
    montarQuiz(lessonQuatroQuestoes);

    for (const [n, answer] of [[1, 'Certa'], [2, 'Errada'], [3, 'Certa'], [4, 'Certa']] as const) {
      expect(await screen.findByText(`Pergunta ${n}?`)).toBeTruthy();
      await responder(`${answer} ${n}`);
      if (n < 4) {
        fireEvent.press(await screen.findByText('Próxima'));
      }
    }

    expect(screen.getByText('Correto!')).toBeTruthy();
    expect(screen.getByTestId('quiz-feedback-expression')).toHaveTextContent('feliz');
    expect(
      PIXEL_MOMENTS['acertou-em-sequencia'].phrases.some((frase) => screen.queryByText(frase) !== null),
    ).toBe(false);
  });

  it('não soma erros separados por acerto', async () => {
    // Mutação que esta assertiva pega: deixar de zerar errosSeguidos ao acertar
    // faz Errada 1, Certa 2, Errada 3 disparar revirando indevidamente.
    montarQuiz(lessonTresQuestoes);

    for (const [n, answer] of [[1, 'Errada'], [2, 'Certa'], [3, 'Errada']] as const) {
      expect(await screen.findByText(`Pergunta ${n}?`)).toBeTruthy();
      await responder(`${answer} ${n}`);
      if (n < 3) {
        fireEvent.press(await screen.findByText('Próxima'));
      }
    }

    expect(screen.getByText('Incorreto')).toBeTruthy();
    expect(screen.getByTestId('quiz-feedback-expression')).toHaveTextContent('neutro');
    expect(
      PIXEL_MOMENTS['errou-duas-vezes'].phrases.some((frase) => screen.queryByText(frase) !== null),
    ).toBe(false);
  });

  it.each([
    ['returns null', () => jest.spyOn(PixelMood, 'resolve').mockResolvedValue(null)],
    ['rejects', () => jest.spyOn(PixelMood, 'resolve').mockRejectedValue(new Error('storage unavailable'))],
  ])('keeps the correct fallback when PixelMood %s', async (_caseName, configureResolve) => {
    // Mutação que esta assertiva pega: remover a integração inteira deixa
    // resolve sem chamada; remover o fallback ?? deixa o leaf ver sem-expression.
    const resolveSpy = configureResolve();
    montarQuiz(lessonTresQuestoes);

    for (const n of [1, 2, 3]) {
      expect(await screen.findByText(`Pergunta ${n}?`)).toBeTruthy();
      await responder(`Certa ${n}`);
      if (n < 3) {
        fireEvent.press(await screen.findByText('Próxima'));
      }
    }

    expect(resolveSpy).toHaveBeenCalledWith('acertou-em-sequencia');
    expect(screen.getByText('Correto!')).toBeTruthy();
    expect(screen.getByTestId('quiz-feedback-expression')).toHaveTextContent('feliz');
  });

  it.each([
    ['returns null', () => jest.spyOn(PixelMood, 'resolve').mockResolvedValue(null)],
    ['rejects', () => jest.spyOn(PixelMood, 'resolve').mockRejectedValue(new Error('storage unavailable'))],
  ])('keeps the incorrect fallback when PixelMood %s', async (_caseName, configureResolve) => {
    // Mutação que esta assertiva pega: remover a integração inteira deixa
    // resolve sem chamada; remover o fallback ?? deixa o leaf ver sem-expression.
    const resolveSpy = configureResolve();
    montarQuiz(lessonTresQuestoes);

    for (const n of [1, 2]) {
      expect(await screen.findByText(`Pergunta ${n}?`)).toBeTruthy();
      await responder(`Errada ${n}`);
      if (n < 2) {
        fireEvent.press(await screen.findByText('Próxima'));
      }
    }

    expect(resolveSpy).toHaveBeenCalledWith('errou-duas-vezes');
    expect(screen.getByText('Incorreto')).toBeTruthy();
    expect(screen.getByTestId('quiz-feedback-expression')).toHaveTextContent('neutro');
  });
});
