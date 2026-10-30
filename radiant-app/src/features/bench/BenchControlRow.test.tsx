import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';

import type { BenchControl } from '../../types/learningActivity';
import { BenchControlRow } from './BenchControlRow';

// A linha de controle da bancada: rótulo, valor, o Slider e os botões − e +.
// O Slider nativo não é o único caminho: quem não consegue arrastar usa os
// botões de 48 dp ou as ações `increment` e `decrement` do leitor de tela, e os
// três têm de chegar ao mesmo valor.

const KV: BenchControl = { id: 'kv', label: 'Tensão', unit: 'kV', min: 40, max: 120, step: 10, initial: 70 };

// O Slider fica escondido do leitor de tela (quem fala é a linha "ajustável").
const HIDDEN = { includeHiddenElements: true };

function Harness({
    control = KV,
    initial = 70,
    onChange,
    onPreview,
    disabled,
}: {
    control?: BenchControl;
    initial?: number;
    onChange: (next: number) => void;
    onPreview?: (next: number | null) => void;
    disabled?: boolean;
}) {
    const [value, setValue] = useState(initial);
    return (
        <BenchControlRow
            control={control}
            value={value}
            disabled={disabled}
            onPreview={onPreview}
            onChange={(next) => {
                onChange(next);
                setValue(next);
            }}
        />
    );
}

function action(name: 'increment' | 'decrement') {
    return { nativeEvent: { actionName: name } };
}

