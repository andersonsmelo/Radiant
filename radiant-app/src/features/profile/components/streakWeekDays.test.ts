import { streakWeekDays } from './streakWeekDays';

// Semana de segunda 2026-10-26 a domingo 2026-11-01.
const weekDays = ['2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29', '2026-10-30', '2026-10-31', '2026-11-01'];
const run = (todayKey: string, lastActiveDate: string | null, streak: number) => streakWeekDays({ weekDays, todayKey, lastActiveDate, streak });

it('sequência de 3 terminando hoje: três dias na sequência, hoje entre eles', () => {
  expect(run('2026-10-29', '2026-10-29', 3)).toEqual(['unknown', 'inStreak', 'inStreak', 'inStreak', 'future', 'future', 'future']);
});
it('sequência de 2 terminando ontem: ontem e anteontem na sequência, hoje ainda por fazer', () => {
  expect(run('2026-10-29', '2026-10-28', 2)).toEqual(['unknown', 'inStreak', 'inStreak', 'today', 'future', 'future', 'future']);
});
it('sequência de 10 que começa antes da semana: tudo até a última data é da sequência', () => {
  const states = run('2026-10-29', '2026-10-29', 10);
  expect(states).toEqual(['inStreak', 'inStreak', 'inStreak', 'inStreak', 'future', 'future', 'future']);
  expect(states).toHaveLength(7);
});
it('última data há quatro dias, sequência parada (vale 0): só aquele dia', () => {
  expect(run('2026-10-31', '2026-10-27', 0)).toEqual(['unknown', 'inStreak', 'unknown', 'unknown', 'unknown', 'today', 'future']);
});
it('sem última data não há dia na sequência, e a validade fica: passado unknown, hoje today, depois future', () => {
  const states = run('2026-10-29', null, 4);
  expect(states.filter(s => s === 'inStreak')).toHaveLength(0);
  expect(states).toEqual(['unknown', 'unknown', 'unknown', 'today', 'future', 'future', 'future']);
});
it('sequência 0 com a última data de hoje: sequência não viva, só o dia da última data', () => {
  expect(run('2026-10-29', '2026-10-29', 0)).toEqual(['unknown', 'unknown', 'unknown', 'inStreak', 'future', 'future', 'future']);
});
it('última data no futuro não marca nada', () => {
  expect(run('2026-10-29', '2026-10-31', 3).filter(s => s === 'inStreak')).toHaveLength(0);
});
it('virada de mês: sequência de 3 terminando em 01/11 cobre três dias', () => {
  expect(run('2026-11-01', '2026-11-01', 3)).toEqual(['unknown', 'unknown', 'unknown', 'unknown', 'inStreak', 'inStreak', 'inStreak']);
});
it('dia perdido coberto por proteção: a sequência que ainda vale marca os dias dela até a última data', () => {
  expect(run('2026-10-30', '2026-10-28', 3)).toEqual(['inStreak', 'inStreak', 'inStreak', 'unknown', 'today', 'future', 'future']);
});
