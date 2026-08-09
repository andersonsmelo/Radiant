import type {
    CheckpointPhase,
    CommitIntentV1,
    CommitJournalEntryV1,
    CommitOperationV1,
    IdempotencyReceiptV1,
    LocalCheckpointEventV1,
    MandatoryStep,
    OutboxEventV1,
    StudentCheckpointV1,
    SyncEventV1,
} from './contracts';

export type ValidationReason = 'future-schema' | 'unknown-field' | 'privacy-rejected' | 'invalid-contract' | 'invariant-failed' | 'corrupt';
export type ValidationResult<T> = { ok: true; value: T } | { ok: false; reasonCode: ValidationReason };

const OPAQUE_ID = /^[A-Za-z0-9:_-]{1,96}$/;
const CATALOG_ID = /^[a-z0-9][a-z0-9:_-]{0,127}$/;
const CONTENT_VERSION = /^[A-Za-z0-9._:-]{1,128}$/;
const PROHIBITED_KEYS = new Set(['name', 'email', 'userid', 'deviceid', 'answer', 'selectedvalue', 'text', 'notes', 'uri', 'url', 'path', 'metadata', 'context', 'patient', 'dicom']);

const CHECKPOINT_SURFACES = ['first-run', 'home', 'galaxy-map', 'galaxy-interior', 'planet-interior', 'missions', 'progress', 'lesson', 'legacy-quiz', 'unit-checkpoint', 'review', 'reward'] as const;
const CHECKPOINT_PHASES = ['entered', 'in_progress', 'committed', 'completed', 'abandoned', 'superseded', 'invalidated'] as const;
const NEXT_ACTIONS = ['resume', 'home', 'review', 'retry', 'support'] as const;
const MANDATORY_ORDER: MandatoryStep[] = ['attempt', 'evidence', 'mastery', 'review', 'xp', 'goal', 'journey'];

const CHECKPOINT_KEYS = [
    'schemaVersion', 'checkpointId', 'flowId', 'operationId', 'surface', 'phase', 'trackId', 'unitId',
    'journeyNodeId', 'lessonId', 'activityId', 'checkpointDefinitionId', 'missionId', 'reviewCardId',
    'rewardId', 'galaxyId', 'planetId', 'competencyIds', 'contentVersion', 'cursorId', 'progressPercent',
    'completedStepCount', 'totalStepCount', 'nextAction', 'sequence', 'restoreFailureCount', 'createdAt',
    'updatedAt', 'expiresAt',
] as const;

const ITEM_OUTCOME_KEYS = ['itemId', 'activityId', 'competencyIds', 'evidenceKind', 'outcome', 'isCriticalError', 'hintUsed', 'durationBucket'] as const;
const PLANNED_EVENT_KEYS = ['eventId', 'event'] as const;

const INTENT_KEYS = {
    'lesson-completion': [
        'schemaVersion', 'intentKind', 'operationId', 'checkpointId', 'flowId', 'attemptId', 'surface',
        'contentVersion', 'lessonId', 'unitId', 'journeyNodeId', 'activityId', 'itemOutcomes', 'totalItemCount',
        'correctItemCount', 'scoreBasisPoints', 'eligibleForReward', 'completesJourneyNode', 'xpDelta',
        'goalProgressDelta', 'committedAt', 'plannedSyncEvents',
    ],
    'review-completion': [
        'schemaVersion', 'intentKind', 'operationId', 'checkpointId', 'flowId', 'reviewSessionId', 'attemptId',
        'surface', 'contentVersion', 'lessonId', 'unitId', 'reviewCardId', 'activityId', 'journeyNodeId',
        'itemOutcomes', 'reviewRating', 'outcome', 'xpDelta', 'completesJourneyNode', 'committedAt',
        'plannedSyncEvents',
    ],
    'unit-checkpoint-attempt': [
        'schemaVersion', 'intentKind', 'operationId', 'checkpointId', 'flowId', 'attemptId', 'surface',
        'contentVersion', 'checkpointDefinitionId', 'unitId', 'journeyNodeId', 'activityId', 'itemOutcomes',
        'totalItemCount', 'correctItemCount', 'criticalErrorCount', 'skippedItemCount', 'scoreBasisPoints',
        'passed', 'weakCompetencyIds', 'reinforcementPlanId', 'sourceAttemptId', 'reinforcementCycle',
        'resultingSupportState', 'xpDelta', 'goalProgressDelta', 'completesJourneyNode', 'committedAt',
        'plannedSyncEvents',
    ],
} as const;

