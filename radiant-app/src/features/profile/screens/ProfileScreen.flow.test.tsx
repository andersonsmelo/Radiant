import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { GamificationService } from '../../gamification/services/GamificationService';
import { JourneyCurriculumService } from '../../journey/services/JourneyCurriculumService';
import { JourneyStarsService } from '../../journey/services/JourneyStarsService';
import type { CurriculumTrail } from '../../journey/services/JourneyCurriculumService';
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
  // Todos os focos da tela, não só o último: com dois `useFocusEffect` (o do Perfil e o das
  // decorações, F6), guardar um só fazia o refoco chamar o efeito errado.
  __entries: new Set(),
  useFocusEffect: (callback: () => void | (() => void)) => {
    const React = require('react');
    const state = jest.requireMock('expo-router');
    React.useEffect(() => {
      const entry: { callback: typeof callback; cleanup?: void | (() => void) } = { callback, cleanup: callback() };
      state.__entries.add(entry);
      return () => { entry.cleanup?.(); state.__entries.delete(entry); };
    }, [callback, state]);
  },
  __focus: () => { for (const entry of jest.requireMock('expo-router').__entries) entry.cleanup = entry.callback(); },
  __blur: () => { for (const entry of jest.requireMock('expo-router').__entries) entry.cleanup?.(); },
}));
jest.mock('../../gamification/services/GamificationService', () => ({ GamificationService: { getSnapshot: jest.fn() } }));
jest.mock('../../journey/services/JourneyCurriculumService', () => ({ JourneyCurriculumService: { getCurriculumTrail: jest.fn() } }));
jest.mock('../../journey/services/JourneyStarsService', () => ({ JourneyStarsService: { getRecordStarsByLessonId: jest.fn() } }));
let mockMissions: { id: string; done: boolean }[] | Error = [];
let mockFreezes = 0;
let mockSynced = false;
jest.mock('../../missions/services/DailyMissionsService', () => ({ DailyMissionsService: {
  sync: () => (mockMissions instanceof Error ? Promise.reject(mockMissions) : Promise.resolve({ bonusXp: 0, missions: mockMissions }).then(result => { mockSynced = true; return result; })),
} }));
jest.mock('../../gamification/services/StreakFreezeService', () => ({ MAX_STREAK_FREEZES: 2, STREAK_DAYS_PER_FREEZE: 7,
  StreakFreezeService: { getFreezes: () => Promise.resolve(mockFreezes) } }));


const gami = jest.mocked(GamificationService.getSnapshot);
const curriculum = jest.mocked(JourneyCurriculumService.getCurriculumTrail);
const stars = jest.mocked(JourneyStarsService.getRecordStarsByLessonId);
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
  curriculum.mockResolvedValue(trail);
  stars.mockResolvedValue({ a: 3, b: 1 });
});
afterEach(() => jest.useRealTimers());

it('mostra conquistas da unidade atual, contador independente e XP uma vez', async () => {
  render(<ProfileScreen />);
  await screen.findByText('72 XP no total');
  expect(screen.getByRole('header', { name: 'Medalhas' })).toBeTruthy();
  expect(screen.getByLabelText('Aula concluída. Concluída. 3 estrelas.')).toBeTruthy();
  expect(screen.getByLabelText('Próxima aula. Ainda não conquistada.')).toBeTruthy();
  expect(screen.queryByText('Aula anterior')).toBeNull();
  expect(screen.queryByText('Revisão interna')).toBeNull();
  expect(screen.getByLabelText('Contador de sequência: 9')).toBeTruthy();
  expect(screen.queryAllByLabelText(/estudou/u)).toHaveLength(0);
  expect(screen.getByText('1 de 2')).toBeTruthy();
  expect(screen.getAllByText(/XP no total/u)).toHaveLength(1);
  for (const old of [/Desafios de hoje/u, /^SEQUÊNCIA$/u, /^XP TOTAL$/u, /Começar · 10 XP/u, /meia-noite/u, /dias seguidos/u]) expect(screen.queryByText(old)).toBeNull();
});

it('não apresenta zero durante leitura e libera cada seção sem esperar pela outra', async () => {
  const pending = deferred<Awaited<ReturnType<typeof GamificationService.getSnapshot>>>();
  gami.mockReturnValue(pending.promise);
  render(<ProfileScreen />);
  expect(screen.queryByText(/XP no total/u)).toBeNull();
  await screen.findByText('1 de 2');
  expect(screen.queryByLabelText('Contador de sequência: 0')).toBeNull();
  await act(async () => pending.resolve({ totalXp: 8, streakDays: 1, lastActiveDate: null }));
  expect(screen.getByText('8 XP no total')).toBeTruthy();
});

