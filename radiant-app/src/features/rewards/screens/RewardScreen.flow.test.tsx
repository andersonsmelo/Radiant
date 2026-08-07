import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import RewardScreen, { canCollectReward } from './RewardScreen';
import type { JourneyNode } from '../../../types/journey';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  },
}));

jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

jest.mock('../../../components/ui/AppButton', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');

  return {
    AppButton: ({ children, onPress, disabled }: { children: React.ReactNode; onPress: () => void; disabled?: boolean }) => (
      <Pressable accessibilityRole="button" onPress={onPress} disabled={disabled}>
        <Text>{children}</Text>
      </Pressable>
    ),
  };
});

jest.mock('../../../components/ui/PixelHeroSplit', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    PixelHeroSplit: () => <View />,
  };
});

jest.mock('../../../components/ui/StatItem', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    StatItem: () => <View />,
  };
});

jest.mock('../../../components/ui/SurfaceCard', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    SurfaceCard: ({ children }: { children: React.ReactNode }) => <View>{children}</View>,
  };
});

jest.mock('../../journey/services/JourneyProgressService', () => ({
  JourneyProgressService: {
    bootstrap: jest.fn(),
    setCurrentNode: jest.fn(),
    markNodeCompleted: jest.fn(),
  },
}));

jest.mock('../../../services/RatingPromptService', () => ({
  RatingPromptService: {
    maybePromptForReview: jest.fn().mockResolvedValue(false),
  },
}));

