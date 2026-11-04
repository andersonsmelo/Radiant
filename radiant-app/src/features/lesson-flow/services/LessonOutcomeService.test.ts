import type { LessonBlock } from '../../../types/lessonFlow';
import type { LearningActivityV2 } from '../../../types/learningActivity';
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
import { OnboardingService } from '../../onboarding/OnboardingService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { assessmentAttemptRepository } from '../../student-checkpoints/AssessmentAttemptRepository';
import { MATERIA_ENERGIA_E_RADIACAO_PRODUCTION_BATCH as productionBatch } from '../../student-checkpoints/production-batches';
import { ItemReviewService } from '../../spaced-repetition/services/ItemReviewService';
import { itemReviewRepository } from '../../spaced-repetition/repositories/ItemReviewRepository';
import { STORAGE_KEYS } from '../../../constants/storageKeys';

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

jest.mock('../../gamification/services/GamificationService', () => ({
    GamificationService: { recordQuizCompletion: jest.fn() },
}));

jest.mock('../../spaced-repetition/services/SpacedRepetitionService', () => ({
    SpacedRepetitionService: { recordQuizResult: jest.fn(), getCardState: jest.fn() },
}));

jest.mock('../../daily-goal/services/DailyGoalService', () => ({
    DailyGoalService: { recordXp: jest.fn() },
}));

jest.mock('../../hearts/HeartsRepository', () => ({
    heartsRepository: { rewardReview: jest.fn().mockResolvedValue(undefined) },
}));

// A conclusão lê a trilha DO NÓ (`getSnapshotForNode`); os casos configuram
// `getSnapshot`, e as duas portas devolvem o mesmo snapshot aqui.
jest.mock('../../journey/services/JourneyProgressService', () => {
    const getSnapshot = jest.fn();
    return {
        JourneyProgressService: {
            getSnapshot,
            getSnapshotForNode: jest.fn((...args: unknown[]) => getSnapshot(...args)),
        },
    };
});

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

