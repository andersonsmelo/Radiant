import AsyncStorage from '@react-native-async-storage/async-storage';
import { SpacedRepetitionService } from './SpacedRepetitionService';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
}));

const storage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

function card(lessonId: string, nextReviewAt: string) {
    return {
        lessonId,
        easeFactor: 2.5,
        interval: 1,
        repetitions: 1,
        nextReviewAt,
        lastReviewedAt: '2026-09-01T12:00:00.000Z',
        createdAt: '2026-09-01T12:00:00.000Z',
    };
}

describe('SpacedRepetitionService — relógio injetado', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        storage.getItem.mockResolvedValue(JSON.stringify({
            cards: {
                future: card('future', '2026-09-14T12:00:00.001Z'),
                recent: card('recent', '2026-09-14T11:59:00.000Z'),
                oldest: card('oldest', '2026-09-13T12:00:00.000Z'),
                exact: card('exact', '2026-09-14T12:00:00.000Z'),
            },
            reviewHistory: [],
            lastUpdated: '2026-09-14T00:00:00.000Z',
        }));
    });

    it('expõe agenda vencida em ordem com os instantes originais', async () => {
        await expect(SpacedRepetitionService.getDueReviewSchedule(
            new Date('2026-09-14T12:00:00.000Z'),
        )).resolves.toEqual([
            { lessonId: 'oldest', dueAtMs: Date.parse('2026-09-13T12:00:00.000Z') },
            { lessonId: 'recent', dueAtMs: Date.parse('2026-09-14T11:59:00.000Z') },
            { lessonId: 'exact', dueAtMs: Date.parse('2026-09-14T12:00:00.000Z') },
        ]);
    });

    it('usa o mesmo relógio em cartões e contagem', async () => {
        const now = new Date('2026-09-14T12:00:00.000Z');

        await expect(SpacedRepetitionService.getDueCards(now))
            .resolves.toHaveLength(3);
        await expect(SpacedRepetitionService.getDueCount(now))
            .resolves.toBe(3);
    });
});
