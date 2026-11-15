import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { UnitCompleteCelebration, completedCelebrationUnits, takeUnitCelebration } from './UnitCompleteCelebration';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import { AppConfig } from '../../../config';
import { ConversionService } from '../../conversion/ConversionService';

jest.mock('expo-router', () => ({ router: { push: jest.fn() } }));
const mockedRouter = jest.requireMock('expo-router').router as { push: jest.Mock };

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('../../../ui/illustrations/ThemeIllustration', () => ({ ThemeIllustration: () => null }));
const mockReducedMotion = jest.fn(() => false);
jest.mock('../../../ui/accessibility/useReducedMotionPreference', () => ({
  useReducedMotionPreference: () => mockReducedMotion(),
  useReducedMotionPreferenceState: () => ({ reducedMotionEnabled: mockReducedMotion(), resolved: true }),
}));
// A cunhagem da medalha (F3) é uma mola do Reanimated: conta-se a chamada.
jest.mock('react-native-reanimated', () => {
  const actual = jest.requireActual('react-native-reanimated/mock');
  return { ...actual, __esModule: true, withSpring: jest.fn((value: unknown) => value) };
});
const reanimated = jest.requireMock('react-native-reanimated') as { withSpring: jest.Mock };
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

  describe('F3: a medalha da unidade cunha com ENABLE_RICH_FEEDBACK', () => {
    beforeEach(() => reanimated.withSpring.mockClear());
    afterEach(() => { AppConfig.ENABLE_RICH_FEEDBACK = false; });

    it('ligado, a medalha cunha uma vez, e Continuar dispensa sem esperar', () => {
      AppConfig.ENABLE_RICH_FEEDBACK = true;
      const onContinue = jest.fn();
      render(<UnitCompleteCelebration unit={m01} onContinue={onContinue} />);
      expect(reanimated.withSpring).toHaveBeenCalledTimes(1);
      expect(reanimated.withSpring.mock.calls[0][1]).toEqual(expect.objectContaining({ duration: 600 }));
      fireEvent.press(screen.getByLabelText('Continuar'));
      expect(onContinue).toHaveBeenCalledTimes(1);
    });

    // A Home deixa o componente montado entre comemorações (unit null no meio).
    it('ligado, cada unidade nova cunha de novo, com o componente montado', () => {
      AppConfig.ENABLE_RICH_FEEDBACK = true;
      const view = render(<UnitCompleteCelebration unit={m01} onContinue={jest.fn()} />);
      view.rerender(<UnitCompleteCelebration unit={null} onContinue={jest.fn()} />);
      view.rerender(<UnitCompleteCelebration unit={m02} onContinue={jest.fn()} />);
      expect(reanimated.withSpring).toHaveBeenCalledTimes(2);
    });

    it('ligado, a troca direta de uma unidade para outra também cunha de novo', () => {
      AppConfig.ENABLE_RICH_FEEDBACK = true;
      const view = render(<UnitCompleteCelebration unit={m01} onContinue={jest.fn()} />);
      view.rerender(<UnitCompleteCelebration unit={m02} onContinue={jest.fn()} />);
      expect(reanimated.withSpring).toHaveBeenCalledTimes(2);
    });

    it('desligado (contraprova), a medalha fica parada como na base', () => {
      render(<UnitCompleteCelebration unit={m01} onContinue={jest.fn()} />);
      expect(reanimated.withSpring).not.toHaveBeenCalled();
    });

    it('ligado e com menos movimento, a medalha fica no lugar', () => {
      AppConfig.ENABLE_RICH_FEEDBACK = true;
      mockReducedMotion.mockReturnValue(true);
      render(<UnitCompleteCelebration unit={m01} onContinue={jest.fn()} />);
      expect(reanimated.withSpring).not.toHaveBeenCalled();
      expect(screen.getByLabelText('Unidade m01. Unidade concluída.')).toBeTruthy();
    });
  });

  it('com "reduzir movimento" abre sem transição e sem confete, com o texto e o botão no lugar', () => {
    mockReducedMotion.mockReturnValue(true);
    render(<UnitCompleteCelebration unit={m01} onContinue={jest.fn()} />);
    expect(screen.UNSAFE_getByType(require('react-native').Modal).props.animationType).toBe('none');
    expect(screen.queryByTestId('confetti')).toBeNull();
    expect(screen.getByLabelText('Continuar')).toBeTruthy();
  });
});

describe('UnitCompleteCelebration — convite de assinatura (F8)', () => {
  const conversao = (ligada: boolean) => new ConversionService({
    storage: AsyncStorage, enabled: () => ligada, hearts: { setUnlimited: jest.fn() },
    subscription: { getStatus: async () => ({ kind: 'none' }), storeAvailable: () => true },
  });
  beforeEach(async () => { await AsyncStorage.clear(); mockedRouter.push.mockClear(); });

  it('ligada: uma linha e o link, com Continuar ainda como ação principal', async () => {
    const onContinue = jest.fn();
    render(<UnitCompleteCelebration unit={m01} onContinue={onContinue} conversion={conversao(true)} />);
    expect(await screen.findByText('Na próxima unidade, com o Radiant Ilimitado, errar não gasta vida.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Continuar' })).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Conhecer o Ilimitado' }));
    expect(onContinue).toHaveBeenCalledTimes(1);
    expect(mockedRouter.push).toHaveBeenCalledWith('/subscription');
  });

  it('desligada (contraprova): a comemoração da main, sem convite e sem escrever a chave', async () => {
    render(<UnitCompleteCelebration unit={m01} onContinue={jest.fn()} conversion={conversao(false)} />);
    expect(await screen.findByRole('button', { name: 'Continuar' })).toBeTruthy();
    await act(async () => { await Promise.resolve(); });
    expect(screen.queryByText(/Radiant Ilimitado/)).toBeNull();
    expect(await AsyncStorage.getItem(STORAGE_KEYS.CONVERSION)).toBeNull();
  });
});
