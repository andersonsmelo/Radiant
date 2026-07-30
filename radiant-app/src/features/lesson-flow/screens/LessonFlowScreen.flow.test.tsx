import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import type { LessonBlock } from '../../../types/lessonFlow';
import LessonFlowScreen from './LessonFlowScreen';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { LessonOutcomeService } from '../services/LessonOutcomeService';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';
import { LessonFlowService } from '../services/LessonFlowService';

const mockedOutcome = LessonOutcomeService as jest.Mocked<typeof LessonOutcomeService>;
const mockedJourneyProgress = JourneyProgressService as jest.Mocked<typeof JourneyProgressService>;
const mockedLessonFlowService = LessonFlowService as jest.Mocked<typeof LessonFlowService>;

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

jest.mock('../components/LessonVisualPanel', () => ({
  LessonVisualPanel: () => null,
}));

jest.mock('../../journey/services/JourneyProgressService', () => ({
  JourneyProgressService: {
    setCurrentNode: jest.fn().mockResolvedValue(undefined),
    setResumableNode: jest.fn().mockResolvedValue(undefined),
    markNodeCompleted: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('../services/LessonFlowService', () => ({
  LessonFlowService: {
    getBlockById: jest.fn(),
  },
}));

jest.mock('../services/LessonOutcomeService', () => ({
  LessonOutcomeService: {
    recordCompletion: jest.fn().mockResolvedValue({ award: null, rewarded: true }),
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

describe('LessonFlowScreen — escolha da alternativa', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const { LessonFlowService } = jest.requireMock('../services/LessonFlowService') as {
      LessonFlowService: { getBlockById: jest.Mock };
    };
    LessonFlowService.getBlockById.mockReturnValue(blockFixture);
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
  });
});

describe('LessonFlowScreen — registro da conclusão', () => {
  beforeEach(() => {
    // Este describe não compartilha o beforeEach de "escolha da alternativa"
    // (escopo é por describe), e o arquivo não zera mocks globalmente entre
    // testes — sem isto, a contagem de chamadas de recordCompletion do
    // primeiro teste vaza para o segundo.
    mockedOutcome.recordCompletion.mockClear();
    mockedOutcome.recordCompletion.mockResolvedValue({ award: null, rewarded: true });
    mockedJourneyProgress.markNodeCompleted.mockClear();
    mockedJourneyProgress.markNodeCompleted.mockResolvedValue(undefined as never);
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
      return { award: null, rewarded: true };
    });
    // markNodeCompleted devolve JourneySnapshot na assinatura real, e a tela
    // ignora o retorno — daí o cast, que só existe para não montar um snapshot
    // inteiro num teste que mede ordem de chamada.
    mockedJourneyProgress.markNodeCompleted.mockImplementation(async () => {
      order.push('markNodeCompleted');
      return undefined as never;
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
