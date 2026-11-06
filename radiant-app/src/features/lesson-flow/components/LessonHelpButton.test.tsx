import React from 'react';
import { AccessibilityInfo } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { LessonHelpButton } from './LessonHelpButton';

const PISTA = 'Pense em qual partícula orbita o núcleo.';

describe('LessonHelpButton', () => {
    const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => undefined);

    beforeEach(() => announce.mockClear());

    it('oferece a pista sem mostrá-la antes do pedido', () => {
        render(<LessonHelpButton help={PISTA} />);

        expect(screen.getByRole('button', { name: 'Ver pista' })).toBeTruthy();
        expect(screen.queryByText(`Pista: ${PISTA}`)).toBeNull();
        expect(announce).not.toHaveBeenCalled();
    });

    it('ao pedir, mostra a pista por escrito, avisa o leitor de tela e conta o uso uma vez', () => {
        const onReveal = jest.fn();
        render(<LessonHelpButton help={PISTA} onReveal={onReveal} />);

        fireEvent.press(screen.getByRole('button', { name: 'Ver pista' }));

        expect(screen.getByText(`Pista: ${PISTA}`)).toBeTruthy();
        expect(screen.queryByRole('button', { name: 'Ver pista' })).toBeNull();
        expect(onReveal).toHaveBeenCalledTimes(1);
        expect(announce).toHaveBeenCalledWith(`Pista: ${PISTA}`);
    });

    it('depois da resposta, a pista não é mais oferecida', () => {
        render(<LessonHelpButton help={PISTA} locked />);

        expect(screen.queryByRole('button', { name: 'Ver pista' })).toBeNull();
        expect(screen.queryByText(`Pista: ${PISTA}`)).toBeNull();
    });

    it('a pista já aberta continua na tela depois da resposta', () => {
        const view = render(<LessonHelpButton help={PISTA} />);
        fireEvent.press(screen.getByRole('button', { name: 'Ver pista' }));
        view.rerender(<LessonHelpButton help={PISTA} locked />);

        expect(screen.getByText(`Pista: ${PISTA}`)).toBeTruthy();
    });

    it('o alvo de toque tem pelo menos 44 pt e o texto não tem teto de fonte', () => {
        render(<LessonHelpButton help={PISTA} />);

        expect(screen.getByRole('button', { name: 'Ver pista' }).props.style.minHeight).toBeGreaterThanOrEqual(44);
        expect(screen.getByText('Ver pista').props.maxFontSizeMultiplier).toBeUndefined();
    });
});
