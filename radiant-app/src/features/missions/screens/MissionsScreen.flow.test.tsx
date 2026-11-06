import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';

import MissionsScreen from './MissionsScreen';
import { DailyMissionsService } from '../services/DailyMissionsService';

const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  router: { back: () => mockBack() },
  useFocusEffect: (callback: () => void | (() => void)) => {
    const React = require('react');
    React.useEffect(() => callback(), [callback]);
  },
}));
jest.mock('../../../../components/ui/icon-symbol', () => ({ IconSymbol: () => null }));
jest.mock('../../../ui/components/StarfieldBackground', () => ({ StarfieldBackground: () => null }));
jest.mock('../../student-checkpoints/useShadowCheckpoint', () => ({
  STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION: 'test',
  useShadowCheckpoint: () => undefined,
}));
jest.mock('../services/DailyMissionsService', () => ({
  MISSION_BONUS_XP: 5,
  DailyMissionsService: { sync: jest.fn() },
}));

const sync = DailyMissionsService.sync as jest.Mock;

describe('MissionsScreen na rota /missions', () => {
  beforeEach(() => { sync.mockReset(); mockBack.mockReset(); });

  it('mostra as três missões do dia com o progresso e o bônus de cada uma', async () => {
    sync.mockResolvedValue({ bonusXp: 5, missions: [
      { id: 'aula-2', title: 'Conclua 2 aulas', progress: 1, goal: 2, done: false, rewarded: false },
      { id: 'seguidas-5', title: 'Acerte 5 seguidas', progress: 5, goal: 5, done: true, rewarded: true },
      { id: 'meta', title: 'Bata a meta diária', progress: 50, goal: 50, done: true, rewarded: false },
    ] });
    render(<MissionsScreen />);

    expect(screen.getByRole('header', { name: 'Missões de hoje' })).toBeTruthy();
    const half = await screen.findByLabelText('Conclua 2 aulas. 1 de 2.');
    expect(half.props.accessibilityValue).toEqual({ min: 0, max: 2, now: 1 });
    expect(screen.getByTestId('mission-fill-aula-2').props.style).toContainEqual({ width: '50%' });
    expect(screen.getByLabelText('Acerte 5 seguidas. Concluída, +5 XP.')).toBeTruthy();
    // Concluída sem bônus creditado não promete XP.
    expect(screen.getByLabelText('Bata a meta diária. Concluída.')).toBeTruthy();
  });

  it('diz que não leu quando a leitura falha, sem inventar missão', async () => {
    sync.mockRejectedValue(new Error('storage-unavailable'));
    render(<MissionsScreen />);
    expect(await screen.findByText('Não foi possível ler as missões agora. Tente de novo em instantes.')).toBeTruthy();
    expect(screen.queryByText(/Conclua|Acerte|Bata|Faça/)).toBeNull();
  });

  it('o botão Voltar sai da tela', async () => {
    sync.mockResolvedValue({ bonusXp: 0, missions: [] });
    render(<MissionsScreen />);
    fireEvent.press(screen.getByLabelText('Voltar'));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
