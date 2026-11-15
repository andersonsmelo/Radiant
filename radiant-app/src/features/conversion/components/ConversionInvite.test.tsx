import React from 'react';
import { StyleSheet } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { SAMPLE_MINUTES } from '../ConversionService';
import { ConversionInvite } from './ConversionInvite';

jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

describe('ConversionInvite', () => {
    it('vidas esgotadas: diz o que o aluno ganha, sem preço nem urgência, e leva à tela de planos', () => {
        const onLearnMore = jest.fn();
        render(<ConversionInvite moment="hearts-empty" sampleAvailable={false} onLearnMore={onLearnMore} />);
        expect(screen.getByText('Com o Radiant Ilimitado, errar não gasta vida.')).toBeTruthy();
        expect(screen.queryByText(/R\$|grátis por|só hoje|últim|agora ou nunca|desconto/i)).toBeNull();
        const botao = screen.getByRole('button', { name: 'Conhecer o Ilimitado' });
        expect(StyleSheet.flatten(botao.props.style).minHeight).toBeGreaterThanOrEqual(44);
        fireEvent.press(botao);
        expect(onLearnMore).toHaveBeenCalledTimes(1);
        expect(screen.queryByRole('button', { name: /Experimentar/ })).toBeNull();
    });

    it('com amostra disponível, oferece a amostra e diz o que acontece depois dela', () => {
        const onSample = jest.fn();
        render(<ConversionInvite moment="hearts-empty" sampleAvailable onLearnMore={jest.fn()} onSample={onSample} />);
        fireEvent.press(screen.getByRole('button', { name: `Experimentar ${SAMPLE_MINUTES} min sem gastar vidas` }));
        expect(onSample).toHaveBeenCalledTimes(1);
        expect(screen.getByText('Uma vez por aparelho, sem custo. Depois, suas vidas voltam cheias.')).toBeTruthy();
    });

    it('sem quem receba as vidas novas, não oferece a amostra', () => {
        render(<ConversionInvite moment="hearts-empty" sampleAvailable onLearnMore={jest.fn()} />);
        expect(screen.queryByRole('button', { name: /Experimentar/ })).toBeNull();
    });

    it('fim de unidade: uma linha e o link, sem amostra', () => {
        render(<ConversionInvite moment="unit-complete" sampleAvailable onLearnMore={jest.fn()} onSample={jest.fn()} />);
        expect(screen.getByText('Na próxima unidade, com o Radiant Ilimitado, errar não gasta vida.')).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Conhecer o Ilimitado' })).toBeTruthy();
        expect(screen.queryByRole('button', { name: /Experimentar/ })).toBeNull();
    });
});
