import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import type { DailyGoalSnapshot } from '../../../types/dailyGoal';
import { TodayGoals } from './TodayGoals';
const goal: DailyGoalSnapshot = { goalXp: 35, earnedXpToday: 0, tierId: 'focus', completedToday: 7, goalPerDay: 10, isCompleted: false, dateKey: '2026-10-29' };
it('preserva zero do alias XP e não usa contador legado quando o alias está presente', () => {
  render(<TodayGoals goal={goal} dueCount={5} onSelectTier={jest.fn()} />);
  expect(screen.getByText('Ganhe 35 XP')).toBeTruthy();
  expect(screen.getByText('0 de 35')).toBeTruthy();
  expect(screen.getByRole('progressbar', { name: 'Meta de XP' }).props.accessibilityValue).toEqual({ min: 0, max: 35, now: 0 });
  expect(StyleSheet.flatten(screen.getByTestId('daily-xp-track').props.style).height).toBe(6);
  expect(screen.getAllByRole('progressbar')).toHaveLength(1);
  expect(screen.getByText('Revisões pendentes: 5')).toBeTruthy();
  expect(screen.queryByText(/5 de 5|Revise 5|concluíd/iu)).toBeNull();
});
it('fallback legado conserva XP real e progresso visual não ultrapassa 100%', () => {
  render(<TodayGoals goal={{ ...goal, goalXp: undefined, earnedXpToday: undefined, completedToday: 12, goalPerDay: 10 }} dueCount={0} onSelectTier={jest.fn()} />);
  expect(screen.getByText('12 de 10')).toBeTruthy();
  expect(StyleSheet.flatten(screen.getByTestId('daily-xp-fill').props.style).width).toBe('100%');
  expect(screen.getByText('Revisões pendentes: 0')).toBeTruthy();
});
it.each([{ goalXp: 0 }, { goalXp: -1 }, { goalXp: NaN }, { goalXp: Infinity }, { earnedXpToday: -1 }, { earnedXpToday: NaN }, { earnedXpToday: Infinity }])('snapshot inválido%s não inventa meta/barra', invalid => {
  render(<TodayGoals goal={{ ...goal, ...invalid }} dueCount={null} onSelectTier={jest.fn()} />);
  expect(screen.getByText('Meta diária indisponível')).toBeTruthy();
  expect(screen.queryByRole('progressbar')).toBeNull();
  expect(screen.getByText('Revisões indisponíveis')).toBeTruthy();
});
it('linha expansível mantém as quatro escolhas reais sem chips nem botão inerte', () => {
  const select = jest.fn();
  render(<TodayGoals goal={goal} dueCount={0} onSelectTier={select} />);
  expect(screen.queryByRole('radio')).toBeNull();
  fireEvent.press(screen.getByRole('button', { name: 'Meta diária: Foco' }));
  expect(screen.getAllByRole('radio')).toHaveLength(4);
  expect(screen.getByRole('radio', { name: 'Foco, 35 XP' }).props.accessibilityState.checked).toBe(true);
  for (const [label, tier] of [['Começar, 10 XP', 'start'], ['Ritmo, 20 XP', 'rhythm'], ['Foco, 35 XP', 'focus'], ['Desafio, 50 XP', 'challenge']]) {
    fireEvent.press(screen.getByRole('radio', { name: label }));
    expect(select).toHaveBeenLastCalledWith(tier);
  }
});
it('leitura pendente e rejeitada não mostram 0/0 ou pendências zero', () => {
  const result = render(<TodayGoals goal={null} dueCount={null} goalLoading dueLoading onSelectTier={jest.fn()} />);
  expect(screen.getByText('Carregando meta…')).toBeTruthy();
  expect(screen.getByText('Carregando revisões…')).toBeTruthy();
  expect(screen.queryByRole('progressbar')).toBeNull();
  result.rerender(<TodayGoals goal={null} dueCount={null} onSelectTier={jest.fn()} />);
  expect(screen.getByText('Meta diária indisponível')).toBeTruthy();
  expect(screen.getByText('Revisões indisponíveis')).toBeTruthy();
});
it('texto e erro de gravação crescem sem truncar ou limitar escala', () => {
  const result = render(<TodayGoals goal={goal} dueCount={12} onSelectTier={jest.fn()} saveError saving />);
  expect(screen.getByText('Não foi possível salvar a meta. Tente novamente.')).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Meta diária: Foco' }).props.accessibilityState.disabled).toBe(true);
  for (const text of result.UNSAFE_getAllByType(Text)) {
    expect(text.props.numberOfLines).toBeUndefined();
    expect(text.props.maxFontSizeMultiplier).toBeUndefined();
    expect(text.props.allowFontScaling).not.toBe(false);
  }
});
