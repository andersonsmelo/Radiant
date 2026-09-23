import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '../../constants/storageKeys';
import { heartsRepository } from '../hearts/HeartsRepository';
import { resolveStoreKitAdapter } from './StoreKit2Adapter';
import { SUBSCRIPTION_PRODUCT_IDS } from './subscriptionProducts';
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

/**
 * Os IDs vêm da ADR de produtos, por `subscriptionProducts.ts`. Até 2026-09-23
 * vinham do `PaywallPlan` (`monthly_plus`/`annual_plus`), que nunca existiram
 * na App Store: enquanto a loja era sempre indisponível, ninguém pedia.
 */
export { SUBSCRIPTION_PRODUCT_IDS };

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
 * Quanto vale um pedido do Ask to Buy. A Apple o descarta se o responsável não
 * aprovar em 24 h (support.apple.com/105055) e NÃO avisa o app de recusa nem
 * de expiração (Frameworks Engineer, developer.apple.com/forums/thread/685183).
 * Passado o prazo, o pedido não pode mais virar assinatura, então deixa de ser
 * anunciado. Decisão do dono em 2026-09-23.
 */
export const ASK_TO_BUY_WINDOW_MS = 24 * 60 * 60 * 1000;

/**
 * Decide o estado a partir do direito em cache e do relógio injetado. Vencido,
 * expirado ou reembolsado → `expired` (a economia volta a CHEIA, nunca a VAZIA).
 */
export function resolveSubscriptionStatus(cache: SubscriptionCacheV1, nowMs: number): SubscriptionStatus {
    const { entitlement } = cache;
    if (entitlement === null) {
        if (cache.pendingSince === null) return { kind: 'none' };
        if (nowMs >= Date.parse(cache.pendingSince) + ASK_TO_BUY_WINDOW_MS) return { kind: 'none' };
        return { kind: 'pending', since: cache.pendingSince };
    }
    if (entitlement.revokedAt !== null) return { kind: 'expired', expiredAt: entitlement.revokedAt };
    if (nowMs >= Date.parse(entitlement.expiresAt)) return { kind: 'expired', expiredAt: entitlement.expiresAt };
    return { kind: 'unlimited', expiresAt: entitlement.expiresAt, willRenew: entitlement.willRenew };
}

export class SubscriptionService {
    private storePort: StoreKitPort | undefined;
    private readonly storage: SubscriptionStorage;
    private readonly hearts: SubscriptionHearts;
    private readonly productIds: readonly string[];

    constructor(deps: Deps = {}) {
        this.storePort = deps.store;
        this.storage = deps.storage ?? AsyncStorage;
        this.hearts = deps.hearts ?? heartsRepository;
        this.productIds = deps.productIds ?? SUBSCRIPTION_PRODUCT_IDS;
    }

    /**
     * Resolução preguiçosa, como no backup: este serviço é importado na
     * abertura, e consultar o runtime de módulos nativos no `import` faria toda
     * suíte que apenas toca neste arquivo pagar por uma loja que não usa.
     */
    private get store(): StoreKitPort {
        this.storePort ??= resolveStoreKitAdapter();
        return this.storePort;
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
        const antes = resolveSubscriptionStatus(cache, nowMs);
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
        // `currentEntitlements` omite transação reembolsada ou revogada: o
        // direito não volta com `revokedAt`, ele some. Sem este passo as vidas
        // guardavam o `unlimitedUntil` antigo até o fim do período pago. Só na
        // TRANSIÇÃO de ativo para ausente — repetir a cada abertura daria vidas
        // cheias de presente a quem não tem direito nenhum.
        if (antes.kind === 'unlimited' && cache.entitlement === null) {
            await this.hearts.setUnlimited(null, nowMs);
        }
        return this.applyToHearts(cache, nowMs);
    }

    /**
     * Relê o direito sempre que a loja avisa de transação nova (renovação,
     * reembolso, Ask to Buy aprovado). A escuta nativa de `Transaction.updates`
     * começa na criação do módulo; isto só liga o aviso à releitura.
     */
    watchStoreUpdates(nowMs: () => number): () => void {
        const escutar = this.store.onEntitlementsChanged;
        if (escutar === undefined) return () => undefined;
        return escutar.call(this.store, () => {
            this.refresh(nowMs()).catch((cause) => {
                console.error('[SubscriptionService] Falha ao reler o direito após atualização da loja:', cause);
            });
        });
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

    /**
     * Só quem tem (ou teve) direito toca as vidas. `setUnlimited(null)` devolve
     * o estado CHEIO — é o destino correto de uma assinatura expirada ou
     * reembolsada, e seria um presente indevido a cada abertura para quem
     * nunca assinou.
     */
    private async applyToHearts(cache: SubscriptionCacheV1, nowMs: number): Promise<SubscriptionStatus> {
        const status = resolveSubscriptionStatus(cache, nowMs);
        if (status.kind === 'unlimited') {
            await this.hearts.setUnlimited(status.expiresAt, nowMs);
        } else if (status.kind === 'expired') {
            await this.hearts.setUnlimited(null, nowMs);
        }
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
