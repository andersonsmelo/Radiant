import React from 'react';
import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { AccountSyncCard } from './AccountSyncCard';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { AuthService } from '../../auth/AuthService';
import { SyncQueueService } from '../../sync/SyncQueueService';
import { isApiConfigured } from '../../../lib/api';
import { AppConfig } from '../../../config';

// Estes casos moravam em `ProgressScreen.flow.test.tsx` até 2026-10-16, quando o
// cartão saiu do Progresso para a tela Configuração.

jest.mock('expo-router', () => ({
  useFocusEffect: (callback: () => void) => {
    const React = require('react');
    React.useEffect(() => {
      callback();
    }, [callback]);
  },
}));

jest.mock('../../auth/AuthService', () => ({
  AuthService: {
    bootstrap: jest.fn().mockResolvedValue(null),
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn().mockResolvedValue(undefined),
    hasAuthenticatedSession: jest.fn(() => false),
    hydrateUser: jest.fn().mockResolvedValue(null),
    requestPasswordReset: jest.fn(),
    confirmPasswordReset: jest.fn(),
  },
}));

jest.mock('../../sync/SyncQueueService', () => ({
  SyncQueueService: {
    getSummary: jest.fn().mockResolvedValue({ pending: 1, retrying: 0, lastError: null }),
    flush: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('../../../config', () => ({
  AppConfig: { ENABLE_REMOTE_SYNC: true },
}));

jest.mock('../../../lib/api', () => ({
  isApiConfigured: jest.fn(() => true),
}));

const mockedAuthService = AuthService as jest.Mocked<typeof AuthService>;
const mockedSyncQueueService = SyncQueueService as jest.Mocked<typeof SyncQueueService>;

describe('AccountSyncCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAuthService.bootstrap.mockResolvedValue(null);
    mockedSyncQueueService.getSummary.mockResolvedValue({
      pending: 1,
      retrying: 0,
      lastError: null,
      oldestPendingAt: null,
    });
  });

  it('allows login and flushes the sync queue', async () => {
    mockedAuthService.login.mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      expiresAt: '2026-04-03T00:00:00.000Z',
      user: {
        id: 'user-1',
        email: 'user@example.com',
      },
    });

    renderWithProviders(<AccountSyncCard />);

    await screen.findByText('Conta e sincronização');

    fireEvent.changeText(screen.getByPlaceholderText('Email'), 'USER@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Senha ou nova senha'), 'password123');
    fireEvent.press(screen.getByText('Entrar para sincronizar'));

    await waitFor(() => {
      expect(mockedAuthService.login).toHaveBeenCalledWith('user@example.com', 'password123');
    });

    await waitFor(() => {
      expect(mockedSyncQueueService.flush).toHaveBeenCalled();
    });

    expect(await screen.findByText('Sessão autenticada e fila sincronizada.')).toBeTruthy();
    expect(await screen.findByText('user@example.com')).toBeTruthy();
  });

  it('requests a password reset and surfaces the homologation token', async () => {
    mockedAuthService.requestPasswordReset.mockResolvedValue({
      accepted: true,
      resetToken: 'reset-token-1234567890',
    });

    renderWithProviders(<AccountSyncCard />);

    await screen.findByText('Conta e sincronização');

    fireEvent.changeText(screen.getByPlaceholderText('Email'), 'user@example.com');
    fireEvent.press(screen.getByText('Solicitar reset de senha'));

    await waitFor(() => {
      expect(mockedAuthService.requestPasswordReset).toHaveBeenCalledWith('user@example.com');
    });

    expect(
      await screen.findByText('Reset solicitado. Token de homologação disponível: reset-token-1234567890')
    ).toBeTruthy();
  });

  // A configuração de produção, com sync remoto e API desligados. Foi assim que
  // o build 1.3.1 (10) chegou ao aparelho com um formulário de login inerte no
  // Perfil: `remoteSyncAvailable` só travava os handlers, não a renderização.
  describe('sem sync remoto disponível (configuração de produção)', () => {
    const isApiConfiguredMock = isApiConfigured as jest.MockedFunction<typeof isApiConfigured>;

    beforeEach(() => {
      isApiConfiguredMock.mockReturnValue(false);
      (AppConfig as { ENABLE_REMOTE_SYNC: boolean }).ENABLE_REMOTE_SYNC = false;
    });

    afterEach(() => {
      isApiConfiguredMock.mockReturnValue(true);
      (AppConfig as { ENABLE_REMOTE_SYNC: boolean }).ENABLE_REMOTE_SYNC = true;
    });

    it('não renderiza nenhum controle de conta, login ou sincronização', async () => {
      renderWithProviders(<AccountSyncCard />);
      await act(async () => {});

      expect(screen.queryByText('Conta e sincronização')).toBeNull();
      expect(screen.queryByPlaceholderText('Email')).toBeNull();
      expect(screen.queryByPlaceholderText('Senha ou nova senha')).toBeNull();
      expect(screen.queryByText('Entrar para sincronizar')).toBeNull();
      expect(screen.queryByText('Criar conta')).toBeNull();
      expect(screen.queryByText('Solicitar reset de senha')).toBeNull();
    });
  });
});
