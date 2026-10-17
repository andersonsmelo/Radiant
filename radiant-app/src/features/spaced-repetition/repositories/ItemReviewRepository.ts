import { STORAGE_KEYS } from '../../../constants/storageKeys';
import { itemAttemptEvidence, itemAttemptEvidenceEntries, itemKey, type ItemAttempt, type ItemCard, type ItemIdentity } from '../../../types/itemReview';
import { validateLearningEvidence } from '../../../types/learningEvidence';
import { advanceItemSm2 } from '../models/itemSm2';

type Storage = { getItem(key: string): Promise<string | null>; setItem(key: string, value: string): Promise<void>; removeItem(key: string): Promise<void> };
type Store = { schemaVersion: 'item-review.v1'; cards: Record<string, ItemCard>; attempts: ItemAttempt[] };
export const ITEM_ATTEMPT_CAP = 2000;
export const ITEM_CARD_CAP = 20000;
const queues = new WeakMap<Storage, Promise<unknown>>();
const exactFields = (value: object, fields: string[]) => Object.keys(value).length === fields.length && Object.keys(value).every(key => fields.includes(key));
const timestamp = (value: string) => typeof value === 'string' && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
function identityValid(item: ItemIdentity): boolean {
    return exactFields(item, ['lessonId', 'itemId', 'activityId', 'competencyId', 'contentVersion', 'evidenceKind'])
        && validateLearningEvidence({ activityId: item.activityId, interactionId: item.itemId, competencyId: item.competencyId,
            evidenceKind: item.evidenceKind, contentVersion: item.contentVersion, outcome: 'correct', hintUsed: false,
            durationBand: 'unknown', recordedAt: '2026-01-01T00:00:00.000Z' }).length === 0
        && validateLearningEvidence({ ...itemAttemptEvidence({ item, attemptId: 'check', firstOutcome: 'correct', finalOutcome: 'correct', hintUsed: false, durationBand: 'unknown', recordedAt: '2026-01-01T00:00:00.000Z', mode: 'study' }), interactionId: item.lessonId }).length === 0;
}
function attemptValid(attempt: ItemAttempt): boolean {
    const fields = ['attemptId', 'item', 'firstOutcome', 'finalOutcome', 'hintUsed', 'durationBand', 'recordedAt', 'mode'];
    if (attempt.mode === 'assessment') fields.push('assessment');
    if (attempt.mode === 'review-answer') fields.push('review');
    return exactFields(attempt, fields)
        && identityValid(attempt.item) && timestamp(attempt.recordedAt)
        && ['study', 'self-review', 'assessment', 'review-answer'].includes(attempt.mode) && typeof attempt.hintUsed === 'boolean'
        && ['correct', 'incorrect', 'skipped'].includes(attempt.firstOutcome)
        && ['correct', 'incorrect', 'skipped'].includes(attempt.finalOutcome)
        && (attempt.mode !== 'review-answer' || Boolean(attempt.review
            && exactFields(attempt.review, ['previousReviewedAt', 'scheduledDueAt', 'hasPriorAttempt'])
            && timestamp(attempt.review.previousReviewedAt) && timestamp(attempt.review.scheduledDueAt)
            && typeof attempt.review.hasPriorAttempt === 'boolean'))
        && (attempt.mode !== 'assessment' || Boolean(attempt.assessment
            && exactFields(attempt.assessment, ['competencyIds', 'isCriticalError'])
            && typeof attempt.assessment.isCriticalError === 'boolean'
            && Array.isArray(attempt.assessment.competencyIds) && attempt.assessment.competencyIds.length > 0
            && attempt.assessment.competencyIds[0] === attempt.item.competencyId
            && new Set(attempt.assessment.competencyIds).size === attempt.assessment.competencyIds.length
            && itemAttemptEvidenceEntries(attempt).every(evidence => validateLearningEvidence(evidence).length === 0)))
        && validateLearningEvidence(itemAttemptEvidence(attempt)).length === 0
        && validateLearningEvidence({ ...itemAttemptEvidence(attempt), interactionId: attempt.attemptId }).length === 0;
}
function cardValid(card: ItemCard): boolean {
    return exactFields(card, ['item', 'easeFactor', 'interval', 'repetitions', 'createdAt', 'lastReviewedAt', 'dueAt', 'lastAttemptId'])
        && identityValid(card.item) && Number.isFinite(card.easeFactor) && card.easeFactor >= 1.3 && card.easeFactor <= 2.5
        && Number.isInteger(card.interval) && card.interval >= 1 && card.interval <= 365
        && Number.isInteger(card.repetitions) && card.repetitions >= 0
        && timestamp(card.createdAt) && timestamp(card.lastReviewedAt) && timestamp(card.dueAt)
        && (card.lastAttemptId === null || /^[a-z0-9][a-z0-9:._-]*$/.test(card.lastAttemptId));
}

