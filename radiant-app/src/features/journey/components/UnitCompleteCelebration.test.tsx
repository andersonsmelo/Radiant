import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { UnitCompleteCelebration, completedCelebrationUnits, takeUnitCelebration } from './UnitCompleteCelebration';
import { STORAGE_KEYS } from '../../../constants/storageKeys';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('../../../ui/illustrations/ThemeIllustration', () => ({ ThemeIllustration: () => null }));
const mockReducedMotion = jest.fn(() => false);
jest.mock('../../../ui/accessibility/useReducedMotionPreference', () => ({ useReducedMotionPreference: () => mockReducedMotion() }));
jest.mock('../../../components/ui/Confetti', () => {
  const { View } = require('react-native');
  return { Confetti: () => (mockReducedMotion() ? null : <View testID="confetti" pointerEvents="none" />) };
});

type Status = 'completed' | 'available' | 'locked';
const node = (id: string, type: 'lesson' | 'checkpoint' | 'reward', status: Status) => ({ id, type, status }) as never;
const segment = (trackId: string, statuses: [Status, Status, Status]) => ({
  trackId, trackTitle: `Unidade ${trackId}`,
  units: [{ theme: undefined, nodes: [node(`${trackId}:aula`, 'lesson', statuses[0]), node(`${trackId}:conf`, 'checkpoint', statuses[1]), node(`${trackId}:premio`, 'reward', statuses[2])] }],
});
const m01 = { id: 'm01', title: 'Unidade m01', theme: undefined };
const m02 = { id: 'm02', title: 'Unidade m02', theme: undefined };

describe('completedCelebrationUnits', () => {
  it('conclui a unidade quando a última aula e a última conferência fecham, sem esperar a conquista', () => {
    expect(completedCelebrationUnits([segment('m01', ['completed', 'completed', 'available'])])).toEqual([m01]);
    expect(completedCelebrationUnits([segment('m01', ['completed', 'available', 'locked'])])).toEqual([]);
    expect(completedCelebrationUnits([segment('m01', ['available', 'completed', 'completed'])])).toEqual([]);
    expect(completedCelebrationUnits([{ trackId: 'vazia', trackTitle: 'Vazia', units: [] }])).toEqual([]);
  });
});

describe('takeUnitCelebration', () => {
  const saved = async () => JSON.parse((await AsyncStorage.getItem(STORAGE_KEYS.UNIT_CELEBRATIONS))!);
  beforeEach(async () => { await AsyncStorage.clear(); });

  it('comemora cada unidade uma única vez, e a marca fica gravada com schemaVersion', async () => {
    expect(await takeUnitCelebration([])).toBeNull();
    expect(await saved()).toEqual({ schemaVersion: 1, unitIds: [] });
    expect(await takeUnitCelebration([m01])).toEqual(m01);
    expect(await saved()).toEqual({ schemaVersion: 1, unitIds: ['m01'] });
    expect(await takeUnitCelebration([m01])).toBeNull();
    expect(await takeUnitCelebration([m01, m02])).toEqual(m02);
    expect(await takeUnitCelebration([m01, m02])).toBeNull();
  });

  it('quem já tinha unidades concluídas na primeira leitura não recebe a comemoração delas', async () => {
    expect(await takeUnitCelebration([m01])).toBeNull();
    expect(await saved()).toEqual({ schemaVersion: 1, unitIds: ['m01'] });
    expect(await takeUnitCelebration([m01, m02])).toEqual(m02);
  });

  it('não grava por cima de um store com schemaVersion desconhecido, e sem poder marcar não comemora', async () => {
    const future = JSON.stringify({ schemaVersion: 2, unitIds: [], extra: true });
    await AsyncStorage.setItem(STORAGE_KEYS.UNIT_CELEBRATIONS, future);
    expect(await takeUnitCelebration([m01])).toBeNull();
    expect(await AsyncStorage.getItem(STORAGE_KEYS.UNIT_CELEBRATIONS)).toBe(future);
  });

  it('falha de gravação não comemora: sem a marca a festa voltaria a cada abertura', async () => {
    await takeUnitCelebration([]);
    const error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error('disk-full'));
    expect(await takeUnitCelebration([m01])).toBeNull();
    error.mockRestore();
  });
});

describe('UnitCompleteCelebration', () => {
  beforeEach(() => { mockReducedMotion.mockReturnValue(false); });

  it('mostra medalha, a frase da unidade e Continuar, e toca unit_complete uma vez por unidade', () => {
    const feedback = { emit: jest.fn() };
    const onContinue = jest.fn();
    const view = render(<UnitCompleteCelebration unit={m01} onContinue={onContinue} feedback={feedback} />);
    expect(screen.getByRole('header', { name: 'Unidade concluída' })).toBeTruthy();
    expect(screen.getByText(/Você fechou Unidade m01\./)).toBeTruthy();
    expect(screen.getByLabelText('Unidade m01. Unidade concluída.')).toBeTruthy();
    expect(screen.getByTestId('confetti').props.pointerEvents).toBe('none');

    view.rerender(<UnitCompleteCelebration unit={{ ...m01 }} onContinue={onContinue} feedback={{ emit: feedback.emit }} />);
    expect(feedback.emit.mock.calls).toEqual([['unit_complete']]);

    fireEvent.press(screen.getByLabelText('Continuar'));
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it('sem unidade não mostra nada nem toca som', () => {
    const feedback = { emit: jest.fn() };
    render(<UnitCompleteCelebration unit={null} onContinue={jest.fn()} feedback={feedback} />);
    expect(screen.queryByText('Unidade concluída')).toBeNull();
    expect(feedback.emit).not.toHaveBeenCalled();
  });

  it('com "reduzir movimento" abre sem transição e sem confete, com o texto e o botão no lugar', () => {
    mockReducedMotion.mockReturnValue(true);
    render(<UnitCompleteCelebration unit={m01} onContinue={jest.fn()} />);
    expect(screen.UNSAFE_getByType(require('react-native').Modal).props.animationType).toBe('none');
    expect(screen.queryByTestId('confetti')).toBeNull();
    expect(screen.getByLabelText('Continuar')).toBeTruthy();
  });
});
