import type {
    CheckpointAttemptV1,
    CurriculumKind,
    ItemOutcomeV1,
    ReinforcementActivityKind,
    ReinforcementPlanV1,
    ResultingSupportState,
    UnitCheckpointAttemptIntentV1,
} from './contracts';

type CompletedReinforcementHistory = Readonly<{
    attempt: CheckpointAttemptV1;
    completedReinforcementPlan: ReinforcementPlanV1 | null;
}>;

export type UnitCheckpointEvaluationInput = Readonly<{
    operationId: string;
    checkpointId: string;
    flowId: string;
    attemptId: string;
    checkpointDefinitionId: string;
    unitId: string;
    journeyNodeId: string;
    activityId: string;
    contentVersion: string;
    curriculumKind: CurriculumKind;
    committedAt: string;
    itemOutcomes: readonly ItemOutcomeV1[];
    prior?: CompletedReinforcementHistory;
    xpDelta?: number;
    goalProgressDelta?: number;
}>;

export type UnitCheckpointEvaluation = Readonly<{
    attempt: CheckpointAttemptV1;
    reinforcementPlan: ReinforcementPlanV1 | null;
    intent: UnitCheckpointAttemptIntentV1;
}>;

const CYCLE_ONE_ACTIVITIES: readonly ReinforcementActivityKind[] = ['causal-explanation', 'guided-practice'];
const CYCLE_TWO_ACTIVITIES: readonly ReinforcementActivityKind[] = [
    'different-modality',
    'independent-application',
    'equivalent-checkpoint-variant',
];

function uniqueSorted(values: readonly string[]): string[] {
    return [...new Set(values)].sort();
}

function isNonNegativeInteger(value: unknown): value is number {
    return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}

function requireCatalogInput(input: UnitCheckpointEvaluationInput): void {
    const identifiers = [
        input.operationId,
        input.checkpointId,
        input.flowId,
        input.attemptId,
        input.checkpointDefinitionId,
        input.unitId,
        input.journeyNodeId,
        input.activityId,
        input.contentVersion,
        input.committedAt,
    ];
    if (identifiers.some((value) => typeof value !== 'string' || value.length === 0)
        || !Array.isArray(input.itemOutcomes) || input.itemOutcomes.length === 0) {
        throw new Error('invalid-unit-checkpoint-input');
    }
    if (input.curriculumKind !== 'v2'
        || input.itemOutcomes.some((item: ItemOutcomeV1) => item.competencyIds.some(
            (competencyId: string) => competencyId.startsWith('competency:legacy:'),
        ))) {
        throw new Error('legacy-curriculum-not-eligible');
    }
    if ((input.xpDelta !== undefined && !isNonNegativeInteger(input.xpDelta))
        || (input.goalProgressDelta !== undefined && !isNonNegativeInteger(input.goalProgressDelta))) {
        throw new Error('invalid-unit-checkpoint-input');
    }
}

function resolvePrior(prior: CompletedReinforcementHistory | undefined): {
    sourceAttemptId: string | null;
    reinforcementCycle: 0 | 1 | 2;
} {
    if (!prior) return { sourceAttemptId: null, reinforcementCycle: 0 };

    const { attempt, completedReinforcementPlan } = prior;
    if (attempt.passed || !completedReinforcementPlan || completedReinforcementPlan.sourceAttemptId !== attempt.attemptId) {
        throw new Error('reinforcement-sequence-invalid');
    }
    if (attempt.reinforcementCycle === 0 && attempt.resultingSupportState === 'cycle-1-required'
        && completedReinforcementPlan.reinforcementCycle === 1) {
        return { sourceAttemptId: attempt.attemptId, reinforcementCycle: 1 };
    }
    if (attempt.reinforcementCycle === 1 && attempt.resultingSupportState === 'cycle-2-required'
        && completedReinforcementPlan.reinforcementCycle === 2) {
        return { sourceAttemptId: attempt.attemptId, reinforcementCycle: 2 };
    }
    throw new Error('reinforcement-sequence-invalid');
}

