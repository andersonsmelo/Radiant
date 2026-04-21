import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import type { QuizLesson } from '../../../types/quiz';
import QuizScreen from './QuizScreen';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { SpacedRepetitionService } from '../../spaced-repetition/services/SpacedRepetitionService';
import { SyncQueueService } from '../../sync/SyncQueueService';
import { GamificationService } from '../../gamification/services/GamificationService';
import { DailyGoalService } from '../../daily-goal/services/DailyGoalService';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
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

describe('QuizScreen flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
});
