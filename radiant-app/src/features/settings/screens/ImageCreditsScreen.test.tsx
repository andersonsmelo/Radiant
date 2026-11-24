import React from 'react';
import { Linking } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import ImageCreditsScreen from './ImageCreditsScreen';
import { RTG_FIGURE_CREDITS, RTG_IMAGES } from '../../student-checkpoints/batches/rtgImages';

jest.mock('expo-router', () => ({ router: { back: jest.fn() } }));
jest.mock('react-native-safe-area-context', () => {
    const { View } = jest.requireActual('react-native');
    return { SafeAreaView: View };
});

describe('ImageCreditsScreen', () => {
    it('mostra autor e licença de cada imagem da trilha', () => {
        expect(RTG_IMAGES.length).toBeGreaterThan(0);
        render(<ImageCreditsScreen />);
        expect(screen.getByRole('header', { name: 'Créditos das imagens' })).toBeTruthy();
        for (const image of RTG_IMAGES) {
            expect(screen.getAllByText(new RegExp(`Autoria: ${image.author}`)).length).toBeGreaterThan(0);
            expect(screen.getAllByText(new RegExp(`Licença: ${image.license.replace(/\./g, '\\.')}`)).length).toBeGreaterThan(0);
        }
        expect(screen.getAllByRole('link')).toHaveLength(2 * (RTG_IMAGES.length + RTG_FIGURE_CREDITS.length));
    });

    it('credita a arte de terceiros das figuras desenhadas', () => {
        expect(RTG_FIGURE_CREDITS.length).toBeGreaterThan(0);
        render(<ImageCreditsScreen />);
        for (const figure of RTG_FIGURE_CREDITS) {
            expect(screen.getAllByText(new RegExp(`Autoria: ${figure.author.replace(/[()]/g, '\\$&')}`)).length).toBeGreaterThan(0);
            expect(screen.getAllByText(`Licença: ${figure.license}`).length).toBeGreaterThan(0);
        }
    });

    it('liga cada ilustração ao texto da licença dela', () => {
        const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
        render(<ImageCreditsScreen />);
        RTG_FIGURE_CREDITS.forEach((figure, index) => {
            fireEvent.press(screen.getByRole('link', { name: `Abrir a licença da ilustração ${index + 1}` }));
            expect(open).toHaveBeenLastCalledWith(figure.licenseUrl);
        });
        open.mockRestore();
    });
});
