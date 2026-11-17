import React from 'react';
import { render } from '@testing-library/react-native';
import { TeachStepRenderer } from './TeachStepRenderer';
import { galaxyColors } from '../../../ui/theme';

const flat = (style: unknown) => Object.assign({}, ...[style].flat(Infinity).filter(Boolean));

describe('TeachStepRenderer', () => {
    it('não mostra "Ideia-chave"', () => {
        const view = render(<TeachStepRenderer payload={{ title: 'O pedido', body: 'Primeira. Segunda.' }} />);
        expect(view.queryByText(/Ideia-chave/u)).toBeNull();
        expect(view.getByText('O pedido')).toBeTruthy();
    });

    it('a frase de abertura usa textPrimary e o resto usa textSecondary', () => {
        const view = render(<TeachStepRenderer payload={{ title: 'O pedido', body: 'Primeira frase. Segunda frase, mais longa.' }} />);
        expect(flat(view.getByText('Primeira frase.').props.style).color).toBe(galaxyColors.textPrimary);
        expect(flat(view.getByText('Segunda frase, mais longa.').props.style).color).toBe(galaxyColors.textSecondary);
        expect(flat(view.getByText('O pedido').props.style).color).toBe(galaxyColors.textPrimary);
    });

    it('texto de uma frase só não desenha o segundo parágrafo', () => {
        const view = render(<TeachStepRenderer payload={{ title: 'O pedido', body: 'Só uma frase.' }} />);
        expect(view.getByText('Só uma frase.')).toBeTruthy();
        expect(view.getAllByText(/./u)).toHaveLength(2);
    });
});