function createReinforcementPlan(
    input: UnitCheckpointEvaluationInput,
    attempt: CheckpointAttemptV1,
    cycle: 1 | 2,
): ReinforcementPlanV1 {
    return Object.freeze({
        schemaVersion: 1,
        reinforcementPlanId: `reinforcement:${attempt.attemptId}:cycle:${cycle}`,
        checkpointDefinitionId: input.checkpointDefinitionId,
        unitId: input.unitId,
        sourceAttemptId: attempt.attemptId,
        reinforcementCycle: cycle,
        competencyIds: Object.freeze([...attempt.weakCompetencyIds]),
        requiredActivities: Object.freeze([...(cycle === 1 ? CYCLE_ONE_ACTIVITIES : CYCLE_TWO_ACTIVITIES)]),
    });
}

export class UnitCheckpointService {
    static evaluate(input: UnitCheckpointEvaluationInput): UnitCheckpointEvaluation {
        requireCatalogInput(input);
        const itemOutcomes = input.itemOutcomes.map((item) => Object.freeze({
            ...item,
            competencyIds: [...item.competencyIds],
        }));
        const totalItemCount = itemOutcomes.length;
        const correctItemCount = itemOutcomes.filter((item) => item.outcome === 'correct' && !item.isCriticalError).length;
        const criticalErrorCount = itemOutcomes.filter((item) => item.isCriticalError).length;
        const skippedItemCount = itemOutcomes.filter((item) => item.outcome === 'skipped').length;
        const scoreBasisPoints = Math.floor(10000 * correctItemCount / totalItemCount);
        const passed = scoreBasisPoints >= 8000 && criticalErrorCount === 0;
        const weakCompetencyIds = uniqueSorted(itemOutcomes.flatMap((item) => (
            item.outcome !== 'correct' || item.isCriticalError || item.hintUsed ? item.competencyIds : []
        )));
        const previous = resolvePrior(input.prior);
        const resultingSupportState: ResultingSupportState = passed
            ? 'none'
            : previous.reinforcementCycle === 0
                ? 'cycle-1-required'
                : previous.reinforcementCycle === 1
                    ? 'cycle-2-required'
                    : 'support-required';
        const attempt: CheckpointAttemptV1 = Object.freeze({
            schemaVersion: 1,
            attemptId: input.attemptId,
            checkpointDefinitionId: input.checkpointDefinitionId,
            unitId: input.unitId,
            journeyNodeId: input.journeyNodeId,
            contentVersion: input.contentVersion,
            itemOutcomes: Object.freeze(itemOutcomes),
            totalItemCount,
            correctItemCount,
            criticalErrorCount,
            skippedItemCount,
            scoreBasisPoints,
            passed,
            weakCompetencyIds: Object.freeze(weakCompetencyIds),
            sourceAttemptId: previous.sourceAttemptId,
            reinforcementCycle: previous.reinforcementCycle,
            resultingSupportState,
            committedAt: input.committedAt,
        });
        const reinforcementPlan = resultingSupportState === 'cycle-1-required'
            ? createReinforcementPlan(input, attempt, 1)
            : resultingSupportState === 'cycle-2-required'
                ? createReinforcementPlan(input, attempt, 2)
                : null;
        const intent: UnitCheckpointAttemptIntentV1 = {
            schemaVersion: 1,
            intentKind: 'unit-checkpoint-attempt',
            operationId: input.operationId,
            checkpointId: input.checkpointId,
            flowId: input.flowId,
            attemptId: input.attemptId,
            surface: 'unit-checkpoint',
            contentVersion: input.contentVersion,
            checkpointDefinitionId: input.checkpointDefinitionId,
            unitId: input.unitId,
            journeyNodeId: input.journeyNodeId,
            activityId: input.activityId,
            itemOutcomes: itemOutcomes.map((item) => ({ ...item, competencyIds: [...item.competencyIds] })),
            totalItemCount,
            correctItemCount,
            criticalErrorCount,
            skippedItemCount,
            scoreBasisPoints,
            passed,
            weakCompetencyIds,
            reinforcementPlanId: reinforcementPlan?.reinforcementPlanId ?? null,
            sourceAttemptId: previous.sourceAttemptId,
            reinforcementCycle: previous.reinforcementCycle,
            resultingSupportState,
            xpDelta: input.xpDelta ?? 0,
            goalProgressDelta: input.goalProgressDelta ?? 0,
            completesJourneyNode: passed,
            committedAt: input.committedAt,
            plannedSyncEvents: [],
        };
        return Object.freeze({ attempt, reinforcementPlan, intent });
    }
}
