import React from 'react';
import { Modal, ScrollView, StyleSheet, Text } from 'react-native';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requireOptionalNativeModule } from 'expo-modules-core';
import SettingsScreen from './SettingsScreen';
import ProfileScreen from '../../profile/screens/ProfileScreen';
import { AppConfig } from '../../../config';
import { DailyGoalService } from '../../daily-goal/services/DailyGoalService';
import type { DailyGoalSnapshot } from '../../../types/dailyGoal';
import { DAILY_GOAL_STORAGE_KEY } from '../../../constants/dailyGoal';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import { LEGAL_LINKS } from '../../../config/legal';

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');
jest.mock('expo-modules-core', () => ({ ...jest.requireActual('expo-modules-core'), requireOptionalNativeModule: jest.fn() }));
jest.mock('expo-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
  router: { push: jest.fn(), back: jest.fn() },
  __entries: new Set(),
  __blur: () => { for (const entry of jest.requireMock('expo-router').__entries) entry.cleanup?.(); },
  __focus: () => { for (const entry of jest.requireMock('expo-router').__entries) entry.cleanup = entry.callback(); },
  useFocusEffect: (callback: () => void | (() => void)) => {
    const React = require('react');
    React.useEffect(() => {
      const entries = jest.requireMock('expo-router').__entries;
      const entry = { callback, cleanup: callback() };
      entries.add(entry);
      return () => { entry.cleanup?.(); entries.delete(entry); };
    }, [callback]);
  },
}));
jest.mock('../../../config', () => ({ AppConfig: { SHOW_DEV_TOOLS: false, ENABLE_REMOTE_SYNC: false } }));
jest.mock('../../subscription/SubscriptionService', () => ({ subscriptionService: { getStatus: jest.fn() } }));
jest.mock('../../progress-sync/ProgressSyncService', () => ({ progressSyncService: { getState: jest.fn(), setEnabled: jest.fn() } }));
jest.mock('../../push/services/PushService', () => ({ PushService: {
  getOptIn: jest.fn().mockResolvedValue(null), changeReminderPreference: jest.fn().mockResolvedValue(true), setOptIn: jest.fn().mockResolvedValue(undefined),
  requestPermissionIfNeeded: jest.fn().mockResolvedValue('granted'), scheduleDailyIfEligible: jest.fn().mockResolvedValue(undefined),
} }));
jest.mock('../../telemetry/TelemetryService', () => ({ TelemetryService: { track: jest.fn() } }));
jest.mock('../../gamification/services/GamificationService', () => ({ GamificationService: { getSnapshot: jest.fn().mockResolvedValue({ totalXp: 0, streakDays: 1, lastActiveDate: null }) } }));
jest.mock('../../journey/services/JourneyCurriculumService', () => ({ JourneyCurriculumService: { getCurriculumTrail: jest.fn().mockResolvedValue({ segments: [], recommendedNodeId: null }) } }));
jest.mock('../../journey/services/JourneyStarsService', () => ({ JourneyStarsService: { getRecordStarsByLessonId: jest.fn().mockResolvedValue({}) } }));
jest.mock('../../spaced-repetition/services/SpacedRepetitionService', () => ({ SpacedRepetitionService: { getDueCount: jest.fn().mockResolvedValue(0) } }));
jest.mock('../../first-run/screens/WelcomeFlowScreen', () => {
  const { Pressable, Text } = require('react-native');
  return { __esModule: true, default: ({ onFinish }: { onFinish: () => void }) => <Pressable onPress={onFinish}><Text>Fechar replay pelo filho</Text></Pressable> };
});
jest.mock('../../../ui/components/StarfieldBackground', () => ({ StarfieldBackground: () => null }));
jest.mock('../../../../components/external-link', () => { const React = require('react'); return {
  ExternalLink: ({ children, href }: { children: React.ReactElement<{ href?: string }>; href: string }) => React.cloneElement(children, { href }),
}; });
const routes = jest.requireMock('expo-router');
const sub = jest.requireMock('../../subscription/SubscriptionService').subscriptionService;
const backup = jest.requireMock('../../progress-sync/ProgressSyncService').progressSyncService;
const push = jest.requireMock('../../push/services/PushService').PushService;
const nativeModule = jest.mocked(requireOptionalNativeModule);
const storageRead = jest.mocked(AsyncStorage.getItem).getMockImplementation()!;
const storageWrite = jest.mocked(AsyncStorage.setItem).getMockImplementation()!;
const initial: DailyGoalSnapshot = { goalXp: 10, earnedXpToday: 0, tierId: 'start', completedToday: 0, goalPerDay: 10, isCompleted: false, dateKey: '2026-10-29' };
function deferred<T>() { let resolve!: (value: T) => void; let reject!: (cause: Error) => void; const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; }
async function ready() { const view = render(<SettingsScreen />); await screen.findByRole('button', { name: 'Meta diária: Começar' }); return view; }
beforeEach(async () => {
  jest.restoreAllMocks(); jest.clearAllMocks(); jest.useFakeTimers({ now: new Date(2026, 9, 29, 12) });
  jest.mocked(AsyncStorage.getItem).mockImplementation(storageRead);
  jest.mocked(AsyncStorage.setItem).mockImplementation(storageWrite);
  await AsyncStorage.clear();
  await AsyncStorage.setItem(DAILY_GOAL_STORAGE_KEY, JSON.stringify({ dateKey: '2026-10-29', completedToday: 0, goalPerDay: 10, tierId: 'start' }));
  AppConfig.SHOW_DEV_TOOLS = false; AppConfig.ENABLE_REMOTE_SYNC = false;
  sub.getStatus.mockResolvedValue({ kind: 'none' });
  backup.getState.mockResolvedValue({ enabled: false, decided: false, lastBackupAt: null, lastError: null });
  backup.setEnabled.mockResolvedValue({ enabled: true, decided: true, lastBackupAt: null, lastError: 'cloud-unavailable' });
  nativeModule.mockReturnValue(null);
  push.getOptIn.mockResolvedValue(null);
});
afterEach(() => { jest.useRealTimers(); });

