import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import type { LessonBlock } from '../../../types/lessonFlow';
import LessonFlowScreen from './LessonFlowScreen';
import { renderWithProviders } from '../../../test/renderWithProviders';

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
