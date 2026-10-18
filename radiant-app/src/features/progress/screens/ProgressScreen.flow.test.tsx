import React from 'react';
import { screen } from '@testing-library/react-native';
import ProgressScreen from './ProgressScreen';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { AuthService } from '../../auth/AuthService';
import { SyncQueueService } from '../../sync/SyncQueueService';
import { LearningAttemptsRepository } from '../services/LearningAttemptsRepository';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';

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

  it('não expõe nenhum controle de console de desenvolvimento', async () => {
    // A separação vem antes da agregação (ADR-2026-08-15): esta tela é agregada
    // ao Perfil do aluno, e o console — flags de build, health de API, reset de
    // estado local — mudou para `/dev-console`, atrás de `SHOW_DEV_TOOLS`. Os
    // mocks deste arquivo ligam `SHOW_DEV_TOOLS`, então se algum bloco voltar,
    // este teste o vê.
    renderWithProviders(<ProgressScreen />);

    await screen.findByText('3 dias');

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

  it('não carrega configuração: conta, ajuda e apresentação moram na tela Configuração', async () => {
    // Desde 2026-10-16 (FILA 32) o Perfil, que embute esta tela, guarda só
    // identidade, missões e progresso. Esta suíte roda com sync remoto ligado,
    // o caso em que o cartão de conta apareceria se tivesse ficado aqui.
    renderWithProviders(<ProgressScreen />);

    expect(await screen.findByText('3 dias')).toBeTruthy();
    expect(screen.queryByText('Conta e sincronização')).toBeNull();
    expect(screen.queryByPlaceholderText('Email')).toBeNull();
    expect(screen.queryByText('Ajuda e informações')).toBeNull();
    expect(screen.queryByRole('link', { name: 'Política de Privacidade' })).toBeNull();
    expect(screen.queryByText('Rever apresentação')).toBeNull();
  });
});
