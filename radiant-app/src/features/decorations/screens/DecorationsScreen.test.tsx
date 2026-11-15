import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import DecorationsScreen from './DecorationsScreen';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');
jest.mock('expo-router', () => ({
  router: { push: jest.fn(), back: jest.fn() },
  useFocusEffect: (callback: () => void | (() => void)) => {
    const React = require('react');
    React.useEffect(() => callback(), [callback]);
  },
}));

// O serviço real com portas falsas: aluno com uma aula e 3 dias seguidos, sem assinatura.
let mockSubscriber = false;
jest.mock('../DecorationsService', () => {
  const actual = jest.requireActual('../DecorationsService');
  const service = new actual.DecorationsCoordinator({
    progress: async () => ({ lessonsCompleted: 1, unitsCompleted: 0, streakDays: 3, allMissionsDoneToday: false, level: 1 }),
    subscriber: async () => mockSubscriber,
  });
  return { ...actual, DecorationsService: service };
});

const push = router.push as jest.Mock;
beforeEach(async () => { jest.clearAllMocks(); mockSubscriber = false; await AsyncStorage.clear(); });

describe('DecorationsScreen', () => {
  it('lista os 11 itens nos três encaixes, com o estado escrito e não só por cor', async () => {
    render(<DecorationsScreen />);
    expect(await screen.findByRole('button', { name: 'Aurora. Ganha. Toque para equipar.' })).toBeTruthy();
    for (const title of ['Moldura do avatar', 'Selo ao lado do nome', 'Cartão do perfil']) expect(screen.getByRole('header', { name: title })).toBeTruthy();
    expect(screen.getByText('Bloqueada: Estude 7 dias seguidos')).toBeTruthy();
    expect(screen.getByLabelText('Órbita. Bloqueada. Estude 7 dias seguidos.')).toBeTruthy();
    expect(screen.getAllByText(/^(Ganha|Ganho)\. Toque para equipar\.$|^Bloquead|^Exclusiv/).length).toBe(11);
  });

  it('equipar e tirar: o estado muda na tela e no storage', async () => {
    render(<DecorationsScreen />);
    fireEvent.press(await screen.findByRole('button', { name: 'Faísca. Ganho. Toque para equipar.' }));
    const equipped = await screen.findByRole('button', { name: 'Faísca. Equipado. Toque para tirar.' });
    expect(equipped.props.accessibilityState).toMatchObject({ selected: true });
    expect(JSON.parse((await AsyncStorage.getItem(STORAGE_KEYS.DECORATIONS))!).equipped).toEqual({ selo: 'selo-faisca' });
    fireEvent.press(equipped);
    await screen.findByRole('button', { name: 'Faísca. Ganho. Toque para equipar.' });
    expect(JSON.parse((await AsyncStorage.getItem(STORAGE_KEYS.DECORATIONS))!).equipped).toEqual({});
  });

  it('bloqueado comum não é botão; exclusivo bloqueado leva à assinatura que já existe', async () => {
    render(<DecorationsScreen />);
    await screen.findByLabelText('Órbita. Bloqueada. Estude 7 dias seguidos.');
    expect(screen.queryByRole('button', { name: /^Órbita/ })).toBeNull();
    fireEvent.press(screen.getByRole('button', { name: 'Ouro. Exclusiva do Radiant Ilimitado. Toque para conhecer.' }));
    expect(push).toHaveBeenCalledWith('/subscription');
    expect(await AsyncStorage.getItem(STORAGE_KEYS.DECORATIONS)).not.toContain('moldura-ouro');
  });

  it('assinante equipa o exclusivo direto', async () => {
    mockSubscriber = true;
    render(<DecorationsScreen />);
    fireEvent.press(await screen.findByRole('button', { name: 'Ouro. Ganha. Toque para equipar.' }));
    await screen.findByRole('button', { name: 'Ouro. Equipada. Toque para tirar.' });
    expect(push).not.toHaveBeenCalled();
  });

  it('todo item tocável tem alvo de pelo menos 44 pt', async () => {
    render(<DecorationsScreen />);
    await screen.findAllByRole('button');
    const Native = require('react-native');
    for (const button of screen.getAllByRole('button')) {
      const style = Native.StyleSheet.flatten(typeof button.props.style === 'function' ? button.props.style({ pressed: false }) : button.props.style);
      expect(Math.max(style?.minHeight ?? 0, style?.height ?? 0)).toBeGreaterThanOrEqual(44);
    }
  });

});
