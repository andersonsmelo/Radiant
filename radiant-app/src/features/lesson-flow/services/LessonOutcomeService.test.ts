import type { LessonBlock } from '../../../types/lessonFlow';
import type { JourneySnapshot, UnlockRule } from '../../../types/journey';
import type { SRCardState } from '../../../types/spacedRepetition';
import { GamificationService } from '../../gamification/services/GamificationService';
import { SpacedRepetitionService } from '../../spaced-repetition/services/SpacedRepetitionService';
import { DailyGoalService } from '../../daily-goal/services/DailyGoalService';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';
import { SyncQueueService } from '../../sync/SyncQueueService';
import { LearningAttemptsRepository } from '../../progress/services/LearningAttemptsRepository';
import { LearningEvidenceRepository } from '../../mastery/repositories/LearningEvidenceRepository';
import { CompetencyReviewService } from '../../spaced-repetition/services/CompetencyReviewService';
import { LessonOutcomeService } from './LessonOutcomeService';

jest.mock('../../gamification/services/GamificationService', () => ({
    GamificationService: { recordQuizCompletion: jest.fn() },
}));

jest.mock('../../spaced-repetition/services/SpacedRepetitionService', () => ({
    SpacedRepetitionService: { recordQuizResult: jest.fn(), getCardState: jest.fn() },
}));

