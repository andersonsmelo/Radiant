import React from 'react';
import { StyleSheet, View } from 'react-native';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { WelcomeSlide } from './WelcomeSlide';

jest.mock('../../../ui/accessibility/motionLaunchArgument', () => ({ isReduceMotionForcedByLaunchArgument: () => true }));

describe('WelcomeSlide — apresentação da bancada', () => {
    it('apresenta o Pixel numa linha sem grupo acessível que esconda o conteúdo seguinte', () => {
        renderWithProviders(<WelcomeSlide />);
        expect(screen.getByText('Oi, eu sou o Pixel. Vamos tirar sua primeira radiografia.')).toBeTruthy();
        expect(screen.getByRole('image', { name: 'Pixel acenando' })).toBeTruthy();
        expect(screen.queryByLabelText(/Tela \d de/)).toBeNull();
        expect(screen.getByText('Oi, eu sou o Pixel. Vamos tirar sua primeira radiografia.').props.numberOfLines).toBeUndefined();
    });
    it('texto grande usa métricas naturais e não comprime verticalmente a fala empilhada', () => {
        const dimensions = jest.spyOn(require('react-native'), 'useWindowDimensions').mockReturnValue({ width: 320, height: 568, scale: 2, fontScale: 3.1 });
        try {
            const result = renderWithProviders(<WelcomeSlide />);
            const text = screen.getByText('Oi, eu sou o Pixel. Vamos tirar sua primeira radiografia.');
            const style = StyleSheet.flatten(text.props.style);
            // Esses são os valores reais entregues ao Text nativo, não métricas
            // duplicadas em props de teste. Rasterização continua no gate nativo.
            expect(style.fontFamily).toBe('Sora-Bold');
            expect(style.fontSize).toBe(16);
            expect(style.lineHeight).toBeUndefined();
            expect(style.flexShrink).toBe(0);
            expect(text.props.allowFontScaling).not.toBe(false);
            expect(text.props.maxFontSizeMultiplier).toBeUndefined();
            const column = result.UNSAFE_getAllByType(View).find(view => StyleSheet.flatten(view.props.style)?.flexDirection === 'column');
            expect(StyleSheet.flatten(column?.props.style).alignItems).toBe('stretch');
        } finally { dimensions.mockRestore(); }
    });

});
