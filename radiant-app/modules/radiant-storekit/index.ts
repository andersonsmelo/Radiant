/**
 * Ponto de entrada do módulo Expo local `radiant-storekit`.
 *
 * O `StoreKit2Adapter` **não** importa este arquivo: resolve o módulo pelo
 * nome, com `requireOptionalNativeModule`, para que a ausência do binário
 * nativo (Android, Jest, Expo Go) seja caminho normal em vez de erro de
 * importação. Este arquivo existe para a convenção do módulo e para quem
 * quiser consumi-lo tipado.
 *
 * Os tipos são declarados aqui, e não importados de `src/`, de propósito: um
 * módulo nativo que depende do código da aplicação inverte a direção da
 * dependência. O contrato espelhado vive em
 * `src/features/subscription/storekitNative.types.ts`.
 */
import { requireOptionalNativeModule } from 'expo-modules-core';

export type RadiantStoreKitProduct = {
    id: string;
    displayName: string;
    displayPrice: string;
};

/** Sem identificador de transação: o que não atravessa não vai parar em log. */
export type RadiantStoreKitTransaction = {
    productId: string;
    expirationDate: string | null;
    revocationDate: string | null;
    verified: boolean;
    willAutoRenew: boolean | null;
};

export type RadiantStoreKitPurchase =
    | { kind: 'success'; transaction: RadiantStoreKitTransaction }
    | { kind: 'pending' }
    | { kind: 'userCancelled' };

export interface RadiantStoreKitModule {
    loadProducts(ids: string[]): Promise<RadiantStoreKitProduct[]>;
    currentEntitlements(): Promise<RadiantStoreKitTransaction[]>;
    purchase(productId: string): Promise<RadiantStoreKitPurchase>;
    sync(): Promise<void>;
    addListener(eventName: 'onTransactionsUpdated', listener: () => void): { remove(): void };
}

/** `null` fora de um build iOS que compilou este módulo. */
export const RadiantStoreKit = requireOptionalNativeModule<RadiantStoreKitModule>('RadiantStoreKit');

export default RadiantStoreKit;
