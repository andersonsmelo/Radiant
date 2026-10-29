import React from 'react';
import { Text } from 'react-native';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { ReminderRow } from './ReminderRow';
import { PushService } from '../services/PushService';

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('expo-router', () => ({
  __entries: new Set(),
  __blur: () => { for (const entry of jest.requireMock('expo-router').__entries) entry.cleanup?.(); },
  __focus: () => { for (const entry of jest.requireMock('expo-router').__entries) entry.cleanup = entry.callback(); },
  useFocusEffect: (callback: () => void | (() => void)) => {
    const React = require('react');
    React.useEffect(() => {
      const entries = jest.requireMock('expo-router').__entries; const entry = { callback, cleanup: callback() }; entries.add(entry);
      return () => { entry.cleanup?.(); entries.delete(entry); };
    }, [callback]);
  },
}));
jest.mock('expo-notifications', () => ({
  SchedulableTriggerInputTypes: { DATE: 'date' }, setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn(), requestPermissionsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(), cancelAllScheduledNotificationsAsync: jest.fn(),
}));
jest.mock('../../telemetry/TelemetryService', () => ({ TelemetryService: { track: jest.fn().mockResolvedValue(undefined) } }));
jest.mock('../../spaced-repetition/services/SpacedRepetitionService', () => ({ SpacedRepetitionService: { getDueLessons: jest.fn().mockResolvedValue([]) } }));
const notifications = jest.mocked(Notifications);
const storage = jest.mocked(AsyncStorage);
const realRead = storage.getItem.getMockImplementation()!;
const realWrite = storage.setItem.getMockImplementation()!;
function deferred<T>() { let resolve!: (value: T) => void; let reject!: (cause: Error) => void; const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; }
const OPT_IN = 'push.optin.v1';
async function row() { const view = render(<ReminderRow visible />); await screen.findByRole('switch', { name: 'Lembrete diário' }); return view; }
beforeEach(async () => {
  jest.restoreAllMocks(); jest.clearAllMocks();
  storage.getItem.mockImplementation(realRead); storage.setItem.mockImplementation(realWrite);
  await AsyncStorage.clear();
  jest.useFakeTimers({ now: new Date(2026, 9, 29, 10), doNotFake: ['setImmediate', 'nextTick', 'queueMicrotask'] });
  notifications.getPermissionsAsync.mockReset().mockResolvedValue({ status: 'granted' } as never);
  notifications.requestPermissionsAsync.mockReset().mockResolvedValue({ status: 'granted' } as never);
  notifications.scheduleNotificationAsync.mockReset().mockResolvedValue('test-id');
  notifications.cancelAllScheduledNotificationsAsync.mockReset().mockResolvedValue(undefined);
});
afterEach(() => jest.useRealTimers());

