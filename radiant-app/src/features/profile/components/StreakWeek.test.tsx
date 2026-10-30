import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { StreakWeek } from './StreakWeek';
const Native = require('react-native');
const today = new Date(2026, 9, 29, 12);
function show(lastActiveDate: string | null = null, streakDays: number | null = 1, date = today) {
  return render(<StreakWeek lastActiveDate={lastActiveDate} streakDays={streakDays} today={date} />);
}

it.each([1, 9, 99])('contador%s sem data não fabrica atividade nem falta', count => {
  show(null, count);
  expect(screen.getByText(`Sequência registrada: ${count}`)).toBeTruthy();
  expect(screen.getByLabelText(`Contador de sequência: ${count}`)).toBeTruthy();
  expect(screen.queryAllByLabelText(/atividade registrada/u)).toHaveLength(0);
  expect(screen.getAllByLabelText(/sem registro disponível/u)).toHaveLength(4);
  expect(screen.getAllByLabelText(/dia futuro/u)).toHaveLength(3);
  expect(screen.getByLabelText('Quinta-feira, 2026-10-29, hoje: sem registro disponível')).toBeTruthy();
  expect(screen.getByText(/Sem registro disponível não significa/u)).toBeTruthy();
  expect(screen.queryByText(/dias seguidos|meia-noite|faltou/iu)).toBeNull();
});
it('última data válida marca um único dia, sem retropreencher pelo contador', () => {
  show('2026-10-28', 9);
  expect(screen.getAllByLabelText(/atividade registrada/u)).toHaveLength(1);
  expect(screen.getByLabelText('Quarta-feira, 2026-10-28: atividade registrada')).toBeTruthy();
});
it('hoje com anel só marca atividade quando lastActiveDate também é hoje', () => {
  show('2026-10-29', 1);
  expect(screen.getByLabelText('Quinta-feira, 2026-10-29, hoje: atividade registrada')).toBeTruthy();
  const ring = screen.getByTestId('week-today-ring');
  expect(StyleSheet.flatten(ring.props.style).borderWidth).toBeGreaterThan(0);
});
it.each(['2026-10-30', '2026-10-25', '2026-02-30', '2026-13-01', '2026-10-28T12:00:00Z', 'bad', '2026-1-28'])('data%s não comprova dia desta semana', date => {
  show(date, 5);
  expect(screen.queryAllByLabelText(/atividade registrada/u)).toHaveLength(0);
});
it('valida dia impossível que cairia nesta semana se o Date o normalizasse', () => {
  show('2026-02-30', 5, new Date(2026, 2, 2, 12));
  expect(screen.queryAllByLabelText(/atividade registrada/u)).toHaveLength(0);
});
it('segunda e domingo locais continuam na semana mesmo na virada de ano', () => {
  show('2025-12-29', 8, new Date(2026, 0, 4, 0, 5));
  expect(screen.getByLabelText('Segunda-feira, 2025-12-29: atividade registrada')).toBeTruthy();
  expect(screen.getByLabelText('Domingo, 2026-01-04, hoje: sem registro disponível')).toBeTruthy();
  expect(screen.queryAllByLabelText(/dia futuro/u)).toHaveLength(0);
});
it.each([null, NaN, Infinity, -1])('contador inválido%s fica indisponível, não zero', count => {
  show(null, count);
  expect(screen.getByText('Sequência indisponível')).toBeTruthy();
  expect(screen.queryByText('Sequência registrada: 0')).toBeNull();
});
it('carga não publica contador nem dia positivo antes da leitura', () => {
  render(<StreakWeek lastActiveDate={null} streakDays={null} today={today} loading />);
  expect(screen.getByText('Carregando sequência…')).toBeTruthy();
  expect(screen.queryByLabelText(/Contador de sequência/u)).toBeNull();
});
it('escala máxima troca sete colunas por duas linhas inteiras e renova texto ao vivo', () => {
  const dimensions = jest.spyOn(Native, 'useWindowDimensions');
  dimensions.mockReturnValue({ width: 320, height: 800, scale: 2, fontScale: 1 });
  const result = show();
  expect(screen.getAllByTestId(/^week-row-\d$/u)).toHaveLength(1);
  dimensions.mockReturnValue({ width: 320, height: 800, scale: 2, fontScale: 3.1 });
  result.rerender(<StreakWeek lastActiveDate={null} streakDays={1} today={today} />);
  const rows = screen.getAllByTestId(/^week-row-\d$/u);
  expect(rows).toHaveLength(2);
  expect(rows.map(row => row.findAllByType(View).filter((child: { props: { accessible?: boolean } }) => child.props.accessible === true).length)).toEqual([4, 3]);
  for (const label of result.UNSAFE_getAllByType(Text)) {
    expect(label.props.numberOfLines).toBeUndefined();
    expect(label.props.maxFontSizeMultiplier).toBeUndefined();
    expect(label.props.allowFontScaling).not.toBe(false);
    expect(StyleSheet.flatten(label.props.style).height).toBeUndefined();
  }
  dimensions.mockRestore();
});
