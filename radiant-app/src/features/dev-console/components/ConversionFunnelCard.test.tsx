import React from 'react';
import { render, screen } from '@testing-library/react-native';

import type { ConversionStateV1 } from '../../conversion/ConversionService';
import { ConversionFunnelCard } from './ConversionFunnelCard';

jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

const state: ConversionStateV1 = {
    schemaVersion: 1,
    lastInviteDay: '2026-11-15',
    sampleTakenAt: '2026-11-15T15:00:00.000Z',
    counts: {
        invite_seen_hearts_empty: 4, invite_seen_unit_complete: 2, screen_opened: 3,
        purchase_started: 2, purchase_completed: 1, sample_taken: 1,
    },
};

describe('ConversionFunnelCard', () => {
    it('mostra cada etapa do funil com a contagem local e o estado da chave', async () => {
        render(<ConversionFunnelCard service={{ read: async () => state, enabled: () => true }} />);
        expect(await screen.findByText('Convite visto, sem vidas: 4')).toBeTruthy();
        expect(screen.getByText('Convite visto, fim de unidade: 2')).toBeTruthy();
        expect(screen.getByText('Tela de assinatura aberta: 3')).toBeTruthy();
        expect(screen.getByText('Compra iniciada: 2')).toBeTruthy();
        expect(screen.getByText('Compra concluída: 1')).toBeTruthy();
        expect(screen.getByText('Amostra usada: 1')).toBeTruthy();
        expect(screen.getByText('Chave ENABLE_CONVERSION_PROMPTS: ligada · último convite em 2026-11-15')).toBeTruthy();
    });

    it('com a chave desligada, diz que nada é contado', async () => {
        render(<ConversionFunnelCard service={{ read: async () => ({ ...state, lastInviteDay: null }), enabled: () => false }} />);
        expect(await screen.findByText('Chave ENABLE_CONVERSION_PROMPTS: desligada · nada é contado · nenhum convite ainda')).toBeTruthy();
    });
});
