import { STORAGE_KEYS } from '../../../constants/storageKeys';
import { itemAttemptEvidence, itemAttemptEvidenceEntries, itemKey, type ItemAttempt, type ItemCard, type ItemIdentity } from '../../../types/itemReview';
import { validateLearningEvidence } from '../../../types/learningEvidence';
import { advanceItemSm2 } from '../models/itemSm2';

type Storage = { getItem(key: string): Promise<string | null>; setItem(key: string, value: string): Promise<void>; removeItem(key: string): Promise<void> };
type Store = { schemaVersion: 'item-review.v1'; cards: Record<string, ItemCard>; attempts: ItemAttempt[] };
export const ITEM_ATTEMPT_CAP = 2000;
export const ITEM_CARD_CAP = 20000;
export const ITEM_QUARANTINE_CAP = 200;
type QuarantineEntry = { kind: 'card'; key: string; record: unknown; quarantinedAt: string }
    | { kind: 'attempt'; record: unknown; quarantinedAt: string };
const queues = new WeakMap<Storage, Promise<unknown>>();
const validatedStores = new WeakMap<Storage, { raw: string; store: Store }>();
function cloneStore(store: Store): Store {
    const cards: Record<string, ItemCard> = {};
    for (const [key, card] of Object.entries(store.cards)) {
        cards[key] = { ...card, item: { ...card.item } };
    }
    const attempts = store.attempts.map(attempt => ({
        ...attempt,
        item: { ...attempt.item },
        ...(attempt.assessment ? { assessment: { ...attempt.assessment, competencyIds: [...attempt.assessment.competencyIds] } } : {}),
        ...(attempt.review ? { review: { ...attempt.review } } : {}),
    }));
    return { schemaVersion: 'item-review.v1', cards, attempts };
}
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
/** Um registro de outro tipo (nulo, número) faz o validador lançar; aqui ele só é inválido. */
function safely(check: () => boolean): boolean {
    try { return check(); } catch { return false; }
}
function readQuarantine(raw: string): QuarantineEntry[] {
    const parsed = JSON.parse(raw) as { schemaVersion: string; entries: QuarantineEntry[] };
    if (!parsed || typeof parsed !== 'object' || !exactFields(parsed, ['schemaVersion', 'entries'])
        || parsed.schemaVersion !== 'item-review-quarantine.v1' || !Array.isArray(parsed.entries)) {
        throw new Error('item-review-quarantine-unavailable');
    }
    return parsed.entries;
}
const quarantineFingerprint = (entry: QuarantineEntry) =>
    JSON.stringify([entry.kind, entry.kind === 'card' ? entry.key : null, entry.record]);
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
        if (raw === null) {
            validatedStores.delete(this.storage);
            return { schemaVersion: 'item-review.v1', cards: {}, attempts: [] };
        }
        const cached = validatedStores.get(this.storage);
        if (cached && cached.raw === raw) {
            return cloneStore(cached.store);
        }
        const store = JSON.parse(raw) as Store;
        if (!exactFields(store, ['schemaVersion', 'cards', 'attempts']) || store.schemaVersion !== 'item-review.v1'
            || !store.cards || typeof store.cards !== 'object' || Array.isArray(store.cards)
            || Object.keys(store.cards).length > ITEM_CARD_CAP || !Array.isArray(store.attempts)
            || store.attempts.length > ITEM_ATTEMPT_CAP) throw new Error('item-review-store-unavailable');
        // R6 (A3): o envelope é válido, então um registro inválido sai sozinho, em
        // vez de bloquear a revisão inteira. A tentativa repetida fica com a primeira.
        const quarantinedAt = new Date().toISOString();
        const rejected: QuarantineEntry[] = [];
        for (const [key, card] of Object.entries(store.cards)) {
            if (safely(() => cardValid(card) && key === itemKey(card.item))) continue;
            rejected.push({ kind: 'card', key, record: card, quarantinedAt });
            delete store.cards[key];
        }
        const seen = new Set<string>();
        store.attempts = store.attempts.filter(attempt => {
            const identity = safely(() => attemptValid(attempt)) ? JSON.stringify([attempt.attemptId, itemKey(attempt.item)]) : null;
            if (identity !== null && !seen.has(identity)) {
                seen.add(identity);
                return true;
            }
            rejected.push({ kind: 'attempt', record: attempt, quarantinedAt });
            return false;
        });
        if (rejected.length) {
            // A quarentena grava ANTES do store: se ela falhar, o store fica como
            // estava e indisponível, sem perder o registro.
            await this.quarantine(rejected);
            const serialized = JSON.stringify(store);
            await this.storage.setItem(STORAGE_KEYS.ITEM_REVIEW, serialized);
            validatedStores.set(this.storage, { raw: serialized, store: cloneStore(store) });
            return store;
        }
        validatedStores.set(this.storage, { raw, store: cloneStore(store) });
        return store;
    }
    /** Acrescenta os registros à quarentena, sem repetir o que ela já guarda, até o teto. */
    private async quarantine(entries: QuarantineEntry[]): Promise<void> {
        const raw = await this.storage.getItem(STORAGE_KEYS.ITEM_REVIEW_QUARANTINE);
        const existing = raw === null ? [] : readQuarantine(raw);
        const known = new Set(existing.map(quarantineFingerprint));
        const added = entries.filter(entry => !known.has(quarantineFingerprint(entry)));
        if (!added.length) return;
        const kept = [...existing, ...added].slice(-ITEM_QUARANTINE_CAP);
        await this.storage.setItem(STORAGE_KEYS.ITEM_REVIEW_QUARANTINE,
            JSON.stringify({ schemaVersion: 'item-review-quarantine.v1', entries: kept }));
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
                if (changed) {
                    const serialized = JSON.stringify(store);
                    await this.storage.setItem(STORAGE_KEYS.ITEM_REVIEW, serialized);
                    validatedStores.set(this.storage, { raw: serialized, store: cloneStore(store) });
                }
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
                if (changed) {
                    const serialized = JSON.stringify(store);
                    await this.storage.setItem(STORAGE_KEYS.ITEM_REVIEW, serialized);
                    validatedStores.set(this.storage, { raw: serialized, store: cloneStore(store) });
                }
                return true;
            } catch { return false; }
        });
    }

    /**
     * A1 (ADR de 2026-10-18, a versão nova preserva a data). Para cada lição com
     * cartões de uma versão que o catálogo não tem mais:
     * - o mesmo `itemId` na versão atual herda só o `dueAt`, sem intervalo,
     *   repetições ou tentativa (a evidência fica na versão em que foi
     *   registrada);
     * - o item que saiu do catálogo sai da agenda;
     * - o item novo é semeado como na migração do legado, depois dos herdados.
     *
     * Lição sem definições atuais fica intacta: uma falha do catálogo não pode
     * apagar a agenda. Um cartão da versão atual já existente, criado por
     * estudo, prevalece sobre o herdado. Tudo numa única escrita.
     */
    reconcileVersions(plans: { lessonId: string; current: ItemIdentity[] }[], now: string): Promise<boolean> {
        return this.serialize(async () => {
            try {
                if (!timestamp(now)) return false;
                const store = await this.load();
                let changed = false;
                for (const { lessonId, current } of plans) {
                    if (!current.length) continue;
                    if (!current.every(item => identityValid(item) && item.lessonId === lessonId)
                        || new Set(current.map(itemKey)).size !== current.length) return false;
                    const currentKeys = new Set(current.map(itemKey));
                    const lessonCards = Object.values(store.cards).filter(card => card.item.lessonId === lessonId);
                    const orphans = lessonCards.filter(card => !currentKeys.has(itemKey(card.item)))
                        .sort((a, b) => Date.parse(a.dueAt) - Date.parse(b.dueAt) || itemKey(a.item).localeCompare(itemKey(b.item)));
                    if (!orphans.length) continue;
                    const earliest = Math.min(...lessonCards.map(card => Date.parse(card.dueAt)));
                    const byItemId = new Map(current.map(item => [item.itemId, item]));
                    for (const orphan of orphans) {
                        delete store.cards[itemKey(orphan.item)];
                        const next = byItemId.get(orphan.item.itemId);
                        if (next && !store.cards[itemKey(next)]) {
                            store.cards[itemKey(next)] = { item: next, interval: 1, repetitions: 0, easeFactor: 2.5,
                                createdAt: now, lastReviewedAt: now, dueAt: orphan.dueAt, lastAttemptId: null };
                        }
                    }
                    const missing = current.filter(item => !store.cards[itemKey(item)]);
                    const offset = current.length > missing.length ? 1 : 0;
                    missing.forEach((item, index) => {
                        const slot = index + offset;
                        const scheduled = slot === 0 ? new Date(earliest).toISOString()
                            : new Date(Math.max(earliest, Date.parse(now)) + slot * 86400000).toISOString();
                        store.cards[itemKey(item)] = { item, interval: 1, repetitions: 0, easeFactor: 2.5,
                            createdAt: now, lastReviewedAt: now, dueAt: scheduled, lastAttemptId: null };
                    });
                    changed = true;
                }
                if (Object.keys(store.cards).length > ITEM_CARD_CAP) return false;
                if (changed) {
                    const serialized = JSON.stringify(store);
                    await this.storage.setItem(STORAGE_KEYS.ITEM_REVIEW, serialized);
                    validatedStores.set(this.storage, { raw: serialized, store: cloneStore(store) });
                }
                return true;
            } catch { return false; }
        });
    }

    clear(): Promise<void> {
        return this.serialize(async () => {
            await this.storage.removeItem(STORAGE_KEYS.ITEM_REVIEW);
            await this.storage.removeItem(STORAGE_KEYS.ITEM_REVIEW_QUARANTINE);
            validatedStores.delete(this.storage);
        });
    }
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
