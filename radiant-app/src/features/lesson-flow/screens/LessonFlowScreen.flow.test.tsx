import React from 'react';
import { act, fireEvent, screen, waitFor, within } from '@testing-library/react-native';
import { AccessibilityInfo, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { LessonBlock } from '../../../types/lessonFlow';
import { Confetti } from '../../../components/ui/Confetti';
import { JourneyMedal } from '../../journey/components/JourneyMedal';
import { LessonCatalogService } from '../../content/services/LessonCatalogService';
import type { LearningInteractionV2, LearningActivityV2 } from '../../../types/learningActivity';
import LessonFlowScreen from './LessonFlowScreen';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { LessonOutcomeService } from '../services/LessonOutcomeService';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';
import { LessonFlowService } from '../services/LessonFlowService';
import { LearningAttemptsRepository } from '../../progress/services/LearningAttemptsRepository';
import { LessonRatingService } from '../../quiz/services/LessonRatingService';
import { router } from 'expo-router';
import { subscriptionService } from '../../subscription/SubscriptionService';
import JourneyHomeScreen from '../../journey/screens/JourneyHomeScreen';
import LearnRoute from '../../../app/learn';
import { NextNodeResolver } from '../../journey/services/NextNodeResolver';
import type { JourneySnapshot } from '../../../types/journey';
import { semanticColors } from '../../../ui/semantic-colors';
import { EXPOSICAO } from '../../bench/lessons/exposicao';

const mockedSubscription = subscriptionService as jest.Mocked<typeof subscriptionService>;

const mockedOutcome = LessonOutcomeService as jest.Mocked<typeof LessonOutcomeService>;
const mockedJourneyProgress = JourneyProgressService as jest.Mocked<typeof JourneyProgressService>;
const mockedLessonFlowService = LessonFlowService as jest.Mocked<typeof LessonFlowService>;
const mockedRouter = router as jest.Mocked<typeof router>;
const announceForAccessibility = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');

// Foco controlável: a tela relê as vidas ao voltar de outra rota, e o teste
// precisa simular essa volta sem desmontar a tela.
const mockFocusCallbacks = new Set<() => void>();
let mockLearnParams: Record<string, string> = {};
function voltarParaATela() {
  act(() => mockFocusCallbacks.forEach(callback => callback()));
}

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => mockLearnParams,
  router: {
    replace: jest.fn(),
    dismissTo: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  },
  useFocusEffect: (callback: () => void | (() => void)) => {
    const React = require('react');
    React.useEffect(() => {
      mockFocusCallbacks.add(callback);
      const cleanup = callback();
      return () => {
        mockFocusCallbacks.delete(callback);
        if (typeof cleanup === 'function') cleanup();
      };
    }, [callback]);
  },
}));

jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

// O serviço real de conclusão (ver a suíte da primeira resposta) importa módulos
// que leem o AsyncStorage na carga; o dublê oficial evita o módulo nativo.
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

// A bancada desenha com Skia, que o Jest não rasteriza: o dublê deixa a tela da
// lição montar a bancada. O que se mede aqui é o texto do retorno, não a imagem.

jest.mock('../../../ui/illustrations/ThemeIllustration', () => ({ ThemeIllustration: () => null }));

jest.mock('../../../ui/motion', () => ({
  ...jest.requireActual('../../../ui/motion'),
  useMedalPulse: () => ({}),
  duration: { micro: 0, ui: 0, celebrate: 0 },
  useFadeInUp: () => ({ style: {}, animateIn: jest.fn() }),
  // A cunhagem e as estrelas do resumo usam os hooks reais importados acima.
  useScalePop: () => ({ scale: { setValue: jest.fn() }, style: {}, animateIn: jest.fn() }),
  useCardEnter: () => ({ animatedStyle: {}, reset: jest.fn(), animateIn: jest.fn() }),
  usePressScale: () => ({ animatedStyle: {}, onPressIn: jest.fn(), onPressOut: jest.fn() }),
  useShakeError: () => ({ style: {}, animateIn: jest.fn() }),
}));

jest.mock('../../../components/ui/AppButton', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');

  return {
    AppButton: ({ children, label, onPress, disabled, accessibilityLabel, accessibilityHint }: {
      children?: React.ReactNode; label?: string; onPress: () => void; disabled?: boolean;
      accessibilityLabel?: string; accessibilityHint?: string;
    }) => (
      <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint} onPress={onPress} disabled={disabled}>
        <Text>{label ?? children}</Text>
      </Pressable>
    ),
  };
});

jest.mock('../../../ui/components/StarfieldBackground', () => ({
  StarfieldBackground: () => null,
}));

// `QuizTopBar` renderiza as vidas pela pílula compartilhada `HeartsCountPill`, e os ícones do HUD são
// vetor animado em `react-native-svg` — que não monta sob este renderer.
jest.mock('../../../ui/components/HUD', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    HUD: () => null,
    HeartsCountPill: () => <View testID="hearts-display" />,
  };
});

jest.mock('../../journey/services/JourneyProgressService', () => ({
  JourneyProgressService: {
    setCurrentNode: jest.fn().mockResolvedValue(undefined),
    bootstrap: jest.fn(),
    getSnapshotForNode: jest.fn().mockResolvedValue({ track: { units: [] } }),
    setResumableNode: jest.fn().mockResolvedValue(undefined),
    // Devolve um snapshot porque a tela USA o retorno para localizar a unidade
    // ativa. Ler o snapshot à parte correria em paralelo com esta escrita e
    // poderia mostrar a unidade sem a lição que acabou de fechar.
    markNodeCompleted: jest.fn().mockResolvedValue({ track: { units: [] } }),
  },
}));

// Integração da retomada: somente I/O e a trilha fora do objetivo são isolados.
// Card, resolver, helper de rota, /learn e player permanecem reais.
jest.mock('../../telemetry/hooks/useAppOpenLifecycle', () => ({ useAppOpenLifecycle: () => undefined }));
// A integração de retomada monta a Home da trilha, que agenda o lembrete
// diário ao ganhar foco (ADR de 2026-10-16). O serviço real fala com o
// AsyncStorage nativo; aqui ele só precisa existir.
jest.mock('../../push/services/PushService', () => ({
  PushService: {
    scheduleDailyIfEligible: jest.fn().mockResolvedValue(undefined),
    getOptIn: jest.fn().mockResolvedValue(true),
    setOptIn: jest.fn().mockResolvedValue(undefined),
  },
}));
jest.mock('../../telemetry/TelemetryService', () => ({
  TelemetryService: { track: jest.fn().mockResolvedValue(undefined) },
}));
jest.mock('../../journey/services/JourneyCurriculumService', () => ({
  JourneyCurriculumService: { getCurriculumTrail: jest.fn().mockResolvedValue({ segments: [] }) },
}));
jest.mock('../../journey/components/JourneyTrail', () => {
  const React = require('react');
  const { View } = require('react-native');
  return { JourneyTrail: ({ header, recommendedAction }: { header: React.ReactNode; recommendedAction?: React.ReactNode }) => <View>{header}{recommendedAction}</View> };
});

jest.mock('../../gamification/services/GamificationService', () => ({
  GamificationService: {
    recordQuizCompletion: jest.fn(),
    getSnapshot: jest.fn().mockResolvedValue({
      totalXp: 40,
      streakDays: 2,
      lastActiveDate: '2026-08-15',
    }),
  },
}));

jest.mock('../../hearts/HeartsRepository', () => ({
  heartsRepository: {
    getSnapshot: jest.fn().mockResolvedValue({ count: 5, status: 'full', nextRefillAt: null, unlimitedUntil: null }),
    spend: jest.fn().mockResolvedValue({ count: 4, status: 'recovering', nextRefillAt: '2026-09-14T12:30:00.000Z', unlimitedUntil: null }),
  },
}));

jest.mock('../../subscription/SubscriptionService', () => ({
  subscriptionService: { storeAvailable: jest.fn(() => false) },
}));

jest.mock('../../hearts/components/HeartsSheet', () => {
  const React = require('react');
  const { Text } = require('react-native');
  const { Pressable } = require('react-native');
  return {
    HeartsSheet: ({ visible, storeAvailable, onSubscribe, dueReviewCount, onReview, onClose }: { visible: boolean; storeAvailable: boolean; onSubscribe: () => void; dueReviewCount: number; onReview: () => void; onClose: () => void }) =>
      visible ? (
        <>
          <Text>Sua lição está pausada</Text>
          <Text>{storeAvailable ? 'folha: com assinatura' : 'folha: sem assinatura'}</Text>
          <Text>{`A revisar: ${dueReviewCount}`}</Text>
          <Pressable accessibilityRole="button" onPress={onSubscribe}><Text>Assinar pela folha</Text></Pressable>
          {dueReviewCount > 0 ? <Pressable accessibilityRole="button" onPress={onReview}><Text>Revisar pela folha</Text></Pressable> : null}
          <Pressable accessibilityRole="button" onPress={onClose}><Text>Fechar folha</Text></Pressable>
        </>
      ) : null,
  };
});

jest.mock('../../spaced-repetition/services/SpacedRepetitionService', () => ({
  SpacedRepetitionService: {
    getCardState: jest.fn().mockResolvedValue(null),
  },
}));

jest.mock('../../progress/services/LearningAttemptsRepository', () => ({
  LearningAttemptsRepository: { getAll: jest.fn().mockResolvedValue([]) },
}));

jest.mock('../../quiz/services/LessonRatingService', () => ({
  LessonRatingService: {
    getRating: jest.fn().mockResolvedValue(null),
    rate: jest.fn().mockResolvedValue(undefined),
  },
}));



jest.mock('../../../ui/feedback/haptics', () => ({
  hapticCelebrate: jest.fn(),
  hapticSelection: jest.fn(),
  hapticError: jest.fn(),
  hapticSuccess: jest.fn(),
  hapticLifeLost: jest.fn(),
  hapticStreak: jest.fn(),
}));

// Os sons são o mesmo tocador do piloto (`lessonSounds.ts`); aqui só se mede
// o que a lição pede. Um objeto só, para os testes lerem as chamadas.
const mockSoundPlayer = { play: jest.fn(), release: jest.fn() };
jest.mock('../../../ui/feedback/lessonSounds', () => ({
  createLessonSoundPlayer: jest.fn(() => mockSoundPlayer),
}));

jest.mock('../../../ui/feedback/feedbackPreferences', () => ({
  readFeedbackPreferences: jest.fn().mockResolvedValue({ sounds: true, haptics: true }),
}));

// O tipo do nó decide se errar custa vida (ADR de 2026-10-16: revisão não
// custa). Padrão `lesson`; a suíte da revisão troca para `review`.
jest.mock('../../journey/services/JourneyDefinitionService', () => ({
  JourneyDefinitionService: { getNodeType: jest.fn(() => 'lesson'), getTrackDefinition: jest.fn(() => ({ units: [] })) },
}));

jest.mock('../services/LessonFlowService', () => ({
  LessonFlowService: {
    getBlockById: jest.fn(),
    getActivityById: jest.fn(),
  },
}));

// A tentativa devolvida pelo serviço é o que a conclusão renderiza: estrelas,
// placar e o carimbo `answeredAt` que `resolveBestLessonStars` usa para excluir
// esta tentativa do histórico ao calcular a melhor anterior.
const outcomeFixture = {
  award: null,
  rewarded: true,
  result: {
    lessonId: 'lesson-1',
    totalQuestions: 1,
    correctAnswers: 1,
    answeredAt: new Date('2026-08-15T12:00:00.000Z'),
  },
};

jest.mock('../services/LessonOutcomeService', () => ({
  LessonOutcomeService: {
    recordCompletion: jest.fn(),
    recordActivityCompletion: jest.fn(),
  },
}));

const blockFixture: LessonBlock = {
  id: 'block-1',
  lessonId: 'lesson-1',
  steps: [
    {
      step: {
        type: 'multiple-choice',
        payload: {
          prompt: 'Qual padrão radiográfico está presente?',
          options: [
            { id: 'opt-a', label: 'Pneumotórax' },
            { id: 'opt-b', label: 'Consolidação alveolar' },
          ],
          correctOptionId: 'opt-b',
          explanation: 'A opacidade focal com broncograma aéreo sugere consolidação alveolar.',
        },
      },
      contract: {
        id: 'step-choice',
        type: 'multiple-choice',
        completionRule: 'answered',
        retryRule: 'retry_same_step',
        branching: 'none',
      },
    },
    {
      step: {
        type: 'reinforce',
        payload: {
          title: 'Vamos reforçar',
          body: 'Revise o padrão antes de seguir.',
          tone: 'corrective',
        },
      },
      contract: {
        id: 'step-reinforce',
        type: 'reinforce',
        completionRule: 'displayed',
        retryRule: 'allow_continue',
        branching: 'none',
      },
    },
  ],
};

// Fixture deliberadamente diferente de blockFixture: aqui o passo interativo
// (multiple-choice) É o último do bloco (contexto -> escolha). Arity 2, uma
// única etapa interativa, contexto antes da interação, sem reinforce — passa
// em LessonFlowService.validateBlock (2 a 4 passos). Em blockFixture o passo
// interativo é o PRIMEIRO, então o "Continuar" final roda depois de um ciclo
// de render inteiro, com o estado já assentado; aqui, confirmar e concluir
// acontecem na MESMA chamada de handleContinue — é essa corrida que este
// bloco existe para exercitar.
const lastStepInteractiveFixture: LessonBlock = {
  id: 'block-2',
  lessonId: 'lesson-2',
  steps: [
    {
      step: {
        type: 'context',
        payload: {
          title: 'Antes de responder',
          body: 'Observe a imagem com atenção.',
        },
      },
      contract: {
        id: 'step-context',
        type: 'context',
        completionRule: 'displayed',
        retryRule: 'allow_continue',
        branching: 'none',
      },
    },
    {
      step: {
        type: 'multiple-choice',
        payload: {
          prompt: 'Qual padrão radiográfico está presente?',
          options: [
            { id: 'opt-a', label: 'Pneumotórax' },
            { id: 'opt-b', label: 'Consolidação alveolar' },
          ],
          correctOptionId: 'opt-b',
          explanation: 'A opacidade focal com broncograma aéreo sugere consolidação alveolar.',
        },
      },
      contract: {
        id: 'step-final-choice',
        type: 'multiple-choice',
        completionRule: 'answered',
        retryRule: 'retry_same_step',
        branching: 'none',
      },
    },
  ],
};

const privacySafeResumeFixture: LessonBlock = {
  id: 'block-3',
  lessonId: 'lesson-3',
  steps: [
    {
      step: { type: 'context', payload: { title: 'Contexto inicial', body: 'Observe antes de responder.' } },
      contract: {
        id: 'step-context',
        type: 'context',
        completionRule: 'displayed',
        retryRule: 'allow_continue',
        branching: 'none',
      },
    },
    {
      step: {
        type: 'multiple-choice',
        payload: {
          prompt: 'Qual achado deve ser confirmado novamente?',
          options: [
            { id: 'opt-a', label: 'Achado A' },
            { id: 'opt-b', label: 'Achado B' },
          ],
          correctOptionId: 'opt-b',
          explanation: 'A retomada não pode presumir uma resposta anterior.',
        },
      },
      contract: {
        id: 'step-private-choice',
        type: 'multiple-choice',
        completionRule: 'answered',
        retryRule: 'retry_same_step',
        branching: 'none',
      },
    },
    {
      step: { type: 'reinforce', payload: { title: 'Reforço final', body: 'Conteúdo posterior.', tone: 'corrective' } },
      contract: {
        id: 'step-reinforce',
        type: 'reinforce',
        completionRule: 'displayed',
        retryRule: 'allow_continue',
        branching: 'none',
      },
    },
  ],
};

