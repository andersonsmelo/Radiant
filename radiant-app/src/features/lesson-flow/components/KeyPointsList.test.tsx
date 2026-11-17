import React from 'react';
import { render } from '@testing-library/react-native';
import { KeyPointsList } from './KeyPointsList';
import { galaxyColors, medalColors } from '../../../ui/theme';
import { semanticColors } from '../../../ui/semantic-colors';

const flat = (style: unknown) => Object.assign({}, ...[style].flat(Infinity).filter(Boolean));
const POINTS = ['Tarefa técnica: adquirir a imagem.', 'Confirme a identidade.'];

describe('KeyPointsList', () => {
    it('cada ponto com termo mostra termo e texto separados', () => {
        const view = render(<KeyPointsList points={POINTS} />);
        expect(view.getByText('Tarefa técnica')).toBeTruthy();
        expect(view.getByText('Adquirir a imagem.')).toBeTruthy();
        expect(flat(view.getByText('Tarefa técnica').props.style).color).toBe(galaxyColors.textPrimary);
        expect(flat(view.getByText('Adquirir a imagem.').props.style).color).toBe(galaxyColors.textSecondary);
    });

    it('ponto sem termo mostra o texto inteiro, em textPrimary', () => {
        const view = render(<KeyPointsList points={POINTS} />);
        expect(flat(view.getByText('Confirme a identidade.').props.style).color).toBe(galaxyColors.textPrimary);
    });

    it('as peças são numeradas a partir de 1', () => {
        const view = render(<KeyPointsList points={POINTS} />);
        expect(view.getByText('1', { includeHiddenElements: true })).toBeTruthy();
        expect(view.getByText('2', { includeHiddenElements: true })).toBeTruthy();
        expect(view.queryByText('0', { includeHiddenElements: true })).toBeNull();
    });

    it('o número tem teto de escala e cabe na face da peça (29 pt) no texto máximo', () => {
        const view = render(<KeyPointsList points={POINTS} />);
        const number = view.getByText('1', { includeHiddenElements: true });
        const { fontSize } = flat(number.props.style);
        expect(number.props.maxFontSizeMultiplier).toBeGreaterThan(1);
        expect(fontSize * number.props.maxFontSizeMultiplier).toBeLessThanOrEqual(29);
    });

    it('cada bloco é um nó acessível lido como "1. Termo: texto"', () => {
        const view = render(<KeyPointsList points={POINTS} />);
        const blocos = view.getAllByTestId('lesson-key-point');
        expect(blocos.map((b) => b.props.accessibilityLabel)).toEqual([
            '1. Tarefa técnica: Adquirir a imagem.',
            '2. Confirme a identidade.',
        ]);
        expect(blocos.every((b) => b.props.accessible === true)).toBe(true);
    });

    it('não há marcador de lista em caractere', () => {
        const view = render(<KeyPointsList points={POINTS} />);
        expect(view.queryByText(/^[•·\-–—*]/u)).toBeNull();
    });

    it('a peça usa o azul de ação, com o lábio do botão galaxy, para o número branco passar de 4,5:1', () => {
        const view = render(<KeyPointsList points={POINTS} />);
        // Sobe da árvore composta: o primeiro fundo é o da face, o seguinte (diferente) é o da peça.
        const fills: unknown[] = [];
        for (let node: any = view.getByText('1', { includeHiddenElements: true }); node; node = node.parent) {
            const fill = flat(node.props.style).backgroundColor;
            if (fill && fill !== fills[fills.length - 1]) fills.push(fill);
        }
        expect(fills.slice(0, 2)).toEqual([semanticColors.galaxy.actionPrimary, medalColors.unit.lip]);
    });
});
