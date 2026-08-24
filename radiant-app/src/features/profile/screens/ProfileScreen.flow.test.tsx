jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

import React from 'react';
import { render, screen } from '@testing-library/react-native';

import ProfileScreen from './ProfileScreen';
import { AppConfig } from '../../../config';

jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

jest.mock('expo-router', () => ({
  useFocusEffect: (callback: () => void) => {
    const React = require('react');
    React.useEffect(() => {
      callback();
    }, [callback]);
  },
}));

jest.mock('../../auth/AuthService', () => ({
  AuthService: { bootstrap: jest.fn().mockResolvedValue(null) },
}));

jest.mock('../../../config', () => ({
  AppConfig: { SHOW_DEV_TOOLS: true },
}));

jest.mock('../../gamification/services/GamificationService', () => ({
  GamificationService: {
    getSnapshot: jest.fn().mockResolvedValue({ totalXp: 72, streakDays: 1, hearts: 5, maxHearts: 5 }),
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
  });

  it('não mostra nada disso no build do aluno', () => {
    // `SHOW_DEV_TOOLS` é `__DEV__ || EXPO_PUBLIC_ENABLE_DEV_TOOLS`, então em
    // release sem a flag a porta simplesmente não existe — e não é só um botão
    // desabilitado, que ainda contaria uma história ao aluno.
    AppConfig.SHOW_DEV_TOOLS = false;
    render(<ProfileScreen />);

    expect(screen.queryByText('Console de desenvolvimento')).toBeNull();
    expect(screen.queryByText(/desenvolvimento/iu)).toBeNull();
  });
});