const promotedActivityFixture: LearningActivityV2 = {
  id: 'activity:materia-energia-e-radiacao:01',
  competencyIds: ['competency:materia-energia-e-radiacao:estrutura-atomica-e-ionizacao'],
  provenance: {
    contentVersion: 'h4-materia-energia-e-radiacao-candidate-2026-08-13',
    sourceIds: ['source:h4:s1'],
  },
  steps: [
    {
      kind: 'presentation',
      id: 'activity-01-hook',
      role: 'hook',
      payload: { title: 'Estrutura e carga', body: 'Átomos têm partículas com cargas diferentes.' },
    },
    {
      kind: 'interaction',
      interaction: {
        id: 'activity-01-question',
        type: 'multiple-choice',
        competencyIds: ['competency:materia-energia-e-radiacao:estrutura-atomica-e-ionizacao'],
        evidenceKind: 'guided-practice',
        completionRule: 'answered',
        criticalSafety: false,
        feedback: { correct: 'Elétrons têm carga negativa.', incorrect: 'Compare as cargas.' },
        accessibility: { label: 'Qual partícula tem carga negativa?' },
        payload: {
          prompt: 'Qual partícula tem carga negativa?',
          options: [{ id: 'proton', label: 'Próton' }, { id: 'eletron', label: 'Elétron' }],
          correctOptionId: 'eletron',
        },
      },
    },
    {
      kind: 'presentation',
      id: 'activity-01-closing',
      role: 'closing',
      payload: { title: 'Síntese', body: 'Elétrons têm carga negativa.' },
    },
  ],
};

// Aquece a árvore da lição uma vez, fora de qualquer teste.
//
// Medido em 2026-09-23: a primeira vez que o arquivo desenha o passo custa
// ~450 ms só de estreia (compilação e JIT do renderer e dos componentes), e as
// seguintes ~55 ms. Esse custo caía dentro do `findByText` do primeiro teste,
// cujo prazo é 1000 ms — no runner do GitHub, bem mais lento, ele ficou no
// limite e reprovou o CI da PR #18 (run 35882627298) sem nenhuma regressão da
// tela. Com a CPU presa aos núcleos de eficiência (`taskpolicy -b`), o teste
// reprovava 3 de 3 localmente, em 2,5–3,1 s. O prazo do `findByText` existe
// para medir a tela, não o aquecimento do ambiente: aumentá-lo esconderia o
// custo; aqui ele sai da janela e ganha um orçamento próprio.
beforeAll(async () => {
  mockedLessonFlowService.getBlockById.mockReturnValue(blockFixture);
  mockedLessonFlowService.getActivityById.mockReturnValue(null);
  const { unmount } = renderWithProviders(<LessonFlowScreen blockId="block-1" nodeId="node-1" />);
  await screen.findByText('Qual padrão radiográfico está presente?', {}, { timeout: 20_000 });
  unmount();
  // Zera só as chamadas: nenhum bloco, rodado sozinho, herda o que o
  // aquecimento chamou. As implementações configuradas continuam.
  jest.clearAllMocks();
}, 30_000);

describe('LessonFlowScreen — escolha da alternativa', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const { LessonFlowService } = jest.requireMock('../services/LessonFlowService') as {
      LessonFlowService: { getBlockById: jest.Mock; getActivityById: jest.Mock };
    };
    LessonFlowService.getBlockById.mockReturnValue(blockFixture);
    LessonFlowService.getActivityById.mockReturnValue(null);
  });

  it('bloqueia Conferir resposta sem seleção e mantém escolhas sem transação ou progresso', async () => {
    const heartsRepository = require('../../hearts/HeartsRepository').heartsRepository;
    renderWithProviders(<LessonFlowScreen blockId="block-1" nodeId="node-1" />);
    await screen.findByText('Qual padrão radiográfico está presente?');

    expect(screen.getByRole('button', { name: 'Conferir resposta' })).toBeDisabled();
    const savedCursorCalls = mockedJourneyProgress.setResumableNode.mock.calls.length;
    fireEvent.press(screen.getByRole('button', { name: 'Conferir resposta' }));
    fireEvent.press(screen.getByLabelText('Pneumotórax'));
    fireEvent.press(screen.getByLabelText('Consolidação alveolar'));

    expect(screen.getByRole('button', { name: 'Conferir resposta' })).toBeEnabled();
    expect(screen.getByLabelText('Consolidação alveolar').props.accessibilityHint).toContain('Conferir resposta');
    expect(screen.getByText('Selecionada')).toBeTruthy();
    expect(screen.queryByText('Resposta correta')).toBeNull();
    expect(announceForAccessibility).not.toHaveBeenCalled();
    expect(heartsRepository.spend).not.toHaveBeenCalled();
    expect(mockedOutcome.recordCompletion).not.toHaveBeenCalled();
    expect(mockedOutcome.recordActivityCompletion).not.toHaveBeenCalled();
    expect(mockedJourneyProgress.markNodeCompleted).not.toHaveBeenCalled();
    expect(mockedJourneyProgress.setResumableNode).toHaveBeenCalledTimes(savedCursorCalls);
  });

  it('permite trocar a alternativa selecionada antes de confirmar', async () => {
    renderWithProviders(<LessonFlowScreen blockId="block-1" nodeId="node-1" />);

    expect(await screen.findByText('Qual padrão radiográfico está presente?')).toBeTruthy();

    const wrong = screen.getByLabelText('Pneumotórax');
    const right = screen.getByLabelText('Consolidação alveolar');

    fireEvent.press(wrong);
    expect(wrong.props.accessibilityState.selected).toBe(true);

    // O primeiro toque não pode congelar a escolha: até conferir nada foi
    // confirmado, então trocar de alternativa tem de continuar possível.
    expect(wrong.props.accessibilityState.disabled).toBeFalsy();

    fireEvent.press(right);
    expect(screen.getByLabelText('Consolidação alveolar').props.accessibilityState.selected).toBe(true);
    expect(screen.getByLabelText('Pneumotórax').props.accessibilityState.selected).toBe(false);
  });

  it('confirma a escolha corrente ao continuar e revela o reforço', async () => {
    renderWithProviders(<LessonFlowScreen blockId="block-1" nodeId="node-1" />);

    expect(await screen.findByText('Qual padrão radiográfico está presente?')).toBeTruthy();

    fireEvent.press(screen.getByLabelText('Pneumotórax'));
    fireEvent.press(screen.getByLabelText('Consolidação alveolar'));
    fireEvent.press(screen.getByText('Conferir resposta'));

    // A alternativa valendo é a última selecionada, não a primeira tocada: quem
    // errou e corrigiu antes de confirmar vê o reforço de acerto.
    expect(await screen.findByText('Resposta correta')).toBeTruthy();
    expect(screen.getByText('A opacidade focal com broncograma aéreo sugere consolidação alveolar.')).toBeTruthy();
    expect(announceForAccessibility).toHaveBeenCalledTimes(1);
    expect(announceForAccessibility).toHaveBeenCalledWith(
      'Resposta correta. A opacidade focal com broncograma aéreo sugere consolidação alveolar.',
    );
  });
});

