import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { GamificationService } from '../../gamification/services/GamificationService';
import { DailyGoalService } from '../../daily-goal/services/DailyGoalService';
import { JourneyCurriculumService } from '../../journey/services/JourneyCurriculumService';
import { JourneyStarsService } from '../../journey/services/JourneyStarsService';
import { SpacedRepetitionService } from '../../spaced-repetition/services/SpacedRepetitionService';
import type { CurriculumTrail } from '../../journey/services/JourneyCurriculumService';
import type { DailyGoalSnapshot } from '../../../types/dailyGoal';
import ProfileScreen from './ProfileScreen';


jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));
jest.mock('../../../ui/accessibility/useReducedMotionPreference', () => ({
  useReducedMotionPreference: () => true,
  useReducedMotionPreferenceState: () => ({ reducedMotionEnabled: true, resolved: true }),
}));
jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
  useFocusEffect: (callback: () => void | (() => void)) => {
    const React = require('react');
    const state = jest.requireMock('expo-router');
    React.useEffect(() => {
      state.__focus = () => { state.__cleanup = callback(); };
      state.__focus();
      return () => { state.__cleanup?.(); };
    }, [callback, state]);
  },
  __blur: () => { const state = jest.requireMock('expo-router'); state.__cleanup?.(); },
}));
jest.mock('../../gamification/services/GamificationService', () => ({ GamificationService: { getSnapshot: jest.fn() } }));
jest.mock('../../daily-goal/services/DailyGoalService', () => ({ DailyGoalService: { getSnapshot: jest.fn(), setTier: jest.fn() } }));
jest.mock('../../journey/services/JourneyCurriculumService', () => ({ JourneyCurriculumService: { getCurriculumTrail: jest.fn() } }));
jest.mock('../../journey/services/JourneyStarsService', () => ({ JourneyStarsService: { getRecordStarsByLessonId: jest.fn() } }));
jest.mock('../../spaced-repetition/services/SpacedRepetitionService', () => ({ SpacedRepetitionService: { getDueCount: jest.fn() } }));


const gami = jest.mocked(GamificationService.getSnapshot);
const goalRead = jest.mocked(DailyGoalService.getSnapshot);
const goalWrite = jest.mocked(DailyGoalService.setTier);
const curriculum = jest.mocked(JourneyCurriculumService.getCurriculumTrail);
const stars = jest.mocked(JourneyStarsService.getRecordStarsByLessonId);
const due = jest.mocked(SpacedRepetitionService.getDueCount);
const goal: DailyGoalSnapshot = { goalXp: 10, earnedXpToday: 0, tierId: 'start', completedToday: 0, goalPerDay: 10, isCompleted: false, dateKey: '2026-10-29' };
const trail: CurriculumTrail = { recommendedNodeId: 'l2', segments: [{ trackId: 't', trackTitle: 'Fundamentos', order: 1, unlocked: true, completed: false, units: [
  { id: 'old', title: 'Anterior', theme: 'radiacao', nodes: [{ id: 'old-a', unitId: 'old', type: 'lesson', title: 'Aula anterior', lessonId: 'old-a', status: 'completed' }] },
  { id: 'current', title: 'Tubo', theme: 'tubo', nodes: [
    { id: 'l1', unitId: 'current', type: 'lesson', title: 'Aula concluída', lessonId: 'a', status: 'completed' },
    { id: 'l2', unitId: 'current', type: 'lesson', title: 'Próxima aula', lessonId: 'b', status: 'available' },
    { id: 'review', unitId: 'current', type: 'review', title: 'Revisão interna', status: 'locked' },
  ] },
] }] };
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers({ now: new Date(2026, 9, 29, 12) });
  gami.mockResolvedValue({ totalXp: 72, streakDays: 9, lastActiveDate: null });
  goalRead.mockResolvedValue(goal);
  goalWrite.mockResolvedValue({ ...goal, goalXp: 35, goalPerDay: 35, tierId: 'focus' });
  curriculum.mockResolvedValue(trail);
  stars.mockResolvedValue({ a: 3, b: 1 });
  due.mockResolvedValue(0);
});
afterEach(() => jest.useRealTimers());

