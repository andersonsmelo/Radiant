import { StoreKit2Adapter, resolveStoreKitAdapter } from './StoreKit2Adapter';
import type {
    RadiantStoreKitNative,
    StoreKitNativeProduct,
    StoreKitNativeTransaction,
} from './storekitNative.types';
import { isStoreUnavailable } from './subscription.types';
import { SUBSCRIPTION_PRODUCT_IDS } from './subscriptionProducts';
import { UnavailableStoreKitAdapter } from './UnavailableStoreKitAdapter';

jest.mock('expo-modules-core', () => ({ requireOptionalNativeModule: jest.fn() }));

const { requireOptionalNativeModule } = jest.requireMock('expo-modules-core');

// Os IDs da ADR de produtos, escritos por extenso de propósito: se a tabela do
// app divergir da ADR, estes testes falham em vez de acompanhar a divergência.
const MENSAL = 'com.andersonmelo.radiant.ilimitado.mensal';
const ANUAL = 'com.andersonmelo.radiant.ilimitado.anual';

const FUTURO = '2026-10-23T12:00:00.000Z';
const MAIS_FUTURO = '2027-09-23T12:00:00.000Z';
const PASSADO = '2026-08-23T12:00:00.000Z';

function transacao(overrides: Partial<StoreKitNativeTransaction> = {}): StoreKitNativeTransaction {
    return {
        productId: MENSAL,
        expirationDate: FUTURO,
        revocationDate: null,
        verified: true,
        willAutoRenew: true,
        ...overrides,
    };
}

const PRODUTOS_NATIVOS: StoreKitNativeProduct[] = [
    { id: MENSAL, displayName: 'Radiant Ilimitado Mensal', displayPrice: 'R$ 19,90' },
    { id: ANUAL, displayName: 'Radiant Ilimitado Anual', displayPrice: 'R$ 149,90' },
];

type Ouvinte = () => void;

function fakeNative(overrides: Partial<RadiantStoreKitNative> = {}) {
    // Um conjunto de ouvintes por evento: o módulo emite mais de um, e um
    // ouvinte de transação não pode ser acordado por troca de loja.
    const porEvento = new Map<string, Set<Ouvinte>>();
    const ouvintesDe = (evento: string) => {
        if (!porEvento.has(evento)) porEvento.set(evento, new Set());
        return porEvento.get(evento)!;
    };
    const native = {
        loadProducts: jest.fn(async () => PRODUTOS_NATIVOS),
        currentEntitlements: jest.fn(async (): Promise<StoreKitNativeTransaction[]> => []),
        purchase: jest.fn(async () => ({ kind: 'success' as const, transaction: transacao() })),
        sync: jest.fn(async () => undefined),
        showManageSubscriptions: jest.fn(async () => undefined),
        addListener: jest.fn((evento: string, ouvinte: Ouvinte) => {
            ouvintesDe(evento).add(ouvinte);
            return { remove: () => ouvintesDe(evento).delete(ouvinte) };
        }),
        ...overrides,
    };
    const emitir = (evento = 'onTransactionsUpdated') => ouvintesDe(evento).forEach((ouvinte) => ouvinte());
    return { native: native as unknown as jest.Mocked<RadiantStoreKitNative>, emitir, ouvintes: ouvintesDe('onTransactionsUpdated'), ouvintesDe };
}

function nativeErro(code: string): Error & { code: string } {
    return Object.assign(new Error(`falha nativa: ${code}`), { code });
}