describe('LessonFlowScreen — economia de vidas', () => {
  const heartsRepository = require('../../hearts/HeartsRepository').heartsRepository as {
    getSnapshot: jest.Mock;
    spend: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedLessonFlowService.getBlockById.mockReturnValue(blockFixture);
    mockedLessonFlowService.getActivityById.mockReturnValue(null);
    heartsRepository.getSnapshot.mockResolvedValue({
      count: 5,
      status: 'full',
      nextRefillAt: null,
      unlimitedUntil: null,
    });
    heartsRepository.spend.mockResolvedValue({
      count: 4,
      status: 'recovering',
      nextRefillAt: '2026-09-14T12:30:00.000Z',
      unlimitedUntil: null,
    });
  });

  it('não cobra ao trocar alternativa e cobra uma vez na primeira confirmação errada', async () => {
    renderWithProviders(<LessonFlowScreen blockId="block-1" nodeId="node-1" />);
    expect(await screen.findByText('Qual padrão radiográfico está presente?')).toBeTruthy();

    fireEvent.press(screen.getByLabelText('Consolidação alveolar'));
    fireEvent.press(screen.getByLabelText('Pneumotórax'));
    expect(heartsRepository.spend).not.toHaveBeenCalled();

    fireEvent.press(screen.getByText('Conferir resposta'));
    await waitFor(() => expect(heartsRepository.spend).toHaveBeenCalledTimes(1));
  });

  describe('anúncio da perda de vida ao leitor de tela', () => {
    // Quem enxerga vê o coração mudar no HUD; quem usa VoiceOver só ouvia
    // "Resposta incorreta" e descobria a perda indo até os corações (achado do
    // VoiceOver no iPhone, 2026-09-27, FILA 25).
    const incorreta = 'Resposta incorreta. A opacidade focal com broncograma aéreo sugere consolidação alveolar.';

    async function errarEConfirmar() {
      renderWithProviders(<LessonFlowScreen blockId="block-1" nodeId="node-1" />);
      expect(await screen.findByText('Qual padrão radiográfico está presente?')).toBeTruthy();
      fireEvent.press(screen.getByLabelText('Pneumotórax'));
      fireEvent.press(screen.getByText('Conferir resposta'));
      await waitFor(() => expect(announceForAccessibility).toHaveBeenCalled());
    }

    it('anuncia a vida perdida e quantas restam junto da resposta incorreta', async () => {
      await errarEConfirmar();

      expect(announceForAccessibility).toHaveBeenCalledTimes(1);
      expect(announceForAccessibility).toHaveBeenCalledWith(`${incorreta} Você perdeu uma vida; restam 4.`);
    });

    it('na última vida, anuncia que ela acabou em vez de "restam 0"', async () => {
      heartsRepository.getSnapshot.mockResolvedValue({
        count: 1,
        status: 'recovering',
        nextRefillAt: '2026-09-14T12:30:00.000Z',
        unlimitedUntil: null,
      });
      heartsRepository.spend.mockResolvedValue({
        count: 0,
        status: 'empty',
        nextRefillAt: '2026-09-14T12:30:00.000Z',
        unlimitedUntil: null,
      });
      await errarEConfirmar();

      expect(announceForAccessibility).toHaveBeenCalledTimes(1);
      expect(announceForAccessibility).toHaveBeenCalledWith(`${incorreta} Você perdeu sua última vida.`);
      expect(await screen.findByText('Sua lição está pausada')).toBeTruthy();
    });

    it('assinante não perde vida e não ouve falar dela, mesmo antes de a tela ler as vidas', async () => {
      // `setUnlimited` preserva a contagem: quem assinou sem vidas carrega
      // `count: 0`. Se a leitura das vidas ainda não pousou, a tela compara
      // contra o padrão de 5, e só o estado impede o "perdeu sua última vida".
      heartsRepository.getSnapshot.mockReturnValue(new Promise(() => {}));
      heartsRepository.spend.mockResolvedValue({
        count: 0,
        status: 'unlimited',
        nextRefillAt: null,
        unlimitedUntil: '2026-10-14T12:00:00.000Z',
      });
      await errarEConfirmar();

      expect(announceForAccessibility).toHaveBeenCalledTimes(1);
      expect(announceForAccessibility).toHaveBeenCalledWith(incorreta);
    });

    it('sem queda real do contador, não anuncia débito', async () => {
      // `spend` não desconta quando não há o que descontar. O anúncio segue o
      // contador que voltou, não o fato de a cobrança ter sido chamada.
      const quatro = { count: 4, status: 'recovering', nextRefillAt: '2026-09-14T12:30:00.000Z', unlimitedUntil: null };
      heartsRepository.getSnapshot.mockResolvedValue(quatro);
      heartsRepository.spend.mockResolvedValue(quatro);
      await errarEConfirmar();

      expect(announceForAccessibility).toHaveBeenCalledTimes(1);
      expect(announceForAccessibility).toHaveBeenCalledWith(incorreta);
    });
  });

  it('protege uma confirmação dupla contra cobrança duplicada', async () => {
    let releaseSpend: ((value: unknown) => void) | undefined;
    heartsRepository.spend.mockReturnValue(new Promise(resolve => { releaseSpend = resolve; }));
    renderWithProviders(<LessonFlowScreen blockId="block-1" nodeId="node-1" />);
    expect(await screen.findByText('Qual padrão radiográfico está presente?')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Pneumotórax'));

    fireEvent.press(screen.getByText('Conferir resposta'));
    fireEvent.press(screen.getByText('Conferir resposta'));
    expect(heartsRepository.spend).toHaveBeenCalledTimes(1);
    await act(async () => {
      releaseSpend?.({ count: 4, status: 'recovering', nextRefillAt: null, unlimitedUntil: null });
    });
    // Uma vida por pergunta por tentativa (ADR 2026-09-24, decisão 2): o
    // segundo toque não debita, então também não pode anunciar débito.
    expect(announceForAccessibility).toHaveBeenCalledTimes(1);
  });

  it('pausa no próximo passo ao chegar a zero e preserva a retomada', async () => {
    heartsRepository.spend.mockResolvedValue({
      count: 0,
      status: 'empty',
      nextRefillAt: '2026-09-14T12:30:00.000Z',
      unlimitedUntil: null,
    });
    renderWithProviders(<LessonFlowScreen blockId="block-1" nodeId="node-1" />);
    expect(await screen.findByText('Qual padrão radiográfico está presente?')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Pneumotórax'));
    fireEvent.press(screen.getByText('Conferir resposta'));

    expect(await screen.findByText('Sua lição está pausada')).toBeTruthy();
    expect(mockedJourneyProgress.setResumableNode).toHaveBeenCalledWith('node-1', 1);
  });

  it('assinante com contagem zero não é pausado: o estado, não o número, decide o bloqueio', async () => {
    // `setUnlimited` preserva a contagem — quem assinou com zero vidas continua
    // com `count: 0` e `status: 'unlimited'`. Bloquear pelo número deixaria o
    // assinante preso na folha que a assinatura promete nunca mais mostrar.
    const ilimitada = { count: 0, status: 'unlimited', nextRefillAt: null, unlimitedUntil: '2026-10-14T12:00:00.000Z' };
    heartsRepository.getSnapshot.mockResolvedValue(ilimitada);
    heartsRepository.spend.mockResolvedValue(ilimitada);
    renderWithProviders(<LessonFlowScreen blockId="block-1" nodeId="node-1" />);
    expect(await screen.findByText('Qual padrão radiográfico está presente?')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Pneumotórax'));
    fireEvent.press(screen.getByText('Conferir resposta'));

    // Assenta a tela ANTES de observar, em vez de esperar o relógio.
    //
    // Medido em 2026-09-15: depois do "Continuar" a tela precisa de dois ciclos
    // de flush para estabilizar, e cada ciclo de polling do `waitFor` custava
    // ~340 ms aqui — não pelo trabalho em si (o `queryByText` leva 0–1 ms), mas
    // pela maquinaria de espera. A condição virava verdadeira só na 3ª
    // tentativa, entre 714 e 1488 ms, contra o timeout padrão de 1000 ms: folga
    // nenhuma. No runner do GitHub, ~7× mais lento nesta suíte (3,2 s aqui,
    // 21,5–22,3 s lá), estourava sempre — o CI reprovou duas vezes no mesmo SHA.
    //
    // A mesma medição em `origin/main`, sem nenhuma alteração desta branch, deu
    // a mesma distribuição (714–1488 ms, sempre 3 tentativas): a fragilidade é
    // anterior e independente do backup no iCloud. Um `act` vazio descarrega a
    // fila de microtasks e os efeitos pendentes de uma vez — 2 ms — e o
    // `waitFor` passa na primeira checagem, continuando ali como tolerância
    // para o dia em que a tela precisar de mais um ciclo. Aumentar o timeout
    // esconderia o custo em vez de eliminá-lo.
    await act(async () => {});
    await waitFor(() => expect(screen.queryByText('Qual padrão radiográfico está presente?')).toBeNull());
    expect(screen.queryByText('Sua lição está pausada')).toBeNull();
    expect(mockedJourneyProgress.setResumableNode).not.toHaveBeenCalledWith('node-1', 1);
  });

  describe('folha de vidas e a loja', () => {
    const vazia = { count: 0, status: 'empty', nextRefillAt: '2026-09-14T12:30:00.000Z', unlimitedUntil: null };
    const ilimitada = { count: 0, status: 'unlimited', nextRefillAt: null, unlimitedUntil: '2026-10-14T12:00:00.000Z' };

    async function pausarSemVidas() {
      heartsRepository.spend.mockResolvedValue(vazia);
      renderWithProviders(<LessonFlowScreen blockId="block-1" nodeId="node-1" />);
      expect(await screen.findByText('Qual padrão radiográfico está presente?')).toBeTruthy();
      fireEvent.press(screen.getByLabelText('Pneumotórax'));
      fireEvent.press(screen.getByText('Conferir resposta'));
      expect(await screen.findByText('Sua lição está pausada')).toBeTruthy();
    }

    it('T12 a folha aberta some ao voltar ilimitado sem fechar antes', async () => {
      await pausarSemVidas();
      heartsRepository.getSnapshot.mockResolvedValue(ilimitada);
      voltarParaATela();
      // A releitura é uma Promise: drene-a antes da asserção negativa.
      // Serializar o Fiber ainda aberto dentro de waitFor custa a janela em CPU limitada.
      await act(async () => {});
      expect(screen.queryByText('Sua lição está pausada')).toBeNull();
    });

    it('T12 P2 a consulta de revisões não sobrescreve currentNode nem cursor mais recentes no serviço real', async () => {
      // JourneyProgressService executa código real, inclusive ensureProgress e
      // persistProgress. Só as portas usam dados sintéticos em memória; o getter
      // tem escrita e é deliberadamente pausado após capturar o store antigo.
      const fs = require('node:fs') as typeof import('node:fs');
      const vm = require('node:vm') as typeof import('node:vm');
      const ts = require('typescript') as typeof import('typescript');
      const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));
      const track = { id: 't12-track', title: 'T12', initialUnitId: 't12-unit', units: [{
        id: 't12-unit', title: 'T12', nodes: [
          { id: 'node-1', type: 'lesson', unitId: 't12-unit', title: 'Aula', blockId: 'block-1', lessonId: 'lesson-1' },
          { id: 'review-1', type: 'review', unitId: 't12-unit', title: 'Revisão', blockId: 'block-1', lessonId: 'lesson-1' },
        ],
      }] };
      let store = { schemaVersion: 'journey-progress.v2', activeTrackId: track.id, tracks: { [track.id]: {
        schemaVersion: 'journey-progress.v2', activeTrackId: track.id, currentUnitId: 't12-unit',
        currentNodeId: null as string | null, completedNodeIds: [] as string[], pendingReviewNodeIds: [] as string[],
        lastUpdatedAt: '2026-10-30T00:00:00.000Z', resumableNodeId: 'node-1', resumableStepIndex: 2,
        pendingSyncEvents: [],
      } } };
      let pauseLookup = false;
      let releaseLookup = () => {};
      let captured!: () => void;
      const lookupCaptured = new Promise<void>(resolve => { captured = resolve; });
      const pendingLookups: Promise<JourneySnapshot>[] = [];
      const ports: Record<string, unknown> = {
        '../../../constants/storageKeys': { STORAGE_KEYS: { JOURNEY_PROGRESS: 'synthetic-t12-journey' } },
        '../../../storage': {
          readJsonStorage: async () => clone(store),
          writeJsonStorage: async (_key: string, next: typeof store) => { store = clone(next); },
          removeStorageKey: async () => {},
        },
        '../../../storage/schemaVersionGuard': jest.requireActual('../../../storage/schemaVersionGuard'),
        '../../../types/journey': jest.requireActual('../../../types/journey'),
        '../../spaced-repetition/services/SpacedRepetitionService': { SpacedRepetitionService: {
          getDueLessons: async () => {
            if (pauseLookup) {
              pauseLookup = false;
              captured();
              return new Promise<string[]>(resolve => { releaseLookup = () => resolve(['lesson-1']); });
            }
            return ['lesson-1'];
          },
          getReviewSchedule: async () => [{ lessonId: 'lesson-1', dueAtMs: 0 }],
        } },
        './JourneyRecommendationService': jest.requireActual('../../journey/services/JourneyRecommendationService'),
        './JourneyDefinitionService': { JourneyDefinitionService: { getTrackDefinition: () => track, getDefaultTrackId: () => track.id } },
        '../../content/services/LessonCatalogService': { LessonCatalogService: { listTracks: () => [{ id: track.id }] } },
        '../../progress-sync/ProgressSyncService': { progressSyncService: {} },
        './JourneyTrackUnlockService': { resolveActiveTrackId: () => track.id },
        './trackCompletion': jest.requireActual('../../journey/services/trackCompletion'),
      };
      const source = fs.readFileSync(require.resolve('../../journey/services/JourneyProgressService'), 'utf8');
      const compiled = ts.transpileModule(source, { compilerOptions: {
        module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
      } }).outputText;
      const moduleObject = { exports: {} as { JourneyProgressService: typeof JourneyProgressService } };
      vm.runInNewContext(compiled, {
        exports: moduleObject.exports, module: moduleObject,
        require: (path: string) => {
          if (!(path in ports)) throw new Error(`Unexpected service dependency: ${path}`);
          return ports[path];
        }, console, Date, Set, Map, Promise,
      });
      const realProgress = moduleObject.exports.JourneyProgressService;
      const previousLookup = mockedJourneyProgress.getSnapshotForNode.getMockImplementation();
      mockedJourneyProgress.getSnapshotForNode.mockImplementation(node => {
        pauseLookup = true;
        const pending = realProgress.getSnapshotForNode(node);
        pendingLookups.push(pending);
        return pending;
      });
      try {
        renderWithProviders(<LessonFlowScreen blockId="block-1" nodeId="node-1" />);
        expect(await screen.findByText('Qual padrão radiográfico está presente?')).toBeTruthy();
        if (pendingLookups.length > 0) await lookupCaptured;
        await realProgress.setCurrentNode('node-1');
        await realProgress.setResumableNode('node-1', 7);
        expect(store.tracks[track.id].currentNodeId).toBe('node-1');
        expect(store.tracks[track.id].resumableStepIndex).toBe(7);
        await act(async () => { releaseLookup(); await Promise.all(pendingLookups); });
        expect({ currentNode: store.tracks[track.id].currentNodeId, cursor: store.tracks[track.id].resumableStepIndex })
          .toEqual({ currentNode: 'node-1', cursor: 7 });
      } finally {
        releaseLookup();
        await Promise.all(pendingLookups);
        mockedJourneyProgress.getSnapshotForNode.mockImplementation(previousLookup!);
      }
    });

    it('T12 consulta revisões reais do nó, fecha a folha e preserva retomada ao revisar', async () => {
      mockedJourneyProgress.setResumableNode.mockResolvedValueOnce({ track: { units: [] }, dueReviewCount: 2 } as unknown as JourneySnapshot);
      await pausarSemVidas();
      expect(mockedJourneyProgress.getSnapshotForNode).not.toHaveBeenCalled();
      expect(mockedJourneyProgress.setResumableNode).toHaveBeenCalledWith('node-1');
      expect(await screen.findByText('A revisar: 2')).toBeTruthy();
      fireEvent.press(screen.getByText('Revisar pela folha'));
      expect(mockedRouter.replace).toHaveBeenCalledWith('/review');
      expect(screen.queryByText('Sua lição está pausada')).toBeNull();
      expect(mockedOutcome.recordCompletion).not.toHaveBeenCalled();
    });

    it('T12 getter falível de revisões não é chamado nem bloqueia vidas e aula', async () => {
      const previousLookup = mockedJourneyProgress.getSnapshotForNode.getMockImplementation();
      mockedJourneyProgress.getSnapshotForNode.mockRejectedValue(new Error('review-snapshot-unavailable'));
      try {
        await pausarSemVidas();
        expect(screen.getByText('A revisar: 0')).toBeTruthy();
        expect(screen.queryByText('Revisar pela folha')).toBeNull();
        expect(mockedJourneyProgress.getSnapshotForNode).not.toHaveBeenCalled();
        expect(heartsRepository.getSnapshot).toHaveBeenCalled();
        expect(mockedOutcome.recordCompletion).not.toHaveBeenCalled();
      } finally { mockedJourneyProgress.getSnapshotForNode.mockImplementation(previousLookup!); }
    });

    it('T12 resultado tardio do nó anterior não ressuscita revisão na nova aula', async () => {
      let resolvePrevious!: (snapshot: JourneySnapshot) => void;
      mockedJourneyProgress.setResumableNode.mockReturnValueOnce(new Promise(resolve => { resolvePrevious = resolve; }));
      mockedJourneyProgress.setResumableNode.mockResolvedValueOnce({ track: { units: [] }, dueReviewCount: 0 } as unknown as JourneySnapshot);
      heartsRepository.spend.mockResolvedValue(vazia);
      const view = renderWithProviders(<LessonFlowScreen blockId="block-1" nodeId="node-old" />);
      await waitFor(() => expect(mockedJourneyProgress.setResumableNode).toHaveBeenCalledWith('node-old'));
      view.rerender(<SafeAreaProvider><LessonFlowScreen blockId="block-1" nodeId="node-new" /></SafeAreaProvider>);
      await waitFor(() => expect(mockedJourneyProgress.setResumableNode).toHaveBeenCalledWith('node-new'));
      expect(await screen.findByText('Qual padrão radiográfico está presente?')).toBeTruthy();
      fireEvent.press(screen.getByLabelText('Pneumotórax'));
      fireEvent.press(screen.getByText('Conferir resposta'));
      expect(await screen.findByText('Sua lição está pausada')).toBeTruthy();
      await act(async () => { resolvePrevious({ track: { units: [] }, dueReviewCount: 3 } as unknown as JourneySnapshot); });
      expect(screen.getByText('A revisar: 0')).toBeTruthy();
      expect(screen.queryByText('Revisar pela folha')).toBeNull();
    });

    it('T12 fechar a folha mantém o cursor e volta para a trilha sem concluir', async () => {
      await pausarSemVidas();
      fireEvent.press(screen.getByText('Fechar folha'));
      await waitFor(() => expect(mockedRouter.dismissTo).toHaveBeenCalledWith('/(tabs)'));
      expect(mockedJourneyProgress.setResumableNode).toHaveBeenCalledWith('node-1', expect.any(Number));
      expect(mockedJourneyProgress.setResumableNode).not.toHaveBeenCalledWith(undefined);
      expect(mockedOutcome.recordCompletion).not.toHaveBeenCalled();
    });

    it('T12 sem nó não consulta revisão nem promete destino', async () => {
      heartsRepository.spend.mockResolvedValue(vazia);
      renderWithProviders(<LessonFlowScreen blockId="block-1" nodeId="" />);
      expect(await screen.findByText('Qual padrão radiográfico está presente?')).toBeTruthy();
      fireEvent.press(screen.getByLabelText('Pneumotórax'));
      fireEvent.press(screen.getByText('Conferir resposta'));
      expect(await screen.findByText('Sua lição está pausada')).toBeTruthy();
      expect(mockedJourneyProgress.getSnapshotForNode).not.toHaveBeenCalled();
      expect(screen.queryByText('Revisar pela folha')).toBeNull();
    });

    it('com loja no binário, a folha oferece a assinatura e leva à tela dela', async () => {
      mockedSubscription.storeAvailable.mockReturnValue(true);
      await pausarSemVidas();

      expect(screen.getByText('folha: com assinatura')).toBeTruthy();
      fireEvent.press(screen.getByText('Assinar pela folha'));

      expect(mockedRouter.push).toHaveBeenCalledWith('/subscription');
      // A folha é um Modal: aberta, ficaria por cima da tela da assinatura.
      expect(screen.queryByText('Sua lição está pausada')).toBeNull();
    });

    it('sem loja no binário, a folha não oferece a assinatura', async () => {
      mockedSubscription.storeAvailable.mockReturnValue(false);
      await pausarSemVidas();

      expect(screen.getByText('folha: sem assinatura')).toBeTruthy();
    });

    it('voltando da compra, a lição relê as vidas e mostra ∞', async () => {
      mockedSubscription.storeAvailable.mockReturnValue(true);
      await pausarSemVidas();
      fireEvent.press(screen.getByText('Assinar pela folha'));

      heartsRepository.getSnapshot.mockResolvedValue(ilimitada);
      voltarParaATela();

      expect(await screen.findByLabelText('Vidas ilimitadas')).toBeTruthy();
      expect(screen.queryByTestId('hearts-display')).toBeNull();
      expect(screen.queryByText('Sua lição está pausada')).toBeNull();
    });
  });

  it('assinante vê ∞ no topo da lição, sem as vidas', async () => {
    heartsRepository.getSnapshot.mockResolvedValue({
      count: 0,
      status: 'unlimited',
      nextRefillAt: null,
      unlimitedUntil: '2026-10-14T12:00:00.000Z',
    });
    renderWithProviders(<LessonFlowScreen blockId="block-1" nodeId="node-1" />);

    expect(await screen.findByLabelText('Vidas ilimitadas')).toBeTruthy();
    expect(screen.queryByTestId('hearts-display')).toBeNull();
  });

  it('quem não assina vê as vidas no topo da lição, sem ∞', async () => {
    renderWithProviders(<LessonFlowScreen blockId="block-1" nodeId="node-1" />);
    expect(await screen.findByText('Qual padrão radiográfico está presente?')).toBeTruthy();

    expect(screen.getByTestId('hearts-display')).toBeTruthy();
    expect(screen.queryByLabelText('Vidas ilimitadas')).toBeNull();
  });

  it('salva o passo atual antes de fechar', async () => {
    renderWithProviders(<LessonFlowScreen blockId="block-1" nodeId="node-1" />);
    expect(await screen.findByText('Qual padrão radiográfico está presente?')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Fechar quiz'));
    await waitFor(() => expect(mockedJourneyProgress.setResumableNode).toHaveBeenCalledWith('node-1', 0));
    expect(mockedRouter.dismissTo).toHaveBeenCalledWith('/(tabs)');
  });
});

describe('LessonFlowScreen — apresentação do passo legado', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const { LessonFlowService } = jest.requireMock('../services/LessonFlowService') as {
      LessonFlowService: { getBlockById: jest.Mock; getActivityById: jest.Mock };
    };
    LessonFlowService.getBlockById.mockReturnValue(blockFixture);
    LessonFlowService.getActivityById.mockReturnValue(null);
  });

  // O painel decorativo saiu em 2026-09-08. Ele carregava um raster de mockup
  // com texto em inglês e oferecia "Toque para examinar" sobre uma lupa que
  // não tinha nenhum controle de toque atrás. Este teste monta a tela de
  // verdade — o mock do painel, que existia aqui, foi o que deixou a suíte
  // verde com o defeito na tela do build 1.3.1 (9).
  it('não promete uma interação que não existe no passo legado', async () => {
    renderWithProviders(<LessonFlowScreen blockId="block-1" nodeId="node-1" />);

    expect(await screen.findByText('Qual padrão radiográfico está presente?')).toBeTruthy();

    expect(screen.queryByText('Toque para examinar')).toBeNull();
    expect(screen.queryByLabelText('Ilustração de um painel de raio-X para examinar')).toBeNull();
  });
});

