import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/renderWithProviders';
import GalaxyMapScreen from './GalaxyMapScreen';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';

const mockPush = jest.fn();

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
  useFocusEffect: (callback: () => void) => {
    const React = require('react');
    React.useEffect(() => callback(), [callback]);
  },
}));

jest.mock('../../../ui/components/StarfieldBackground', () => ({ StarfieldBackground: () => null }));
jest.mock('../../../ui/components/HUD', () => ({ HUD: () => null }));
jest.mock('../../student-checkpoints/useShadowCheckpoint', () => ({
  STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION: 'test',
  useShadowCheckpoint: jest.fn(),
}));
jest.mock('../../gamification/services/GamificationService', () => ({
  GamificationService: { getSnapshot: jest.fn().mockResolvedValue({ totalXp: 0, streakDays: 0, hearts: 5, maxHearts: 5 }) },
}));
jest.mock('../../telemetry/TelemetryService', () => ({
  TelemetryService: { track: jest.fn().mockResolvedValue(undefined) },
}));
jest.mock('../../content/services/LessonCatalogService', () => ({
  LessonCatalogService: {
    bootstrap: jest.fn().mockResolvedValue({
      version: 'test',
      initialLessonId: 'lesson-1',
      tracks: [
        { id: 'track-1', slug: 'fundamentos', title: 'Fundamentos', description: 'Base', lessonIds: ['lesson-1'] },
        { id: 'track-2', slug: 'torax', title: 'Tórax', description: 'Tórax', lessonIds: ['lesson-2'] },
      ],
      lessons: [
        { id: 'lesson-1', slug: 'lesson-1', title: 'Introdução', difficulty: 'beginner', trackId: 'track-1', order: 1 },
        { id: 'lesson-2', slug: 'lesson-2', title: 'Tórax', difficulty: 'beginner', trackId: 'track-2', order: 1 },
      ],
    }),
  },
}));
jest.mock('../../journey/services/JourneyProgressService', () => ({
  JourneyProgressService: {
    bootstrap: jest.fn(),
    selectTrack: jest.fn(),
    setCurrentNode: jest.fn().mockResolvedValue(undefined),
  },
}));
jest.mock('../../journey/components/JourneyTrackShelf', () => {
  const React = require('react');
  const { Pressable, Text, View } = require('react-native');
  return {
    JourneyTrackShelf: ({ onTrackPress, tracks }: any) => (
      <View testID="journey-track-shelf">
        <Pressable testID="select-track" onPress={() => onTrackPress(tracks[1])}><Text>Tórax</Text></Pressable>
      </View>
    ),
  };
});
jest.mock('../../journey/components/JourneyMap', () => {
  const React = require('react');
  const { Pressable, Text, View } = require('react-native');
  return {
    JourneyMap: ({ onNodePress, units }: any) => (
      <View testID="canonical-journey-map">
        <Pressable testID="open-node" onPress={() => onNodePress(units[0].nodes[0])}><Text>Mapa canônico</Text></Pressable>
      </View>
    ),
  };
});

const snapshot = {
  track: {
    id: 'track-1',
    title: 'Fundamentos',
    initialUnitId: 'unit-1',
    units: [{ id: 'unit-1', title: 'Fundamentos', nodes: [{ id: 'node-1', unitId: 'unit-1', type: 'lesson', title: 'Introdução', status: 'available', blockId: 'block-1' }] }],
  },
  progress: {
    schemaVersion: 'journey-progress.v2',
    activeTrackId: 'track-1',
    currentUnitId: 'unit-1',
    currentNodeId: null,
    completedNodeIds: [],
    pendingReviewNodeIds: [],
    lastUpdatedAt: '2026-08-13T00:00:00.000Z',
    pendingSyncEvents: [],
  },
  nextRecommendedNode: { id: 'node-1', unitId: 'unit-1', type: 'lesson', title: 'Introdução', status: 'available', blockId: 'block-1' },
  completedCount: 0,
  dueReviewCount: 0,
} as any;

const progress = JourneyProgressService as jest.Mocked<typeof JourneyProgressService>;

describe('GalaxyMapScreen canonical journey', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    progress.bootstrap.mockResolvedValue(snapshot);
    progress.selectTrack.mockResolvedValue(snapshot);
  });

  it('owns the canonical JourneyMap', async () => {
    renderWithProviders(<GalaxyMapScreen />);

    // `find*`, e não `get*`: o mapa só monta depois do bootstrap assíncrono.
    // Antes quem esperava por essa carga era a asserção do shelf, que saiu.
    expect(await screen.findByTestId('canonical-journey-map')).toBeTruthy();
  });

  // Até 2026-08-14 esta tela também era o seletor de trilhas, e o caso acima
  // afirmava as duas responsabilidades juntas. O percurso passou a ser único: o
  // aluno não escolhe trilha, a seguinte abre ao concluir a atual. O catálogo
  // não pode voltar como escolha por acidente, então a ausência é verificada,
  // e não apenas deixada de verificar — um caso removido não impede a volta.
  it('não oferece escolha de trilha: o percurso é único', async () => {
    renderWithProviders(<GalaxyMapScreen />);

    await waitFor(() => expect(progress.bootstrap).toHaveBeenCalled());

    expect(screen.queryByTestId('journey-track-shelf')).toBeNull();
    expect(progress.selectTrack).not.toHaveBeenCalled();
  });

  it('opens a node through the same journey routing contract used by Home', async () => {
    renderWithProviders(<GalaxyMapScreen />);

    fireEvent.press(await screen.findByTestId('open-node'));
    await waitFor(() => expect(progress.setCurrentNode).toHaveBeenCalledWith('node-1'));
    expect(mockPush).toHaveBeenCalledWith({ pathname: '/learn', params: { nodeId: 'node-1', blockId: 'block-1' } });
  });
});
