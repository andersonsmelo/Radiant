import { LearningAttemptsRepository } from '../../progress/services/LearningAttemptsRepository';
import type { LearningAttempt } from '../../progress/services/LearningStatsService';
import { JourneyStarsService } from './JourneyStarsService';

jest.mock('../../progress/services/LearningAttemptsRepository', () => ({
    LearningAttemptsRepository: { getAll: jest.fn() },
}));

const getAll = LearningAttemptsRepository.getAll as jest.MockedFunction<
    typeof LearningAttemptsRepository.getAll
>;

function attempt(lessonId: string, correctAnswers: number, totalQuestions: number): LearningAttempt {
    return {
        lessonId,
        topicId: 'topic',
        correctAnswers,
        totalQuestions,
        completedAt: '2026-10-21T10:00:00.000Z',
    };
}

describe('JourneyStarsService.getRecordStarsByLessonId', () => {
    beforeEach(() => {
        getAll.mockReset();
    });

    it('devolve o recorde de cada aula entre todas as tentativas', async () => {
        getAll.mockResolvedValue([attempt('a', 2, 3), attempt('a', 3, 3), attempt('b', 1, 3)]);

        await expect(JourneyStarsService.getRecordStarsByLessonId()).resolves.toEqual({ a: 3, b: 1 });
    });

    it('não deixa uma tentativa pior rebaixar o recorde', async () => {
        getAll.mockResolvedValue([attempt('a', 3, 3), attempt('a', 1, 3)]);

        await expect(JourneyStarsService.getRecordStarsByLessonId()).resolves.toEqual({ a: 3 });
    });

    it('devolve objeto vazio sem tentativas', async () => {
        getAll.mockResolvedValue([]);

        await expect(JourneyStarsService.getRecordStarsByLessonId()).resolves.toEqual({});
    });
});