const nativeActivity: LearningActivityV2 = {
    id: 'activity:materia-energia-e-radiacao:01',
    competencyIds: ['competency:materia-energia-e-radiacao:estrutura-atomica-e-ionizacao'],
    provenance: {
        contentVersion: 'h4-materia-energia-e-radiacao-candidate-2026-08-13',
        sourceIds: ['source:h4:s1'],
    },
    steps: [
        { kind: 'presentation', id: 'native-hook', role: 'hook', payload: { title: 'Estrutura', body: 'Corpo' } },
        {
            kind: 'interaction',
            interaction: {
                id: 'native-question',
                type: 'multiple-choice',
                competencyIds: ['competency:materia-energia-e-radiacao:estrutura-atomica-e-ionizacao'],
                evidenceKind: 'guided-practice',
                completionRule: 'answered',
                criticalSafety: false,
                feedback: { correct: 'Correto.', incorrect: 'Revise.' },
                accessibility: { label: 'Qual partícula tem carga negativa?' },
                payload: {
                    prompt: 'Qual partícula tem carga negativa?',
                    options: [{ id: 'proton', label: 'Próton' }, { id: 'eletron', label: 'Elétron' }],
                    correctOptionId: 'eletron',
                },
            },
        },
        { kind: 'presentation', id: 'native-closing', role: 'closing', payload: { title: 'Síntese' } },
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
    nodeType: 'lesson' | 'review' | 'checkpoint';
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
    beforeEach(async () => {
        jest.clearAllMocks();
        await AsyncStorage.clear();
        await OnboardingService.reset();
        mockedGamification.recordQuizCompletion.mockResolvedValue({
            snapshot: { totalXp: 18, streakDays: 1, lastActiveDate: null },
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

    it.each(['legacy', 'activity'] as const)('records first value once after a %s lesson completes', async (kind) => {
        mockedJourney.getSnapshot.mockResolvedValue(snapshotWith({ nodeId: 'node:lesson-1', nodeType: 'lesson' }));
        const complete = () => kind === 'legacy'
            ? LessonOutcomeService.recordCompletion({ block, nodeId: 'node:lesson-1', confirmedAnswers: { 'lesson-1-question': true } })
            : LessonOutcomeService.recordActivityCompletion({ activity: nativeActivity, nodeId: 'node:lesson-1', confirmedAnswers: { 'native-question': true } });
        await complete();
        const first = JSON.parse((await AsyncStorage.getItem('@radiant/onboarding'))!);
        expect(first.firstQuizAt).toEqual(expect.any(Number));
        await complete();
        const repeated = JSON.parse((await AsyncStorage.getItem('@radiant/onboarding'))!);
        expect(repeated.firstQuizAt).toBe(first.firstQuizAt);
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
        expect(JSON.parse((await AsyncStorage.getItem('@radiant/onboarding'))!).firstReviewAt).toEqual(expect.any(Number));
        expect(mockedGamification.recordQuizCompletion).toHaveBeenCalledTimes(1);
    });

    // ADR de 2026-09-14: "concluir uma revisão devida devolve uma" vida. Só a
    // tela `/review` devolvia; a revisão da trilha, não (avaliação de
    // 2026-10-16). A devolução vale para a revisão vencida, a que premia.
    it('revisão vencida da trilha devolve uma vida', async () => {
        const { heartsRepository } = jest.requireMock('../../hearts/HeartsRepository') as {
            heartsRepository: { rewardReview: jest.Mock };
        };
        mockedJourney.getSnapshot.mockResolvedValue(
            snapshotWith({
                nodeId: 'node:review:lesson-1',
                nodeType: 'review',
                completedNodeIds: ['node:review:lesson-1'],
                pendingReviewNodeIds: ['node:review:lesson-1'],
            })
        );

        await LessonOutcomeService.recordCompletion({
            block,
            nodeId: 'node:review:lesson-1',
            confirmedAnswers: { 'lesson-1-question': false },
        });

        expect(heartsRepository.rewardReview).toHaveBeenCalledTimes(1);
    });

    it('resolve a premiação pela trilha do nó, que pode não ser a ativa', async () => {
        const { JourneyProgressService: journey } = jest.requireMock('../../journey/services/JourneyProgressService') as {
            JourneyProgressService: { getSnapshotForNode: jest.Mock };
        };
        mockedJourney.getSnapshot.mockResolvedValue(
            snapshotWith({ nodeId: 'node:review:lesson-1', nodeType: 'review', pendingReviewNodeIds: ['node:review:lesson-1'] })
        );

        await LessonOutcomeService.recordCompletion({
            block,
            nodeId: 'node:review:lesson-1',
            confirmedAnswers: { 'lesson-1-question': true },
        });

        expect(journey.getSnapshotForNode).toHaveBeenCalledWith('node:review:lesson-1');
    });

    it('revisão fora de prazo e lição não devolvem vida', async () => {
        const { heartsRepository } = jest.requireMock('../../hearts/HeartsRepository') as {
            heartsRepository: { rewardReview: jest.Mock };
        };
        mockedJourney.getSnapshot.mockResolvedValue(
            snapshotWith({ nodeId: 'node:review:lesson-1', nodeType: 'review', pendingReviewNodeIds: [] })
        );
        await LessonOutcomeService.recordCompletion({
            block,
            nodeId: 'node:review:lesson-1',
            confirmedAnswers: { 'lesson-1-question': true },
        });

        mockedJourney.getSnapshot.mockResolvedValue(snapshotWith({ nodeId: 'node:lesson-1', nodeType: 'lesson' }));
        await LessonOutcomeService.recordCompletion({
            block,
            nodeId: 'node:lesson-1',
            confirmedAnswers: { 'lesson-1-question': true },
        });

        expect(heartsRepository.rewardReview).not.toHaveBeenCalled();
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

        // A tentativa sai mesmo quando a gravação falha: a tela de conclusão a
        // usa para montar estrelas e placar, e um storage cheio não pode deixar
        // o aluno sem tela de fim de lição.
        await expect(
            LessonOutcomeService.recordCompletion({
                block,
                nodeId: 'node:lesson-1',
                confirmedAnswers: { 'lesson-1-question': true },
            })
        ).resolves.toEqual({
            award: null,
            rewarded: true,
            result: expect.objectContaining({
                lessonId: 'lesson-1',
                correctAnswers: 1,
                totalQuestions: 1,
            }),
        });

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
    it('a conclusão real de uma atividade reduz o reforço persistido; sair sem concluir não reduz', async () => {
        await AsyncStorage.clear();
        const activity = productionBatch.activities[0];
        await assessmentAttemptRepository.submit({
            operationId: 'operation:integration', checkpointId: 'checkpoint:integration', flowId: 'flow:integration',
            attemptId: 'attempt:integration', checkpointDefinitionId: 'definition:integration', unitId: productionBatch.unitId,
            journeyNodeId: 'node:assessment-integration', activityId: productionBatch.batchId,
            contentVersion: productionBatch.contentVersion, curriculumKind: 'v2', committedAt: '2026-10-12T12:00:00Z',
            itemOutcomes: [{ itemId: 'item:integration', activityId: activity.id, competencyIds: [...activity.competencyIds],
                evidenceKind: 'independent-recall', outcome: 'incorrect', isCriticalError: false, hintUsed: false, durationBucket: 'unknown' }],
        }, productionBatch.activities);
        expect((await assessmentAttemptRepository.getState('node:assessment-integration')).remainingActivityIds)
            .toEqual(['activity:materia-energia-e-radiacao:01', 'activity:materia-energia-e-radiacao:02', 'activity:materia-energia-e-radiacao:03']);
        await LessonOutcomeService.recordActivityCompletion({
            activity, nodeId: 'node:lesson-1',
            confirmedAnswers: Object.fromEntries(activity.steps.flatMap(step => step.kind === 'interaction' ? [[step.interaction.id, true]] : [])),
        });
        const state = await assessmentAttemptRepository.getState('node:assessment-integration');
        expect(state.remainingActivityIds).toEqual(['activity:materia-energia-e-radiacao:02', 'activity:materia-energia-e-radiacao:03']);
        expect(state.blocked).toBe(true);
    });
    beforeEach(() => {
        // Este describe é irmão do de cima, não filho: o beforeEach dele não roda
        // aqui, e sem limpar os mocks as contagens de chamada acumulam entre os
        // dois blocos.
        jest.clearAllMocks();
        mockedAttempts.append.mockResolvedValue(undefined);
        mockedGamification.recordQuizCompletion.mockResolvedValue({
            snapshot: { totalXp: 18, streakDays: 1, lastActiveDate: null },
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

    it('grava a competência e a versão reais de uma atividade v2 promovida', async () => {
        await LessonOutcomeService.recordActivityCompletion({
            activity: nativeActivity,
            nodeId: 'node:lesson-1',
            confirmedAnswers: { 'native-question': true },
            answeredAt: new Date('2026-08-13T20:00:00.000Z'),
        });

        expect(mockedEvidence.append).toHaveBeenCalledWith({
            activityId: nativeActivity.id,
            interactionId: 'native-question',
            competencyId: 'competency:materia-energia-e-radiacao:estrutura-atomica-e-ionizacao',
            evidenceKind: 'guided-practice',
            outcome: 'correct',
            hintUsed: false,
            durationBand: 'unknown',
            contentVersion: 'h4-materia-energia-e-radiacao-candidate-2026-08-13',
            recordedAt: '2026-08-13T20:00:00.000Z',
        });
        expect(mockedSpacedRepetition.recordQuizResult).toHaveBeenCalledWith(
            expect.objectContaining({ lessonId: nativeActivity.id, totalQuestions: 1, correctAnswers: 1 }),
        );
    });

    it('atividade com duas interações: o placar conta a PRIMEIRA resposta, não a final (ADR da régua, 2026-10-18)', async () => {
        // Defeito medido no simulador em 2026-10-24: o aluno errou a primeira
        // resposta de um item da aula-bancada, acertou na volta e a conclusão
        // disse "Três estrelas". `activityToQuizResult` contava só as finais.
        const base = nativeActivity.steps[1];
        if (base.kind !== 'interaction') throw new Error('Fixture sem interação');
        const duasInteracoes: LearningActivityV2 = {
            ...nativeActivity,
            steps: [
                nativeActivity.steps[0],
                base,
                { kind: 'interaction', interaction: { ...base.interaction, id: 'native-question-2' } },
                nativeActivity.steps[2],
            ],
        };

        const outcome = await LessonOutcomeService.recordActivityCompletion({
            activity: duasInteracoes,
            nodeId: 'node:lesson-1',
            confirmedAnswers: { 'native-question': true, 'native-question-2': true },
            firstConfirmedAnswers: { 'native-question': true, 'native-question-2': false },
            answeredAt: new Date('2026-10-24T12:00:00.000Z'),
        });

        expect(outcome.result).toMatchObject({ correctAnswers: 1, totalQuestions: 2 });
        expect(mockedSpacedRepetition.recordQuizResult).toHaveBeenCalledWith(
            expect.objectContaining({ correctAnswers: 1, totalQuestions: 2 }),
        );
        // Validade: sem `firstConfirmedAnswers` (caminho não híbrido), vale a
        // resposta final e o placar continua cheio.
        const semPrimeira = await LessonOutcomeService.recordActivityCompletion({
            activity: duasInteracoes,
            nodeId: 'node:lesson-1',
            confirmedAnswers: { 'native-question': true, 'native-question-2': true },
            answeredAt: new Date('2026-10-24T12:01:00.000Z'),
        });
        expect(semPrimeira.result).toMatchObject({ correctAnswers: 2, totalQuestions: 2 });
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
            snapshot: { totalXp: 18, streakDays: 1, lastActiveDate: null },
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

// FILA, 13 (decidido pelo dono em 2026-10-09): aprovar uma avaliação da V2
// rende XP pela mesma regra da lição — base mais bônus de acerto, sequência e
// meta diária —, só na primeira aprovação. A tentativa já foi registrada pelo
// `UnitCheckpointService`; daqui só sai a recompensa.
describe('LessonOutcomeService — aprovação de avaliação da V2', () => {
    const nodeId = 'node:checkpoint-1:competencia-1';
    const answeredAt = new Date('2026-10-09T15:00:00.000Z');

    beforeEach(() => {
        jest.clearAllMocks();
        mockedGamification.recordQuizCompletion.mockResolvedValue({
            snapshot: { totalXp: 138, streakDays: 4, lastActiveDate: '2026-10-09' },
            award: { baseXp: 10, bonusXp: 8, totalXpAwarded: 18, reason: 'quiz_complete' },
        });
        mockedDailyGoal.recordXp.mockResolvedValue({
            goalPerDay: 3,
            completedToday: 1,
            isCompleted: false,
            dateKey: '2026-10-09',
        });
    });

    it('credita XP, sequência e meta diária na primeira aprovação', async () => {
        mockedJourney.getSnapshot.mockResolvedValue(snapshotWith({ nodeId, nodeType: 'checkpoint' }));

        const outcome = await LessonOutcomeService.recordAssessmentApproval({
            nodeId,
            totalQuestions: 2,
            correctAnswers: 2,
            answeredAt,
        });

        expect(outcome.rewarded).toBe(true);
        expect(outcome.award?.totalXpAwarded).toBe(18);
        expect(mockedGamification.recordQuizCompletion).toHaveBeenCalledWith(
            expect.objectContaining({ totalQuestions: 2, correctAnswers: 2, answeredAt }),
        );
        expect(mockedDailyGoal.recordXp).toHaveBeenCalledWith(18, answeredAt);
    });

    it('não credita de novo uma avaliação já aprovada', async () => {
        mockedJourney.getSnapshot.mockResolvedValue(
            snapshotWith({ nodeId, nodeType: 'checkpoint', completedNodeIds: [nodeId] }),
        );

        const outcome = await LessonOutcomeService.recordAssessmentApproval({
            nodeId,
            totalQuestions: 2,
            correctAnswers: 2,
            answeredAt,
        });

        expect(outcome).toEqual({ award: null, rewarded: false });
        expect(mockedGamification.recordQuizCompletion).not.toHaveBeenCalled();
        expect(mockedDailyGoal.recordXp).not.toHaveBeenCalled();
    });

    it('não credita uma avaliação que não está destravada', async () => {
        jest.spyOn(console, 'warn').mockImplementation(() => undefined);
        mockedJourney.getSnapshot.mockResolvedValue(
            snapshotWith({ nodeId, nodeType: 'checkpoint', unlockRule: { requiresNodeIds: ['node:lesson-1'] } }),
        );

        const outcome = await LessonOutcomeService.recordAssessmentApproval({
            nodeId,
            totalQuestions: 2,
            correctAnswers: 2,
            answeredAt,
        });

        expect(outcome).toEqual({ award: null, rewarded: false });
        expect(mockedGamification.recordQuizCompletion).not.toHaveBeenCalled();
        jest.restoreAllMocks();
    });

    it('não grava de novo a tentativa: nem recall, nem evidência, nem sync', async () => {
        mockedJourney.getSnapshot.mockResolvedValue(snapshotWith({ nodeId, nodeType: 'checkpoint' }));

        await LessonOutcomeService.recordAssessmentApproval({
            nodeId,
            totalQuestions: 2,
            correctAnswers: 2,
            answeredAt,
        });

        expect(mockedGamification.recordQuizCompletion).toHaveBeenCalledTimes(1);
        expect(mockedSpacedRepetition.recordQuizResult).not.toHaveBeenCalled();
        expect(mockedAttempts.append).not.toHaveBeenCalled();
        expect(mockedEvidence.append).not.toHaveBeenCalled();
        expect(mockedSyncQueue.enqueueLessonProgressFromQuizResult).not.toHaveBeenCalled();
    });
});

describe('LessonOutcomeService — journal G4 no caminho real', () => {
    beforeEach(async () => {
        jest.clearAllMocks();
        await AsyncStorage.clear();
        mockedJourney.getSnapshot.mockResolvedValue(snapshotWith({ nodeId: 'node:lesson-1', nodeType: 'lesson' }));
        mockedGamification.recordQuizCompletion.mockResolvedValue({ snapshot: { totalXp: 18, streakDays: 1, lastActiveDate: null }, award: { baseXp: 10, bonusXp: 8, totalXpAwarded: 18, reason: 'quiz_complete' } });
        mockedSyncQueue.enqueueLessonProgressFromQuizResult.mockResolvedValue(undefined);
    });
    const promotedInteraction = productionBatch.activities[0].steps.find(step => step.kind === 'interaction');
    const interactionId = promotedInteraction?.kind === 'interaction' ? promotedInteraction.interaction.id : '';
    const input = () => ({ activity: productionBatch.activities[0], nodeId: 'node:lesson-1', attemptId: 'study:integration',
        confirmedAnswers: { [interactionId]: true }, answeredAt: new Date('2026-10-17T12:00:00.000Z') });
    it('deduplica tentativa, agenda, rollup e recompensa após repetir o mesmo commit', async () => {
        const first = await LessonOutcomeService.recordActivityCompletion(input());
        const second = await LessonOutcomeService.recordActivityCompletion(input());
        expect(first.rewarded).toBe(true); expect(second.rewarded).toBe(false);
        expect(await itemReviewRepository.getAttempts()).toHaveLength(1);
        expect(await itemReviewRepository.getCards()).toHaveLength(1);
        expect(mockedSpacedRepetition.recordQuizResult).toHaveBeenCalledTimes(1);
        expect(mockedAttempts.append).toHaveBeenCalledTimes(1);
        expect(mockedGamification.recordQuizCompletion).toHaveBeenCalledTimes(1);
        expect(mockedReview.observeExposure).toHaveBeenCalledTimes(1);
    });
    it('resolve a atividade promovida real na fila vencida e registra a autoavaliação assistida', async () => {
        await LessonOutcomeService.recordActivityCompletion(input());
        const queue = await ItemReviewService.loadQueue([], new Date('2026-10-18T12:00:00.000Z'));
        expect(queue).toHaveLength(1);
        expect(queue[0].question.id).toBe(interactionId);
        expect(queue[0].lessonId).toBe(productionBatch.activities[0].id);
        expect((await ItemReviewService.recordReview(queue[0], true, new Date('2026-10-18T12:00:00.000Z'))).accepted).toBe(true);
        expect((await itemReviewRepository.getAttempts())[1]).toMatchObject({ mode: 'self-review', hintUsed: true });
    });
    it('não observa domínio/agenda de competência quando o journal não pode persistir', async () => {
        const raw = '{"schemaVersion":"item-review.v9","future":true}';
        await AsyncStorage.setItem(STORAGE_KEYS.ITEM_REVIEW, raw);
        await LessonOutcomeService.recordActivityCompletion(input());
        expect(mockedReview.observeExposure).not.toHaveBeenCalled();
        expect(mockedSpacedRepetition.recordQuizResult).not.toHaveBeenCalled();
        expect(await AsyncStorage.getItem(STORAGE_KEYS.ITEM_REVIEW)).toBe(raw);
    });
    it('mantém o erro inicial mesmo quando a resposta final veio correta após ajuda', async () => {
        await LessonOutcomeService.recordActivityCompletion({ ...input(), firstConfirmedAnswers: { [interactionId]: false }, hintUsedByInteraction: { [interactionId]: true } });
        expect((await itemReviewRepository.getAttempts())[0]).toMatchObject({ firstOutcome: 'incorrect', finalOutcome: 'correct', hintUsed: true });
        expect(mockedReview.observeExposure).toHaveBeenCalledWith(expect.objectContaining({ grade: { outcome: 'incorrect', hintUsed: true } }));
    });
    it('M3 journal tem um registro por item, placar inicial e correção final sem duplicar crédito', async () => {
        const second = { ...block.steps[1], contract: { ...block.steps[1].contract, id: 'lesson-1-q2' } };
        const hybrid: LessonBlock = { ...block, sessionMode: 'hybrid-lesson', steps: [...block.steps, second] };
        const input = {
            block: hybrid, nodeId: 'node:lesson-1', attemptId: 'hybrid:once',
            firstConfirmedAnswers: { 'lesson-1-question': false, 'lesson-1-q2': true },
            confirmedAnswers: { 'lesson-1-question': true, 'lesson-1-q2': true },
            answeredAt: new Date('2026-10-18T12:00:00.000Z'),
        };
        const first = await LessonOutcomeService.recordCompletion(input);
        await LessonOutcomeService.recordCompletion(input);
        expect(first.result).toMatchObject({ correctAnswers: 1, totalQuestions: 2 });
        expect(await itemReviewRepository.getAttempts()).toHaveLength(2);
        expect(await itemReviewRepository.getAttempts()).toEqual(expect.arrayContaining([
            expect.objectContaining({ firstOutcome: 'incorrect', finalOutcome: 'correct' }),
            expect.objectContaining({ firstOutcome: 'correct', finalOutcome: 'correct' }),
        ]));
        expect(mockedGamification.recordQuizCompletion).toHaveBeenCalledTimes(1);
        expect(mockedSpacedRepetition.recordQuizResult).toHaveBeenCalledTimes(1);
        expect(mockedAttempts.append).toHaveBeenCalledTimes(1);
    });

});
