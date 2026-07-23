import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import ProgressScreen from './ProgressScreen';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { AuthService } from '../../auth/AuthService';
import { SyncQueueService } from '../../sync/SyncQueueService';
import { ApiError, apiRequest } from '../../../lib/api';

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  },
  useFocusEffect: (callback: () => void) => {
    const React = require('react');
    React.useEffect(() => {
      callback();
    }, [callback]);
  },
}));

jest.mock('../../../ui/components/StarfieldBackground', () => ({
  StarfieldBackground: () => null,
}));

jest.mock('../../../ui/components/HUD', () => ({
  HUD: () => null,
}));

jest.mock('../../content/services/LessonCatalogService', () => ({
  LessonCatalogService: {
    bootstrap: jest.fn().mockResolvedValue(undefined),
    listLessons: jest.fn(() => [{ id: 'lesson-1', title: 'Tórax I' }]),
    listTracks: jest.fn(() => [{ id: 'track-1', title: 'Radiologia' }]),
    getCatalogVersion: jest.fn(() => 'local-v1'),
    getCatalogSourceLabel: jest.fn(() => 'local'),
    getInitialLesson: jest.fn(() => ({ id: 'lesson-1', title: 'Tórax I' })),
  },
}));

jest.mock('../../gamification/services/GamificationService', () => ({
  GamificationService: {
    getSnapshot: jest.fn().mockResolvedValue({
      totalXp: 120,
      streakDays: 3,
      lastActiveDate: '2026-04-02',
      hearts: 5,
      maxHearts: 5,
    }),
  },
}));

jest.mock('../../spaced-repetition/services/SpacedRepetitionService', () => ({
  SpacedRepetitionService: {
    getDueCount: jest.fn().mockResolvedValue(2),
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
    getSummary: jest.fn().mockResolvedValue({
      pending: 1,
      retrying: 0,
      lastError: null,
    }),
    flush: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('../services/IosHomologationService', () => ({
  IosHomologationService: {
    resetLocalState: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('../../../config', () => ({
  AppConfig: {
    ENABLE_REMOTE_SYNC: true,
    SHOW_DEV_TOOLS: true,
    ENABLE_LEARNING_ROAD: true,
    ENABLE_BETA_GATE: false,
    ENABLE_TELEMETRY_DEBUG_SCREEN: false,
    API_BASE_URL: 'https://api.radiant.ascendcreative.com.br',
  },
}));

jest.mock('../../../lib/api', () => ({
  ApiError: class ApiError extends Error {
    status: number;
    code: string;

    constructor(message: string, status: number, code = 'unknown') {
      super(message);
      this.name = 'ApiError';
      this.status = status;
      this.code = code;
    }
  },
  apiRequest: jest.fn(),
  isApiConfigured: jest.fn(() => true),
}));

jest.mock('../../telemetry/TelemetryService', () => ({
  TelemetryService: {
    track: jest.fn().mockResolvedValue(undefined),
  },
}));

const mockedAuthService = AuthService as jest.Mocked<typeof AuthService>;
const mockedSyncQueueService = SyncQueueService as jest.Mocked<typeof SyncQueueService>;
const mockedApiRequest = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('ProgressScreen flow', () => {
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

    renderWithProviders(<ProgressScreen />);

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

    renderWithProviders(<ProgressScreen />);

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

  it('surfaces DNS/network API health failures with an actionable label', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    mockedApiRequest.mockRejectedValue(new ApiError('Could not resolve host', 0, 'network'));

    try {
      renderWithProviders(<ProgressScreen />);

      await screen.findByText('Conta e sincronização');

      fireEvent.press(screen.getAllByText('Testar API')[0]);

      await waitFor(() => {
        expect(mockedApiRequest).toHaveBeenCalledWith('/health');
      });

      expect(await screen.findByText('falha de rede ou DNS')).toBeTruthy();
      expect(await screen.findByText('Falha ao consultar /health da API.')).toBeTruthy();
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });

  it('shows only persisted gamification and honest empty learning metrics', async () => {
    renderWithProviders(<ProgressScreen />);

    expect(await screen.findByText('🔥 3 dias')).toBeTruthy();
    expect(screen.getByLabelText('Sem tentativas avaliadas ainda.')).toBeTruthy();
    expect(screen.getByText('Ainda não há evidência suficiente para indicar domínio por tópico.')).toBeTruthy();
    expect(screen.queryByText('84%')).toBeNull();
    expect(screen.queryByText('Lv 7 · Resident')).toBeNull();
  });
});
