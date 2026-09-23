import type { SubscriptionPeriod } from './subscription.types';

/**
 * Os dois produtos do grupo "Radiant Ilimitado", exatamente como a
 * [ADR de produtos](../../../../docs/adr/ADR-2026-09-15-radiant-ilimitado-storekit-products.md)
 * os fixou. Fonte única no app: sem alias, sem variante por ambiente.
 *
 * O período vem desta tabela, e não do StoreKit: o adaptador não precisa
 * interpretar a unidade de período que a Apple devolve para saber se o plano é
 * mensal ou anual, e um produto que não esteja aqui não dá direito.
 */
export const SUBSCRIPTION_PRODUCTS = {
    'com.andersonmelo.radiant.ilimitado.mensal': 'monthly',
    'com.andersonmelo.radiant.ilimitado.anual': 'annual',
} as const satisfies Record<string, SubscriptionPeriod>;

export type SubscriptionProductId = keyof typeof SUBSCRIPTION_PRODUCTS;

export const SUBSCRIPTION_PRODUCT_IDS: readonly SubscriptionProductId[] = Object.keys(
    SUBSCRIPTION_PRODUCTS,
) as SubscriptionProductId[];

export function periodOfProduct(productId: string): SubscriptionPeriod | null {
    return Object.prototype.hasOwnProperty.call(SUBSCRIPTION_PRODUCTS, productId)
        ? SUBSCRIPTION_PRODUCTS[productId as SubscriptionProductId]
        : null;
}