describe('LessonFlowScreen — registro da conclusão', () => {
  beforeEach(() => {
    // Este describe não compartilha o beforeEach de "escolha da alternativa"
    // (escopo é por describe), e o arquivo não zera mocks globalmente entre
    // testes — sem isto, a contagem de chamadas de recordCompletion do
    // primeiro teste vaza para o segundo.
    mockedOutcome.recordCompletion.mockClear();
    mockedOutcome.recordCompletion.mockResolvedValue(outcomeFixture);
    mockedJourneyProgress.markNodeCompleted.mockClear();
    mockedJourneyProgress.markNodeCompleted.mockResolvedValue({ track: { units: [] } } as never);
    // mockClear() não apaga um mockReturnValue já configurado, então este
    // describe só passava isolado por acidente: dependia da ordem de
    // execução do arquivo (o beforeEach de "escolha da alternativa" roda
    // primeiro e deixa getBlockById apontando para blockFixture). Setando
    // aqui também, este bloco fica correto rodando sozinho.
    mockedLessonFlowService.getBlockById.mockReturnValue(blockFixture);
  });

  it('registra a conclusão com a escolha confirmada antes de marcar o nó', async () => {
    const order: string[] = [];
    mockedOutcome.recordCompletion.mockImplementation(async () => {
      order.push('outcome');
      return outcomeFixture;
    });
    // A tela usa o retorno para localizar a unidade ativa. Aqui basta um
    // snapshot sem unidades: este teste mede ordem de chamada, e sem
    // correspondência de unidade o card de progresso apenas não aparece.
    mockedJourneyProgress.markNodeCompleted.mockImplementation(async () => {
      order.push('markNodeCompleted');
      return { track: { units: [] } } as never;
    });

    renderWithProviders(<LessonFlowScreen blockId="block-1" nodeId="node-1" />);

    expect(await screen.findByText('Qual padrão radiográfico está presente?')).toBeTruthy();

    // Erra, corrige, e só então confirma: vale a escolha confirmada.
    fireEvent.press(screen.getByLabelText('Pneumotórax'));
    fireEvent.press(screen.getByLabelText('Consolidação alveolar'));
    fireEvent.press(screen.getByText('Conferir resposta'));

    expect(await screen.findByText('Resposta correta')).toBeTruthy();
    // Último passo do bloco: o rótulo do botão muda para "Concluir e voltar".
    fireEvent.press(screen.getByText('Concluir e voltar'));

    await waitFor(() => expect(mockedOutcome.recordCompletion).toHaveBeenCalledTimes(1));

    const input = mockedOutcome.recordCompletion.mock.calls[0][0];
    expect(input.nodeId).toBe('node-1');
    expect(input.block.lessonId).toBe('lesson-1');
    expect(input.confirmedAnswers).toEqual({ 'step-choice': true });

    // O serviço tem de rodar antes da marcação: a elegibilidade lê
    // completedNodeIds e pendingReviewNodeIds, que a marcação altera.
    expect(order).toEqual(['outcome', 'markNodeCompleted']);
  });

  it('registra escolha confirmada incorreta como incorreta', async () => {
    renderWithProviders(<LessonFlowScreen blockId="block-1" nodeId="node-1" />);

    expect(await screen.findByText('Qual padrão radiográfico está presente?')).toBeTruthy();

    // Confirma a alternativa errada e segue até o fim do bloco. A asserção é
    // sobre o que o serviço recebeu, não sobre o texto do reforço: o título de
    // erro do ReinforceStepRenderer ("Vamos reforçar") é igual ao
    // payload.title da fixture, então casá-lo não provaria nada.
    fireEvent.press(screen.getByLabelText('Pneumotórax'));
    fireEvent.press(screen.getByText('Conferir resposta'));
    // Último passo do bloco: o rótulo do botão muda para "Concluir e voltar".
    fireEvent.press(await screen.findByText('Concluir e voltar'));

    await waitFor(() => expect(mockedOutcome.recordCompletion).toHaveBeenCalledTimes(1));

    const input = mockedOutcome.recordCompletion.mock.calls[0][0];
    expect(input.confirmedAnswers).toEqual({ 'step-choice': false });
  });

  it('usa a resposta confirmada no mesmo Continuar quando o passo interativo é o último do bloco', async () => {
    // blockFixture nunca exercita a corrida de estado: nele o passo
    // interativo é o PRIMEIRO, então o "Continuar" final acontece depois de
    // um ciclo de render inteiro, com confirmedAnswers já assentado. Aqui,
    // com lastStepInteractiveFixture, confirmar e concluir acontecem na
    // MESMA chamada de handleContinue. Sem este teste, reverter a chamada ao
    // serviço de nextConfirmed (valor local) para confirmedAnswers (variável
    // de estado ainda não atualizada) — desfazendo exatamente a correção que
    // esta tarefa existe para fazer — continuaria passando em todos os
    // outros testes deste arquivo.
    mockedLessonFlowService.getBlockById.mockReturnValue(lastStepInteractiveFixture);

    renderWithProviders(<LessonFlowScreen blockId="block-2" nodeId="node-2" />);

    // "Antes de responder" também é usado como título do cabeçalho (a tela
    // usa o título do passo de contexto como fallback de lessonTitle), então
    // aparece duas vezes na árvore — o corpo do texto é o localizador único.
    expect(await screen.findByText('Observe a imagem com atenção.')).toBeTruthy();
    fireEvent.press(screen.getByText('Continuar'));

    expect(await screen.findByText('Qual padrão radiográfico está presente?')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Consolidação alveolar'));
    // Mesmo no último passo, a múltipla escolha explicita a confirmação.
    fireEvent.press(screen.getByText('Conferir resposta'));

    await waitFor(() => expect(mockedOutcome.recordCompletion).toHaveBeenCalledTimes(1));

    const input = mockedOutcome.recordCompletion.mock.calls[0][0];
    expect(input.confirmedAnswers).toEqual({ 'step-final-choice': true });
  });
});

describe('LessonFlowScreen — retomada sem persistir respostas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedLessonFlowService.getBlockById.mockReturnValue(privacySafeResumeFixture);
  });

  it('recua para a interação não confirmada quando o cursor salvo já passou por ela', async () => {
    renderWithProviders(
      <LessonFlowScreen
        blockId="block-3"
        nodeId="node-3"
        resumeCheckpointId="checkpoint-3"
        resumeCursorId="step-3"
      />,
    );

    expect(await screen.findByText('Qual achado deve ser confirmado novamente?')).toBeTruthy();
    expect(screen.queryByText('Reforço final')).toBeNull();

    fireEvent.press(screen.getByLabelText('Achado B'));
    fireEvent.press(screen.getByText('Conferir resposta'));

    expect(await screen.findByText('Resposta correta')).toBeTruthy();
  });
});

describe('retomada pela recomendação de Estude — produtor até passo exibido', () => {
  const resumeFixture: LessonBlock = {
    ...privacySafeResumeFixture,
    steps: [
      {
        step: { type: 'context', payload: { title: 'Primeiro contexto', body: 'Contexto antes da pausa.' } },
        contract: { id: 'step-first-context', type: 'context', completionRule: 'displayed',
          retryRule: 'allow_continue', branching: 'none' },
      },
      ...privacySafeResumeFixture.steps,
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedLessonFlowService.getBlockById.mockReturnValue(resumeFixture);
    mockedLessonFlowService.getActivityById.mockReturnValue(null);
  });

  it.each([
    [1, 1, 'Observe antes de responder.'],
    [2, 2, 'Qual achado deve ser confirmado novamente?'],
    [3, 2, 'Qual achado deve ser confirmado novamente?'],
  ])('pausa no índice %s e reabre o passo privado esperado %s pela ação real', async (pausedIndex, expectedIndex, expectedText) => {
    const lesson = renderWithProviders(<LessonFlowScreen blockId="block-3" nodeId="node-3" />);
    await screen.findByText('Contexto antes da pausa.');
    fireEvent.press(screen.getByText('Continuar'));
    await screen.findByText('Observe antes de responder.');
    if (pausedIndex >= 2) {
      fireEvent.press(screen.getByText('Continuar'));
      await screen.findByText('Qual achado deve ser confirmado novamente?');
    }
    if (pausedIndex === 3) {
      fireEvent.press(screen.getByLabelText('Achado B'));
      fireEvent.press(screen.getByText('Conferir resposta'));
      await screen.findByText('Resposta correta');
    }
    expect(screen.getByText(`Passo ${pausedIndex + 1} de 4`)).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Fechar quiz'));
    await waitFor(() => expect(mockedRouter.dismissTo).toHaveBeenCalledWith('/(tabs)'));
    const [, savedIndex] = mockedJourneyProgress.setResumableNode.mock.calls.at(-1)!;
    expect(savedIndex).toBe(pausedIndex);
    lesson.unmount();

    const node = { id: 'node-3', unitId: 'unit-1', type: 'lesson' as const,
      title: 'Lição pausada', status: 'resumable' as const, blockId: 'block-3' };
    const nextDecision = NextNodeResolver.resolve({
      candidates: [{ nodeId: node.id, type: node.type, order: 0, unlocked: true,
        completed: false, pausedStepIndex: savedIndex as number }], nowMs: Date.now(),
    });
    mockedJourneyProgress.bootstrap.mockResolvedValue({
      track: { title: 'Unidade', units: [{ id: 'unit-1', nodes: [node] }] },
      nextRecommendedNode: node, nextDecision, dueReviewCount: 0,
    } as JourneySnapshot);
    const home = renderWithProviders(<JourneyHomeScreen />);
    fireEvent.press(await screen.findByRole('button', { name: 'Retomar lição' }));
    await waitFor(() => expect(mockedRouter.push).toHaveBeenCalledTimes(1));
    const href = mockedRouter.push.mock.calls[0][0];
    if (typeof href !== 'object') throw new Error('A recomendação não abriu /learn com parâmetros');
    expect(href.pathname).toBe('/learn');
    mockLearnParams = href.params as Record<string, string>;
    home.unmount();

    renderWithProviders(<LearnRoute />);
    await screen.findByText(expectedText);
    expect(screen.getByText(`Passo ${expectedIndex + 1} de 4`)).toBeTruthy();
    if (pausedIndex >= 2) {
      expect(screen.getByRole('button', { name: 'Conferir resposta' })).toBeDisabled();
      expect(screen.getByLabelText('Achado B').props.accessibilityState.selected).toBe(false);
      expect(screen.queryByText('Reforço final')).toBeNull();
    }
  });
});

describe('LessonFlowScreen — atividade curricular v2 promovida', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedLessonFlowService.getBlockById.mockReturnValue(null);
    mockedLessonFlowService.getActivityById.mockReturnValue(promotedActivityFixture);
  });

  it('renderiza o material promovido sem depender de bloco legado', async () => {
    renderWithProviders(
      <LessonFlowScreen
        blockId="activity:materia-energia-e-radiacao:01"
        nodeId="node:activity:materia-energia-e-radiacao:01"
      />,
    );

    expect(await screen.findByText('Átomos têm partículas com cargas diferentes.')).toBeTruthy();
    expect(screen.queryByText('Toque para examinar')).toBeNull();
    fireEvent.press(screen.getByText('Continuar'));
    expect(await screen.findByText('Qual partícula tem carga negativa?')).toBeTruthy();
    expect(screen.getByLabelText('Elétron')).toBeTruthy();
  });

  it.each([false, true])('preserva o CTA da comparação V2 (último passo: %s)', async (lastStep) => {
    const original = promotedActivityFixture.steps[1];
    if (original.kind !== 'interaction') throw new Error('Fixture sem interação');
    const comparisonActivity: LearningActivityV2 = {
      ...promotedActivityFixture,
      steps: [
        { kind: 'interaction', interaction: { ...original.interaction, type: 'comparison', payload: {
          prompt: 'Compare as cargas.',
          options: [{ id: 'proton', label: 'Próton' }, { id: 'eletron', label: 'Elétron' }],
          correctOptionId: 'eletron',
        } } },
        ...(lastStep ? [] : [promotedActivityFixture.steps[2]]),
      ],
    };
    mockedLessonFlowService.getActivityById.mockReturnValue(comparisonActivity);
    renderWithProviders(<LessonFlowScreen blockId={comparisonActivity.id} nodeId="node-comparison" />);
    await screen.findByText('Compare as cargas.');

    const label = lastStep ? 'Concluir e voltar' : 'Continuar';
    expect(screen.getByRole('button', { name: label })).toBeDisabled();
    expect(screen.queryByText('Conferir resposta')).toBeNull();
    fireEvent.press(screen.getByLabelText('Elétron'));
    expect(screen.getByRole('button', { name: label })).toBeEnabled();
  });

  it('registra a conclusão usando a atividade nativa e sua resposta confirmada', async () => {
    mockedOutcome.recordActivityCompletion.mockResolvedValue(outcomeFixture);

    renderWithProviders(
      <LessonFlowScreen
        blockId="activity:materia-energia-e-radiacao:01"
        nodeId="node:activity:materia-energia-e-radiacao:01"
      />,
    );

    expect(await screen.findByText('Átomos têm partículas com cargas diferentes.')).toBeTruthy();
    fireEvent.press(screen.getByText('Continuar'));
    fireEvent.press(await screen.findByLabelText('Elétron'));
    fireEvent.press(screen.getByText('Conferir resposta'));
    fireEvent.press(await screen.findByText('Concluir e voltar'));

    await waitFor(() => expect(mockedOutcome.recordActivityCompletion).toHaveBeenCalledTimes(1));
    expect(mockedOutcome.recordActivityCompletion).toHaveBeenCalledWith({
      activity: promotedActivityFixture,
      nodeId: 'node:activity:materia-energia-e-radiacao:01',
      confirmedAnswers: { 'activity-01-question': true },
      firstConfirmedAnswers: { 'activity-01-question': true },
      attemptId: expect.stringMatching(/^study:/),
      answeredAt: expect.any(Date),
    });
    expect(mockedOutcome.recordCompletion).not.toHaveBeenCalled();
  });
});

