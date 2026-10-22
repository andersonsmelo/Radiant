import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { ReminderRow } from './ReminderRow';
import { PushService } from '../services/PushService';

jest.mock('../services/PushService', () => ({
  PushService: {
    getOptIn: jest.fn(),
    setOptIn: jest.fn(),
    requestPermissionIfNeeded: jest.fn(),
    scheduleDailyIfEligible: jest.fn(),
  },
}));

jest.mock('../../telemetry/TelemetryService', () => ({
  TelemetryService: { track: jest.fn() },
}));

const push = PushService as jest.Mocked<typeof PushService>;

async function renderRow(visible = true) {
  const view = render(<ReminderRow visible={visible} />);
  await act(async () => undefined);
  return view;
}

describe('ReminderRow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    push.getOptIn.mockResolvedValue(null);
    push.setOptIn.mockResolvedValue(undefined);
    push.requestPermissionIfNeeded.mockResolvedValue('granted');
    push.scheduleDailyIfEligible.mockResolvedValue(undefined);
  });

  it('não aparece enquanto não for visível', async () => {
    const { toJSON } = await renderRow(false);

    expect(toJSON()).toBeNull();
  });

  it('é uma linha com o interruptor desligado para quem ainda não decidiu', async () => {
    await renderRow();

    expect(screen.getByText('Lembrete diário')).toBeTruthy();
    expect(screen.getByRole('switch', { name: 'Lembrete diário' }).props.value).toBe(false);
  });

  it('não promete horário no texto', async () => {
    await renderRow();

    expect(screen.queryByText(/\d{1,2}h|\d{1,2}:\d{2}/u)).toBeNull();
  });

  it('só desenha o interruptor depois de ler a escolha guardada, sem saltar de desligado a ligado', async () => {
    let resolveOptIn: (value: boolean | null) => void = () => undefined;
    push.getOptIn.mockReturnValue(new Promise((resolve) => { resolveOptIn = resolve; }));
    render(<ReminderRow visible />);

    expect(screen.queryByRole('switch', { name: 'Lembrete diário' })).toBeNull();

    await act(async () => resolveOptIn(true));

    expect(screen.getByRole('switch', { name: 'Lembrete diário' }).props.value).toBe(true);
  });

  it('se a leitura falhar, mostra o interruptor desligado', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    push.getOptIn.mockRejectedValue(new Error('storage'));
    try {
      await renderRow();

      expect(screen.getByRole('switch', { name: 'Lembrete diário' }).props.value).toBe(false);
    } finally {
      errorSpy.mockRestore();
    }
  });

  it('abre ligado para quem já aceitou antes', async () => {
    push.getOptIn.mockResolvedValue(true);
    await renderRow();

    await waitFor(() =>
      expect(screen.getByRole('switch', { name: 'Lembrete diário' }).props.value).toBe(true),
    );
  });

  it('ligar registra o aceite, pede a permissão e agenda já', async () => {
    await renderRow();

    fireEvent(screen.getByRole('switch', { name: 'Lembrete diário' }), 'valueChange', true);

    await waitFor(() =>
      expect(screen.getByRole('switch', { name: 'Lembrete diário' }).props.value).toBe(true),
    );
    expect(push.setOptIn).toHaveBeenCalledWith(true);
    expect(push.requestPermissionIfNeeded).toHaveBeenCalledTimes(1);
    expect(push.scheduleDailyIfEligible).toHaveBeenCalledWith({ reason: 'optin_immediate' });
  });

  it('com a permissão negada, o interruptor volta a desligado sem erro e sem agendar', async () => {
    push.requestPermissionIfNeeded.mockResolvedValue('denied');
    await renderRow();

    fireEvent(screen.getByRole('switch', { name: 'Lembrete diário' }), 'valueChange', true);

    await waitFor(() => expect(push.requestPermissionIfNeeded).toHaveBeenCalled());
    await waitFor(() =>
      expect(screen.getByRole('switch', { name: 'Lembrete diário' }).props.value).toBe(false),
    );
    expect(push.scheduleDailyIfEligible).not.toHaveBeenCalled();
    expect(push.setOptIn).toHaveBeenLastCalledWith(false);
  });

  it('se o serviço lançar ao ligar, o interruptor volta a desligado', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    push.requestPermissionIfNeeded.mockRejectedValue(new Error('sem módulo'));
    try {
      await renderRow();

      fireEvent(screen.getByRole('switch', { name: 'Lembrete diário' }), 'valueChange', true);

      await waitFor(() => expect(errorSpy).toHaveBeenCalled());
      expect(screen.getByRole('switch', { name: 'Lembrete diário' }).props.value).toBe(false);
    } finally {
      errorSpy.mockRestore();
    }
  });

  it('desligar registra a recusa', async () => {
    push.getOptIn.mockResolvedValue(true);
    await renderRow();
    await waitFor(() =>
      expect(screen.getByRole('switch', { name: 'Lembrete diário' }).props.value).toBe(true),
    );

    fireEvent(screen.getByRole('switch', { name: 'Lembrete diário' }), 'valueChange', false);

    await waitFor(() => expect(push.setOptIn).toHaveBeenCalledWith(false));
    expect(screen.getByRole('switch', { name: 'Lembrete diário' }).props.value).toBe(false);
  });
});
