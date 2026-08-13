import * as studentCheckpoints from './index';
import { validateCommitIntent } from './schemas';
import { itemOutcome } from './testFixtures';

type UnitCheckpointServiceContract = {
    evaluate(input: Record<string, unknown>): {
        attempt: Record<string, unknown>;
        reinforcementPlan: Record<string, unknown> | null;
        intent: Record<string, unknown>;
    };
};

const service = () => (studentCheckpoints as typeof studentCheckpoints & {
    UnitCheckpointService: UnitCheckpointServiceContract;
}).UnitCheckpointService;

function submission(overrides: Record<string, unknown> = {}): Record<string, unknown> {
    return {
        operationId: 'operation-unit-1',
        checkpointId: 'checkpoint-unit-1',
        flowId: 'flow-unit-1',
        attemptId: 'attempt-unit-1',
        checkpointDefinitionId: 'checkpoint-definition-1',
        unitId: 'unit-1',
        journeyNodeId: 'node-unit-1',
        activityId: 'activity-unit-1',
        contentVersion: 'content-v2',
        curriculumKind: 'v2',
        committedAt: '2026-08-13T14:40:00.000Z',
        itemOutcomes: [itemOutcome({
            itemId: 'item-1',
            activityId: 'activity-unit-1',
            competencyIds: ['competency:unit-1:positioning'],
        })],
        ...overrides,
    };
}

