import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import type { LearningInteractionV2 } from '../../../types/learningActivity';
import { ActivityInteractionRenderer } from './ActivityRendererRegistry';
import { isCorrectInteractionValue } from './InteractionAnswerValue';

jest.mock('../../../ui/accessibility/useReducedMotionPreference', () => ({
    ...jest.requireActual('../../../ui/accessibility/useReducedMotionPreference'),
    useReducedMotionPreference: () => true,
    useReducedMotionPreferenceState: () => ({ reducedMotionEnabled: true, resolved: true }),
}));
jest.mock('../../../ui/useScreenFocused', () => ({ useScreenFocused: () => true }));

const label: LearningInteractionV2 = {
    id: 'lb', type: 'label', competencyIds: ['competency:test'], evidenceKind: 'guided-practice', completionRule: 'confirmed',
    criticalSafety: false, feedback: { correct: 'Certo.', incorrect: 'Reveja.' }, accessibility: { label: 'Rotular a imagem: tubo' },
    payload: {
        prompt: 'Rotule as partes do tubo.', imageRef: 'diagram:tubo-raios-x',
        points: [
            { id: 'p1', x: 0.28, y: 0.44, correctLabelId: 'l-catodo' },
            { id: 'p2', x: 0.72, y: 0.44, correctLabelId: 'l-anodo' },
            { id: 'p3', x: 0.68, y: 0.71, correctLabelId: 'l-janela' },
        ],
        labels: [{ id: 'l-janela', label: 'Janela' }, { id: 'l-fio', label: 'Fio' }, { id: 'l-catodo', label: 'Cátodo' }, { id: 'l-anodo', label: 'Ânodo' }],
    },
};

function Harness({ submitted = false, initial }: { submitted?: boolean; initial?: string }) {
    const [value, setValue] = useState<string | undefined>(initial);
    const { Text } = jest.requireActual('react-native');
    return <>
        <ActivityInteractionRenderer interaction={label} value={value} onChange={setValue} submitted={submitted} />
        <Text testID="probe">{`${value ?? ''}|${isCorrectInteractionValue(label, value)}`}</Text>
    </>;
}
const probe = () => String(screen.getByTestId('probe').props.children);
const measure = () => fireEvent(screen.getByTestId('interaction-figure'), 'layout', { nativeEvent: { layout: { x: 0, y: 0, width: 280, height: 210 } } });

describe('LabelStepRenderer', () => {
    it('está registrado e mostra um ponto numerado por alvo e uma ficha por rótulo, inclusive o distrator', () => {
        render(<Harness />);
        expect(screen.getByLabelText('Ponto 1, sem rótulo')).toBeTruthy();
        expect(screen.getByLabelText('Ponto 3, sem rótulo')).toBeTruthy();
        for (const name of ['Janela', 'Fio', 'Cátodo', 'Ânodo']) expect(screen.getByTestId(`label-chip-${name}`)).toBeTruthy();
    });

    it('ficha e depois ponto rotula; ponto e depois ficha também', () => {
        render(<Harness />);
        fireEvent.press(screen.getByTestId('label-chip-Cátodo'));
        expect(screen.getByTestId('label-chip-Cátodo').props.accessibilityState.selected).toBe(true);
        fireEvent.press(screen.getByLabelText('Ponto 1, sem rótulo'));
        expect(probe()).toBe('{"p1":"l-catodo"}|false');
        fireEvent.press(screen.getByLabelText('Ponto 2, sem rótulo'));
        expect(screen.getByLabelText('Ponto 2, sem rótulo').props.accessibilityState.selected).toBe(true);
        fireEvent.press(screen.getByTestId('label-chip-Ânodo'));
        expect(probe()).toBe('{"p1":"l-catodo","p2":"l-anodo"}|false');
        fireEvent.press(screen.getByLabelText('Ponto 3, sem rótulo'));
        fireEvent.press(screen.getByTestId('label-chip-Janela'));
        expect(probe()).toBe('{"p1":"l-catodo","p2":"l-anodo","p3":"l-janela"}|true');
    });

    it('a ficha colocada sai do banco, e tocar no ponto rotulado a devolve', () => {
        render(<Harness initial='{"p2":"l-anodo"}' />);
        expect(screen.queryByTestId('label-chip-Ânodo')).toBeNull();
        expect(screen.getByLabelText('Ponto 2, rótulo Ânodo')).toBeTruthy();
        fireEvent.press(screen.getByLabelText('Ponto 2, rótulo Ânodo'));
        expect(probe()).toBe('{}|false');
        expect(screen.getByLabelText('Ponto 2, sem rótulo')).toBeTruthy();
        expect(screen.getByTestId('label-chip-Ânodo').props.accessibilityState.selected).toBe(true);
    });

    it('o ponto tem papel de botão e alvo de 44 pt centrado no ponto, dentro da figura', () => {
        render(<Harness />);
        measure();
        const point = screen.getByLabelText('Ponto 2, sem rótulo');
        expect(point.props.accessibilityRole).toBe('button');
        const style = StyleSheet.flatten(point.props.style);
        expect(style.width).toBe(44);
        expect(style.height).toBe(44);
        expect(style.left).toBeCloseTo(0.72 * 280 - 22);
        expect(style.top).toBeCloseTo(0.44 * 210 - 22);
    });

    it('depois de conferir, cada ponto diz certo ou errado com ícone, o rótulo certo e não aceita toque', () => {
        render(<Harness submitted initial='{"p1":"l-catodo","p2":"l-fio","p3":"l-janela"}' />);
        expect(screen.getByLabelText('Ponto 1, rótulo Cátodo, certo')).toBeTruthy();
        const wrong = screen.getByLabelText('Ponto 2, rótulo Fio, errado; o rótulo certo é Ânodo');
        expect(wrong.props.accessibilityState.disabled).toBe(true);
        expect(screen.getAllByTestId('label-point-verdict-correct', { includeHiddenElements: true })).toHaveLength(2);
        expect(screen.getAllByTestId('label-point-verdict-incorrect', { includeHiddenElements: true })).toHaveLength(1);
        fireEvent.press(wrong);
        expect(probe()).toBe('{"p1":"l-catodo","p2":"l-fio","p3":"l-janela"}|false');
        expect(screen.queryByTestId('label-chip-Fio')).toBeNull();
    });

    it('a figura leva o rótulo da interação, e não a descrição do diagrama, que entrega as partes', () => {
        render(<Harness />);
        expect(screen.getByLabelText('Rotular a imagem: tubo')).toBeTruthy();
    });
});
