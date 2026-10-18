import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { PushOptInCard } from './PushOptInCard';
import { PushService } from '../services/PushService';

jest.mock('../services/PushService', () => ({
  PushService: {
    setOptIn: jest.fn().mockResolvedValue(undefined),
    scheduleDailyIfEligible: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('../../telemetry/TelemetryService', () => ({
  TelemetryService: { track: jest.fn() },
}));

const push = PushService as jest.Mocked<typeof PushService>;

describe('PushOptInCard', () => {
  beforeEach(() => jest.clearAllMocks());

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
