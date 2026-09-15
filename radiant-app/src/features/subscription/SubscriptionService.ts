import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '../../constants/storageKeys';
import { heartsRepository } from '../hearts/HeartsRepository';
import { PaywallPlan } from '../paywall/PaywallPlan';
import { UnavailableStoreKitAdapter } from './UnavailableStoreKitAdapter';
import {
    isStoreUnavailable,
    type PurchaseResult,
    type RestoreResult,
    type StoreKitPort,
    type SubscriptionCacheV1,
    type SubscriptionEntitlement,
    type SubscriptionOffers,
    type SubscriptionStatus,
} from './subscription.types';

export type SubscriptionStorage = Pick<typeof AsyncStorage, 'getItem' | 'setItem'>;
export type SubscriptionHearts = { setUnlimited(unlimitedUntil: string | null, nowMs: number): Promise<unknown> };

type Deps = {
    store?: StoreKitPort;
    storage?: SubscriptionStorage;
    hearts?: SubscriptionHearts;
    productIds?: readonly string[];
};

export const SUBSCRIPTION_PRODUCT_IDS: readonly string[] = [
    PaywallPlan.offers.monthly.id,
    PaywallPlan.offers.annual.id,
];

const EMPTY_CACHE: SubscriptionCacheV1 = {
    schemaVersion: 1,
    entitlement: null,
    pendingSince: null,
    checkedAt: null,
};

function isIso(value: unknown): value is string {
    return typeof value === 'string' && Number.isFinite(Date.parse(value));
}

function parseEntitlement(value: unknown): SubscriptionEntitlement | null {
    if (typeof value !== 'object' || value === null) return null;
    const record = value as Record<string, unknown>;
    if (typeof record.productId !== 'string') return null;
    if (record.period !== 'monthly' && record.period !== 'annual') return null;
    if (!isIso(record.expiresAt)) return null;
    if (record.revokedAt !== null && !isIso(record.revokedAt)) return null;
    return {
        productId: record.productId,
        period: record.period,
        expiresAt: record.expiresAt,
        willRenew: record.willRenew === true,
        revokedAt: record.revokedAt === null ? null : record.revokedAt,
    };
}

function parseCache(raw: string | null): SubscriptionCacheV1 {
    if (raw === null) return EMPTY_CACHE;
    try {
        const value: unknown = JSON.parse(raw);
        if (typeof value !== 'object' || value === null) return EMPTY_CACHE;
        const record = value as Record<string, unknown>;
        if (record.schemaVersion !== 1) return EMPTY_CACHE;
        return {
            schemaVersion: 1,
            entitlement: parseEntitlement(record.entitlement),
            pendingSince: isIso(record.pendingSince) ? record.pendingSince : null,
            checkedAt: isIso(record.checkedAt) ? record.checkedAt : null,
        };
    } catch {
        return EMPTY_CACHE;
    }
}

/**
 * Decide o estado a partir do direito em cache e do relógio injetado. Vencido,
 * expirado ou reembolsado → `expired` (a economia volta a CHEIA, nunca a VAZIA).
 */
export function resolveSubscriptionStatus(cache: SubscriptionCacheV1, nowMs: number): SubscriptionStatus {
    const { entitlement } = cache;
    if (entitlement === null) {
        return cache.pendingSince === null ? { kind: 'none' } : { kind: 'pending', since: cache.pendingSince };
    }
    if (entitlement.revokedAt !== null) return { kind: 'expired', expiredAt: entitlement.revokedAt };
    if (nowMs >= Date.parse(entitlement.expiresAt)) return { kind: 'expired', expiredAt: entitlement.expiresAt };
    return { kind: 'unlimited', expiresAt: entitlement.expiresAt, willRenew: entitlement.willRenew };
}

export class SubscriptionService {
    private readonly store: StoreKitPort;
    private readonly storage: SubscriptionStorage;
    private readonly hearts: SubscriptionHearts;
    private readonly productIds: readonly string[];

    constructor(deps: Deps = {}) {
        this.store = deps.store ?? new UnavailableStoreKitAdapter();
        this.storage = deps.storage ?? AsyncStorage;
        this.hearts = deps.hearts ?? heartsRepository;
        this.productIds = deps.productIds ?? SUBSCRIPTION_PRODUCT_IDS;
    }

