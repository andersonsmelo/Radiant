import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
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

const mockedOutcome = LessonOutcomeService as jest.Mocked<typeof LessonOutcomeService>;
const mockedJourneyProgress = JourneyProgressService as jest.Mocked<typeof JourneyProgressService>;
const mockedLessonFlowService = LessonFlowService as jest.Mocked<typeof LessonFlowService>;
const mockedRouter = router as jest.Mocked<typeof router>;
const announceForAccessibility = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');

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
    AppButton: ({ children, onPress, disabled }: { children: React.ReactNode; onPress: () => void; disabled?: boolean }) => (
      <Pressable accessibilityRole="button" onPress={onPress} disabled={disabled}>
        <Text>{children}</Text>
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

jest.mock('../components/LessonVisualPanel', () => ({
  LessonVisualPanel: () => {
    const React = require('react');
    const { Text } = require('react-native');
    return <Text>PAINEL_VISUAL_LEGADO</Text>;
  },
}));

jest.mock('../../journey/services/JourneyProgressService', () => ({
  JourneyProgressService: {
    setCurrentNode: jest.fn().mockResolvedValue(undefined),
    setResumableNode: jest.fn().mockResolvedValue(undefined),
    // Devolve um snapshot porque a tela USA o retorno para localizar a unidade
    // ativa. Ler o snapshot à parte correria em paralelo com esta escrita e
    // poderia mostrar a unidade sem a lição que acabou de fechar.
    markNodeCompleted: jest.fn().mockResolvedValue({ track: { units: [] } }),
  },
}));

jest.mock('../../gamification/services/GamificationService', () => ({
  GamificationService: {
    getSnapshot: jest.fn().mockResolvedValue({
      totalXp: 40,
      streakDays: 2,
      lastActiveDate: '2026-08-15',
      hearts: 4,
      maxHearts: 5,
    }),
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

describe('LessonFlowScreen — escolha da alternativa', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const { LessonFlowService } = jest.requireMock('../services/LessonFlowService') as {
      LessonFlowService: { getBlockById: jest.Mock; getActivityById: jest.Mock };
    };
    LessonFlowService.getBlockById.mockReturnValue(blockFixture);
    LessonFlowService.getActivityById.mockReturnValue(null);
  });

  it('permite trocar a alternativa selecionada antes de confirmar', async () => {
    renderWithProviders(<LessonFlowScreen blockId="block-1" nodeId="node-1" />);

    expect(await screen.findByText('Qual padrão radiográfico está presente?')).toBeTruthy();

    const wrong = screen.getByLabelText('Pneumotórax');
    const right = screen.getByLabelText('Consolidação alveolar');

    fireEvent.press(wrong);
    expect(wrong.props.accessibilityState.selected).toBe(true);

    // O primeiro toque não pode congelar a escolha: até o "Continuar" nada foi
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
    fireEvent.press(screen.getByText('Continuar'));

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
    fireEvent.press(screen.getByText('Continuar'));

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
    fireEvent.press(screen.getByText('Continuar'));
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
    // Último passo do bloco: o rótulo do botão muda para "Concluir e voltar".
    fireEvent.press(screen.getByText('Concluir e voltar'));

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
    fireEvent.press(screen.getByText('Continuar'));

    expect(await screen.findByText('Resposta correta')).toBeTruthy();
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
    expect(screen.queryByText('PAINEL_VISUAL_LEGADO')).toBeNull();
    fireEvent.press(screen.getByText('Continuar'));
    expect(await screen.findByText('Qual partícula tem carga negativa?')).toBeTruthy();
    expect(screen.getByLabelText('Elétron')).toBeTruthy();
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
    fireEvent.press(screen.getByText('Continuar'));
    fireEvent.press(await screen.findByText('Concluir e voltar'));

    await waitFor(() => expect(mockedOutcome.recordActivityCompletion).toHaveBeenCalledTimes(1));
    expect(mockedOutcome.recordActivityCompletion).toHaveBeenCalledWith({
      activity: promotedActivityFixture,
      nodeId: 'node:activity:materia-energia-e-radiacao:01',
      confirmedAnswers: { 'activity-01-question': true },
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
    fireEvent.press(screen.getByText('Continuar'));
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
  });

  it('tira as estrelas da melhor tentativa, e não só da que acabou', async () => {
    // A regra da melhor tentativa estava inerte porque só /quiz a exibia, e
    // /quiz nunca grava tentativa. Aqui ela funciona sem código novo de
    // persistência: /learn JÁ é o escritor de LearningAttemptsRepository.
    //
    // Tentativa anterior perfeita e atual pior: as estrelas continuam sendo as
    // da melhor, e a tela não pode animar um ganho que não houve.
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
    expect(screen.getByLabelText('3 de 3 estrelas')).toBeTruthy();
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
