import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { STORAGE_KEYS } from '../../../constants/storageKeys';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { ConversionService } from '../../conversion/ConversionService';
import { SubscriptionService } from '../SubscriptionService';
import type { PurchaseOutcome, StoreKitPort, StoreProduct } from '../subscription.types';
import SubscriptionScreen from './SubscriptionScreen';

jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('expo-router', () => ({
    router: { back: jest.fn(), replace: jest.fn() },
    Link: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock('expo-web-browser', () => ({
    openBrowserAsync: jest.fn(),
    WebBrowserPresentationStyle: { AUTOMATIC: 'automatic' },
}));

const AGORA = Date.parse('2026-11-15T12:00:00.000Z');
const produtos: StoreProduct[] = [
    { id: 'monthly_plus', period: 'monthly', title: 'Mensal', displayPrice: 'R$ 19,90' },
    { id: 'annual_plus', period: 'annual', title: 'Anual', displayPrice: 'R$ 149,90' },
];

function memoria() {
    const dados = new Map<string, string>();
    return {
        dados,
        getItem: jest.fn(async (key: string) => dados.get(key) ?? null),
        setItem: jest.fn(async (key: string, value: string) => { dados.set(key, value); }),
    };
}

function abrir(ligada: boolean, purchase: PurchaseOutcome = { kind: 'cancelled' }) {
    const store: StoreKitPort = {
        loadProducts: jest.fn(async () => produtos),
        currentEntitlement: jest.fn(async () => null),
        purchase: jest.fn(async () => purchase),
        restore: jest.fn(async () => null),
    };
    const service = new SubscriptionService({ store, storage: memoria(), hearts: { setUnlimited: jest.fn(async () => undefined) } });
    const disco = memoria();
    const conversion = new ConversionService({
        storage: disco,
        enabled: () => ligada,
        subscription: { getStatus: async () => ({ kind: 'none' }), storeAvailable: () => true },
        hearts: { setUnlimited: jest.fn() },
    });
    renderWithProviders(<SubscriptionScreen service={service} conversion={conversion} nowMs={() => AGORA} />);
    const contagem = () => JSON.parse(disco.dados.get(STORAGE_KEYS.CONVERSION) ?? 'null')?.counts;
    return { disco, contagem };
}

describe('SubscriptionScreen com ENABLE_CONVERSION_PROMPTS', () => {
    it('ligada: mostra a comparação verdadeira e conta a abertura da tela', async () => {
        const { contagem } = abrir(true);
        expect(await screen.findByText('Gratuito', { includeHiddenElements: true })).toBeTruthy();
        expect(screen.getByText('Assinante', { includeHiddenElements: true })).toBeTruthy();
        expect(screen.getByLabelText(/^Vidas\. Gratuito: 5; cada erro gasta uma/)).toBeTruthy();
        expect(screen.getByLabelText('Aulas, revisões e avaliações. Gratuito: Todas. Assinante: Todas.')).toBeTruthy();
        await waitFor(() => expect(contagem()?.screen_opened).toBe(1));
    });

    it('ligada: conta compra iniciada e concluída', async () => {
        const entitlement = { productId: 'annual_plus', period: 'annual' as const, expiresAt: '2027-11-15T12:00:00.000Z', willRenew: true, revokedAt: null };
        const { contagem } = abrir(true, { kind: 'purchased', entitlement });
        fireEvent.press(await screen.findByText('Assinar anual'));
        await waitFor(() => expect(contagem()?.purchase_completed).toBe(1));
        expect(contagem()?.purchase_started).toBe(1);
    });

    it('ligada: compra cancelada conta só o início', async () => {
        const { contagem } = abrir(true, { kind: 'cancelled' });
        fireEvent.press(await screen.findByText('Assinar anual'));
        expect(await screen.findByText('Tudo bem — nada foi cobrado.')).toBeTruthy();
        expect(contagem()?.purchase_started).toBe(1);
        expect(contagem()?.purchase_completed).toBe(0);
    });

    it('desligada (contraprova): o texto da main, sem comparação e sem escrever a chave', async () => {
        const { disco } = abrir(false, { kind: 'cancelled' });
        expect(await screen.findByText('As aulas são as mesmas para todo mundo.')).toBeTruthy();
        expect(screen.queryByText('Gratuito', { includeHiddenElements: true })).toBeNull();
        fireEvent.press(screen.getByText('Assinar anual'));
        expect(await screen.findByText('Tudo bem — nada foi cobrado.')).toBeTruthy();
        expect(disco.setItem).not.toHaveBeenCalled();
    });
});
