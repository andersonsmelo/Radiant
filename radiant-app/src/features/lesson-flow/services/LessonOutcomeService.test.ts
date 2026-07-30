import type { LessonBlock } from '../../../types/lessonFlow';
import type { JourneySnapshot } from '../../../types/journey';
import type { SRCardState } from '../../../types/spacedRepetition';
import { GamificationService } from '../../gamification/services/GamificationService';
import { SpacedRepetitionService } from '../../spaced-repetition/services/SpacedRepetitionService';
import { DailyGoalService } from '../../daily-goal/services/DailyGoalService';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';
import { SyncQueueService } from '../../sync/SyncQueueService';
import { LearningAttemptsRepository } from '../../progress/services/LearningAttemptsRepository';
import { LessonOutcomeService } from './LessonOutcomeService';

jest.mock('../../gamification/services/GamificationService', () => ({
    GamificationService: { recordQuizCompletion: jest.fn() },
}));

jest.mock('../../spaced-repetition/services/SpacedRepetitionService', () => ({
    SpacedRepetitionService: { recordQuizResult: jest.fn(), getCardState: jest.fn() },
}));

jest.mock('../../daily-goal/services/DailyGoalService', () => ({
    DailyGoalService: { recordQuizCompletion: jest.fn() },
}));

jest.mock('../../journey/services/JourneyProgressService', () => ({
    JourneyProgressService: { getSnapshot: jest.fn() },
}));

jest.mock('../../sync/SyncQueueService', () => ({
    SyncQueueService: {
        enqueueLessonProgressFromQuizResult: jest.fn(),
        enqueueReviewCard: jest.fn(),
        flush: jest.fn(),
    },
}));

jest.mock('../../progress/services/LearningAttemptsRepository', () => ({
    LearningAttemptsRepository: { append: jest.fn() },
}));

const mockedGamification = GamificationService as jest.Mocked<typeof GamificationService>;
const mockedSpacedRepetition = SpacedRepetitionService as jest.Mocked<typeof SpacedRepetitionService>;
const mockedDailyGoal = DailyGoalService as jest.Mocked<typeof DailyGoalService>;
const mockedJourney = JourneyProgressService as jest.Mocked<typeof JourneyProgressService>;
const mockedSyncQueue = SyncQueueService as jest.Mocked<typeof SyncQueueService>;
const mockedAttempts = LearningAttemptsRepository as jest.Mocked<typeof LearningAttemptsRepository>;

const block: LessonBlock = {
    id: 'block:lesson-1:intro',
    lessonId: 'lesson-1',
    steps: [
        {
            step: { type: 'context', payload: { title: 'Contexto', body: 'Corpo' } },
            contract: { id: 'lesson-1-context', type: 'context', completionRule: 'displayed', retryRule: 'allow_continue', branching: 'none' },
        },
        {
            step: {
                type: 'multiple-choice',
                payload: {
                    prompt: 'Pergunta?',
                    options: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }],
                    correctOptionId: 'a',
                    explanation: 'Porque A.',
                },
            },
            contract: { id: 'lesson-1-question', type: 'multiple-choice', completionRule: 'answered', retryRule: 'allow_continue', branching: 'none' },
        },
    ],
};

const cardFixture: SRCardState = {
    lessonId: 'lesson-1',
    easeFactor: 2.5,
    interval: 1,
    repetitions: 1,
    nextReviewAt: new Date('2026-07-31T00:00:00.000Z'),
    lastReviewedAt: new Date('2026-07-30T00:00:00.000Z'),
    createdAt: new Date('2026-07-30T00:00:00.000Z'),
};

function snapshotWith(overrides: {
    nodeId: string;
    nodeType: 'lesson' | 'review';
    completedNodeIds?: string[];
    pendingReviewNodeIds?: string[];
}): JourneySnapshot {
    return {
        track: {
            id: 'track-1',
            title: 'Trilha',
            initialUnitId: 'unit-1',
            units: [
                {
                    id: 'unit-1',
                    title: 'Unidade',
                    nodes: [
                        {
                            id: overrides.nodeId,
                            unitId: 'unit-1',
                            type: overrides.nodeType,
                            title: 'Nó',
                            lessonId: 'lesson-1',
                            blockId: block.id,
                            status: 'available',
                        },
                    ],
                },
            ],
        },
        progress: {
            schemaVersion: 'journey-progress.v2',
            activeTrackId: 'track-1',
            currentUnitId: 'unit-1',
            currentNodeId: null,
            completedNodeIds: overrides.completedNodeIds ?? [],
            pendingReviewNodeIds: overrides.pendingReviewNodeIds ?? [],
            lastUpdatedAt: '2026-07-30T00:00:00.000Z',
            pendingSyncEvents: [],
        },
        nextRecommendedNode: null,
        completedCount: 0,
        dueReviewCount: 0,
    };
}

