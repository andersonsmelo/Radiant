import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
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
});
