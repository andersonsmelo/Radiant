jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import ProfileScreen from './ProfileScreen';
import { AppConfig } from '../../../config';

jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

jest.mock('../../../ui/feedback/feedbackPreferences', () => ({
  DEFAULT_FEEDBACK_PREFERENCES: { sounds: true, haptics: true },
  readFeedbackPreferences: jest.fn().mockResolvedValue({ sounds: true, haptics: true }),
  writeFeedbackPreferences: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
  useFocusEffect: (callback: () => void) => {
    const React = require('react');
    React.useEffect(() => {
      callback();
    }, [callback]);
  },
}));
const mockedRouter = jest.requireMock('expo-router').router as { push: jest.Mock };

jest.mock('../../../config', () => ({
  AppConfig: { SHOW_DEV_TOOLS: true, ENABLE_REMOTE_SYNC: false },
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

jest.mock('../../gamification/services/GamificationService', () => ({
  GamificationService: {
    getSnapshot: jest.fn().mockResolvedValue({ totalXp: 72, streakDays: 1 }),
  },
}));

jest.mock('../../missions/screens/MissionsScreen', () => {
  const React = require('react');
  const { Text, View } = require('react-native');
  return {
    __esModule: true,
    default: ({ embedded }: { embedded?: boolean }) => (
      <View testID="missions-section">
        <Text>{embedded ? 'missões embutidas' : 'missões com rolagem própria'}</Text>
      </View>
    ),
  };
});

jest.mock('../../progress/screens/ProgressScreen', () => {
  const React = require('react');
  const { Text, View } = require('react-native');
  return {
    __esModule: true,
    default: ({ embedded }: { embedded?: boolean }) => (
      <View testID="progress-section">
        <Text>{embedded ? 'progresso embutido' : 'progresso com rolagem própria'}</Text>
      </View>
    ),
  };
});

jest.mock('../components/ProfileIdentityHeader', () => {
  const React = require('react');
  const { Text, View } = require('react-native');
  return {
    ProfileIdentityHeader: () => (
      <View testID="profile-identity-header">
        <Text>identidade</Text>
      </View>
    ),
  };
});

describe('ProfileScreen — uma aba só, com identidade, missões e progresso', () => {
  it('agrega a identidade, as missões e o progresso, nessa ordem', () => {
    render(<ProfileScreen />);

    expect(screen.getByTestId('profile-identity-header')).toBeTruthy();
    expect(screen.getByTestId('missions-section')).toBeTruthy();
    expect(screen.getByTestId('progress-section')).toBeTruthy();
  });

  it('embute as duas telas, para que exista UMA rolagem na aba', () => {
    // Duas `ScrollView` aninhadas na vertical brigam pelo gesto: a de dentro
    // consome o arrasto e a de fora trava, e o aluno não alcança o que está
    // embaixo. Quem rola é o Perfil, e as telas agregadas entram sem wrapper.
    render(<ProfileScreen />);

    expect(screen.getByText('missões embutidas')).toBeTruthy();
    expect(screen.getByText('progresso embutido')).toBeTruthy();
  });

  it('reserva a folga da tab bar flutuante no contêiner de rolagem', () => {
    // A barra é cartão flutuante e cobre o fim do conteúdo. Este caso é o par
    // em runtime do contrato estático `tab-bar-clearance`.
    const { UNSAFE_getByType } = render(<ProfileScreen />);
    const { ScrollView } = require('react-native');

    const style = UNSAFE_getByType(ScrollView).props.contentContainerStyle;
    const flat = Array.isArray(style) ? Object.assign({}, ...style) : style;

    expect(flat.paddingBottom).toBeGreaterThan(0);
  });

  it('não expõe nenhum controle de console de desenvolvimento', () => {
    // O console saiu para rota própria atrás de SHOW_DEV_TOOLS. Ele nunca pode
    // reaparecer no perfil do aluno — foi por isso que a separação veio antes
    // da agregação.
    render(<ProfileScreen />);

    for (const proibido of [/Learning Road/u, /Beta Gate/u, /Telemetry Debug/u, /Catálogo local/u]) {
      expect(screen.queryByText(proibido)).toBeNull();
    }
  });
});

describe('ProfileScreen — a porta do console de desenvolvimento', () => {
  // O console saiu da ProgressScreen para rota própria no sub-projeto 2, o que
  // destravou a aba Perfil — mas ninguém criou porta de entrada. Ele ficou
  // alcançável só por deep link, e o checklist de release registra que a
  // homologação em aparelho depende dessa tela. Medido em 2026-08-21.
  afterEach(() => {
    AppConfig.SHOW_DEV_TOOLS = true;
  });

  it('oferece a entrada quando as ferramentas de desenvolvimento estão ligadas', () => {
    AppConfig.SHOW_DEV_TOOLS = true;
    render(<ProfileScreen />);

    expect(screen.getByText('Console de desenvolvimento')).toBeTruthy();
    expect(screen.getByText('Sons e vibração')).toBeTruthy();
  });

  it('não mostra nada disso no build do aluno', () => {
    // `SHOW_DEV_TOOLS` é `__DEV__ || EXPO_PUBLIC_ENABLE_DEV_TOOLS`, então em
    // release sem a flag a porta simplesmente não existe — e não é só um botão
    // desabilitado, que ainda contaria uma história ao aluno.
    AppConfig.SHOW_DEV_TOOLS = false;
    render(<ProfileScreen />);

    expect(screen.queryByText('Console de desenvolvimento')).toBeNull();
    expect(screen.queryByText(/desenvolvimento/iu)).toBeNull();
    // Os sons só existem no piloto: o aluno não vê interruptor de algo que nunca ouve.
    expect(screen.queryByText('Sons e vibração')).toBeNull();
  });
});

describe('ProfileScreen — assinatura e backup na configuração de produção', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AppConfig.SHOW_DEV_TOOLS = false;
    mockedSubscription.getStatus.mockResolvedValue({ kind: 'none' });
    mockedProgressSync.getState.mockResolvedValue({ enabled: false, lastBackupAt: null, lastError: null });
  });

  afterEach(() => {
    AppConfig.SHOW_DEV_TOOLS = true;
  });

  it('mostra os cartões de assinatura e de backup, e nada de login, e-mail, token, API, sync ou backend', async () => {
    render(<ProfileScreen />);

    expect(await screen.findByText('Vidas ilimitadas — e só isso.')).toBeTruthy();
    expect(await screen.findByText('Backup no iCloud')).toBeTruthy();
    expect(screen.getByText('Nenhum backup ainda')).toBeTruthy();

    for (const proibido of [/login/iu, /e-?mail/iu, /senha/iu, /token/iu, /\bAPI\b/u, /sync/iu, /backend/iu, /servidor/iu]) {
      expect(screen.queryByText(proibido)).toBeNull();
    }
  });

  it('o cartão de assinatura abre a tela de assinatura', async () => {
    render(<ProfileScreen />);

    fireEvent.press(await screen.findByRole('button', { name: 'Conhecer' }));

    expect(mockedRouter.push).toHaveBeenCalledWith('/subscription');
  });

  it('assinante vê a renovação e expirado vê renovar', async () => {
    mockedSubscription.getStatus.mockResolvedValue({ kind: 'unlimited', expiresAt: '2026-10-14T12:00:00.000Z', willRenew: true });
    const { unmount } = render(<ProfileScreen />);
    expect(await screen.findByText('Renova em 14/10/2026')).toBeTruthy();
    unmount();

    mockedSubscription.getStatus.mockResolvedValue({ kind: 'expired', expiredAt: '2026-09-01T12:00:00.000Z' });
    render(<ProfileScreen />);
    expect(await screen.findByRole('button', { name: 'Renovar' })).toBeTruthy();
  });

  it('ligar o backup passa pelo serviço e mostra o estado devolvido, com erro que informa sem bloquear', async () => {
    render(<ProfileScreen />);
    const interruptor = await screen.findByLabelText('Backup no iCloud');

    fireEvent(interruptor, 'valueChange', true);

    await waitFor(() => expect(mockedProgressSync.setEnabled).toHaveBeenCalledWith(true, expect.any(Number)));
    expect(await screen.findByText(/ainda não está disponível nesta versão/u)).toBeTruthy();
    expect(screen.getByLabelText('Backup no iCloud').props.value).toBe(true);
  });

  it('backup ativo mostra a data do último backup', async () => {
    mockedProgressSync.getState.mockResolvedValue({ enabled: true, lastBackupAt: '2026-09-14T12:00:00.000Z', lastError: null });
    render(<ProfileScreen />);

    expect(await screen.findByText(/Último backup em 14\/09\/2026/u)).toBeTruthy();
  });
});
