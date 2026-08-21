import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import DevConsoleScreen from './DevConsoleScreen';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { ApiError, apiRequest, isApiConfigured } from '../../../lib/api';
import { AppConfig } from '../../../config';

jest.mock('expo-router', () => ({
  router: { replace: jest.fn(), push: jest.fn() },
}));

jest.mock('../../content/services/LessonCatalogService', () => ({
  LessonCatalogService: {
    bootstrap: jest.fn().mockResolvedValue(undefined),
    listTracks: jest.fn(() => [{ id: 'track-1', title: 'Radiologia' }]),
    getCatalogVersion: jest.fn(() => 'local-v1'),
    getCatalogSourceLabel: jest.fn(() => 'local'),
    getInitialLesson: jest.fn(() => ({ id: 'lesson-1', title: 'Tórax I' })),
  },
}));

jest.mock('../../sync/SyncQueueService', () => ({
  SyncQueueService: {
    getSummary: jest.fn().mockResolvedValue({ pending: 1, retrying: 0, lastError: null }),
  },
}));

jest.mock('../../progress/services/IosHomologationService', () => ({
  IosHomologationService: { resetLocalState: jest.fn().mockResolvedValue(undefined) },
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

const mockedApiRequest = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('DevConsoleScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (isApiConfigured as jest.Mock).mockReturnValue(true);
    AppConfig.ENABLE_BETA_GATE = false;
  });

  it('reúne os painéis de diagnóstico que saíram da tela do aluno', async () => {
    renderWithProviders(<DevConsoleScreen />);

    expect(await screen.findByText('Catálogo local')).toBeTruthy();
    expect(screen.getByText('Homologação iOS V2')).toBeTruthy();
    expect(screen.getByText('API e fila de sync')).toBeTruthy();
    expect(screen.getByText('Abrir Telemetry Debug')).toBeTruthy();
  });

  it('surfaces DNS/network API health failures with an actionable label', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    mockedApiRequest.mockRejectedValue(new ApiError('Could not resolve host', 0, 'network'));

    try {
      renderWithProviders(<DevConsoleScreen />);

      await screen.findByText('API e fila de sync');

      fireEvent.press(screen.getByText('Testar API'));

      await waitFor(() => {
        expect(mockedApiRequest).toHaveBeenCalledWith('/health');
      });

      expect(await screen.findByText('falha de rede ou DNS')).toBeTruthy();
      expect(await screen.findByText('Falha ao consultar /health da API.')).toBeTruthy();
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });

  it('does not report remote sync as active when no API is configured', async () => {
    // A flag ligada sozinha não habilita sync: SyncQueueService também exige
    // isApiConfigured(). O painel de homologação existe para registrar o que a
    // build faz, então anunciar "ativado" quando nada sincroniza torna a
    // evidência de homologação falsa.
    (isApiConfigured as jest.Mock).mockReturnValue(false);

    renderWithProviders(<DevConsoleScreen />);

    await screen.findByText('Homologação iOS V2');
    expect(screen.queryByText('ativado')).toBeNull();
    expect(screen.getByText('ligado, sem API configurada')).toBeTruthy();
  });

  it('does not report the beta gate as active while dev tools bypass it', async () => {
    // O gate aplicado é `ENABLE_BETA_GATE && !SHOW_DEV_TOOLS` (`_layout.tsx`), e
    // este painel só renderiza sob `SHOW_DEV_TOOLS` — então, no único contexto em
    // que a linha é visível, o gate está sempre bypassado. Ler a flag crua fazia
    // o painel anunciar "ativo" justamente para quem foi ali buscar evidência.
    AppConfig.ENABLE_BETA_GATE = true;

    try {
      renderWithProviders(<DevConsoleScreen />);

      await screen.findByText('Homologação iOS V2');
      expect(screen.queryByText('ativo')).toBeNull();
      expect(screen.getByText('ligado, bypass por dev tools')).toBeTruthy();
    } finally {
      AppConfig.ENABLE_BETA_GATE = false;
    }
  });
});
