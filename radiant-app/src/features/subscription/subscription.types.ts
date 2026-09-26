/**
 * Contratos da assinatura "Radiant Ilimitado" (spec 1.4 §6).
 *
 * A porta `StoreKitPort` é a única fronteira com a Apple. No iOS o adaptador é
 * o `StoreKit2Adapter`, sobre o módulo Expo local `radiant-storekit` (ADR
 * 2026-09-23); fora dele, o `UnavailableStoreKitAdapter`. Preço e período nunca
 * nascem aqui — vêm da porta ou não existem.
 */
export type SubscriptionPeriod = 'monthly' | 'annual';

export type StoreProduct = {
    id: string;
    period: SubscriptionPeriod;
    title: string;
    /** Preço localizado exatamente como a Apple o entregou, ex.: "R$ 19,90". */
    displayPrice: string;
};

export type SubscriptionEntitlement = {
    productId: string;
    period: SubscriptionPeriod;
    /** Fim do período pago corrente, ISO 8601. */
    expiresAt: string;
    /**
     * `null` quando a Apple não informou a renovação. É um estado próprio,
     * e não "não renova" (ADR de 2026-09-25, 2A): o aluno lê que o acesso
     * está ativo, e não que cancelou.
     */
    willRenew: boolean | null;
    /** Reembolso ou revogação pela Apple; quando presente, o direito não vale. */
    revokedAt: string | null;
};

export type PurchaseOutcome =
    | { kind: 'purchased'; entitlement: SubscriptionEntitlement }
    /** Ask to Buy: o pedido aguarda aprovação de um responsável. */
    | { kind: 'pending' }
    | { kind: 'cancelled' }
    | { kind: 'failed'; message: string };

export interface StoreKitPort {
    loadProducts(ids: readonly string[]): Promise<StoreProduct[]>;
    /** Leitura local (`Transaction.currentEntitlements`), sem rede. */
    currentEntitlement(): Promise<SubscriptionEntitlement | null>;
    purchase(productId: string): Promise<PurchaseOutcome>;
    restore(): Promise<SubscriptionEntitlement | null>;
    /**
     * Aviso de que a loja entregou transação fora de `purchase` — renovação,
     * reembolso, Ask to Buy aprovado, compra em outro aparelho. Opcional: a loja
     * indisponível não tem o que avisar. Devolve a função que para de escutar.
     */
    onEntitlementsChanged?(listener: () => void): () => void;
}

export class StoreUnavailableError extends Error {
    readonly code = 'store-unavailable' as const;

    constructor(message = 'A loja não está disponível neste build.') {
        super(message);
        this.name = 'StoreUnavailableError';
    }
}

export function isStoreUnavailable(error: unknown): error is StoreUnavailableError {
    return typeof error === 'object' && error !== null && (error as { code?: unknown }).code === 'store-unavailable';
}

export type SubscriptionStatus =
    | { kind: 'none' }
    | { kind: 'pending'; since: string }
    | { kind: 'unlimited'; expiresAt: string; willRenew: boolean | null }
    | { kind: 'expired'; expiredAt: string };

export type SubscriptionOffers =
    | { status: 'available'; products: StoreProduct[] }
    | { status: 'store-unavailable' };

export type PurchaseResult =
    | { kind: 'purchased'; status: SubscriptionStatus }
    | { kind: 'pending' }
    | { kind: 'cancelled' }
    | { kind: 'failed'; message: string }
    | { kind: 'store-unavailable' };

export type RestoreResult =
    | { kind: 'restored'; status: SubscriptionStatus }
    | { kind: 'nothing-to-restore' }
    | { kind: 'store-unavailable' };

/** Cache persistido do direito, para que o estudo offline nunca dependa da loja. */
export type SubscriptionCacheV1 = {
    schemaVersion: 1;
    entitlement: SubscriptionEntitlement | null;
    pendingSince: string | null;
    checkedAt: string | null;
};
