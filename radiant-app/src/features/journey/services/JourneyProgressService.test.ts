import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import { JOURNEY_PROGRESS_SCHEMA_VERSION, type JourneyProgressStore } from '../../../types/journey';
import type { ContentLesson, LearningTrack, LessonCatalogSummary } from '../../content/content.types';
import { LessonCatalogService } from '../../content/services/LessonCatalogService';
import { SpacedRepetitionService } from '../../spaced-repetition/services/SpacedRepetitionService';
import { JourneyProgressService } from './JourneyProgressService';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
}));

jest.mock('../../spaced-repetition/services/SpacedRepetitionService', () => ({
    SpacedRepetitionService: {
        getTrackedLessonIds: jest.fn(),
        getDueLessons: jest.fn(),
    },
}));

jest.mock('../../content/services/LessonCatalogService', () => ({
    LessonCatalogService: {
        listTracks: jest.fn(),
        listLessonSummaries: jest.fn(),
        getLessonById: jest.fn(),
    },
}));

const storage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const mockedSpacedRepetitionService = SpacedRepetitionService as jest.Mocked<typeof SpacedRepetitionService>;
const mockedLessonCatalogService = LessonCatalogService as jest.Mocked<typeof LessonCatalogService>;

const trackFixtures: LearningTrack[] = [
    {
        id: 'track-radiology-foundations',
        slug: 'radiology-foundations',
        title: 'Fundamentos',
        description: 'Base inicial.',
        lessonIds: ['foundation-1', 'foundation-2'],
    },
    {
        id: 'track-thorax-patterns',
        slug: 'thorax-patterns',
        title: 'Tórax',
        description: 'Padrões de tórax.',
        lessonIds: ['thorax-1', 'thorax-2'],
    },
];

const lessonSummaries: LessonCatalogSummary[] = [
    {
        id: 'foundation-1',
        slug: 'foundation-1',
        title: 'Densidade',
        difficulty: 'beginner',
        trackId: 'track-radiology-foundations',
        order: 1,
    },
    {
        id: 'foundation-2',
        slug: 'foundation-2',
        title: 'Incidência',
        difficulty: 'beginner',
        trackId: 'track-radiology-foundations',
        order: 2,
    },
    {
        id: 'thorax-1',
        slug: 'thorax-1',
        title: 'Pulmão',
        difficulty: 'beginner',
        trackId: 'track-thorax-patterns',
        order: 1,
    },
    {
        id: 'thorax-2',
        slug: 'thorax-2',
        title: 'Pleura',
        difficulty: 'intermediate',
        trackId: 'track-thorax-patterns',
        order: 2,
    },
];

function createLesson(id: string, title: string): ContentLesson {
    return {
        id,
        title,
        difficulty: 'beginner',
        questions: [
            {
                id: `${id}-q1`,
                type: 'multiple-choice',
                prompt: `Pergunta de ${title}`,
                options: [{ label: 'A' }, { label: 'B' }],
                correctAnswerIndex: 0,
                explanation: 'Explicação curta.',
            },
        ],
    };
}

const lessonsById: Record<string, ContentLesson> = {
    'foundation-1': createLesson('foundation-1', 'Densidade'),
    'foundation-2': createLesson('foundation-2', 'Incidência'),
    'thorax-1': createLesson('thorax-1', 'Pulmão'),
    'thorax-2': createLesson('thorax-2', 'Pleura'),
};

function readStoredJourney(): JourneyProgressStore {
    const lastPayload = storage.setItem.mock.calls
        .filter(([key]) => key === STORAGE_KEYS.JOURNEY_PROGRESS)
        .at(-1)?.[1];

    if (!lastPayload) {
        throw new Error('Journey progress was not persisted');
    }

    return JSON.parse(lastPayload) as JourneyProgressStore;
}

describe('JourneyProgressService', () => {
    const storageState: Record<string, string> = {};

    beforeEach(() => {
        jest.clearAllMocks();
        Object.keys(storageState).forEach((key) => {
            delete storageState[key];
        });

        storage.getItem.mockImplementation(async (key) => storageState[key] ?? null);
        storage.setItem.mockImplementation(async (key, value) => {
            storageState[key] = value;
        });
        storage.removeItem.mockImplementation(async (key) => {
            delete storageState[key];
        });

        mockedSpacedRepetitionService.getTrackedLessonIds.mockResolvedValue([]);
        mockedSpacedRepetitionService.getDueLessons.mockResolvedValue([]);
        mockedLessonCatalogService.listTracks.mockReturnValue(trackFixtures);
        mockedLessonCatalogService.listLessonSummaries.mockReturnValue(lessonSummaries);
        mockedLessonCatalogService.getLessonById.mockImplementation((lessonId) => lessonsById[lessonId] ?? null);
    });

    it('bootstraps the default catalog track into a versioned multi-track store', async () => {
        const snapshot = await JourneyProgressService.bootstrap();
        const stored = readStoredJourney();

        expect(snapshot.progress.activeTrackId).toBe('track-radiology-foundations');
        expect(snapshot.nextRecommendedNode?.id).toBe('node:foundation-1');
        expect(stored.schemaVersion).toBe(JOURNEY_PROGRESS_SCHEMA_VERSION);
        expect(stored.activeTrackId).toBe('track-radiology-foundations');
        expect(Object.keys(stored.tracks)).toEqual(['track-radiology-foundations']);
    });

    it('switches tracks while preserving progress already earned on another track', async () => {
        await JourneyProgressService.bootstrap();
        await JourneyProgressService.markNodeCompleted('node:foundation-1');

        const thoraxSnapshot = await JourneyProgressService.selectTrack('track-thorax-patterns');
        let stored = readStoredJourney();

        expect(thoraxSnapshot.progress.activeTrackId).toBe('track-thorax-patterns');
        expect(thoraxSnapshot.nextRecommendedNode?.id).toBe('node:thorax-1');
        expect(stored.activeTrackId).toBe('track-thorax-patterns');
        expect(stored.tracks['track-radiology-foundations'].completedNodeIds).toContain('node:foundation-1');
        expect(stored.tracks['track-thorax-patterns'].completedNodeIds).toEqual([]);

        const foundationSnapshot = await JourneyProgressService.selectTrack('track-radiology-foundations');
        stored = readStoredJourney();

        expect(foundationSnapshot.progress.activeTrackId).toBe('track-radiology-foundations');
        expect(foundationSnapshot.progress.completedNodeIds).toContain('node:foundation-1');
        expect(stored.activeTrackId).toBe('track-radiology-foundations');
    });

    it('migrates legacy single-track progress into the default track bucket', async () => {
        storageState[STORAGE_KEYS.JOURNEY_PROGRESS] = JSON.stringify({
            schemaVersion: 'journey-progress.v1',
            activeTrackId: 'learning-road-v2',
            currentUnitId: 'unit-radiology-foundations-1',
            currentNodeId: null,
            completedNodeIds: ['node:foundation-1'],
            pendingReviewNodeIds: [],
            lastUpdatedAt: '2026-04-09T12:00:00.000Z',
            lastCompletedNodeId: 'node:foundation-1',
            pendingSyncEvents: [],
        });

        const snapshot = await JourneyProgressService.bootstrap();
        const stored = readStoredJourney();

        expect(snapshot.progress.activeTrackId).toBe('track-radiology-foundations');
        expect(snapshot.progress.completedNodeIds).toContain('node:foundation-1');
        expect(stored.schemaVersion).toBe(JOURNEY_PROGRESS_SCHEMA_VERSION);
        expect(stored.tracks['track-radiology-foundations'].completedNodeIds).toContain('node:foundation-1');
    });
});
