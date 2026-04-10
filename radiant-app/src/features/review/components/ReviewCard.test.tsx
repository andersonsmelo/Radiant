import React from 'react';
import { act, screen } from '@testing-library/react-native';
import type { QuizQuestion } from '../../../types/quiz';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { ReviewCard } from './ReviewCard';

const mockAppButton = jest.fn();
const mockCardEnter = {
  animatedStyle: {},
  reset: jest.fn(),
  animateIn: jest.fn(),
};
const mockShakeError = {
  style: {},
  animateIn: jest.fn(),
};
const mockPressScale = {
  animatedStyle: {},
  onPressIn: jest.fn(),
  onPressOut: jest.fn(),
};

jest.mock('../../../ui/motion', () => ({
  useCardEnter: () => mockCardEnter,
  useShakeError: () => mockShakeError,
  usePressScale: () => mockPressScale,
}));

jest.mock('../../../components/ui/AppButton', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return {
    AppButton: ({
      children,
      onPress,
      disabled,
    }: {
      children: React.ReactNode;
      onPress: () => void;
      disabled?: boolean;
    }) => {
      mockAppButton({ children, onPress, disabled });
      return <Text>{children}</Text>;
    },
  };
});

jest.mock('../../../components/ui/SurfaceCard', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    SurfaceCard: ({ children }: { children: React.ReactNode }) => <View>{children}</View>,
  };
});

const questionFixture: QuizQuestion = {
  id: 'review-question-1',
  type: 'multiple-choice',
  prompt: 'Qual achado deve ser revisto?',
  options: [{ label: 'Derrame pleural' }, { label: 'Pneumoperitônio' }],
  correctAnswerIndex: 0,
  explanation: 'O apagamento do seio costofrênico é compatível com derrame pleural.',
};

describe('ReviewCard', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    mockCardEnter.reset.mockClear();
    mockCardEnter.animateIn.mockClear();
    mockShakeError.animateIn.mockClear();
    mockPressScale.onPressIn.mockClear();
    mockPressScale.onPressOut.mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('reveals the correct answer before rating', () => {
    const onRate = jest.fn();

    renderWithProviders(<ReviewCard question={questionFixture} onRate={onRate} />);

    expect(screen.getByText('Mostrar resposta')).toBeTruthy();

    act(() => {
      mockAppButton.mock.calls.at(-1)?.[0].onPress();
    });

    expect(screen.getByText('Resposta correta')).toBeTruthy();
    expect(screen.getByText('Derrame pleural')).toBeTruthy();
    expect(
      screen.getByText('O apagamento do seio costofrênico é compatível com derrame pleural.')
    ).toBeTruthy();
    expect(screen.getByText('Revisar depois')).toBeTruthy();
    expect(screen.getByText('Acertei')).toBeTruthy();
    expect(onRate).not.toHaveBeenCalled();
  });

  it('submits a positive rating after a short delay', () => {
    const onRate = jest.fn();

    renderWithProviders(<ReviewCard question={questionFixture} onRate={onRate} />);

    act(() => {
      mockAppButton.mock.calls.at(-1)?.[0].onPress();
    });

    act(() => {
      mockAppButton.mock.calls.find(([props]) => props.children === 'Acertei')?.[0].onPress();
    });

    expect(onRate).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(onRate).toHaveBeenCalledWith(true);
  });

  it('submits a negative rating after the retry delay', () => {
    const onRate = jest.fn();

    renderWithProviders(<ReviewCard question={questionFixture} onRate={onRate} />);

    act(() => {
      mockAppButton.mock.calls.at(-1)?.[0].onPress();
    });

    act(() => {
      mockAppButton.mock.calls
        .find(([props]) => props.children === 'Revisar depois')
        ?.[0].onPress();
    });

    expect(onRate).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(onRate).toHaveBeenCalledWith(false);
  });
});
