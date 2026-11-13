/**
 * Com `ENABLE_LEAGUE` desligada (o padrão), o app se comporta como a `main`:
 * nenhum ouvinte de XP, nenhuma leitura ou gravação da liga, nenhum módulo
 * nativo pedido, nenhuma linha no Perfil ou na Estude e a rota `/league` volta
 * para a Estude. O plugin nativo é coberto em `gameCenterPlugin.test.ts`.
 */
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { render, screen } from '@testing-library/react-native';
import { requireOptionalNativeModule } from 'expo-modules-core';

import { AppConfig } from '../../config';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { GamificationService } from '../gamification/services/GamificationService';
import { resolveLeagueAdapter } from './GameCenterLeagueAdapter';
import { UnavailableLeagueAdapter } from './UnavailableLeagueAdapter';
import { LeagueService, startLeague, stopLeagueForTests } from './LeagueService';
import { LeagueNoticeRow } from './components/LeagueNoticeRow';
import { LeagueProfileRow } from './components/LeagueProfileRow';
import LeagueRoute from '../../app/league';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('expo-modules-core', () => ({ requireOptionalNativeModule: jest.fn(() => null) }));
jest.mock('expo-router', () => ({
  Redirect: ({ href }: { href: string }) => {
    const { Text } = require('react-native');
    return <Text>{`redireciona para ${href}`}</Text>;
  },
  useFocusEffect: (callback: () => void | (() => void)) => {
    const React = require('react');
    React.useEffect(() => callback(), [callback]);
  },
}));
jest.mock('./screens/LeagueScreen', () => () => null);

beforeEach(async () => {
  await AsyncStorage.clear();
  await GamificationService.reset();
  stopLeagueForTests();
  jest.clearAllMocks();
});

describe('liga com a chave desligada (padrão)', () => {
  it('o padrão da build é desligado', () => {
    expect(AppConfig.ENABLE_LEAGUE).toBe(false);
  });

  it('startLeague não ouve o XP nem grava nada da liga', async () => {
    const ouvir = jest.spyOn(GamificationService, 'onXpEarned');
    startLeague();
    await GamificationService.addManualXp(20);
    await new Promise(resolve => setImmediate(resolve));
    expect(ouvir).not.toHaveBeenCalled();
    expect(await AsyncStorage.getItem(STORAGE_KEYS.LEAGUE)).toBeNull();
    ouvir.mockRestore();
  });

  it('nem pede o módulo nativo: o adaptador é o indisponível', () => {
    expect(resolveLeagueAdapter()).toBeInstanceOf(UnavailableLeagueAdapter);
    expect(requireOptionalNativeModule).not.toHaveBeenCalled();
  });

  it('Perfil e Estude não mostram linha nenhuma, e a Estude não consulta a liga', async () => {
    const consultar = jest.spyOn(LeagueService, 'checkNotice');
    render(<><LeagueProfileRow onPress={jest.fn()} /><LeagueNoticeRow onPress={jest.fn()} /></>);
    await Promise.resolve();
    expect(screen.toJSON()).toBeNull();
    expect(consultar).not.toHaveBeenCalled();
  });

  it('a rota /league volta para a Estude', () => {
    render(<LeagueRoute />);
    expect(screen.getByText('redireciona para /')).toBeTruthy();
  });
});

describe('contraprova: com a chave ligada, o mesmo caminho age', () => {
  it('startLeague(true) ouve o XP e grava o balde da semana', async () => {
    startLeague(true);
    await GamificationService.addManualXp(20);
    await new Promise(resolve => setImmediate(resolve));
    await new Promise(resolve => setImmediate(resolve));
    expect(JSON.parse((await AsyncStorage.getItem(STORAGE_KEYS.LEAGUE)) ?? '{}').weekXp).toBe(20);
  });
});
