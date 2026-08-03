import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/renderWithProviders';
import WelcomeFlowScreen from './WelcomeFlowScreen';

describe('WelcomeFlowScreen', () => {
    it('abre na apresentação do Pixel', () => {
        renderWithProviders(<WelcomeFlowScreen onFinish={jest.fn()} />);

        expect(screen.getByText('Oi, eu sou o Pixel.')).toBeTruthy();
    });

    it('avança pelas três telas até o botão Começar', () => {
        renderWithProviders(<WelcomeFlowScreen onFinish={jest.fn()} />);

        fireEvent.press(screen.getByLabelText('Continuar'));
        expect(screen.getByText('Trilha, quiz e revisão.')).toBeTruthy();

        fireEvent.press(screen.getByLabelText('Continuar'));
        expect(screen.getByText('Funciona offline, sem conta.')).toBeTruthy();
        expect(screen.getByLabelText('Começar')).toBeTruthy();
    });

    it('mostra o disclaimer educacional na última tela', () => {
        renderWithProviders(<WelcomeFlowScreen onFinish={jest.fn()} />);

        fireEvent.press(screen.getByLabelText('Continuar'));
        fireEvent.press(screen.getByLabelText('Continuar'));

        expect(
            screen.getByText(
                'Radiant é um app educacional. Não substitui avaliação, diagnóstico ou conduta médica profissional.'
            )
        ).toBeTruthy();
    });

    it('conclui com o motivo completed no passo 3', () => {
        const onFinish = jest.fn();
        renderWithProviders(<WelcomeFlowScreen onFinish={onFinish} />);

        fireEvent.press(screen.getByLabelText('Continuar'));
        fireEvent.press(screen.getByLabelText('Continuar'));
        fireEvent.press(screen.getByLabelText('Começar'));

        expect(onFinish).toHaveBeenCalledWith('completed', 3);
    });

    it('pula da primeira tela registrando o passo 1', () => {
        const onFinish = jest.fn();
        renderWithProviders(<WelcomeFlowScreen onFinish={onFinish} />);

        fireEvent.press(screen.getByLabelText('Pular apresentação'));

        expect(onFinish).toHaveBeenCalledWith('skipped', 1);
    });

    it('pula da segunda tela registrando o passo 2', () => {
        // A primeira e a terceira ja estavam cobertas, e o passo reportado e
        // `index + 1` sem ramo proprio — mas era exatamente essa aritmetica que
        // ficava sem asserção no meio, onde um off-by-one nao aparece nas pontas.
        const onFinish = jest.fn();
        renderWithProviders(<WelcomeFlowScreen onFinish={onFinish} />);

        fireEvent.press(screen.getByLabelText('Continuar'));
        fireEvent.press(screen.getByLabelText('Pular apresentação'));

        expect(onFinish).toHaveBeenCalledWith('skipped', 2);
    });

    it('pula da última tela registrando o passo 3', () => {
        const onFinish = jest.fn();
        renderWithProviders(<WelcomeFlowScreen onFinish={onFinish} />);

        fireEvent.press(screen.getByLabelText('Continuar'));
        fireEvent.press(screen.getByLabelText('Continuar'));
        fireEvent.press(screen.getByLabelText('Pular apresentação'));

        expect(onFinish).toHaveBeenCalledWith('skipped', 3);
    });

    it('expõe o disclaimer educacional para tecnologia assistiva na última tela', () => {
        renderWithProviders(<WelcomeFlowScreen onFinish={jest.fn()} />);

        fireEvent.press(screen.getByLabelText('Continuar'));
        fireEvent.press(screen.getByLabelText('Continuar'));

        const group = screen.getByLabelText(/Tela 3 de 3/);
        expect(group.props.accessibilityLabel).toContain(
            'Radiant é um app educacional. Não substitui avaliação, diagnóstico ou conduta médica profissional.'
        );
    });

    it('avisa cada tela vista, para a telemetria medir onde a pessoa sai', () => {
        const onStepViewed = jest.fn();
        renderWithProviders(<WelcomeFlowScreen onFinish={jest.fn()} onStepViewed={onStepViewed} />);

        expect(onStepViewed).toHaveBeenCalledWith(1);

        fireEvent.press(screen.getByLabelText('Continuar'));
        expect(onStepViewed).toHaveBeenCalledWith(2);
    });
});
