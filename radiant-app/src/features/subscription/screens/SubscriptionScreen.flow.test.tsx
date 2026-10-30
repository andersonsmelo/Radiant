import React from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { act, fireEvent, screen, waitFor } from '@testing-library/react-native';

import { renderWithProviders } from '../../../test/renderWithProviders';
import { SubscriptionService } from '../SubscriptionService';
import {
    StoreUnavailableError,
    type PurchaseOutcome,
    type StoreKitPort,
    type StoreProduct,
    type SubscriptionEntitlement,
} from '../subscription.types';
import SubscriptionScreen from './SubscriptionScreen';

jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

jest.mock('expo-router', () => ({
    router: { back: jest.fn(), replace: jest.fn() },
    Link: ({ children }: { children: React.ReactNode }) => children,
}));
const mockedRouter = jest.requireMock('expo-router').router as { back: jest.Mock; replace: jest.Mock };
jest.mock('expo-web-browser', () => ({
    openBrowserAsync: jest.fn(),
    WebBrowserPresentationStyle: { AUTOMATIC: 'automatic' },
}));

const AGORA = Date.parse('2026-09-14T12:00:00.000Z');
const RENOVA_EM = '2026-10-14T12:00:00.000Z';

const produtos: StoreProduct[] = [
    { id: 'monthly_plus', period: 'monthly', title: 'Radiant Ilimitado mensal', displayPrice: 'R$ 19,90' },
    { id: 'annual_plus', period: 'annual', title: 'Radiant Ilimitado anual', displayPrice: 'R$ 149,90' },
];

function direito(overrides: Partial<SubscriptionEntitlement> = {}): SubscriptionEntitlement {
    return { productId: 'monthly_plus', period: 'monthly', expiresAt: RENOVA_EM, willRenew: true, revokedAt: null, ...overrides };
}

