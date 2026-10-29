import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { SubscriptionCard } from './SubscriptionCard';
jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

describe('SubscriptionCard', () => {
    it('sem assinatura, apresenta a promessa exata e convida a conhecer', () => {
        const onOpen = jest.fn();
        render(<SubscriptionCard status={{ kind: 'none' }} onOpen={onOpen} />);

        expect(screen.getByText('Vidas ilimitadas — e só isso.')).toBeTruthy();
        fireEvent.press(screen.getByRole('button', { name: 'Conhecer' }));
        expect(onOpen).toHaveBeenCalledTimes(1);
    });

    it('assinante vê a renovação e gerenciar', () => {
        render(<SubscriptionCard status={{ kind: 'unlimited', expiresAt: '2026-10-14T12:00:00.000Z', willRenew: true }} onOpen={jest.fn()} />);

        expect(screen.getByText('Assinante · vidas ilimitadas')).toBeTruthy();
        expect(screen.getByText('Renova em 14/10/2026')).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Gerenciar' })).toBeTruthy();
    });

    it('cancelada mostra até quando vale', () => {
        render(<SubscriptionCard status={{ kind: 'unlimited', expiresAt: '2026-10-14T12:00:00.000Z', willRenew: false }} onOpen={jest.fn()} />);

        expect(screen.getByText('Cancelada · válida até 14/10/2026')).toBeTruthy();
    });

    it('renovação desconhecida mostra o acesso, e nunca "Cancelada" (ADR 2026-09-25, 2A)', () => {
        render(<SubscriptionCard status={{ kind: 'unlimited', expiresAt: '2026-10-14T12:00:00.000Z', willRenew: null }} onOpen={jest.fn()} />);

        expect(screen.getByText('Ativa · acesso até 14/10/2026')).toBeTruthy();
        expect(screen.queryByText(/Cancelada/u)).toBeNull();
    });

    it('expirada convida a renovar', () => {
        render(<SubscriptionCard status={{ kind: 'expired', expiredAt: '2026-09-01T12:00:00.000Z' }} onOpen={jest.fn()} />);

        expect(screen.getByText('Assinatura expirada')).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Renovar' })).toBeTruthy();
    });

    it('pendente informa que aguarda aprovação e continua abrindo a tela', () => {
        const onOpen = jest.fn();
        render(<SubscriptionCard status={{ kind: 'pending', since: '2026-09-14T12:00:00.000Z' }} onOpen={onOpen} />);

        expect(screen.getByText('Pedido aguardando aprovação')).toBeTruthy();
        fireEvent.press(screen.getByRole('button', { name: 'Ver' }));
        expect(onOpen).toHaveBeenCalledTimes(1);
    });

    it('enquanto carrega mostra esqueleto, nunca branco', () => {
        render(<SubscriptionCard status={null} onOpen={jest.fn()} />);

        expect(screen.getByLabelText('Carregando a assinatura')).toBeTruthy();
    });
});

it('é uma única linha acionável sem etiqueta ASSINATURA nem botão separado', () => {
    const { UNSAFE_getAllByType } = render(<SubscriptionCard status={{ kind: 'none' }} onOpen={jest.fn()} />);
    expect(screen.queryByText('ASSINATURA')).toBeNull();
    expect(screen.getAllByRole('button')).toHaveLength(1);
    const { View, StyleSheet, Text } = require('react-native');
    expect(UNSAFE_getAllByType(View).some(node => StyleSheet.flatten(node.props.style)?.borderWidth)).toBe(false);
    for (const text of UNSAFE_getAllByType(Text)) expect(text.props.maxFontSizeMultiplier).toBeUndefined();
});
