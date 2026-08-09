import { STUDENT_CHECKPOINT_STORAGE_KEYS } from '../../constants/storageKeys';
import type { CheckpointSurface, CommitIntentV1, CommitJournalEntryV1, StudentCheckpointV1 } from './contracts';
import { canTransitionCheckpointPhase, createCommitOperation, stableStringify, validateCommitJournalEntry, validateStudentCheckpoint } from './schemas';
import type { KeyValueStorage } from './storage';

const MAX_TRANSITIONS = 500;
const TRANSITION_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;

export type CheckpointStoreEnvelopeV1 = {
    schemaVersion: 1;
    currentBySurface: Partial<Record<CheckpointSurface, StudentCheckpointV1>>;
    confirmedCheckpoints: Record<string, StudentCheckpointV1>;
    resumableFlowId: string | null;
    transitionJournal: StudentCheckpointV1[];
    journals: Record<string, CommitJournalEntryV1>;
};

function emptyEnvelope(): CheckpointStoreEnvelopeV1 {
    return {
        schemaVersion: 1,
        currentBySurface: {},
        confirmedCheckpoints: {},
        resumableFlowId: null,
        transitionJournal: [],
        journals: {},
    };
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateEnvelope(value: unknown): CheckpointStoreEnvelopeV1 | null {
    if (!isRecord(value) || value.schemaVersion !== 1) return null;
    const exactKeys = ['schemaVersion', 'currentBySurface', 'confirmedCheckpoints', 'resumableFlowId', 'transitionJournal', 'journals'];
    if (!Object.keys(value).every((key) => exactKeys.includes(key)) || Object.keys(value).length !== exactKeys.length) return null;
    if (!isRecord(value.currentBySurface) || !isRecord(value.confirmedCheckpoints) || !isRecord(value.journals)) return null;
    if (!Array.isArray(value.transitionJournal) || (value.resumableFlowId !== null && typeof value.resumableFlowId !== 'string')) return null;
    if (!Object.entries(value.currentBySurface).every(([surface, entry]) => validateStudentCheckpoint(entry).ok && (entry as StudentCheckpointV1).surface === surface)) return null;
    if (!Object.entries(value.confirmedCheckpoints).every(([checkpointId, entry]) => {
        const checkpoint = entry as StudentCheckpointV1;
        return validateStudentCheckpoint(entry).ok && checkpoint.checkpointId === checkpointId && ['committed', 'completed'].includes(checkpoint.phase);
    })) return null;
    if (value.transitionJournal.length > MAX_TRANSITIONS || !value.transitionJournal.every((entry) => validateStudentCheckpoint(entry).ok)) return null;
    if (!Object.entries(value.journals).every(([operationId, entry]) => validateCommitJournalEntry(entry).ok && (entry as CommitJournalEntryV1).operation.operationId === operationId)) return null;
    return value as CheckpointStoreEnvelopeV1;
}

export class CheckpointStore {
    private constructor(
        private readonly storage: KeyValueStorage,
        private readonly storageKey: string,
        private readonly quarantineKey: string,
        private readonly now: () => string,
    ) {}

    static active(storage: KeyValueStorage, now: () => string): CheckpointStore {
        return new CheckpointStore(storage, STUDENT_CHECKPOINT_STORAGE_KEYS.ACTIVE, STUDENT_CHECKPOINT_STORAGE_KEYS.ACTIVE_QUARANTINE, now);
    }

    static shadow(storage: KeyValueStorage, now: () => string): CheckpointStore {
        return new CheckpointStore(storage, STUDENT_CHECKPOINT_STORAGE_KEYS.SHADOW, STUDENT_CHECKPOINT_STORAGE_KEYS.SHADOW_QUARANTINE, now);
    }

    async load(): Promise<CheckpointStoreEnvelopeV1> {
        const raw = await this.storage.getItem(this.storageKey);
        if (raw === null) return emptyEnvelope();
        let parsed: unknown;
        try {
            parsed = JSON.parse(raw);
        } catch {
            await this.quarantine('corrupt');
            return emptyEnvelope();
        }
        if (isRecord(parsed) && parsed.schemaVersion !== 1) {
            await this.quarantine('future-schema');
            return emptyEnvelope();
        }
        const envelope = validateEnvelope(parsed);
        if (!envelope) {
            await this.quarantine('invalid-contract');
            return emptyEnvelope();
        }
        return envelope;
    }

    async saveCheckpoint(checkpoint: StudentCheckpointV1): Promise<void> {
        const validated = validateStudentCheckpoint(checkpoint);
        if (!validated.ok) throw new Error(validated.reasonCode);
        const envelope = await this.load();
        const previous = envelope.currentBySurface[checkpoint.surface];
        if (previous && stableStringify(previous) === stableStringify(checkpoint)) return;
        if (previous?.checkpointId === checkpoint.checkpointId
            && previous.phase !== checkpoint.phase
            && !canTransitionCheckpointPhase(previous.phase, checkpoint.phase)) {
            throw new Error('invalid-transition');
        }
        envelope.currentBySurface[checkpoint.surface] = checkpoint;
        if (!['completed', 'abandoned', 'superseded', 'invalidated'].includes(checkpoint.phase)) {
            envelope.resumableFlowId = checkpoint.flowId;
        } else if (envelope.resumableFlowId === checkpoint.flowId) {
            envelope.resumableFlowId = null;
        }
        if (checkpoint.phase === 'committed' || checkpoint.phase === 'completed') {
            envelope.confirmedCheckpoints[checkpoint.checkpointId] = checkpoint;
        }
        const cutoff = Date.parse(this.now()) - TRANSITION_RETENTION_MS;
        envelope.transitionJournal = [...envelope.transitionJournal, checkpoint]
            .filter((entry) => Date.parse(entry.updatedAt) >= cutoff)
            .slice(-MAX_TRANSITIONS);
        await this.persist(envelope);
    }

    async getCurrent(surface: CheckpointSurface): Promise<StudentCheckpointV1 | null> {
        return (await this.load()).currentBySurface[surface] ?? null;
    }

    async getResumeCandidate(surface: CheckpointSurface): Promise<StudentCheckpointV1 | null> {
        const envelope = await this.load();
        const current = envelope.currentBySurface[surface];
        if (!current || current.flowId !== envelope.resumableFlowId) return null;
        return current;
    }

    async getCheckpointById(checkpointId: string): Promise<StudentCheckpointV1 | null> {
        const envelope = await this.load();
        return Object.values(envelope.currentBySurface).find((entry) => entry?.checkpointId === checkpointId)
            ?? envelope.confirmedCheckpoints[checkpointId]
            ?? null;
    }

    async createJournal(intent: CommitIntentV1): Promise<CommitJournalEntryV1> {
        const envelope = await this.load();
        const existing = envelope.journals[intent.operationId];
        if (existing) return existing;
        const journal: CommitJournalEntryV1 = {
            schemaVersion: 1,
            operation: createCommitOperation(intent, this.now()),
            intent,
        };
        const validated = validateCommitJournalEntry(journal);
        if (!validated.ok) throw new Error(validated.reasonCode);
        envelope.journals[intent.operationId] = journal;
        await this.persist(envelope);
        return journal;
    }

    async getJournal(operationId: string): Promise<CommitJournalEntryV1 | null> {
        return (await this.load()).journals[operationId] ?? null;
    }

    async saveJournal(journal: CommitJournalEntryV1): Promise<void> {
        const validated = validateCommitJournalEntry(journal);
        if (!validated.ok) throw new Error(validated.reasonCode);
        const envelope = await this.load();
        envelope.journals[journal.operation.operationId] = journal;
        await this.persist(envelope);
    }

    private async persist(envelope: CheckpointStoreEnvelopeV1): Promise<void> {
        await this.storage.setItem(this.storageKey, stableStringify(envelope));
    }

    private async quarantine(reasonCode: string): Promise<void> {
        await this.storage.setItem(this.quarantineKey, stableStringify({ schemaVersion: 1, reasonCode, quarantinedAt: this.now() }));
        await this.storage.removeItem(this.storageKey);
    }
}