it('abre Ajustes em grupos, com uma rolagem e retorno real ao Perfil', async () => {
  const view = await ready();
  expect(screen.getByRole('header', { name: 'Ajustes' })).toBeTruthy();
  for (const name of ['Durante a aula', 'Lembrete', 'Meta diária', 'Progresso']) expect(screen.getByRole('header', { name })).toBeTruthy();
  expect(view.UNSAFE_getAllByType(ScrollView)).toHaveLength(1);
  fireEvent.press(screen.getByRole('button', { name: 'Voltar ao Perfil' }));
  expect(routes.router.back).toHaveBeenCalledTimes(1);
  for (const text of view.UNSAFE_getAllByType(Text)) {
    expect(StyleSheet.flatten(text.props.style)?.textTransform).not.toBe('uppercase');
    expect(text.props.numberOfLines).toBeUndefined(); expect(text.props.maxFontSizeMultiplier).toBeUndefined();
  }
});
it.each([['Começar, 10 XP', 'start', 10], ['Ritmo, 20 XP', 'rhythm', 20], ['Foco, 35 XP', 'focus', 35], ['Desafio, 50 XP', 'challenge', 50]] as const)('editor grava %s pelo serviço real e relê o valor persistido', async (label, tierId, xp) => {
  await ready(); fireEvent.press(screen.getByRole('button', { name: 'Meta diária: Começar' }));
  expect(screen.getAllByRole('radio')).toHaveLength(4);
  fireEvent.press(screen.getByRole('radio', { name: label }));
  await waitFor(() => expect(screen.getByRole('radio', { name: label }).props.accessibilityState.checked).toBe(true));
  expect(JSON.parse((await AsyncStorage.getItem(DAILY_GOAL_STORAGE_KEY))!)).toMatchObject({ tierId, goalPerDay: xp });
});
it('falha ao salvar mantém valor anterior e permite nova tentativa, sem atualização otimista', async () => {
  jest.spyOn(DailyGoalService, 'setTier').mockRejectedValueOnce(new Error('write failed'));
  await ready(); fireEvent.press(screen.getByRole('button', { name: 'Meta diária: Começar' }));
  fireEvent.press(screen.getByRole('radio', { name: 'Foco, 35 XP' }));
  await screen.findByText('Não foi possível salvar a meta. Tente novamente.');
  expect(screen.getByRole('radio', { name: 'Começar, 10 XP' }).props.accessibilityState.checked).toBe(true);
  fireEvent.press(screen.getByRole('radio', { name: 'Foco, 35 XP' }));
  await waitFor(() => expect(screen.getByRole('radio', { name: 'Foco, 35 XP' }).props.accessibilityState.checked).toBe(true));
});
it('bloqueia duas seleções no mesmo lote e usa o snapshot devolvido, sem derivar o resultado', async () => {
  const saved = deferred<DailyGoalSnapshot>(); const write = jest.spyOn(DailyGoalService, 'setTier').mockReturnValueOnce(saved.promise);
  await ready(); fireEvent.press(screen.getByRole('button', { name: 'Meta diária: Começar' }));
  const focus = screen.getByRole('radio', { name: 'Foco, 35 XP' }); const rhythm = screen.getByRole('radio', { name: 'Ritmo, 20 XP' });
  act(() => { fireEvent.press(focus); fireEvent.press(rhythm); });
  expect(write).toHaveBeenCalledTimes(1); expect(write).toHaveBeenCalledWith('focus');
  expect(screen.getByRole('radio', { name: 'Começar, 10 XP' }).props.accessibilityState.checked).toBe(true);
  expect(screen.getByText('Salvando meta…')).toBeTruthy();
  await act(async () => saved.resolve({ ...initial, tierId: 'challenge', goalXp: 50, goalPerDay: 50 }));
  expect(screen.getByRole('radio', { name: 'Desafio, 50 XP' }).props.accessibilityState.checked).toBe(true);
});
it('blur invalida publicação do save; refoco relê a fonte e leitura antiga não sobrescreve', async () => {
  const saved = deferred<DailyGoalSnapshot>(); jest.spyOn(DailyGoalService, 'setTier').mockReturnValueOnce(saved.promise);
  await ready(); fireEvent.press(screen.getByRole('button', { name: 'Meta diária: Começar' }));
  fireEvent.press(screen.getByRole('radio', { name: 'Foco, 35 XP' }));
  await act(async () => routes.__blur());
  await act(async () => saved.resolve({ ...initial, tierId: 'focus', goalXp: 35 }));
  expect(screen.getByRole('button', { name: 'Meta diária: Começar' })).toBeTruthy();
  const stale = deferred<DailyGoalSnapshot>(); jest.spyOn(DailyGoalService, 'getSnapshot').mockReturnValueOnce(stale.promise);
  await act(async () => routes.__focus()); await act(async () => routes.__blur());
  await AsyncStorage.setItem(DAILY_GOAL_STORAGE_KEY, JSON.stringify({ dateKey: '2026-10-29', completedToday: 4, goalPerDay: 20, tierId: 'rhythm' }));
  await act(async () => routes.__focus());
  expect(screen.getByRole('button', { name: 'Meta diária: Ritmo' })).toBeTruthy();
  await act(async () => stale.resolve({ ...initial, tierId: 'focus', goalXp: 35 }));
  expect(screen.getByRole('button', { name: 'Meta diária: Ritmo' })).toBeTruthy();
});
it('refocar durante save aguarda I/O existente, relê fonte persistida e libera editor', async () => {
  const gate = deferred<void>();
  const realWrite = DailyGoalService.setTier.bind(DailyGoalService);
  const write = jest.spyOn(DailyGoalService, 'setTier').mockImplementation(async tier => { await gate.promise; return realWrite(tier); });
  await ready(); fireEvent.press(screen.getByRole('button', { name: 'Meta diária: Começar' }));
  fireEvent.press(screen.getByRole('radio', { name: 'Foco, 35 XP' }));
  await act(async () => { routes.__blur(); routes.__focus(); });
  expect(screen.getByText('Carregando meta…')).toBeTruthy();
  await act(async () => gate.resolve());
  expect(screen.getByRole('button', { name: 'Meta diária: Foco' }).props.accessibilityState.disabled).toBe(false);
  expect(write).toHaveBeenCalledTimes(1);
});
it('carregamento e rejeição da meta não fabricam nível nem controles prontos', async () => {
  const read = deferred<DailyGoalSnapshot>(); jest.spyOn(DailyGoalService, 'getSnapshot').mockReturnValueOnce(read.promise);
  render(<SettingsScreen />);
  expect(screen.getByText('Carregando meta…')).toBeTruthy(); expect(screen.queryByRole('radio')).toBeNull();
  await act(async () => read.reject(new Error('read')));
  expect(screen.getByText('Meta diária indisponível')).toBeTruthy(); expect(screen.queryByRole('button', { name: /Meta diária:/u })).toBeNull();
});
it('sons e vibração persistem independentemente, incluindo dois callbacks no mesmo lote', async () => {
  await ready();
  const sounds = screen.getByRole('switch', { name: 'Sons' }); const haptics = screen.getByRole('switch', { name: 'Vibração' });
  act(() => { fireEvent(sounds, 'valueChange', false); fireEvent(haptics, 'valueChange', false); });
  await waitFor(async () => expect(JSON.parse((await AsyncStorage.getItem(STORAGE_KEYS.FEEDBACK_PREFERENCES))!)).toEqual({ sounds: false, haptics: false }));
});
it('falha de escrita de preferências informa erro e refoco recupera o dado persistido', async () => {
  await ready(); const set = jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('disk'));
  fireEvent(screen.getByRole('switch', { name: 'Sons' }), 'valueChange', false);
  await screen.findByText('Não foi possível salvar sons e vibração. Tente novamente.');
  set.mockRestore(); await act(async () => { routes.__blur(); routes.__focus(); });
  expect(screen.getByRole('switch', { name: 'Sons' }).props.value).toBe(true);
});
it.each(['absent', 'throw'] as const)('backup %s pelo resolver real fica Em breve sem chamada de gravação', async capability => {
  const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  if (capability === 'throw') nativeModule.mockImplementation(() => { throw new Error('resolver'); });
  await ready(); expect(screen.getByText('Em breve')).toBeTruthy(); expect(screen.queryByRole('switch', { name: 'Backup no iCloud' })).toBeNull();
  expect(backup.setEnabled).not.toHaveBeenCalled(); expect(nativeModule).toHaveBeenCalledWith('RadiantCloudKit');
  if (capability === 'throw') expect(error).toHaveBeenCalledWith('[CloudKitPrivateAdapter] Falha ao resolver o módulo nativo:', expect.any(Error));
  error.mockRestore();
});
it('módulo CloudKit presente mantém backup funcional mesmo em indisponibilidade transitória', async () => {
  const native = { accountStatus: jest.fn(), fetchBackup: jest.fn(), saveBackup: jest.fn() }; nativeModule.mockReturnValue(native);
  await ready(); expect(screen.queryByText('Em breve')).toBeNull(); expect(native.accountStatus).not.toHaveBeenCalled();
  fireEvent(screen.getByRole('switch', { name: 'Backup no iCloud' }), 'valueChange', true);
  await waitFor(() => expect(backup.setEnabled).toHaveBeenCalledWith(true, expect.any(Number)));
  expect(screen.getByRole('switch', { name: 'Backup no iCloud' }).props.value).toBe(true);
});
it('montar/refocar não pede permissão, decide opt-in nem agenda lembrete', async () => {
  await ready(); await act(async () => { routes.__blur(); routes.__focus(); });
  expect(screen.getByRole('switch', { name: 'Lembrete diário' })).toBeTruthy();
  expect(push.setOptIn).not.toHaveBeenCalled(); expect(push.requestPermissionIfNeeded).not.toHaveBeenCalled(); expect(push.scheduleDailyIfEligible).not.toHaveBeenCalled();
});
it('preserva portas da assinatura, privacidade, termos e suporte e fecha replay/Back sem substituir onFinish', async () => {
  const view = await ready(); fireEvent.press(screen.getByRole('button', { name: 'Conhecer' })); expect(routes.router.push).toHaveBeenCalledWith('/subscription');
  for (const [name, href] of [['Privacidade', LEGAL_LINKS.privacy.href], ['Termos de uso', LEGAL_LINKS.terms.href], ['Central de Suporte', LEGAL_LINKS.support.href]]) expect(screen.getByRole('link', { name })).toHaveProp('href', href);
  fireEvent.press(screen.getByRole('button', { name: 'Rever a apresentação' }));
  expect(view.UNSAFE_getByType(Modal).props.visible).toBe(true);
  fireEvent.press(screen.getByText('Fechar replay pelo filho')); expect(view.UNSAFE_getByType(Modal).props.visible).toBe(false);
  fireEvent.press(screen.getByRole('button', { name: 'Rever a apresentação' }));
  act(() => view.UNSAFE_getByType(Modal).props.onRequestClose()); expect(view.UNSAFE_getByType(Modal).props.visible).toBe(false);
});
it('mantém console só na flag real e conta/sync ausente no aluno', async () => {
  const view = await ready(); expect(screen.queryByText('Console de desenvolvimento')).toBeNull(); expect(screen.queryByPlaceholderText(/email/iu)).toBeNull();
  view.unmount(); AppConfig.SHOW_DEV_TOOLS = true; await ready(); fireEvent.press(screen.getByRole('button', { name: 'Abrir o console de desenvolvimento' })); expect(routes.router.push).toHaveBeenCalledWith('/dev-console');
});
it('leitura atrasada de preferências não apaga um toque feito antes de terminar', async () => {
  const stale = deferred<string | null>();
  await ready();
  jest.spyOn(AsyncStorage, 'getItem').mockImplementation(key => key === STORAGE_KEYS.FEEDBACK_PREFERENCES ? stale.promise : storageRead(key));
  await act(async () => { routes.__blur(); routes.__focus(); });
  fireEvent(screen.getByRole('switch', { name: 'Sons' }), 'valueChange', false);
  await act(async () => stale.resolve(JSON.stringify({ sounds: true, haptics: true })));
  expect(screen.getByRole('switch', { name: 'Sons' }).props.value).toBe(false);
});
it('rejeição do save depois do blur não publica erro no foco seguinte', async () => {
  const stale = deferred<DailyGoalSnapshot>(); jest.spyOn(DailyGoalService, 'setTier').mockReturnValueOnce(stale.promise);
  await ready(); fireEvent.press(screen.getByRole('button', { name: 'Meta diária: Começar' }));
  fireEvent.press(screen.getByRole('radio', { name: 'Foco, 35 XP' }));
  await act(async () => { routes.__blur(); routes.__focus(); });
  await act(async () => stale.reject(new Error('save')));
  expect(screen.queryByText('Não foi possível salvar a meta. Tente novamente.')).toBeNull();
  expect(screen.getByRole('button', { name: 'Meta diária: Começar' }).props.accessibilityState.disabled).toBe(false);
});
it('backup bloqueia duplo callback e refoco aguarda a gravação antes da releitura', async () => {
  nativeModule.mockReturnValue({ accountStatus: jest.fn(), fetchBackup: jest.fn(), saveBackup: jest.fn() });
  const done = deferred<void>();
  backup.setEnabled.mockImplementationOnce(async () => {
    await done.promise;
    const state = { enabled: true, decided: true, lastBackupAt: '2026-10-29T12:00:00.000Z', lastError: null };
    backup.getState.mockResolvedValue(state); return state;
  });
  await ready(); const toggle = screen.getByRole('switch', { name: 'Backup no iCloud' });
  act(() => { fireEvent(toggle, 'valueChange', true); fireEvent(toggle, 'valueChange', false); });
  expect(backup.setEnabled).toHaveBeenCalledTimes(1);
  await act(async () => { routes.__blur(); routes.__focus(); });
  await act(async () => done.resolve());
  expect(screen.getByRole('switch', { name: 'Backup no iCloud' }).props.value).toBe(true);
  expect(screen.getByRole('switch', { name: 'Backup no iCloud' }).props.disabled).toBe(false);
  expect(screen.getByText(/Último backup em 29\/10\/2026/u)).toBeTruthy();
});

