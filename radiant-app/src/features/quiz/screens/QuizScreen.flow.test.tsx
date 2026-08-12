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
  useScalePop: () => ({ style: {}, animateIn: jest.fn() }),
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
    AppButton: ({ children, onPress, disabled }: { children: React.ReactNode; onPress: () => void; disabled?: boolean }) => (
      <Pressable accessibilityRole="button" onPress={onPress} disabled={disabled}>
        <Text>{children}</Text>
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

jest.mock('../../../ui/components/HUD', () => ({
  HUD: () => null,
}));

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
    recordQuizCompletion: jest.fn().mockResolvedValue({
      completedToday: 1,
      goalPerDay: 3,
      isCompleted: false,
      dateKey: '2026-04-02',
    }),
  },
}));

jest.mock('../../journey/services/JourneyProgressService', () => ({
  JourneyProgressService: {
    markLessonNodeCompleted: jest.fn().mockResolvedValue(null),
    markReviewNodeCompleted: jest.fn().mockResolvedValue(null),
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

    expect(await screen.findByText('Resumo da tentativa')).toBeTruthy();

    await waitFor(() => {
      expect(mockedSpacedRepetitionService.recordQuizResult).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockedSyncQueueService.enqueueLessonProgressFromQuizResult).toHaveBeenCalled();
      expect(mockedSyncQueueService.flush).toHaveBeenCalled();
      expect(mockedGamificationService.recordQuizCompletion).toHaveBeenCalled();
      expect(mockedDailyGoalService.recordQuizCompletion).toHaveBeenCalled();
    });
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
