export type StudentCheckpointMode = 'off' | 'shadow' | 'active';

export type CheckpointSurface =
    | 'first-run'
    | 'home'
    | 'missions'
    | 'progress'
    | 'lesson'
    | 'legacy-quiz'
    | 'unit-checkpoint'
    | 'review'
    | 'reward';

export type CheckpointPhase =
    | 'entered'
    | 'in_progress'
    | 'committed'
    | 'completed'
    | 'abandoned'
    | 'superseded'
    | 'invalidated';

export type NextAction = 'resume' | 'home' | 'review' | 'retry' | 'support';
export type ResumeStrategy = 'direct' | 'canonical-home' | 'discard-incompatible';
export type DurationBucket = 'lt-15s' | '15-59s' | '1-2m' | '3-5m' | 'gt-5m';
export type EvidenceKind = 'guided-practice' | 'independent-recall' | 'applied-transfer' | 'delayed-retention' | 'legacy-lesson-recall';
export type EvidenceOutcome = 'correct' | 'incorrect' | 'skipped';
export type EvidenceDurationBucket = 'unknown' | 'under-10s' | '10-30s' | '30-60s' | 'over-60s';
export type ReviewRating = 'review-later' | 'correct';
export type ResultingSupportState = 'none' | 'cycle-1-required' | 'cycle-2-required' | 'support-required';
export type CurriculumKind = 'legacy' | 'v2';
export type ReinforcementActivityKind =
    | 'causal-explanation'
    | 'guided-practice'
    | 'different-modality'
    | 'independent-application'
    | 'equivalent-checkpoint-variant';

export type MandatoryStep = 'attempt' | 'evidence' | 'mastery' | 'review' | 'xp' | 'goal' | 'journey';
export type MandatoryState = 'not-started' | 'in-progress' | 'paused-retry-limit' | 'completed' | 'cancelled-before-effects';
export type AuxiliaryDeliveryState = 'not-required' | 'pending-delivery' | 'delivered';
export type CommitFailureCode = 'storage-failed' | 'invariant-failed' | 'dependency-unavailable' | 'outbox-enqueue-failed' | 'outbox-ack-failed' | 'privacy-rejected';
export type EffectKind =
    | 'learning-attempt-recorded'
    | 'learning-evidence-recorded'
    | 'competency-mastery-recomputed'
    | 'spaced-repetition-updated'
    | 'competency-review-updated'
    | 'xp-awarded'
    | 'daily-goal-updated'
    | 'journey-node-completed';

export type StudentCheckpointV1 = {
    schemaVersion: 1;
    checkpointId: string;
    flowId: string;
    operationId?: string;
    surface: CheckpointSurface;
    phase: CheckpointPhase;
    trackId?: string;
    unitId?: string;
    journeyNodeId?: string;
    lessonId?: string;
    activityId?: string;
    checkpointDefinitionId?: string;
    missionId?: string;
    reviewCardId?: string;
    rewardId?: string;
    galaxyId?: string;
    planetId?: string;
    competencyIds?: string[];
    contentVersion: string;
    cursorId: string;
    progressPercent: number;
    completedStepCount: number;
    totalStepCount: number;
    nextAction: NextAction;
    sequence: number;
    restoreFailureCount: 0 | 1 | 2;
    createdAt: string;
    updatedAt: string;
    expiresAt?: string;
};

export type ItemOutcomeV1 = {
    itemId: string;
    activityId: string;
    competencyIds: string[];
    evidenceKind: EvidenceKind;
    outcome: EvidenceOutcome;
    isCriticalError: boolean;
    hintUsed: boolean;
    durationBucket: EvidenceDurationBucket;
};

export type CheckpointAttemptV1 = Readonly<{
    schemaVersion: 1;
    attemptId: string;
    checkpointDefinitionId: string;
    unitId: string;
    journeyNodeId: string;
    contentVersion: string;
    itemOutcomes: readonly ItemOutcomeV1[];
    totalItemCount: number;
    correctItemCount: number;
    criticalErrorCount: number;
    skippedItemCount: number;
    scoreBasisPoints: number;
    passed: boolean;
    weakCompetencyIds: readonly string[];
    sourceAttemptId: string | null;
    reinforcementCycle: 0 | 1 | 2;
    resultingSupportState: ResultingSupportState;
    committedAt: string;
}>;