describe('StoreKit2Adapter — produtos', () => {
    it('entrega os dois planos da ADR com o período da tabela e o preço da Apple', async () => {
        const { native } = fakeNative();

        const produtos = await new StoreKit2Adapter(native).loadProducts(SUBSCRIPTION_PRODUCT_IDS);

        expect(native.loadProducts).toHaveBeenCalledWith([MENSAL, ANUAL]);
        expect(produtos).toEqual([
            { id: MENSAL, period: 'monthly', title: 'Radiant Ilimitado Mensal', displayPrice: 'R$ 19,90' },
            { id: ANUAL, period: 'annual', title: 'Radiant Ilimitado Anual', displayPrice: 'R$ 149,90' },
        ]);
    });

    it('descarta produto que não está na ADR, mesmo que a Apple o devolva', async () => {
        const { native } = fakeNative({
            loadProducts: jest.fn(async () => [
                ...PRODUTOS_NATIVOS,
                { id: 'monthly_plus', displayName: 'Intruso', displayPrice: 'R$ 1,00' },
            ]),
        });

        const produtos = await new StoreKit2Adapter(native).loadProducts([...SUBSCRIPTION_PRODUCT_IDS, 'monthly_plus']);

        expect(produtos.map((produto) => produto.id)).toEqual([MENSAL, ANUAL]);
    });

    it('o mensal vem primeiro mesmo quando a Apple devolve o anual antes (ADR de 2026-09-25, item 3)', async () => {
        // A Apple não garante a ordem de `Product.products(for:)`: no aparelho,
        // num dia veio o mensal primeiro e no outro, o anual.
        const { native } = fakeNative({ loadProducts: jest.fn(async () => [...PRODUTOS_NATIVOS].reverse()) });

        const produtos = await new StoreKit2Adapter(native).loadProducts(SUBSCRIPTION_PRODUCT_IDS);

        expect(produtos.map((produto) => produto.period)).toEqual(['monthly', 'annual']);
    });

    it('lista vazia é loja indisponível, não uma tela de planos sem planos', async () => {
        // Acordo de apps pagos inativo ou ID errado: a Apple devolve lista vazia
        // sem lançar erro.
        const { native } = fakeNative({ loadProducts: jest.fn(async () => []) });

        const erro = await new StoreKit2Adapter(native).loadProducts(SUBSCRIPTION_PRODUCT_IDS).catch((e: unknown) => e);

        expect(isStoreUnavailable(erro)).toBe(true);
    });
});

describe('StoreKit2Adapter — direito atual', () => {
    it('transação verificada de produto da ADR vira o direito, com o período da tabela', async () => {
        const { native } = fakeNative({ currentEntitlements: jest.fn(async () => [transacao()]) });

        await expect(new StoreKit2Adapter(native).currentEntitlement()).resolves.toEqual({
            productId: MENSAL,
            period: 'monthly',
            expiresAt: FUTURO,
            willRenew: true,
            revokedAt: null,
        });
    });

    it('transação NÃO verificada não dá direito, mesmo sendo a única', async () => {
        const { native } = fakeNative({
            currentEntitlements: jest.fn(async () => [transacao({ verified: false, expirationDate: MAIS_FUTURO })]),
        });

        await expect(new StoreKit2Adapter(native).currentEntitlement()).resolves.toBeNull();
    });

    it('não verificada não vence a verificada, mesmo expirando depois', async () => {
        const { native } = fakeNative({
            currentEntitlements: jest.fn(async () => [
                transacao({ productId: ANUAL, verified: false, expirationDate: MAIS_FUTURO }),
                transacao({ productId: MENSAL, expirationDate: FUTURO }),
            ]),
        });

        const direito = await new StoreKit2Adapter(native).currentEntitlement();

        expect(direito).toEqual(expect.objectContaining({ productId: MENSAL, expiresAt: FUTURO }));
    });

    it('produto fora da ADR não dá direito', async () => {
        const { native } = fakeNative({
            currentEntitlements: jest.fn(async () => [transacao({ productId: 'monthly_plus' })]),
        });

        await expect(new StoreKit2Adapter(native).currentEntitlement()).resolves.toBeNull();
    });

    it('transação revogada traduz a data de revogação para a porta', async () => {
        const revogadaEm = '2026-09-20T09:00:00.000Z';
        const { native } = fakeNative({
            currentEntitlements: jest.fn(async () => [transacao({ revocationDate: revogadaEm })]),
        });

        await expect(new StoreKit2Adapter(native).currentEntitlement()).resolves.toEqual(
            expect.objectContaining({ productId: MENSAL, revokedAt: revogadaEm }),
        );
    });

    it('transação expirada passa com a data real; quem decide que expirou é o serviço, com o relógio', async () => {
        const { native } = fakeNative({
            currentEntitlements: jest.fn(async () => [transacao({ expirationDate: PASSADO })]),
        });

        await expect(new StoreKit2Adapter(native).currentEntitlement()).resolves.toEqual(
            expect.objectContaining({ productId: MENSAL, expiresAt: PASSADO, revokedAt: null }),
        );
    });

    it('entre duas válidas, vence a que expira mais tarde', async () => {
        const { native } = fakeNative({
            currentEntitlements: jest.fn(async () => [
                transacao({ productId: MENSAL, expirationDate: FUTURO }),
                transacao({ productId: ANUAL, expirationDate: MAIS_FUTURO, willAutoRenew: false }),
            ]),
        });

        await expect(new StoreKit2Adapter(native).currentEntitlement()).resolves.toEqual({
            productId: ANUAL,
            period: 'annual',
            expiresAt: MAIS_FUTURO,
            willRenew: false,
            revokedAt: null,
        });
    });

    // ADR de 2026-09-25, 2A: desconhecido é um estado próprio. Virar `false`
    // fazia o assinante pagante ler "Cancelada". A porta continua sem
    // prometer renovação: `null` não é `true`.
    it('renovação desconhecida (null) vira willRenew null, e não false', async () => {
        const { native } = fakeNative({
            currentEntitlements: jest.fn(async () => [transacao({ willAutoRenew: null })]),
        });

        await expect(new StoreKit2Adapter(native).currentEntitlement()).resolves.toEqual(
            expect.objectContaining({ willRenew: null }),
        );
    });

    it('renovação ausente, como o Swift manda quando não sabe, também vira willRenew null', async () => {
        const semRenovacao = transacao();
        delete (semRenovacao as Partial<StoreKitNativeTransaction>).willAutoRenew;
        const { native } = fakeNative({ currentEntitlements: jest.fn(async () => [semRenovacao]) });

        await expect(new StoreKit2Adapter(native).currentEntitlement()).resolves.toEqual(
            expect.objectContaining({ willRenew: null }),
        );
    });

    it('transação sem data de expiração válida não dá direito', async () => {
        const { native } = fakeNative({
            currentEntitlements: jest.fn(async () => [
                transacao({ expirationDate: null }),
                transacao({ productId: ANUAL, expirationDate: 'não é data' }),
            ]),
        });

        await expect(new StoreKit2Adapter(native).currentEntitlement()).resolves.toBeNull();
    });

    it('sem transação nenhuma, sem direito', async () => {
        const { native } = fakeNative();

        await expect(new StoreKit2Adapter(native).currentEntitlement()).resolves.toBeNull();
    });
});

