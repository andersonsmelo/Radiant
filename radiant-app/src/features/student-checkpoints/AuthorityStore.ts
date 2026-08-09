import { STUDENT_CHECKPOINT_STORAGE_KEYS } from '../../constants/storageKeys';
import type { EffectKind, IdempotencyReceiptV1, MandatoryStep } from './contracts';
import { stableStringify, validateIdempotencyReceipt } from './schemas';
import type { KeyValueStorage } from './storage';

type AuthorityEffect = {
    operationId: string;
    effectKind: EffectKind;
    effectRecordId: string;
    payloadHash: string;
};

type AuthorityEnvelopeV1 = {
    schemaVersion: 1;
    effects: Record<string, AuthorityEffect>;
    receipts: Record<string, IdempotencyReceiptV1>;
};

export type AuthorityApplyInput = AuthorityEffect;
export type AuthorityApplyResult = { effect: AuthorityEffect; receipt: IdempotencyReceiptV1 };

function emptyEnvelope(): AuthorityEnvelopeV1 {
    return { schemaVersion: 1, effects: {}, receipts: {} };
}

function receiptKey(input: AuthorityApplyInput): string {
    return `${input.operationId}:${input.effectKind}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidEffect(value: unknown): value is AuthorityEffect {
    if (!isRecord(value)) return false;
    const keys = ['operationId', 'effectKind', 'effectRecordId', 'payloadHash'];
    return Object.keys(value).length === keys.length
        && Object.keys(value).every((key) => keys.includes(key))
        && typeof value.operationId === 'string'
        && typeof value.effectKind === 'string'
        && typeof value.effectRecordId === 'string'
        && typeof value.payloadHash === 'string'
        && /^[A-Za-z0-9:_-]{1,96}$/.test(value.operationId)
        && /^[A-Za-z0-9:_-]{1,96}$/.test(value.effectRecordId)
        && /^[a-f0-9]{64}$/.test(value.payloadHash);
}

export class AuthorityStore {
    private remainingFailures = 0;

    constructor(
        private readonly storage: KeyValueStorage,
        private readonly mandatoryStep: MandatoryStep,
        private readonly now: () => string,
    ) {}

    failNext(count: number): void {
        this.remainingFailures = Math.max(0, count);
    }

    async apply(input: AuthorityApplyInput): Promise<AuthorityApplyResult> {
        if (!isValidEffect(input)) throw new Error('invalid-contract');
        const envelope = await this.load();
        const key = receiptKey(input);
        const existingEffect = envelope.effects[key];
        const existingReceipt = envelope.receipts[key];
        if (existingEffect && existingReceipt) {
            if (stableStringify(existingEffect) !== stableStringify(input)) throw new Error('idempotency-payload-mismatch');
            return { effect: existingEffect, receipt: existingReceipt };
        }
        if (existingEffect || existingReceipt) throw new Error('authority-atomicity-violation');
        if (this.remainingFailures > 0) {
            this.remainingFailures -= 1;
            throw new Error('dependency-unavailable');
        }
        const receipt: IdempotencyReceiptV1 = {
            schemaVersion: 1,
            operationId: input.operationId,
            mandatoryStep: this.mandatoryStep,
            effectKind: input.effectKind,
            effectRecordId: input.effectRecordId,
            persistedAt: this.now(),
        };
        if (!validateIdempotencyReceipt(receipt).ok) throw new Error('invalid-contract');
        const next: AuthorityEnvelopeV1 = {
            schemaVersion: 1,
            effects: { ...envelope.effects, [key]: input },
            receipts: { ...envelope.receipts, [key]: receipt },
        };
        await this.storage.setItem(this.storageKey(), stableStringify(next));
        return { effect: input, receipt };
    }

    async effectCount(): Promise<number> {
        return Object.keys((await this.load()).effects).length;
    }

    async effectKinds(): Promise<EffectKind[]> {
        return Object.values((await this.load()).effects).map((effect) => effect.effectKind).sort();
    }

    private async load(): Promise<AuthorityEnvelopeV1> {
        const raw = await this.storage.getItem(this.storageKey());
        if (!raw) return emptyEnvelope();
        let parsed: unknown;
        try {
            parsed = JSON.parse(raw);
        } catch {
            await this.quarantine('corrupt');
            throw new Error('authority-store-quarantined');
        }
        if (isRecord(parsed) && parsed.schemaVersion !== 1) {
            await this.quarantine('future-schema');
            throw new Error('authority-store-quarantined');
        }
        if (!isRecord(parsed) || Object.keys(parsed).length !== 3
            || !['schemaVersion', 'effects', 'receipts'].every((key) => key in parsed)
            || !isRecord(parsed.effects) || !isRecord(parsed.receipts)) {
            await this.quarantine('invalid-contract');
            throw new Error('authority-store-quarantined');
        }
        const effects = parsed.effects as Record<string, unknown>;
        const receipts = parsed.receipts as Record<string, unknown>;
        const effectEntries = Object.entries(effects);
        const receiptEntries = Object.entries(receipts);
        const valid = effectEntries.length === receiptEntries.length && effectEntries.every(([key, effectValue]) => {
            const effect = effectValue as AuthorityEffect;
            const receipt = receipts[key];
            return isValidEffect(effect)
                && receiptKey(effect) === key
                && validateIdempotencyReceipt(receipt).ok
                && (receipt as IdempotencyReceiptV1).mandatoryStep === this.mandatoryStep
                && (receipt as IdempotencyReceiptV1).operationId === effect.operationId
                && (receipt as IdempotencyReceiptV1).effectKind === effect.effectKind
                && (receipt as IdempotencyReceiptV1).effectRecordId === effect.effectRecordId;
        });
        if (!valid) {
            await this.quarantine('invalid-contract');
            throw new Error('authority-store-quarantined');
        }
        return parsed as AuthorityEnvelopeV1;
    }

    private storageKey(): string {
        return `${STUDENT_CHECKPOINT_STORAGE_KEYS.AUTHORITY_PREFIX}${this.mandatoryStep}`;
    }

    private async quarantine(reasonCode: string): Promise<void> {
        await this.storage.setItem(`${STUDENT_CHECKPOINT_STORAGE_KEYS.AUTHORITY_QUARANTINE_PREFIX}${this.mandatoryStep}`, stableStringify({
            schemaVersion: 1,
            reasonCode,
            quarantinedAt: this.now(),
        }));
    }
}