export type ReinforcementPlanV1 = Readonly<{
    schemaVersion: 1;
    reinforcementPlanId: string;
    checkpointDefinitionId: string;
    unitId: string;
    sourceAttemptId: string;
    reinforcementCycle: 1 | 2;
    competencyIds: readonly string[];
    requiredActivities: readonly ReinforcementActivityKind[];
}>;

export type AttemptConfirmedSyncEventV1 = {
    schemaVersion: 1;
    eventName: 'attempt_confirmed';
    occurredAt: string;
    operationId: string;
    attemptId: string;
    intentKind: CommitIntentV1['intentKind'];
    activityId: string;
    checkpointDefinitionId: string | null;
    unitId: string;
    contentVersion: string;
    totalItemCount: number;
    correctItemCount: number;
    scoreBasisPoints: number;
    passed: boolean;
    criticalErrorCount: number;
    skippedItemCount: number;
};

export type CompetencyEvidenceSyncEventV1 = {
    schemaVersion: 1;
    eventName: 'competency_evidence_confirmed';
    occurredAt: string;
    operationId: string;
    attemptId: string;
    itemId: string;
    activityId: string;
    competencyIds: string[];
    contentVersion: string;
    evidenceKind: EvidenceKind;
    outcome: EvidenceOutcome;
    isCriticalError: boolean;
    hintUsed: boolean;
    durationBucket: EvidenceDurationBucket;
};

export type ReviewCompletionSyncEventV1 = {
    schemaVersion: 1;
    eventName: 'review_completion_confirmed';
    occurredAt: string;
    operationId: string;
    attemptId: string;
    reviewSessionId: string;
    reviewCardId: string;
    lessonId: string;
    unitId: string;
    activityId: string;
    contentVersion: string;
    reviewRating: ReviewRating;
    outcome: EvidenceOutcome;
};

export type JourneyCompletionSyncEventV1 = {
    schemaVersion: 1;
    eventName: 'journey_completion_confirmed';
    occurredAt: string;
    operationId: string;
    attemptId: string;
    journeyNodeId: string;
    unitId: string;
    contentVersion: string;
};

export type ReinforcementCycleSyncEventV1 = {
    schemaVersion: 1;
    eventName: 'reinforcement_cycle_completed';
    occurredAt: string;
    operationId: string;
    reinforcementPlanId: string;
    cycleStateId: string;
    reinforcementCycle: 1 | 2;
    unitId: string;
    competencyIds: string[];
    sourceAttemptId: string;
    followUpAttemptId: string;
    contentVersion: string;
};

export type SupportRequiredSyncEventV1 = {
    schemaVersion: 1;
    eventName: 'support_required_confirmed';
    occurredAt: string;
    operationId: string;
    reinforcementPlanId: string;
    supportStateId: string;
    unitId: string;
    competencyIds: string[];
    sourceAttemptId: string;
    followUpAttemptId: string;
    contentVersion: string;
};

export type SyncEventV1 =
    | AttemptConfirmedSyncEventV1
    | CompetencyEvidenceSyncEventV1
    | ReviewCompletionSyncEventV1
    | JourneyCompletionSyncEventV1
    | ReinforcementCycleSyncEventV1
    | SupportRequiredSyncEventV1;

export type PlannedSyncEventV1 = { eventId: string; event: SyncEventV1 };

type IntentBase = {
    schemaVersion: 1;
    operationId: string;
    checkpointId: string;
    flowId: string;
    attemptId: string;
    contentVersion: string;
    activityId: string;
    itemOutcomes: ItemOutcomeV1[];
    committedAt: string;
    plannedSyncEvents: PlannedSyncEventV1[];
};

export type LessonCompletionIntentV1 = IntentBase & {
    intentKind: 'lesson-completion';
    surface: 'lesson';
    lessonId: string;
    unitId: string;
    journeyNodeId: string;
    totalItemCount: number;
    correctItemCount: number;
    scoreBasisPoints: number;
    eligibleForReward: boolean;
    completesJourneyNode: boolean;
    xpDelta: number;
    goalProgressDelta: number;
};

