import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { SubscriptionCard } from './SubscriptionCard';

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