    /** Só o cache: nunca toca a loja. É o que toda tela de estudo pode ler. */
    async getStatus(nowMs: number): Promise<SubscriptionStatus> {
        return resolveSubscriptionStatus(await this.readCache(), nowMs);
    }

    /**
     * Relê o direito local da loja e aplica às vidas. Com a loja indisponível,
     * o cache vale até a data; passada a data sem releitura, o estado é CHEIA.
     */
    async refresh(nowMs: number): Promise<SubscriptionStatus> {
        let cache = await this.readCache();
        try {
            const entitlement = await this.store.currentEntitlement();
            cache = {
                ...cache,
                entitlement,
                pendingSince: entitlement === null ? cache.pendingSince : null,
                checkedAt: new Date(nowMs).toISOString(),
            };
            await this.writeCache(cache);
        } catch (cause) {
            if (!isStoreUnavailable(cause)) {
                console.error('[SubscriptionService] Falha ao reler o direito de uso:', cause);
            }
        }
        return this.applyToHearts(cache, nowMs);
    }

    async loadOffers(): Promise<SubscriptionOffers> {
        try {
            return { status: 'available', products: await this.store.loadProducts(this.productIds) };
        } catch (cause) {
            if (!isStoreUnavailable(cause)) {
                console.error('[SubscriptionService] Falha ao carregar as ofertas:', cause);
            }
            return { status: 'store-unavailable' };
        }
    }

    async purchase(productId: string, nowMs: number): Promise<PurchaseResult> {
        let outcome;
        try {
            outcome = await this.store.purchase(productId);
        } catch (cause) {
            if (isStoreUnavailable(cause)) return { kind: 'store-unavailable' };
            console.error('[SubscriptionService] Falha na compra:', cause);
            return { kind: 'failed', message: cause instanceof Error ? cause.message : 'unknown_error' };
        }

        switch (outcome.kind) {
            case 'purchased': {
                const cache = await this.storeEntitlement(outcome.entitlement, nowMs);
                return { kind: 'purchased', status: await this.applyToHearts(cache, nowMs) };
            }
            case 'pending': {
                const cache = await this.readCache();
                await this.writeCache({ ...cache, pendingSince: new Date(nowMs).toISOString() });
                return { kind: 'pending' };
            }
            case 'cancelled':
                return { kind: 'cancelled' };
            case 'failed':
                return { kind: 'failed', message: outcome.message };
        }
    }

    async restore(nowMs: number): Promise<RestoreResult> {
        let entitlement: SubscriptionEntitlement | null;
        try {
            entitlement = await this.store.restore();
        } catch (cause) {
            if (isStoreUnavailable(cause)) return { kind: 'store-unavailable' };
            console.error('[SubscriptionService] Falha ao restaurar compras:', cause);
            return { kind: 'nothing-to-restore' };
        }
        if (entitlement === null) return { kind: 'nothing-to-restore' };

        const cache = await this.storeEntitlement(entitlement, nowMs);
        return { kind: 'restored', status: await this.applyToHearts(cache, nowMs) };
    }

    private async storeEntitlement(entitlement: SubscriptionEntitlement, nowMs: number): Promise<SubscriptionCacheV1> {
        const cache: SubscriptionCacheV1 = {
            schemaVersion: 1,
            entitlement,
            pendingSince: null,
            checkedAt: new Date(nowMs).toISOString(),
        };
        await this.writeCache(cache);
        return cache;
    }

    private async applyToHearts(cache: SubscriptionCacheV1, nowMs: number): Promise<SubscriptionStatus> {
        const status = resolveSubscriptionStatus(cache, nowMs);
        await this.hearts.setUnlimited(status.kind === 'unlimited' ? status.expiresAt : null, nowMs);
        return status;
    }

    private async readCache(): Promise<SubscriptionCacheV1> {
        return parseCache(await this.storage.getItem(STORAGE_KEYS.SUBSCRIPTION));
    }

    private async writeCache(cache: SubscriptionCacheV1): Promise<void> {
        await this.storage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(cache));
    }
}

export const subscriptionService = new SubscriptionService();
