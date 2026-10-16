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
  const { Pressable, Text, View } = require('react-native');
  return {
    ProfileIdentityHeader: ({ onOpenSettings }: { onOpenSettings?: () => void }) => (
      <View testID="profile-identity-header">
        <Text>identidade</Text>
        {onOpenSettings ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Configuração" onPress={onOpenSettings} />
        ) : null}
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

// Desde 2026-10-16 (FILA 32, decisão do dono): assinatura, backup, sons e
// vibração, conta, ajuda e a porta do console moram na tela Configuração, que a
// engrenagem do cabeçalho abre. O Perfil guarda identidade, missões e progresso.
describe('ProfileScreen — a configuração mora atrás da engrenagem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AppConfig.SHOW_DEV_TOOLS = true;
  });

  it('a engrenagem do cabeçalho abre a tela Configuração', () => {
    render(<ProfileScreen />);

    fireEvent.press(screen.getByRole('button', { name: 'Configuração' }));

    expect(mockedRouter.push).toHaveBeenCalledWith('/settings');
  });

  it('não mostra assinatura, backup, sons e vibração nem a porta do console', async () => {
    // Com SHOW_DEV_TOOLS ligado, o caso em que a porta do console apareceria.
    render(<ProfileScreen />);
    await waitFor(() => expect(screen.getByTestId('progress-section')).toBeTruthy());

    expect(screen.queryByText('Vidas ilimitadas — e só isso.')).toBeNull();
    expect(screen.queryByText('Backup no iCloud')).toBeNull();
    expect(screen.queryByText('Sons e vibração')).toBeNull();
    expect(screen.queryByText('Console de desenvolvimento')).toBeNull();
  });

  it('não lê assinatura, backup nem preferências: quem lê é a Configuração', () => {
    render(<ProfileScreen />);

    expect(mockedSubscription.getStatus).not.toHaveBeenCalled();
    expect(mockedProgressSync.getState).not.toHaveBeenCalled();
    expect(jest.requireMock('../../../ui/feedback/feedbackPreferences').readFeedbackPreferences).not.toHaveBeenCalled();
  });
});
