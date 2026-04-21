/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import JourneyHomeScreen from './JourneyHomeScreen';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { JourneyProgressService } from '../services/JourneyProgressService';
import { TelemetryService } from '../../telemetry/TelemetryService';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
  useFocusEffect: (callback: () => void) => {
    const React = require('react');
    React.useEffect(() => {
      callback();
    }, [callback]);
  },
}));

jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

jest.mock('../../../components/ui/AppButton', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');

  return {
    AppButton: ({
      children,
      onPress,
      disabled,
      accessibilityLabel,
      accessibilityHint,
    }: {
      children: React.ReactNode;
      onPress: () => void;
      disabled?: boolean;
      accessibilityLabel?: string;
      accessibilityHint?: string;
    }) => (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        disabled={disabled}
        onPress={onPress}
      >
        <Text>{children}</Text>
      </Pressable>
    ),
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
      totalXp: 80,
      streakDays: 2,
      hearts: 5,
      maxHearts: 5,
    }),
  },
}));

jest.mock('../components/JourneyHero', () => {
  const React = require('react');
  const { Text, View } = require('react-native');

  return {
    JourneyHero: ({ unitTitle }: { unitTitle: string }) => (
      <View>
        <Text>{unitTitle}</Text>
      </View>
    ),
  };
});

jest.mock('../components/JourneyMap', () => {
  const React = require('react');
  const { Text, View } = require('react-native');

  return {
    JourneyMap: () => (
      <View>
        <Text>Mapa da jornada</Text>
      </View>
    ),
  };
});

jest.mock('../services/JourneyProgressService', () => ({
  JourneyProgressService: {
    bootstrap: jest.fn(),
    selectTrack: jest.fn(),
    setCurrentNode: jest.fn(),
  },
}));

jest.mock('../../daily-goal/services/DailyGoalService', () => ({
  DailyGoalService: {
    getSnapshot: jest.fn().mockResolvedValue({
      completedToday: 0,
      goalPerDay: 1,
    }),
  },
}));

jest.mock('../../content/services/LessonCatalogService', () => ({
  LessonCatalogService: {
    bootstrap: jest.fn(),
  },
}));

jest.mock('../../telemetry/TelemetryService', () => ({
  TelemetryService: {
    track: jest.fn().mockResolvedValue(undefined),
  },
}));

const mockedJourneyProgressService = JourneyProgressService as jest.Mocked<typeof JourneyProgressService>;
const mockedTelemetryService = TelemetryService as jest.Mocked<typeof TelemetryService>;
const mockedRouter = router as jest.Mocked<typeof router>;

const tracks = [
  {
    id: 'track-radiology-foundations',
    slug: 'fundamentos',
    title: 'Fundamentos',
    description: 'Base da radiologia.',
    lessonIds: ['lesson-foundations'],
  },
  {
    id: 'track-thorax-patterns',
    slug: 'torax',
    title: 'Tórax',
    description: 'Padrões do tórax.',
    lessonIds: ['lesson-thorax'],
  },
  {
    id: 'track-abdomen-patterns',
    slug: 'abdome',
    title: 'Abdome',
    description: 'Padrões do abdome.',
    lessonIds: ['lesson-abdomen'],
  },
] as any;

const catalogManifest = {
  version: 'test-v1',
  initialLessonId: 'lesson-foundations',
  tracks,
  lessons: tracks.map((track: any, index: number) => ({
    id: track.lessonIds[0],
    slug: track.lessonIds[0],
    title: track.title,
    difficulty: 'beginner',
    trackId: track.id,
    order: index + 1,
  })),
};

function createSnapshot(trackId: string, nodeTitle: string, nodeId: string, blockId: string) {
  const track = tracks.find((entry: any) => entry.id === trackId);

  return {
    track: {
      id: track.id,
      title: track.title,
      initialUnitId: `${trackId}:unit-1`,
      units: [
        {
          id: `${trackId}:unit-1`,
          title: track.title,
          nodes: [
            {
              id: nodeId,
              unitId: `${trackId}:unit-1`,
              type: 'lesson',
              title: nodeTitle,
              status: 'available',
              blockId,
            },
          ],
        },
      ],
    },
    progress: {
      schemaVersion: 'journey-progress.v2',
      activeTrackId: trackId,
      currentUnitId: `${trackId}:unit-1`,
      currentNodeId: null,
      completedNodeIds: [],
      pendingReviewNodeIds: [],
      lastUpdatedAt: '2026-04-09T00:00:00.000Z',
      pendingSyncEvents: [],
    },
    nextRecommendedNode: {
      id: nodeId,
      unitId: `${trackId}:unit-1`,
      type: 'lesson',
      title: nodeTitle,
      status: 'available',
      blockId,
    },
    completedCount: 0,
    dueReviewCount: 0,
  } as any;
}

describe('JourneyHomeScreen track flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const { LessonCatalogService } = require('../../content/services/LessonCatalogService');
    LessonCatalogService.bootstrap.mockResolvedValue(catalogManifest);

    mockedJourneyProgressService.bootstrap.mockResolvedValue(
      createSnapshot(
        'track-radiology-foundations',
        'Fundamentos de radiologia',
        'node-foundations-lesson',
        'block-foundations'
      )
    );
    mockedJourneyProgressService.setCurrentNode.mockResolvedValue(undefined as any);
  });

  it('opens the next eligible lesson when selecting Tórax', async () => {
    const thoraxSnapshot = createSnapshot(
      'track-thorax-patterns',
      'Interação das radiações e proteção radiológica',
      'node-thorax-lesson',
      'block-thorax'
    );
    mockedJourneyProgressService.selectTrack.mockResolvedValue(thoraxSnapshot);

    renderWithProviders(<JourneyHomeScreen />);

    const thoraxTrack = await screen.findByTestId('journey-track-torax');
    fireEvent.press(thoraxTrack);

    await waitFor(() => {
      expect(mockedJourneyProgressService.selectTrack).toHaveBeenCalledWith('track-thorax-patterns');
    });
    await waitFor(() => {
      expect(mockedJourneyProgressService.setCurrentNode).toHaveBeenCalledWith('node-thorax-lesson');
    });

    expect(mockedRouter.push).toHaveBeenCalledWith({
      pathname: '/learn',
      params: {
        nodeId: 'node-thorax-lesson',
        blockId: 'block-thorax',
      },
    });
    expect(mockedTelemetryService.track).toHaveBeenCalledWith('journey_track_selected', {
      trackId: 'track-thorax-patterns',
      active: false,
    });
  });

  it('opens the next eligible lesson when selecting Abdome', async () => {
    const abdomenSnapshot = createSnapshot(
      'track-abdomen-patterns',
      'Preservação de alimentos por irradiação',
      'node-abdomen-lesson',
      'block-abdomen'
    );
    mockedJourneyProgressService.selectTrack.mockResolvedValue(abdomenSnapshot);

    renderWithProviders(<JourneyHomeScreen />);

    const abdomenTrack = await screen.findByTestId('journey-track-abdome');
    fireEvent.press(abdomenTrack);

    await waitFor(() => {
      expect(mockedJourneyProgressService.selectTrack).toHaveBeenCalledWith('track-abdomen-patterns');
    });
    await waitFor(() => {
      expect(mockedJourneyProgressService.setCurrentNode).toHaveBeenCalledWith('node-abdomen-lesson');
    });

    expect(mockedRouter.push).toHaveBeenCalledWith({
      pathname: '/learn',
      params: {
        nodeId: 'node-abdomen-lesson',
        blockId: 'block-abdomen',
      },
    });
  });
});