it('troca missões/métricas por conquistas da unidade atual, contador independente, metas reais e XP uma vez', async () => {
  render(<ProfileScreen />);
  await screen.findByText('72 XP no total');
  expect(screen.getByRole('header', { name: 'Medalhas' })).toBeTruthy();
  expect(screen.getByLabelText('Aula concluída. Concluída. 3 estrelas.')).toBeTruthy();
  expect(screen.getByLabelText('Próxima aula. Ainda não conquistada.')).toBeTruthy();
  expect(screen.queryByText('Aula anterior')).toBeNull();
  expect(screen.queryByText('Revisão interna')).toBeNull();
  expect(screen.getByText('Sequência registrada: 9')).toBeTruthy();
  expect(screen.queryAllByLabelText(/atividade registrada/u)).toHaveLength(0);
  expect(screen.getByText('0 de 10')).toBeTruthy();
  expect(screen.getByText('Revisões pendentes: 0')).toBeTruthy();
  expect(screen.getAllByText(/XP no total/u)).toHaveLength(1);
  for (const old of [/Desafios de hoje/u, /^SEQUÊNCIA$/u, /^XP TOTAL$/u, /Começar · 10 XP/u, /meia-noite/u, /dias seguidos/u]) expect(screen.queryByText(old)).toBeNull();
});

it('não apresenta zero durante leitura e libera cada seção sem esperar pela outra', async () => {
  const pending = deferred<Awaited<ReturnType<typeof GamificationService.getSnapshot>>>();
  gami.mockReturnValue(pending.promise);
  render(<ProfileScreen />);
  expect(screen.queryByText(/XP no total/u)).toBeNull();
  await screen.findByText('0 de 10');
  expect(screen.queryByText('Sequência registrada: 0')).toBeNull();
  await act(async () => pending.resolve({ totalXp: 8, streakDays: 1, lastActiveDate: null }));
  expect(screen.getByText('8 XP no total')).toBeTruthy();
});

it.each(['gamification', 'goal', 'curriculum', 'stars', 'due'] as const)('rejeição real de %s não derruba fatos de outra seção nem inventa zero', async (source) => {
  const failures = { gamification: gami, goal: goalRead, curriculum, stars, due };
  failures[source].mockRejectedValueOnce(new Error('read failed'));
  render(<ProfileScreen />);
  await screen.findAllByText(/indisponíve[il]/u);
  if (source === 'gamification') {
    expect(screen.queryByText(/XP no total/u)).toBeNull();
    expect(screen.getByText('0 de 10')).toBeTruthy();
  } else expect(await screen.findByText('72 XP no total')).toBeTruthy();
  if (source === 'goal') expect(screen.queryByText('0 de 10')).toBeNull();
  if (source === 'curriculum') expect(screen.queryByLabelText(/Ainda não conquistada/u)).toBeNull();
  if (source === 'stars') expect(screen.getByLabelText('Aula concluída. Concluída.')).toBeTruthy();
  if (source === 'due') expect(screen.queryByText('Revisões pendentes: 0')).toBeNull();
});

it('aluno novo tem silhuetas reais e meta zero, mas default1 não marca hoje', async () => {
  gami.mockResolvedValue({ totalXp: 0, streakDays: 1, lastActiveDate: null });
  curriculum.mockResolvedValue({ ...trail, segments: trail.segments.map(segment => ({ ...segment, units: segment.units.map(unit => ({ ...unit, nodes: unit.nodes.map(node => ({ ...node, status: 'available' as const })) })) })) });
  stars.mockResolvedValue({});
  render(<ProfileScreen />);
  await screen.findByText('0 XP no total');
  expect(screen.getByText('Sequência registrada: 1')).toBeTruthy();
  expect(screen.queryAllByLabelText(/atividade registrada/u)).toHaveLength(0);
  expect(screen.getAllByLabelText(/Ainda não conquistada/u)).toHaveLength(2);
  expect(screen.getByText('0 de 10')).toBeTruthy();
  expect(screen.queryByText(/nenhuma medalha|comece para|sem atividade/iu)).toBeNull();
});

it('marca apenas a última data do serviço e não transforma contador alto em calendário', async () => {
  gami.mockResolvedValue({ totalXp: 10, streakDays: 99, lastActiveDate: '2026-10-28' });
  render(<ProfileScreen />);
  await screen.findByText('10 XP no total');
  expect(screen.getAllByLabelText(/atividade registrada/u)).toHaveLength(1);
  expect(screen.getByLabelText('Quarta-feira, 2026-10-28: atividade registrada')).toBeTruthy();
  expect(screen.getByLabelText('Quinta-feira, 2026-10-29, hoje: sem registro disponível')).toBeTruthy();
});

