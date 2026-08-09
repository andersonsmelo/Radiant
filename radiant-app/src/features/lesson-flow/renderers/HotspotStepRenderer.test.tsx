import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { HotspotStepRenderer } from './HotspotStepRenderer';

const payload = {
    prompt: 'Onde está o detector?',
    imageRef: 'asset://xray-beam.png',
    regions: [
        { id: 'source', label: 'Fonte de raios X', x: 0.34, y: 0.04, width: 0.32, height: 0.28 },
        { id: 'detector', label: 'Detector plano', x: 0.13, y: 0.72, width: 0.74, height: 0.22 },
    ],
    correctRegionIds: ['detector'],
};

describe('HotspotStepRenderer', () => {
    it('oferece toque na imagem e seleção textual equivalente', () => {
        const onSelect = jest.fn();
        const { getByLabelText } = render(
            <HotspotStepRenderer
                payload={payload}
                accessibilityLabel="Geometria simplificada do feixe de raios X"
                selectedRegionId={undefined}
                onSelect={onSelect}
            />,
        );

        fireEvent.press(getByLabelText('Selecionar Detector plano na imagem'));
        fireEvent.press(getByLabelText('Selecionar Detector plano na lista'));

        expect(onSelect).toHaveBeenNthCalledWith(1, 'detector');
        expect(onSelect).toHaveBeenNthCalledWith(2, 'detector');
    });

    it('expõe seleção por estado e mantém cada alvo com ao menos 44 pt', () => {
        const { getByLabelText } = render(
            <HotspotStepRenderer
                payload={payload}
                accessibilityLabel="Geometria simplificada do feixe de raios X"
                selectedRegionId="detector"
                onSelect={jest.fn()}
            />,
        );

        const target = getByLabelText('Selecionar Detector plano na imagem');
        const textAlternative = getByLabelText('Selecionar Detector plano na lista');
        expect(target.props.accessibilityState.selected).toBe(true);
        expect(StyleSheet.flatten(target.props.style).minWidth).toBeGreaterThanOrEqual(44);
        expect(StyleSheet.flatten(target.props.style).minHeight).toBeGreaterThanOrEqual(44);
        expect(StyleSheet.flatten(textAlternative.props.style).minHeight).toBeGreaterThanOrEqual(44);
    });
});
