import React from 'react';
import { render, screen } from '@testing-library/react-native';
import ImageCreditsScreen from './ImageCreditsScreen';
import { RTG_IMAGES } from '../../student-checkpoints/batches/rtgImages';

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
        expect(screen.getAllByRole('link')).toHaveLength(RTG_IMAGES.length);
    });
});