it('montar/refocar só lê, sem consentimento/permissão/agendamento; invisível não mostra controle', async () => {
  const hidden = render(<ReminderRow visible={false} />); expect(hidden.toJSON()).toBeNull(); hidden.unmount();
  await row(); await act(async () => { jest.requireMock('expo-router').__blur(); jest.requireMock('expo-router').__focus(); });
  expect(screen.getByRole('switch').props.value).toBe(false);
  expect(notifications.getPermissionsAsync).not.toHaveBeenCalled(); expect(notifications.requestPermissionsAsync).not.toHaveBeenCalled(); expect(notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  expect(storage.setItem.mock.calls.filter(([key]) => key === OPT_IN)).toHaveLength(0);
});
it.each([true, false])('preferência persistida %s é lida pelo serviço real', async value => {
  await AsyncStorage.setItem(OPT_IN, String(value)); await row(); expect(screen.getByRole('switch').props.value).toBe(value);
});
it('leitura pendente não inventa switch desligado; falha permite retry sem gravar', async () => {
  const gate = deferred<string | null>(); storage.getItem.mockImplementationOnce(() => gate.promise);
  const a = render(<ReminderRow visible />);
  try {
    expect(screen.queryByRole('switch')).toBeNull(); await act(async () => gate.reject(new Error('read')));
    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível consultar o lembrete.');
    await AsyncStorage.setItem(OPT_IN, 'true'); fireEvent.press(screen.getByRole('button', { name: 'Tentar novamente' }));
    await waitFor(() => expect(screen.getByRole('switch').props.value).toBe(true));
    expect(notifications.requestPermissionsAsync).not.toHaveBeenCalled();
  } finally { await act(async () => gate.resolve(null)); a.unmount(); await PushService.getOptIn(); }
});
it('ligar preserva as duas consultas legadas e agenda; desligar cancela', async () => {
  await row(); fireEvent(screen.getByRole('switch'), 'valueChange', true);
  await waitFor(() => expect(notifications.scheduleNotificationAsync).toHaveBeenCalledTimes(1));
  expect(notifications.getPermissionsAsync).toHaveBeenCalledTimes(3); // duas consultas do opt-in + verificação do scheduler
  expect(await AsyncStorage.getItem(OPT_IN)).toBe('true');
  await waitFor(() => expect(screen.getByRole('switch').props.disabled).toBe(false));
  fireEvent(screen.getByRole('switch'), 'valueChange', false);
  await waitFor(() => expect(screen.getByRole('switch').props.disabled).toBe(false));
  expect(await AsyncStorage.getItem(OPT_IN)).toBe('false'); expect(notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalledTimes(2);
});
it('negação retorna desligado sem agendar, usando rollback real', async () => {
  notifications.getPermissionsAsync.mockResolvedValue({ status: 'denied' } as never); notifications.requestPermissionsAsync.mockResolvedValue({ status: 'denied' } as never);
  await row(); fireEvent(screen.getByRole('switch'), 'valueChange', true);
  await waitFor(() => expect(screen.getByRole('switch').props.disabled).toBe(false));
  expect(screen.getByRole('switch').props.value).toBe(false); expect(await AsyncStorage.getItem(OPT_IN)).toBe('false');
  expect(notifications.requestPermissionsAsync).toHaveBeenCalledTimes(2); expect(notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
});
it('falha de persistência reconcilia a escolha anterior e mantém retry possível', async () => {
  const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  try { await row(); storage.setItem.mockRejectedValueOnce(new Error('disk'));
    fireEvent(screen.getByRole('switch'), 'valueChange', true);
    await screen.findByRole('alert'); expect(screen.getByRole('switch').props.value).toBe(false);
    fireEvent(screen.getByRole('switch'), 'valueChange', true);
    await waitFor(() => expect(screen.getByRole('switch').props.disabled).toBe(false));
    expect(await AsyncStorage.getItem(OPT_IN)).toBe('true');
  } finally { error.mockRestore(); }
});
it('falha de agendamento informa erro e reentrada lê o true efetivamente persistido', async () => {
  const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  try { const a = await row(); notifications.scheduleNotificationAsync.mockRejectedValueOnce(new Error('schedule'));
    fireEvent(screen.getByRole('switch'), 'valueChange', true); await screen.findByRole('alert');
    expect(screen.getByRole('switch').props.value).toBe(true); a.unmount(); await row();
    expect(screen.getByRole('switch').props.value).toBe(true);
  } finally { error.mockRestore(); }
});
it('reconciliação também falha sem inventar valor; retry consulta a fonte', async () => {
  const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  try { await row(); storage.setItem.mockRejectedValueOnce(new Error('write')); storage.getItem.mockRejectedValueOnce(new Error('read'));
    fireEvent(screen.getByRole('switch'), 'valueChange', true); await screen.findByRole('alert');
    await waitFor(() => expect(screen.queryByRole('switch')).toBeNull());
    fireEvent.press(screen.getByRole('button', { name: 'Tentar novamente' }));
    await waitFor(() => expect(screen.getByRole('switch').props.value).toBe(false));
  } finally { error.mockRestore(); }
});
it('duplo callback local não inicia decisão concorrente e mantém disabled até completar I/O', async () => {
  const gate = deferred<Notifications.NotificationPermissionsStatus>(); const entered = deferred<void>();
  notifications.getPermissionsAsync.mockImplementationOnce(async () => { entered.resolve(); return gate.promise; });
  const a = await row(); const toggle = screen.getByRole('switch');
  try { act(() => { fireEvent(toggle, 'valueChange', true); fireEvent(toggle, 'valueChange', false); }); await act(async () => entered.promise);
    expect(storage.setItem.mock.calls.filter(([key]) => key === OPT_IN)).toEqual([[OPT_IN, 'true']]);
    expect(screen.getByRole('switch').props.disabled).toBe(true);
    await act(async () => gate.resolve({ status: 'granted' } as never));
    await waitFor(() => expect(screen.getByRole('switch').props.disabled).toBe(false));
    expect(await PushService.getOptIn()).toBe(true);
    expect(storage.setItem.mock.calls.filter(([key]) => key === OPT_IN)).toEqual([[OPT_IN, 'true']]);
  } finally { await act(async () => gate.resolve({ status: 'granted' } as never)); await PushService.getOptIn(); a.unmount(); }
});

it.each(['granted', 'denied', 'native-error'] as const)('A desmontada com segunda permissão pendente → B nova não publica true intermediário; final %s', async outcome => {
  const gate = deferred<Notifications.NotificationPermissionsStatus>(); const entered = deferred<void>(); const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  notifications.getPermissionsAsync.mockResolvedValueOnce({ status: 'granted' } as never).mockImplementationOnce(async () => { entered.resolve(); return gate.promise; });
  notifications.requestPermissionsAsync.mockResolvedValue({ status: 'denied' } as never);
  const a = await row(); fireEvent(screen.getByRole('switch'), 'valueChange', true); await act(async () => entered.promise);
  expect(await AsyncStorage.getItem(OPT_IN)).toBe('true'); // valor intermediário no I/O, nunca confirmação da nova UI
  a.unmount(); const b = render(<ReminderRow visible />);
  try { await act(async () => undefined);
    expect(screen.queryByRole('switch')).toBeNull(); expect(screen.getByText('Carregando lembrete…')).toBeTruthy();
    await act(async () => outcome === 'native-error' ? gate.reject(new Error('native')) : gate.resolve({ status: outcome } as never));
    expect(screen.getByRole('switch').props.value).toBe(outcome === 'granted');
    expect(await AsyncStorage.getItem(OPT_IN)).toBe(String(outcome === 'granted'));
    expect(screen.queryByRole('alert')).toBeNull();
  } finally { await act(async () => gate.resolve({ status: 'denied' } as never)); await PushService.getOptIn(); b.unmount(); error.mockRestore(); }
});
it('texto máximo não limita label/erro e não promete hora configurável', async () => {
  const Native = require('react-native'); const dimensions = jest.spyOn(Native, 'useWindowDimensions').mockReturnValue({ width: 320, height: 800, scale: 2, fontScale: 3.1 });
  try { const view = await row(); expect(screen.queryByText(/\d{1,2}h|\d{1,2}:\d{2}/u)).toBeNull();
    for (const text of view.UNSAFE_getAllByType(Text)) { expect(text.props.maxFontSizeMultiplier).toBeUndefined(); expect(text.props.numberOfLines).toBeUndefined(); }
  } finally { dimensions.mockRestore(); }
});
it('falha ao desligar preserva o true persistido e informa o erro', async () => {
  const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  try { await AsyncStorage.setItem(OPT_IN, 'true'); await row(); storage.setItem.mockRejectedValueOnce(new Error('disk'));
    fireEvent(screen.getByRole('switch'), 'valueChange', false); await screen.findByRole('alert');
    await waitFor(() => expect(screen.getByRole('switch').props.value).toBe(true));
    expect(await AsyncStorage.getItem(OPT_IN)).toBe('true');
  } finally { error.mockRestore(); }
});
it('erro depois de blur não publica alerta antigo; refoco espera e reconcilia a preferência real', async () => {
  const gate = deferred<string>(); const entered = deferred<void>(); const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  notifications.scheduleNotificationAsync.mockImplementationOnce(async () => { entered.resolve(); return gate.promise; });
  const a = await row(); fireEvent(screen.getByRole('switch'), 'valueChange', true); await act(async () => entered.promise);
  try { await act(async () => { jest.requireMock('expo-router').__blur(); jest.requireMock('expo-router').__focus(); });
    expect(screen.queryByRole('switch')).toBeNull();
    await act(async () => gate.reject(new Error('schedule')));
    expect(screen.getByRole('switch').props.value).toBe(true); expect(screen.queryByRole('alert')).toBeNull();
  } finally { await act(async () => gate.resolve('id')); await PushService.getOptIn(); a.unmount(); error.mockRestore(); }
});
