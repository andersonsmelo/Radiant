import React from 'react';
import { AccessibilityInfo } from 'react-native';
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
  // FILA 54: `accessibilityLiveRegion` só existe no Android, então o VoiceOver
  // não ouvia o resultado da revisão. A lição anuncia o dela desde 2026-09-28.
  it('anuncia ao leitor de tela o resultado, a resposta certa e a explicação, uma vez por item', () => {
    // O setup do React Native já entrega `announceForAccessibility` como
    // `jest.fn`, e o espião herda as chamadas dos testes anteriores.
    const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => {});
    announce.mockClear();
    const props = { question, onAnswer: jest.fn(), onContinue: jest.fn(), saving: false };
    const view = render(<ReviewCard {...props} feedback={null} />);
    expect(announce.mock.calls).toEqual([]);
    view.rerender(<ReviewCard {...props} feedback={{ correct: false, assisted: false }} />);
    expect(announce).toHaveBeenCalledTimes(1);
    expect(announce).toHaveBeenLastCalledWith('Vamos revisar este ponto. Resposta certa: A. Explicação somente depois da confirmação');
    view.rerender(<ReviewCard {...props} feedback={{ correct: false, assisted: false }} />);
    expect(announce).toHaveBeenCalledTimes(1);
    view.rerender(<ReviewCard {...props} question={{ ...question, id: 'item:2' }} feedback={null} />);
    view.rerender(<ReviewCard {...props} question={{ ...question, id: 'item:2' }} feedback={{ correct: false, assisted: true }} />);
    expect(announce).toHaveBeenCalledTimes(2);
    expect(announce).toHaveBeenLastCalledWith('Resposta consultada. Resposta certa: A. Explicação somente depois da confirmação');
    announce.mockRestore();
  });
});