it('deixa edição em Ajustes e preserva Hoje, XP e leitura de meta no Perfil', async () => {
  render(<ProfileScreen />);
  await screen.findByText('0 de 10');
  expect(screen.getByRole('header', { name: 'Hoje' })).toBeTruthy();
  expect(screen.queryByRole('button', { name: /Meta diária:/u })).toBeNull();
  expect(screen.queryByRole('radio')).toBeNull();
  expect(goalWrite).not.toHaveBeenCalled();
});
it('refoco após ajuste usa snapshot real devolvido pela fonte, sem guardar tier antigo', async () => {
  render(<ProfileScreen />); await screen.findByText('0 de 10');
  await act(async () => jest.requireMock('expo-router').__blur());
  goalRead.mockResolvedValue({ ...goal, tierId: 'focus', goalXp: 35, earnedXpToday: 7, completedToday: 7, goalPerDay: 35 });
  await act(async () => jest.requireMock('expo-router').__focus());
  expect(screen.getByText('7 de 35')).toBeTruthy();
  expect(goalWrite).not.toHaveBeenCalled();
});

it('reabre os serviços no novo foco e mantém configurações e rolagem única com folga', async () => {
  const first = render(<ProfileScreen />);
  await screen.findByText('72 XP no total');
  fireEvent.press(screen.getByRole('button', { name: 'Ajustes' }));
  expect(jest.requireMock('expo-router').router.push).toHaveBeenCalledWith('/settings');
  const scroll = first.UNSAFE_getAllByType(ScrollView);
  expect(scroll).toHaveLength(1);
  expect(StyleSheet.flatten(scroll[0].props.contentContainerStyle).paddingBottom).toBeGreaterThan(0);
  first.unmount();
  gami.mockResolvedValue({ totalXp: 80, streakDays: 2, lastActiveDate: '2026-10-29' });
  render(<ProfileScreen />);
  await screen.findByText('80 XP no total');
  expect(screen.getByLabelText('Quinta-feira, 2026-10-29, hoje: atividade registrada')).toBeTruthy();
  expect(screen.queryByText(/assinatura|backup|sons e vibração|console de desenvolvimento/iu)).toBeNull();
});

it.each([NaN, Infinity, -2])('XP total inválido%s não vira número publicado', async value => {
  gami.mockResolvedValue({ totalXp: value, streakDays: value, lastActiveDate: null });
  render(<ProfileScreen />);
  await screen.findByText('XP total indisponível');
  expect(screen.getByText('Sequência indisponível')).toBeTruthy();
  expect(screen.queryByText(/XP no total/u)).toBeNull();
});
it('leitura velha não substitui o snapshot do novo foco', async () => {
  const oldRead = deferred<Awaited<ReturnType<typeof GamificationService.getSnapshot>>>();
  gami.mockReturnValueOnce(oldRead.promise);
  render(<ProfileScreen />);
  await screen.findByText('0 de 10');
  await act(async () => jest.requireMock('expo-router').__blur());
  gami.mockResolvedValue({ totalXp: 100, streakDays: 2, lastActiveDate: '2026-10-29' });
  await act(async () => jest.requireMock('expo-router').__focus());
  await screen.findByText('100 XP no total');
  await act(async () => oldRead.resolve({ totalXp: 1, streakDays: 1, lastActiveDate: null }));
  expect(screen.getByText('100 XP no total')).toBeTruthy();
});
it('currículo todo concluído mostra última unidade, sem voltar à primeira', async () => {
  curriculum.mockResolvedValue({ segments: trail.segments.map(segment => ({ ...segment, completed: true, units: segment.units.map(unit => ({ ...unit, nodes: unit.nodes.map(node => ({ ...node, status: 'completed' as const })) })) })) });
  render(<ProfileScreen />);
  await screen.findByLabelText('Próxima aula. Concluída. 1 estrela.');
  expect(screen.queryByLabelText(/Aula anterior/u)).toBeNull();
});

it('estrelas ainda carregando não são anunciadas como falha nem como zero', async () => {
  const recordRead = deferred<Record<string, 0 | 1 | 2 | 3>>();
  stars.mockReturnValue(recordRead.promise);
  render(<ProfileScreen />);
  await screen.findByText('72 XP no total');
  expect(screen.getByText('Carregando estrelas…')).toBeTruthy();
  expect(screen.queryByText('Estrelas indisponíveis')).toBeNull();
  expect(screen.getByLabelText('Aula concluída. Concluída.')).toBeTruthy();
  await act(async () => recordRead.resolve({ a: 3 }));
  expect(screen.getByLabelText('Aula concluída. Concluída. 3 estrelas.')).toBeTruthy();
});