const SYNC_EVENT_KEYS: Record<string, readonly string[]> = {
    attempt_confirmed: ['schemaVersion', 'eventName', 'occurredAt', 'operationId', 'attemptId', 'intentKind', 'activityId', 'checkpointDefinitionId', 'unitId', 'contentVersion', 'totalItemCount', 'correctItemCount', 'scoreBasisPoints', 'passed', 'criticalErrorCount', 'skippedItemCount'],
    competency_evidence_confirmed: ['schemaVersion', 'eventName', 'occurredAt', 'operationId', 'attemptId', 'itemId', 'activityId', 'competencyIds', 'contentVersion', 'evidenceKind', 'outcome', 'isCriticalError', 'hintUsed', 'durationBucket'],
    review_completion_confirmed: ['schemaVersion', 'eventName', 'occurredAt', 'operationId', 'attemptId', 'reviewSessionId', 'reviewCardId', 'lessonId', 'unitId', 'activityId', 'contentVersion', 'reviewRating', 'outcome'],
    journey_completion_confirmed: ['schemaVersion', 'eventName', 'occurredAt', 'operationId', 'attemptId', 'journeyNodeId', 'unitId', 'contentVersion'],
    reinforcement_cycle_completed: ['schemaVersion', 'eventName', 'occurredAt', 'operationId', 'reinforcementPlanId', 'cycleStateId', 'reinforcementCycle', 'unitId', 'competencyIds', 'sourceAttemptId', 'followUpAttemptId', 'contentVersion'],
    support_required_confirmed: ['schemaVersion', 'eventName', 'occurredAt', 'operationId', 'reinforcementPlanId', 'supportStateId', 'unitId', 'competencyIds', 'sourceAttemptId', 'followUpAttemptId', 'contentVersion'],
};