describe('StoreKit2Adapter — compra', () => {
    it('compra verificada devolve o direito do produto comprado', async () => {
        const { native } = fakeNative({
            purchase: jest.fn(async () => ({
                kind: 'success' as const,
                transaction: transacao({ productId: ANUAL, expirationDate: MAIS_FUTURO }),
            })),
        });

        await expect(new StoreKit2Adapter(native).purchase(ANUAL)).resolves.toEqual({
            kind: 'purchased',
            entitlement: {
                productId: ANUAL,
                period: 'annual',
                expiresAt: MAIS_FUTURO,
                willRenew: true,
                revokedAt: null,
            },
        });
        expect(native.purchase).toHaveBeenCalledWith(ANUAL);
    });

    it('compra com transação NÃO verificada é falha, sem direito', async () => {
        const { native } = fakeNative({
            purchase: jest.fn(async () => ({ kind: 'success' as const, transaction: transacao({ verified: false }) })),
        });

        await expect(new StoreKit2Adapter(native).purchase(MENSAL)).resolves.toEqual({
            kind: 'failed',
            message: 'unverified-transaction',
        });
    });

    it('Ask to Buy fica pendente', async () => {
        const { native } = fakeNative({ purchase: jest.fn(async () => ({ kind: 'pending' as const })) });

        await expect(new StoreKit2Adapter(native).purchase(MENSAL)).resolves.toEqual({ kind: 'pending' });
    });

    it('desistência da pessoa é cancelamento, não falha', async () => {
        const { native } = fakeNative({ purchase: jest.fn(async () => ({ kind: 'userCancelled' as const })) });

        await expect(new StoreKit2Adapter(native).purchase(MENSAL)).resolves.toEqual({ kind: 'cancelled' });
    });

    it('erro nativo vira falha com o código estável', async () => {
        const { native } = fakeNative({
            purchase: jest.fn(async () => {
                throw nativeErro('payments-not-allowed');
            }),
        });

        await expect(new StoreKit2Adapter(native).purchase(MENSAL)).resolves.toEqual({
            kind: 'failed',
            message: 'payments-not-allowed',
        });
    });

    it('produto fora da ADR falha sem chegar à Apple', async () => {
        const { native } = fakeNative();

        await expect(new StoreKit2Adapter(native).purchase('monthly_plus')).resolves.toEqual({
            kind: 'failed',
            message: 'unknown-product',
        });
        expect(native.purchase).not.toHaveBeenCalled();
    });
});

