import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import RewardScreen from './RewardScreen';
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

    expect(await screen.findByText('Reward concluído')).toBeTruthy();
  });
});
