import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { encodeInteractionIdSequence } from './InteractionAnswerValue';
import { MatchingStepRenderer } from './MatchingStepRenderer';

const payload = {
    prompt: 'Associe o parâmetro ao efeito principal.',
    pairs: [
        { id: 'kvp', left: 'kVp', right: 'Penetração do feixe' },
        { id: 'mas', left: 'mAs', right: 'Quantidade de fótons' },
    ],
};

describe('MatchingStepRenderer', () => {
    it('forma pares por seleção sequencial, sem exigir arraste', () => {
        const onChange = jest.fn();
        const { getByLabelText, queryByText } = render(
            <MatchingStepRenderer payload={payload} value={undefined} onChange={onChange} />,
        );

        const choice = getByLabelText('Associar kVp a Penetração do feixe');
        expect(queryByText('Agora associe: kVp')).toBeTruthy();
        expect(choice.props.onLongPress).toBeUndefined();
        fireEvent.press(choice);

        expect(onChange).toHaveBeenCalledWith(encodeInteractionIdSequence(['kvp']));
    });

    it('avança para o próximo par e mantém controles com 44 pt', () => {
        const { getByLabelText, getByText } = render(
            <MatchingStepRenderer
                payload={payload}
                value={encodeInteractionIdSequence(['kvp'])}
                onChange={jest.fn()}
            />,
        );

        expect(getByText('kVp — Penetração do feixe')).toBeTruthy();
        expect(getByText('Agora associe: mAs')).toBeTruthy();
        const next = getByLabelText('Associar mAs a Quantidade de fótons');
        expect(StyleSheet.flatten(next.props.style).minHeight).toBeGreaterThanOrEqual(44);
    });
});
