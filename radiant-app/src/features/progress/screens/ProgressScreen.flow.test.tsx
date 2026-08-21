import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import ProgressScreen from './ProgressScreen';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { AuthService } from '../../auth/AuthService';
import { SyncQueueService } from '../../sync/SyncQueueService';
import { ApiError, apiRequest, isApiConfigured } from '../../../lib/api';
import { LearningAttemptsRepository } from '../services/LearningAttemptsRepository';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';
import { AppConfig } from '../../../config';

jest.mock('expo-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
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

jest.mock('../services/LearningAttemptsRepository', () => ({
  LearningAttemptsRepository: { getAll: jest.fn() },
}));

jest.mock('../../journey/services/JourneyProgressService', () => ({
  JourneyProgressService: { getSnapshot: jest.fn() },
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
const mockedLearningAttempts = LearningAttemptsRepository as jest.Mocked<typeof LearningAttemptsRepository>;
const mockedJourneyProgress = JourneyProgressService as jest.Mocked<typeof JourneyProgressService>;
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
    // clearAllMocks zera chamadas, não implementações. Reafirmar o default aqui
    // impede que um teste que grava tentativas vaze para os seguintes.
    mockedLearningAttempts.getAll.mockResolvedValue([]);
    mockedJourneyProgress.getSnapshot.mockResolvedValue({
      track: { id: 'track-1', title: 'Trilha', initialUnitId: 'unit-1', units: [{ id: 'unit-1', title: 'Fundamentos', nodes: [] }] },
    } as never);
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

  it('não expõe nenhum controle de console de desenvolvimento', async () => {
    // A separação vem antes da agregação (ADR-2026-08-15): esta tela é agregada
    // ao Perfil do aluno, e o console — flags de build, health de API, reset de
    // estado local — mudou para `/dev-console`, atrás de `SHOW_DEV_TOOLS`. Os
    // mocks deste arquivo ligam `SHOW_DEV_TOOLS`, então se algum bloco voltar,
    // este teste o vê.
    renderWithProviders(<ProgressScreen />);

    await screen.findByText('Conta e sincronização');

    expect(screen.queryByText('Catálogo local')).toBeNull();
    expect(screen.queryByText('Homologação iOS V2')).toBeNull();
    expect(screen.queryByText('Testar API')).toBeNull();
    expect(screen.queryByText('Health API')).toBeNull();
    expect(screen.queryByText('Abrir Telemetry Debug')).toBeNull();
    expect(screen.queryByText('Ver requisitos do sync remoto')).toBeNull();
    expect(screen.queryByText('Resetar estado local da V2')).toBeNull();
  });

  it('shows only persisted gamification and honest empty learning metrics', async () => {
    renderWithProviders(<ProgressScreen />);

    expect(await screen.findByText('3 dias')).toBeTruthy();
    expect(screen.getByLabelText('Sem tentativas avaliadas ainda.')).toBeTruthy();
    expect(screen.getByText('Ainda não há evidência suficiente para indicar domínio por tópico.')).toBeTruthy();
    expect(screen.queryByText('84%')).toBeNull();
    expect(screen.queryByText('Lv 7 · Resident')).toBeNull();
  });

  it('mostra precisão e domínio por tópico quando há tentativas gravadas', async () => {
    // Este é o defeito de 2026-07-30: a tela exibia XP acumulado ao lado de
    // "sem tentativas avaliadas", porque os dois cards eram hardcoded.
    mockedLearningAttempts.getAll.mockResolvedValue([
      { lessonId: 'lesson-1', topicId: 'unit-1', correctAnswers: 1, totalQuestions: 1, completedAt: '2026-07-30T12:00:00.000Z' },
      { lessonId: 'lesson-2', topicId: 'unit-1', correctAnswers: 0, totalQuestions: 1, completedAt: '2026-07-30T12:05:00.000Z' },
    ]);

    renderWithProviders(<ProgressScreen />);

    expect(await screen.findByText('50%')).toBeTruthy();
    expect(screen.queryByLabelText('Sem tentativas avaliadas ainda.')).toBeNull();
    // O rótulo vem do título da unidade na trilha, não do id cru.
    expect(screen.getByText('Fundamentos')).toBeTruthy();
    expect(screen.queryByText('Ainda não há evidência suficiente para indicar domínio por tópico.')).toBeNull();
  });

  it('mantém XP e sequência quando a leitura de tentativas falha', async () => {
    // Acurácia é secundária: a falha dela não pode zerar o que já carregou.
    mockedLearningAttempts.getAll.mockRejectedValue(new Error('storage indisponível'));
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    renderWithProviders(<ProgressScreen />);

    expect(await screen.findByText('3 dias')).toBeTruthy();
    expect(screen.getByLabelText('Sem tentativas avaliadas ainda.')).toBeTruthy();

    errorSpy.mockRestore();
  });

  // As duas afirmações de honestidade do painel de homologação — sync remoto e
  // beta gate — seguiram o painel para
  // `src/features/dev-console/screens/DevConsoleScreen.flow.test.tsx`.

  it('keeps legal help available in the progress screen', async () => {
    renderWithProviders(<ProgressScreen />);

    expect(await screen.findByText('Ajuda e informações')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Política de Privacidade' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Central de Suporte' })).toBeTruthy();
  });
});
