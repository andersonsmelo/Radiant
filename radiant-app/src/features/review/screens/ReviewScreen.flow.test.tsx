import React from 'react';
import { act, fireEvent, screen, waitFor, within } from '@testing-library/react-native';
import { ActivityIndicator, Alert, ScrollView, Text } from 'react-native';
import Svg from 'react-native-svg';
import { LessonCatalogService } from '../../content/services/LessonCatalogService';
import { JourneyDefinitionService } from '../../journey/services/JourneyDefinitionService';
import type { ReviewItem } from '../hooks/useReview';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { QuizQuestion } from '../../../types/quiz';
import ReviewScreen from './ReviewScreen';
import { renderWithProviders } from '../../../test/renderWithProviders';

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
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

jest.mock('../../../ui/motion', () => {
  const enter = { animatedStyle: {}, reset: jest.fn(), animateIn: jest.fn() };
  return ({
  MotionView: require('react-native').View,
  useMedalPulse: () => ({}),
  duration: {
    micro: 0,
    ui: 0,
    celebrate: 0,
  },
  useFadeInUp: () => ({ style: {}, animateIn: jest.fn() }),
  useCardEnter: () => enter,
  useShakeError: () => ({ style: {}, animateIn: jest.fn() }),
  usePressScale: () => ({
    animatedStyle: {},
    onPressIn: jest.fn(),
    onPressOut: jest.fn(),
  }),
});
});

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
    PixelHeroSplit: () => <View testID="forbidden-review-pixel" />,
  };
});

jest.mock('../../../components/ui/ProgressRing', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    ProgressRing: () => <View testID="forbidden-review-ring" />,
  };
});

jest.mock('../../../ui/illustrations/ThemeIllustration', () => ({ ThemeIllustration: () => null }));

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
    await act(async () => {});

    expect(await screen.findByText('Revisão')).toBeTruthy();
    fireEvent.press(screen.getByText('Começar'));

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
    await act(async () => {});
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
    await act(async () => {});
      expect(screen.queryByText('Nenhuma revisão pendente')).toBeNull();
      fireEvent.press(screen.getByRole('button', { name: 'Tentar novamente' }));
      expect(retry).toHaveBeenCalledTimes(1);
    } finally { alert.mockRestore(); }
  });

  it('descreve o formato de resposta antes do gabarito na abertura e diferencia visualmente acerto, consulta e erro no ReviewCard', async () => {
    mockUseReview.mockReturnValue({
      state: 'start',
      queue: [{ lessonId: 'lesson-1', question: questionFixture }],
      currentItem: null,
      currentIndex: 0,
      totalItems: 1,
      sessionXp: 0,
      loading: false,
      startReview: jest.fn(),
      submitRating: jest.fn(),
    });

    renderWithProviders(<ReviewScreen />);
    await act(async () => {});
    expect(await screen.findByText('Escolha uma alternativa e confirme, ou consulte a resposta com ajuda')).toBeTruthy();
    expect(screen.queryByText('Revele a resposta e avalie se lembrou de cada item')).toBeNull();

    const { ReviewCard } = require('../components/ReviewCard');
    const { StyleSheet } = require('react-native');
    const { semanticColors } = require('../../../ui/semantic-colors');

    const wrongCard = renderWithProviders(
      <ReviewCard
        question={questionFixture}
        onAnswer={jest.fn()}
        onContinue={jest.fn()}
        feedback={{ correct: false, assisted: false }}
        saving={false}
      />
    );
    const wrongLabelStyle = StyleSheet.flatten(wrongCard.getByTestId('review-feedback-label').props.style);
    expect(wrongLabelStyle.color).toBe(semanticColors.galaxy.statusError);
    expect(wrongLabelStyle.color).not.toBe(semanticColors.galaxy.statusSuccess);

    const assistedCard = renderWithProviders(
      <ReviewCard
        question={questionFixture}
        onAnswer={jest.fn()}
        onContinue={jest.fn()}
        feedback={{ correct: false, assisted: true }}
        saving={false}
      />
    );
    const assistedLabelStyle = StyleSheet.flatten(assistedCard.getByTestId('review-feedback-label').props.style);
    expect(assistedLabelStyle.color).toBe(semanticColors.galaxy.statusWarning);

    const correctCard = renderWithProviders(
      <ReviewCard
        question={questionFixture}
        onAnswer={jest.fn()}
        onContinue={jest.fn()}
        feedback={{ correct: true, assisted: false }}
        saving={false}
      />
    );
    const correctLabelStyle = StyleSheet.flatten(correctCard.getByTestId('review-feedback-label').props.style);
    expect(correctLabelStyle.color).toBe(semanticColors.galaxy.statusSuccess);
  });
});