function memoria() {
    const dados = new Map<string, string>();
    return {
        getItem: async (key: string) => dados.get(key) ?? null,
        setItem: async (key: string, value: string) => { dados.set(key, value); },
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

function servico(store: StoreKitPort) {
    return new SubscriptionService({ store, storage: memoria(), hearts: { setUnlimited: jest.fn(async () => undefined) } });
}

function abrir(store: StoreKitPort) {
    return renderWithProviders(<SubscriptionScreen service={servico(store)} nowMs={() => AGORA} />);
}

beforeEach(() => {
    jest.clearAllMocks();
});

describe('SubscriptionScreen — estados', () => {
    it('mostra esqueleto enquanto carrega, nunca branco', async () => {
        let liberar: ((value: StoreProduct[]) => void) | undefined;
        abrir(loja({ loadProducts: jest.fn(() => new Promise<StoreProduct[]>(resolve => { liberar = resolve; })) }));

        expect(screen.getByLabelText('Carregando os planos')).toBeTruthy();
        expect(screen.queryByText(/R\$/u)).toBeNull();

        await act(async () => { liberar?.(produtos); });
        expect(await screen.findByText('R$ 19,90')).toBeTruthy();
    });

    it('mostra preços e períodos exatamente como a loja entregou, com renovação, restaurar, termos, privacidade e cancelamento', async () => {
        abrir(loja());

        expect(await screen.findByText('R$ 19,90')).toBeTruthy();
        expect(screen.getByText('R$ 149,90')).toBeTruthy();
        expect(screen.getByRole('radio', { name: /Mensal/u })).toBeTruthy();
        expect(screen.getByText(/por mês/u)).toBeTruthy();
        expect(screen.getByText(/por ano/u)).toBeTruthy();
        expect(screen.getByText('Errar não custa vida.')).toBeTruthy();
        expect(screen.getByText('As aulas são as mesmas para todo mundo.')).toBeTruthy();
        expect(screen.getByText(/renova automaticamente/iu)).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Restaurar compras' })).toBeTruthy();
        expect(screen.getByRole('link', { name: 'Termos de uso' })).toBeTruthy();
        expect(screen.getByRole('link', { name: 'Política de Privacidade' })).toBeTruthy();
        expect(screen.getByText(/Ajustes do iOS/u)).toBeTruthy();
    });

    it('com a loja indisponível informa na voz do Pixel, sem preço inventado, e o estudo segue livre', async () => {
        abrir(lojaIndisponivel());

        expect(await screen.findByText(/A loja não respondeu agora/u)).toBeTruthy();
        expect(screen.getByText(/Suas vidas continuam funcionando/u)).toBeTruthy();
        expect(screen.queryByText(/R\$/u)).toBeNull();
        expect(screen.getByRole('button', { name: 'Tentar de novo' })).toBeTruthy();
    });

    // A Apple não avisa o app quando o responsável recusa ou deixa o pedido
    // expirar, e recomenda permitir nova compra depois de `.pending`
    // (developer.apple.com/forums/thread/685183). Até 2026-09-23 esta tela
    // escondia planos e Restaurar no pendente — e o pendente não tinha fim.
    it('Ask to Buy avisa o pedido e mantém planos e Restaurar à mão', async () => {
        abrir(loja({ purchase: jest.fn(async (): Promise<PurchaseOutcome> => ({ kind: 'pending' })) }));

        fireEvent.press(await screen.findByRole('button', { name: 'Assinar anual' }));

        expect(await screen.findByText(/Pedido enviado para aprovação/u)).toBeTruthy();
        expect(screen.getAllByRole('radio')).toHaveLength(2);
        expect(screen.getByRole('button', { name: 'Assinar anual' })).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Restaurar compras' })).toBeTruthy();
    });

    it('Ask to Buy aprovado com a tela aberta vira assinante sem reabrir, e fechar para de escutar', async () => {
        // Medido no StoreKit Testing em 2026-09-27: aprovado no Xcode, o cache
        // e o HUD viraram ∞, mas esta tela seguiu em "Pedido enviado para
        // aprovação" até ser fechada e aberta de novo.
        let avisar: () => void = () => undefined;
        const currentEntitlement = jest.fn(async (): Promise<SubscriptionEntitlement | null> => null);
        const pararDeEscutar = jest.fn();
        const { unmount } = abrir(loja({
            currentEntitlement,
            purchase: jest.fn(async (): Promise<PurchaseOutcome> => ({ kind: 'pending' })),
            onEntitlementsChanged: jest.fn((ouvinte: () => void) => {
                avisar = ouvinte;
                return pararDeEscutar;
            }),
        }));
        fireEvent.press(await screen.findByRole('button', { name: 'Assinar anual' }));
        expect(await screen.findByText(/Pedido enviado para aprovação/u)).toBeTruthy();

        currentEntitlement.mockResolvedValue(direito());
        act(() => avisar());

        expect(await screen.findByText('Você é assinante')).toBeTruthy();
        expect(screen.queryByText(/Pedido enviado para aprovação/u)).toBeNull();
        unmount();
        expect(pararDeEscutar).toHaveBeenCalledTimes(1);
    });

    it('pedido com mais de 24 h não é mais anunciado: a tela volta ao normal', async () => {
        const DIA = 24 * 60 * 60 * 1000;
        let agora = AGORA;
        const service = servico(loja({ purchase: jest.fn(async (): Promise<PurchaseOutcome> => ({ kind: 'pending' })) }));
        await service.purchase('monthly_plus', AGORA);
        agora = AGORA + DIA;

        renderWithProviders(<SubscriptionScreen service={service} nowMs={() => agora} />);

        expect(await screen.findByRole('button', { name: 'Assinar anual' })).toBeTruthy();
        expect(screen.queryByText(/Pedido enviado para aprovação/u)).toBeNull();
    });

    it('assinante vê a renovação e onde gerenciar, sem botão de compra', async () => {
        abrir(loja({ currentEntitlement: jest.fn(async () => direito()) }));

        expect(await screen.findByText('Você é assinante')).toBeTruthy();
        expect(screen.getByText(/Renova em 14\/10\/2026/u)).toBeTruthy();
        expect(screen.getByText(/Ajustes do iOS/u)).toBeTruthy();
        expect(screen.queryByRole('button', { name: /^Assinar/u })).toBeNull();
    });

    it('assinante gerencia pela folha da Apple, e ao fechá-la a tela mostra o que mudou nela', async () => {
        // ADR de 2026-09-25, "Gerenciar", opção A: troca de plano e cancelamento
        // acontecem na folha; a tela relê a assinatura quando ela fecha.
        const currentEntitlement = jest.fn()
            .mockResolvedValueOnce(direito())
            .mockResolvedValue(direito({ willRenew: false }));
        const manageSubscriptions = jest.fn(async () => ({ kind: 'shown' as const }));
        abrir(loja({ currentEntitlement, manageSubscriptions }));

        fireEvent.press(await screen.findByRole('button', { name: 'Gerenciar assinatura' }));

        expect(await screen.findByText(/Cancelada — válida até 14\/10\/2026/u)).toBeTruthy();
        expect(manageSubscriptions).toHaveBeenCalledTimes(1);
    });

    it('se a folha da Apple não abre, avisa e o caminho pelos Ajustes continua na tela', async () => {
        abrir(loja({
            currentEntitlement: jest.fn(async () => direito()),
            manageSubscriptions: jest.fn(async () => ({ kind: 'failed' as const, message: 'unrecoverable' })),
        }));

        fireEvent.press(await screen.findByRole('button', { name: 'Gerenciar assinatura' }));

        expect(await screen.findByText(/O gerenciamento da Apple não abriu agora/u)).toBeTruthy();
        expect(screen.getByText(/Ajustes do iOS/u)).toBeTruthy();
    });

    it('assinatura cancelada mostra até quando vale', async () => {
        abrir(loja({ currentEntitlement: jest.fn(async () => direito({ willRenew: false })) }));

        expect(await screen.findByText(/Cancelada — válida até 14\/10\/2026/u)).toBeTruthy();
    });

    it('renovação desconhecida mostra o acesso, e nunca "Cancelada"', async () => {
        abrir(loja({ currentEntitlement: jest.fn(async () => direito({ willRenew: null })) }));

        expect(await screen.findByText(/Ativa — acesso até 14\/10\/2026/u)).toBeTruthy();
        expect(screen.queryByText(/Cancelada/u)).toBeNull();
    });

    it('com os planos na tela, a troca de loja da conta recarrega os preços (ADR de 2026-09-25, item 4)', async () => {
        // No aparelho, os preços pedidos antes do login ficaram em dólar
        // enquanto a Apple cobrava em reais.
        let avisar: () => void = () => undefined;
        const loadProducts = jest.fn()
            .mockResolvedValueOnce([{ ...produtos[0], displayPrice: 'US$ 2,99' }, { ...produtos[1], displayPrice: 'US$ 22,99' }])
            .mockResolvedValue(produtos);
        const pararDeEscutar = jest.fn();
        const { unmount } = abrir(loja({
            loadProducts,
            onStorefrontChanged: jest.fn((ouvinte: () => void) => {
                avisar = ouvinte;
                return pararDeEscutar;
            }),
        }));
        expect(await screen.findByText('US$ 2,99')).toBeTruthy();

        act(() => avisar());

        expect(await screen.findByText('R$ 19,90')).toBeTruthy();
        expect(screen.queryByText('US$ 2,99')).toBeNull();
        unmount();
        expect(pararDeEscutar).toHaveBeenCalledTimes(1);
    });

    it('a carga de preços da abertura, se chega depois da troca de loja, não volta a moeda antiga', async () => {
        // Revisão da PR #38: as duas cargas não tinham ordem, e a da abertura,
        // pedida antes da troca, sobrescrevia os preços certos.
        let liberarAntiga: (value: StoreProduct[]) => void = () => undefined;
        let avisar: () => void = () => undefined;
        const loadProducts = jest.fn()
            .mockImplementationOnce(() => new Promise<StoreProduct[]>(resolve => { liberarAntiga = resolve; }))
            .mockResolvedValue(produtos);
        abrir(loja({
            loadProducts,
            onStorefrontChanged: jest.fn((ouvinte: () => void) => {
                avisar = ouvinte;
                return () => undefined;
            }),
        }));

        await act(async () => { avisar(); });
        await act(async () => {
            liberarAntiga([{ ...produtos[0], displayPrice: 'US$ 2,99' }, { ...produtos[1], displayPrice: 'US$ 22,99' }]);
        });

        expect(await screen.findByText('R$ 19,90')).toBeTruthy();
        expect(screen.queryByText('US$ 2,99')).toBeNull();
    });

    it('restaurar compras recupera o direito e confirma na tela', async () => {
        abrir(loja({ restore: jest.fn(async () => direito()) }));

        fireEvent.press(await screen.findByRole('button', { name: 'Restaurar compras' }));

        expect(await screen.findByText('Compra restaurada')).toBeTruthy();
        expect(screen.getByText(/Renova em 14\/10\/2026/u)).toBeTruthy();
    });

    it('restaurar sem compra anterior informa sem travar', async () => {
        abrir(loja());

        fireEvent.press(await screen.findByRole('button', { name: 'Restaurar compras' }));

        expect(await screen.findByText(/Não encontramos uma assinatura/u)).toBeTruthy();
        expect(screen.getByText('R$ 19,90')).toBeTruthy();
    });

    it('compra cancelada na folha da Apple não cobra nada e mantém os planos', async () => {
        abrir(loja());

        fireEvent.press(await screen.findByRole('button', { name: 'Assinar anual' }));

        expect(await screen.findByText(/nada foi cobrado/iu)).toBeTruthy();
        expect(screen.getByText('R$ 149,90')).toBeTruthy();
    });

    it('compra confirmada vira assinante na hora', async () => {
        abrir(loja({ purchase: jest.fn(async (): Promise<PurchaseOutcome> => ({ kind: 'purchased', entitlement: direito() })) }));

        fireEvent.press(await screen.findByRole('button', { name: 'Assinar anual' }));

        expect(await screen.findByText('Você é assinante')).toBeTruthy();
    });

    it('assinatura expirada oferece renovar e diz que as vidas voltaram a 5', async () => {
        abrir(loja({ currentEntitlement: jest.fn(async () => direito({ expiresAt: '2026-09-01T12:00:00.000Z' })) }));

        expect(await screen.findByText(/expirou em 01\/09\/2026/u)).toBeTruthy();
        expect(screen.getByText(/voltaram a 5/u)).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Assinar anual' })).toBeTruthy();
    });

    it('fechar devolve o aluno de onde veio', async () => {
        abrir(loja());
        await screen.findByText('R$ 19,90');

        fireEvent.press(screen.getByLabelText('Fechar'));

        await waitFor(() => expect(mockedRouter.back).toHaveBeenCalledTimes(1));
    });
});


describe('SubscriptionScreen — T11 seleção e preço real', () => {
    it('seleciona anual de início e só compra o productId selecionado', async () => {
        const purchase = jest.fn(async (): Promise<PurchaseOutcome> => ({ kind: 'cancelled' }));
        abrir(loja({ purchase }));
        const anual = await screen.findByRole('radio', { name: /Anual/u });
        expect(anual.props.accessibilityState.checked).toBe(true);
        expect(screen.getByRole('radio', { name: /Mensal/u }).props.accessibilityState.checked).toBe(false);
        expect(screen.getAllByRole('button', { name: /^Assinar/u })).toHaveLength(1);
        fireEvent.press(screen.getByRole('button', { name: 'Assinar anual' }));
        await waitFor(() => expect(purchase).toHaveBeenLastCalledWith('annual_plus'));
        await screen.findByText(/nada foi cobrado/iu);
        fireEvent.press(screen.getByRole('radio', { name: /Mensal/u }));
        expect(screen.getByRole('radio', { name: /Mensal/u }).props.accessibilityState.checked).toBe(true);
        fireEvent.press(screen.getByRole('button', { name: 'Assinar mensal' }));
        await waitFor(() => expect(purchase).toHaveBeenLastCalledWith('monthly_plus'));
    });

    it('divide o número explícito pela duração anual e formata a moeda, sem ler displayPrice', async () => {
        abrir(loja({ loadProducts: jest.fn(async () => [produtos[0], { ...produtos[1], displayPrice: 'Preço localizado da Apple', price: 22.99, currencyCode: 'USD' }]) }));
        expect(await screen.findByText('$1.92 por mês')).toBeTruthy();
        expect(screen.getByText('Preço localizado da Apple')).toBeTruthy();
    });

    it.each([
        {}, { price: 22.99 }, { currencyCode: 'USD' },
        { price: NaN, currencyCode: 'USD' }, { price: Infinity, currencyCode: 'USD' },
        { price: -1, currencyCode: 'USD' }, { price: 22.99, currencyCode: '' },
        { price: 22.99, currencyCode: 'invalid' },
    ])('não inventa equivalente mensal com metadados insuficientes ou inválidos: %j', async (metadata) => {
        abrir(loja({ loadProducts: jest.fn(async () => [produtos[0], { ...produtos[1], ...metadata }]) }));
        await screen.findByText('R$ 149,90');
        expect(screen.queryByText(/.+ por mês/u)).toBeNull();
    });

    it('preserva literalmente o texto legal e o título aprovado', async () => {
        abrir(loja());
        await screen.findByText('R$ 19,90');
        expect(screen.getByRole('header', { name: 'Radiant Ilimitado' })).toBeTruthy();
        expect(screen.getByText('A assinatura renova automaticamente pelo mesmo valor e período até ser cancelada. A cobrança acontece na sua conta da Apple ao confirmar a compra e a cada renovação, até 24 horas antes do fim do período atual.')).toBeTruthy();
        expect(screen.getByText('Para gerenciar ou cancelar: Ajustes do iOS → seu nome → Assinaturas.')).toBeTruthy();
    });

    it('falha de compra informa e permite tentar novamente', async () => {
        abrir(loja({ purchase: jest.fn(async () => ({ kind: 'failed' as const, message: 'network' })) }));
        fireEvent.press(await screen.findByRole('button', { name: 'Assinar anual' }));
        expect(await screen.findByText(/A compra não foi concluída/u)).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Assinar anual' }).props.accessibilityState.disabled).toBe(false);
    });

    it('não mostra seleção nem compra quando a loja está indisponível', async () => {
        abrir(lojaIndisponivel());
        await screen.findByText('A loja não respondeu agora');
        expect(screen.queryAllByRole('radio')).toHaveLength(0);
        expect(screen.queryByRole('button', { name: /^Assinar/u })).toBeNull();
    });

    it('um único produto real continua selecionável, sem inventar o plano ausente', async () => {
        abrir(loja({ loadProducts: jest.fn(async () => [produtos[0]]) }));
        expect(await screen.findByRole('button', { name: 'Assinar mensal' })).toBeTruthy();
        expect(screen.getAllByRole('radio')).toHaveLength(1);
    });
});


describe('SubscriptionScreen — T11 atualização e espera', () => {
    it('atualiza também o equivalente anual quando a moeda da loja muda', async () => {
        let avisar: () => void = () => undefined;
        const loadProducts = jest.fn()
            .mockResolvedValueOnce([{ ...produtos[1], price: 22.99, currencyCode: 'USD' }])
            .mockResolvedValue([{ ...produtos[1], displayPrice: '€36.00', price: 36, currencyCode: 'EUR' }]);
        abrir(loja({ loadProducts, onStorefrontChanged: jest.fn(listener => { avisar = listener; return () => undefined; }) }));
        expect(await screen.findByText('$1.92 por mês')).toBeTruthy();
        await act(async () => avisar());
        expect(await screen.findByText('€3.00 por mês')).toBeTruthy();
        expect(screen.queryByText('$1.92 por mês')).toBeNull();
    });

    it('bloqueia seleção e nova compra enquanto aguarda a loja', async () => {
        let concluir: (result: PurchaseOutcome) => void = () => undefined;
        const purchase = jest.fn(() => new Promise<PurchaseOutcome>(resolve => { concluir = resolve; }));
        abrir(loja({ purchase }));
        fireEvent.press(await screen.findByRole('button', { name: 'Assinar anual' }));
        expect(screen.getByRole('button', { name: 'Assinar anual' }).props.accessibilityState.busy).toBe(true);
        const mensal = screen.getByRole('radio', { name: /Mensal/u });
        expect(mensal.props.accessibilityState.disabled).toBe(true);
        fireEvent.press(mensal);
        fireEvent.press(screen.getByRole('button', { name: 'Assinar anual' }));
        expect(purchase).toHaveBeenCalledTimes(1);
        await act(async () => concluir({ kind: 'cancelled' }));
        expect(screen.getByRole('button', { name: 'Assinar anual' }).props.accessibilityState.busy).toBe(false);
    });
});

describe('SubscriptionScreen — T11 seleção após storefront', () => {
    it('mantém a escolha mensal quando os mesmos produtos mudam de preço e moeda', async () => {
        let avisar: () => void = () => undefined;
        const purchase = jest.fn(async (): Promise<PurchaseOutcome> => ({ kind: 'cancelled' }));
        const loadProducts = jest.fn().mockResolvedValueOnce(produtos).mockResolvedValue(produtos.map(product => ({ ...product, displayPrice: '€12.00' })));
        abrir(loja({ purchase, loadProducts, onStorefrontChanged: jest.fn(listener => { avisar = listener; return () => undefined; }) }));
        fireEvent.press(await screen.findByRole('radio', { name: /Mensal/u }));
        await act(async () => avisar());
        await waitFor(() => expect(screen.getAllByText('€12.00')).toHaveLength(2));
        expect(screen.getByRole('radio', { name: /Mensal/u }).props.accessibilityState.checked).toBe(true);
        fireEvent.press(screen.getByRole('button', { name: 'Assinar mensal' }));
        await waitFor(() => expect(purchase).toHaveBeenCalledWith('monthly_plus'));
    });

    it('se o produto selecionado deixa a loja, compra só o produto real ainda disponível', async () => {
        let avisar: () => void = () => undefined;
        const purchase = jest.fn(async (): Promise<PurchaseOutcome> => ({ kind: 'cancelled' }));
        const loadProducts = jest.fn().mockResolvedValueOnce(produtos).mockResolvedValue([produtos[1]]);
        abrir(loja({ purchase, loadProducts, onStorefrontChanged: jest.fn(listener => { avisar = listener; return () => undefined; }) }));
        fireEvent.press(await screen.findByRole('radio', { name: /Mensal/u }));
        await act(async () => avisar());
        await waitFor(() => expect(screen.queryByRole('radio', { name: /Mensal/u })).toBeNull());
        expect(screen.getByRole('radio', { name: /Anual/u }).props.accessibilityState.checked).toBe(true);
        fireEvent.press(screen.getByRole('button', { name: 'Assinar anual' }));
        await waitFor(() => expect(purchase).toHaveBeenCalledWith('annual_plus'));
    });
});

describe('SubscriptionScreen — T11 storefront fora de ordem', () => {
    it('uma resposta antiga não revive o plano removido pela loja mais recente', async () => {
        let avisar: () => void = () => undefined;
        let responderAntiga: (products: StoreProduct[]) => void = () => undefined;
        const purchase = jest.fn(async (): Promise<PurchaseOutcome> => ({ kind: 'cancelled' }));
        const loadProducts = jest.fn().mockResolvedValueOnce(produtos)
            .mockImplementationOnce(() => new Promise<StoreProduct[]>(resolve => { responderAntiga = resolve; }))
            .mockResolvedValue([produtos[1]]);
        abrir(loja({ purchase, loadProducts, onStorefrontChanged: jest.fn(listener => { avisar = listener; return () => undefined; }) }));
        fireEvent.press(await screen.findByRole('radio', { name: /Mensal/u }));
        await act(async () => { avisar(); });
        await act(async () => { avisar(); });
        expect(screen.queryByRole('radio', { name: /Mensal/u })).toBeNull();
        await act(async () => { responderAntiga(produtos); });
        expect(screen.queryByRole('radio', { name: /Mensal/u })).toBeNull();
        fireEvent.press(screen.getByRole('button', { name: 'Assinar anual' }));
        await waitFor(() => expect(purchase).toHaveBeenCalledWith('annual_plus'));
    });
});

describe('SubscriptionScreen — T11 fix1 rótulo acessível do equivalente mensal', () => {
    it('anuncia preço anual e equivalente mensal exatamente uma vez, preservando o mensal', async () => {
        abrir(loja({ loadProducts: jest.fn(async () => [
            { ...produtos[0], price: 2.99, currencyCode: 'USD', displayPrice: '$2.99' },
            { ...produtos[1], price: 22.99, currencyCode: 'USD', displayPrice: '$22.99' },
        ]) }));
        expect(await screen.findByRole('radio', { name: 'Anual, $22.99 por ano, $1.92 por mês' })).toBeTruthy();
        expect(screen.getByRole('radio', { name: 'Mensal, $2.99 por mês' })).toBeTruthy();
        expect(screen.getByText('$1.92 por mês')).toBeTruthy();
    });

    it.each([
        {}, { price: 22.99 }, { currencyCode: 'USD' },
        { price: NaN, currencyCode: 'USD' }, { price: Infinity, currencyCode: 'USD' },
        { price: -1, currencyCode: 'USD' }, { price: 22.99, currencyCode: '' },
        { price: 22.99, currencyCode: 'invalid' },
    ])('omite equivalente no rótulo acessível sem metadados válidos: %j', async metadata => {
        abrir(loja({ loadProducts: jest.fn(async () => [produtos[0], { ...produtos[1], ...metadata }]) }));
        expect(await screen.findByRole('radio', { name: 'Anual, R$ 149,90 por ano' })).toBeTruthy();
        expect(screen.getByRole('radio', { name: 'Mensal, R$ 19,90 por mês' })).toBeTruthy();
    });
});


type LayoutTestNode = {
    props: { style?: StyleProp<ViewStyle>; pointerEvents?: string };
    parent: LayoutTestNode | null;
    findAll(predicate: (node: LayoutTestNode) => boolean): LayoutTestNode[];
};

describe('SubscriptionScreen — T11 fix2 geometria do medalhão', () => {
    it('mantém face e lábio no raio de metade do diâmetro aprovado', async () => {
        abrir(loja());
        await screen.findByRole('radio', { name: /Anual/u });
        for (const name of ['Mensal', 'Anual']) {
            let face: LayoutTestNode | null = screen.getByText(name).parent;
            while (face && StyleSheet.flatten(face.props.style)?.borderRadius === undefined) face = face.parent;
            if (!face) throw new Error(`Face ausente no plano ${name}`);
            let medal: LayoutTestNode | null = face.parent;
            while (medal && StyleSheet.flatten(medal.props.style)?.maxWidth === undefined) medal = medal.parent;
            if (!medal) throw new Error(`Medalha ausente no plano ${name}`);
            const lip = medal.findAll(node => node.props.pointerEvents === 'none')[0];
            if (!lip) throw new Error(`Lábio ausente no plano ${name}`);
            const faceStyle = StyleSheet.flatten(face.props.style) ?? {};
            const lipStyle = StyleSheet.flatten(lip.props.style) ?? {};
            const medalStyle = StyleSheet.flatten(medal.props.style) ?? {};
            expect(medalStyle.maxWidth).toBe(128);
            expect(faceStyle.borderRadius).toBe(64);
            expect(Number(faceStyle.borderRadius) * 2).toBe(medalStyle.maxWidth);
            expect(lipStyle.borderRadius).toBe(faceStyle.borderRadius);
        }
    });
});