jest.mock('../../daily-goal/services/DailyGoalService', () => ({
    DailyGoalService: { recordXp: jest.fn() },
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

jest.mock('../../mastery/repositories/LearningEvidenceRepository', () => ({
    LearningEvidenceRepository: { append: jest.fn() },
}));

jest.mock('../../spaced-repetition/services/CompetencyReviewService', () => ({
    CompetencyReviewService: { observeExposure: jest.fn(), recordReview: jest.fn() },
}));

const mockedGamification = GamificationService as jest.Mocked<typeof GamificationService>;
const mockedSpacedRepetition = SpacedRepetitionService as jest.Mocked<typeof SpacedRepetitionService>;
const mockedDailyGoal = DailyGoalService as jest.Mocked<typeof DailyGoalService>;
const mockedJourney = JourneyProgressService as jest.Mocked<typeof JourneyProgressService>;
const mockedSyncQueue = SyncQueueService as jest.Mocked<typeof SyncQueueService>;
const mockedAttempts = LearningAttemptsRepository as jest.Mocked<typeof LearningAttemptsRepository>;
const mockedEvidence = LearningEvidenceRepository as jest.Mocked<typeof LearningEvidenceRepository>;
const mockedReview = CompetencyReviewService as jest.Mocked<typeof CompetencyReviewService>;

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
    unlockRule?: UnlockRule;
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
                            ...(overrides.unlockRule ? { unlockRule: overrides.unlockRule } : {}),
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
        // Sem competência vencida injetada, o recomendador devolve sempre
        // `next-new`. Este fixture descreve o estado de hoje, em que não há
        // conteúdo v2 e nenhum cartão de revisão por competência existe.
        recommendationReason: 'next-new',
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
        mockedDailyGoal.recordXp.mockResolvedValue({
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
        expect(mockedDailyGoal.recordXp).toHaveBeenCalledTimes(1);

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
        expect(mockedDailyGoal.recordXp).not.toHaveBeenCalled();
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

describe('LessonOutcomeService — evidência por interação', () => {
    beforeEach(() => {
        // Este describe é irmão do de cima, não filho: o beforeEach dele não roda
        // aqui, e sem limpar os mocks as contagens de chamada acumulam entre os
        // dois blocos.
        jest.clearAllMocks();
        mockedAttempts.append.mockResolvedValue(undefined);
        mockedGamification.recordQuizCompletion.mockResolvedValue({
            snapshot: { totalXp: 18, streakDays: 1, lastActiveDate: null, hearts: 5, maxHearts: 5, heartsNextRefillAt: null },
            award: { baseXp: 10, bonusXp: 8, totalXpAwarded: 18, reason: 'quiz_complete' },
        });
        mockedDailyGoal.recordXp.mockResolvedValue({
            goalPerDay: 3,
            completedToday: 1,
            isCompleted: false,
            dateKey: '2026-08-02',
        });
        mockedEvidence.append.mockResolvedValue({ accepted: true, issues: [] });
        mockedJourney.getSnapshot.mockResolvedValue(
            snapshotWith({ nodeId: 'node:lesson-1', nodeType: 'lesson' }),
        );
    });

    it('grava uma evidência por interação, com competência e tipo vindos do adaptador', async () => {
        await LessonOutcomeService.recordCompletion({
            block,
            nodeId: 'node:lesson-1',
            confirmedAnswers: { 'lesson-1-question': true },
            answeredAt: new Date('2026-08-02T12:00:00.000Z'),
        });

        expect(mockedEvidence.append).toHaveBeenCalledTimes(1);
        expect(mockedEvidence.append).toHaveBeenCalledWith({
            activityId: 'activity:legacy:block:lesson-1:intro',
            interactionId: 'lesson-1-question',
            competencyId: 'competency:legacy:lesson-1',
            evidenceKind: 'legacy-lesson-recall',
            outcome: 'correct',
            hintUsed: false,
            durationBand: 'unknown',
            contentVersion: 'legacy-lesson-catalog',
            recordedAt: '2026-08-02T12:00:00.000Z',
        });
    });

    it('registra incorrect quando a escolha confirmada não estava certa', async () => {
        await LessonOutcomeService.recordCompletion({
            block,
            nodeId: 'node:lesson-1',
            confirmedAnswers: { 'lesson-1-question': false },
            answeredAt: new Date('2026-08-02T12:00:00.000Z'),
        });

        expect(mockedEvidence.append).toHaveBeenCalledWith(
            expect.objectContaining({ outcome: 'incorrect' }),
        );
    });

    it('usa faixa de duração e dica informadas, quando o player as medir', async () => {
        await LessonOutcomeService.recordCompletion({
            block,
            nodeId: 'node:lesson-1',
            confirmedAnswers: { 'lesson-1-question': true },
            answeredAt: new Date('2026-08-02T12:00:00.000Z'),
            durationBandByInteraction: { 'lesson-1-question': '10-30s' },
            hintUsedByInteraction: { 'lesson-1-question': true },
        });

        expect(mockedEvidence.append).toHaveBeenCalledWith(
            expect.objectContaining({ durationBand: '10-30s', hintUsed: true }),
        );
    });

    it('grava evidência mesmo quando a conclusão não premia', async () => {
        mockedJourney.getSnapshot.mockResolvedValue(
            snapshotWith({
                nodeId: 'node:lesson-1',
                nodeType: 'lesson',
                completedNodeIds: ['node:lesson-1'],
            }),
        );

        const outcome = await LessonOutcomeService.recordCompletion({
            block,
            nodeId: 'node:lesson-1',
            confirmedAnswers: { 'lesson-1-question': true },
        });

        expect(outcome.rewarded).toBe(false);
        expect(mockedEvidence.append).toHaveBeenCalledTimes(1);
    });

    it('não derruba a conclusão quando a gravação de evidência falha', async () => {
        mockedEvidence.append.mockRejectedValue(new Error('storage indisponível'));
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

        const outcome = await LessonOutcomeService.recordCompletion({
            block,
            nodeId: 'node:lesson-1',
            confirmedAnswers: { 'lesson-1-question': true },
        });

        expect(outcome.rewarded).toBe(true);

        errorSpy.mockRestore();
    });

    describe('autorização do pagamento', () => {
        // A guarda de conquista mora em JourneyProgressService.markNodeCompleted,
        // que a tela chama DEPOIS deste serviço. Como o nó recusado nunca entra
        // em completedNodeIds, o predicado de reincidência (`!includes(nodeId)`)
        // nunca fecha e o mesmo deep link pagaria para sempre. Por isso a
        // autorização precisa existir também aqui: este serviço é a outra
        // escrita do mesmo fluxo.
        const lockedRule: UnlockRule = { requiresNodeIds: ['node:checkpoint-1'] };

        it('não premia um nó cuja regra de desbloqueio não está satisfeita', async () => {
            mockedJourney.getSnapshot.mockResolvedValue(
                snapshotWith({ nodeId: 'node:reward-1', nodeType: 'lesson', unlockRule: lockedRule })
            );
            const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

            const outcome = await LessonOutcomeService.recordCompletion({
                block,
                nodeId: 'node:reward-1',
                confirmedAnswers: { 'lesson-1-question': true },
            });

            expect(outcome.rewarded).toBe(false);
            expect(outcome.award).toBeNull();
            expect(mockedGamification.recordQuizCompletion).not.toHaveBeenCalled();
            expect(mockedDailyGoal.recordXp).not.toHaveBeenCalled();

            warnSpy.mockRestore();
        });

        it('recusa todas as vezes, e não só a primeira', async () => {
            // O defeito não era pagar uma vez: era pagar sempre, porque a recusa
            // da conquista impede o nó de entrar na lista que desligava o
            // pagamento. Três tentativas, zero pagamentos.
            mockedJourney.getSnapshot.mockResolvedValue(
                snapshotWith({ nodeId: 'node:reward-1', nodeType: 'lesson', unlockRule: lockedRule })
            );
            const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

            for (let tentativa = 0; tentativa < 3; tentativa += 1) {
                const outcome = await LessonOutcomeService.recordCompletion({
                    block,
                    nodeId: 'node:reward-1',
                    confirmedAnswers: { 'lesson-1-question': true },
                });
                expect(outcome.rewarded).toBe(false);
            }

            expect(mockedGamification.recordQuizCompletion).not.toHaveBeenCalled();

            warnSpy.mockRestore();
        });

        it('premia quando a mesma regra está satisfeita', async () => {
            // Contraprova: sem ela, uma guarda que recusasse tudo passaria nos
            // dois testes acima.
            mockedJourney.getSnapshot.mockResolvedValue(
                snapshotWith({
                    nodeId: 'node:reward-1',
                    nodeType: 'lesson',
                    unlockRule: lockedRule,
                    completedNodeIds: ['node:checkpoint-1'],
                })
            );

            const outcome = await LessonOutcomeService.recordCompletion({
                block,
                nodeId: 'node:reward-1',
                confirmedAnswers: { 'lesson-1-question': true },
            });

            expect(outcome.rewarded).toBe(true);
            expect(mockedGamification.recordQuizCompletion).toHaveBeenCalledTimes(1);
        });

        it('reavalia o card mesmo quando a autorização recusa o pagamento', async () => {
            // Recusar o pagamento não é recusar a informação: o recall aconteceu
            // e o SM-2 precisa saber, igual à lição refeita.
            mockedJourney.getSnapshot.mockResolvedValue(
                snapshotWith({ nodeId: 'node:reward-1', nodeType: 'lesson', unlockRule: lockedRule })
            );
            const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

            await LessonOutcomeService.recordCompletion({
                block,
                nodeId: 'node:reward-1',
                confirmedAnswers: { 'lesson-1-question': true },
            });

            expect(mockedSpacedRepetition.recordQuizResult).toHaveBeenCalledTimes(1);
            expect(mockedAttempts.append).toHaveBeenCalledTimes(1);

            warnSpy.mockRestore();
        });
    });
});

// O adaptador legado mapeia toda interação de uma lição para a mesma
// competência sintética (`competency:legacy:<lessonId>`), então um bloco com
// duas interações é o que prova "uma observação por competência, não uma por
// interação": as duas caem na mesma competência e precisam virar uma chamada
// só. A forma do segundo passo é copiada de `block.steps[1]` — já é
// `multiple-choice` — trocando só o `id`, para não inventar um formato de
// step que o `LessonBlock` real não tem.
const blocoComDuasInteracoes: LessonBlock = {
    ...block,
    steps: [
        ...block.steps,
        {
            step: {
                type: 'multiple-choice',
                payload: {
                    prompt: 'Segunda pergunta?',
                    options: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }],
                    correctOptionId: 'a',
                    explanation: 'Porque A.',
                },
            },
            contract: {
                id: 'lesson-1-question-2',
                type: 'multiple-choice',
                completionRule: 'answered',
                retryRule: 'allow_continue',
                branching: 'none',
            },
        },
    ],
};

describe('alimentação do agendador por competência', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedAttempts.append.mockResolvedValue(undefined);
        mockedEvidence.append.mockResolvedValue({ accepted: true, issues: [] });
        mockedGamification.recordQuizCompletion.mockResolvedValue({
            snapshot: { totalXp: 18, streakDays: 1, lastActiveDate: null, hearts: 5, maxHearts: 5, heartsNextRefillAt: null },
            award: { baseXp: 10, bonusXp: 8, totalXpAwarded: 18, reason: 'quiz_complete' },
        });
        mockedDailyGoal.recordXp.mockResolvedValue({
            goalPerDay: 3,
            completedToday: 1,
            isCompleted: false,
            dateKey: '2026-08-08',
        });
        mockedJourney.getSnapshot.mockResolvedValue(
            snapshotWith({ nodeId: 'node:lesson-1', nodeType: 'lesson' }),
        );
        mockedReview.observeExposure.mockReset();
        mockedReview.observeExposure.mockResolvedValue(undefined);
    });

    it('observa uma vez por competência, não uma por interação', async () => {
        await LessonOutcomeService.recordCompletion({
            block: blocoComDuasInteracoes,
            nodeId: 'node:lesson-1',
            confirmedAnswers: { 'lesson-1-question': true, 'lesson-1-question-2': true },
        });

        expect(mockedReview.observeExposure).toHaveBeenCalledTimes(1);
    });

    it('marca acerto só quando todas as interações da competência acertaram', async () => {
        await LessonOutcomeService.recordCompletion({
            block: blocoComDuasInteracoes,
            nodeId: 'node:lesson-1',
            confirmedAnswers: { 'lesson-1-question': true, 'lesson-1-question-2': false },
        });

        expect(mockedReview.observeExposure).toHaveBeenCalledWith(
            expect.objectContaining({ grade: { outcome: 'incorrect', hintUsed: false } }),
        );
    });

    it('marca dica quando qualquer interação da competência usou dica', async () => {
        await LessonOutcomeService.recordCompletion({
            block: blocoComDuasInteracoes,
            nodeId: 'node:lesson-1',
            confirmedAnswers: { 'lesson-1-question': true, 'lesson-1-question-2': true },
            hintUsedByInteraction: { 'lesson-1-question-2': true },
        });

        expect(mockedReview.observeExposure).toHaveBeenCalledWith(
            expect.objectContaining({ grade: { outcome: 'correct', hintUsed: true } }),
        );
    });

    it('não derruba a conclusão da atividade quando a observação falha', async () => {
        mockedReview.observeExposure.mockRejectedValue(new Error('storage'));
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

        await expect(LessonOutcomeService.recordCompletion({
            block: blocoComDuasInteracoes,
            nodeId: 'node:lesson-1',
            confirmedAnswers: { 'lesson-1-question': true, 'lesson-1-question-2': true },
        })).resolves.not.toThrow();

        errorSpy.mockRestore();
    });
});
