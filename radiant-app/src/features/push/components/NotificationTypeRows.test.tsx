import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { AppConfig } from '../../../config';
import { NotificationTypeRows } from './NotificationTypeRows';
import { readNotificationPreferences } from '../personalized/notificationPreferences';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('expo-router', () => ({
  useFocusEffect: (callback: () => void | (() => void)) => {
    const React = require('react');
    React.useEffect(() => callback(), [callback]);
  },
}));

const original = AppConfig.ENABLE_PERSONALIZED_NOTIFICATIONS;
beforeEach(() => AsyncStorage.clear());
afterEach(() => { AppConfig.ENABLE_PERSONALIZED_NOTIFICATIONS = original; });

const LABELS = ['Sequência de estudo', 'Revisões devidas', 'Próxima aula e retorno', 'Meta do dia', 'Liga da semana'];

describe('NotificationTypeRows', () => {
  it('desligada: não monta nada (os Ajustes são os da 1.5.0)', async () => {
    AppConfig.ENABLE_PERSONALIZED_NOTIFICATIONS = false;
    render(<NotificationTypeRows />);
    // Espera a leitura que a versão ligada faria: nula antes dela não prova nada.
    await act(async () => { await new Promise(resolve => setImmediate(resolve)); });
    expect(screen.toJSON()).toBeNull();
  });

  it('ligada: um interruptor rotulado por tipo, todos ligados de início', async () => {
    AppConfig.ENABLE_PERSONALIZED_NOTIFICATIONS = true;
    render(<NotificationTypeRows />);
    for (const label of LABELS) {
      const control = await screen.findByLabelText(label);
      expect(control.props.value).toBe(true);
    }
  });

  it('desligar um tipo grava só ele', async () => {
    AppConfig.ENABLE_PERSONALIZED_NOTIFICATIONS = true;
    render(<NotificationTypeRows />);
    fireEvent(await screen.findByLabelText('Liga da semana'), 'valueChange', false);
    await waitFor(async () => expect((await readNotificationPreferences()).liga).toBe(false));
    expect((await readNotificationPreferences()).sequencia).toBe(true);
    await waitFor(() => expect(screen.getByLabelText('Liga da semana').props.value).toBe(false));
  });
});