// Real catalogs keep the origin contract honest: lessons use lessonId, checkpoints use node.id.
const catalogOrigins = LessonCatalogService.listTracks().flatMap(track =>
  JourneyDefinitionService.getTrackDefinition(track.id).units.flatMap(unit =>
    unit.nodes.filter(node => node.type === 'lesson' || node.type === 'checkpoint')
      .map(node => ({ unit, node, lessonId: node.lessonId ?? node.id }))));
const lessonOrigin = catalogOrigins.find(origin => origin.node.type === 'lesson')!;
const checkpointOrigin = catalogOrigins.find(origin => origin.node.type === 'checkpoint')!;
const otherUnitOrigin = catalogOrigins.find(origin => origin.unit.id !== lessonOrigin.unit.id)!;
const item = (lessonId: string, id = 'item:queue', history?: { lastAttemptId: string | null; lastReviewedAt: string }): ReviewItem => ({
  lessonId, question: { ...questionFixture, id },
  ...(history ? { card: { item: { lessonId, itemId: id, activityId: lessonId, competencyId: 'competency:queue', contentVersion: 'v1', evidenceKind: 'independent-recall' },
    easeFactor: 2.5, interval: 1, repetitions: 1, createdAt: '2026-01-01T00:00:00Z', dueAt: '2026-01-02T00:00:00Z', ...history } } : {}),
});
function queueState(queue: ReviewItem[], overrides = {}) {
  return { state: 'start', queue, currentItem: queue[0], currentIndex: 0, totalItems: queue.length,
    sessionXp: 0, loading: false, startReview: jest.fn(), submitAnswer: jest.fn(), continueReview: jest.fn(),
    answerFeedback: null, saving: false, persistenceError: null, retrySubmission: jest.fn(), ...overrides };
}

