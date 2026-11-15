/**
 * Com `ENABLE_DECORATIONS` desligada (o padrão), a rota `/decoracoes` volta para a
 * Estude e a linha do Perfil não monta. O Perfil está coberto em `ProfileScreen.flow.test.tsx`.
 */
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { AppConfig } from '../../config';
import DecoracoesRoute from '../../app/decoracoes';
import { DecorationsProfileRow } from './components/DecorationsProfileRow';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');
jest.mock('expo-router', () => ({
  router: { push: jest.fn(), back: jest.fn() },
  Redirect: ({ href }: { href: string }) => {
    const { Text } = require('react-native');
    return <Text>{`redireciona para ${href}`}</Text>;
  },
  useFocusEffect: () => undefined,
}));

const original = AppConfig.ENABLE_DECORATIONS;
afterEach(() => { AppConfig.ENABLE_DECORATIONS = original; });

it('padrão desligado: a rota volta para a Estude e a linha do Perfil não monta', () => {
  expect(original).toBe(false);
  render(<DecoracoesRoute />);
  expect(screen.getByText('redireciona para /')).toBeTruthy();
  screen.unmount();
  render(<DecorationsProfileRow state={null} />);
  expect(screen.toJSON()).toBeNull();
});

it('contraprova: ligada, a rota abre a tela e a linha aparece', () => {
  AppConfig.ENABLE_DECORATIONS = true;
  render(<DecoracoesRoute />);
  expect(screen.getByRole('header', { name: 'Decorações' })).toBeTruthy();
  screen.unmount();
  render(<DecorationsProfileRow state={null} />);
  expect(screen.getByRole('button', { name: 'Decorações. Enfeites do seu perfil.' })).toBeTruthy();
});
