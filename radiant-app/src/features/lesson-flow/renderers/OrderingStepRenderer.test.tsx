import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { encodeInteractionIdSequence } from './InteractionAnswerValue';
import { OrderingStepRenderer } from './OrderingStepRenderer';
import { ActivityInteractionRenderer } from './ActivityRendererRegistry';

const payload = {
    prompt: 'Ordene o procedimento.',
    items: [
        { id: 'identificar', label: 'Confirmar identificação' },
        { id: 'posicionar', label: 'Posicionar o paciente' },
        { id: 'expor', label: 'Realizar a exposição' },
    ],
    correctOrder: ['identificar', 'posicionar', 'expor'],
};

jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

describe('OrderingStepRenderer', () => {
    it('locks every ordering control after confirmation through the real registry', () => {
        const onChange = jest.fn();
        const view = render(<ActivityInteractionRenderer interaction={{
            id: 'order:pc06e', type: 'ordering', competencyIds: ['competency:pc06e'],
            evidenceKind: 'guided-practice', criticalSafety: false, completionRule: 'answered',
            accessibility: { label: 'Ordenação' }, feedback: { correct: 'Conferido', incorrect: 'Rever' }, payload,
        }} value={encodeInteractionIdSequence(payload.correctOrder)} onChange={onChange} submitted
            confirmationLabel="Confirmar resposta" />);
        const controls = view.getAllByRole('button');
        controls.forEach(control => {
            expect(control).toBeDisabled();
            expect(control.props.accessibilityState.disabled).toBe(true);
            fireEvent.press(control);
        });
        expect(onChange).not.toHaveBeenCalled();
    });
    it('reordena com botões acessíveis de subir e descer', () => {
        const onChange = jest.fn();
        const { getByLabelText } = render(
            <OrderingStepRenderer payload={payload} value={undefined} onChange={onChange} />,
        );

        fireEvent.press(getByLabelText('Subir Posicionar o paciente'));

        expect(onChange).toHaveBeenCalledWith(
            encodeInteractionIdSequence(['posicionar', 'identificar', 'expor']),
        );
    });

    it('permite selecionar a ordem inicial e usa alvos de ao menos 44 pt', () => {
        const onChange = jest.fn();
        const { getByLabelText } = render(
            <OrderingStepRenderer payload={payload} value={undefined} onChange={onChange} />,
        );

        const selectOrder = getByLabelText('Selecionar esta ordem');
        fireEvent.press(selectOrder);

        expect(onChange).toHaveBeenCalledWith(encodeInteractionIdSequence(payload.items.map((item) => item.id)));
        expect(StyleSheet.flatten(selectOrder.props.style).minHeight).toBeGreaterThanOrEqual(44);
        expect(getByLabelText('Subir Confirmar identificação').props.accessibilityState.disabled).toBe(true);
        expect(getByLabelText('Descer Realizar a exposição').props.accessibilityState.disabled).toBe(true);
    });

    it('mostra como desabilitadas todas as setas depois de conferir, não só as das pontas', () => {
        const value = encodeInteractionIdSequence(payload.items.map((item) => item.id));
        const { getByLabelText } = render(
            <OrderingStepRenderer payload={payload} value={value} onChange={jest.fn()} submitted />,
        );

        for (const item of payload.items) {
            for (const action of ['Subir', 'Descer']) {
                const control = getByLabelText(`${action} ${item.label}`);
                expect(control.props.accessibilityState.disabled).toBe(true);
                expect(StyleSheet.flatten(control.props.style).opacity).toBeLessThan(1);
            }
        }
    });

    it('empilha as setas abaixo do texto em escala alta, sem estreitar a coluna do rótulo', () => {
        const dimensions = jest.spyOn(require('react-native'), 'useWindowDimensions');
        const rowOf = (fontScale: number) => {
            dimensions.mockReturnValue({ width: 402, height: 874, scale: 3, fontScale });
            const { getByText, unmount } = render(
                <OrderingStepRenderer payload={payload} value={undefined} onChange={jest.fn()} />,
            );
            const label = StyleSheet.flatten(getByText('Confirmar identificação').props.style);
            const row = StyleSheet.flatten(getByText('Confirmar identificação').parent?.parent?.props.style);
            unmount();
            return { direction: row.flexDirection, labelFlex: label.flex };
        };
        try {
            expect(rowOf(1)).toEqual({ direction: 'row', labelFlex: 1 });
            // flex: 1 numa coluna sem altura definida colapsaria o rótulo.
            expect(rowOf(3.1)).toEqual({ direction: 'column', labelFlex: 0 });
        } finally {
            dimensions.mockRestore();
        }
    });
});
