import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/renderWithProviders';
import WelcomeFlowScreen from './WelcomeFlowScreen';

describe('Rever apresentação', () => {
    it('não grava estado ao ser revista: quem chama decide o que fazer no fim', () => {
        const onFinish = jest.fn();
        renderWithProviders(<WelcomeFlowScreen onFinish={onFinish} />);

        fireEvent.press(screen.getByLabelText('Pular apresentação'));

        // A tela é apresentação pura: o único efeito é o callback. É isso que
        // permite montá-la no gate (que grava) e em Progresso (que não grava).
        expect(onFinish).toHaveBeenCalledTimes(1);
        expect(onFinish).toHaveBeenCalledWith('skipped', 1);
    });
});
