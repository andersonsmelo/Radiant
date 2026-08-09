import { STUDENT_CHECKPOINT_STORAGE_KEYS } from '../../constants/storageKeys';
import { AuthorityStore } from './AuthorityStore';
import { CheckpointStore } from './CheckpointStore';
import { OutboxStore } from './OutboxStore';
import { MemoryKeyValueStorage } from './storage';
import { checkpoint, FIXED_NOW, lessonIntent, syncEvent } from './testFixtures';

describe('student checkpoint repositories', () => {
    it('keeps active and shadow stores physically isolated', async () => {
        const storage = new MemoryKeyValueStorage();
        const active = CheckpointStore.active(storage, () => FIXED_NOW);
        const shadow = CheckpointStore.shadow(storage, () => FIXED_NOW);
        await active.saveCheckpoint(checkpoint());
        await shadow.saveCheckpoint(checkpoint({ checkpointId: 'checkpoint-shadow' }));
        expect(storage.snapshot()[STUDENT_CHECKPOINT_STORAGE_KEYS.ACTIVE]).toContain('checkpoint-1');
        expect(storage.snapshot()[STUDENT_CHECKPOINT_STORAGE_KEYS.SHADOW]).toContain('checkpoint-shadow');
        expect(STUDENT_CHECKPOINT_STORAGE_KEYS.ACTIVE).not.toBe(STUDENT_CHECKPOINT_STORAGE_KEYS.SHADOW);
    });

    it('keeps one resumable flow and compacts only ephemeral history to 30 days and 500 transitions', async () => {
        const storage = new MemoryKeyValueStorage();
        const store = CheckpointStore.active(storage, () => FIXED_NOW);
        for (let index = 0; index < 505; index += 1) {
            await store.saveCheckpoint(checkpoint({ checkpointId: `checkpoint-${index}`, flowId: 'flow-one', sequence: index, updatedAt: FIXED_NOW }));
        }
        await store.saveCheckpoint(checkpoint({ checkpointId: 'checkpoint-new-flow', flowId: 'flow-two', sequence: 506 }));
        const envelope = await store.load();
        expect(envelope.transitionJournal).toHaveLength(500);
        expect(envelope.resumableFlowId).toBe('flow-two');
    });

    it('returns only the checkpoint that owns the single global resumable flow', async () => {
        const storage = new MemoryKeyValueStorage();
        const store = CheckpointStore.active(storage, () => FIXED_NOW);
        await store.saveCheckpoint(checkpoint({ checkpointId: 'checkpoint-lesson', flowId: 'lesson:block-1' }));
        await store.saveCheckpoint(checkpoint({
            checkpointId: 'checkpoint-review',
            flowId: 'review-session-v1',
            surface: 'review',
            lessonId: undefined,
            reviewCardId: 'review-card-1',
        }));

        await expect(store.getGlobalResumeCandidate()).resolves.toMatchObject({
            checkpointId: 'checkpoint-review',
            flowId: 'review-session-v1',
        });
    });

    it('expires only old transition history while retaining confirmed checkpoints and outbox events without TTL', async () => {
        const storage = new MemoryKeyValueStorage();
        const store = CheckpointStore.active(storage, () => FIXED_NOW);
        await store.saveCheckpoint(checkpoint({
            checkpointId: 'confirmed-old',
            phase: 'completed',
            createdAt: '2026-06-01T12:00:00.000Z',
            updatedAt: '2026-06-01T12:00:00.000Z',
            expiresAt: undefined,
        }));
        const outbox = new OutboxStore(storage, () => FIXED_NOW);
        await outbox.enqueue({ eventId: 'event-1', event: syncEvent() });
        const envelope = await store.load();
        expect(envelope.transitionJournal).toHaveLength(0);
        expect(envelope.confirmedCheckpoints['confirmed-old']).toBeDefined();
        expect(await outbox.list()).toHaveLength(1);
    });

    it('quarantines corrupt and future stores without preserving rejected raw payload', async () => {
        const storage = new MemoryKeyValueStorage({
            [STUDENT_CHECKPOINT_STORAGE_KEYS.ACTIVE]: '{"schemaVersion":2,"answer":"proibida"}',
        });
        const store = CheckpointStore.active(storage, () => FIXED_NOW);
        expect((await store.load()).schemaVersion).toBe(1);
        const snapshot = storage.snapshot();
        expect(snapshot[STUDENT_CHECKPOINT_STORAGE_KEYS.ACTIVE_QUARANTINE]).toContain('future-schema');
        expect(snapshot[STUDENT_CHECKPOINT_STORAGE_KEYS.ACTIVE_QUARANTINE]).not.toContain('proibida');
    });

    it('never compacts a pending commit journal', async () => {
        const storage = new MemoryKeyValueStorage();
        const store = CheckpointStore.active(storage, () => FIXED_NOW);
        await store.createJournal(lessonIntent());
        for (let index = 0; index < 505; index += 1) {
            await store.saveCheckpoint(checkpoint({ checkpointId: `checkpoint-${index}`, sequence: index }));
        }
        expect((await store.getJournal('operation-1'))?.intent).toEqual(lessonIntent());
    });

    it('writes an authority effect and its receipt in the same durable write and deduplicates on relaunch', async () => {
        const storage = new MemoryKeyValueStorage();
        const authority = new AuthorityStore(storage, 'xp', () => FIXED_NOW);
        const first = await authority.apply({ operationId: 'operation-1', effectKind: 'xp-awarded', effectRecordId: 'xp-1', payloadHash: 'a'.repeat(64) });
        const writesAfterFirst = storage.writeCount;
        const relaunched = new AuthorityStore(storage, 'xp', () => FIXED_NOW);
        const second = await relaunched.apply({ operationId: 'operation-1', effectKind: 'xp-awarded', effectRecordId: 'xp-1', payloadHash: 'a'.repeat(64) });
        expect(first.receipt).toEqual(second.receipt);
        expect(storage.writeCount).toBe(writesAfterFirst);
        expect(await relaunched.effectCount()).toBe(1);
    });

    it('fails closed and records only sanitized metadata for a future authority store', async () => {
        const authorityKey = `${STUDENT_CHECKPOINT_STORAGE_KEYS.AUTHORITY_PREFIX}xp`;
        const quarantineKey = `${STUDENT_CHECKPOINT_STORAGE_KEYS.AUTHORITY_QUARANTINE_PREFIX}xp`;
        const storage = new MemoryKeyValueStorage({ [authorityKey]: '{"schemaVersion":2,"answer":"proibida"}' });
        const authority = new AuthorityStore(storage, 'xp', () => FIXED_NOW);
        await expect(authority.effectCount()).rejects.toThrow('authority-store-quarantined');
        expect(storage.snapshot()[quarantineKey]).toContain('future-schema');
        expect(storage.snapshot()[quarantineKey]).not.toContain('proibida');
    });

    it('leaves no journal when the atomic operation+intent write is interrupted', async () => {
        class InterruptedStorage extends MemoryKeyValueStorage {
            override async setItem(key: string, value: string): Promise<void> {
                if (key === STUDENT_CHECKPOINT_STORAGE_KEYS.ACTIVE) throw new Error('storage-interrupted');
                await super.setItem(key, value);
            }
        }
        const storage = new InterruptedStorage();
        const store = CheckpointStore.active(storage, () => FIXED_NOW);
        await expect(store.createJournal(lessonIntent())).rejects.toThrow('storage-interrupted');
        expect(storage.snapshot()[STUDENT_CHECKPOINT_STORAGE_KEYS.ACTIVE]).toBeUndefined();
    });

    it('deduplicates outbox eventIds and rejects idempotency payload mismatch', async () => {
        const storage = new MemoryKeyValueStorage();
        const outbox = new OutboxStore(storage, () => FIXED_NOW);
        await outbox.enqueue({ eventId: 'event-1', event: syncEvent() });
        await outbox.enqueue({ eventId: 'event-1', event: syncEvent() });
        expect(await outbox.list()).toHaveLength(1);
        await expect(outbox.enqueue({ eventId: 'event-1', event: { ...syncEvent(), journeyNodeId: 'node-2' } }))
            .rejects.toThrow('idempotency-payload-mismatch');
        expect(storage.snapshot()[STUDENT_CHECKPOINT_STORAGE_KEYS.OUTBOX_QUARANTINE]).toContain('idempotency-payload-mismatch');
        expect(storage.snapshot()[STUDENT_CHECKPOINT_STORAGE_KEYS.OUTBOX_QUARANTINE]).not.toContain('node-2');
        expect(await outbox.list()).toHaveLength(1);
    });

    it('quarantines an envelope with an unknown root field instead of accepting it', async () => {
        const storage = new MemoryKeyValueStorage({
            [STUDENT_CHECKPOINT_STORAGE_KEYS.ACTIVE]: JSON.stringify({
                schemaVersion: 1,
                currentBySurface: {},
                confirmedCheckpoints: {},
                resumableFlowId: null,
                transitionJournal: [],
                journals: {},
                unexpected: true,
            }),
        });
        const store = CheckpointStore.active(storage, () => FIXED_NOW);
        expect((await store.load()).schemaVersion).toBe(1);
        expect(storage.snapshot()[STUDENT_CHECKPOINT_STORAGE_KEYS.ACTIVE_QUARANTINE]).toContain('invalid-contract');
    });
});