/** Uma escrita atômica contém a tentativa confirmada e a agenda. Sem fallback vazio na escrita. */
export class ItemReviewRepository {
    constructor(private readonly storage: Storage) {}
    private serialize<T>(work: () => Promise<T>): Promise<T> {
        const result = (queues.get(this.storage) ?? Promise.resolve()).then(work);
        queues.set(this.storage, result.then(() => undefined, () => undefined));
        return result;
    }
    private async load(): Promise<Store> {
        const raw = await this.storage.getItem(STORAGE_KEYS.ITEM_REVIEW);
        if (raw === null) return { schemaVersion: 'item-review.v1', cards: {}, attempts: [] };
        const store = JSON.parse(raw) as Store;
        if (!exactFields(store, ['schemaVersion', 'cards', 'attempts']) || store.schemaVersion !== 'item-review.v1'
            || !store.cards || typeof store.cards !== 'object' || Array.isArray(store.cards)
            || Object.keys(store.cards).length > ITEM_CARD_CAP || !Array.isArray(store.attempts) || store.attempts.length > ITEM_ATTEMPT_CAP
            || !Object.entries(store.cards).every(([key, card]) => cardValid(card) && key === itemKey(card.item))
            || !store.attempts.every(attemptValid)
            || new Set(store.attempts.map(attempt => JSON.stringify([attempt.attemptId, itemKey(attempt.item)]))).size !== store.attempts.length) throw new Error('item-review-store-unavailable');
        return store;
    }
    record(attempt: ItemAttempt, expectedDueAt?: string): Promise<{ accepted: boolean; duplicate: boolean }> {
        return this.recordMany([attempt], expectedDueAt);
    }
    /** Confirma a avaliação inteira ou nenhum de seus itens, numa única escrita. */
    recordBatch(attempts: ItemAttempt[]): Promise<{ accepted: boolean; duplicate: boolean }> {
        return this.recordMany(attempts);
    }
    private recordMany(attempts: ItemAttempt[], expectedDueAt?: string): Promise<{ accepted: boolean; duplicate: boolean }> {
        return this.serialize(async () => {
            try {
                if (!attempts.length || attempts.length > ITEM_ATTEMPT_CAP || !attempts.every(attemptValid)
                    || new Set(attempts.map(attempt => itemKey(attempt.item))).size !== attempts.length) return { accepted: false, duplicate: false };
                const store = await this.load();
                let changed = false;
                for (const attempt of attempts) {
                    const key = itemKey(attempt.item); const previous = store.cards[key];
                    const existing = store.attempts.find(entry => entry.attemptId === attempt.attemptId && itemKey(entry.item) === key);
                    if (existing) {
                        const signature = (entry: ItemAttempt) => JSON.stringify([entry.attemptId, itemKey(entry.item), entry.item.activityId,
                            entry.item.competencyId, entry.item.evidenceKind, entry.firstOutcome, entry.finalOutcome, entry.hintUsed,
                            entry.durationBand, entry.mode, ['self-review', 'review-answer'].includes(entry.mode) ? null : entry.recordedAt, entry.assessment, entry.review]);
                        if (signature(existing) !== signature(attempt)) return { accepted: false, duplicate: true };
                        continue;
                    }
                    if (previous?.lastAttemptId === attempt.attemptId) return { accepted: false, duplicate: true };
                    if (previous && Date.parse(attempt.recordedAt) <= Date.parse(previous.lastReviewedAt) && previous.lastAttemptId !== null) return { accepted: false, duplicate: false };
                    if (['self-review', 'review-answer'].includes(attempt.mode) && (!previous || previous.dueAt !== expectedDueAt || Date.parse(previous.dueAt) > Date.parse(attempt.recordedAt))) return { accepted: false, duplicate: false };
                    if (attempt.mode === 'review-answer' && (!previous || attempt.review?.previousReviewedAt !== previous.lastReviewedAt
                        || attempt.review.scheduledDueAt !== previous.dueAt || attempt.review.hasPriorAttempt !== (previous.lastAttemptId !== null))) return { accepted: false, duplicate: false };
                    if (!previous && Object.keys(store.cards).length >= ITEM_CARD_CAP) return { accepted: false, duplicate: false };
                    const quality = attempt.firstOutcome !== 'correct' || attempt.assessment?.isCriticalError ? 1 : attempt.hintUsed || attempt.mode === 'self-review' ? 4 : 5;
                    const next = advanceItemSm2(previous ?? { interval: 1, repetitions: 0, easeFactor: 2.5 }, quality, Date.parse(attempt.recordedAt));
                    store.cards[key] = { item: attempt.item, interval: next.interval, repetitions: next.repetitions, easeFactor: next.easeFactor,
                        createdAt: previous?.createdAt ?? attempt.recordedAt, lastReviewedAt: attempt.recordedAt,
                        dueAt: new Date(next.dueAtMs).toISOString(), lastAttemptId: attempt.attemptId };
                    store.attempts = [...store.attempts, attempt].slice(-ITEM_ATTEMPT_CAP);
                    changed = true;
                }
                if (changed) await this.storage.setItem(STORAGE_KEYS.ITEM_REVIEW, JSON.stringify(store));
                return { accepted: true, duplicate: !changed };
            } catch { return { accepted: false, duplicate: false }; }
        });
    }
    getCards(): Promise<ItemCard[]> {
        return this.serialize(async () => { try { return Object.values((await this.load()).cards); } catch { return []; } });
    }
    inspect(): Promise<{ readable: boolean; cards: ItemCard[] }> {
        return this.serialize(async () => {
            try { return { readable: true, cards: Object.values((await this.load()).cards) }; }
            catch { return { readable: false, cards: [] }; }
        });
    }
    getAttempts(): Promise<ItemAttempt[]> {
        return this.serialize(async () => { try { return (await this.load()).attempts; } catch { return []; } });
    }
    seedLegacy(items: ItemIdentity[], dueAt: string, now: string): Promise<boolean> {
        return this.seedLegacyGroups([{ items, dueAt }], now);
    }
    seedLegacyGroups(groups: { items: ItemIdentity[]; dueAt: string }[], now: string): Promise<boolean> {
        return this.serialize(async () => {
            try {
                if (!timestamp(now)) return false;
                const store = await this.load();
                let changed = false;
                const managed = new Set(Object.values(store.cards).map(card => card.item.lessonId));
                for (const { items, dueAt } of groups) {
                    if (!items.length || !items.every(identityValid) || !timestamp(dueAt)
                        || items.some(item => item.lessonId !== items[0].lessonId || item.contentVersion !== items[0].contentVersion)
                        || new Set(items.map(itemKey)).size !== items.length) return false;
                    if (managed.has(items[0].lessonId)) continue;
                    if (Object.keys(store.cards).length + items.length > ITEM_CARD_CAP) return false;
                    items.forEach((item, index) => {
                        const scheduled = index === 0 ? dueAt : new Date(Math.max(Date.parse(dueAt), Date.parse(now)) + index * 86400000).toISOString();
                        store.cards[itemKey(item)] = { item, interval: 1, repetitions: 0, easeFactor: 2.5,
                            createdAt: now, lastReviewedAt: now, dueAt: scheduled, lastAttemptId: null };
                    });
                    managed.add(items[0].lessonId);
                    changed = true;
                }
                if (changed) await this.storage.setItem(STORAGE_KEYS.ITEM_REVIEW, JSON.stringify(store));
                return true;
            } catch { return false; }
        });
    }

    clear(): Promise<void> { return this.serialize(() => this.storage.removeItem(STORAGE_KEYS.ITEM_REVIEW)); }
}
function nativeStorage(): Storage {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- A porta em memória não depende de NativeModule.
    const module = require('@react-native-async-storage/async-storage');
    return module.default ?? module;
}
export const itemReviewStorage: Storage = {
    getItem: key => nativeStorage().getItem(key),
    setItem: (key, value) => nativeStorage().setItem(key, value),
    removeItem: key => nativeStorage().removeItem(key),
};
export const itemReviewRepository = new ItemReviewRepository(itemReviewStorage);