describe('T07 — fila real', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    require('../../gamification/services/GamificationService').GamificationService.getSnapshot.mockResolvedValue({ totalXp: 80, streakDays: 2 });
  });
  afterEach(() => jest.restoreAllMocks());

  it('lê título, contagem, itens e Começar nessa ordem, sem antecipar o gabarito', async () => {
    mockUseReview.mockReturnValue(queueState([item(lessonOrigin.lessonId)]));
    renderWithProviders(<ReviewScreen />);
    await act(async () => {});
    await screen.findByText('80 XP');
    const copy = screen.UNSAFE_getAllByType(Text).map(node => node.props.children);
    const count = `1 item de ${lessonOrigin.unit.title}. Leva uns 1 minuto.`;
    expect(screen.getByText(count)).toBeTruthy();
    expect(copy.indexOf('Revisão')).toBeLessThan(copy.indexOf(count));
    expect(copy.indexOf(count)).toBeLessThan(copy.indexOf(lessonOrigin.node.title));
    expect(copy.indexOf(lessonOrigin.node.title)).toBeLessThan(copy.indexOf('Começar'));
    expect(screen.queryByText(questionFixture.prompt)).toBeNull();
    expect(screen.queryByText('Como essa sessão funciona')).toBeNull();
  });

  it.each([[1, '1 item', '1 minuto'], [2, '2 itens', '1 minuto'], [3, '3 itens', '2 minutos']])(
    'estima %s itens sem alterar a fila', async (count, noun, time) => {
      const queue = Array.from({ length: count }, (_, index) => item(lessonOrigin.lessonId, `item:${index}`));
      mockUseReview.mockReturnValue(queueState(queue));
      renderWithProviders(<ReviewScreen />);
    await act(async () => {});
      expect(screen.getByText(`${noun} de ${lessonOrigin.unit.title}. Leva uns ${time}.`)).toBeTruthy();
      expect(screen.getAllByText(lessonOrigin.node.title)).toHaveLength(count);
    });

  it('mostra unidades mistas reais sem atribuir origem desconhecida à primeira unidade', async () => {
    mockUseReview.mockReturnValue(queueState([item(lessonOrigin.lessonId), item(otherUnitOrigin.lessonId, 'item:other'), item('unknown-origin', 'item:unknown')]));
    renderWithProviders(<ReviewScreen />);
    await act(async () => {});
    expect(screen.getByText('3 itens de diferentes origens. Leva uns 2 minutos.')).toBeTruthy();
    expect(screen.getByText(lessonOrigin.node.title)).toBeTruthy();
    expect(screen.getByText(otherUnitOrigin.node.title)).toBeTruthy();
    expect(screen.getByText('Origem desconhecida')).toBeTruthy();
    expect(screen.getAllByText(`${lessonOrigin.unit.title} · Última revisão sem registro`)).toHaveLength(1);
    expect(screen.getByRole('text', { name: 'Origem desconhecida. Última revisão sem registro' })).toBeTruthy();
  });

  it('usa o checkpoint canônico e desenha a medalha com diâmetro de 34 pt', async () => {
    mockUseReview.mockReturnValue(queueState([item(checkpointOrigin.lessonId)]));
    renderWithProviders(<ReviewScreen />);
    await act(async () => {});
    expect(screen.getByText(checkpointOrigin.node.title)).toBeTruthy();
    expect(screen.UNSAFE_getAllByType(Svg).some(svg => svg.props.width === 34)).toBe(true);
  });

  it('origem desconhecida não inventa medalha nem título de aula', async () => {
    mockUseReview.mockReturnValue(queueState([item('unknown-origin')]));
    renderWithProviders(<ReviewScreen />);
    await act(async () => {});
    expect(screen.getByText('Origem desconhecida')).toBeTruthy();
    expect(screen.UNSAFE_queryAllByType(Svg)).toHaveLength(0);
    expect(screen.getByText('1 item de origem desconhecida. Leva uns 1 minuto.')).toBeTruthy();
  });

  it.each([
    ['seed', { lastAttemptId: null, lastReviewedAt: new Date().toISOString() }],
    ['data ausente', { lastAttemptId: 'attempt', lastReviewedAt: '' }],
    ['data inválida', { lastAttemptId: 'attempt', lastReviewedAt: 'invalid' }],
    ['data futura', { lastAttemptId: 'attempt', lastReviewedAt: new Date(Date.now() + 86400000).toISOString() }],
    ['sem cartão', undefined],
  ])('não fabrica última revisão para %s', async (_, history) => {
    mockUseReview.mockReturnValue(queueState([item(lessonOrigin.lessonId, 'item:history', history)]));
    renderWithProviders(<ReviewScreen />);
    await act(async () => {});
    expect(screen.getByText(`${lessonOrigin.unit.title} · Última revisão sem registro`)).toBeTruthy();
  });

  it('exibe revisão anterior confirmada sem alegar última visualização', async () => {
    mockUseReview.mockReturnValue(queueState([item(lessonOrigin.lessonId, 'item:history', {
      lastAttemptId: 'attempt', lastReviewedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    })]));
    renderWithProviders(<ReviewScreen />);
    await act(async () => {});
    expect(screen.getByText(`${lessonOrigin.unit.title} · Revisado há 2 dias`)).toBeTruthy();
  });

  it.each(['start', 'review', 'finished'])('retira Pixel e anel no estado %s', async state => {
    mockUseReview.mockReturnValue(queueState([item(lessonOrigin.lessonId)], { state }));
    renderWithProviders(<ReviewScreen />);
    await act(async () => {});
    await screen.findByText('80 XP');
    expect(screen.queryByTestId('forbidden-review-pixel')).toBeNull();
    expect(screen.queryByTestId('forbidden-review-ring')).toBeNull();
    if (state === 'review') expect(screen.getByText('1/1')).toBeTruthy();
  });

  it('fila vazia não oferece Começar, estimativa ou recompensa', async () => {
    const hearts = require('../../hearts/HeartsRepository').heartsRepository;
    mockUseReview.mockReturnValue(queueState([]));
    renderWithProviders(<ReviewScreen />);
    await act(async () => {});
    await screen.findByText('80 XP');
    expect(screen.getByText('Nenhuma revisão pendente')).toBeTruthy();
    expect(screen.queryByText('Começar')).toBeNull();
    expect(screen.queryByText(/Leva uns/)).toBeNull();
    expect(hearts.rewardReview).not.toHaveBeenCalled();
  });

  it('loading não se apresenta como fila vazia', async () => {
    mockUseReview.mockReturnValue(queueState([], { state: 'loading', loading: true }));
    renderWithProviders(<ReviewScreen />);
    await act(async () => {});
    expect(screen.UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    expect(screen.queryByText('Nenhuma revisão pendente')).toBeNull();
  });

  it('conclusão conserva saída, resultado e vida única em rerender e remount da mesma fila', async () => {
    const hearts = require('../../hearts/HeartsRepository').heartsRepository;
    const { router } = require('expo-router');
    const queue = [item(lessonOrigin.lessonId)];
    mockUseReview.mockReturnValue(queueState(queue, { state: 'finished', sessionXp: 4 }));
    const view = renderWithProviders(<ReviewScreen />);
    await waitFor(() => expect(hearts.rewardReview).toHaveBeenCalledTimes(1));
    expect(screen.getByText('Resultado da sessão')).toBeTruthy();
    expect(screen.getByText('+4 XP confirmado')).toBeTruthy();
    view.rerender(<SafeAreaProvider><ReviewScreen /></SafeAreaProvider>);
    await act(async () => {});
    view.unmount();
    renderWithProviders(<ReviewScreen />);
    await act(async () => {});
    await screen.findByText('80 XP');
    expect(hearts.rewardReview).toHaveBeenCalledTimes(1);
    fireEvent.press(screen.getByRole('button', { name: 'Voltar para jornada' }));
    expect(router.dismissTo).toHaveBeenCalledWith('/(tabs)');
  });

  it('empty finished não premia mesmo sem outra barreira de fila', async () => {
    const hearts = require('../../hearts/HeartsRepository').heartsRepository;
    mockUseReview.mockReturnValue(queueState([], { state: 'finished' }));
    renderWithProviders(<ReviewScreen />);
    await act(async () => {});
    expect(hearts.rewardReview).not.toHaveBeenCalled();
  });

  it('falha nativa no prêmio permite nova tentativa da mesma fila', async () => {
    const hearts = require('../../hearts/HeartsRepository').heartsRepository;
    const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const queue = [item(lessonOrigin.lessonId)];
    hearts.rewardReview.mockRejectedValueOnce(Error('native-award-failure'));
    mockUseReview.mockReturnValue(queueState(queue, { state: 'finished' }));
    const failed = renderWithProviders(<ReviewScreen />);
    await waitFor(() => expect(error).toHaveBeenCalled());
    failed.unmount();
    renderWithProviders(<ReviewScreen />);
    await act(async () => {});
    await waitFor(() => expect(hearts.rewardReview).toHaveBeenCalledTimes(2));
  });


  it('sessão ativa não premia uma fila válida ainda não concluída', async () => {
    const hearts = require('../../hearts/HeartsRepository').heartsRepository;
    mockUseReview.mockReturnValue(queueState([item(lessonOrigin.lessonId)], { state: 'review' }));
    renderWithProviders(<ReviewScreen />);
    await act(async () => {});
    expect(hearts.rewardReview).not.toHaveBeenCalled();
  });

  it.each([[1, 3.1], [3.1, 2.5]])('fonte %s → %s renova só textos da fila sem reiniciar sessão ou controles', async (from, to) => {
    const window = { width: 390, height: 844, scale: 3, fontScale: from };
    jest.spyOn(require('react-native'), 'useWindowDimensions').mockImplementation(() => window);
    const state = queueState([item(lessonOrigin.lessonId)]);
    mockUseReview.mockReturnValue(state);
    const view = renderWithProviders(<ReviewScreen />);
    await screen.findByText('80 XP');
    const labels = ['Revisão', `1 item de ${lessonOrigin.unit.title}. Leva uns 1 minuto.`, lessonOrigin.node.title, `${lessonOrigin.unit.title} · Última revisão sem registro`, 'Escolha uma alternativa e confirme, ou consulte a resposta com ajuda'];
    const oldTexts = new Map(labels.map(label => [label, screen.getByText(label)]));
    const oldButton = screen.getByRole('button', { name: 'Começar' });
    window.fontScale = to;
    view.rerender(<SafeAreaProvider><ReviewScreen /></SafeAreaProvider>);
    await act(async () => {});
    expect(labels.filter(label => screen.getByText(label) === oldTexts.get(label))).toEqual([]);
    expect(screen.getByRole('button', { name: 'Começar' })).toBe(oldButton);
    expect(state.startReview).not.toHaveBeenCalled();
    expect(require('../../hearts/HeartsRepository').heartsRepository.rewardReview).not.toHaveBeenCalled();
  });
});