it.each(['gamification', 'curriculum', 'stars'] as const)('rejeição real de %s não derruba fatos de outra seção nem inventa zero', async (source) => {
  const failures = { gamification: gami, curriculum, stars };
  failures[source].mockRejectedValueOnce(new Error('read failed'));
  render(<ProfileScreen />);
  await screen.findAllByText(/indisponíve[il]/u);
  if (source === 'gamification') {
    expect(screen.queryByText(/XP no total/u)).toBeNull();
    expect(screen.getByText('1 de 2')).toBeTruthy();
  } else expect(await screen.findByText('72 XP no total')).toBeTruthy();
  if (source === 'curriculum') expect(screen.queryByLabelText(/Ainda não conquistada/u)).toBeNull();
  if (source === 'stars') expect(screen.getByLabelText('Aula concluída. Concluída.')).toBeTruthy();
});

it('aluno novo tem silhuetas reais, mas default1 não marca hoje', async () => {
  gami.mockResolvedValue({ totalXp: 0, streakDays: 1, lastActiveDate: null });
  curriculum.mockResolvedValue({ ...trail, segments: trail.segments.map(segment => ({ ...segment, units: segment.units.map(unit => ({ ...unit, nodes: unit.nodes.map(node => ({ ...node, status: 'available' as const })) })) })) });
  stars.mockResolvedValue({});
  render(<ProfileScreen />);
  await screen.findByText('0 XP no total');
  expect(screen.getByLabelText('Contador de sequência: 1')).toBeTruthy();
  expect(screen.queryAllByLabelText(/estudou/u)).toHaveLength(0);
  expect(screen.getAllByLabelText(/Ainda não conquistada/u)).toHaveLength(2);
  expect(screen.getByText('0 de 2')).toBeTruthy();
  expect(screen.queryByText(/nenhuma medalha|comece para|sem atividade/iu)).toBeNull();
});

it('sequência viva marca só os dias da semana que a contagem sustenta, sem passar de onde ela começa', async () => {
  gami.mockResolvedValue({ totalXp: 10, streakDays: 99, lastActiveDate: '2026-10-28' });
  render(<ProfileScreen />);
  await screen.findByText('10 XP no total');
  expect(screen.getAllByLabelText(/na sequência/u)).toHaveLength(3);
  expect(screen.getByLabelText('Quarta, na sequência')).toBeTruthy();
  expect(screen.getByLabelText('Quinta, hoje, ainda sem estudo')).toBeTruthy();
});

// Liga semanal (ADR 2026-11-13): a entrada fica no Perfil, como as missões, e
// só existe com a chave ligada.
it('com a liga ligada, o Perfil tem a entrada da liga, que leva a /league', async () => {
  const { router } = jest.requireMock('expo-router');
  const { AppConfig } = jest.requireActual('../../../config');
  const chave = jest.replaceProperty(AppConfig, 'ENABLE_LEAGUE', true);
  try {
    render(<ProfileScreen />);
    fireEvent.press(await screen.findByRole('button', { name: 'Liga da semana. Ver sua posição.' }));
    expect(router.push).toHaveBeenCalledWith('/league');
  } finally {
    chave.restore();
  }
});

it('com a liga desligada (padrão), o Perfil não tem a entrada da liga', async () => {
  render(<ProfileScreen />);
  await screen.findByText('72 XP no total');
  expect(screen.queryByTestId('league-profile-row')).toBeNull();
});

