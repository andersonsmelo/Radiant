import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { galaxyColors } from '../../../ui/theme';
import { StreakWeek } from './StreakWeek';
const Native = require('react-native');
const today = new Date(2026, 9, 29, 12);
function show(lastActiveDate: string | null = null, streakDays: number | null = 1, date = today) {
  return render(<StreakWeek lastActiveDate={lastActiveDate} streakDays={streakDays} today={date} />);
}

it.each([1, 9, 99])('contador%s sem data mostra o número com a chama e não fabrica dia na sequência', count => {
  show(null, count);
  expect(screen.getByText(String(count))).toBeTruthy();
  expect(screen.getByLabelText(`Contador de sequência: ${count}`)).toBeTruthy();
  expect(screen.getByTestId('streak-flame', { includeHiddenElements: true })).toBeTruthy();
  expect(screen.queryAllByLabelText(/na sequência|estudou/u)).toHaveLength(0);
  expect(screen.getAllByLabelText(/, sem registro$/u)).toHaveLength(3);
  expect(screen.getAllByLabelText(/, ainda não chegou$/u)).toHaveLength(3);
  expect(screen.getByLabelText('Quinta, hoje, ainda sem estudo')).toBeTruthy();
  expect(screen.queryByText(/dias seguidos|meia-noite|faltou/iu)).toBeNull();
});
it('dia sem registro é um ponto discreto, sem círculo nem aro, e não há "?" nem parágrafos de explicação', () => {
  show(null, 3);
  expect(screen.queryByText('?')).toBeNull();
  expect(screen.queryByText(/Sem registro disponível|A semana mostra|Cada uma cobre|Você ganha uma/u)).toBeNull();
  const dots = screen.getAllByTestId('week-unknown-dot');
  expect(dots).toHaveLength(3);
  const style = StyleSheet.flatten(dots[0].props.style);
  expect(style.borderWidth ?? 0).toBe(0);
  expect(style.width).toBeLessThan(12);
  expect(style.backgroundColor).toBe(galaxyColors.textTertiary);
});
it('sequência viva até ontem preenche os dias dela e deixa hoje por fazer, sem dizer "estudou"', () => {
  show('2026-10-28', 2);
  expect(screen.getAllByLabelText(/na sequência/u)).toHaveLength(2);
  expect(screen.getByLabelText('Quarta, na sequência')).toBeTruthy();
  expect(screen.getByLabelText('Terça, na sequência')).toBeTruthy();
  expect(screen.getByLabelText('Segunda, sem registro')).toBeTruthy();
  expect(screen.getByLabelText('Quinta, hoje, ainda sem estudo')).toBeTruthy();
  expect(screen.queryAllByLabelText(/estudou/u)).toHaveLength(0);
});
it('hoje na sequência é anunciado como hoje e leva o aro', () => {
  show('2026-10-29', 1);
  expect(screen.getByLabelText('Quinta, hoje, na sequência')).toBeTruthy();
  const ring = screen.getByTestId('week-today-ring');
  expect(StyleSheet.flatten(ring.props.style).borderWidth).toBeGreaterThan(0);
});
it.each([1, 2, 3, 7, 30])('os dias na sequência nunca passam do número mostrado (%s)', count => {
  show('2026-10-29', count);
  expect(screen.queryAllByLabelText(/na sequência/u).length).toBeLessThanOrEqual(count);
  expect(screen.queryAllByLabelText(/na sequência/u).length).toBe(Math.min(count, 4));
});
it.each(['2026-10-30', '2026-10-25', '2026-02-30', '2026-13-01', '2026-10-28T12:00:00Z', 'bad', '2026-1-28'])('data%s não comprova dia desta semana', date => {
  show(date, 5);
  expect(screen.queryAllByLabelText(/na sequência/u)).toHaveLength(0);
});
it('valida dia impossível que cairia nesta semana se o Date o normalizasse', () => {
  show('2026-02-30', 5, new Date(2026, 2, 2, 12));
  expect(screen.queryAllByLabelText(/na sequência/u)).toHaveLength(0);
});
it('segunda e domingo locais continuam na semana mesmo na virada de ano', () => {
  show('2025-12-29', 8, new Date(2026, 0, 4, 0, 5));
  expect(screen.getByLabelText('Segunda, na sequência')).toBeTruthy();
  expect(screen.getByLabelText('Domingo, hoje, ainda sem estudo')).toBeTruthy();
  expect(screen.getAllByLabelText(/, sem registro$/u)).toHaveLength(5);
  expect(screen.queryAllByLabelText(/ainda não chegou/u)).toHaveLength(0);
});
it.each([null, NaN, Infinity, -1])('contador inválido%s fica indisponível, não zero', count => {
  show(null, count);
  expect(screen.getByText('Sequência indisponível')).toBeTruthy();
  expect(screen.queryByText('0')).toBeNull();
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

it('as proteções aparecem numa linha curta, e só quando foram lidas', () => {
  const today = new Date(2026, 10, 6, 12);
  const view = render(<StreakWeek lastActiveDate="2026-11-06" streakDays={8} today={today} freezes={{ stored: 1, max: 2, everyDays: 7 }} />);
  expect(screen.getByText('1 proteção guardada')).toBeTruthy();
  view.rerender(<StreakWeek lastActiveDate="2026-11-06" streakDays={8} today={today} freezes={{ stored: 2, max: 2, everyDays: 7 }} />);
  expect(screen.getByText('2 proteções guardadas')).toBeTruthy();
  view.rerender(<StreakWeek lastActiveDate="2026-11-06" streakDays={8} today={today} freezes={{ stored: 0, max: 2, everyDays: 7 }} />);
  expect(screen.getByText('Nenhuma proteção guardada')).toBeTruthy();
  view.rerender(<StreakWeek lastActiveDate="2026-11-06" streakDays={8} today={today} freezes={null} />);
  expect(screen.queryByText(/proteç/)).toBeNull();
  view.rerender(<StreakWeek lastActiveDate="2026-11-06" streakDays={8} today={today} loading freezes={{ stored: 1, max: 2, everyDays: 7 }} />);
  expect(screen.queryByText(/proteç/)).toBeNull();
});
// Tarefa 11: divergência documentada, não conserto. Com a sequência parada (último
// estudo na terça, hoje é quinta), a semana marca só o último dia de estudo, mas o
// número grande ao lado da chama continua mostrando a contagem guardada. Mudar o
// número é regra de produto e está fora deste escopo.
it('contagem 5 com a sequência parada mostra 5 dias e um dia marcado', () => {
  show('2026-10-27', 5);
  expect(screen.getByText('5')).toBeTruthy();
  expect(screen.getByLabelText('Contador de sequência: 5')).toBeTruthy();
  expect(screen.getAllByLabelText(/na sequência/u)).toHaveLength(1);
  expect(screen.getByLabelText('Terça, na sequência')).toBeTruthy();
});
