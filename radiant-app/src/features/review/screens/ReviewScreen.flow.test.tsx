import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import type { QuizQuestion } from '../../../types/quiz';
import ReviewScreen from './ReviewScreen';
import { renderWithProviders } from '../../../test/renderWithProviders';

const mockUseReview = jest.fn();

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
  useCardEnter: () => ({ animatedStyle: {}, reset: jest.fn(), animateIn: jest.fn() }),
  useShakeError: () => ({ style: {}, animateIn: jest.fn() }),
  usePressScale: () => ({
    animatedStyle: {},
    onPressIn: jest.fn(),
    onPressOut: jest.fn(),
  }),
}));

jest.mock('../../../components/ui/AppButton', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');

  return {
    AppButton: ({ children, onPress, disabled }: { children: React.ReactNode; onPress: () => void; disabled?: boolean }) => (
      <Pressable accessibilityRole="button" onPress={onPress} disabled={disabled}>
        <Text onPress={onPress}>{children}</Text>
      </Pressable>
    ),
  };
});

jest.mock('../../../components/ui/PixelHeroSplit', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    PixelHeroSplit: () => <View />,
  };
});

jest.mock('../../../components/ui/ProgressRing', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    ProgressRing: () => <View />,
  };
});

jest.mock('../../../ui/components/StarfieldBackground', () => ({
  StarfieldBackground: () => null,
}));

jest.mock('../../../ui/components/HUD', () => ({
  HUD: () => null,
}));

jest.mock('../../gamification/services/GamificationService', () => ({
  GamificationService: {
    getSnapshot: jest.fn().mockResolvedValue({
      totalXp: 80,
      streakDays: 2,
      hearts: 5,
      maxHearts: 5,
    }),
  },
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

jest.mock('../hooks/useReview', () => ({
  useReview: () => mockUseReview(),
}));

const questionFixture: QuizQuestion = {
  id: 'review-question-1',
  type: 'multiple-choice',
  prompt: 'Qual achado deve ser revisto?',
  options: [
    { label: 'Derrame pleural' },
    { label: 'Pneumoperitônio' },
  ],
  correctAnswerIndex: 0,
  explanation: 'O apagamento do seio costofrênico é compatível com derrame pleural.',
};

describe('ReviewScreen flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('starts the review session from the intro state', async () => {
    const startReview = jest.fn();

    mockUseReview.mockReturnValue({
      state: 'start',
      queue: [{ lessonId: 'lesson-1', question: questionFixture }],
      currentItem: null,
      currentIndex: 0,
      totalItems: 1,
      sessionXp: 0,
      loading: false,
      startReview,
      submitRating: jest.fn(),
    });

    renderWithProviders(<ReviewScreen />);

    expect(await screen.findByText('Pronto para limpar a fila?')).toBeTruthy();

    fireEvent.press(screen.getByText('Começar revisão'));

    expect(startReview).toHaveBeenCalledTimes(1);
  });

  it('renders the active review session with the current item', async () => {
    mockUseReview.mockReturnValue({
      state: 'review',
      queue: [{ lessonId: 'lesson-1', question: questionFixture }],
      currentItem: { lessonId: 'lesson-1', question: questionFixture },
      currentIndex: 0,
      totalItems: 1,
      sessionXp: 0,
      loading: false,
      startReview: jest.fn(),
      submitRating: jest.fn(),
    });

    renderWithProviders(<ReviewScreen />);

    expect(await screen.findByText('Qual achado deve ser revisto?')).toBeTruthy();
    expect(screen.getByText('Sessão ativa')).toBeTruthy();
    expect(screen.getByText('Mostrar resposta')).toBeTruthy();
  });
});