describe('BenchControlRow', () => {
    it('mostra o rótulo e o valor com a unidade', () => {
        const { getByText } = render(<Harness onChange={jest.fn()} />);

        expect(getByText('Tensão')).toBeTruthy();
        expect(getByText('70 kV')).toBeTruthy();
    });

    it('sobe de passo em passo ao tocar + três vezes, e o rótulo acompanha', () => {
        const onChange = jest.fn();
        const { getByLabelText, getByText } = render(<Harness onChange={onChange} />);

        fireEvent.press(getByLabelText('Aumentar Tensão'));
        fireEvent.press(getByLabelText('Aumentar Tensão'));
        fireEvent.press(getByLabelText('Aumentar Tensão'));

        expect(onChange.mock.calls.map(([next]) => next)).toEqual([80, 90, 100]);
        expect(getByText('100 kV')).toBeTruthy();
    });

    it('desce de passo em passo ao tocar − e o rótulo acompanha', () => {
        const onChange = jest.fn();
        const { getByLabelText, getByText } = render(<Harness onChange={onChange} />);

        fireEvent.press(getByLabelText('Diminuir Tensão'));
        fireEvent.press(getByLabelText('Diminuir Tensão'));

        expect(onChange.mock.calls.map(([next]) => next)).toEqual([60, 50]);
        expect(getByText('50 kV')).toBeTruthy();
    });

    it('as ações increment e decrement do leitor de tela fazem o mesmo que + e −', () => {
        const onChange = jest.fn();
        const { getByLabelText, getByText } = render(<Harness onChange={onChange} />);
        const adjustable = getByLabelText('Tensão');

        fireEvent(adjustable, 'accessibilityAction', action('increment'));
        fireEvent(adjustable, 'accessibilityAction', action('increment'));
        fireEvent(adjustable, 'accessibilityAction', action('increment'));
        expect(onChange.mock.calls.map(([next]) => next)).toEqual([80, 90, 100]);
        expect(getByText('100 kV')).toBeTruthy();

        fireEvent(adjustable, 'accessibilityAction', action('decrement'));
        expect(onChange).toHaveBeenLastCalledWith(90);
    });

    it('expõe a linha como ajustável, com o valor e a faixa para o leitor de tela', () => {
        const { getByLabelText } = render(<Harness onChange={jest.fn()} />);
        const adjustable = getByLabelText('Tensão');

        expect(adjustable.props.accessibilityRole).toBe('adjustable');
        expect(adjustable.props.accessibilityValue).toEqual({ min: 40, max: 120, now: 70, text: '70 kV' });
        expect(adjustable.props.accessibilityActions).toEqual([
            { name: 'increment' },
            { name: 'decrement' },
        ]);
    });

    it('os botões − e + têm alvo de ao menos 48 dp', () => {
        const { getByLabelText } = render(<Harness onChange={jest.fn()} />);

        for (const label of ['Aumentar Tensão', 'Diminuir Tensão']) {
            const style = StyleSheet.flatten(getByLabelText(label).props.style);
            expect(style.minWidth).toBeGreaterThanOrEqual(48);
            expect(style.minHeight).toBeGreaterThanOrEqual(48);
        }
    });

    it('nunca passa do máximo: em 120, + não muda nada, e 115 vai a 120, não a 125', () => {
        const atMax = jest.fn();
        const first = render(<Harness initial={120} onChange={atMax} />);
        fireEvent.press(first.getByLabelText('Aumentar Tensão'));
        fireEvent(first.getByLabelText('Tensão'), 'accessibilityAction', action('increment'));
        expect(atMax).not.toHaveBeenCalled();
        expect(first.getByLabelText('Aumentar Tensão').props.accessibilityState.disabled).toBe(true);
        first.unmount();

        const nearMax = jest.fn();
        const second = render(<Harness initial={115} onChange={nearMax} />);
        fireEvent.press(second.getByLabelText('Aumentar Tensão'));
        expect(nearMax).toHaveBeenCalledTimes(1);
        expect(nearMax).toHaveBeenCalledWith(120);
    });

    it('nunca passa do mínimo: em 40, − não muda nada, e 45 vai a 40, não a 35', () => {
        const atMin = jest.fn();
        const first = render(<Harness initial={40} onChange={atMin} />);
        fireEvent.press(first.getByLabelText('Diminuir Tensão'));
        fireEvent(first.getByLabelText('Tensão'), 'accessibilityAction', action('decrement'));
        expect(atMin).not.toHaveBeenCalled();
        expect(first.getByLabelText('Diminuir Tensão').props.accessibilityState.disabled).toBe(true);
        first.unmount();

        const nearMin = jest.fn();
        const second = render(<Harness initial={45} onChange={nearMin} />);
        fireEvent.press(second.getByLabelText('Diminuir Tensão'));
        expect(nearMin).toHaveBeenCalledWith(40);
    });

    it('o arrasto é limitado à faixa mesmo com um valor bruto absurdo', () => {
        const onChange = jest.fn();
        const { getByTestId } = render(<Harness onChange={onChange} />);
        const slider = getByTestId('bench-slider-kv', HIDDEN);

        fireEvent(slider, 'valueChange', 999);
        expect(onChange).toHaveBeenLastCalledWith(120);

        fireEvent(slider, 'valueChange', -5);
        expect(onChange).toHaveBeenLastCalledWith(40);
    });

    it('o arrasto atualiza a prévia a cada valor, mas sobe onChange só quando muda de passo', () => {
        const onChange = jest.fn();
        const onPreview = jest.fn();
        const { getByTestId } = render(<Harness onChange={onChange} onPreview={onPreview} />);
        const slider = getByTestId('bench-slider-kv', HIDDEN);

        // 71 e 73 ainda arredondam para 70, o passo corrente: nada sobe.
        fireEvent(slider, 'valueChange', 71);
        fireEvent(slider, 'valueChange', 73);
        expect(onPreview.mock.calls.map(([raw]) => raw)).toEqual([71, 73]);
        expect(onChange).not.toHaveBeenCalled();

        // 76 arredonda para 80: cruzou o passo.
        fireEvent(slider, 'valueChange', 76);
        expect(onPreview).toHaveBeenLastCalledWith(76);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(80);

        // Ao soltar, a prévia some e a imagem volta ao valor do passo.
        fireEvent(slider, 'slidingComplete', 76);
        expect(onPreview).toHaveBeenLastCalledWith(null);
    });

    it('desativado, nem o arrasto, nem os botões, nem as ações mudam o valor', () => {
        const onChange = jest.fn();
        const { getByLabelText, getByTestId } = render(<Harness onChange={onChange} disabled />);

        fireEvent.press(getByLabelText('Aumentar Tensão'));
        fireEvent.press(getByLabelText('Diminuir Tensão'));
        fireEvent(getByLabelText('Tensão'), 'accessibilityAction', action('increment'));
        fireEvent(getByTestId('bench-slider-kv', HIDDEN), 'valueChange', 100);

        expect(onChange).not.toHaveBeenCalled();
        expect(getByLabelText('Tensão').props.accessibilityState.disabled).toBe(true);
    });
    it('texto máximo deixa label e valor crescerem em coluna sem teto de parágrafo', () => {
        const dimensions = jest.spyOn(require('react-native'), 'useWindowDimensions').mockReturnValue({ width: 320, height: 568, scale: 2, fontScale: 3.1 });
        try {
            const result = render(<Harness onChange={jest.fn()} />);
            const label = result.getByText('Tensão');
            const value = result.getByText('70 kV');
            for (const text of [label, value]) {
                const style = StyleSheet.flatten(text.props.style);
                expect(style.lineHeight).toBeUndefined();
                expect(style.flexShrink).toBe(0);
                expect(text.props.numberOfLines).toBeUndefined();
                expect(text.props.allowFontScaling).not.toBe(false);
                expect(text.props.maxFontSizeMultiplier).toBeUndefined();
            }
            const header = result.UNSAFE_getAllByType(View).find(view => StyleSheet.flatten(view.props.style)?.justifyContent === 'space-between');
            expect(StyleSheet.flatten(header?.props.style).flexDirection).toBe('column');
            expect(StyleSheet.flatten(header?.props.style).alignItems).toBe('stretch');
            fireEvent.press(result.getByLabelText('Aumentar Tensão'));
            expect(result.getByText('80 kV')).toBeTruthy();
        } finally { dimensions.mockRestore(); }
    });

    it('texto máximo conserva alvo mínimo48 e deixa os símbolos crescerem sem altura fixa', () => {
        const dimensions = jest.spyOn(require('react-native'), 'useWindowDimensions').mockReturnValue({ width: 320, height: 568, scale: 2, fontScale: 3.1 });
        try {
            const result = render(<Harness onChange={jest.fn()} />);
            for (const symbol of ['−', '+']) {
                const text = result.getByText(symbol);
                expect(StyleSheet.flatten(text.props.style).lineHeight).toBeUndefined();
                expect(text.props.allowFontScaling).not.toBe(false);
                expect(text.props.maxFontSizeMultiplier).toBeUndefined();
            }
            for (const name of ['Diminuir Tensão', 'Aumentar Tensão']) {
                const style = StyleSheet.flatten(result.getByLabelText(name).props.style);
                expect(style.minHeight).toBeGreaterThanOrEqual(48);
                expect(style.minWidth).toBeGreaterThanOrEqual(48);
                expect(style.height).toBeUndefined();
                expect(style.maxHeight).toBeUndefined();
            }
        } finally { dimensions.mockRestore(); }
    });

});
