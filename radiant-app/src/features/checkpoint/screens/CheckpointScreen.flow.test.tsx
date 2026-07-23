import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import CheckpointScreen from './CheckpointScreen';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';

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

jest.mock('../../../ui/components/StarfieldBackground', () => ({
  StarfieldBackground: () => null,
}));

jest.mock('../../../ui/components/HUD', () => ({
  HUD: () => null,
}));

jest.mock('../../gamification/services/GamificationService', () => ({
  GamificationService: {
    getSnapshot: jest.fn().mockResolvedValue({
      totalXp: 120,
      streakDays: 3,
      hearts: 5,
      maxHearts: 5,
    }),
  },
}));

jest.mock('../../journey/services/JourneyProgressService', () => ({
  JourneyProgressService: {
    bootstrap: jest.fn(),
    markNodeCompleted: jest.fn(),
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
      id: 'interest-checkpoint-1',
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
            id: 'checkpoint-1',
            type: 'checkpoint',
            status: 'available',
            title: 'Checkpoint do módulo',
            description: 'Validar etapa antes de seguir.',
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
            id: 'checkpoint-1',
            type: 'checkpoint',
            status: 'completed',
            title: 'Checkpoint do módulo',
            description: 'Etapa validada.',
            unitId: 'unit-1',
          },
        ],
      },
    ],
  },
  nextRecommendedNode: null,
} as any;

describe('CheckpointScreen flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedJourneyProgressService.bootstrap.mockResolvedValue(availableSnapshot);
    mockedJourneyProgressService.markNodeCompleted.mockResolvedValue(completedSnapshot);
  });

  it('completes an available checkpoint and updates the journey snapshot', async () => {
    renderWithProviders(<CheckpointScreen nodeId="checkpoint-1" />);

    await waitFor(() => {
      expect(screen.getByText('Pronto para validar esta etapa?')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Concluir checkpoint'));

    await waitFor(() => {
      expect(mockedJourneyProgressService.markNodeCompleted).toHaveBeenCalledWith('checkpoint-1');
    });

    expect(await screen.findByText('Etapa validada.')).toBeTruthy();
  });
});