const LOCAL_EVENT_KEYS: Record<string, readonly string[]> = {
    checkpoint_entered: ['schemaVersion', 'localEventId', 'eventName', 'occurredAt', 'surface', 'checkpointId', 'flowId', 'contentVersion', 'cursorId', 'phase'],
    checkpoint_progressed: ['schemaVersion', 'localEventId', 'eventName', 'occurredAt', 'surface', 'checkpointId', 'flowId', 'contentVersion', 'cursorId', 'phase', 'progressPercent', 'completedStepCount', 'totalStepCount'],
    checkpoint_committed: ['schemaVersion', 'localEventId', 'eventName', 'occurredAt', 'surface', 'checkpointId', 'flowId', 'contentVersion', 'operationId', 'commitResult'],
    checkpoint_completed: ['schemaVersion', 'localEventId', 'eventName', 'occurredAt', 'surface', 'checkpointId', 'flowId', 'contentVersion', 'durationBucket'],
    checkpoint_abandoned: ['schemaVersion', 'localEventId', 'eventName', 'occurredAt', 'surface', 'checkpointId', 'flowId', 'contentVersion', 'durationBucket'],
    checkpoint_invalidated: ['schemaVersion', 'localEventId', 'eventName', 'occurredAt', 'surface', 'checkpointId', 'flowId', 'contentVersion', 'reasonCode'],
    restore_offered: ['schemaVersion', 'localEventId', 'eventName', 'occurredAt', 'surface', 'checkpointId', 'flowId', 'contentVersion', 'resumeStrategy'],
    restore_succeeded: ['schemaVersion', 'localEventId', 'eventName', 'occurredAt', 'surface', 'checkpointId', 'flowId', 'contentVersion', 'resumeStrategy', 'durationBucket'],
    restore_failed: ['schemaVersion', 'localEventId', 'eventName', 'occurredAt', 'surface', 'checkpointId', 'flowId', 'contentVersion', 'reasonCode', 'restoreFailureCount'],
    commit_resumed: ['schemaVersion', 'localEventId', 'eventName', 'occurredAt', 'surface', 'checkpointId', 'flowId', 'contentVersion', 'operationId', 'mandatoryStep'],
    checkpoint_attempted: ['schemaVersion', 'localEventId', 'eventName', 'occurredAt', 'surface', 'checkpointId', 'flowId', 'contentVersion', 'operationId', 'checkpointDefinitionId', 'scoreBasisPoints', 'passed', 'criticalErrorCount', 'skippedItemCount'],
    reinforcement_assigned: ['schemaVersion', 'localEventId', 'eventName', 'occurredAt', 'surface', 'checkpointId', 'flowId', 'contentVersion', 'operationId', 'reinforcementCycle', 'weakCompetencyCount'],
    support_required: ['schemaVersion', 'localEventId', 'eventName', 'occurredAt', 'surface', 'checkpointId', 'flowId', 'contentVersion', 'operationId', 'weakCompetencyCount'],
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function containsProhibitedKey(value: unknown): boolean {
    if (Array.isArray(value)) return value.some(containsProhibitedKey);
    if (!isRecord(value)) return false;
    return Object.entries(value).some(([key, nested]) => PROHIBITED_KEYS.has(key.toLowerCase()) || containsProhibitedKey(nested));
}

function hasExactKeys(value: Record<string, unknown>, allowed: readonly string[]): boolean {
    return Object.keys(value).every((key) => allowed.includes(key));
}

function isOpaqueId(value: unknown): value is string {
    return typeof value === 'string' && OPAQUE_ID.test(value);
}

function isCatalogId(value: unknown): value is string {
    return typeof value === 'string' && CATALOG_ID.test(value);
}

function isContentVersion(value: unknown): value is string {
    return typeof value === 'string' && CONTENT_VERSION.test(value);
}

function isTimestamp(value: unknown): value is string {
    return typeof value === 'string' && value.endsWith('Z') && Number.isFinite(Date.parse(value));
}

function isSafeCount(value: unknown): value is number {
    return Number.isInteger(value) && (value as number) >= 0 && (value as number) <= 1000;
}

function isScoreBasisPoints(value: unknown): value is number {
    return Number.isInteger(value) && (value as number) >= 0 && (value as number) <= 10000;
}

function isCanonicalIds(value: unknown, min: number, max: number): value is string[] {
    if (!Array.isArray(value) || value.length < min || value.length > max || !value.every(isCatalogId)) return false;
    return new Set(value).size === value.length && [...value].sort().every((entry, index) => entry === value[index]);
}

function isCanonicalOpaqueIds(value: unknown, min: number, max: number): value is string[] {
    if (!Array.isArray(value) || value.length < min || value.length > max || !value.every(isOpaqueId)) return false;
    return new Set(value).size === value.length && [...value].sort().every((entry, index) => entry === value[index]);
}

function invalid<T>(reasonCode: ValidationReason): ValidationResult<T> {
    return { ok: false, reasonCode };
}

function preflight<T>(value: unknown): ValidationResult<T> | null {
    if (!isRecord(value)) return invalid('invalid-contract');
    if (value.schemaVersion !== 1) return invalid(value.schemaVersion === undefined ? 'invalid-contract' : 'future-schema');
    if (containsProhibitedKey(value)) return invalid('privacy-rejected');
    return null;
}

export function validateStudentCheckpoint(value: unknown): ValidationResult<StudentCheckpointV1> {
    const failed = preflight<StudentCheckpointV1>(value);
    if (failed) return failed;
    const candidate = value as Record<string, unknown>;
    if (!hasExactKeys(candidate, CHECKPOINT_KEYS)) return invalid('unknown-field');
    if (!isOpaqueId(candidate.checkpointId) || !isOpaqueId(candidate.flowId)) return invalid('invalid-contract');
    if (candidate.operationId !== undefined && !isOpaqueId(candidate.operationId)) return invalid('invalid-contract');
    if (!CHECKPOINT_SURFACES.includes(candidate.surface as never) || !CHECKPOINT_PHASES.includes(candidate.phase as never)) return invalid('invalid-contract');
    const catalogFields = ['trackId', 'unitId', 'journeyNodeId', 'lessonId', 'activityId', 'checkpointDefinitionId', 'missionId', 'reviewCardId', 'rewardId', 'galaxyId', 'planetId', 'cursorId'];
    if (catalogFields.some((key) => candidate[key] !== undefined && !isCatalogId(candidate[key]))) return invalid('invalid-contract');
    if (candidate.competencyIds !== undefined && !isCanonicalIds(candidate.competencyIds, 1, 30)) return invalid('invalid-contract');
    if (!isContentVersion(candidate.contentVersion) || !isCatalogId(candidate.cursorId)) return invalid('invalid-contract');
    if (!Number.isInteger(candidate.progressPercent) || (candidate.progressPercent as number) < 0 || (candidate.progressPercent as number) > 100) return invalid('invalid-contract');
    if (!isSafeCount(candidate.completedStepCount) || !isSafeCount(candidate.totalStepCount)) return invalid('invalid-contract');
    if (!NEXT_ACTIONS.includes(candidate.nextAction as never) || !Number.isSafeInteger(candidate.sequence) || (candidate.sequence as number) < 0) return invalid('invalid-contract');
    if (![0, 1, 2].includes(candidate.restoreFailureCount as number)) return invalid('invalid-contract');
    if (!isTimestamp(candidate.createdAt) || !isTimestamp(candidate.updatedAt) || (candidate.expiresAt !== undefined && !isTimestamp(candidate.expiresAt))) return invalid('invalid-contract');
    return { ok: true, value: value as StudentCheckpointV1 };
}

function validateItemOutcome(value: unknown): boolean {
    if (!isRecord(value) || containsProhibitedKey(value) || !hasExactKeys(value, ITEM_OUTCOME_KEYS)) return false;
    return isCatalogId(value.itemId)
        && isCatalogId(value.activityId)
        && isCanonicalIds(value.competencyIds, 1, 8)
        && ['guided-practice', 'independent-recall', 'applied-transfer', 'delayed-retention', 'legacy-lesson-recall'].includes(value.evidenceKind as string)
        && ['correct', 'incorrect', 'skipped'].includes(value.outcome as string)
        && typeof value.isCriticalError === 'boolean'
        && typeof value.hintUsed === 'boolean'
        && ['unknown', 'under-10s', '10-30s', '30-60s', 'over-60s'].includes(value.durationBucket as string);
}

export function validateSyncEvent(value: unknown): ValidationResult<SyncEventV1> {
    const failed = preflight<SyncEventV1>(value);
    if (failed) return failed;
    const candidate = value as Record<string, unknown>;
    const allowed = SYNC_EVENT_KEYS[String(candidate.eventName)];
    if (!allowed || !hasExactKeys(candidate, allowed)) return invalid(allowed ? 'unknown-field' : 'invalid-contract');
    if (!isTimestamp(candidate.occurredAt) || !isOpaqueId(candidate.operationId) || !isContentVersion(candidate.contentVersion)) return invalid('invalid-contract');
    switch (candidate.eventName) {
        case 'attempt_confirmed':
            if (!isOpaqueId(candidate.attemptId)
                || !['lesson-completion', 'review-completion', 'unit-checkpoint-attempt'].includes(candidate.intentKind as string)
                || !isCatalogId(candidate.activityId)
                || (candidate.checkpointDefinitionId !== null && !isCatalogId(candidate.checkpointDefinitionId))
                || !isCatalogId(candidate.unitId)
                || !isSafeCount(candidate.totalItemCount)
                || !isSafeCount(candidate.correctItemCount)
                || !isScoreBasisPoints(candidate.scoreBasisPoints)
                || typeof candidate.passed !== 'boolean'
                || !isSafeCount(candidate.criticalErrorCount)
                || !isSafeCount(candidate.skippedItemCount)) return invalid('invalid-contract');
            break;
        case 'competency_evidence_confirmed':
            if (!isOpaqueId(candidate.attemptId) || !isCatalogId(candidate.itemId) || !isCatalogId(candidate.activityId)
                || !isCanonicalIds(candidate.competencyIds, 1, 30)
                || !['guided-practice', 'independent-recall', 'applied-transfer', 'delayed-retention', 'legacy-lesson-recall'].includes(candidate.evidenceKind as string)
                || !['correct', 'incorrect', 'skipped'].includes(candidate.outcome as string)
                || typeof candidate.isCriticalError !== 'boolean' || typeof candidate.hintUsed !== 'boolean'
                || !['unknown', 'under-10s', '10-30s', '30-60s', 'over-60s'].includes(candidate.durationBucket as string)) return invalid('invalid-contract');
            break;
        case 'review_completion_confirmed':
            if (!isOpaqueId(candidate.attemptId) || !isOpaqueId(candidate.reviewSessionId)
                || !isCatalogId(candidate.reviewCardId) || !isCatalogId(candidate.lessonId) || !isCatalogId(candidate.unitId) || !isCatalogId(candidate.activityId)
                || !['review-later', 'correct'].includes(candidate.reviewRating as string)
                || !['correct', 'incorrect', 'skipped'].includes(candidate.outcome as string)) return invalid('invalid-contract');
            break;
        case 'journey_completion_confirmed':
            if (!isOpaqueId(candidate.attemptId) || !isCatalogId(candidate.journeyNodeId) || !isCatalogId(candidate.unitId)) return invalid('invalid-contract');
            break;
        case 'reinforcement_cycle_completed':
            if (!isOpaqueId(candidate.reinforcementPlanId) || !isOpaqueId(candidate.cycleStateId)
                || ![1, 2].includes(candidate.reinforcementCycle as number) || !isCatalogId(candidate.unitId)
                || !isCanonicalIds(candidate.competencyIds, 1, 30) || !isOpaqueId(candidate.sourceAttemptId) || !isOpaqueId(candidate.followUpAttemptId)) return invalid('invalid-contract');
            break;
        case 'support_required_confirmed':
            if (!isOpaqueId(candidate.reinforcementPlanId) || !isOpaqueId(candidate.supportStateId)
                || !isCatalogId(candidate.unitId) || !isCanonicalIds(candidate.competencyIds, 1, 30)
                || !isOpaqueId(candidate.sourceAttemptId) || !isOpaqueId(candidate.followUpAttemptId)) return invalid('invalid-contract');
            break;
        default:
            return invalid('invalid-contract');
    }
    return { ok: true, value: value as SyncEventV1 };
}

function validatePlannedEvents(value: unknown): boolean {
    if (!Array.isArray(value) || value.length > 100) return false;
    const ids = new Set<string>();
    for (const entry of value) {
        if (!isRecord(entry) || !hasExactKeys(entry, PLANNED_EVENT_KEYS) || !isOpaqueId(entry.eventId) || ids.has(entry.eventId)) return false;
        if (!validateSyncEvent(entry.event).ok) return false;
        ids.add(entry.eventId);
    }
    return true;
}

function derivedOutcomeCounts(intent: Record<string, unknown>): { total: number; correct: number; critical: number; skipped: number; score: number } | null {
    if (!Array.isArray(intent.itemOutcomes) || intent.itemOutcomes.length < 1 || intent.itemOutcomes.length > 64 || !intent.itemOutcomes.every(validateItemOutcome)) return null;
    const itemIds = intent.itemOutcomes.map((item) => (item as Record<string, unknown>).itemId);
    if (new Set(itemIds).size !== itemIds.length) return null;
    const correct = intent.itemOutcomes.filter((item) => {
        const outcome = item as Record<string, unknown>;
        return outcome.outcome === 'correct' && outcome.isCriticalError !== true;
    }).length;
    const critical = intent.itemOutcomes.filter((item) => (item as Record<string, unknown>).isCriticalError === true).length;
    const skipped = intent.itemOutcomes.filter((item) => (item as Record<string, unknown>).outcome === 'skipped').length;
    return { total: intent.itemOutcomes.length, correct, critical, skipped, score: Math.floor(10000 * correct / intent.itemOutcomes.length) };
}

function plannedEventsMatchIntent(intent: Record<string, unknown>): boolean {
    const planned = intent.plannedSyncEvents as { eventId: string; event: Record<string, unknown> }[];
    return planned.every(({ event }) => {
        if (event.operationId !== intent.operationId || event.contentVersion !== intent.contentVersion) return false;
        if ('attemptId' in event && event.attemptId !== intent.attemptId) return false;
        for (const field of ['activityId', 'checkpointDefinitionId', 'unitId', 'lessonId', 'journeyNodeId', 'reviewSessionId', 'reviewCardId']) {
            if (field in event && field in intent && event[field] !== intent[field]) return false;
        }
        return true;
    });
}

export function validateCommitIntent(value: unknown): ValidationResult<CommitIntentV1> {
    const failed = preflight<CommitIntentV1>(value);
    if (failed) return failed;
    const candidate = value as Record<string, unknown>;
    const kind = candidate.intentKind as keyof typeof INTENT_KEYS;
    const allowed = INTENT_KEYS[kind];
    if (!allowed || !hasExactKeys(candidate, allowed)) return invalid(allowed ? 'unknown-field' : 'invalid-contract');
    for (const id of ['operationId', 'checkpointId', 'flowId', 'attemptId']) if (!isOpaqueId(candidate[id])) return invalid('invalid-contract');
    if (!isContentVersion(candidate.contentVersion) || !isCatalogId(candidate.activityId) || !isTimestamp(candidate.committedAt)) return invalid('invalid-contract');
    if (!validatePlannedEvents(candidate.plannedSyncEvents)) return invalid('invalid-contract');
    if (!plannedEventsMatchIntent(candidate)) return invalid('invariant-failed');
    const counts = derivedOutcomeCounts(candidate);
    if (!counts) return invalid('invalid-contract');
    if (kind !== 'review-completion') {
        if (candidate.totalItemCount !== counts.total || candidate.correctItemCount !== counts.correct || candidate.scoreBasisPoints !== counts.score) return invalid('invariant-failed');
    } else if (counts.total !== 1) return invalid('invariant-failed');
    if (kind === 'lesson-completion') {
        if (candidate.surface !== 'lesson' || !isCatalogId(candidate.lessonId) || !isCatalogId(candidate.unitId) || !isCatalogId(candidate.journeyNodeId)) return invalid('invalid-contract');
        if (!isSafeCount(candidate.totalItemCount) || !isSafeCount(candidate.correctItemCount) || !isScoreBasisPoints(candidate.scoreBasisPoints)
            || typeof candidate.eligibleForReward !== 'boolean' || typeof candidate.completesJourneyNode !== 'boolean'
            || !isSafeCount(candidate.xpDelta) || !isSafeCount(candidate.goalProgressDelta)) return invalid('invalid-contract');
    }
    if (kind === 'review-completion') {
        if (candidate.surface !== 'review' || !isOpaqueId(candidate.reviewSessionId) || !isCatalogId(candidate.reviewCardId)
            || !isCatalogId(candidate.lessonId) || !isCatalogId(candidate.unitId)
            || (candidate.journeyNodeId !== null && !isCatalogId(candidate.journeyNodeId))
            || !['review-later', 'correct'].includes(candidate.reviewRating as string)
            || !['correct', 'incorrect', 'skipped'].includes(candidate.outcome as string)
            || !isSafeCount(candidate.xpDelta) || typeof candidate.completesJourneyNode !== 'boolean') return invalid('invalid-contract');
        const outcome = (candidate.itemOutcomes as Record<string, unknown>[])[0];
        if (outcome.activityId !== candidate.activityId || outcome.outcome !== candidate.outcome) return invalid('invariant-failed');
    }
    if (kind === 'unit-checkpoint-attempt') {
        if (candidate.surface !== 'unit-checkpoint' || !isCatalogId(candidate.checkpointDefinitionId)
            || !isCatalogId(candidate.unitId) || !isCatalogId(candidate.journeyNodeId)
            || !isCanonicalIds(candidate.weakCompetencyIds, 0, 30)
            || (candidate.reinforcementPlanId !== null && !isOpaqueId(candidate.reinforcementPlanId))
            || (candidate.sourceAttemptId !== null && !isOpaqueId(candidate.sourceAttemptId))
            || ![0, 1, 2].includes(candidate.reinforcementCycle as number)
            || !['none', 'cycle-1-required', 'cycle-2-required', 'support-required'].includes(candidate.resultingSupportState as string)
            || !isSafeCount(candidate.totalItemCount) || !isSafeCount(candidate.correctItemCount)
            || !isSafeCount(candidate.criticalErrorCount) || !isSafeCount(candidate.skippedItemCount)
            || !isScoreBasisPoints(candidate.scoreBasisPoints) || typeof candidate.passed !== 'boolean'
            || !isSafeCount(candidate.xpDelta) || !isSafeCount(candidate.goalProgressDelta)
            || typeof candidate.completesJourneyNode !== 'boolean') return invalid('invalid-contract');
        if (candidate.criticalErrorCount !== counts.critical || candidate.skippedItemCount !== counts.skipped || candidate.passed !== (counts.score >= 8000 && counts.critical === 0)) return invalid('invariant-failed');
    }
    return { ok: true, value: value as CommitIntentV1 };
}

export function deriveRequiredMandatorySteps(intent: CommitIntentV1): MandatoryStep[] {
    const required = new Set<MandatoryStep>(['attempt', 'evidence', 'mastery', 'review']);
    if (intent.intentKind === 'lesson-completion') {
        if (intent.eligibleForReward) {
            required.add('xp');
            required.add('goal');
        }
        required.add('journey');
    } else {
        if (intent.xpDelta > 0) required.add('xp');
        if ('goalProgressDelta' in intent && intent.goalProgressDelta > 0) required.add('goal');
        if (intent.completesJourneyNode) required.add('journey');
    }
    return MANDATORY_ORDER.filter((step) => required.has(step));
}

export function validateCommitOperation(value: unknown): ValidationResult<CommitOperationV1> {
    const failed = preflight<CommitOperationV1>(value);
    if (failed) return failed;
    const candidate = value as Record<string, unknown>;
    const keys = ['schemaVersion', 'operationId', 'checkpointId', 'flowId', 'surface', 'contentVersion', 'mandatoryState', 'nextMandatoryStep', 'requiredMandatorySteps', 'completedMandatorySteps', 'auxiliaryDeliveryState', 'outboxEventIds', 'automaticRetryCount', 'retryEpoch', 'lastFailureCode', 'createdAt', 'updatedAt'];
    if (!hasExactKeys(candidate, keys)) return invalid('unknown-field');
    if (!isOpaqueId(candidate.operationId) || !isOpaqueId(candidate.checkpointId) || !isOpaqueId(candidate.flowId) || !isContentVersion(candidate.contentVersion)) return invalid('invalid-contract');
    if (!Array.isArray(candidate.requiredMandatorySteps) || !Array.isArray(candidate.completedMandatorySteps)) return invalid('invalid-contract');
    const required = candidate.requiredMandatorySteps as MandatoryStep[];
    const completed = candidate.completedMandatorySteps as MandatoryStep[];
    if (!required.every((step, index) => MANDATORY_ORDER.includes(step) && (index === 0 || MANDATORY_ORDER.indexOf(required[index - 1]) < MANDATORY_ORDER.indexOf(step)))) return invalid('invariant-failed');
    if (!completed.every((step, index) => step === required[index])) return invalid('invariant-failed');
    if (!CHECKPOINT_SURFACES.includes(candidate.surface as never)) return invalid('invalid-contract');
    if (!['not-started', 'in-progress', 'paused-retry-limit', 'completed', 'cancelled-before-effects'].includes(candidate.mandatoryState as string)) return invalid('invalid-contract');
    if (candidate.nextMandatoryStep !== null && !MANDATORY_ORDER.includes(candidate.nextMandatoryStep as MandatoryStep)) return invalid('invalid-contract');
    if (!['not-required', 'pending-delivery', 'delivered'].includes(candidate.auxiliaryDeliveryState as string)) return invalid('invalid-contract');
    if (!isCanonicalOpaqueIds(candidate.outboxEventIds, 0, 100)) return invalid('invariant-failed');
    if (!Number.isInteger(candidate.automaticRetryCount) || (candidate.automaticRetryCount as number) < 0 || (candidate.automaticRetryCount as number) > 20) return invalid('invalid-contract');
    if (!isSafeCount(candidate.retryEpoch)) return invalid('invalid-contract');
    if (candidate.lastFailureCode !== null && !['storage-failed', 'invariant-failed', 'dependency-unavailable', 'outbox-enqueue-failed', 'outbox-ack-failed', 'privacy-rejected'].includes(candidate.lastFailureCode as string)) return invalid('invalid-contract');
    if (!isTimestamp(candidate.createdAt) || !isTimestamp(candidate.updatedAt)) return invalid('invalid-contract');
    const expectedNext = required[completed.length] ?? null;
    if (candidate.mandatoryState !== 'cancelled-before-effects' && candidate.nextMandatoryStep !== expectedNext) return invalid('invariant-failed');
    if (candidate.mandatoryState === 'not-started' && completed.length !== 0) return invalid('invariant-failed');
    if (candidate.mandatoryState === 'in-progress' && expectedNext === null) return invalid('invariant-failed');
    if (candidate.mandatoryState === 'paused-retry-limit' && (candidate.automaticRetryCount !== 20 || expectedNext === null)) return invalid('invariant-failed');
    if (candidate.mandatoryState === 'completed' && (completed.length !== required.length || expectedNext !== null)) return invalid('invariant-failed');
    if (candidate.mandatoryState === 'cancelled-before-effects' && (completed.length !== 0 || candidate.nextMandatoryStep !== null)) return invalid('invariant-failed');
    if (candidate.mandatoryState !== 'paused-retry-limit' && candidate.automaticRetryCount === 20) return invalid('invariant-failed');
    const outboxIds = candidate.outboxEventIds as string[];
    if ((candidate.auxiliaryDeliveryState === 'not-required') !== (outboxIds.length === 0)) return invalid('invariant-failed');
    return { ok: true, value: value as CommitOperationV1 };
}

export function validateCommitJournalEntry(value: unknown): ValidationResult<CommitJournalEntryV1> {
    const failed = preflight<CommitJournalEntryV1>(value);
    if (failed) return failed;
    const candidate = value as Record<string, unknown>;
    if (!hasExactKeys(candidate, ['schemaVersion', 'operation', 'intent'])) return invalid('unknown-field');
    const operation = validateCommitOperation(candidate.operation);
    const intent = validateCommitIntent(candidate.intent);
    if (!operation.ok || !intent.ok) return invalid(!operation.ok ? operation.reasonCode : (intent as { ok: false; reasonCode: ValidationReason }).reasonCode);
    if (operation.value.operationId !== intent.value.operationId || operation.value.checkpointId !== intent.value.checkpointId || operation.value.flowId !== intent.value.flowId || operation.value.surface !== intent.value.surface || operation.value.contentVersion !== intent.value.contentVersion) return invalid('invariant-failed');
    if (stableStringify(operation.value.requiredMandatorySteps) !== stableStringify(deriveRequiredMandatorySteps(intent.value))) return invalid('invariant-failed');
    const plannedIds = intent.value.plannedSyncEvents.map((entry) => entry.eventId).sort();
    if (stableStringify(operation.value.outboxEventIds) !== stableStringify(plannedIds)) return invalid('invariant-failed');
    return { ok: true, value: value as CommitJournalEntryV1 };
}

export function validateIdempotencyReceipt(value: unknown): ValidationResult<IdempotencyReceiptV1> {
    const failed = preflight<IdempotencyReceiptV1>(value);
    if (failed) return failed;
    const candidate = value as Record<string, unknown>;
    const keys = ['schemaVersion', 'operationId', 'mandatoryStep', 'effectKind', 'effectRecordId', 'persistedAt'];
    if (!hasExactKeys(candidate, keys)) return invalid('unknown-field');
    if (!isOpaqueId(candidate.operationId) || !isOpaqueId(candidate.effectRecordId) || !isTimestamp(candidate.persistedAt)) return invalid('invalid-contract');
    const step = candidate.mandatoryStep as MandatoryStep;
    const effectKind = candidate.effectKind as string;
    const allowedByStep: Record<MandatoryStep, string[]> = {
        attempt: ['learning-attempt-recorded'], evidence: ['learning-evidence-recorded'], mastery: ['competency-mastery-recomputed'],
        review: ['spaced-repetition-updated', 'competency-review-updated'], xp: ['xp-awarded'], goal: ['daily-goal-updated'], journey: ['journey-node-completed'],
    };
    if (!MANDATORY_ORDER.includes(step) || !allowedByStep[step].includes(effectKind)) return invalid('invalid-contract');
    return { ok: true, value: value as IdempotencyReceiptV1 };
}

export function validateLocalCheckpointEvent(value: unknown): ValidationResult<LocalCheckpointEventV1> {
    const failed = preflight<LocalCheckpointEventV1>(value);
    if (failed) return failed;
    const candidate = value as Record<string, unknown>;
    const allowed = LOCAL_EVENT_KEYS[String(candidate.eventName)];
    if (!allowed || !hasExactKeys(candidate, allowed)) return invalid(allowed ? 'unknown-field' : 'invalid-contract');
    if (!isOpaqueId(candidate.localEventId) || !isOpaqueId(candidate.checkpointId) || !isOpaqueId(candidate.flowId)
        || !isTimestamp(candidate.occurredAt) || !isContentVersion(candidate.contentVersion)
        || !CHECKPOINT_SURFACES.includes(candidate.surface as never)) return invalid('invalid-contract');
    const reasonCodes = ['content-version-mismatch', 'cursor-missing', 'surface-mismatch', 'expired-ephemeral', 'corrupt', 'future-schema', 'privacy-rejected', 'storage-failed', 'navigation-unavailable', 'retry-limit'];
    switch (candidate.eventName) {
        case 'checkpoint_entered':
            if (!isCatalogId(candidate.cursorId) || candidate.phase !== 'entered') return invalid('invalid-contract');
            break;
        case 'checkpoint_progressed':
            if (!isCatalogId(candidate.cursorId) || candidate.phase !== 'in_progress' || !Number.isInteger(candidate.progressPercent)
                || (candidate.progressPercent as number) < 0 || (candidate.progressPercent as number) > 100
                || !isSafeCount(candidate.completedStepCount) || !isSafeCount(candidate.totalStepCount)) return invalid('invalid-contract');
            break;
        case 'checkpoint_committed':
            if (!isOpaqueId(candidate.operationId) || !['mandatory-completed', 'deferred-delivery'].includes(candidate.commitResult as string)) return invalid('invalid-contract');
            break;
        case 'checkpoint_completed':
        case 'checkpoint_abandoned':
            if (!['lt-15s', '15-59s', '1-2m', '3-5m', 'gt-5m'].includes(candidate.durationBucket as string)) return invalid('invalid-contract');
            break;
        case 'checkpoint_invalidated':
            if (!reasonCodes.includes(candidate.reasonCode as string)) return invalid('invalid-contract');
            break;
        case 'restore_offered':
            if (!['direct', 'canonical-home', 'discard-incompatible'].includes(candidate.resumeStrategy as string)) return invalid('invalid-contract');
            break;
        case 'restore_succeeded':
            if (!['direct', 'canonical-home', 'discard-incompatible'].includes(candidate.resumeStrategy as string)
                || !['lt-15s', '15-59s', '1-2m', '3-5m', 'gt-5m'].includes(candidate.durationBucket as string)) return invalid('invalid-contract');
            break;
        case 'restore_failed':
            if (!reasonCodes.includes(candidate.reasonCode as string) || ![1, 2].includes(candidate.restoreFailureCount as number)) return invalid('invalid-contract');
            break;
        case 'commit_resumed':
            if (!isOpaqueId(candidate.operationId) || !MANDATORY_ORDER.includes(candidate.mandatoryStep as MandatoryStep)) return invalid('invalid-contract');
            break;
        case 'checkpoint_attempted':
            if (!isOpaqueId(candidate.operationId) || !isCatalogId(candidate.checkpointDefinitionId)
                || !isScoreBasisPoints(candidate.scoreBasisPoints) || typeof candidate.passed !== 'boolean'
                || !isSafeCount(candidate.criticalErrorCount) || !isSafeCount(candidate.skippedItemCount)) return invalid('invalid-contract');
            break;
        case 'reinforcement_assigned':
            if (!isOpaqueId(candidate.operationId) || ![1, 2].includes(candidate.reinforcementCycle as number) || !isSafeCount(candidate.weakCompetencyCount)) return invalid('invalid-contract');
            break;
        case 'support_required':
            if (!isOpaqueId(candidate.operationId) || !isSafeCount(candidate.weakCompetencyCount)) return invalid('invalid-contract');
            break;
        default:
            return invalid('invalid-contract');
    }
    return { ok: true, value: value as LocalCheckpointEventV1 };
}

export function validateOutboxEvent(value: unknown): ValidationResult<OutboxEventV1> {
    const failed = preflight<OutboxEventV1>(value);
    if (failed) return failed;
    const candidate = value as Record<string, unknown>;
    const keys = ['schemaVersion', 'eventId', 'event', 'deliveryState', 'automaticDeliveryRetryCount', 'deliveryRetryEpoch', 'nextAttemptAt', 'createdAt', 'acknowledgedAt'];
    if (!hasExactKeys(candidate, keys)) return invalid('invalid-contract');
    if (!isOpaqueId(candidate.eventId) || !validateSyncEvent(candidate.event).ok || !['pending', 'paused-retry-limit', 'acknowledged'].includes(candidate.deliveryState as string)) return invalid('invalid-contract');
    if (!Number.isInteger(candidate.automaticDeliveryRetryCount) || (candidate.automaticDeliveryRetryCount as number) < 0 || (candidate.automaticDeliveryRetryCount as number) > 20 || !isSafeCount(candidate.deliveryRetryEpoch)) return invalid('invalid-contract');
    if (!isTimestamp(candidate.createdAt) || (candidate.nextAttemptAt !== null && !isTimestamp(candidate.nextAttemptAt)) || (candidate.acknowledgedAt !== null && !isTimestamp(candidate.acknowledgedAt))) return invalid('invalid-contract');
    return { ok: true, value: value as OutboxEventV1 };
}

const TRANSITIONS: Record<CheckpointPhase, CheckpointPhase[]> = {
    entered: ['in_progress', 'abandoned', 'invalidated'],
    in_progress: ['in_progress', 'committed', 'abandoned', 'superseded', 'invalidated'],
    committed: ['completed', 'invalidated'],
    completed: [],
    abandoned: [],
    superseded: [],
    invalidated: [],
};

export function canTransitionCheckpointPhase(from: CheckpointPhase | undefined, to: CheckpointPhase): boolean {
    return from === undefined ? to === 'entered' : TRANSITIONS[from].includes(to);
}

function sortCanonical(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(sortCanonical);
    if (!isRecord(value)) return value;
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, sortCanonical(value[key])]));
}

export function stableStringify(value: unknown): string {
    return JSON.stringify(sortCanonical(value));
}

export function createCommitOperation(intent: CommitIntentV1, now: string): CommitOperationV1 {
    const requiredMandatorySteps = deriveRequiredMandatorySteps(intent);
    const outboxEventIds = intent.plannedSyncEvents.map((entry) => entry.eventId).sort();
    return {
        schemaVersion: 1,
        operationId: intent.operationId,
        checkpointId: intent.checkpointId,
        flowId: intent.flowId,
        surface: intent.surface,
        contentVersion: intent.contentVersion,
        mandatoryState: 'not-started',
        nextMandatoryStep: requiredMandatorySteps[0] ?? null,
        requiredMandatorySteps,
        completedMandatorySteps: [],
        auxiliaryDeliveryState: outboxEventIds.length > 0 ? 'pending-delivery' : 'not-required',
        outboxEventIds,
        automaticRetryCount: 0,
        retryEpoch: 0,
        lastFailureCode: null,
        createdAt: now,
        updatedAt: now,
    };
}
