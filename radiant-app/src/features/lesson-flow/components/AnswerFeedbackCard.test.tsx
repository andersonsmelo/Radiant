import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { semanticColors } from '../../../ui/semantic-colors';
import { AnswerFeedbackCard } from './AnswerFeedbackCard';

let mockReducedMotion = false;
jest.mock('../../../ui/accessibility/useReducedMotionPreference', () => ({
    useReducedMotionPreference: () => mockReducedMotion,
    useReducedMotionPreferenceState: () => ({ reducedMotionEnabled: mockReducedMotion, resolved: true }),
}));

// O rosto do mascote tem suíte própria; aqui ele só mostra a expressão pedida.
jest.mock('../../../ui/characters/PixelFace', () => {
    const { Text } = require('react-native');
    return { PixelFace: ({ expression }: { expression: string }) => <Text testID="pixel-expression">{expression}</Text> };
});

describe('AnswerFeedbackCard', () => {
    let timing: jest.SpyInstance;

    beforeEach(() => {
        mockReducedMotion = false;
        timing = jest.spyOn(Animated, 'timing');
    });

    afterEach(() => timing.mockRestore());

    it('no acerto, o título diz o resultado e o Pixel comemora', () => {
        render(<AnswerFeedbackCard correct message="Elétrons têm carga negativa." />);

        expect(screen.getByRole('header', { name: 'Resposta correta' })).toBeTruthy();
        expect(screen.getByLabelText('Pixel comemorando o acerto')).toBeTruthy();
        expect(screen.getByTestId('pixel-expression', { includeHiddenElements: true }).props.children).toBe('feliz');
        expect(screen.getByText('Elétrons têm carga negativa.')).toBeTruthy();
        expect(screen.queryByText('Vamos reforçar')).toBeNull();
    });

    it('no erro, o título muda, o Pixel pensa junto e as duas respostas aparecem por escrito', () => {
        render(<AnswerFeedbackCard correct={false} message="Compare as cargas." chosenLabel="Próton" correctLabel="Elétron" />);

        expect(screen.getByRole('header', { name: 'Vamos reforçar' })).toBeTruthy();
        expect(screen.getByLabelText('Pixel pensando com você')).toBeTruthy();
        expect(screen.getByTestId('pixel-expression', { includeHiddenElements: true }).props.children).toBe('pensando');
        expect(screen.getByText('Sua resposta: Próton')).toBeTruthy();
        expect(screen.getByText('Resposta certa: Elétron')).toBeTruthy();
        expect(screen.getByText('Compare as cargas.')).toBeTruthy();
        expect(screen.queryByText('Resposta correta')).toBeNull();
    });

    it('a cor acompanha o resultado, mas não é o único canal: o título em texto difere', () => {
        const view = render(<AnswerFeedbackCard correct message="a" />);
        const certo = StyleSheet.flatten(screen.getByTestId('lesson-item-feedback').props.style);
        expect(certo.borderColor).toBe(semanticColors.galaxy.statusSuccess);
        expect(certo.borderWidth).toBeGreaterThan(0);

        view.rerender(<AnswerFeedbackCard correct={false} message="a" />);
        const errado = StyleSheet.flatten(screen.getByTestId('lesson-item-feedback').props.style);
        expect(errado.borderColor).toBe(semanticColors.galaxy.statusError);
        expect(screen.getByText('Vamos reforçar')).toBeTruthy();
    });

    it('no acerto, mostra a resposta do aluno uma vez só, sem repetir como gabarito', () => {
        render(<AnswerFeedbackCard correct message="Isso." chosenLabel="Elétron" correctLabel="Elétron" />);

        expect(screen.getByText('Sua resposta: Elétron')).toBeTruthy();
        expect(screen.queryByText(/^Resposta certa:/u)).toBeNull();
    });

    it('fora da múltipla escolha, não inventa linhas de resposta', () => {
        render(<AnswerFeedbackCard correct={false} message="Aumente a tensão." />);

        expect(screen.queryByText(/^Sua resposta:/u)).toBeNull();
        expect(screen.queryByText(/^Resposta certa:/u)).toBeNull();
    });

    it('entra animado em 220 ms', () => {
        render(<AnswerFeedbackCard correct message="a" />);

        expect(timing).toHaveBeenCalled();
        for (const [, config] of timing.mock.calls) expect(config.duration).toBe(220);
    });

    it('com "Reduzir movimento", aparece no lugar, sem animação, com o mesmo texto', () => {
        mockReducedMotion = true;
        render(<AnswerFeedbackCard correct={false} message="Compare as cargas." />);

        expect(timing).not.toHaveBeenCalled();
        expect(StyleSheet.flatten(screen.getByTestId('lesson-item-feedback').props.style).opacity).toBe(1);
        expect(screen.getByText('Vamos reforçar')).toBeTruthy();
        expect(screen.getByText('Compare as cargas.')).toBeTruthy();
    });

    describe('retorno rico (F3, ENABLE_RICH_FEEDBACK)', () => {
        const expressao = () => screen.getByTestId('pixel-expression', { includeHiddenElements: true }).props.children;
        const lado = () => StyleSheet.flatten(screen.getByTestId('cast-avatar-pixel').props.style).width;

        it('o acerto que fecha um marco comemora, pelo seletor da F7', () => {
            render(<AnswerFeedbackCard rich correct celebrate message="a" />);
            expect(expressao()).toBe('orgulhoso');
            expect(screen.getByLabelText('Pixel comemorando o acerto')).toBeTruthy();
        });

        it('o acerto comum fica feliz, e o rótulo diz isso', () => {
            render(<AnswerFeedbackCard rich correct message="a" />);
            expect(expressao()).toBe('feliz');
            expect(screen.getByLabelText('Pixel feliz com o acerto')).toBeTruthy();
        });

        it('o erro é acolhimento: preocupado no seletor, desenhado e lido como pensando', () => {
            render(<AnswerFeedbackCard rich correct={false} celebrate message="a" />);
            expect(expressao()).toBe('pensando');
            expect(screen.getByLabelText('Pixel pensando com você')).toBeTruthy();
        });

        it('o retrato do retorno é o médio, de 64 pt', () => {
            render(<AnswerFeedbackCard rich correct message="a" />);
            expect(lado()).toBe(64);
        });

        it('entra em 150 ms, a faixa de confirmar resposta da seção 10', () => {
            render(<AnswerFeedbackCard rich correct message="a" />);
            expect(timing).toHaveBeenCalled();
            for (const [, config] of timing.mock.calls) expect(config.duration).toBe(150);
        });

        it('mostra o incentivo como texto, depois do retorno', () => {
            render(<AnswerFeedbackCard rich correct message="Isso." encouragement="Três seguidas. Você pegou o ritmo." />);
            expect(screen.getByText('Três seguidas. Você pegou o ritmo.')).toBeTruthy();
        });

        it('com "Reduzir movimento", o rico também aparece no lugar, com o incentivo', () => {
            mockReducedMotion = true;
            render(<AnswerFeedbackCard rich correct celebrate message="a" encouragement="Boa retomada." />);
            expect(timing).not.toHaveBeenCalled();
            expect(StyleSheet.flatten(screen.getByTestId('lesson-item-feedback').props.style).opacity).toBe(1);
            expect(screen.getByText('Boa retomada.')).toBeTruthy();
            expect(expressao()).toBe('orgulhoso');
        });

        // Contraprova: sem a chave, as props novas não mudam nada do que se vê.
        it('desligado, ignora marco e incentivo: Pixel da base, 48 pt e 220 ms', () => {
            render(<AnswerFeedbackCard correct celebrate message="a" encouragement="Boa retomada." />);
            expect(expressao()).toBe('feliz');
            expect(screen.getByLabelText('Pixel comemorando o acerto')).toBeTruthy();
            expect(lado()).toBe(48);
            expect(screen.queryByText('Boa retomada.')).toBeNull();
            for (const [, config] of timing.mock.calls) expect(config.duration).toBe(220);
        });
    });

    it('título e texto não têm teto de fonte', () => {
        render(<AnswerFeedbackCard correct message="Elétrons têm carga negativa." />);

        expect(screen.getByText('Resposta correta').props.maxFontSizeMultiplier).toBeUndefined();
        expect(screen.getByText('Elétrons têm carga negativa.').props.maxFontSizeMultiplier).toBeUndefined();
    });
});
