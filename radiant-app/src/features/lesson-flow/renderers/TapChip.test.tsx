import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';
import { readMotionStyle } from '../../../test/readMotionStyle';
import { TapChip } from './TapChip';
import { feedbackColors, galaxyColors, medalColors } from '../../../ui/theme';

const flat = (style: unknown) => Object.assign({}, ...[style].flat(Infinity).filter(Boolean));

const translateYOf = (node: Parameters<typeof readMotionStyle>[0]) =>
    (readMotionStyle(node) as { transform: { translateY: number }[] }).transform[0].translateY;

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

    it('tem lábio sólido atrás da face, na cor do estado, e a face mantém 44 pt', () => {
        const idle = render(<TapChip label="Avental" accessibilityLabel="Avental" testID="chip" />);
        expect(flat(idle.getByTestId('tap-chip-lip').props.style).backgroundColor).toBe(galaxyColors.backgroundAlt);
        expect(flat(idle.getByTestId('chip').props.style).minHeight).toBeGreaterThanOrEqual(44);
        const right = render(<TapChip label="Avental" accessibilityLabel="Avental" verdict="correct" />);
        expect(flat(right.getByTestId('tap-chip-lip').props.style).backgroundColor).toBe(feedbackColors.success.lip);
    });

    it('o lábio acompanha os estados escolhida e errada', () => {
        const picked = render(<TapChip label="A" accessibilityLabel="A" selected />);
        expect(flat(picked.getByTestId('tap-chip-lip').props.style).backgroundColor).toBe(medalColors.unit.lip);
        const wrong = render(<TapChip label="A" accessibilityLabel="A" verdict="incorrect" />);
        expect(flat(wrong.getByTestId('tap-chip-lip').props.style).backgroundColor).toBe(feedbackColors.error.lip);
    });

    it('a descida só ocorre com pressão e sem disabled', () => {
        jest.useFakeTimers();
        try {
            const view = render(<TapChip label="A" accessibilityLabel="A" testID="chip" />);
            expect(translateYOf(view.getByTestId('chip'))).toBe(0);
            fireEvent(view.getByTestId('chip'), 'pressIn');
            act(() => { jest.advanceTimersByTime(500); });
            expect(translateYOf(view.getByTestId('chip'))).toBe(3);
            fireEvent(view.getByTestId('chip'), 'pressOut');
            act(() => { jest.advanceTimersByTime(500); });
            expect(translateYOf(view.getByTestId('chip'))).toBe(0);
            const off = render(<TapChip label="A" accessibilityLabel="A" testID="off" disabled />);
            fireEvent(off.getByTestId('off'), 'pressIn');
            act(() => { jest.advanceTimersByTime(500); });
            expect(translateYOf(off.getByTestId('off'))).toBe(0);
        } finally { jest.useRealTimers(); }
    });

    it('a borda tem a mesma largura em todos os estados: só a cor muda', () => {
        const width = (props: object) =>
            flat(render(<TapChip label="A" accessibilityLabel="A" testID="chip" {...props} />).getByTestId('chip').props.style).borderWidth;
        const idle = width({});
        expect(idle).toBe(2);
        expect(width({ selected: true })).toBe(idle);
        expect(width({ verdict: 'correct' })).toBe(idle);
        expect(width({ verdict: 'incorrect' })).toBe(idle);
    });
});