export type ReviewCompletionIntentV1 = IntentBase & {
    intentKind: 'review-completion';
    surface: 'review';
    reviewSessionId: string;
    lessonId: string;
    unitId: string;
    reviewCardId: string;
    journeyNodeId: string | null;
    reviewRating: ReviewRating;
    outcome: EvidenceOutcome;
    xpDelta: number;
    completesJourneyNode: boolean;
};

export type UnitCheckpointAttemptIntentV1 = IntentBase & {
    intentKind: 'unit-checkpoint-attempt';
    surface: 'unit-checkpoint';
    checkpointDefinitionId: string;
    unitId: string;
    journeyNodeId: string;
    totalItemCount: number;
    correctItemCount: number;
    criticalErrorCount: number;
    skippedItemCount: number;
    scoreBasisPoints: number;
    passed: boolean;
    weakCompetencyIds: string[];
    reinforcementPlanId: string | null;
    sourceAttemptId: string | null;
    reinforcementCycle: 0 | 1 | 2;
    resultingSupportState: ResultingSupportState;
    xpDelta: number;
    goalProgressDelta: number;
    completesJourneyNode: boolean;
};

export type CommitIntentV1 = LessonCompletionIntentV1 | ReviewCompletionIntentV1 | UnitCheckpointAttemptIntentV1;

export type CommitOperationV1 = {
    schemaVersion: 1;
    operationId: string;
    checkpointId: string;
    flowId: string;
    surface: CheckpointSurface;
    contentVersion: string;
    mandatoryState: MandatoryState;
    nextMandatoryStep: MandatoryStep | null;
    requiredMandatorySteps: MandatoryStep[];
    completedMandatorySteps: MandatoryStep[];
    auxiliaryDeliveryState: AuxiliaryDeliveryState;
    outboxEventIds: string[];
    automaticRetryCount: number;
    retryEpoch: number;
    lastFailureCode: CommitFailureCode | null;
    createdAt: string;
    updatedAt: string;
};

export type CommitJournalEntryV1 = { schemaVersion: 1; operation: CommitOperationV1; intent: CommitIntentV1 };

export type IdempotencyReceiptV1 = {
    schemaVersion: 1;
    operationId: string;
    mandatoryStep: MandatoryStep;
    effectKind: EffectKind;
    effectRecordId: string;
    persistedAt: string;
};

export type OutboxEventV1 = {
    schemaVersion: 1;
    eventId: string;
    event: SyncEventV1;
    deliveryState: 'pending' | 'paused-retry-limit' | 'acknowledged';
    automaticDeliveryRetryCount: number;
    deliveryRetryEpoch: number;
    nextAttemptAt: string | null;
    createdAt: string;
    acknowledgedAt: string | null;
};

export type LocalCheckpointEventV1 = Record<string, unknown> & {
    schemaVersion: 1;
    localEventId: string;
    eventName:
        | 'checkpoint_entered'
        | 'checkpoint_progressed'
        | 'checkpoint_committed'
        | 'checkpoint_completed'
        | 'checkpoint_abandoned'
        | 'checkpoint_invalidated'
        | 'restore_offered'
        | 'restore_succeeded'
        | 'restore_failed'
        | 'commit_resumed'
        | 'checkpoint_attempted'
        | 'reinforcement_assigned'
        | 'support_required';
    occurredAt: string;
    surface: CheckpointSurface;
    checkpointId: string;
    flowId: string;
    contentVersion: string;
};

export type AdapterRestoreDecision =
    | { kind: 'resume'; cursorId: string }
    | { kind: 'fallback'; nextAction: 'home'; reasonCode: string }
    | { kind: 'discard'; reasonCode: string };

export interface ScreenCheckpointAdapter<TDomain = unknown> {
    readonly surface: CheckpointSurface;
    belongsTo(checkpoint: StudentCheckpointV1, context: TDomain): boolean;
    create(context: TDomain): StudentCheckpointV1;
    reconcile(checkpoint: StudentCheckpointV1, context: TDomain): AdapterRestoreDecision;
}
