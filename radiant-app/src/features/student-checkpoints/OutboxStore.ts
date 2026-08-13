import { STUDENT_CHECKPOINT_STORAGE_KEYS } from '../../constants/storageKeys';
import type { OutboxEventV1, PlannedSyncEventV1 } from './contracts';
import { stableStringify, validateOutboxEvent, validateSyncEvent } from './schemas';
import type { KeyValueStorage } from './storage';

type OutboxEnvelopeV1 = { schemaVersion: 1; events: Record<string, OutboxEventV1> };

function emptyEnvelope(): OutboxEnvelopeV1 {
    return { schemaVersion: 1, events: {} };
}

export class OutboxStore {
    constructor(private readonly storage: KeyValueStorage, private readonly now: () => string) {}

    async enqueue(planned: PlannedSyncEventV1): Promise<OutboxEventV1> {
        if (!validateSyncEvent(planned.event).ok) throw new Error('invalid-contract');
        const envelope = await this.load();
        const existing = envelope.events[planned.eventId];
        if (existing) {
            if (stableStringify(existing.event) !== stableStringify(planned.event)) {
                await this.recordQuarantine('idempotency-payload-mismatch', planned.eventId);
                throw new Error('idempotency-payload-mismatch');
            }
            return existing;
        }
        const event: OutboxEventV1 = {
            schemaVersion: 1,
            eventId: planned.eventId,
            event: planned.event,
            deliveryState: 'pending',
            automaticDeliveryRetryCount: 0,
            deliveryRetryEpoch: 0,
            nextAttemptAt: null,
            createdAt: this.now(),
            acknowledgedAt: null,
        };
        const validated = validateOutboxEvent(event);
        if (!validated.ok) throw new Error(validated.reasonCode);
        envelope.events[event.eventId] = event;
        await this.storage.setItem(STUDENT_CHECKPOINT_STORAGE_KEYS.OUTBOX, stableStringify(envelope));
        return event;
    }

    async list(): Promise<OutboxEventV1[]> {
        return Object.values((await this.load()).events).sort((left, right) => left.eventId.localeCompare(right.eventId));
    }

    private async load(): Promise<OutboxEnvelopeV1> {
        const raw = await this.storage.getItem(STUDENT_CHECKPOINT_STORAGE_KEYS.OUTBOX);
        if (!raw) return emptyEnvelope();
        let parsed: OutboxEnvelopeV1;
        try {
            parsed = JSON.parse(raw) as OutboxEnvelopeV1;
        } catch {
            await this.recordQuarantine('corrupt', null);
            throw new Error('outbox-store-quarantined');
        }
        if (parsed.schemaVersion !== 1 || typeof parsed.events !== 'object' || parsed.events === null || Array.isArray(parsed.events)
            || !Object.entries(parsed.events).every(([eventId, event]) => eventId === event.eventId && validateOutboxEvent(event).ok)) {
            await this.recordQuarantine(parsed.schemaVersion !== 1 ? 'future-schema' : 'invalid-contract', null);
            throw new Error('outbox-store-quarantined');
        }
        return parsed;
    }

    private async recordQuarantine(reasonCode: string, eventId: string | null): Promise<void> {
        await this.storage.setItem(STUDENT_CHECKPOINT_STORAGE_KEYS.OUTBOX_QUARANTINE, stableStringify({
            schemaVersion: 1,
            reasonCode,
            eventId,
            quarantinedAt: this.now(),
        }));
    }
}