describe('LessonFlowScreen — conclusão da lição', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedLessonFlowService.getBlockById.mockReturnValue(blockFixture);
    mockedLessonFlowService.getActivityById.mockReturnValue(undefined as never);
    mockedOutcome.recordCompletion.mockResolvedValue(outcomeFixture);
    mockedJourneyProgress.markNodeCompleted.mockResolvedValue({
      track: { units: [] },
    } as never);
    (LearningAttemptsRepository.getAll as jest.Mock).mockResolvedValue([]);
    (LessonRatingService.getRating as jest.Mock).mockResolvedValue(null);
  });

  async function completeLesson() {
    renderWithProviders(<LessonFlowScreen blockId="block-1" nodeId="node-1" />);

    expect(await screen.findByText('Qual padrão radiográfico está presente?')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Consolidação alveolar'));
    fireEvent.press(screen.getByText('Conferir resposta'));
    fireEvent.press(await screen.findByText('Concluir e voltar'));
  }

  it('avaliar e continuar conservam a conclusão e o prêmio já registrados', async () => {
    mockedOutcome.recordCompletion.mockResolvedValue({ ...outcomeFixture,
      award: { baseXp: 20, bonusXp: 0, totalXpAwarded: 20, reason: 'quiz_complete' },
    });
    await completeLesson();
    expect(await screen.findByText('+20 XP')).toBeTruthy();
    expect(screen.getByLabelText('3 de 3 estrelas')).toBeTruthy();
    expect(mockedOutcome.recordCompletion).toHaveBeenCalledTimes(1);
    fireEvent.press(screen.getByLabelText('Avaliar a aula com 4 de 5'));
    expect(LessonRatingService.rate).toHaveBeenCalledWith('lesson-1', 4);
    expect(screen.getByText('Você avaliou esta aula com 4 de 5')).toBeTruthy();
    expect(screen.getByText('+20 XP')).toBeTruthy();
    expect(screen.getByLabelText('3 de 3 estrelas')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Continuar' }));
    expect(mockedOutcome.recordCompletion).toHaveBeenCalledTimes(1);
    expect(mockedRouter.dismissTo).toHaveBeenCalledWith('/(tabs)');
  });

  it.each([
    ['lesson', 'ressonancia', 'protecao', 'ressonancia'],
    ['review', 'ressonancia', 'protecao', 'ressonancia'],
    ['lesson', undefined, 'protecao', 'protecao'],
    ['review', undefined, 'protecao', 'protecao'],
  ] as const)('resultado %s mantém o título real e tema (%s/%s)', async (kind, nodeTheme, unitTheme, expectedTheme) => {
    const definition = jest.requireMock('../../journey/services/JourneyDefinitionService').JourneyDefinitionService;
    const catalogSpy = jest.spyOn(LessonCatalogService, 'listTracks').mockReturnValue([{ id: 'summary-track' }] as ReturnType<typeof LessonCatalogService.listTracks>);
    definition.getNodeType.mockReturnValue(kind);
    definition.getTrackDefinition.mockReturnValue({ units: [{ theme: unitTheme, nodes: [{ id: 'node-1', title: 'Formação da imagem', theme: nodeTheme }] }] });
    try {
      await completeLesson();
      await screen.findByText('1 de 1 corretas');
      expect(screen.getByRole('header', { name: 'Formação da imagem' })).toBeTruthy();
      expect(screen.UNSAFE_getByType(JourneyMedal).props.theme).toBe(expectedTheme);
      expect(screen.UNSAFE_queryAllByType(Confetti)).toHaveLength(0);
      if (kind === 'review') expect(screen.queryAllByLabelText(/Pixel/u)).toHaveLength(0);
    } finally {
      catalogSpy.mockRestore();
      definition.getNodeType.mockReturnValue('lesson');
      definition.getTrackDefinition.mockReturnValue({ units: [] });
    }
  });

  it('mostra a conclusão em vez de devolver o aluno em silêncio para a aba', async () => {
    // Antes desta passagem a tela chamava router.replace('/(tabs)') aqui: o
    // aluno terminava a lição e voltava para a aba sem estrelas, sem XP, sem
    // frase e sem avaliação. Toda a conclusão do sub-projeto 1 estava montada
    // em /quiz, que não tem ponto de entrada in-app.
    await completeLesson();

    expect(await screen.findByText('1 de 1 corretas')).toBeTruthy();
    expect(mockedRouter.replace).not.toHaveBeenCalled();
    expect(mockedRouter.dismissTo).not.toHaveBeenCalled();
  });

  it('anuncia Estude na conclusão de /learn e o Continuar executa esse retorno', async () => {
    await completeLesson();
    const button = await screen.findByRole('button', { name: 'Continuar' });
    expect(button.props.accessibilityHint).toBe('Volta para Estude');
    fireEvent.press(button);
    await waitFor(() => expect(mockedRouter.dismissTo).toHaveBeenCalledWith('/(tabs)'));
  });

  it('mostra as estrelas desta tentativa, com o recorde à parte', async () => {
    // Até 2026-10-16 a tela mostrava a MELHOR tentativa com a frase dela: no
    // simulador, uma revisão errada (0 de 1) dizia "Três estrelas. Nada passou
    // despercebido." O resumo honesto (ADR de 2026-10-16) mostra esta
    // tentativa e o recorde numa linha à parte, sem animar ganho que não houve.
    (LearningAttemptsRepository.getAll as jest.Mock).mockResolvedValue([
      {
        lessonId: 'lesson-1',
        topicId: 'unit-1',
        correctAnswers: 4,
        totalQuestions: 4,
        completedAt: '2026-08-14T12:00:00.000Z',
      },
    ]);
    mockedOutcome.recordCompletion.mockResolvedValue({
      ...outcomeFixture,
      result: { ...outcomeFixture.result, correctAnswers: 0, totalQuestions: 4 },
    });

    await completeLesson();

    expect(await screen.findByText('0 de 4 corretas')).toBeTruthy();
    expect(screen.getByLabelText('0 de 3 estrelas')).toBeTruthy();
    expect(screen.getByText('Seu recorde nesta lição: 3 estrelas')).toBeTruthy();
    expect(screen.queryByText(/Nada passou despercebido|Perfeito|Marca cheia/u)).toBeNull();
  });

  it('chega ao Continuar mesmo quando a leitura do histórico falha', async () => {
    // A tela inteira de conclusão fica atrás do resumo. Se o histórico ou a
    // nota rejeitarem, cai para as estrelas só desta tentativa em vez de
    // travar — o aluno tem que sempre conseguir sair da lição.
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    (LearningAttemptsRepository.getAll as jest.Mock).mockRejectedValue(new Error('storage cheio'));

    try {
      await completeLesson();

      expect(await screen.findByText('1 de 1 corretas')).toBeTruthy();
      expect(screen.getByLabelText('3 de 3 estrelas')).toBeTruthy();
    } finally {
      errorSpy.mockRestore();
    }
  });
});

describe('LessonFlowScreen — sons e vibração', () => {
  // A camada de som existia só no piloto do V3; a lição do aluno passava em
  // silêncio e só vibrava ao concluir (achado do dono na build `c4eeeb44`,
  // decisão B de 2026-09-28). Aqui se mede o que a lição PEDE à camada.
  const haptics = jest.requireMock('../../../ui/feedback/haptics') as Record<string, jest.Mock>;
  const preferences = jest.requireMock('../../../ui/feedback/feedbackPreferences') as { readFeedbackPreferences: jest.Mock };
  const heartsRepository = require('../../hearts/HeartsRepository').heartsRepository as {
    getSnapshot: jest.Mock;
    spend: jest.Mock;
  };
  const tocados = () => mockSoundPlayer.play.mock.calls.map(([id]) => id);

  beforeEach(() => {
    jest.clearAllMocks();
    mockedLessonFlowService.getBlockById.mockReturnValue(blockFixture);
    mockedLessonFlowService.getActivityById.mockReturnValue(null);
    preferences.readFeedbackPreferences.mockResolvedValue({ sounds: true, haptics: true });
    heartsRepository.getSnapshot.mockResolvedValue({ count: 5, status: 'full', nextRefillAt: null, unlimitedUntil: null });
    heartsRepository.spend.mockResolvedValue({ count: 4, status: 'recovering', nextRefillAt: '2026-09-14T12:30:00.000Z', unlimitedUntil: null });
    mockedOutcome.recordCompletion.mockResolvedValue(outcomeFixture);
    mockedJourneyProgress.markNodeCompleted.mockResolvedValue({ track: { units: [] } } as never);
    (LearningAttemptsRepository.getAll as jest.Mock).mockResolvedValue([]);
    (LessonRatingService.getRating as jest.Mock).mockResolvedValue(null);
  });

  async function abrir() {
    const view = renderWithProviders(<LessonFlowScreen blockId="block-1" nodeId="node-1" />);
    expect(await screen.findByText('Qual padrão radiográfico está presente?')).toBeTruthy();
    // As preferências chegam por promessa: assenta antes do primeiro toque.
    await act(async () => {});
    return view;
  }

  it('tocar numa alternativa toca o som de toque e vibra a seleção', async () => {
    await abrir();
    fireEvent.press(screen.getByLabelText('Pneumotórax'));

    expect(tocados()).toEqual(['toque']);
    expect(haptics.hapticSelection).toHaveBeenCalledTimes(1);
  });

  it('continuar com erro toca só o erro, mesmo quando a vida cai', async () => {
    // Decisão do dono, 2026-09-28, depois de ouvir no iPhone: o som do coração
    // saía 2 ms depois do erro (medido no log do simulador) e os dois viravam
    // um só. Sem animação em primeiro plano que o justifique, o coração cai só
    // no HUD e no anúncio ao leitor de tela. O som volta com o item 26.
    await abrir();
    fireEvent.press(screen.getByLabelText('Pneumotórax'));
    fireEvent.press(screen.getByText('Conferir resposta'));

    await waitFor(() => expect(heartsRepository.spend).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(announceForAccessibility).toHaveBeenCalled());
    expect(announceForAccessibility).toHaveBeenCalledWith(expect.stringContaining('Você perdeu uma vida; restam 4.'));
    expect(tocados()).toEqual(['toque', 'erro']);
    expect(haptics.hapticError).toHaveBeenCalledTimes(1);
    expect(haptics.hapticLifeLost).not.toHaveBeenCalled();
  });

  it('continuar com acerto toca o acerto e vibra o sucesso', async () => {
    await abrir();
    fireEvent.press(screen.getByLabelText('Consolidação alveolar'));
    fireEvent.press(screen.getByText('Conferir resposta'));

    await waitFor(() => expect(tocados()).toContain('acerto'));
    expect(tocados()).toEqual(['toque', 'acerto']);
    expect(haptics.hapticSuccess).toHaveBeenCalledTimes(1);
  });

  it('o assinante erra e também ouve só o erro', async () => {
    const ilimitada = { count: 0, status: 'unlimited', nextRefillAt: null, unlimitedUntil: '2026-10-14T12:00:00.000Z' };
    heartsRepository.getSnapshot.mockResolvedValue(ilimitada);
    heartsRepository.spend.mockResolvedValue(ilimitada);
    await abrir();
    fireEvent.press(screen.getByLabelText('Pneumotórax'));
    fireEvent.press(screen.getByText('Conferir resposta'));

    await waitFor(() => expect(heartsRepository.spend).toHaveBeenCalledTimes(1));
    await act(async () => {});
    expect(tocados()).toEqual(['toque', 'erro']);
    expect(haptics.hapticLifeLost).not.toHaveBeenCalled();
  });

  it('a lição aprovada termina com o som de fim e a comemoração', async () => {
    await abrir();
    fireEvent.press(screen.getByLabelText('Consolidação alveolar'));
    fireEvent.press(screen.getByText('Conferir resposta'));
    fireEvent.press(await screen.findByText('Concluir e voltar'));

    await waitFor(() => expect(tocados()).toContain('fim'));
    expect(haptics.hapticCelebrate).toHaveBeenCalledTimes(1);
  });

  it('com os interruptores desligados, nada toca e nada vibra, nem a comemoração', async () => {
    preferences.readFeedbackPreferences.mockResolvedValue({ sounds: false, haptics: false });
    await abrir();
    fireEvent.press(screen.getByLabelText('Consolidação alveolar'));
    fireEvent.press(screen.getByText('Conferir resposta'));
    fireEvent.press(await screen.findByText('Concluir e voltar'));

    expect(await screen.findByText('1 de 1 corretas')).toBeTruthy();
    await act(async () => {});
    expect(mockSoundPlayer.play).not.toHaveBeenCalled();
    expect(haptics.hapticSelection).not.toHaveBeenCalled();
    expect(haptics.hapticSuccess).not.toHaveBeenCalled();
    expect(haptics.hapticCelebrate).not.toHaveBeenCalled();
  });

  it('libera os sons ao sair da lição', async () => {
    const { unmount } = await abrir();
    unmount();

    expect(mockSoundPlayer.release).toHaveBeenCalledTimes(1);
  });
});

