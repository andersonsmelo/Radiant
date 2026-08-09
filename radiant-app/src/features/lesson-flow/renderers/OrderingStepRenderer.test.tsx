import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { encodeInteractionIdSequence } from './InteractionAnswerValue';
import { OrderingStepRenderer } from './OrderingStepRenderer';

const payload = {
    prompt: 'Ordene o procedimento.',
    items: [
        { id: 'identificar', label: 'Confirmar identificação' },
        { id: 'posicionar', label: 'Posicionar o paciente' },
        { id: 'expor', label: 'Realizar a exposição' },
    ],
    correctOrder: ['identificar', 'posicionar', 'expor'],
};

describe('OrderingStepRenderer', () => {
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
});
