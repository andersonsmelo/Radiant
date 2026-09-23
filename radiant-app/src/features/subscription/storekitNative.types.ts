/**
 * Fronteira com o módulo Expo local `radiant-storekit` (ADR 2026-09-23).
 *
 * O Swift **copia, não julga**: devolve o que o StoreKit 2 entregou, inclusive
 * transação não verificada, marcada como tal. Toda regra — só verificada dá
 * direito, só produto da ADR conta, qual transação vence — mora no
 * `StoreKit2Adapter`, onde é testável. É a lição do CloudKit (PR #14): o
 * julgamento no nativo escondeu dois defeitos que o TypeScript teria pego.
 *
 * Nenhum campo identifica a transação ou a pessoa: sem `id`, `originalID` nem
 * `appAccountToken`. O que não atravessa a fronteira não tem como ir parar num
 * log.
 */

export type StoreKitNativeProduct = {
    id: string;
    displayName: string;
    /** Preço localizado exatamente como a Apple o entregou. */
    displayPrice: string;
};

export type StoreKitNativeTransaction = {
    productId: string;
    /** ISO 8601; `null` para produto que não expira. */
    expirationDate: string | null;
    /** ISO 8601; presente quando a Apple reembolsou ou revogou. */
    revocationDate: string | null;
    /** Resultado de `VerificationResult`: `false` = `.unverified`. */
    verified: boolean;
    /**
     * `RenewalInfo.willAutoRenew`, só de renovação verificada. `null` quando o
     * status não pôde ser lido — não medido se isso acontece sem rede.
     */
    willAutoRenew: boolean | null;
};

export type StoreKitNativePurchase =
    | { kind: 'success'; transaction: StoreKitNativeTransaction }
    | { kind: 'pending' }
    | { kind: 'userCancelled' };

export type StoreKitNativeErrorCode =
    | 'product-not-found'
    | 'payments-not-allowed'
    | 'network-unavailable'
    | 'user-cancelled'
    | 'unrecoverable';

export type StoreKitNativeSubscription = { remove(): void };

export interface RadiantStoreKitNative {
    loadProducts(ids: string[]): Promise<StoreKitNativeProduct[]>;
    currentEntitlements(): Promise<StoreKitNativeTransaction[]>;
    purchase(productId: string): Promise<StoreKitNativePurchase>;
    sync(): Promise<void>;
    /** Evento sem corpo: avisa que `Transaction.updates` entregou algo. */
    addListener(eventName: 'onTransactionsUpdated', listener: () => void): StoreKitNativeSubscription;
}

export function nativeErrorCode(cause: unknown): string | null {
    if (typeof cause !== 'object' || cause === null) return null;
    const code = (cause as { code?: unknown }).code;
    return typeof code === 'string' ? code : null;
}
