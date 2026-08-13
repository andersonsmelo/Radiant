import type {
    CommitIntentV1,
    ItemOutcomeV1,
    StudentCheckpointV1,
    SyncEventV1,
} from './contracts';

export const FIXED_NOW = '2026-08-09T12:00:00.000Z';

export function itemOutcome(overrides: Partial<ItemOutcomeV1> = {}): ItemOutcomeV1 {
    return {
        itemId: 'item-1',
        activityId: 'activity-1',
        competencyIds: ['competency-1'],
        evidenceKind: 'independent-recall',
        outcome: 'correct',
        isCriticalError: false,
        hintUsed: false,
        durationBucket: '10-30s',
        ...overrides,
    };
}

export function syncEvent(): Extract<SyncEventV1, { eventName: 'journey_completion_confirmed' }> {
    return {
        schemaVersion: 1,
        eventName: 'journey_completion_confirmed',
        occurredAt: FIXED_NOW,
        operationId: 'operation-1',
        attemptId: 'attempt-1',
        journeyNodeId: 'node-1',
        unitId: 'unit-1',
        contentVersion: 'content-v1',
    };
}

export function checkpoint(overrides: Partial<StudentCheckpointV1> = {}): StudentCheckpointV1 {
    return {
        schemaVersion: 1,
        checkpointId: 'checkpoint-1',
        flowId: 'flow-1',
        surface: 'lesson',
        phase: 'entered',
        lessonId: 'lesson-1',
        unitId: 'unit-1',
        journeyNodeId: 'node-1',
        contentVersion: 'content-v1',
        cursorId: 'step-1',
        progressPercent: 0,
        completedStepCount: 0,
        totalStepCount: 1,
        nextAction: 'resume',
        sequence: 1,
        restoreFailureCount: 0,
        createdAt: FIXED_NOW,
        updatedAt: FIXED_NOW,
        expiresAt: '2026-08-10T12:00:00.000Z',
        ...overrides,
    };
}

export function lessonIntent(overrides: Partial<Extract<CommitIntentV1, { intentKind: 'lesson-completion' }>> = {}): Extract<CommitIntentV1, { intentKind: 'lesson-completion' }> {
    return {
        schemaVersion: 1,
        intentKind: 'lesson-completion',
        operationId: 'operation-1',
        checkpointId: 'checkpoint-1',
        flowId: 'flow-1',
        attemptId: 'attempt-1',
        surface: 'lesson',
        contentVersion: 'content-v1',
        lessonId: 'lesson-1',
        unitId: 'unit-1',
        journeyNodeId: 'node-1',
        activityId: 'activity-1',
        itemOutcomes: [itemOutcome()],
        totalItemCount: 1,
        correctItemCount: 1,
        scoreBasisPoints: 10000,
        eligibleForReward: true,
        completesJourneyNode: true,
        xpDelta: 10,
        goalProgressDelta: 1,
        committedAt: FIXED_NOW,
        plannedSyncEvents: [{ eventId: 'event-1', event: syncEvent() }],
        ...overrides,
    };
}

export function reviewIntent(): Extract<CommitIntentV1, { intentKind: 'review-completion' }> {
    return {
        schemaVersion: 1,
        intentKind: 'review-completion',
        operationId: 'operation-review',
        checkpointId: 'checkpoint-review',
        flowId: 'flow-review',
        reviewSessionId: 'review-session-1',
        attemptId: 'attempt-review',
        surface: 'review',
        contentVersion: 'content-v1',
        lessonId: 'lesson-1',
        unitId: 'unit-1',
        reviewCardId: 'review-card-1',
        activityId: 'activity-review',
        journeyNodeId: null,
        itemOutcomes: [itemOutcome({ activityId: 'activity-review' })],
        reviewRating: 'correct',
        outcome: 'correct',
        xpDelta: 4,
        completesJourneyNode: false,
        committedAt: FIXED_NOW,
        plannedSyncEvents: [],
    };
}

export function unitCheckpointIntent(): Extract<CommitIntentV1, { intentKind: 'unit-checkpoint-attempt' }> {
    return {
        schemaVersion: 1,
        intentKind: 'unit-checkpoint-attempt',
        operationId: 'operation-unit',
        checkpointId: 'checkpoint-unit',
        flowId: 'flow-unit',
        attemptId: 'attempt-unit',
        surface: 'unit-checkpoint',
        contentVersion: 'content-v1',
        checkpointDefinitionId: 'checkpoint-definition-1',
        unitId: 'unit-1',
        journeyNodeId: 'node-unit-1',
        activityId: 'activity-unit-1',
        itemOutcomes: [itemOutcome({ activityId: 'activity-unit-1' })],
        totalItemCount: 1,
        correctItemCount: 1,
        criticalErrorCount: 0,
        skippedItemCount: 0,
        scoreBasisPoints: 10000,
        passed: true,
        weakCompetencyIds: [],
        reinforcementPlanId: null,
        sourceAttemptId: null,
        reinforcementCycle: 0,
        resultingSupportState: 'none',
        xpDelta: 15,
        goalProgressDelta: 1,
        completesJourneyNode: true,
        committedAt: FIXED_NOW,
        plannedSyncEvents: [],
    };
}
