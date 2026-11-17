import React from 'react';
import { render } from '@testing-library/react-native';
import { KeyPointsList } from './KeyPointsList';
import { galaxyColors } from '../../../ui/theme';

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
});
