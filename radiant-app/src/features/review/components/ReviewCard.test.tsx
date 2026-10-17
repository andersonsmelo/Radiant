import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { ReviewCard } from './ReviewCard';
import type { QuizQuestion } from '../../../types/quiz';

const mockEnter = { animatedStyle: {}, reset: jest.fn(), animateIn: jest.fn() };
jest.mock('../../../ui/motion', () => ({
  useCardEnter: () => ({ ...mockEnter }),
  useShakeError: () => ({ style: {}, animateIn: jest.fn() }),
}));
jest.mock('../../../components/ui/AppButton', () => {
  const React = require('react'); const { Pressable, Text } = require('react-native');
  return { AppButton: ({ children, onPress, disabled }: any) => <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress}><Text>{children}</Text></Pressable> };
});
const question: QuizQuestion = { id: 'item:1', type: 'multiple-choice', prompt: 'Escolha a relação correta', options: [{ label: 'A' }, { label: 'B' }], correctAnswerIndex: 0, explanation: 'Explicação somente depois da confirmação' };

describe('ReviewCard — resposta antes do gabarito', () => {
  it('não revela gabarito antes de selecionar, confirmar e receber confirmação persistida', () => {
    const onAnswer = jest.fn(); const props = { question, onAnswer, onContinue: jest.fn(), feedback: null, saving: false };
    const view = render(<ReviewCard {...props} />);
    expect(screen.queryByText('Resposta correta')).toBeNull();
    expect(screen.queryByText(question.explanation)).toBeNull();
    fireEvent.press(screen.getByText('Confirmar resposta'));
    expect(onAnswer).not.toHaveBeenCalled();
    fireEvent.press(screen.getByTestId('review-option-1'));
    fireEvent.press(screen.getByText('Confirmar resposta'));
    expect(onAnswer).toHaveBeenCalledWith(1);
    expect(screen.queryByText(question.explanation)).toBeNull();
    view.rerender(<ReviewCard {...props} feedback={{ correct: false, assisted: false }} />);
    expect(screen.getByText('Vamos revisar este ponto')).toBeTruthy();
    expect(screen.getByText(question.explanation)).toBeTruthy();
  });
  it('pedir gabarito envia ajuda, sem autodeclarar acerto', () => {
    const onAnswer = jest.fn();
    renderWithProviders(<ReviewCard question={question} onAnswer={onAnswer} onContinue={jest.fn()} feedback={null} saving={false} />);
    fireEvent.press(screen.getByText('Ver resposta com ajuda'));
    expect(onAnswer).toHaveBeenCalledWith(null);
    expect(screen.queryByText('Acertei')).toBeNull();
    expect(screen.queryByText(question.explanation)).toBeNull();
  });
  it('dois toques imediatos enviam uma única resposta e a seleção confirmada fica bloqueada', async () => {
    let finish!: () => void;
    const onAnswer = jest.fn(() => new Promise<void>(resolve => { finish = resolve; }));
    renderWithProviders(<ReviewCard question={question} onAnswer={onAnswer} onContinue={jest.fn()} feedback={null} saving={false} />);
    fireEvent.press(screen.getByLabelText('A'));
    fireEvent.press(screen.getByText('Confirmar resposta'));
    fireEvent.press(screen.getByText('Confirmar resposta'));
    expect(onAnswer).toHaveBeenCalledTimes(1);
    fireEvent.press(screen.getByLabelText('B'));
    expect(screen.getByLabelText('A').props.accessibilityState.selected).toBe(true);
    await act(async () => finish());
  });
});