// ADR de 2026-09-14: "Revisão nunca consome vida" e vidas "não bloqueiam
// revisão". A revisão da trilha corre nesta tela, que cobrava todo erro: no
// simulador em 2026-10-16, errar a revisão levou de 5 para 4 vidas. Desde a ADR
// de 2026-10-16 a tela sabe o tipo do nó e trata revisão como prática.
describe('LessonFlowScreen — revisão da trilha não custa vida', () => {
  const { JourneyDefinitionService } = require('../../journey/services/JourneyDefinitionService') as {
    JourneyDefinitionService: { getNodeType: jest.Mock };
  };
  const heartsRepository = require('../../hearts/HeartsRepository').heartsRepository as {
    getSnapshot: jest.Mock;
    spend: jest.Mock;
  };
  const cheia = { count: 5, status: 'full', nextRefillAt: null, unlimitedUntil: null };
  const vazia = { count: 0, status: 'empty', nextRefillAt: '2026-09-14T12:30:00.000Z', unlimitedUntil: null };

  beforeEach(() => {
    jest.clearAllMocks();
    JourneyDefinitionService.getNodeType.mockReturnValue('review');
    mockedLessonFlowService.getBlockById.mockReturnValue(blockFixture);
    mockedLessonFlowService.getActivityById.mockReturnValue(undefined as never);
    heartsRepository.getSnapshot.mockResolvedValue(cheia);
    heartsRepository.spend.mockResolvedValue({ ...cheia, count: 4, status: 'recovering' });
    mockedOutcome.recordCompletion.mockResolvedValue({
      ...outcomeFixture,
      result: { ...outcomeFixture.result, correctAnswers: 0 },
    });
    mockedJourneyProgress.markNodeCompleted.mockResolvedValue({ track: { units: [] } } as never);
    (LearningAttemptsRepository.getAll as jest.Mock).mockResolvedValue([]);
    (LessonRatingService.getRating as jest.Mock).mockResolvedValue(null);
  });

  afterEach(() => {
    JourneyDefinitionService.getNodeType.mockReturnValue('lesson');
  });

  async function errarARevisao() {
    renderWithProviders(<LessonFlowScreen blockId="block:review:lesson-1" nodeId="node:review:lesson-1" />);
    expect(await screen.findByText('Qual padrão radiográfico está presente?')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Pneumotórax'));
    fireEvent.press(screen.getByText('Conferir resposta'));
    await waitFor(() => expect(announceForAccessibility).toHaveBeenCalled());
  }

  it('errar na revisão não gasta vida nem anuncia perda', async () => {
    await errarARevisao();

    expect(heartsRepository.spend).not.toHaveBeenCalled();
    expect(announceForAccessibility).toHaveBeenCalledWith(
      'Resposta incorreta. A opacidade focal com broncograma aéreo sugere consolidação alveolar.',
    );
  });

  it('sem vidas, a revisão continua e não pausa', async () => {
    heartsRepository.getSnapshot.mockResolvedValue(vazia);

    await errarARevisao();

    expect(screen.queryByText('Sua lição está pausada')).toBeNull();
    expect(await screen.findByText('Concluir e voltar')).toBeTruthy();
  });

  it('a revisão termina como revisão, sem pedir avaliação de aula', async () => {
    await errarARevisao();
    fireEvent.press(await screen.findByText('Concluir e voltar'));

    expect(await screen.findByText('Revisão concluída')).toBeTruthy();
    expect(screen.queryByText('A lição foi concluída')).toBeNull();
    expect(screen.queryByText('Avalie a aula')).toBeNull();
  });

  it('a lição continua custando vida no erro', async () => {
    JourneyDefinitionService.getNodeType.mockReturnValue('lesson');
    renderWithProviders(<LessonFlowScreen blockId="block-1" nodeId="node-1" />);
    expect(await screen.findByText('Qual padrão radiográfico está presente?')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Pneumotórax'));
    fireEvent.press(screen.getByText('Conferir resposta'));

    await waitFor(() => expect(heartsRepository.spend).toHaveBeenCalledTimes(1));
  });
});

describe('FILA 58 — integração do motor híbrido', () => {
  const { JourneyDefinitionService } = require('../../journey/services/JourneyDefinitionService');
  const { heartsRepository } = require('../../hearts/HeartsRepository');
  const hybridBlock = {
    ...blockFixture,
    sessionMode: 'hybrid-lesson',
    steps: [blockFixture.steps[0], {
      ...blockFixture.steps[0],
      contract: { ...blockFixture.steps[0].contract, id: 'step-q2' },
      step: { type: 'multiple-choice', payload: {
        prompt: 'Segunda pergunta?', options: [{ id: 'second-a', label: 'Resposta dois' }, { id: 'second-b', label: 'Outra resposta' }],
        correctOptionId: 'second-a', explanation: 'Explicação dois.',
      } },
    }],
  } as LessonBlock;
  beforeEach(() => {
    jest.clearAllMocks();
    JourneyDefinitionService.getNodeType.mockReturnValue('lesson');
    mockedLessonFlowService.getBlockById.mockReturnValue(hybridBlock);
    mockedLessonFlowService.getActivityById.mockReturnValue(undefined as never);
    heartsRepository.getSnapshot.mockResolvedValue({ count: 5, status: 'full', nextRefillAt: null, unlimitedUntil: null });
    heartsRepository.spend.mockResolvedValue({ count: 4, status: 'recovering', nextRefillAt: null, unlimitedUntil: null });
    mockedOutcome.recordCompletion.mockResolvedValue({ ...outcomeFixture, result: { ...outcomeFixture.result, totalQuestions: 2, correctAnswers: 1 } });
    mockedJourneyProgress.markNodeCompleted.mockResolvedValue({ track: { units: [] } } as never);
    (LearningAttemptsRepository.getAll as jest.Mock).mockResolvedValue([]);
    (LessonRatingService.getRating as jest.Mock).mockResolvedValue(null);
  });
  async function open() {
    renderWithProviders(<LessonFlowScreen blockId="block-1" nodeId="node-1" />);
    await screen.findByText('Qual padrão radiográfico está presente?');
  }
  async function answer(label: string) {
    fireEvent.press(screen.getByLabelText(label));
    fireEvent.press(screen.getByText('Conferir resposta'));
    await screen.findByTestId('lesson-item-feedback');
  }
  it('M4 primeiro contato não custa; só erro no retorno custa uma vida', async () => {
    await open();
    fireEvent.press(screen.getByLabelText('Pneumotórax'));
    fireEvent.press(screen.getByText('Conferir resposta'));
    await waitFor(() => expect(announceForAccessibility).toHaveBeenCalled());
    expect(heartsRepository.spend).not.toHaveBeenCalled();
    expect(await screen.findByTestId('lesson-item-feedback')).toBeTruthy();
    expect(screen.getByText('Sua resposta: Pneumotórax')).toBeTruthy();
    expect(screen.getByText('Resposta certa: Consolidação alveolar')).toBeTruthy();
    fireEvent.press(screen.getByText('Continuar'));
    await answer('Resposta dois');
    fireEvent.press(screen.getByText('Continuar'));
    expect(screen.getByText('Vamos tentar novamente')).toBeTruthy();
    await answer('Pneumotórax');
    expect(heartsRepository.spend).toHaveBeenCalledTimes(1);
    fireEvent.press(screen.getByText('Concluir e voltar'));
    expect(await screen.findByText('1 de 2 corretas')).toBeTruthy();
    expect(mockedOutcome.recordCompletion).toHaveBeenCalledTimes(1);
    expect(mockedOutcome.recordCompletion).toHaveBeenCalledWith(expect.objectContaining({
      confirmedAnswers: { 'step-choice': false, 'step-q2': true },
      firstConfirmedAnswers: { 'step-choice': false, 'step-q2': true },
    }));
  });
  it('M6 Refazer abre tentativa limpa e conserva primeira resposta distinta da correção', async () => {
    await open();
    await answer('Pneumotórax');
    fireEvent.press(screen.getByText('Continuar'));
    await answer('Resposta dois');
    fireEvent.press(screen.getByText('Continuar'));
    await answer('Consolidação alveolar');
    fireEvent.press(screen.getByText('Concluir e voltar'));
    expect(await screen.findByText('1 de 2 corretas')).toBeTruthy();
    expect(mockedOutcome.recordCompletion).toHaveBeenCalledWith(expect.objectContaining({
      confirmedAnswers: { 'step-choice': true, 'step-q2': true },
      firstConfirmedAnswers: { 'step-choice': false, 'step-q2': true },
    }));
    fireEvent.press(screen.getByRole('button', { name: 'Refazer' }));
    expect(await screen.findByText('Qual padrão radiográfico está presente?')).toBeTruthy();
    expect(screen.queryByText('A lição foi concluída')).toBeNull();
    expect(screen.getByText('Conferir resposta')).toBeTruthy();
    expect(mockedOutcome.recordCompletion).toHaveBeenCalledTimes(1);
  });
  // Decisão do dono (ADR de 2026-10-18, régua e última vida): perder a última
  // vida no último retorno conclui a lição, como na lição legada.
  it('M4 a última vida perdida no último retorno conclui a lição, sem abrir a folha', async () => {
    heartsRepository.spend.mockResolvedValue({ count: 0, status: 'empty', nextRefillAt: null, unlimitedUntil: null });
    await open();
    await answer('Pneumotórax');
    fireEvent.press(screen.getByText('Continuar'));
    await answer('Resposta dois');
    fireEvent.press(screen.getByText('Continuar'));
    await answer('Pneumotórax');
    expect(heartsRepository.spend).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('lesson-item-feedback')).toBeTruthy();
    fireEvent.press(screen.getByText('Concluir e voltar'));
    expect(await screen.findByText('1 de 2 corretas')).toBeTruthy();
    expect(screen.queryByText('Sua lição está pausada')).toBeNull();
    expect(mockedOutcome.recordCompletion).toHaveBeenCalledTimes(1);
    expect(mockedOutcome.recordCompletion).toHaveBeenCalledWith(expect.objectContaining({
      firstConfirmedAnswers: { 'step-choice': false, 'step-q2': true },
    }));
  });

  it('M4 a última vida perdida num retorno que não é o último pausa antes do próximo retorno', async () => {
    mockedLessonFlowService.getBlockById.mockReturnValue({ ...hybridBlock, steps: [...hybridBlock.steps, {
      ...blockFixture.steps[0],
      contract: { ...blockFixture.steps[0].contract, id: 'step-q3' },
      step: { type: 'multiple-choice', payload: {
        prompt: 'Terceira pergunta?', options: [{ id: 'third-a', label: 'Resposta três' }, { id: 'third-b', label: 'Errada três' }],
        correctOptionId: 'third-a', explanation: 'Explicação três.',
      } },
    }] } as LessonBlock);
    heartsRepository.spend.mockResolvedValue({ count: 0, status: 'empty', nextRefillAt: null, unlimitedUntil: null });
    renderWithProviders(<LessonFlowScreen blockId="block-1" nodeId="node-1" />);
    await screen.findByText('Qual padrão radiográfico está presente?');
    await answer('Pneumotórax');
    fireEvent.press(screen.getByText('Continuar'));
    await answer('Resposta dois');
    fireEvent.press(screen.getByText('Continuar'));
    await answer('Errada três');
    fireEvent.press(screen.getByText('Continuar'));
    await answer('Pneumotórax');
    expect(heartsRepository.spend).toHaveBeenCalledTimes(1);
    fireEvent.press(screen.getByText('Continuar'));
    expect(await screen.findByText('Sua lição está pausada')).toBeTruthy();
    expect(mockedOutcome.recordCompletion).not.toHaveBeenCalled();
  });

  it('M6 refazer uma lição retomada começa no contexto, sem reutilizar o cursor consumido', async () => {
    const withContext: LessonBlock = { ...hybridBlock, steps: [{
      contract: { id: 'intro', type: 'context', completionRule: 'displayed', retryRule: 'allow_continue', branching: 'none' },
      step: { type: 'context', payload: { title: 'Contexto da nova tentativa', body: 'Comece aqui.' } },
    }, ...hybridBlock.steps] };
    mockedLessonFlowService.getBlockById.mockReturnValue(withContext);
    renderWithProviders(<LessonFlowScreen blockId="block-1" nodeId="node-1" resumeCursorId="step-2" />);
    await screen.findByText('Qual padrão radiográfico está presente?');
    await answer('Pneumotórax');
    fireEvent.press(screen.getByText('Continuar'));
    await answer('Resposta dois');
    fireEvent.press(screen.getByText('Continuar'));
    await answer('Consolidação alveolar');
    fireEvent.press(screen.getByText('Concluir e voltar'));
    fireEvent.press(await screen.findByText('Refazer'));
    expect(await screen.findByText('Contexto da nova tentativa')).toBeTruthy();
    expect(screen.getByText('Continuar')).toBeTruthy();
    expect(screen.queryByText('Qual padrão radiográfico está presente?')).toBeNull();
  });

  it('M3 acrescentar retorno não reinicia o checkpoint ativo da mesma sessão', async () => {
    const mode = require('../../student-checkpoints/mode');
    const runtime = require('../../student-checkpoints/ActiveCheckpointRuntime');
    const modeSpy = jest.spyOn(mode, 'resolveStudentCheckpointRuntimeMode').mockReturnValue('active');
    const start = jest.spyOn(runtime.ActiveCheckpointRuntime.prototype, 'start').mockResolvedValue({ status: 'off', handle: null });
    try {
      await open();
      expect(start).toHaveBeenCalledTimes(1);
      await answer('Pneumotórax');
      expect(screen.getByText('Sua resposta: Pneumotórax')).toBeTruthy();
      expect(start).toHaveBeenCalledTimes(1);
    } finally {
      start.mockRestore();
      modeSpy.mockRestore();
    }
  });

  it('C2 o feedback tem o tom do resultado: erro em statusError, acerto em statusSuccess', async () => {
    await open();
    await answer('Pneumotórax');
    const errado = StyleSheet.flatten(screen.getByTestId('lesson-item-feedback').props.style);
    expect(errado.borderColor).toBe(semanticColors.galaxy.statusError);
    expect(StyleSheet.flatten(screen.getByText('Vamos reforçar').props.style).color).toBe(semanticColors.galaxy.statusError);
    fireEvent.press(screen.getByText('Continuar'));
    await answer('Resposta dois');
    const certo = StyleSheet.flatten(screen.getByTestId('lesson-item-feedback').props.style);
    expect(certo.borderColor).toBe(semanticColors.galaxy.statusSuccess);
    expect(StyleSheet.flatten(screen.getByText('Resposta correta').props.style).color).toBe(semanticColors.galaxy.statusSuccess);
    expect(certo.borderWidth).toBeGreaterThan(0);
  });

  it('M2 mantém título e corpo do feedback sem teto de fonte', async () => {
    await open();
    await answer('Pneumotórax');
    expect(screen.getByText('Vamos reforçar').props.maxFontSizeMultiplier).toBeUndefined();
    expect(screen.getByText('A opacidade focal com broncograma aéreo sugere consolidação alveolar.').props.maxFontSizeMultiplier).toBeUndefined();
    expect(screen.getByText('Sua resposta: Pneumotórax')).toBeTruthy();
  });

  it('M4 sem vidas o contexto libera o primeiro contato e só o retorno pausa', async () => {
    heartsRepository.getSnapshot.mockResolvedValue({ count: 0, status: 'empty', nextRefillAt: null, unlimitedUntil: null });
    mockedLessonFlowService.getBlockById.mockReturnValue({ ...hybridBlock, steps: [{
      contract: { id: 'intro', type: 'context', completionRule: 'displayed', retryRule: 'allow_continue', branching: 'none' },
      step: { type: 'context', payload: { title: 'Contexto livre', body: 'Comece aqui.' } },
    }, ...hybridBlock.steps] });
    renderWithProviders(<LessonFlowScreen blockId="block-1" nodeId="node-1" />);
    await screen.findByText('Contexto livre');
    await act(async () => { await Promise.resolve(); });
    await act(async () => { fireEvent.press(screen.getByText('Continuar')); });
    expect(screen.queryByText('Sua lição está pausada')).toBeNull();
    expect(screen.getByText('Qual padrão radiográfico está presente?')).toBeTruthy();
    await answer('Pneumotórax');
    expect(screen.queryByText('Sua lição está pausada')).toBeNull();
    await act(async () => { fireEvent.press(screen.getByText('Continuar')); });
    await answer('Resposta dois');
    await act(async () => { fireEvent.press(screen.getByText('Continuar')); });
    expect(screen.getByText('Vamos tentar novamente')).toBeTruthy();
    await act(async () => { fireEvent.press(screen.getByLabelText('Pneumotórax')); });
    await act(async () => { fireEvent.press(screen.getByText('Conferir resposta')); });
    expect(await screen.findByText('Sua lição está pausada')).toBeTruthy();
    expect(heartsRepository.spend).not.toHaveBeenCalled();
    expect(mockedOutcome.recordCompletion).not.toHaveBeenCalled();
  });

});

describe('LessonFlowScreen — o retorno que o aluno vê vem de feedbackFor', () => {
  const closing = promotedActivityFixture.steps[2];
  // `sessionMode` liga o retorno por item (o bloco `lesson-item-feedback`).
  // Sem passos legados, o player lê só a atividade v2.
  const hybridShell = { ...blockFixture, sessionMode: 'hybrid-lesson', steps: [] } as unknown as LessonBlock;

  function choiceActivity(): LearningActivityV2 {
    const original = promotedActivityFixture.steps[1];
    if (original.kind !== 'interaction' || original.interaction.type !== 'multiple-choice') throw new Error('Fixture sem escolha');
    return {
      ...promotedActivityFixture,
      steps: [
        { kind: 'interaction', interaction: { ...original.interaction, payload: {
          ...original.interaction.payload,
          options: [
            { id: 'proton', label: 'Próton', explanation: 'O próton tem carga positiva, não negativa.' },
            { id: 'eletron', label: 'Elétron' },
          ],
        } } },
        closing,
      ],
    };
  }

  function benchActivity(atLeast: number): LearningActivityV2 {
    return {
      ...promotedActivityFixture,
      steps: [
        {
          kind: 'interaction',
          interaction: {
            id: 'activity-bench',
            type: 'bench',
            competencyIds: ['competency:bancada'],
            evidenceKind: 'guided-practice',
            completionRule: 'answered',
            criticalSafety: false,
            feedback: { correct: 'Contraste certo.', incorrect: 'Reveja o kV.' },
            accessibility: { label: 'Bancada de exposição' },
            payload: {
              prompt: 'Suba o kV até o alvo.',
              simulator: 'exposure',
              mode: 'challenge',
              controls: [
                { id: 'kv', label: 'Tensão', unit: 'kV', min: 40, max: 120, step: 10, initial: 70 },
                { id: 'mas', label: 'Carga', unit: 'mAs', min: 1, max: 40, step: 1, initial: 10 },
              ],
              goal: { kind: 'reach', control: 'kv', atLeast },
              phantomLabel: 'Fantoma simulado',
              hints: { tooLow: 'Suba o kV.', tooHigh: 'Desça o kV.' },
            },
          },
        },
        closing,
      ],
    };
  }

  // O valor inicial da bancada só sobe ao player por um efeito depois da
  // montagem, e até lá o botão está desabilitado. `fireEvent.press` descarta em
  // silêncio o toque num Pressable desabilitado, e o `accessibilityState` do nó
  // ainda pode dizer `disabled: false` nessa janela. Medido com
  // `taskpolicy -b`: o toque logo depois do `findByText` caía antes do efeito e
  // o teste reprovava 2 de 2. Espera-se a porta que o `fireEvent` consulta.
  async function esperarBotaoApto(name: string) {
    await waitFor(() => {
      expect(screen.getByRole('button', { name }).props.onStartShouldSetResponder?.()).toBe(true);
    });
  }

  beforeEach(() => {
    jest.clearAllMocks();
    mockedLessonFlowService.getBlockById.mockReturnValue(hybridShell);
  });

  it('escolha errada: o bloco mostra a explicação da alternativa marcada, e o anúncio diz o mesmo', async () => {
    mockedLessonFlowService.getActivityById.mockReturnValue(choiceActivity());
    renderWithProviders(<LessonFlowScreen blockId="activity:escolha" nodeId="node:escolha" />);
    await screen.findByText('Qual partícula tem carga negativa?');

    fireEvent.press(screen.getByLabelText('Próton'));
    fireEvent.press(screen.getByText('Conferir resposta'));

    const bloco = await screen.findByTestId('lesson-item-feedback');
    expect(within(bloco).getByText('O próton tem carga positiva, não negativa.')).toBeTruthy();
    expect(within(bloco).queryByText('Compare as cargas.')).toBeNull();
    await waitFor(() => expect(announceForAccessibility).toHaveBeenCalledWith(
      expect.stringContaining('O próton tem carga positiva, não negativa.'),
    ));
  });

  it('bancada errada: o bloco mostra a dica do lado certo, sem as linhas de resposta da escolha', async () => {
    mockedLessonFlowService.getActivityById.mockReturnValue(benchActivity(100));
    renderWithProviders(<LessonFlowScreen blockId="activity:bancada" nodeId="node:bancada" />);
    await screen.findByText('Suba o kV até o alvo.');
    await esperarBotaoApto('Conferir resposta');

    fireEvent.press(screen.getByRole('button', { name: 'Conferir resposta' }));

    const bloco = await screen.findByTestId('lesson-item-feedback');
    expect(within(bloco).getByText('Vamos reforçar')).toBeTruthy();
    expect(within(bloco).getByText('Suba o kV.')).toBeTruthy();
    expect(within(bloco).queryByText(/Sua resposta|Resposta certa/)).toBeNull();
    expect(within(bloco).queryByText('Reveja o kV.')).toBeNull();
    await waitFor(() => expect(announceForAccessibility).toHaveBeenCalledWith(
      expect.stringContaining('Suba o kV.'),
    ));
  });

  it('bancada certa: o bloco mostra feedback.correct, sem dica', async () => {
    mockedLessonFlowService.getActivityById.mockReturnValue(benchActivity(60));
    renderWithProviders(<LessonFlowScreen blockId="activity:bancada" nodeId="node:bancada" />);
    await screen.findByText('Suba o kV até o alvo.');
    await esperarBotaoApto('Conferir resposta');

    fireEvent.press(screen.getByRole('button', { name: 'Conferir resposta' }));

    const bloco = await screen.findByTestId('lesson-item-feedback');
    expect(within(bloco).getByText('Resposta correta')).toBeTruthy();
    expect(within(bloco).getByText('Contraste certo.')).toBeTruthy();
    expect(within(bloco).queryByText('Suba o kV.')).toBeNull();
  });

  // O botão da bancada é o "Conferir" da prancheta: o valor inicial já sobe ao
  // player, então um toque sem mexer no controle contaria como primeira resposta
  // errada e custaria a estrela daquele item.
  function benchActivityMode(mode: 'explore' | 'challenge' | 'correct', atLeast: number): LearningActivityV2 {
    const base = benchActivity(atLeast);
    const [first, ...rest] = base.steps;
    if (first.kind !== 'interaction' || first.interaction.type !== 'bench') {
      throw new Error('benchActivity deve começar por uma bancada.');
    }
    return {
      ...base,
      steps: [
        { ...first, interaction: { ...first.interaction, payload: { ...first.interaction.payload, mode } } },
        ...rest,
      ],
    };
  }

  function estadoDoBotao(name: string) {
    return screen.getByRole('button', { name }).props.accessibilityState;
  }

  it('bancada: o botão diz "Conferir resposta", a mesma etiqueta da múltipla escolha', async () => {
    mockedLessonFlowService.getActivityById.mockReturnValue(benchActivity(100));
    renderWithProviders(<LessonFlowScreen blockId="activity:bancada" nodeId="node:bancada" />);
    await screen.findByText('Suba o kV até o alvo.');

    expect(await screen.findByRole('button', { name: 'Conferir resposta' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Continuar' })).toBeNull();
  });

  it('bancada guiada (explorar): o botão fica desabilitado no valor inicial e habilita ao atingir o alvo', async () => {
    mockedLessonFlowService.getActivityById.mockReturnValue(benchActivityMode('explore', 100));
    renderWithProviders(<LessonFlowScreen blockId="activity:bancada" nodeId="node:bancada" />);
    await screen.findByText('Suba o kV até o alvo.');

    // O valor inicial (70 kV) sobe ao player por um efeito. Esperar o botão
    // existir não basta: o desabilitado tem de continuar assim depois dele.
    await waitFor(() => expect(screen.getByLabelText('Tensão')).toBeTruthy());
    expect(estadoDoBotao('Conferir resposta')?.disabled).toBe(true);

    // 70 -> 90 ainda não chega ao alvo de 100 kV.
    fireEvent.press(screen.getByRole('button', { name: 'Aumentar Tensão' }));
    fireEvent.press(screen.getByRole('button', { name: 'Aumentar Tensão' }));
    await waitFor(() => expect(screen.getByText('90 kV')).toBeTruthy());
    expect(estadoDoBotao('Conferir resposta')?.disabled).toBe(true);

    fireEvent.press(screen.getByRole('button', { name: 'Aumentar Tensão' }));
    await esperarBotaoApto('Conferir resposta');
    expect(estadoDoBotao('Conferir resposta')?.disabled).toBeFalsy();
  });

  it('bancada de corrigir: o botão também espera o alvo', async () => {
    mockedLessonFlowService.getActivityById.mockReturnValue(benchActivityMode('correct', 100));
    renderWithProviders(<LessonFlowScreen blockId="activity:bancada" nodeId="node:bancada" />);
    await screen.findByText('Suba o kV até o alvo.');

    await waitFor(() => expect(screen.getByLabelText('Tensão')).toBeTruthy());
    expect(estadoDoBotao('Conferir resposta')?.disabled).toBe(true);

    // Depois de mexer o passo está completo, e o botão ainda espera o alvo.
    fireEvent.press(screen.getByRole('button', { name: 'Aumentar Tensão' }));
    await waitFor(() => expect(screen.getByText('80 kV')).toBeTruthy());
    expect(estadoDoBotao('Conferir resposta')?.disabled).toBe(true);
  });

  it('bancada de desafio: o botão fica habilitado no valor inicial, porque o erro indica a direção', async () => {
    mockedLessonFlowService.getActivityById.mockReturnValue(benchActivityMode('challenge', 100));
    renderWithProviders(<LessonFlowScreen blockId="activity:bancada" nodeId="node:bancada" />);
    await screen.findByText('Suba o kV até o alvo.');

    await esperarBotaoApto('Conferir resposta');
    expect(estadoDoBotao('Conferir resposta')?.disabled).toBeFalsy();
  });

  it('bancada: depois de conferir, o botão volta a "Continuar"', async () => {
    mockedLessonFlowService.getActivityById.mockReturnValue(benchActivityMode('challenge', 100));
    renderWithProviders(<LessonFlowScreen blockId="activity:bancada" nodeId="node:bancada" />);
    await screen.findByText('Suba o kV até o alvo.');
    await esperarBotaoApto('Conferir resposta');

    fireEvent.press(screen.getByRole('button', { name: 'Conferir resposta' }));

    await screen.findByTestId('lesson-item-feedback');
    expect(screen.getByRole('button', { name: 'Continuar' })).toBeTruthy();
  });
});

describe('LessonFlowScreen — a conclusão da aula híbrida conta a primeira resposta de cada item', () => {
  // Defeito medido no simulador em 2026-10-24, na aula `bancada:exposicao`: o
  // aluno errou a primeira resposta de dois itens, acertou na volta e a
  // conclusão mostrou "Três estrelas. Nada passou despercebido." e "4 de 4
  // corretas". A régua (spec §5, ADR de 2026-10-18) pontua a PRIMEIRA resposta.
  // O serviço fica mockado neste arquivo; aqui `recordActivityCompletion`
  // delega ao real, para o placar que a tela mostra sair de
  // `activityToQuizResult` e não de um fixture que repete o que se quer provar.
  function duasEscolhas(): LearningActivityV2 {
    const original = promotedActivityFixture.steps[1];
    if (original.kind !== 'interaction' || original.interaction.type !== 'multiple-choice') throw new Error('Fixture sem escolha');
    const item = (id: string, prompt: string, certa: string, errada: string): LearningActivityV2['steps'][number] => ({
      kind: 'interaction',
      interaction: { ...original.interaction, id, type: 'multiple-choice' as const, accessibility: { label: prompt }, payload: {
        prompt,
        options: [{ id: 'errada', label: errada }, { id: 'certa', label: certa }],
        correctOptionId: 'certa',
      } },
    });
    // O id da aula de exemplo é o que liga o modo híbrido, como no deep link
    // `radiantapp://learn?blockId=bancada:exposicao`, que não traz bloco nem nó.
    return {
      ...promotedActivityFixture,
      id: EXPOSICAO.id,
      steps: [
        item('item-um', 'Primeiro item?', 'Certa um', 'Errada um'),
        item('item-dois', 'Segundo item?', 'Certa dois', 'Errada dois'),
      ],
    };
  }

  const heartsRepository = require('../../hearts/HeartsRepository').heartsRepository as { getSnapshot: jest.Mock; spend: jest.Mock };
  const { JourneyDefinitionService } = require('../../journey/services/JourneyDefinitionService') as {
    JourneyDefinitionService: { getNodeType: jest.Mock };
  };
  let warnSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  async function responder(label: string) {
    fireEvent.press(screen.getByLabelText(label));
    fireEvent.press(screen.getByText('Conferir resposta'));
    await screen.findByTestId('lesson-item-feedback');
  }

  beforeEach(() => {
    jest.clearAllMocks();
    JourneyDefinitionService.getNodeType.mockReturnValue('lesson');
    heartsRepository.getSnapshot.mockResolvedValue({ count: 5, status: 'full', nextRefillAt: null, unlimitedUntil: null });
    heartsRepository.spend.mockResolvedValue({ count: 4, status: 'recovering', nextRefillAt: null, unlimitedUntil: null });
    const { LessonOutcomeService: real } = jest.requireActual('../services/LessonOutcomeService');
    mockedLessonFlowService.getBlockById.mockReturnValue(null);
    mockedLessonFlowService.getActivityById.mockReturnValue(duasEscolhas());
    mockedOutcome.recordActivityCompletion.mockImplementation((input) => real.recordActivityCompletion(input));
    mockedJourneyProgress.markNodeCompleted.mockResolvedValue({ track: { units: [] } } as never);
    (LearningAttemptsRepository.getAll as jest.Mock).mockResolvedValue([]);
    (LessonRatingService.getRating as jest.Mock).mockResolvedValue(null);
    // Sem a trilha montada, o serviço real avisa que não achou o nó e segue; o
    // aviso é ruído, o placar sai igual.
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('errar a primeira resposta de um item e acertar na volta não dá três estrelas', async () => {
    const { GamificationService } = require('../../gamification/services/GamificationService') as typeof import('../../gamification/services/GamificationService');
    const { DailyGoalService } = require('../../daily-goal/services/DailyGoalService') as typeof import('../../daily-goal/services/DailyGoalService');
    const reward = jest.spyOn(GamificationService, 'recordQuizCompletion');
    const dailyXp = jest.spyOn(DailyGoalService, 'recordXp');
    try {
    renderWithProviders(<LessonFlowScreen blockId={EXPOSICAO.id} nodeId="" />);
    await screen.findByText('Primeiro item?');

    await responder('Errada um');
    fireEvent.press(screen.getByText('Continuar'));
    await screen.findByText('Segundo item?');
    await responder('Certa dois');
    fireEvent.press(screen.getByText('Continuar'));
    // O item errado volta ao fim, e o aluno acerta.
    await screen.findByText('Primeiro item?');
    await responder('Certa um');
    fireEvent.press(screen.getByText('Concluir e voltar'));

    // 1 de 2 pela primeira resposta: a régua dá 1 estrela, e não as 3 de "2 de 2".
    expect(await screen.findByText('1 de 2 corretas')).toBeTruthy();
    expect(screen.queryByText('2 de 2 corretas')).toBeNull();
    expect(screen.getByText('Sem XP nesta tentativa')).toBeTruthy();
    expect(reward).not.toHaveBeenCalled();
    expect(dailyXp).not.toHaveBeenCalled();
    expect(screen.getByLabelText('1 de 3 estrelas')).toBeTruthy();
    expect(screen.queryByText(/Nada passou despercebido|Perfeito|Marca cheia/u)).toBeNull();
    expect(mockedOutcome.recordActivityCompletion).toHaveBeenCalledWith(expect.objectContaining({
      confirmedAnswers: { 'item-um': true, 'item-dois': true },
      firstConfirmedAnswers: { 'item-um': false, 'item-dois': true },
    }));
    } finally {
      reward.mockRestore();
      dailyXp.mockRestore();
    }
  });
});

describe('LessonFlowScreen — sem nó, a tela não grava progresso da trilha', () => {
  // `learn.tsx` passa `nodeId=''` quando o deep link não traz o nó, como em
  // `radiantapp://learn?blockId=bancada:exposicao`. Gravar o nó vazio como atual
  // ou como retomada sobrescreveria o ponto real em que o aluno parou na trilha.
  const heartsRepository = require('../../hearts/HeartsRepository').heartsRepository as {
    getSnapshot: jest.Mock;
    spend: jest.Mock;
  };
  const { JourneyDefinitionService } = require('../../journey/services/JourneyDefinitionService') as {
    JourneyDefinitionService: { getNodeType: jest.Mock };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    JourneyDefinitionService.getNodeType.mockReturnValue('lesson');
    mockedLessonFlowService.getBlockById.mockReturnValue(null);
    mockedLessonFlowService.getActivityById.mockReturnValue(promotedActivityFixture);
    mockedOutcome.recordActivityCompletion.mockResolvedValue(outcomeFixture);
    mockedJourneyProgress.markNodeCompleted.mockResolvedValue({ track: { units: [] } } as never);
    heartsRepository.getSnapshot.mockResolvedValue({ count: 5, status: 'full', nextRefillAt: null, unlimitedUntil: null });
    heartsRepository.spend.mockResolvedValue({ count: 4, status: 'recovering', nextRefillAt: null, unlimitedUntil: null });
    (LearningAttemptsRepository.getAll as jest.Mock).mockResolvedValue([]);
    (LessonRatingService.getRating as jest.Mock).mockResolvedValue(null);
  });

  function expectNoJourneyWrites() {
    expect(mockedJourneyProgress.setCurrentNode).not.toHaveBeenCalled();
    expect(mockedJourneyProgress.setResumableNode).not.toHaveBeenCalled();
    expect(mockedJourneyProgress.markNodeCompleted).not.toHaveBeenCalled();
  }

  it('abrir e concluir a aula sem nó não marca nó nem toca no ponto de retomada', async () => {
    mockedLessonFlowService.getActivityById.mockReturnValue({ ...promotedActivityFixture, theme: 'tubo' });
    renderWithProviders(<LessonFlowScreen blockId="activity:materia-energia-e-radiacao:01" nodeId="" />);

    expect(await screen.findByText('Átomos têm partículas com cargas diferentes.')).toBeTruthy();
    fireEvent.press(screen.getByText('Continuar'));
    fireEvent.press(await screen.findByLabelText('Elétron'));
    fireEvent.press(screen.getByText('Conferir resposta'));
    fireEvent.press(await screen.findByText('Concluir e voltar'));

    // A aula chega à conclusão: a guarda não impede o aluno de terminar.
    expect(await screen.findByText('1 de 1 corretas')).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Estrutura e carga' })).toBeTruthy();
    expect(screen.UNSAFE_getByType(JourneyMedal).props.theme).toBe('tubo');
    expect(screen.UNSAFE_queryAllByType(Confetti)).toHaveLength(0);
    expect(mockedOutcome.recordActivityCompletion).toHaveBeenCalledTimes(1);
    expectNoJourneyWrites();
  });

  it('fechar a aula sem nó sai para a trilha sem gravar o passo', async () => {
    renderWithProviders(<LessonFlowScreen blockId="activity:materia-energia-e-radiacao:01" nodeId="" />);
    expect(await screen.findByText('Átomos têm partículas com cargas diferentes.')).toBeTruthy();

    fireEvent.press(screen.getByLabelText('Fechar quiz'));

    await waitFor(() => expect(mockedRouter.dismissTo).toHaveBeenCalledWith('/(tabs)'));
    expectNoJourneyWrites();
  });

  it('pausar sem vidas, sem nó, abre a folha sem gravar o passo', async () => {
    mockedLessonFlowService.getBlockById.mockReturnValue(blockFixture);
    mockedLessonFlowService.getActivityById.mockReturnValue(null);
    heartsRepository.spend.mockResolvedValue({ count: 0, status: 'empty', nextRefillAt: null, unlimitedUntil: null });
    renderWithProviders(<LessonFlowScreen blockId="block-1" nodeId="" />);
    expect(await screen.findByText('Qual padrão radiográfico está presente?')).toBeTruthy();

    fireEvent.press(screen.getByLabelText('Pneumotórax'));
    fireEvent.press(screen.getByText('Conferir resposta'));

    expect(await screen.findByText('Sua lição está pausada')).toBeTruthy();
    expectNoJourneyWrites();
  });

  it('sem nó, o checkpoint ativo não começa: ele viraria uma retomada sem nó para onde voltar', async () => {
    const mode = require('../../student-checkpoints/mode');
    const runtime = require('../../student-checkpoints/ActiveCheckpointRuntime');
    const modeSpy = jest.spyOn(mode, 'resolveStudentCheckpointRuntimeMode').mockReturnValue('active');
    const start = jest.spyOn(runtime.ActiveCheckpointRuntime.prototype, 'start').mockResolvedValue({ status: 'off', handle: null });
    try {
      renderWithProviders(<LessonFlowScreen blockId="activity:materia-energia-e-radiacao:01" nodeId="" />);
      expect(await screen.findByText('Átomos têm partículas com cargas diferentes.')).toBeTruthy();
      fireEvent.press(screen.getByText('Continuar'));
      expect(await screen.findByLabelText('Elétron')).toBeTruthy();

      expect(start).not.toHaveBeenCalled();
    } finally {
      start.mockRestore();
      modeSpy.mockRestore();
    }
  });
});

describe('LessonFlowScreen — as aulas-bancada correm como lição híbrida', () => {
  // As aulas de exemplo não têm bloco legado, e é o `sessionMode` do bloco que
  // liga o retorno por item, o primeiro contato sem custo e a volta do item
  // errado (spec, seção 5). Sem ele, a dica da bancada nunca aparecia.
  const heartsRepository = require('../../hearts/HeartsRepository').heartsRepository as {
    getSnapshot: jest.Mock;
    spend: jest.Mock;
  };
  const { JourneyDefinitionService } = require('../../journey/services/JourneyDefinitionService') as {
    JourneyDefinitionService: { getNodeType: jest.Mock };
  };
  const steps = EXPOSICAO.steps;
  const challenge = steps[2];
  const reading = steps[3];
  const closing = steps[5];
  if (challenge.kind !== 'interaction' || challenge.interaction.type !== 'bench'
    || reading.kind !== 'interaction' || reading.interaction.type !== 'multiple-choice' || closing.kind !== 'presentation') {
    throw new Error('A aula de exposição mudou de roteiro: abertura, explorar, desafio, leitura, corrigir, fechamento.');
  }
  const benchPayload = challenge.interaction.payload;
  const readingPayload = reading.interaction.payload;
  const rightLabel = readingPayload.options.find(option => option.id === readingPayload.correctOptionId)?.label ?? '';

  // O mesmo motivo de `esperarBotaoApto` acima: o valor inicial da bancada sobe
  // ao player por um efeito depois da montagem.
  async function esperarConferirApto() {
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Conferir resposta' }).props.onStartShouldSetResponder?.()).toBe(true);
    });
  }

  beforeEach(() => {
    jest.clearAllMocks();
    JourneyDefinitionService.getNodeType.mockReturnValue('lesson');
    mockedLessonFlowService.getBlockById.mockReturnValue(null);
    heartsRepository.getSnapshot.mockResolvedValue({ count: 5, status: 'full', nextRefillAt: null, unlimitedUntil: null });
    heartsRepository.spend.mockResolvedValue({ count: 4, status: 'recovering', nextRefillAt: null, unlimitedUntil: null });
  });

  it('a bancada errada no primeiro contato mostra a dica do lado certo e não custa vida', async () => {
    // O desafio, e não o explorar: no explorar o botão espera o alvo, então o
    // aluno não erra ali. No desafio o erro é permitido e indica o lado.
    mockedLessonFlowService.getActivityById.mockReturnValue({ ...EXPOSICAO, steps: [challenge, closing] });
    renderWithProviders(<LessonFlowScreen blockId="bancada:exposicao" nodeId="" />);
    expect(await screen.findByText(benchPayload.prompt)).toBeTruthy();
    await esperarConferirApto();

    // O kV parte de 110, acima dos 70 da referência: errar pelo lado alto.
    fireEvent.press(screen.getByRole('button', { name: 'Conferir resposta' }));

    const bloco = await screen.findByTestId('lesson-item-feedback');
    expect(within(bloco).getByText(benchPayload.hints.tooHigh)).toBeTruthy();
    expect(heartsRepository.spend).not.toHaveBeenCalled();
  });

  it('o fechamento mostra o próprio título e texto, e não o retorno da última interação', async () => {
    mockedLessonFlowService.getActivityById.mockReturnValue({ ...EXPOSICAO, steps: [reading, closing] });
    renderWithProviders(<LessonFlowScreen blockId="bancada:exposicao" nodeId="" />);
    expect(await screen.findByText(readingPayload.prompt)).toBeTruthy();

    fireEvent.press(screen.getByLabelText(rightLabel));
    fireEvent.press(screen.getByText('Conferir resposta'));
    expect(await screen.findByTestId('lesson-item-feedback')).toBeTruthy();
    fireEvent.press(screen.getByText('Continuar'));

    expect(await screen.findByText(closing.payload.title)).toBeTruthy();
    expect(screen.getByText(closing.payload.body ?? '')).toBeTruthy();
    expect(screen.queryByText('Resposta correta')).toBeNull();
    expect(screen.queryByText(reading.interaction.feedback.correct)).toBeNull();
  });
});

describe('T04 — abertura, retorno e botão apto', () => {
  const closing = promotedActivityFixture.steps[2];
  const shell = { ...blockFixture, sessionMode: 'hybrid-lesson', steps: [] } as unknown as LessonBlock;
  const message = 'Retorno da atividade.';
  function item(type: 'multiple-choice' | 'comparison' | 'hotspot' | 'matching' | 'ordering' | 'bench'): LearningInteractionV2 {
    const common = { id: `t04:${type}`, type, competencyIds: ['competency:test'], evidenceKind: 'guided-practice', completionRule: 'answered', criticalSafety: false,
      accessibility: { label: 'Imagem da atividade' }, feedback: { correct: 'Certo.', incorrect: message } };
    const choices = { prompt: 'Escolha a resposta.', options: [{ id: 'a', label: 'Opção A' }, { id: 'b', label: 'Opção B', explanation: message }], correctOptionId: 'a' };
    const payload = type === 'bench' ? { prompt: 'Ajuste o controle.', simulator: 'exposure', mode: 'challenge', controls: [{ id: 'kv', label: 'Tensão', unit: 'kV', min: 40, max: 120, step: 10, initial: 70 }], goal: { kind: 'reach', control: 'kv', atLeast: 100 }, phantomLabel: 'Fantoma simulado', hints: { tooLow: message, tooHigh: 'Desça.' } }
      : type === 'hotspot' ? { prompt: 'Escolha a região.', imageRef: 'https://example.test/image.png', regions: [{ id: 'a', label: 'Região A', x: 0, y: 0, width: 0.4, height: 0.4 }, { id: 'b', label: 'Região B', x: 0.5, y: 0.5, width: 0.4, height: 0.4 }], correctRegionIds: ['a'] }
      : type === 'matching' ? { prompt: 'Associe os pares.', pairs: [{ id: 'a', left: 'A', right: 'Alfa' }, { id: 'b', left: 'B', right: 'Beta' }] }
      : type === 'ordering' ? { prompt: 'Ordene os itens.', items: [{ id: 'a', label: 'Primeiro' }, { id: 'b', label: 'Segundo' }], correctOrder: ['b', 'a'] } : choices;
    return { ...common, payload } as LearningInteractionV2;
  }
  function lesson(interaction: LearningInteractionV2): LearningActivityV2 {
    return { ...promotedActivityFixture, steps: [{ kind: 'interaction', interaction }, closing] };
  }
  async function esperarBotaoApto(name: string) {
    await waitFor(() => expect(screen.getByRole('button', { name }).props.onStartShouldSetResponder?.()).toBe(true));
  }
  beforeEach(() => {
    jest.clearAllMocks();
    mockedLessonFlowService.getBlockById.mockReturnValue(shell);
  });
  const registered = ['multiple-choice', 'comparison', 'hotspot', 'matching', 'ordering', 'bench'] as const;
  it.each(registered.flatMap(type => [false, true].map(correct => ({ type, correct }))))('$type correto=$correct mostra o retorno e o anuncia uma vez sem região viva duplicada', async ({ type, correct }) => {
    mockedLessonFlowService.getActivityById.mockReturnValue(lesson(item(type)));
    renderWithProviders(<LessonFlowScreen blockId="t04" nodeId="" />);
    await screen.findByText(type === 'bench' ? 'Ajuste o controle.' : type === 'hotspot' ? 'Escolha a região.' : type === 'matching' ? 'Associe os pares.' : type === 'ordering' ? 'Ordene os itens.' : 'Escolha a resposta.');
    if (type === 'multiple-choice' || type === 'comparison') fireEvent.press(screen.getByRole('button', { name: correct ? 'Opção A' : 'Opção B' }));
    if (type === 'hotspot') fireEvent.press(screen.getByRole('button', { name: correct ? 'Selecionar Região A na lista' : 'Selecionar Região B na lista' }));
    if (type === 'matching') {
      fireEvent.press(screen.getByRole('button', { name: correct ? 'Associar A a Alfa' : 'Associar A a Beta' }));
      fireEvent.press(screen.getByRole('button', { name: correct ? 'Associar B a Beta' : 'Associar B a Alfa' }));
    }
    if (type === 'ordering') {
      if (correct) fireEvent.press(screen.getByRole('button', { name: 'Descer Primeiro' }));
      fireEvent.press(screen.getByRole('button', { name: 'Selecionar esta ordem' }));
    }
    if (type === 'bench' && correct) {
      for (let i = 0; i < 3; i++) fireEvent.press(screen.getByRole('button', { name: 'Aumentar Tensão' }));
    }
    const confirm = type === 'bench' || type === 'multiple-choice' ? 'Conferir resposta' : 'Continuar';
    await esperarBotaoApto(confirm);
    fireEvent.press(screen.getByRole('button', { name: confirm }));
    const feedback = await screen.findByTestId('lesson-item-feedback');
    expect(within(feedback).getByRole('header', { name: correct ? 'Resposta correta' : 'Vamos reforçar' })).toBeTruthy();
    const expectedMessage = correct ? 'Certo.' : message;
    expect(within(feedback).getByText(expectedMessage)).toBeTruthy();
    expect(feedback.props.accessibilityLiveRegion).toBeUndefined();
    expect(announceForAccessibility.mock.calls.filter(([text]) => String(text).includes(expectedMessage))).toHaveLength(1);
    // A pergunta continua na tela; o segundo toque, não a seleção, avança.
    await esperarBotaoApto('Continuar');
    fireEvent.press(screen.getByRole('button', { name: 'Continuar' }));
    expect(await screen.findByText('Síntese')).toBeTruthy();
  });
  it('abertura usa o tema explícito sem nó e preserva o texto independente', async () => {
    mockedLessonFlowService.getBlockById.mockReturnValue(null);
    mockedLessonFlowService.getActivityById.mockReturnValue({ ...promotedActivityFixture, theme: 'tubo' } as LearningActivityV2);
    const view = renderWithProviders(<LessonFlowScreen blockId="t04" nodeId="" />);
    await screen.findByText('Estrutura e carga');
    expect(view.UNSAFE_getByType(JourneyMedal).props.theme).toBe('tubo');
    expect(screen.getByText('Átomos têm partículas com cargas diferentes.')).toBeTruthy();
    expect(mockedJourneyProgress.bootstrap).not.toHaveBeenCalled();
    expect(mockedJourneyProgress.setCurrentNode).not.toHaveBeenCalled();
  });
  it('abertura resolve tema do nó, depois da unidade real, sem ler progresso', async () => {
    const definition = require('../../journey/services/JourneyDefinitionService').JourneyDefinitionService as { getTrackDefinition: jest.Mock };
    const catalogSpy = jest.spyOn(LessonCatalogService, 'listTracks').mockReturnValue([{ id: 't04-track' }] as ReturnType<typeof LessonCatalogService.listTracks>);
    mockedLessonFlowService.getBlockById.mockReturnValue(null);
    mockedLessonFlowService.getActivityById.mockReturnValue({ ...promotedActivityFixture, theme: 'tubo' } as LearningActivityV2);
    definition.getTrackDefinition.mockReturnValue({ units: [{ theme: 'protecao', nodes: [{ id: 'node:theme', type: 'lesson', theme: 'ressonancia' }] }] });
    try {
      const view = renderWithProviders(<LessonFlowScreen blockId="t04" nodeId="node:theme" />);
      await screen.findByText('Estrutura e carga');
      expect(view.UNSAFE_getByType(JourneyMedal).props.theme).toBe('ressonancia');
      view.unmount();
      definition.getTrackDefinition.mockReturnValue({ units: [{ theme: 'protecao', nodes: [{ id: 'node:theme', type: 'lesson' }] }] });
      const second = renderWithProviders(<LessonFlowScreen blockId="t04" nodeId="node:theme" />);
      await screen.findByText('Estrutura e carga');
      expect(second.UNSAFE_getByType(JourneyMedal).props.theme).toBe('protecao');
      expect(mockedJourneyProgress.bootstrap).not.toHaveBeenCalled();
    } finally { catalogSpy.mockRestore(); definition.getTrackDefinition.mockReturnValue({ units: [] }); }
  });
  it.each(['explore', 'correct'] as const)('%s explica a espera e anuncia aptidão só uma vez por visita', async mode => {
    const interaction = item('bench');
    if (interaction.type !== 'bench') throw new Error('bancada esperada');
    interaction.payload.mode = mode;
    mockedLessonFlowService.getActivityById.mockReturnValue(lesson(interaction));
    renderWithProviders(<LessonFlowScreen blockId="t04" nodeId="" />);
    await screen.findByText('Ajuste o controle.');
    expect(screen.getByRole('button', { name: 'Conferir resposta' }).props.accessibilityHint).toBe('Alcance o alvo indicado na atividade para conferir a resposta.');
    for (let i = 0; i < 3; i++) fireEvent.press(screen.getByRole('button', { name: 'Aumentar Tensão' }));
    await esperarBotaoApto('Conferir resposta');
    const ready = 'Alvo alcançado. Você já pode conferir a resposta.';
    await waitFor(() => expect(announceForAccessibility.mock.calls.filter(([text]) => text === ready)).toHaveLength(1));
    fireEvent.press(screen.getByRole('button', { name: 'Diminuir Tensão' }));
    fireEvent.press(screen.getByRole('button', { name: 'Aumentar Tensão' }));
    voltarParaATela();
    await esperarBotaoApto('Conferir resposta');
    expect(announceForAccessibility.mock.calls.filter(([text]) => text === ready)).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Conferir resposta' }).props.accessibilityHint).toBeUndefined();
  });
});

describe('T04 fix1 — contagem com texto ampliado', () => {
  it('deixa a contagem crescer pelas métricas nativas, sem comprimir a linha', async () => {
    mockedLessonFlowService.getBlockById.mockReturnValue(null);
    mockedLessonFlowService.getActivityById.mockReturnValue(promotedActivityFixture);
    renderWithProviders(<LessonFlowScreen blockId="t04:step-count" nodeId="" />);
    const count = await screen.findByText('Passo 1 de 3');
    // O Jest não mede glifos: verificamos o estilo entregue ao Text real.
    // lineHeight 16 herdado do micro recortou os glifos na evidência iOS AX5.
    const style = StyleSheet.flatten(count.props.style);
    expect(style.lineHeight).toBeUndefined();
    expect(style.flexShrink).toBe(0);
    expect(style.fontSize).toBeGreaterThan(0);
    expect(style.fontFamily).toBe('Sora-SemiBold');
    expect(style.height).toBeUndefined();
    expect(style.maxHeight).toBeUndefined();
    expect(style.overflow).not.toBe('hidden');
    expect(count.props.allowFontScaling).not.toBe(false);
    expect(count.props.maxFontSizeMultiplier).toBeUndefined();
    expect(count.props.numberOfLines).toBeUndefined();
  });
});
