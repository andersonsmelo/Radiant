jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import SettingsScreen from './SettingsScreen';
import { AppConfig } from '../../../config';

jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

jest.mock('../../../ui/feedback/feedbackPreferences', () => ({
  DEFAULT_FEEDBACK_PREFERENCES: { sounds: true, haptics: true },
  readFeedbackPreferences: jest.fn().mockResolvedValue({ sounds: true, haptics: true }),
  writeFeedbackPreferences: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('expo-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
  router: { push: jest.fn(), back: jest.fn() },
  useFocusEffect: (callback: () => void) => {
    const React = require('react');
    React.useEffect(() => {
      callback();
    }, [callback]);
  },
}));
const mockedRouter = jest.requireMock('expo-router').router as { push: jest.Mock; back: jest.Mock };

jest.mock('../../../config', () => ({
  AppConfig: { SHOW_DEV_TOOLS: false, ENABLE_REMOTE_SYNC: false },
}));

jest.mock('../../subscription/SubscriptionService', () => ({
  subscriptionService: { getStatus: jest.fn().mockResolvedValue({ kind: 'none' }) },
}));
const mockedSubscription = jest.requireMock('../../subscription/SubscriptionService').subscriptionService as {
  getStatus: jest.Mock;
};

jest.mock('../../progress-sync/ProgressSyncService', () => ({
  progressSyncService: {
    getState: jest.fn().mockResolvedValue({ enabled: false, lastBackupAt: null, lastError: null }),
    setEnabled: jest.fn().mockResolvedValue({ enabled: true, lastBackupAt: null, lastError: 'cloud-unavailable' }),
  },
}));
const mockedProgressSync = jest.requireMock('../../progress-sync/ProgressSyncService').progressSyncService as {
  getState: jest.Mock;
  setEnabled: jest.Mock;
};

// O cartão de conta tem suíte própria (`AccountSyncCard.test.tsx`), que cobre
// login, reset e a ausência em produção. Aqui basta saber que ele mora nesta tela.
jest.mock('../../progress/components/AccountSyncCard', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return { AccountSyncCard: () => <Text>cartão de conta e sincronização</Text> };
});

jest.mock('../../first-run/screens/WelcomeFlowScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return { __esModule: true, default: () => <Text>apresentação do Pixel</Text> };
});

jest.mock('../../../ui/components/StarfieldBackground', () => ({
  StarfieldBackground: () => null,
}));

describe('SettingsScreen — a configuração que saiu do Perfil', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AppConfig.SHOW_DEV_TOOLS = false;
    mockedSubscription.getStatus.mockResolvedValue({ kind: 'none' });
    mockedProgressSync.getState.mockResolvedValue({ enabled: false, lastBackupAt: null, lastError: null });
  });

  it('chama-se Configuração e volta ao Perfil', () => {
    render(<SettingsScreen />);

    expect(screen.getByRole('header', { name: 'Configuração' })).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Voltar ao Perfil' }));

    expect(mockedRouter.back).toHaveBeenCalledTimes(1);
  });

  it('reúne assinatura, backup, sons e vibração, conta e ajuda', async () => {
    render(<SettingsScreen />);

    expect(await screen.findByText('Vidas ilimitadas — e só isso.')).toBeTruthy();
    expect(await screen.findByText('Backup no iCloud')).toBeTruthy();
    expect(screen.getByText('Sons e vibração')).toBeTruthy();
    expect(screen.getByLabelText('Sons')).toBeTruthy();
    expect(screen.getByLabelText('Vibração')).toBeTruthy();
    expect(screen.getByText('cartão de conta e sincronização')).toBeTruthy();
    expect(screen.getByText('Ajuda e informações')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Política de Privacidade' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Central de Suporte' })).toBeTruthy();
  });

  it('Rever apresentação abre a apresentação', () => {
    render(<SettingsScreen />);

    fireEvent.press(screen.getByRole('button', { name: 'Rever apresentação' }));

    expect(screen.getByText('apresentação do Pixel')).toBeTruthy();
  });

  it('o cartão de assinatura abre a tela de assinatura', async () => {
    render(<SettingsScreen />);

    fireEvent.press(await screen.findByRole('button', { name: 'Conhecer' }));

    expect(mockedRouter.push).toHaveBeenCalledWith('/subscription');
  });

  it('assinante vê a renovação e expirado vê renovar', async () => {
    mockedSubscription.getStatus.mockResolvedValue({ kind: 'unlimited', expiresAt: '2026-10-14T12:00:00.000Z', willRenew: true });
    const { unmount } = render(<SettingsScreen />);
    expect(await screen.findByText('Renova em 14/10/2026')).toBeTruthy();
    unmount();

    mockedSubscription.getStatus.mockResolvedValue({ kind: 'expired', expiredAt: '2026-09-01T12:00:00.000Z' });
    render(<SettingsScreen />);
    expect(await screen.findByRole('button', { name: 'Renovar' })).toBeTruthy();
  });

  it('ligar o backup passa pelo serviço e mostra o estado devolvido, com erro que informa sem bloquear', async () => {
    render(<SettingsScreen />);
    const interruptor = await screen.findByLabelText('Backup no iCloud');

    fireEvent(interruptor, 'valueChange', true);

    await waitFor(() => expect(mockedProgressSync.setEnabled).toHaveBeenCalledWith(true, expect.any(Number)));
    expect(await screen.findByText(/ainda não está disponível nesta versão/u)).toBeTruthy();
    expect(screen.getByLabelText('Backup no iCloud').props.value).toBe(true);
  });

  it('backup ativo mostra a data do último backup', async () => {
    mockedProgressSync.getState.mockResolvedValue({ enabled: true, lastBackupAt: '2026-09-14T12:00:00.000Z', lastError: null });
    render(<SettingsScreen />);

    expect(await screen.findByText(/Último backup em 14\/09\/2026/u)).toBeTruthy();
  });

  describe('a porta do console de desenvolvimento', () => {
    afterEach(() => {
      AppConfig.SHOW_DEV_TOOLS = false;
    });

    it('aparece quando as ferramentas de desenvolvimento estão ligadas', () => {
      AppConfig.SHOW_DEV_TOOLS = true;
      render(<SettingsScreen />);

      fireEvent.press(screen.getByRole('button', { name: 'Abrir o console de desenvolvimento' }));

      expect(mockedRouter.push).toHaveBeenCalledWith('/dev-console');
    });

    it('não existe no build do aluno', () => {
      render(<SettingsScreen />);

      expect(screen.queryByText('Console de desenvolvimento')).toBeNull();
      expect(screen.queryByText(/desenvolvimento/iu)).toBeNull();
    });
  });
});
