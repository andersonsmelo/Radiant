import { StoreKit2Adapter } from './StoreKit2Adapter';
import type { RadiantStoreKitNative, StoreKitNativeTransaction } from './storekitNative.types';
import { SubscriptionService } from './SubscriptionService';
import {
    StoreUnavailableError,
    type PurchaseOutcome,
    type StoreKitPort,
    type StoreProduct,
    type SubscriptionEntitlement,
} from './subscription.types';

jest.mock('expo-modules-core', () => ({ requireOptionalNativeModule: jest.fn(() => null) }));

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

    // Prazo oficial: a Apple descarta o pedido do Ask to Buy sem aprovação em
    // 24 h (support.apple.com/105055) e NÃO avisa o app de recusa nem de
    // expiração (Frameworks Engineer, developer.apple.com/forums/thread/685183).
    // Sem este prazo o pendente durava para sempre.
    it('o pendente vale 24 h a partir do pedido e depois deixa de existir', async () => {
        const { service, hearts } = servico(loja({
            purchase: jest.fn(async (): Promise<PurchaseOutcome> => ({ kind: 'pending' })),
        }));
        const DIA = 24 * 60 * 60 * 1000;
        await service.purchase('monthly_plus', AGORA);

        expect(await service.getStatus(AGORA + DIA - 1)).toEqual({ kind: 'pending', since: new Date(AGORA).toISOString() });
        expect(await service.getStatus(AGORA + DIA)).toEqual({ kind: 'none' });
        expect(await service.refresh(AGORA + DIA)).toEqual({ kind: 'none' });
        expect(hearts.setUnlimited).not.toHaveBeenCalled();
    });

    it('pedido novo depois do vencido reabre as 24 h a partir do novo pedido', async () => {
        const { service } = servico(loja({
            purchase: jest.fn(async (): Promise<PurchaseOutcome> => ({ kind: 'pending' })),
        }));
        const DIA = 24 * 60 * 60 * 1000;
        await service.purchase('monthly_plus', AGORA);
        await service.purchase('monthly_plus', AGORA + 2 * DIA);

        expect(await service.getStatus(AGORA + 2 * DIA + 1)).toEqual({
            kind: 'pending',
            since: new Date(AGORA + 2 * DIA).toISOString(),
        });
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

// ---------------------------------------------------------------------------
// Task 8, fatia 2 (2026-09-23): o adaptador real troca `store-unavailable` por
// estados reais para todo usuário iOS. Estes testes cobrem o que essa troca
// promove ao caminho principal — ver o plano da fatia, §3.
// ---------------------------------------------------------------------------

describe('SubscriptionService — produtos da ADR', () => {
    it('sem ids injetados, pede à loja exatamente os dois produtos da ADR', async () => {
        const store = loja();
        const service = new SubscriptionService({ store, storage: memoria(), hearts: vidas() });

        await service.loadOffers();

        expect(store.loadProducts).toHaveBeenCalledWith([
            'com.andersonmelo.radiant.ilimitado.mensal',
            'com.andersonmelo.radiant.ilimitado.anual',
        ]);
    });
});

describe('SubscriptionService — direito que some antes da data (reembolso)', () => {
    // `Transaction.currentEntitlements` omite transação reembolsada ou revogada
    // (documentação da Apple). O direito não chega como `revokedAt`: ele
    // simplesmente desaparece, e as vidas guardavam o `unlimitedUntil` antigo.
    it('ativo no cache e ausente na loja encerra o ilimitado das vidas', async () => {
        const storage = memoria();
        await servico(loja({ currentEntitlement: jest.fn(async () => direito()) }), storage).service.refresh(AGORA);

        const depois = servico(loja({ currentEntitlement: jest.fn(async () => null) }), storage);
        const status = await depois.service.refresh(AGORA + 60_000);

        expect(status).toEqual({ kind: 'none' });
        expect(depois.hearts.setUnlimited).toHaveBeenCalledTimes(1);
        expect(depois.hearts.setUnlimited).toHaveBeenCalledWith(null, AGORA + 60_000);
    });

    it('encerra uma vez só: na abertura seguinte, quem nunca teve direito não ganha vidas cheias', async () => {
        const storage = memoria();
        await servico(loja({ currentEntitlement: jest.fn(async () => direito()) }), storage).service.refresh(AGORA);
        await servico(loja({ currentEntitlement: jest.fn(async () => null) }), storage).service.refresh(AGORA + 60_000);

        const terceira = servico(loja({ currentEntitlement: jest.fn(async () => null) }), storage);
        await terceira.service.refresh(AGORA + 120_000);

        expect(terceira.hearts.setUnlimited).not.toHaveBeenCalled();
    });

    it('quem nunca assinou não toca as vidas ao reler a loja', async () => {
        const { service, hearts } = servico(loja({ currentEntitlement: jest.fn(async () => null) }));

        await service.refresh(AGORA);

        expect(hearts.setUnlimited).not.toHaveBeenCalled();
    });
});

describe('SubscriptionService — atualizações da loja', () => {
    it('relê o direito quando a loja avisa de uma transação nova', async () => {
        let avisar: () => void = () => undefined;
        const store = loja({
            currentEntitlement: jest.fn(async () => direito()),
            onEntitlementsChanged: jest.fn((ouvinte: () => void) => {
                avisar = ouvinte;
                return () => undefined;
            }),
        });
        const { service, hearts } = servico(store);

        service.watchStoreUpdates(() => AGORA);
        avisar();
        await new Promise((resolve) => setImmediate(resolve));

        expect(store.currentEntitlement).toHaveBeenCalledTimes(1);
        expect(hearts.setUnlimited).toHaveBeenCalledWith(DAQUI_A_30_DIAS, AGORA);
    });

    it('loja sem aviso de atualização (indisponível) não quebra quem pede para escutar', () => {
        const { service } = servico(lojaIndisponivel());

        const parar = service.watchStoreUpdates(() => AGORA);

        expect(() => parar()).not.toThrow();
    });
});

// Adaptador real + serviço, com o módulo nativo simulado na fronteira: o que o
// direito É depois de atravessar as duas camadas, não só que elas diferem do
// adaptador indisponível.
describe('SubscriptionService com o StoreKit2Adapter — estados de ponta a ponta', () => {
    const MENSAL = 'com.andersonmelo.radiant.ilimitado.mensal';

    function nativo(transacoes: StoreKitNativeTransaction[]): RadiantStoreKitNative {
        return {
            loadProducts: jest.fn(async () => [
                { id: MENSAL, displayName: 'Radiant Ilimitado Mensal', displayPrice: 'R$ 19,90' },
            ]),
            currentEntitlements: jest.fn(async () => transacoes),
            purchase: jest.fn(async () => ({ kind: 'pending' as const })),
            sync: jest.fn(async () => undefined),
            addListener: jest.fn(() => ({ remove: () => undefined })),
        };
    }

    const transacao = (overrides: Partial<StoreKitNativeTransaction> = {}): StoreKitNativeTransaction => ({
        productId: MENSAL,
        expirationDate: DAQUI_A_30_DIAS,
        revocationDate: null,
        verified: true,
        willAutoRenew: true,
        ...overrides,
    });

    it('assinatura verificada da ADR, com data futura, deixa as vidas ilimitadas até a data', async () => {
        const { service, hearts } = servico(new StoreKit2Adapter(nativo([transacao()])));

        await expect(service.refresh(AGORA)).resolves.toEqual({
            kind: 'unlimited',
            expiresAt: DAQUI_A_30_DIAS,
            willRenew: true,
        });
        expect(hearts.setUnlimited).toHaveBeenCalledWith(DAQUI_A_30_DIAS, AGORA);
    });

    it('transação não verificada não deixa ninguém ilimitado', async () => {
        const { service, hearts } = servico(new StoreKit2Adapter(nativo([transacao({ verified: false })])));

        await expect(service.refresh(AGORA)).resolves.toEqual({ kind: 'none' });
        expect(hearts.setUnlimited).not.toHaveBeenCalled();
    });

    it('transação revogada é expirada e devolve as vidas CHEIAS', async () => {
        const { service, hearts } = servico(new StoreKit2Adapter(nativo([transacao({ revocationDate: ONTEM })])));

        await expect(service.refresh(AGORA)).resolves.toEqual({ kind: 'expired', expiredAt: ONTEM });
        expect(hearts.setUnlimited).toHaveBeenCalledWith(null, AGORA);
    });

    it('transação vencida é expirada e devolve as vidas CHEIAS', async () => {
        const { service, hearts } = servico(new StoreKit2Adapter(nativo([transacao({ expirationDate: ONTEM })])));

        await expect(service.refresh(AGORA)).resolves.toEqual({ kind: 'expired', expiredAt: ONTEM });
        expect(hearts.setUnlimited).toHaveBeenCalledWith(null, AGORA);
    });

    it('Ask to Buy fica pendente, sem tocar as vidas', async () => {
        const { service, hearts } = servico(new StoreKit2Adapter(nativo([])));

        await expect(service.purchase(MENSAL, AGORA)).resolves.toEqual({ kind: 'pending' });
        await expect(service.getStatus(AGORA)).resolves.toEqual({
            kind: 'pending',
            since: new Date(AGORA).toISOString(),
        });
        expect(hearts.setUnlimited).not.toHaveBeenCalled();
    });

    it('nada a restaurar', async () => {
        const { service } = servico(new StoreKit2Adapter(nativo([])));

        await expect(service.restore(AGORA)).resolves.toEqual({ kind: 'nothing-to-restore' });
    });
});

describe('SubscriptionService — escolha do adaptador padrão', () => {
    const { requireOptionalNativeModule } = jest.requireMock('expo-modules-core');

    afterEach(() => (requireOptionalNativeModule as jest.Mock).mockReset().mockReturnValue(null));

    it('com o módulo nativo no binário, as ofertas vêm do StoreKit', async () => {
        (requireOptionalNativeModule as jest.Mock).mockReturnValue({
            loadProducts: jest.fn(async () => [
                { id: 'com.andersonmelo.radiant.ilimitado.anual', displayName: 'Radiant Ilimitado Anual', displayPrice: 'R$ 149,90' },
            ]),
            currentEntitlements: jest.fn(async () => []),
            purchase: jest.fn(),
            sync: jest.fn(),
            addListener: jest.fn(() => ({ remove: () => undefined })),
        });
        const service = new SubscriptionService({ storage: memoria(), hearts: vidas() });

        await expect(service.loadOffers()).resolves.toEqual({
            status: 'available',
            products: [{
                id: 'com.andersonmelo.radiant.ilimitado.anual',
                period: 'annual',
                title: 'Radiant Ilimitado Anual',
                displayPrice: 'R$ 149,90',
            }],
        });
    });

    it('sem o módulo nativo (Android, Jest, Expo Go), a loja fica indisponível', async () => {
        (requireOptionalNativeModule as jest.Mock).mockReturnValue(null);
        const service = new SubscriptionService({ storage: memoria(), hearts: vidas() });

        await expect(service.loadOffers()).resolves.toEqual({ status: 'store-unavailable' });
    });

    it('o módulo nativo só é consultado quando a loja é usada, não ao importar o serviço', () => {
        (requireOptionalNativeModule as jest.Mock).mockClear();

        new SubscriptionService({ storage: memoria(), hearts: vidas() });

        expect(requireOptionalNativeModule).not.toHaveBeenCalled();
    });
});
