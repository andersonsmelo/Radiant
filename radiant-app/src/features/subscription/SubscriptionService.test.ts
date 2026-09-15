import { SubscriptionService } from './SubscriptionService';
import {
    StoreUnavailableError,
    type PurchaseOutcome,
    type StoreKitPort,
    type StoreProduct,
    type SubscriptionEntitlement,
} from './subscription.types';

jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

const AGORA = Date.parse('2026-09-14T12:00:00.000Z');
const DAQUI_A_30_DIAS = '2026-10-14T12:00:00.000Z';
const ONTEM = '2026-09-13T12:00:00.000Z';

const produtos: StoreProduct[] = [
    { id: 'monthly_plus', period: 'monthly', title: 'Radiant Ilimitado mensal', displayPrice: 'R$ 19,90' },
    { id: 'annual_plus', period: 'annual', title: 'Radiant Ilimitado anual', displayPrice: 'R$ 149,90' },
];

function direito(overrides: Partial<SubscriptionEntitlement> = {}): SubscriptionEntitlement {
    return {
        productId: 'monthly_plus',
        period: 'monthly',
        expiresAt: DAQUI_A_30_DIAS,
        willRenew: true,
        revokedAt: null,
        ...overrides,
    };
}

function memoria() {
    const dados = new Map<string, string>();
    return {
        getItem: jest.fn(async (key: string) => dados.get(key) ?? null),
        setItem: jest.fn(async (key: string, value: string) => { dados.set(key, value); }),
        removeItem: jest.fn(async (key: string) => { dados.delete(key); }),
    };
}

function loja(overrides: Partial<StoreKitPort> = {}): StoreKitPort {
    return {
        loadProducts: jest.fn(async () => produtos),
        currentEntitlement: jest.fn(async () => null),
        purchase: jest.fn(async (): Promise<PurchaseOutcome> => ({ kind: 'cancelled' })),
        restore: jest.fn(async () => null),
        ...overrides,
    };
}

function lojaIndisponivel(): StoreKitPort {
    const falha = async () => { throw new StoreUnavailableError(); };
    return { loadProducts: falha, currentEntitlement: falha, purchase: falha, restore: falha };
}

function vidas() {
    return { setUnlimited: jest.fn(async () => undefined) };
}

function servico(store: StoreKitPort, storage = memoria(), hearts = vidas()) {
    return { service: new SubscriptionService({ store, storage, hearts }), storage, hearts };
}

describe('SubscriptionService — direito de uso offline', () => {
    it('cache válido com a loja indisponível mantém vidas ilimitadas até a data', async () => {
        const storage = memoria();
        const primeira = servico(loja({ currentEntitlement: jest.fn(async () => direito()) }), storage);
        await primeira.service.refresh(AGORA);

        const offline = servico(lojaIndisponivel(), storage);
        const status = await offline.service.refresh(AGORA + 5 * 24 * 60 * 60 * 1000);

        expect(status).toEqual({ kind: 'unlimited', expiresAt: DAQUI_A_30_DIAS, willRenew: true });
        expect(offline.hearts.setUnlimited).toHaveBeenCalledWith(DAQUI_A_30_DIAS, AGORA + 5 * 24 * 60 * 60 * 1000);
    });

    it('cache vencido sem releitura volta ao estado cheio, nunca ilimitado', async () => {
        const storage = memoria();
        const primeira = servico(loja({ currentEntitlement: jest.fn(async () => direito()) }), storage);
        await primeira.service.refresh(AGORA);

        const depois = Date.parse(DAQUI_A_30_DIAS) + 1;
        const offline = servico(lojaIndisponivel(), storage);
        const status = await offline.service.refresh(depois);

        expect(status).toEqual({ kind: 'expired', expiredAt: DAQUI_A_30_DIAS });
        expect(offline.hearts.setUnlimited).toHaveBeenCalledWith(null, depois);
    });

    it('direito expirado lido da loja deixa o estado cheio', async () => {
        const { service, hearts } = servico(loja({
            currentEntitlement: jest.fn(async () => direito({ expiresAt: ONTEM, willRenew: false })),
        }));

        expect(await service.refresh(AGORA)).toEqual({ kind: 'expired', expiredAt: ONTEM });
        expect(hearts.setUnlimited).toHaveBeenCalledWith(null, AGORA);
    });

    it('direito reembolsado deixa o estado cheio mesmo antes da data de expiração', async () => {
        const { service, hearts } = servico(loja({
            currentEntitlement: jest.fn(async () => direito({ revokedAt: ONTEM })),
        }));

        expect(await service.refresh(AGORA)).toEqual({ kind: 'expired', expiredAt: ONTEM });
        expect(hearts.setUnlimited).toHaveBeenCalledWith(null, AGORA);
    });

    it('sem direito e sem cache não há assinatura e as vidas NÃO são tocadas', async () => {
        // `HeartsService.setUnlimited(null)` devolve o estado CHEIO. Chamar isso
        // para quem nunca assinou encheria as vidas de todo aluno grátis a cada
        // abertura — a economia inteira viraria decorativa.
        const { service, hearts } = servico(loja());

        expect(await service.refresh(AGORA)).toEqual({ kind: 'none' });
        expect(hearts.setUnlimited).not.toHaveBeenCalled();
    });

    it('pedido pendente também não toca as vidas na releitura', async () => {
        const store = loja({ purchase: jest.fn(async (): Promise<PurchaseOutcome> => ({ kind: 'pending' })) });
        const { service, hearts } = servico(store);
        await service.purchase('monthly_plus', AGORA);

        expect(await service.refresh(AGORA)).toEqual({ kind: 'pending', since: new Date(AGORA).toISOString() });
        expect(hearts.setUnlimited).not.toHaveBeenCalled();
    });

    it('getStatus lê só o cache e não toca a loja', async () => {
        const store = loja({ currentEntitlement: jest.fn(async () => direito()) });
        const { service } = servico(store);
        await service.refresh(AGORA);
        (store.currentEntitlement as jest.Mock).mockClear();

        expect(await service.getStatus(AGORA)).toEqual({ kind: 'unlimited', expiresAt: DAQUI_A_30_DIAS, willRenew: true });
        expect(store.currentEntitlement).not.toHaveBeenCalled();
    });
});