it.each(['profile', 'settings'] as const)('POP real da montagem A: %s novo espera I/O da meta e recebe persistido sem refoco extra', async destination => {
  const gate = deferred<void>(); const entered = deferred<void>();
  const a = await ready();
  jest.mocked(AsyncStorage.setItem).mockImplementationOnce(async (key, value) => { entered.resolve(); await gate.promise; return storageWrite(key, value); });
  fireEvent.press(screen.getByRole('button', { name: 'Meta diária: Começar' }));
  fireEvent.press(screen.getByRole('radio', { name: 'Foco, 35 XP' }));
  await act(async () => entered.promise);
  fireEvent.press(screen.getByRole('button', { name: 'Voltar ao Perfil' }));
  expect(routes.router.back).toHaveBeenCalledTimes(1);
  a.unmount();
  const b = render(destination === 'profile' ? <ProfileScreen /> : <SettingsScreen />);
  try {
    await act(async () => undefined);
    expect(b.getByText('Carregando meta…')).toBeTruthy();
    expect(b.queryByText('Ganhe 10 XP')).toBeNull();
    expect(b.queryByRole('button', { name: 'Meta diária: Começar' })).toBeNull();
    await act(async () => gate.resolve());
    if (destination === 'profile') expect(b.getByText('Ganhe 35 XP')).toBeTruthy();
    else expect(b.getByRole('button', { name: 'Meta diária: Foco' }).props.accessibilityState.disabled).toBe(false);
  } finally { await act(async () => gate.resolve()); b.unmount(); await DailyGoalService.getSnapshot(); }
});
it('POP com falha real de storage libera nova montagem e nova escolha, sem sucesso ou erro tardio da A', async () => {
  const gate = deferred<void>(); const entered = deferred<void>(); const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  const a = await ready();
  jest.mocked(AsyncStorage.setItem).mockImplementationOnce(async () => { entered.resolve(); await gate.promise; throw new Error('disk'); });
  fireEvent.press(screen.getByRole('button', { name: 'Meta diária: Começar' })); fireEvent.press(screen.getByRole('radio', { name: 'Foco, 35 XP' }));
  await act(async () => entered.promise); a.unmount();
  const b = render(<SettingsScreen />);
  try {
    await act(async () => undefined);
    expect(b.getByText('Carregando meta…')).toBeTruthy();
    await act(async () => gate.resolve());
    expect(b.getByRole('button', { name: 'Meta diária: Começar' })).toBeTruthy();
    expect(b.queryByText('Não foi possível salvar a meta. Tente novamente.')).toBeNull();
    fireEvent.press(b.getByRole('button', { name: 'Meta diária: Começar' })); fireEvent.press(b.getByRole('radio', { name: 'Desafio, 50 XP' }));
    await waitFor(() => expect(b.getByRole('radio', { name: 'Desafio, 50 XP' }).props.accessibilityState.checked).toBe(true));
  } finally { await act(async () => gate.resolve()); b.unmount(); await DailyGoalService.getSnapshot(); error.mockRestore(); }
});
