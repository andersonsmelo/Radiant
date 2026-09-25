import { requireOptionalNativeModule } from 'expo-modules-core';

import {
    nativeErrorCode,
    type RadiantStoreKitNative,
    type StoreKitNativeTransaction,
} from './storekitNative.types';
import {
    StoreUnavailableError,
    type PurchaseOutcome,
    type StoreKitPort,
    type StoreProduct,
    type SubscriptionEntitlement,
} from './subscription.types';
import { periodOfProduct } from './subscriptionProducts';
import { UnavailableStoreKitAdapter } from './UnavailableStoreKitAdapter';

function ehData(value: string | null): value is string {
    return value !== null && Number.isFinite(Date.parse(value));
}

/**
 * Traduz uma transação nativa para o direito da porta — ou para nada.
 *
 * É aqui, e não no Swift, que mora a regra "só transação verificada de produto
 * da ADR, com expiração, dá direito" (ADR 2026-09-23, regra 3). A data de
 * expiração passa como veio: se já venceu, quem decide é o
 * `SubscriptionService`, com o relógio injetado.
 */
function paraDireito(transacao: StoreKitNativeTransaction): SubscriptionEntitlement | null {
    if (!transacao.verified) return null;
    const period = periodOfProduct(transacao.productId);
    if (period === null) return null;
    if (!ehData(transacao.expirationDate)) return null;
    return {
        productId: transacao.productId,
        period,
        expiresAt: transacao.expirationDate,
        // Desconhecida fica desconhecida (ADR de 2026-09-25, 2A). A porta
        // continua sem prometer renovação, porque `null` não é `true`, mas
        // também não afirma que o aluno cancelou. O Swift omite a chave quando
        // não sabe, então `undefined` também vira `null`.
        willRenew: typeof transacao.willAutoRenew === 'boolean' ? transacao.willAutoRenew : null,
        revokedAt: ehData(transacao.revocationDate) ? transacao.revocationDate : null,
    };
}

/** Entre vários direitos válidos, vale o que dura mais. */
function melhorDireito(transacoes: StoreKitNativeTransaction[]): SubscriptionEntitlement | null {
    let melhor: SubscriptionEntitlement | null = null;
    for (const transacao of transacoes) {
        const direito = paraDireito(transacao);
        if (direito === null) continue;
        if (melhor === null || Date.parse(direito.expiresAt) > Date.parse(melhor.expiresAt)) melhor = direito;
    }
    return melhor;
}

/**
 * Adaptador StoreKit 2 real da `StoreKitPort`, sobre o módulo Expo local
 * `radiant-storekit` (ADR 2026-09-23). Só iOS; fora dele,
 * `resolveStoreKitAdapter` entrega o `UnavailableStoreKitAdapter`.
 *
 * Nada aqui escreve em log: nem identificador de transação — que a fronteira
 * nem entrega —, nem produto, nem data. O `SubscriptionCacheV1` continua sendo
 * o único estado persistido.
 */
export class StoreKit2Adapter implements StoreKitPort {
    constructor(private readonly native: RadiantStoreKitNative) {}

    async loadProducts(ids: readonly string[]): Promise<StoreProduct[]> {
        const nativos = await this.native.loadProducts([...ids]);
        const produtos: StoreProduct[] = [];
        for (const nativo of nativos) {
            const period = periodOfProduct(nativo.id);
            if (period === null) continue;
            produtos.push({ id: nativo.id, period, title: nativo.displayName, displayPrice: nativo.displayPrice });
        }
        // Acordo de apps pagos inativo ou ID errado deixam a lista vazia sem
        // erro. Uma tela de planos sem planos não ajuda ninguém; "a loja não
        // respondeu" é a verdade que a tela já sabe dizer.
        if (produtos.length === 0) throw new StoreUnavailableError('Nenhum produto da assinatura foi encontrado.');
        return produtos;
    }

    async currentEntitlement(): Promise<SubscriptionEntitlement | null> {
        return melhorDireito(await this.native.currentEntitlements());
    }

    async purchase(productId: string): Promise<PurchaseOutcome> {
        if (periodOfProduct(productId) === null) return { kind: 'failed', message: 'unknown-product' };

        let resultado;
        try {
            resultado = await this.native.purchase(productId);
        } catch (cause) {
            return { kind: 'failed', message: nativeErrorCode(cause) ?? 'unrecoverable' };
        }

        switch (resultado.kind) {
            case 'pending':
                return { kind: 'pending' };
            case 'userCancelled':
                return { kind: 'cancelled' };
            case 'success': {
                const direito = paraDireito(resultado.transaction);
                return direito === null
                    ? { kind: 'failed', message: 'unverified-transaction' }
                    : { kind: 'purchased', entitlement: direito };
            }
        }
    }

    async restore(): Promise<SubscriptionEntitlement | null> {
        try {
            await this.native.sync();
        } catch {
            // Sincronizar pede a senha da Apple e precisa de rede; se a pessoa
            // desiste ou a rede falta, o que já está no aparelho continua valendo.
        }
        return this.currentEntitlement();
    }

    onEntitlementsChanged(listener: () => void): () => void {
        const assinatura = this.native.addListener('onTransactionsUpdated', listener);
        return () => assinatura.remove();
    }
}

/** Nome do módulo Expo local; só existe num build iOS que o compilou. */
export const RADIANT_STOREKIT_MODULE = 'RadiantStoreKit';

/**
 * Escolhe o adaptador conforme o binário. Sem o módulo nativo — Android, Jest,
 * Expo Go, build anterior à 1.4 — a loja fica indisponível e o estudo segue
 * livre. Resolver adaptador é trabalho de abertura: nenhuma falha aqui pode
 * virar erro fatal.
 */
export function resolveStoreKitAdapter(): StoreKitPort {
    try {
        const native = requireOptionalNativeModule<RadiantStoreKitNative>(RADIANT_STOREKIT_MODULE);
        return native ? new StoreKit2Adapter(native) : new UnavailableStoreKitAdapter();
    } catch (cause) {
        console.error('[StoreKit2Adapter] Falha ao resolver o módulo nativo:', cause);
        return new UnavailableStoreKitAdapter();
    }
}
