import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { render, screen, waitFor } from '@testing-library/react-native';

import MissionsScreen from './MissionsScreen';
import { STORAGE_KEYS } from '../../../constants/storageKeys';

// Storage em memória de verdade: o `heartsRepository` real lê e escreve nele,
// então o teste cobre a tela e o repositório juntos, sem dublê do repositório.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

jest.mock('expo-router', () => ({
  useFocusEffect: (callback: () => void) => {
    const React = require('react');
    React.useEffect(() => {
      callback();
    }, [callback]);
  },
}));

// O contador legado sempre diz 5 vidas cheias: é o valor que o Perfil mostrava
// enquanto a Jornada descontava vidas em outro lugar. Mantê-lo em 5 aqui torna
// a divergência observável — se a tela voltar a lê-lo, as asserções abaixo
// veem 5 onde deveriam ver o que o `heartsRepository` guarda.
jest.mock('../../gamification/services/GamificationService', () => ({
  GamificationService: {
    getSnapshot: jest.fn().mockResolvedValue({
      totalXp: 40,
      streakDays: 2,
      lastActiveDate: null,
      hearts: 5,
      maxHearts: 5,
      heartsNextRefillAt: null,
    }),
  },
}));

jest.mock('../../daily-goal/services/DailyGoalService', () => ({
  DailyGoalService: {
    getSnapshot: jest.fn().mockResolvedValue(null),
    setTier: jest.fn(),
  },
}));

jest.mock('../../spaced-repetition/services/SpacedRepetitionService', () => ({
  SpacedRepetitionService: { getDueCount: jest.fn().mockResolvedValue(0) },
}));

jest.mock('../../student-checkpoints/useShadowCheckpoint', () => ({
  STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION: 'test',
  useShadowCheckpoint: () => undefined,
}));

const MINUTE = 60 * 1000;

async function seedHearts(state: { count: number; lastRefillAt: string | null; unlimitedUntil: string | null }) {
  await AsyncStorage.setItem(STORAGE_KEYS.HEARTS, JSON.stringify(state));
}

describe('MissionsScreen — seção Vidas no Perfil', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('mostra as vidas que a Jornada descontou, não o contador legado', async () => {
    await seedHearts({
      count: 2,
      lastRefillAt: new Date(Date.now() - 5 * MINUTE).toISOString(),
      unlimitedUntil: null,
    });

    render(<MissionsScreen embedded />);

    expect(await screen.findByLabelText('2 de 5 vidas')).toBeTruthy();
    expect(screen.queryByLabelText('5 de 5 vidas')).toBeNull();
  });

  it('conta a próxima vida pelo relógio do heartsRepository', async () => {
    await seedHearts({
      count: 3,
      lastRefillAt: new Date(Date.now() - 20 * MINUTE).toISOString(),
      unlimitedUntil: null,
    });

    render(<MissionsScreen embedded />);

    expect(await screen.findByText(/^Próximo coração em (9|10):\d\d$/)).toBeTruthy();
  });

  it('avisa do bloqueio quando o heartsRepository está vazio', async () => {
    await seedHearts({
      count: 0,
      lastRefillAt: new Date(Date.now() - 5 * MINUTE).toISOString(),
      unlimitedUntil: null,
    });

    render(<MissionsScreen embedded />);

    expect(await screen.findByLabelText('0 de 5 vidas')).toBeTruthy();
    expect(screen.getByText(/Sem vidas por agora/)).toBeTruthy();
  });

  it('assinante vê ∞ e "ilimitadas", sem corações, relógio nem aviso', async () => {
    await seedHearts({
      count: 1,
      lastRefillAt: new Date(Date.now() - 5 * MINUTE).toISOString(),
      unlimitedUntil: new Date(Date.now() + 30 * 24 * 60 * MINUTE).toISOString(),
    });

    render(<MissionsScreen embedded />);

    expect(await screen.findByLabelText('Vidas ilimitadas')).toBeTruthy();
    expect(screen.getByText('∞')).toBeTruthy();
    expect(screen.getByText('Assinante: ilimitadas')).toBeTruthy();
    expect(screen.queryByLabelText(/de 5 vidas/)).toBeNull();
    expect(screen.queryByText(/Próximo coração/)).toBeNull();
    expect(screen.queryByText(/Sem vidas por agora/)).toBeNull();
  });

  it('não mostra corações antes de ler o heartsRepository', async () => {
    let release: (value: string | null) => void = () => undefined;
    const pending = new Promise<string | null>((resolve) => {
      release = resolve;
    });
    const getItem = jest.spyOn(AsyncStorage, 'getItem').mockImplementation((key: string) =>
      key === STORAGE_KEYS.HEARTS ? pending : Promise.resolve(null));

    render(<MissionsScreen embedded />);

    await waitFor(() => expect(getItem).toHaveBeenCalledWith(STORAGE_KEYS.HEARTS));
    expect(screen.queryByLabelText(/de 5 vidas/)).toBeNull();

    release(JSON.stringify({ count: 4, lastRefillAt: new Date().toISOString(), unlimitedUntil: null }));
    expect(await screen.findByLabelText('4 de 5 vidas')).toBeTruthy();
    getItem.mockRestore();
  });
});