describe('T07 — continuidade dos controles de resposta e resumo', () => {
  afterEach(() => jest.restoreAllMocks());
  beforeEach(() => {
    jest.clearAllMocks();
    require('../../gamification/services/GamificationService').GamificationService.getSnapshot.mockResolvedValue({ totalXp: 80, streakDays: 2 });
  });
  it('encaminha escolha e confirmação ao hook; só mostra feedback quando o hook confirma, depois encaminha Continuar', async () => {
    const state = queueState([item(lessonOrigin.lessonId)], { state: 'review' });
    mockUseReview.mockReturnValue(state);
    const view = renderWithProviders(<ReviewScreen />);
    await act(async () => {});
    fireEvent.press(screen.getByTestId('review-option-1'));
    expect(state.submitAnswer).not.toHaveBeenCalled();
    expect(screen.queryByText(questionFixture.explanation)).toBeNull();
    fireEvent.press(screen.getByRole('button', { name: 'Confirmar resposta' }));
    expect(state.submitAnswer).toHaveBeenCalledWith(1);
    expect(screen.queryByText(questionFixture.explanation)).toBeNull();
    mockUseReview.mockReturnValue({ ...state, answerFeedback: { correct: false, assisted: false } });
    view.rerender(<SafeAreaProvider><ReviewScreen /></SafeAreaProvider>);
    expect(screen.getByText(questionFixture.explanation)).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Continuar' }));
    expect(state.continueReview).toHaveBeenCalledTimes(1);
    await act(async () => {});
  });

  it('encaminha ajuda como resposta nula sem revelar gabarito por conta própria', async () => {
    const state = queueState([item(lessonOrigin.lessonId)], { state: 'review' });
    mockUseReview.mockReturnValue(state);
    renderWithProviders(<ReviewScreen />);
    await act(async () => {});
    fireEvent.press(screen.getByRole('button', { name: 'Ver resposta com ajuda' }));
    expect(state.submitAnswer).toHaveBeenCalledWith(null);
    expect(screen.queryByText(questionFixture.explanation)).toBeNull();
    await act(async () => {});
  });

  it.each([[1, 3.1], [3.1, 2.5]])('resumo com fonte %s → %s conserva prêmio e botão, renovando seus textos', async (from, to) => {
    const window = { width: 390, height: 844, scale: 3, fontScale: from };
    jest.spyOn(require('react-native'), 'useWindowDimensions').mockReturnValue(window);
    const hearts = require('../../hearts/HeartsRepository').heartsRepository;
    const state = queueState([item(lessonOrigin.lessonId)], { state: 'finished', sessionXp: 4 });
    mockUseReview.mockReturnValue(state);
    const view = renderWithProviders(<ReviewScreen />);
    await waitFor(() => expect(hearts.rewardReview).toHaveBeenCalledTimes(1));
    const labels = ['Revisão', 'Resultado da sessão', 'Itens', '1 concluído nesta rodada', 'XP', '+4 XP confirmado', 'Estado', 'Revisão salva neste aparelho', 'Fila limpa'];
    const texts = new Map(labels.map(label => [label, screen.getByText(label)]));
    const button = screen.getByRole('button', { name: 'Voltar para jornada' });
    window.fontScale = to;
    view.rerender(<SafeAreaProvider><ReviewScreen /></SafeAreaProvider>);
    await act(async () => {});
    expect(labels.filter(label => screen.getByText(label) === texts.get(label))).toEqual([]);
    expect(screen.getByRole('button', { name: 'Voltar para jornada' })).toBe(button);
    expect(hearts.rewardReview).toHaveBeenCalledTimes(1);
  });
});