describe('SubscriptionService — ofertas', () => {
    it('devolve preços e períodos exatamente como a porta os entregou', async () => {
        const { service } = servico(loja());

        expect(await service.loadOffers()).toEqual({ status: 'available', products: produtos });
    });

    it('informa loja indisponível sem lançar erro', async () => {
        const { service } = servico(lojaIndisponivel());

        expect(await service.loadOffers()).toEqual({ status: 'store-unavailable' });
    });

    it('o adaptador padrão responde store-unavailable e nunca finge integração', async () => {
        const service = new SubscriptionService({ storage: memoria(), hearts: vidas() });

        expect(await service.loadOffers()).toEqual({ status: 'store-unavailable' });
        expect(await service.refresh(AGORA)).toEqual({ kind: 'none' });
    });
});

describe('SubscriptionService — compra e restauração', () => {
    it('compra confirmada grava o direito e libera vidas ilimitadas', async () => {
        const { service, hearts } = servico(loja({
            purchase: jest.fn(async (): Promise<PurchaseOutcome> => ({ kind: 'purchased', entitlement: direito() })),
        }));

        const resultado = await service.purchase('monthly_plus', AGORA);

        expect(resultado).toEqual({
            kind: 'purchased',
            status: { kind: 'unlimited', expiresAt: DAQUI_A_30_DIAS, willRenew: true },
        });
        expect(hearts.setUnlimited).toHaveBeenCalledWith(DAQUI_A_30_DIAS, AGORA);
        expect(await service.getStatus(AGORA)).toEqual({ kind: 'unlimited', expiresAt: DAQUI_A_30_DIAS, willRenew: true });
    });

    it('Ask to Buy deixa a assinatura pendente sem liberar vidas', async () => {
        const { service, hearts } = servico(loja({
            purchase: jest.fn(async (): Promise<PurchaseOutcome> => ({ kind: 'pending' })),
        }));

        expect(await service.purchase('annual_plus', AGORA)).toEqual({ kind: 'pending' });
        expect(hearts.setUnlimited).not.toHaveBeenCalled();
        expect(await service.getStatus(AGORA)).toEqual({ kind: 'pending', since: new Date(AGORA).toISOString() });
    });

    it('compra cancelada pelo aluno não muda nada', async () => {
        const { service, hearts } = servico(loja());

        expect(await service.purchase('monthly_plus', AGORA)).toEqual({ kind: 'cancelled' });
        expect(hearts.setUnlimited).not.toHaveBeenCalled();
        expect(await service.getStatus(AGORA)).toEqual({ kind: 'none' });
    });

    it('compra com a loja indisponível informa em vez de lançar', async () => {
        const { service } = servico(lojaIndisponivel());

        expect(await service.purchase('monthly_plus', AGORA)).toEqual({ kind: 'store-unavailable' });
    });

    it('restauração recupera o direito e libera vidas ilimitadas', async () => {
        const { service, hearts } = servico(loja({ restore: jest.fn(async () => direito({ productId: 'annual_plus', period: 'annual' })) }));

        expect(await service.restore(AGORA)).toEqual({
            kind: 'restored',
            status: { kind: 'unlimited', expiresAt: DAQUI_A_30_DIAS, willRenew: true },
        });
        expect(hearts.setUnlimited).toHaveBeenCalledWith(DAQUI_A_30_DIAS, AGORA);
    });

    it('restauração sem compra anterior diz que não há o que restaurar', async () => {
        const { service } = servico(loja());

        expect(await service.restore(AGORA)).toEqual({ kind: 'nothing-to-restore' });
    });

    it('compra confirmada depois de um pedido pendente limpa a pendência', async () => {
        const store = loja({ purchase: jest.fn(async (): Promise<PurchaseOutcome> => ({ kind: 'pending' })) });
        const { service } = servico(store);
        await service.purchase('monthly_plus', AGORA);
        (store.currentEntitlement as jest.Mock).mockResolvedValue(direito());

        expect(await service.refresh(AGORA)).toEqual({ kind: 'unlimited', expiresAt: DAQUI_A_30_DIAS, willRenew: true });
    });
});
