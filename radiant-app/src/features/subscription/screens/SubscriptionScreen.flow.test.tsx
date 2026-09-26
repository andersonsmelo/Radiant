import React from 'react';
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
        expect(screen.getByText('Radiant Ilimitado mensal')).toBeTruthy();
        expect(screen.getByText(/por mês/u)).toBeTruthy();
        expect(screen.getByText(/por ano/u)).toBeTruthy();
        expect(screen.getByText('Vidas ilimitadas — e só isso.')).toBeTruthy();
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

        fireEvent.press(await screen.findByRole('button', { name: 'Assinar Radiant Ilimitado mensal' }));

        expect(await screen.findByText(/Pedido enviado para aprovação/u)).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Assinar Radiant Ilimitado mensal' })).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Assinar Radiant Ilimitado anual' })).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Restaurar compras' })).toBeTruthy();
    });

    it('pedido com mais de 24 h não é mais anunciado: a tela volta ao normal', async () => {
        const DIA = 24 * 60 * 60 * 1000;
        let agora = AGORA;
        const service = servico(loja({ purchase: jest.fn(async (): Promise<PurchaseOutcome> => ({ kind: 'pending' })) }));
        await service.purchase('monthly_plus', AGORA);
        agora = AGORA + DIA;

        renderWithProviders(<SubscriptionScreen service={service} nowMs={() => agora} />);

        expect(await screen.findByRole('button', { name: 'Assinar Radiant Ilimitado mensal' })).toBeTruthy();
        expect(screen.queryByText(/Pedido enviado para aprovação/u)).toBeNull();
    });

    it('assinante vê a renovação e onde gerenciar, sem botão de compra', async () => {
        abrir(loja({ currentEntitlement: jest.fn(async () => direito()) }));

        expect(await screen.findByText('Você é assinante')).toBeTruthy();
        expect(screen.getByText(/Renova em 14\/10\/2026/u)).toBeTruthy();
        expect(screen.getByText(/Ajustes do iOS/u)).toBeTruthy();
        expect(screen.queryByRole('button', { name: /^Assinar/u })).toBeNull();
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

        fireEvent.press(await screen.findByRole('button', { name: 'Assinar Radiant Ilimitado anual' }));

        expect(await screen.findByText(/nada foi cobrado/iu)).toBeTruthy();
        expect(screen.getByText('R$ 149,90')).toBeTruthy();
    });

    it('compra confirmada vira assinante na hora', async () => {
        abrir(loja({ purchase: jest.fn(async (): Promise<PurchaseOutcome> => ({ kind: 'purchased', entitlement: direito() })) }));

        fireEvent.press(await screen.findByRole('button', { name: 'Assinar Radiant Ilimitado mensal' }));

        expect(await screen.findByText('Você é assinante')).toBeTruthy();
    });

    it('assinatura expirada oferece renovar e diz que as vidas voltaram a 5', async () => {
        abrir(loja({ currentEntitlement: jest.fn(async () => direito({ expiresAt: '2026-09-01T12:00:00.000Z' })) }));

        expect(await screen.findByText(/expirou em 01\/09\/2026/u)).toBeTruthy();
        expect(screen.getByText(/voltaram a 5/u)).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Assinar Radiant Ilimitado mensal' })).toBeTruthy();
    });

    it('fechar devolve o aluno de onde veio', async () => {
        abrir(loja());
        await screen.findByText('R$ 19,90');

        fireEvent.press(screen.getByLabelText('Fechar'));

        await waitFor(() => expect(mockedRouter.back).toHaveBeenCalledTimes(1));
    });
});
