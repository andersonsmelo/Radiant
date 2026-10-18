import React from 'react';
import { fireEvent, screen, waitFor, within } from '@testing-library/react-native';
import { Alert, ScrollView, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { QuizQuestion } from '../../../types/quiz';
import ReviewScreen from './ReviewScreen';
import { renderWithProviders } from '../../../test/renderWithProviders';

const mockUseReview = jest.fn();

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
    dismissTo: jest.fn(),
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

jest.mock('../../../ui/components/HUD', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return { HUD: ({ totalXp }: { totalXp: number }) => <Text>{totalXp} XP</Text> };
});

jest.mock('../../gamification/services/GamificationService', () => ({
  GamificationService: {
    getSnapshot: jest.fn().mockResolvedValue({
      totalXp: 80,
      streakDays: 2,
    }),
  },
}));

jest.mock('../../hearts/HeartsRepository', () => ({
  heartsRepository: {
    getSnapshot: jest.fn().mockResolvedValue({ count: 2, status: 'recovering', nextRefillAt: null, unlimitedUntil: null }),
    rewardReview: jest.fn().mockResolvedValue({ count: 3, status: 'recovering', nextRefillAt: null, unlimitedUntil: null }),
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

    expect(await screen.findByText('Revise no seu ritmo')).toBeTruthy();
    const copy = screen.UNSAFE_getAllByType(Text).map(node => node.props.children);
    expect(copy.indexOf('Começar revisão')).toBeLessThan(copy.indexOf('Como essa sessão funciona'));

    fireEvent.press(screen.getByText('Começar revisão'));

    expect(startReview).toHaveBeenCalledTimes(1);
  });

  it('renders the active review session with the current item', async () => {
    const gamification = require('../../gamification/services/GamificationService').GamificationService;
    gamification.getSnapshot.mockResolvedValue({ totalXp: 80, streakDays: 2 });
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

    const view = renderWithProviders(<ReviewScreen />);

    expect(await screen.findByText('Qual achado deve ser revisto?')).toBeTruthy();
    expect(screen.getByText('Sessão ativa')).toBeTruthy();
    expect(screen.getByText('Confirmar resposta')).toBeTruthy();
    expect(await screen.findByText('80 XP')).toBeTruthy();
    // Short screens and enlarged text must be able to reach the entire card.
    const scrolls = screen.UNSAFE_getAllByType(ScrollView);
    expect(scrolls.some(scroll => within(scroll).queryByText(questionFixture.prompt))).toBe(true);
    const activeScroll = scrolls[0].instance;
    gamification.getSnapshot.mockResolvedValue({ totalXp: 84, streakDays: 2 });
    mockUseReview.mockReturnValue({
      state: 'finished', queue: [{ lessonId: 'lesson-1', question: questionFixture }],
      currentItem: null, currentIndex: 0, totalItems: 1, sessionXp: 4, loading: false,
      startReview: jest.fn(), submitRating: jest.fn(),
    });
    view.rerender(
      <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } }}>
        <ReviewScreen />
      </SafeAreaProvider>
    );
    expect(screen.UNSAFE_getByType(ScrollView).instance).not.toBe(activeScroll);
    expect(await screen.findByText('84 XP')).toBeTruthy();
  });

  it('recompensa uma vida uma única vez ao concluir a sessão devida', async () => {
    const heartsRepository = require('../../hearts/HeartsRepository').heartsRepository as {
      rewardReview: jest.Mock;
    };
    mockUseReview.mockReturnValue({
      state: 'finished',
      queue: [{ lessonId: 'lesson-1', question: questionFixture }],
      currentItem: null,
      currentIndex: 0,
      totalItems: 1,
      sessionXp: 4,
      loading: false,
      startReview: jest.fn(),
      submitRating: jest.fn(),
    });

    const rendered = renderWithProviders(<ReviewScreen />);
    await waitFor(() => expect(heartsRepository.rewardReview).toHaveBeenCalledTimes(1));
    rendered.rerender(<ReviewScreen />);
    expect(heartsRepository.rewardReview).toHaveBeenCalledTimes(1);
  });
});

describe('ReviewScreen — falha de persistência', () => {
  it('mostra indisponibilidade e retry, sem afirmar que não há revisão pendente', async () => {
    const retry = jest.fn();
    mockUseReview.mockReturnValue({ state: 'start', queue: [], currentItem: undefined, currentIndex: 0,
      totalItems: 0, sessionXp: 0, loading: false, startReview: jest.fn(), submitRating: jest.fn(),
      persistenceError: 'Não foi possível carregar sua revisão. Tente novamente.', retrySubmission: retry });
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    try {
      renderWithProviders(<ReviewScreen />);
      expect(screen.queryByText('Nenhuma revisão pendente')).toBeNull();
      fireEvent.press(screen.getByRole('button', { name: 'Tentar novamente' }));
      expect(retry).toHaveBeenCalledTimes(1);
    } finally { alert.mockRestore(); }
  });
});
