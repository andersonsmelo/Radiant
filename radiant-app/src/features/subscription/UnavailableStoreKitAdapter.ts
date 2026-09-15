import { StoreUnavailableError, type StoreKitPort } from './subscription.types';

/**
 * Adaptador padrão enquanto não existe build interno com StoreKit 2.
 *
 * Responde `store-unavailable` em toda operação. Não finge produto, preço nem
 * transação: a tela mostra "loja indisponível" e o estudo continua livre.
 */
export class UnavailableStoreKitAdapter implements StoreKitPort {
    async loadProducts(): Promise<never> {
        throw new StoreUnavailableError();
    }

    async currentEntitlement(): Promise<never> {
        throw new StoreUnavailableError();
    }

    async purchase(): Promise<never> {
        throw new StoreUnavailableError();
    }

    async restore(): Promise<never> {
        throw new StoreUnavailableError();
    }
}
