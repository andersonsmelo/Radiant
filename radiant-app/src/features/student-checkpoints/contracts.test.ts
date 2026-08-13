import {
    canTransitionCheckpointPhase,
    createCommitOperation,
    deriveRequiredMandatorySteps,
    stableStringify,
    validateCommitIntent,
    validateCommitJournalEntry,
    validateCommitOperation,
    validateIdempotencyReceipt,
    validateLocalCheckpointEvent,
    validateOutboxEvent,
    validateStudentCheckpoint,
    validateSyncEvent,
} from './schemas';
import { resolveStudentCheckpointMode } from './mode';
import { checkpoint, FIXED_NOW, lessonIntent, reviewIntent, syncEvent, unitCheckpointIntent } from './testFixtures';

describe('student checkpoint contracts', () => {
    it.each([
        [undefined, 'off'],
        ['', 'off'],
        ['future', 'off'],
        ['OFF', 'off'],
        ['off', 'off'],
        ['shadow', 'shadow'],
        ['active', 'active'],
    ])('resolves mode %p to %s', (raw, expected) => {
        expect(resolveStudentCheckpointMode(raw)).toBe(expected);
    });

    it('accepts the closed checkpoint contract and rejects future, unknown and forbidden payloads', () => {
        expect(validateStudentCheckpoint(checkpoint())).toEqual({ ok: true, value: checkpoint() });
        expect(validateStudentCheckpoint({ ...checkpoint(), schemaVersion: 2 })).toEqual({ ok: false, reasonCode: 'future-schema' });
        expect(validateStudentCheckpoint({ ...checkpoint(), surprise: true })).toEqual({ ok: false, reasonCode: 'unknown-field' });
        expect(validateStudentCheckpoint({ ...checkpoint(), answer: '' })).toEqual({ ok: false, reasonCode: 'privacy-rejected' });
    });

    it('enforces the complete transition matrix', () => {
        expect(canTransitionCheckpointPhase(undefined, 'entered')).toBe(true);
        expect(canTransitionCheckpointPhase('entered', 'in_progress')).toBe(true);
        expect(canTransitionCheckpointPhase('in_progress', 'committed')).toBe(true);
        expect(canTransitionCheckpointPhase('committed', 'completed')).toBe(true);
        expect(canTransitionCheckpointPhase('completed', 'entered')).toBe(false);
        expect(canTransitionCheckpointPhase('entered', 'completed')).toBe(false);
    });

    it('validates all three intent branches and derives canonical mandatory authorities', () => {
        expect(validateCommitIntent(lessonIntent()).ok).toBe(true);
        expect(validateCommitIntent(reviewIntent()).ok).toBe(true);
        expect(validateCommitIntent(unitCheckpointIntent()).ok).toBe(true);
        expect(deriveRequiredMandatorySteps(lessonIntent())).toEqual(['attempt', 'evidence', 'mastery', 'review', 'xp', 'goal', 'journey']);
        expect(deriveRequiredMandatorySteps(reviewIntent())).toEqual(['attempt', 'evidence', 'mastery', 'review', 'xp']);
        expect(deriveRequiredMandatorySteps(unitCheckpointIntent())).toEqual(['attempt', 'evidence', 'mastery', 'review', 'xp', 'goal', 'journey']);
    });

    it('rejects responses and inconsistent derived values inside an intent', () => {
        expect(validateCommitIntent({ ...lessonIntent(), answer: 'A' })).toEqual({ ok: false, reasonCode: 'privacy-rejected' });
        expect(validateCommitIntent(lessonIntent({ scoreBasisPoints: 9000 }))).toEqual({ ok: false, reasonCode: 'invariant-failed' });
        expect(validateCommitIntent(lessonIntent({ xpDelta: -1 }))).toEqual({ ok: false, reasonCode: 'invalid-contract' });
        expect(validateCommitIntent(lessonIntent({ itemOutcomes: [{ ...lessonIntent().itemOutcomes[0], extra: true } as never] }))).toEqual({ ok: false, reasonCode: 'invalid-contract' });
        expect(validateCommitIntent(lessonIntent({ plannedSyncEvents: [{ eventId: 'event-1', event: { ...syncEvent(), operationId: 'other-operation' } }] }))).toEqual({ ok: false, reasonCode: 'invariant-failed' });
    });

    it('keeps canonical serialization deterministic', () => {
        expect(stableStringify({ z: 1, nested: { b: true, a: false }, a: 2 }))
            .toBe('{"a":2,"nested":{"a":false,"b":true},"z":1}');
    });

    it('rejects operation states that violate the persisted saga invariants', () => {
        const operation = createCommitOperation(lessonIntent(), FIXED_NOW);
        expect(validateCommitOperation({ ...operation, mandatoryState: 'completed' })).toEqual({ ok: false, reasonCode: 'invariant-failed' });
        expect(validateCommitOperation({ ...operation, automaticRetryCount: 21 })).toEqual({ ok: false, reasonCode: 'invalid-contract' });
        expect(validateCommitOperation({ ...operation, outboxEventIds: ['event-2', 'event-1'] })).toEqual({ ok: false, reasonCode: 'invariant-failed' });
        expect(validateCommitOperation({ ...operation, auxiliaryDeliveryState: 'not-required' })).toEqual({ ok: false, reasonCode: 'invariant-failed' });
        expect(validateCommitOperation({ ...operation, outboxEventIds: ['Event_A'] }).ok).toBe(true);
        expect(validateCommitOperation({ ...operation, mandatoryState: 'cancelled-before-effects', nextMandatoryStep: null }).ok).toBe(true);
    });

    it('validates the receipt and journal as closed, cross-linked contracts', () => {
        const intent = lessonIntent();
        const operation = createCommitOperation(intent, FIXED_NOW);
        expect(validateIdempotencyReceipt({
            schemaVersion: 1,
            operationId: intent.operationId,
            mandatoryStep: 'attempt',
            effectKind: 'learning-attempt-recorded',
            effectRecordId: 'effect-1',
            persistedAt: FIXED_NOW,
        }).ok).toBe(true);
        expect(validateIdempotencyReceipt({
            schemaVersion: 1,
            operationId: intent.operationId,
            mandatoryStep: 'attempt',
            effectKind: 'learning-attempt-recorded',
            effectRecordId: 'effect-1',
            persistedAt: FIXED_NOW,
            payload: true,
        })).toEqual({ ok: false, reasonCode: 'unknown-field' });
        expect(validateCommitJournalEntry({ schemaVersion: 1, operation: { ...operation, outboxEventIds: [] }, intent })).toEqual({ ok: false, reasonCode: 'invariant-failed' });
    });

    it('validates every nested sync and local field instead of only the envelope', () => {
        expect(validateSyncEvent({ ...syncEvent(), attemptId: '' })).toEqual({ ok: false, reasonCode: 'invalid-contract' });
        expect(validateSyncEvent({ ...syncEvent(), unitId: 'Unidade Livre' })).toEqual({ ok: false, reasonCode: 'invalid-contract' });
        expect(validateLocalCheckpointEvent({
            schemaVersion: 1,
            localEventId: 'local-1',
            eventName: 'checkpoint_entered',
            occurredAt: FIXED_NOW,
            surface: 'lesson',
            checkpointId: 'checkpoint-1',
            flowId: 'flow-1',
            contentVersion: 'content-v1',
            cursorId: 'step-1',
            phase: 'completed',
        })).toEqual({ ok: false, reasonCode: 'invalid-contract' });
    });

    it('keeps local lifecycle events outside the remote outbox', () => {
        const localEvent = {
            schemaVersion: 1,
            localEventId: 'local-1',
            eventName: 'checkpoint_entered',
            occurredAt: FIXED_NOW,
            surface: 'lesson',
            checkpointId: 'checkpoint-1',
            flowId: 'flow-1',
            contentVersion: 'content-v1',
            cursorId: 'step-1',
            phase: 'entered',
        };
        expect(validateLocalCheckpointEvent(localEvent).ok).toBe(true);
        expect(validateOutboxEvent({ schemaVersion: 1, eventId: 'event-1', event: localEvent })).toEqual({ ok: false, reasonCode: 'invalid-contract' });
        expect(validateOutboxEvent({
            schemaVersion: 1,
            eventId: 'event-1',
            event: syncEvent(),
            deliveryState: 'pending',
            automaticDeliveryRetryCount: 0,
            deliveryRetryEpoch: 0,
            nextAttemptAt: null,
            createdAt: FIXED_NOW,
            acknowledgedAt: null,
        }).ok).toBe(true);
    });
});