describe('StoreKit2Adapter — restaurar', () => {
    it('sincroniza com a App Store antes de ler o direito local', async () => {
        const ordem: string[] = [];
        const { native } = fakeNative({
            sync: jest.fn(async () => {
                ordem.push('sync');
            }),
            currentEntitlements: jest.fn(async () => {
                ordem.push('currentEntitlements');
                return [transacao()];
            }),
        });

        const direito = await new StoreKit2Adapter(native).restore();

        expect(ordem).toEqual(['sync', 'currentEntitlements']);
        expect(direito).toEqual(expect.objectContaining({ productId: MENSAL, expiresAt: FUTURO }));
    });

    it('nada a restaurar devolve null', async () => {
        const { native } = fakeNative();

        await expect(new StoreKit2Adapter(native).restore()).resolves.toBeNull();
    });

    it('se a sincronização falhar, ainda lê o que já está no aparelho', async () => {
        const { native } = fakeNative({
            sync: jest.fn(async () => {
                throw nativeErro('user-cancelled');
            }),
            currentEntitlements: jest.fn(async () => [transacao()]),
        });

        await expect(new StoreKit2Adapter(native).restore()).resolves.toEqual(
            expect.objectContaining({ productId: MENSAL }),
        );
    });
});

describe('StoreKit2Adapter — atualizações de transação', () => {
    it('avisa o ouvinte quando o nativo recebe Transaction.updates, e para de avisar ao cancelar', () => {
        const { native, emitir, ouvintes } = fakeNative();
        const ouvinte = jest.fn();

        const cancelar = new StoreKit2Adapter(native).onEntitlementsChanged(ouvinte);
        emitir();
        cancelar();
        emitir();

        expect(native.addListener).toHaveBeenCalledWith('onTransactionsUpdated', expect.any(Function));
        expect(ouvinte).toHaveBeenCalledTimes(1);
        expect(ouvintes.size).toBe(0);
    });
});

describe('StoreKit2Adapter — gerenciar a assinatura', () => {
    it('abre a folha de gerenciamento da Apple e informa que ela foi mostrada', async () => {
        const { native } = fakeNative();

        const resultado = await new StoreKit2Adapter(native).manageSubscriptions();

        expect(native.showManageSubscriptions).toHaveBeenCalledTimes(1);
        expect(resultado).toEqual({ kind: 'shown' });
    });

    it('falha nativa ao abrir a folha vira falha com o código estável, sem lançar', async () => {
        const { native } = fakeNative({
            showManageSubscriptions: jest.fn(async () => { throw nativeErro('unrecoverable'); }),
        });

        const resultado = await new StoreKit2Adapter(native).manageSubscriptions();

        expect(resultado).toEqual({ kind: 'failed', message: 'unrecoverable' });
    });
});

describe('StoreKit2Adapter — troca de loja', () => {
    it('avisa o ouvinte quando o nativo recebe Storefront.updates, e só por esse evento', () => {
        const { native, emitir, ouvintesDe } = fakeNative();
        const ouvinte = jest.fn();

        const cancelar = new StoreKit2Adapter(native).onStorefrontChanged(ouvinte);
        emitir('onTransactionsUpdated');
        emitir('onStorefrontChanged');
        cancelar();
        emitir('onStorefrontChanged');

        expect(native.addListener).toHaveBeenCalledWith('onStorefrontChanged', expect.any(Function));
        expect(ouvinte).toHaveBeenCalledTimes(1);
        expect(ouvintesDe('onStorefrontChanged').size).toBe(0);
    });
});

describe('resolveStoreKitAdapter — degradação sem binário nativo', () => {
    beforeEach(() => jest.clearAllMocks());

    it('usa o adaptador StoreKit 2 quando o módulo nativo está no binário', () => {
        (requireOptionalNativeModule as jest.Mock).mockReturnValue(fakeNative().native);

        expect(resolveStoreKitAdapter()).toBeInstanceOf(StoreKit2Adapter);
        expect(requireOptionalNativeModule).toHaveBeenCalledWith('RadiantStoreKit');
    });

    it('módulo ausente (Android, Jest, Expo Go) → loja indisponível', () => {
        (requireOptionalNativeModule as jest.Mock).mockReturnValue(null);

        expect(resolveStoreKitAdapter()).toBeInstanceOf(UnavailableStoreKitAdapter);
    });

    it('exceção do carregador não derruba a abertura: loja indisponível', () => {
        (requireOptionalNativeModule as jest.Mock).mockImplementation(() => {
            throw new Error('runtime de módulos indisponível');
        });
        jest.spyOn(console, 'error').mockImplementation(() => undefined);

        expect(resolveStoreKitAdapter()).toBeInstanceOf(UnavailableStoreKitAdapter);
    });
});
