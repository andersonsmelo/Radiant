import React from 'react';
import { render } from '@testing-library/react-native';
import { TapChip } from './TapChip';

const HIDDEN = { includeHiddenElements: true };

describe('TapChip', () => {
    it.each([['correct', 'Certo, acertou'], ['incorrect', 'Errado, não é isso']] as const)(
        'o veredito %s desenha VerdictIcon e o rótulo não começa com ✓ nem ✗',
        (verdict, accessibilityLabel) => {
            const view = render(<TapChip label="Avental" accessibilityLabel={accessibilityLabel} verdict={verdict} testID="chip" />);
            const other = verdict === 'correct' ? 'incorrect' : 'correct';

            expect(view.getByTestId(`verdict-icon-${verdict}`, HIDDEN)).toBeTruthy();
            expect(view.queryByTestId(`verdict-icon-${other}`, HIDDEN)).toBeNull();
            expect(view.getByText('Avental')).toBeTruthy();
            expect(view.queryByText(/^[✓✗]/u)).toBeNull();
            // O veredito continua dito por extenso para o leitor de tela.
            expect(view.getByTestId('chip').props.accessibilityLabel).toBe(accessibilityLabel);
        },
    );

    it('sem veredito não desenha marca nenhuma', () => {
        const view = render(<TapChip label="Avental" accessibilityLabel="Avental" />);
        expect(view.queryByTestId('verdict-icon-correct', HIDDEN)).toBeNull();
        expect(view.queryByTestId('verdict-icon-incorrect', HIDDEN)).toBeNull();
    });
});
