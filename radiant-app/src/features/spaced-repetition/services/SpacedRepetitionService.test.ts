import AsyncStorage from '@react-native-async-storage/async-storage';
import { SpacedRepetitionService } from './SpacedRepetitionService';
import { itemReviewRepository } from '../repositories/ItemReviewRepository';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import { MATERIA_ENERGIA_E_RADIACAO_PRODUCTION_BATCH } from '../../student-checkpoints/production-batches';

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
    it('trilha, push e contadores recebem o vencimento do item promovido real, em vez do agregado antigo', async () => {
        const activity = MATERIA_ENERGIA_E_RADIACAO_PRODUCTION_BATCH.activities[0];
        const step = activity.steps.find(entry => entry.kind === 'interaction');
        if (!step || step.kind !== 'interaction') throw Error('fixture');
        const data = new Map([[STORAGE_KEYS.SPACED_REPETITION_SCHEDULE as string, JSON.stringify({ cards: { [activity.id]: card(activity.id, '2026-09-01T00:00:00.000Z') }, reviewHistory: [] })]]);
        storage.getItem.mockImplementation(async key => data.get(key) ?? null);
        storage.setItem.mockImplementation(async (key, value) => { data.set(key, value); });
        await itemReviewRepository.record({ attemptId: 'study:real-schedule', item: { lessonId: activity.id, activityId: activity.id, itemId: step.interaction.id,
            contentVersion: activity.provenance.contentVersion, evidenceKind: step.interaction.evidenceKind, competencyId: step.interaction.competencyIds[0] },
            firstOutcome: 'correct', finalOutcome: 'correct', hintUsed: false, mode: 'study', durationBand: 'unknown', recordedAt: '2026-10-17T12:00:00.000Z' });
        expect(await SpacedRepetitionService.getDueLessons(new Date('2026-10-17T12:00:00.000Z'))).toEqual([]);
        expect(await SpacedRepetitionService.getDueLessons(new Date('2026-10-18T12:00:00.000Z'))).toEqual([activity.id]);
        expect(await SpacedRepetitionService.getDueCount(new Date('2026-10-18T12:00:00.000Z'))).toBe(1);
    });
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

    it('preserva a data futura na agenda sem colocá-la na fila devida antes do instante exato', async () => {
        expect((await SpacedRepetitionService.getReviewSchedule()).find(entry => entry.lessonId === 'future'))
            .toEqual({ lessonId: 'future', dueAtMs: Date.parse('2026-09-14T12:00:00.001Z') });
        expect((await SpacedRepetitionService.getDueReviewSchedule(new Date('2026-09-14T12:00:00.000Z'))).map(entry => entry.lessonId)).not.toContain('future');
        expect((await SpacedRepetitionService.getDueReviewSchedule(new Date('2026-09-14T12:00:00.001Z'))).map(entry => entry.lessonId)).toContain('future');
    });

    it('usa o mesmo relógio em cartões e contagem', async () => {
        const now = new Date('2026-09-14T12:00:00.000Z');

        await expect(SpacedRepetitionService.getDueCards(now))
            .resolves.toHaveLength(3);
        await expect(SpacedRepetitionService.getDueCount(now))
            .resolves.toBe(3);
    });
});
