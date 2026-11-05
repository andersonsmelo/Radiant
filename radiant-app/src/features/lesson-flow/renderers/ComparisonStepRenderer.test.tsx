import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { Image, StyleSheet } from 'react-native';
import { ComparisonStepRenderer } from './ComparisonStepRenderer';

const payload = {
    prompt: 'Qual imagem representa a melhor colimação?',
    options: [
        { id: 'a', label: 'Campo amplo' },
        { id: 'b', label: 'Campo restrito à região de interesse' },
    ],
    correctOptionId: 'b',
};

describe('ComparisonStepRenderer', () => {
    it('não depende de cor: mostra texto e estado acessível da seleção', () => {
        const { getByLabelText, getByText } = render(
            <ComparisonStepRenderer payload={payload} selectedOptionId="b" onSelect={jest.fn()} />,
        );

        expect(getByText(/Selecionada/)).toBeTruthy();
        expect(getByLabelText('Campo restrito à região de interesse').props.accessibilityState.selected).toBe(true);
        expect(getByLabelText('Campo amplo').props.accessibilityState.selected).toBe(false);
    });

    it('permite trocar a opção e mantém alvo mínimo de 44 pt', () => {
        const onSelect = jest.fn();
        const { getByLabelText } = render(
            <ComparisonStepRenderer payload={payload} selectedOptionId={undefined} onSelect={onSelect} />,
        );

        const option = getByLabelText('Campo amplo');
        fireEvent.press(option);

        expect(onSelect).toHaveBeenCalledWith('a');
        expect(StyleSheet.flatten(option.props.style).minHeight).toBeGreaterThanOrEqual(44);
    });

    it('não herda o tamanho intrínseco do asset local, que cortava o diagrama no aparelho', () => {
        const resolved = { source: 999, width: 800, height: 1000 };
        const { UNSAFE_getAllByType } = render(
            <ComparisonStepRenderer
                payload={{ ...payload, options: payload.options.map(option => ({ ...option, imageRef: 'local-diagram' })) }}
                onSelect={jest.fn()}
                resolveImageSource={() => resolved}
            />,
        );

        for (const image of UNSAFE_getAllByType(Image)) {
            // Image.ios.js monta [{ width, height }, styles.base, props.style] com o tamanho do asset.
            const merged = StyleSheet.flatten([{ width: resolved.width, height: resolved.height }, image.props.style]);
            expect(merged.width).toBe('100%');
            expect(merged.height).toBeUndefined();
            expect(merged.aspectRatio).toBe(0.8);
            expect(image.props.resizeMode).toBe('contain');
        }
    });
});
