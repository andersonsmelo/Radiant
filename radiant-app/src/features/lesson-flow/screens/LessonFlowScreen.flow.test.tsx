import React from 'react';
import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { AccessibilityInfo, StyleSheet } from 'react-native';
import type { LessonBlock } from '../../../types/lessonFlow';
import type { LearningActivityV2 } from '../../../types/learningActivity';
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

jest.mock('../../../ui/motion', () => ({
  duration: { micro: 0, ui: 0, celebrate: 0 },
  useFadeInUp: () => ({ style: {}, animateIn: jest.fn() }),
  // `scale` faz parte do contrato real do hook, e `SummaryStar` o usa no
  // caminho em que a marca NÃO melhorou: em vez de animar, fixa a escala em 1
  // direto, para não sugerir um ganho que não houve. Sem ele no mock, a
  // conclusão só montava quando as estrelas melhoravam.
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

// `QuizTopBar` renderiza as vidas por `HeartsDisplay`, e os ícones do HUD são
// vetor animado em `react-native-svg` — que não monta sob este renderer.
jest.mock('../../../ui/components/HUD', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    HUD: () => null,
    HeartsDisplay: () => <View testID="hearts-display" />,
  };
});

jest.mock('../../journey/services/JourneyProgressService', () => ({
  JourneyProgressService: {
    setCurrentNode: jest.fn().mockResolvedValue(undefined),
    bootstrap: jest.fn(),
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
  return { JourneyTrail: ({ header }: { header: React.ReactNode }) => <View>{header}</View> };
});

jest.mock('../../gamification/services/GamificationService', () => ({
  GamificationService: {
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
    HeartsSheet: ({ visible, storeAvailable, onSubscribe }: { visible: boolean; storeAvailable: boolean; onSubscribe: () => void }) =>
      visible ? (
        <>
          <Text>Sua lição está pausada</Text>
          <Text>{storeAvailable ? 'folha: com assinatura' : 'folha: sem assinatura'}</Text>
          <Pressable accessibilityRole="button" onPress={onSubscribe}><Text>Assinar pela folha</Text></Pressable>
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

jest.mock('../../../components/ui/Confetti', () => ({ Confetti: () => null }));

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
  JourneyDefinitionService: { getNodeType: jest.fn(() => 'lesson') },
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

  it('M2 limita a escala do título do feedback e mantém o corpo sem teto', async () => {
    await open();
    await answer('Pneumotórax');
    expect(screen.getByText('Vamos reforçar').props.maxFontSizeMultiplier).toBe(2);
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
