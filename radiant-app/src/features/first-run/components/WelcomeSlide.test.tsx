import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { WelcomeSlide } from './WelcomeSlide';

describe('WelcomeSlide', () => {
    it('compõe o rótulo do grupo com posição, título e corpo, na ordem', () => {
        renderWithProviders(
            <WelcomeSlide
                title="Oi, eu sou o Pixel."
                body="Vou estudar radiologia com você, em sessões curtas e no seu ritmo."
                pixelSize="lg"
                pixelAccessibilityLabel="Pixel, o mascote do Radiant, acenando"
                stepLabel="Tela 1 de 3"
            />
        );

        const group = screen.getByLabelText(/Tela 1 de 3/);
        const label = group.props.accessibilityLabel as string;

        expect(label).toContain('Tela 1 de 3');
        expect(label).toContain('Oi, eu sou o Pixel.');
        expect(label).toContain('Vou estudar radiologia com você, em sessões curtas e no seu ritmo.');

        expect(label.indexOf('Tela 1 de 3')).toBeLessThan(label.indexOf('Oi, eu sou o Pixel.'));
        expect(label.indexOf('Oi, eu sou o Pixel.')).toBeLessThan(
            label.indexOf('Vou estudar radiologia com você, em sessões curtas e no seu ritmo.')
        );
    });

    it('inclui a nota de rodapé no rótulo quando ela existe', () => {
        renderWithProviders(
            <WelcomeSlide
                title="Funciona offline, sem conta."
                body="Seu progresso fica no seu aparelho. Comece agora, sem cadastro."
                footnote="Radiant é um app educacional. Não substitui avaliação, diagnóstico ou conduta médica profissional."
                pixelSize="md"
                pixelAccessibilityLabel="Pixel pronto para começar"
                stepLabel="Tela 3 de 3"
            />
        );

        const group = screen.getByLabelText(/Tela 3 de 3/);
        const label = group.props.accessibilityLabel as string;

        expect(label).toContain(
            'Radiant é um app educacional. Não substitui avaliação, diagnóstico ou conduta médica profissional.'
        );
        expect(label.indexOf('Seu progresso fica no seu aparelho. Comece agora, sem cadastro.')).toBeLessThan(
            label.indexOf(
                'Radiant é um app educacional. Não substitui avaliação, diagnóstico ou conduta médica profissional.'
            )
        );
    });

    it('sem nota de rodapé, não deixa separador solto nem "undefined" no rótulo', () => {
        renderWithProviders(
            <WelcomeSlide
                title="Trilha, quiz e revisão."
                body="Você segue uma trilha guiada, responde quizzes curtos, e o que ainda não fixou volta na hora certa para revisar."
                pixelSize="md"
                pixelAccessibilityLabel="Pixel apontando para a trilha de estudo"
                stepLabel="Tela 2 de 3"
            />
        );

        const group = screen.getByLabelText(/Tela 2 de 3/);
        const label = group.props.accessibilityLabel as string;

        expect(label).not.toContain('undefined');
        expect(label.endsWith('. ')).toBe(false);
        expect(label.trim().endsWith('.')).toBe(true);
    });
});
