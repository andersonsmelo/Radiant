import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { encodeInteractionIdSequence } from './InteractionAnswerValue';
import { MatchingStepRenderer, matchingDisplayOrder } from './MatchingStepRenderer';
import { semanticColors } from '../../../ui/semantic-colors';

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

        // Com dois pares, escolher o primeiro decide o segundo (achado 5 da prova).
        expect(onChange).toHaveBeenCalledWith(encodeInteractionIdSequence(['kvp', 'mas']));
    });

    // Achado 5 da prova de 2026-11-07.
    describe('quando só resta uma opção', () => {
        const three = {
            prompt: 'Associe.',
            pairs: [...payload.pairs, { id: 'tempo', left: 'Tempo', right: 'Duração da exposição' }],
        };

        it('o último par se completa sozinho, sem um toque que não decide nada', () => {
            const onChange = jest.fn();
            const { getByLabelText } = render(
                <MatchingStepRenderer payload={three} value={encodeInteractionIdSequence(['kvp'])} onChange={onChange} />,
            );
            fireEvent.press(getByLabelText('Associar mAs a Quantidade de fótons'));
            expect(onChange).toHaveBeenCalledWith(encodeInteractionIdSequence(['kvp', 'mas', 'tempo']));
        });

        it('desfazer a partir do fim volta à última escolha de verdade', () => {
            const onChange = jest.fn();
            const { getByLabelText } = render(
                <MatchingStepRenderer payload={three} value={encodeInteractionIdSequence(['kvp', 'mas', 'tempo'])} onChange={onChange} />,
            );
            fireEvent.press(getByLabelText('Desfazer última associação'));
            expect(onChange).toHaveBeenCalledWith(encodeInteractionIdSequence(['kvp']));
        });
    });

    it('os pares escolhidos não usam a cor de acerto antes da conferência', () => {
        const { getByText } = render(
            <MatchingStepRenderer payload={payload} value={encodeInteractionIdSequence(['mas', 'kvp'])} onChange={jest.fn()} />,
        );
        // O par está errado; verde aqui diria o contrário.
        const pair = StyleSheet.flatten(getByText('kVp: Quantidade de fótons').props.style);
        const done = StyleSheet.flatten(getByText('Todas as associações foram selecionadas.').props.style);
        expect(pair.color).not.toBe(semanticColors.galaxy.statusSuccess);
        expect(done.color).not.toBe(semanticColors.galaxy.statusSuccess);
    });

    it('avança para o próximo par e mantém controles com 44 pt', () => {
        const { getByLabelText, getByText } = render(
            <MatchingStepRenderer
                payload={payload}
                value={encodeInteractionIdSequence(['kvp'])}
                onChange={jest.fn()}
            />,
        );

        expect(getByText('kVp: Penetração do feixe')).toBeTruthy();
        expect(getByText('Agora associe: mAs')).toBeTruthy();
        const next = getByLabelText('Associar mAs a Quantidade de fótons');
        expect(StyleSheet.flatten(next.props.style).minHeight).toBeGreaterThanOrEqual(44);
    });

    describe('ordem de exibição da coluna da direita', () => {
        const pairs = ['a', 'b', 'c', 'd'].map((id) => ({ id, left: `Termo ${id}`, right: `Definição ${id}` }));

        it('nunca repete a ordem dos pares, e continua contendo todas as opções', () => {
            for (const sample of [pairs, pairs.slice(0, 2), [...pairs].reverse(), payload.pairs]) {
                const shown = matchingDisplayOrder(sample);
                expect(shown.map((pair) => pair.id).sort()).toEqual(sample.map((pair) => pair.id).sort());
                expect(shown.map((pair) => pair.id)).not.toEqual(sample.map((pair) => pair.id));
            }
        });

        it('a resposta certa não é sempre o primeiro botão da tela', () => {
            const firstIsCorrect = pairs.map((pair, step) => {
                const value = encodeInteractionIdSequence(pairs.slice(0, step).map((done) => done.id));
                const { getAllByRole } = render(
                    <MatchingStepRenderer payload={{ prompt: 'Associe.', pairs }} value={value} onChange={jest.fn()} />,
                );
                return getAllByRole('button')[0].props.accessibilityLabel === `Associar ${pair.left} a ${pair.right}`;
            });
            expect(firstIsCorrect).toContain(false);
            expect(firstIsCorrect.slice(0, -1).every(Boolean)).toBe(false);
        });
    });
});