it('não mostra a linha de missões, o bloco "Hoje" nem "Revisões pendentes"', async () => {
  mockMissions = [{ id: 'aula-1', done: true }, { id: 'seguidas-5', done: false }, { id: 'meta', done: false }];
  render(<ProfileScreen />);
  await screen.findByText('72 XP no total');
  expect(screen.queryByLabelText(/Missões de hoje/u)).toBeNull();
  expect(screen.queryByRole('header', { name: 'Hoje' })).toBeNull();
  expect(screen.queryByText(/Revisões pendentes|Meta diária|Ganhe \d+ XP/u)).toBeNull();
  expect(screen.queryByRole('radio')).toBeNull();
  mockMissions = [];
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
  expect(screen.getByLabelText('Quinta, hoje, na sequência')).toBeTruthy();
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
  await screen.findByText('1 de 2');
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

it('mostra o nível que sai do XP e as proteções numa linha curta ao lado da sequência', async () => {
  mockFreezes = 1;
  render(<ProfileScreen />);
  // 72 XP: nível 3 começa em 60 e custa 60.
  expect(await screen.findByLabelText('Nível 3, Olhar atento. 12 de 60 XP para o próximo nível.')).toBeTruthy();
  expect(await screen.findByText('1 proteção guardada')).toBeTruthy();
  mockFreezes = 0;
});

it('liga e decorações são linhas com o valor à direita, e o total de XP aparece uma vez', async () => {
  const { AppConfig } = jest.requireActual('../../../config');
  const liga = jest.replaceProperty(AppConfig, 'ENABLE_LEAGUE', true);
  const deco = jest.replaceProperty(AppConfig, 'ENABLE_DECORATIONS', true);
  try {
    render(<ProfileScreen />);
    await screen.findByText('72 XP no total');
    expect(screen.getByText('Ver posição', { includeHiddenElements: true })).toBeTruthy();
    expect(await screen.findByText('5 de 11', { includeHiddenElements: true })).toBeTruthy();
    expect(screen.getAllByText(/XP no total/u)).toHaveLength(1);
  } finally { liga.restore(); deco.restore(); await jest.requireMock('@react-native-async-storage/async-storage').clear(); }
});

it('o XP é lido depois de as missões pagarem o bônus, para o total já incluí-lo', async () => {
  mockSynced = false;
  let syncedAtRead: boolean | null = null;
  gami.mockImplementation(async () => { syncedAtRead = mockSynced; return { totalXp: 77, streakDays: 1, lastActiveDate: null }; });
  render(<ProfileScreen />);
  expect(await screen.findByText('77 XP no total')).toBeTruthy();
  expect(syncedAtRead).toBe(true);
});

it('missões que não leem não escondem o XP nem o nível', async () => {
  mockMissions = new Error('missions-unavailable');
  render(<ProfileScreen />);
  expect(await screen.findByText('72 XP no total')).toBeTruthy();
  expect(screen.getByText('Nível 3')).toBeTruthy();
  mockMissions = [];
});

// F6 da 1.6 (ADR 2026-11-15): decorações atrás de ENABLE_DECORATIONS, desligada por padrão.
describe('decorações no Perfil', () => {
  const { AppConfig } = require('../../../config') as typeof import('../../../config');
  const { DecorationsService } = require('../../decorations/DecorationsService') as typeof import('../../decorations/DecorationsService');
  const AsyncStorage = require('@react-native-async-storage/async-storage');
  const original = AppConfig.ENABLE_DECORATIONS;
  afterEach(async () => { AppConfig.ENABLE_DECORATIONS = original; jest.restoreAllMocks(); await AsyncStorage.clear(); });

  it('desligada (padrão): nem lê nem grava decoração, e o Perfil não mostra a entrada', async () => {
    expect(original).toBe(false);
    const sync = jest.spyOn(DecorationsService, 'sync');
    render(<ProfileScreen />);
    await screen.findByText('72 XP no total');
    expect(sync).not.toHaveBeenCalled();
    expect(screen.queryByText('Decorações')).toBeNull();
    expect(await AsyncStorage.getItem('@radiant:decorations_v1')).toBeNull();
  });

  it('ligada: ganhos em silêncio pelo estado real, selo equipado ao lado do nome e entrada para a tela', async () => {
    AppConfig.ENABLE_DECORATIONS = true;
    await AsyncStorage.setItem('@radiant:decorations_v1', JSON.stringify({ schemaVersion: 1, unlocked: ['selo-faisca'], equipped: { selo: 'selo-faisca' } }));
    render(<ProfileScreen />);
    expect(await screen.findByLabelText('Selo Faísca')).toBeTruthy();
    // 2 aulas, 1 unidade inteira, sequência 9 e 72 XP (nível 3): Aurora, Órbita, Faísca, Escudo e Noite clara.
    const row = await screen.findByRole('button', { name: 'Decorações. 5 de 11 disponíveis.' });
    fireEvent.press(row);
    expect(jest.requireMock('expo-router').router.push).toHaveBeenCalledWith('/decoracoes');
  });
});