jest.mock('../../paywall/PaywallService', () => ({
  PaywallService: {
    maybePresentOffer: jest.fn().mockResolvedValue(null),
    recordOutcome: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('../../paywall/UpgradeInterestService', () => ({
  UpgradeInterestService: {
    captureInterest: jest.fn().mockResolvedValue({
      id: 'interest-1',
      email: 'user@example.com',
    }),
  },
}));

jest.mock('../../paywall/components/PaywallOfferCard', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    PaywallOfferCard: () => <View />,
  };
});

const mockedJourneyProgressService = JourneyProgressService as jest.Mocked<typeof JourneyProgressService>;

const availableSnapshot = {
  track: {
    units: [
      {
        id: 'unit-1',
        title: 'Unidade 1',
        nodes: [
          { id: 'lesson-1', type: 'lesson', status: 'completed', unitId: 'unit-1' },
          {
            id: 'reward-1',
            type: 'reward',
            status: 'available',
            title: 'Conquista do módulo',
            description: 'Recompensa pronta para coleta.',
            unitId: 'unit-1',
          },
        ],
      },
    ],
  },
  nextRecommendedNode: null,
} as any;

const completedSnapshot = {
  track: {
    units: [
      {
        id: 'unit-1',
        title: 'Unidade 1',
        nodes: [
          { id: 'lesson-1', type: 'lesson', status: 'completed', unitId: 'unit-1' },
          {
            id: 'reward-1',
            type: 'reward',
            status: 'completed',
            title: 'Conquista do módulo',
            description: 'Recompensa registrada.',
            unitId: 'unit-1',
          },
        ],
      },
    ],
  },
  nextRecommendedNode: null,
} as any;

const lockedSnapshot = {
  track: {
    units: [
      {
        id: 'unit-1',
        title: 'Unidade 1',
        nodes: [
          { id: 'lesson-1', type: 'lesson', status: 'available', unitId: 'unit-1' },
          {
            id: 'reward-1',
            type: 'reward',
            status: 'locked',
            title: 'Conquista do módulo',
            description: 'Recompensa ainda bloqueada.',
            unitId: 'unit-1',
          },
        ],
      },
    ],
  },
  nextRecommendedNode: null,
} as any;

describe('RewardScreen flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedJourneyProgressService.bootstrap.mockResolvedValue(availableSnapshot);
    mockedJourneyProgressService.setCurrentNode.mockResolvedValue(availableSnapshot);
    mockedJourneyProgressService.markNodeCompleted.mockResolvedValue(completedSnapshot);
  });

  it('collects an available reward and updates the journey snapshot', async () => {
    renderWithProviders(<RewardScreen nodeId="reward-1" />);

    await waitFor(() => {
      expect(screen.getByText('Pronto para coletar essa conquista?')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Receber conquista'));

    await waitFor(() => {
      expect(mockedJourneyProgressService.markNodeCompleted).toHaveBeenCalledWith('reward-1');
    });

    expect(await screen.findByText('Conquista registrada')).toBeTruthy();
  });

  it('does not offer collection for a reward reached while still locked', async () => {
    // `findReward` resolve por id sem olhar status, de proposito. O efeito
    // colateral e que `radiantapp://reward?nodeId=...` -- esquema invocavel de
    // fora do app -- alcanca um no bloqueado. Ate 2026-08-04 a tela dizia
    // "Pronta para ser coletada" com zero marcos concluidos e o botao gravava a
    // conquista da unidade. Estes dois testes existem para que o caminho de
    // coleta nunca volte a ignorar o status.
    mockedJourneyProgressService.bootstrap.mockResolvedValue(lockedSnapshot);

    renderWithProviders(<RewardScreen nodeId="reward-1" />);

    expect(await screen.findByText('Esta conquista ainda não abriu')).toBeTruthy();
    expect(screen.queryByText('Receber conquista')).toBeNull();
    expect(screen.queryByText('Pronto para coletar essa conquista?')).toBeNull();
    expect(screen.getByText('Bloqueada até a unidade fechar')).toBeTruthy();
  });

  it('never marks a locked reward completed, even if the collect path is reached', async () => {
    // Contraprova da guarda de defesa em profundidade: mesmo sem o botao na
    // tela, o caminho de gravacao precisa recusar. Gravar progressao e
    // irreversivel, e quem chega por deep link chega por fora do controle do app.
    mockedJourneyProgressService.bootstrap.mockResolvedValue(lockedSnapshot);

    renderWithProviders(<RewardScreen nodeId="reward-1" />);

    await screen.findByText('Esta conquista ainda não abriu');

    expect(mockedJourneyProgressService.markNodeCompleted).not.toHaveBeenCalled();
    expect(mockedJourneyProgressService.setCurrentNode).not.toHaveBeenCalled();
  });

  describe('canCollectReward — a decisão que o handler de coleta consulta', () => {
    // O teste anterior renderiza a tela bloqueada e afirma que nada gravou. Ele
    // NAO alcanca a guarda: sem apertar nada, o caminho de coleta nunca roda, e
    // apagar a condicao do handler o deixava verde. A regra vive numa funcao
    // justamente para poder ser invocada — o ramo de coleta e inalcancavel pela
    // UI quando o no esta bloqueado, porque o mesmo booleano decide se o botao
    // existe e se o handler grava.
    //
    // A autorizacao de verdade e a de
    // `JourneyProgressService.markNodeCompleted`, provada em
    // JourneyNodeCompletionGuard.test.tsx por cada caminho que alcanca a
    // escrita. Esta aqui e a segunda camada.
    const node = (status: JourneyNode['status']): JourneyNode =>
      ({ id: 'reward-1', unitId: 'unit-1', type: 'reward', title: 'Conquista', status }) as JourneyNode;

    it('recusa um no bloqueado', () => {
      expect(canCollectReward(node('locked'), false)).toBe(false);
    });

    it('recusa todo status que nao seja disponivel ou ativo', () => {
      for (const status of ['locked', 'completed', 'due-review', 'resumable'] as const) {
        expect(canCollectReward(node(status), false)).toBe(false);
      }
    });

    it('recusa quando a conquista ja foi coletada nesta sessao', () => {
      expect(canCollectReward(node('available'), true)).toBe(false);
    });

    it('recusa quando nao ha no resolvido', () => {
      expect(canCollectReward(null, false)).toBe(false);
    });

    it('aceita o no disponivel e o ativo, senao a correcao vira "nada coleta"', () => {
      expect(canCollectReward(node('available'), false)).toBe(true);
      expect(canCollectReward(node('active'), false)).toBe(true);
    });
  });
});