describe('UnitCheckpointService', () => {
    it('passes at the inclusive 80% boundary and unlocks independently from XP', () => {
        const result = service().evaluate(submission({
            itemOutcomes: [
                itemOutcome({ itemId: 'item-1', activityId: 'activity-unit-1', competencyIds: ['competency:unit-1:positioning'] }),
                itemOutcome({ itemId: 'item-2', activityId: 'activity-unit-1', competencyIds: ['competency:unit-1:positioning'] }),
                itemOutcome({ itemId: 'item-3', activityId: 'activity-unit-1', competencyIds: ['competency:unit-1:positioning'] }),
                itemOutcome({ itemId: 'item-4', activityId: 'activity-unit-1', competencyIds: ['competency:unit-1:positioning'] }),
                itemOutcome({ itemId: 'item-5', activityId: 'activity-unit-1', competencyIds: ['competency:unit-1:positioning'], outcome: 'incorrect' }),
            ],
            xpDelta: 0,
        }));

        expect(result.attempt).toMatchObject({ scoreBasisPoints: 8000, passed: true, resultingSupportState: 'none' });
        expect(result.intent).toMatchObject({ completesJourneyNode: true, xpDelta: 0, reinforcementPlanId: null });
        expect(validateCommitIntent(result.intent).ok).toBe(true);
        expect(result.reinforcementPlan).toBeNull();
    });

    it('turns a failed initial attempt into a cycle-one plan only for weak competencies', () => {
        const result = service().evaluate(submission({
            itemOutcomes: [
                itemOutcome({ itemId: 'item-1', activityId: 'activity-unit-1', competencyIds: ['competency:unit-1:positioning'] }),
                itemOutcome({ itemId: 'item-2', activityId: 'activity-unit-1', competencyIds: ['competency:unit-1:protection'], outcome: 'skipped' }),
            ],
        }));

        expect(result.attempt).toMatchObject({ scoreBasisPoints: 5000, skippedItemCount: 1, passed: false, resultingSupportState: 'cycle-1-required' });
        expect(result.reinforcementPlan).toMatchObject({
            reinforcementCycle: 1,
            competencyIds: ['competency:unit-1:protection'],
            requiredActivities: ['causal-explanation', 'guided-practice'],
        });
        expect(result.intent).toMatchObject({ completesJourneyNode: false, resultingSupportState: 'cycle-1-required' });
    });

    it('does not compensate a critical error or a hint with unrelated correct answers', () => {
        const result = service().evaluate(submission({
            itemOutcomes: [
                itemOutcome({ itemId: 'item-1', activityId: 'activity-unit-1', competencyIds: ['competency:unit-1:critical'], isCriticalError: true }),
                itemOutcome({ itemId: 'item-2', activityId: 'activity-unit-1', competencyIds: ['competency:unit-1:hint'], hintUsed: true }),
                itemOutcome({ itemId: 'item-3', activityId: 'activity-unit-1', competencyIds: ['competency:unit-1:other'] }),
                itemOutcome({ itemId: 'item-4', activityId: 'activity-unit-1', competencyIds: ['competency:unit-1:other'] }),
                itemOutcome({ itemId: 'item-5', activityId: 'activity-unit-1', competencyIds: ['competency:unit-1:other'] }),
            ],
        }));

        expect(result.attempt).toMatchObject({ scoreBasisPoints: 8000, criticalErrorCount: 1, passed: false });
        expect(result.attempt.weakCompetencyIds).toEqual(['competency:unit-1:critical', 'competency:unit-1:hint']);
    });

    it('counts a multi-competency item once in the score and both competencies when it is weak', () => {
        const result = service().evaluate(submission({
            itemOutcomes: [itemOutcome({
                activityId: 'activity-unit-1',
                competencyIds: ['competency:unit-1:protection', 'competency:unit-1:positioning'],
                outcome: 'incorrect',
            })],
        }));

        expect(result.attempt).toMatchObject({ totalItemCount: 1, correctItemCount: 0, scoreBasisPoints: 0 });
        expect(result.attempt.weakCompetencyIds).toEqual(['competency:unit-1:positioning', 'competency:unit-1:protection']);
    });

    it('requires the exact completed two-cycle sequence before support is required', () => {
        const first = service().evaluate(submission({
            itemOutcomes: [itemOutcome({ activityId: 'activity-unit-1', outcome: 'incorrect' })],
        }));
        const second = service().evaluate(submission({
            operationId: 'operation-unit-2',
            checkpointId: 'checkpoint-unit-2',
            flowId: 'flow-unit-2',
            attemptId: 'attempt-unit-2',
            prior: { attempt: first.attempt, completedReinforcementPlan: first.reinforcementPlan },
            itemOutcomes: [itemOutcome({ activityId: 'activity-unit-1', outcome: 'incorrect' })],
        }));
        const third = service().evaluate(submission({
            operationId: 'operation-unit-3',
            checkpointId: 'checkpoint-unit-3',
            flowId: 'flow-unit-3',
            attemptId: 'attempt-unit-3',
            prior: { attempt: second.attempt, completedReinforcementPlan: second.reinforcementPlan },
            itemOutcomes: [itemOutcome({ activityId: 'activity-unit-1', outcome: 'incorrect' })],
        }));

        expect(second.reinforcementPlan).toMatchObject({ reinforcementCycle: 2, requiredActivities: ['different-modality', 'independent-application', 'equivalent-checkpoint-variant'] });
        expect(third.attempt).toMatchObject({ reinforcementCycle: 2, resultingSupportState: 'support-required', passed: false });
        expect(third.intent).toMatchObject({ completesJourneyNode: false, reinforcementPlanId: null });
        expect(third.reinforcementPlan).toBeNull();
    });

    it('fails closed for legacy curriculum and incomplete reinforcement history', () => {
        expect(() => service().evaluate(submission({ curriculumKind: 'legacy' }))).toThrow('legacy-curriculum-not-eligible');
        expect(() => service().evaluate(submission({
            prior: {
                attempt: {
                    reinforcementCycle: 0,
                    resultingSupportState: 'cycle-1-required',
                    attemptId: 'attempt-prior',
                    passed: false,
                },
                completedReinforcementPlan: null,
            },
        }))).toThrow('reinforcement-sequence-invalid');
    });

    it('derives the same immutable result for an idempotent reexecution', () => {
        const input = submission({ itemOutcomes: [itemOutcome({ activityId: 'activity-unit-1', outcome: 'incorrect' })] });

        expect(service().evaluate(input)).toEqual(service().evaluate(input));
    });
});
