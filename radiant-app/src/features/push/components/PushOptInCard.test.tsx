import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import * as ReactNative from 'react-native';

import { Card } from '../../../components/ui/Card';
import { PushOptInCard } from './PushOptInCard';
import { PushService } from '../services/PushService';
import { TelemetryService } from '../../telemetry/TelemetryService';

jest.mock('../services/PushService', () => ({
  PushService: {
    setOptIn: jest.fn().mockResolvedValue(undefined),
    scheduleDailyIfEligible: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('../../telemetry/TelemetryService', () => ({
  TelemetryService: { track: jest.fn() },
}));

// Keep the shared button real; only its unrelated async motion preference is stable.
jest.mock('../../../ui/accessibility/useReducedMotionPreference', () => ({
  useReducedMotionPreference: () => false,
}));

const push = PushService as jest.Mocked<typeof PushService>;

describe('PushOptInCard', () => {
  let fontScale = 1;

  beforeEach(() => {
    jest.clearAllMocks();
    fontScale = 1;
    jest.spyOn(require('react-native'), 'useWindowDimensions').mockImplementation(() => ({
      width: 390, height: 844, scale: 3, fontScale,
    }));
  });
  afterEach(() => jest.restoreAllMocks());

  const title = 'Quer um lembrete suave?';
  const body = 'Podemos te avisar em dias em que você decidir estudar. Sem pressão. Sem cobrança.';

  it.each([1, 2, 3.1].flatMap((scale) => [
    [scale, title, 24, 'Sora-Bold'],
    [scale, body, 14, 'Sora-SemiBold'],
  ] as const))('usa altura natural na escala %s para %s', (scale, copy, fontSize, fontFamily) => {
    fontScale = scale;
    render(<PushOptInCard onDismiss={jest.fn()} />);
    const text = screen.getByText(copy);
    const style = ReactNative.StyleSheet.flatten(text.props.style);
    expect(style.lineHeight).toBeUndefined();
    expect(style.height).toBeUndefined();
    expect(style.maxHeight).toBeUndefined();
    expect(style.fontSize).toBe(fontSize);
    expect(style.fontFamily).toBe(fontFamily);
    expect(text.props.numberOfLines).toBeUndefined();
    expect(text.props.allowFontScaling).not.toBe(false);
    expect(text.props.maxFontSizeMultiplier).toBeUndefined();
    expect(push.setOptIn).not.toHaveBeenCalled();
    expect(TelemetryService.track).not.toHaveBeenCalled();
  });

  it.each([title, body, 'Agora não'])('remede %s em normal→máximo→normal sem reiniciar o aceite pendente', async (copy) => {
    let finishOptIn!: () => void;
    push.setOptIn.mockImplementationOnce(() => new Promise<void>((resolve) => { finishOptIn = resolve; }));
    const onDismiss = jest.fn();
    const { rerender } = render(<PushOptInCard onDismiss={onDismiss} />);
    let previous = screen.getByText(copy);
    const card = screen.UNSAFE_getByType(Card);

    fireEvent.press(screen.getByRole('button', { name: 'Ativar lembretes' }));
    for (const nextScale of [3.1, 1]) {
      fontScale = nextScale;
      rerender(<PushOptInCard onDismiss={onDismiss} />);
      const current = screen.getByText(copy);
      expect(current).not.toBe(previous);
      previous = current;
      expect(screen.UNSAFE_getByType(Card)).toBe(card);
      expect(screen.getByRole('button', { name: 'Ativando...', disabled: true })).toBeTruthy();
      expect(push.setOptIn).toHaveBeenCalledTimes(1);
      expect(push.setOptIn).toHaveBeenCalledWith(true);
      expect(push.scheduleDailyIfEligible).not.toHaveBeenCalled();
      expect(onDismiss).not.toHaveBeenCalled();
    }

    await act(async () => { finishOptIn(); });
    await waitFor(() => expect(onDismiss).toHaveBeenCalledTimes(1));
    expect(push.setOptIn).toHaveBeenCalledTimes(1);
    expect(push.scheduleDailyIfEligible).toHaveBeenCalledTimes(1);
    expect(push.scheduleDailyIfEligible).toHaveBeenCalledWith({ reason: 'optin_immediate' });
    expect(TelemetryService.track).toHaveBeenCalledTimes(1);
    expect(TelemetryService.track).toHaveBeenCalledWith('push_optin_accepted');
    expect(screen.getByRole('button', { name: 'Ativar lembretes', disabled: false })).toBeTruthy();
  });

  it('registra recusa e fecha sem agendar lembretes', async () => {
    const onDismiss = jest.fn();
    render(<PushOptInCard onDismiss={onDismiss} />);
    fireEvent.press(screen.getByRole('button', { name: 'Agora não' }));
    await waitFor(() => expect(onDismiss).toHaveBeenCalledTimes(1));
    expect(push.setOptIn).toHaveBeenCalledTimes(1);
    expect(push.setOptIn).toHaveBeenCalledWith(false);
    expect(push.scheduleDailyIfEligible).not.toHaveBeenCalled();
    expect(TelemetryService.track).toHaveBeenCalledTimes(1);
    expect(TelemetryService.track).toHaveBeenCalledWith('push_optin_declined');
  });

  // Visto no simulador em 2026-10-16: o primeiro agendamento real lançou, e o
  // cartão ficou preso em "Ativando..." com o aceite já gravado.
  it('fecha mesmo quando o agendamento falha, com o aceite já registrado', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    push.scheduleDailyIfEligible.mockRejectedValueOnce(new Error('trigger inválido'));
    const onDismiss = jest.fn();

    try {
      render(<PushOptInCard onDismiss={onDismiss} />);
      fireEvent.press(screen.getByText('Ativar lembretes'));

      await waitFor(() => expect(onDismiss).toHaveBeenCalledTimes(1));
      expect(push.setOptIn).toHaveBeenCalledWith(true);
    } finally {
      errorSpy.mockRestore();
    }
  });
});
