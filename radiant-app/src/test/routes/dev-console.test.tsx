import React from 'react';
import { screen } from '@testing-library/react-native';

import DevConsoleRoute from '../../app/dev-console';
import { renderWithProviders } from '../renderWithProviders';
import { AppConfig } from '../../config';

jest.mock('expo-router', () => ({
  router: { replace: jest.fn(), push: jest.fn() },
  useFocusEffect: (callback: () => void) => {
    const React = require('react');
    React.useEffect(() => {
      callback();
    }, [callback]);
  },
}));

jest.mock('../../features/dev-console/screens/DevConsoleScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    __esModule: true,
    default: () => React.createElement(Text, null, 'Console de desenvolvimento'),
  };
});

jest.mock('../../config', () => ({
  AppConfig: { SHOW_DEV_TOOLS: true },
}));

describe('rota do console de desenvolvimento', () => {
  afterEach(() => {
    AppConfig.SHOW_DEV_TOOLS = true;
  });

  it('monta o console quando as ferramentas de desenvolvimento estão ligadas', () => {
    AppConfig.SHOW_DEV_TOOLS = true;

    renderWithProviders(<DevConsoleRoute />);

    expect(screen.getByText('Console de desenvolvimento')).toBeTruthy();
  });

  it('não monta o console em build sem ferramentas de desenvolvimento', () => {
    // `SHOW_DEV_TOOLS` tem padrão `__DEV__ || EXPO_PUBLIC_ENABLE_DEV_TOOLS`, então
    // em release o console some da interface sem precisar de flag nova. Se este
    // teste cair, o aluno passa a alcançar flags de build e reset de estado local.
    AppConfig.SHOW_DEV_TOOLS = false;

    renderWithProviders(<DevConsoleRoute />);

    expect(screen.queryByText('Console de desenvolvimento')).toBeNull();
    expect(screen.getByText('Diagnóstico restrito')).toBeTruthy();
  });
});