// FIX1 / R1-01: calendar wording is independent of an elapsed 24-hour bucket.
describe('FIX1 — histórico verdadeiro na virada do dia local', () => {
  afterEach(() => jest.restoreAllMocks());
  it.each([
    ['mesmo dia local', () => new Date(2026, 9, 28, 0, 5).getTime(), 'Revisado hoje'],
    ['cruzou meia-noite há 20 minutos', () => new Date(2026, 9, 27, 23, 50).getTime(), 'Revisado há menos de 1 dia'],
    ['intervalo real de três dias', (now: number) => now - 3 * 86400000, 'Revisado há 3 dias'],
  ])('%s', async (_, reviewedAt, expected) => {
    // Local constructors work in the host/CI timezone; ISO preserves their actual instants.
    const now = new Date(2026, 9, 28, 0, 10).getTime();
    jest.spyOn(Date, 'now').mockReturnValue(now);
    mockUseReview.mockReturnValue(queueState([item(lessonOrigin.lessonId, 'item:midnight', {
      lastAttemptId: 'attempt:confirmed', lastReviewedAt: new Date(reviewedAt(now)).toISOString(),
    })]));
    renderWithProviders(<ReviewScreen />);
    await act(async () => {});
    expect(screen.getByText(`${lessonOrigin.unit.title} · ${expected}`)).toBeTruthy();
  });
});