describe('LessonOutcomeService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedGamification.recordQuizCompletion.mockResolvedValue({
            snapshot: { totalXp: 18, streakDays: 1, lastActiveDate: null, hearts: 5, maxHearts: 5, heartsNextRefillAt: null },
            award: { baseXp: 10, bonusXp: 8, totalXpAwarded: 18, reason: 'quiz_complete' },
        });
        mockedSpacedRepetition.recordQuizResult.mockResolvedValue(undefined);
        mockedDailyGoal.recordQuizCompletion.mockResolvedValue({
            goalPerDay: 3,
            completedToday: 1,
            isCompleted: false,
            dateKey: '2026-07-30',
        });
        // clearAllMocks zera chamadas, não implementações — reafirmar aqui evita
        // que a resolução vaze (ou falte) conforme a ordem dos describes.
        mockedAttempts.append.mockResolvedValue(undefined);
    });

    it('premia a primeira conclusão de um nó de lição e reavalia o card', async () => {
        mockedJourney.getSnapshot.mockResolvedValue(snapshotWith({ nodeId: 'node:lesson-1', nodeType: 'lesson' }));

        const outcome = await LessonOutcomeService.recordCompletion({
            block,
            nodeId: 'node:lesson-1',
            confirmedAnswers: { 'lesson-1-question': true },
        });

        expect(outcome.rewarded).toBe(true);
        expect(outcome.award?.totalXpAwarded).toBe(18);
        expect(mockedSpacedRepetition.recordQuizResult).toHaveBeenCalledTimes(1);
        expect(mockedGamification.recordQuizCompletion).toHaveBeenCalledTimes(1);
        expect(mockedDailyGoal.recordQuizCompletion).toHaveBeenCalledTimes(1);

        const result = mockedSpacedRepetition.recordQuizResult.mock.calls[0][0];
        expect(result.lessonId).toBe('lesson-1');
        expect(result.totalQuestions).toBe(1);
        expect(result.correctAnswers).toBe(1);
    });

    it('não premia uma lição já concluída, mas ainda reavalia o card', async () => {
        mockedJourney.getSnapshot.mockResolvedValue(
            snapshotWith({ nodeId: 'node:lesson-1', nodeType: 'lesson', completedNodeIds: ['node:lesson-1'] })
        );

        const outcome = await LessonOutcomeService.recordCompletion({
            block,
            nodeId: 'node:lesson-1',
            confirmedAnswers: { 'lesson-1-question': true },
        });

        expect(outcome.rewarded).toBe(false);
        expect(outcome.award).toBeNull();
        expect(mockedSpacedRepetition.recordQuizResult).toHaveBeenCalledTimes(1);
        expect(mockedGamification.recordQuizCompletion).not.toHaveBeenCalled();
        expect(mockedDailyGoal.recordQuizCompletion).not.toHaveBeenCalled();
    });

    it('premia uma revisão vencida', async () => {
        mockedJourney.getSnapshot.mockResolvedValue(
            snapshotWith({
                nodeId: 'node:review:lesson-1',
                nodeType: 'review',
                completedNodeIds: ['node:review:lesson-1'],
                pendingReviewNodeIds: ['node:review:lesson-1'],
            })
        );

        const outcome = await LessonOutcomeService.recordCompletion({
            block,
            nodeId: 'node:review:lesson-1',
            confirmedAnswers: { 'lesson-1-question': true },
        });

        expect(outcome.rewarded).toBe(true);
        expect(mockedGamification.recordQuizCompletion).toHaveBeenCalledTimes(1);
    });

    it('não premia uma revisão refeita fora de prazo, mas reavalia o card', async () => {
        mockedJourney.getSnapshot.mockResolvedValue(
            snapshotWith({ nodeId: 'node:review:lesson-1', nodeType: 'review', pendingReviewNodeIds: [] })
        );

        const outcome = await LessonOutcomeService.recordCompletion({
            block,
            nodeId: 'node:review:lesson-1',
            confirmedAnswers: { 'lesson-1-question': true },
        });

        expect(outcome.rewarded).toBe(false);
        expect(mockedSpacedRepetition.recordQuizResult).toHaveBeenCalledTimes(1);
        expect(mockedGamification.recordQuizCompletion).not.toHaveBeenCalled();
    });

    it('conta como errada a escolha confirmada incorreta', async () => {
        mockedJourney.getSnapshot.mockResolvedValue(snapshotWith({ nodeId: 'node:lesson-1', nodeType: 'lesson' }));

        await LessonOutcomeService.recordCompletion({
            block,
            nodeId: 'node:lesson-1',
            confirmedAnswers: { 'lesson-1-question': false },
        });

        const result = mockedSpacedRepetition.recordQuizResult.mock.calls[0][0];
        expect(result.totalQuestions).toBe(1);
        expect(result.correctAnswers).toBe(0);
    });

    it('consulta a elegibilidade antes de gravar o recall', async () => {
        const order: string[] = [];
        mockedJourney.getSnapshot.mockImplementation(async () => {
            order.push('snapshot');
            return snapshotWith({ nodeId: 'node:lesson-1', nodeType: 'lesson' });
        });
        mockedSpacedRepetition.recordQuizResult.mockImplementation(async () => {
            order.push('recall');
        });

        await LessonOutcomeService.recordCompletion({
            block,
            nodeId: 'node:lesson-1',
            confirmedAnswers: { 'lesson-1-question': true },
        });

        expect(order).toEqual(['snapshot', 'recall']);
    });

    it('não propaga falha de storage para o chamador', async () => {
        mockedJourney.getSnapshot.mockResolvedValue(snapshotWith({ nodeId: 'node:lesson-1', nodeType: 'lesson' }));
        mockedSpacedRepetition.recordQuizResult.mockRejectedValue(new Error('storage cheio'));
        mockedGamification.recordQuizCompletion.mockRejectedValue(new Error('storage cheio'));
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

        await expect(
            LessonOutcomeService.recordCompletion({
                block,
                nodeId: 'node:lesson-1',
                confirmedAnswers: { 'lesson-1-question': true },
            })
        ).resolves.toEqual({ award: null, rewarded: true });

        errorSpy.mockRestore();
    });

    it('não premia quando o nó não existe na trilha', async () => {
        mockedJourney.getSnapshot.mockResolvedValue(snapshotWith({ nodeId: 'node:outro', nodeType: 'lesson' }));

        const outcome = await LessonOutcomeService.recordCompletion({
            block,
            nodeId: 'node:inexistente',
            confirmedAnswers: { 'lesson-1-question': true },
        });

        expect(outcome.rewarded).toBe(false);
        expect(mockedGamification.recordQuizCompletion).not.toHaveBeenCalled();
    });

    it('enfileira progresso e card e dá flush', async () => {
        mockedJourney.getSnapshot.mockResolvedValue(snapshotWith({ nodeId: 'node:lesson-1', nodeType: 'lesson' }));
        mockedSpacedRepetition.getCardState.mockResolvedValue(cardFixture);
        mockedSyncQueue.enqueueLessonProgressFromQuizResult.mockResolvedValue(undefined);
        mockedSyncQueue.enqueueReviewCard.mockResolvedValue(undefined);
        mockedSyncQueue.flush.mockResolvedValue(undefined);

        await LessonOutcomeService.recordCompletion({
            block,
            nodeId: 'node:lesson-1',
            confirmedAnswers: { 'lesson-1-question': true },
        });

        expect(mockedSyncQueue.enqueueLessonProgressFromQuizResult).toHaveBeenCalledTimes(1);
        expect(mockedSyncQueue.enqueueReviewCard).toHaveBeenCalledTimes(1);
        expect(mockedSyncQueue.flush).toHaveBeenCalledTimes(1);
    });

    it('não enfileira card quando não há card state', async () => {
        mockedJourney.getSnapshot.mockResolvedValue(snapshotWith({ nodeId: 'node:lesson-1', nodeType: 'lesson' }));
        mockedSpacedRepetition.getCardState.mockResolvedValue(null);
        mockedSyncQueue.enqueueLessonProgressFromQuizResult.mockResolvedValue(undefined);
        mockedSyncQueue.flush.mockResolvedValue(undefined);

        await LessonOutcomeService.recordCompletion({
            block,
            nodeId: 'node:lesson-1',
            confirmedAnswers: { 'lesson-1-question': true },
        });

        expect(mockedSyncQueue.enqueueReviewCard).not.toHaveBeenCalled();
    });

    it('falha de sincronização não propaga nem impede a premiação', async () => {
        mockedJourney.getSnapshot.mockResolvedValue(snapshotWith({ nodeId: 'node:lesson-1', nodeType: 'lesson' }));
        mockedSpacedRepetition.getCardState.mockResolvedValue(cardFixture);
        mockedSyncQueue.enqueueLessonProgressFromQuizResult.mockRejectedValue(new Error('API 502'));
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

        const outcome = await LessonOutcomeService.recordCompletion({
            block,
            nodeId: 'node:lesson-1',
            confirmedAnswers: { 'lesson-1-question': true },
        });

        expect(outcome.rewarded).toBe(true);
        expect(mockedGamification.recordQuizCompletion).toHaveBeenCalledTimes(1);

        errorSpy.mockRestore();
    });

    it('grava a tentativa usando a unidade do nó como tópico', async () => {
        mockedJourney.getSnapshot.mockResolvedValue(snapshotWith({ nodeId: 'node:lesson-1', nodeType: 'lesson' }));

        await LessonOutcomeService.recordCompletion({
            block,
            nodeId: 'node:lesson-1',
            confirmedAnswers: { 'lesson-1-question': true },
            answeredAt: new Date('2026-07-30T12:00:00.000Z'),
        });

        expect(mockedAttempts.append).toHaveBeenCalledWith({
            lessonId: 'lesson-1',
            topicId: 'unit-1',
            correctAnswers: 1,
            totalQuestions: 1,
            completedAt: '2026-07-30T12:00:00.000Z',
        });
    });

    it('grava a tentativa mesmo quando a conclusão não premia', async () => {
        // Refazer uma lição não paga XP, mas continua sendo informação sobre
        // memória — a acurácia tem de enxergar a tentativa.
        mockedJourney.getSnapshot.mockResolvedValue(
            snapshotWith({ nodeId: 'node:lesson-1', nodeType: 'lesson', completedNodeIds: ['node:lesson-1'] })
        );

        const outcome = await LessonOutcomeService.recordCompletion({
            block,
            nodeId: 'node:lesson-1',
            confirmedAnswers: { 'lesson-1-question': false },
            answeredAt: new Date('2026-07-30T12:00:00.000Z'),
        });

        expect(outcome.rewarded).toBe(false);
        expect(mockedAttempts.append).toHaveBeenCalledWith(
            expect.objectContaining({ lessonId: 'lesson-1', topicId: 'unit-1', correctAnswers: 0 })
        );
    });

    it('não grava tentativa quando o nó não existe na trilha', async () => {
        // Sem nó não há unidade, e inventar um tópico contaminaria o domínio.
        mockedJourney.getSnapshot.mockResolvedValue(snapshotWith({ nodeId: 'node:outro', nodeType: 'lesson' }));
        const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

        await LessonOutcomeService.recordCompletion({
            block,
            nodeId: 'node:inexistente',
            confirmedAnswers: { 'lesson-1-question': true },
        });

        expect(mockedAttempts.append).not.toHaveBeenCalled();

        warnSpy.mockRestore();
    });

    it('falha ao gravar a tentativa não propaga nem impede a premiação', async () => {
        mockedJourney.getSnapshot.mockResolvedValue(snapshotWith({ nodeId: 'node:lesson-1', nodeType: 'lesson' }));
        mockedAttempts.append.mockRejectedValue(new Error('disco cheio'));
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

        const outcome = await LessonOutcomeService.recordCompletion({
            block,
            nodeId: 'node:lesson-1',
            confirmedAnswers: { 'lesson-1-question': true },
        });

        expect(outcome.rewarded).toBe(true);

        errorSpy.mockRestore();
    });
});
