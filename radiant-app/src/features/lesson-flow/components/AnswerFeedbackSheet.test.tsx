import React from 'react';
import { AccessibilityInfo, Animated, StyleSheet } from 'react-native';
import { fireEvent, render, screen, within } from '@testing-library/react-native';
import { feedbackColors } from '../../../ui/theme';
import { AnswerFeedbackSheet, feedbackSheetMaxHeight } from './AnswerFeedbackSheet';

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

// O coração do aviso de vida é vetor animado, com suíte própria.
jest.mock('../../../ui/components/HudIcons', () => ({ HeartIcon: () => null }));

jest.mock('../../../ui/feedback/haptics', () => ({ hapticTap: jest.fn() }));

const face = () => StyleSheet.flatten(within(screen.getByTestId('lesson-item-feedback')).getByTestId('app-button-face').props.style);
const expressao = () => screen.getByTestId('pixel-expression', { includeHiddenElements: true }).props.children;

describe('AnswerFeedbackSheet', () => {
    let timing: jest.SpyInstance;

    beforeEach(() => {
        mockReducedMotion = false;
        timing = jest.spyOn(Animated, 'timing');
    });

    afterEach(() => timing.mockRestore());

    it('acerto usa a variante success e erro usa error no botão', () => {
        const view = render(<AnswerFeedbackSheet correct message="a" actionLabel="Continuar" onAction={jest.fn()} />);
        expect(face().backgroundColor).toBe(feedbackColors.success.fill);
        expect(StyleSheet.flatten(screen.getByTestId('lesson-item-feedback').props.style).backgroundColor).toBe(feedbackColors.success.surface);

        view.rerender(<AnswerFeedbackSheet correct={false} message="a" actionLabel="Continuar" onAction={jest.fn()} />);
        expect(face().backgroundColor).toBe(feedbackColors.error.fill);
        const errado = StyleSheet.flatten(screen.getByTestId('lesson-item-feedback').props.style);
        expect(errado.backgroundColor).toBe(feedbackColors.error.surface);
        expect(errado.borderTopColor).toBe(feedbackColors.error.lip);
        expect(errado.borderTopWidth).toBe(2);
        // A cor não vai sozinha: o título em texto diz o resultado.
        expect(screen.getByRole('header', { name: 'Vamos reforçar' })).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Continuar' })).toBeTruthy();
    });

    it('heartLost mostra "Menos 1 vida"', () => {
        const view = render(<AnswerFeedbackSheet correct={false} message="a" actionLabel="Continuar" onAction={jest.fn()} />);
        expect(screen.queryByText('Menos 1 vida')).toBeNull();

        view.rerender(<AnswerFeedbackSheet correct={false} heartLost message="a" actionLabel="Continuar" onAction={jest.fn()} />);
        expect(within(screen.getByTestId('lesson-item-feedback')).getByText('Menos 1 vida')).toBeTruthy();
        expect(screen.getByRole('header', { name: 'Vamos reforçar' })).toBeTruthy();
    });

    it('correctLabel aparece como "Resposta certa: …" só no erro', () => {
        const view = render(<AnswerFeedbackSheet correct={false} correctLabel="Segundo; Primeiro" message="a" actionLabel="Continuar" onAction={jest.fn()} />);
        expect(screen.getByText('Resposta certa: Segundo; Primeiro')).toBeTruthy();

        view.rerender(<AnswerFeedbackSheet correct correctLabel="Segundo; Primeiro" message="a" actionLabel="Continuar" onAction={jest.fn()} />);
        expect(screen.queryByText(/^Resposta certa:/u)).toBeNull();
        expect(screen.getByText('a')).toBeTruthy();
        // A folha nunca escreve a resposta do aluno: as alternativas já mostram.
        expect(screen.queryByText(/^Sua resposta:/u)).toBeNull();
    });

    it('sem rich, não chama a animação de entrada com duração', () => {
        render(<AnswerFeedbackSheet correct message="a" actionLabel="Continuar" onAction={jest.fn()} />);
        expect(timing).not.toHaveBeenCalled();
        // Aparece no lugar, visível.
        expect(StyleSheet.flatten(screen.getByTestId('lesson-item-feedback').props.style).opacity ?? 1).toBe(1);
        expect(screen.getByText('Resposta correta')).toBeTruthy();
    });

    it('com rich, sobe na faixa de confirmar resposta (150 ms), e sob "Reduzir movimento" aparece no lugar', () => {
        const view = render(<AnswerFeedbackSheet rich correct message="a" actionLabel="Continuar" onAction={jest.fn()} />);
        expect(timing).toHaveBeenCalled();
        for (const [, config] of timing.mock.calls) expect(config.duration).toBe(150);
        view.unmount();

        timing.mockClear();
        mockReducedMotion = true;
        render(<AnswerFeedbackSheet rich correct message="a" actionLabel="Continuar" onAction={jest.fn()} />);
        expect(timing).not.toHaveBeenCalled();
        expect(StyleSheet.flatten(screen.getByTestId('lesson-item-feedback').props.style).opacity).toBe(1);
    });

    it('o botão chama onAction uma vez', () => {
        const onAction = jest.fn();
        render(<AnswerFeedbackSheet correct message="a" actionLabel="Concluir e voltar" onAction={onAction} />);
        fireEvent.press(screen.getByRole('button', { name: 'Concluir e voltar' }));
        expect(onAction).toHaveBeenCalledTimes(1);
    });

    it('o botão fica fora da área que rola, e a altura máxima é dois terços da janela', () => {
        render(<AnswerFeedbackSheet correct message="a" actionLabel="Continuar" onAction={jest.fn()} />);
        const corpo = screen.getByTestId('lesson-item-feedback-body');
        expect(within(corpo).queryByRole('button', { name: 'Continuar' })).toBeNull();
        expect(within(screen.getByTestId('lesson-item-feedback')).getByRole('button', { name: 'Continuar' })).toBeTruthy();
        expect(feedbackSheetMaxHeight(900)).toBe(600);
    });

    it('mede a própria altura para a tela', () => {
        const onHeightChange = jest.fn();
        render(<AnswerFeedbackSheet correct message="a" actionLabel="Continuar" onAction={jest.fn()} onHeightChange={onHeightChange} />);
        fireEvent(screen.getByTestId('lesson-item-feedback'), 'layout', { nativeEvent: { layout: { x: 0, y: 0, width: 390, height: 212 } } });
        expect(onHeightChange).toHaveBeenCalledWith(212);
    });

    it('ao aparecer, o foco do leitor de tela vai para o título, uma vez', () => {
        const focus = jest.spyOn(AccessibilityInfo, 'setAccessibilityFocus');
        const handle = jest.spyOn(require('react-native'), 'findNodeHandle').mockReturnValue(77);
        try {
            render(<AnswerFeedbackSheet correct={false} message="a" actionLabel="Continuar" onAction={jest.fn()} />);
            const layout = { nativeEvent: { layout: { x: 0, y: 0, width: 300, height: 30 } } };
            fireEvent(screen.getByText('Vamos reforçar'), 'layout', layout);
            fireEvent(screen.getByText('Vamos reforçar'), 'layout', layout);
            expect(focus).toHaveBeenCalledTimes(1);
            expect(focus).toHaveBeenCalledWith(77);
        } finally {
            focus.mockRestore();
            handle.mockRestore();
        }
    });

    describe('Pixel do retorno', () => {
        it('sem rich, base: feliz no acerto, pensando no erro, retrato de 48 pt, sem incentivo', () => {
            const view = render(<AnswerFeedbackSheet correct celebrate message="a" encouragement="Boa retomada." actionLabel="Continuar" onAction={jest.fn()} />);
            expect(expressao()).toBe('feliz');
            expect(screen.getByLabelText('Pixel comemorando o acerto')).toBeTruthy();
            expect(StyleSheet.flatten(screen.getByTestId('cast-avatar-pixel').props.style).width).toBe(48);
            expect(screen.queryByText('Boa retomada.')).toBeNull();

            view.rerender(<AnswerFeedbackSheet correct={false} message="a" actionLabel="Continuar" onAction={jest.fn()} />);
            expect(expressao()).toBe('pensando');
            expect(screen.getByLabelText('Pixel pensando com você')).toBeTruthy();
        });

        it('com rich: o marco comemora, o retrato é o médio e o incentivo aparece', () => {
            render(<AnswerFeedbackSheet rich correct celebrate message="a" encouragement="Três seguidas. Você pegou o ritmo." actionLabel="Continuar" onAction={jest.fn()} />);
            expect(expressao()).toBe('orgulhoso');
            expect(StyleSheet.flatten(screen.getByTestId('cast-avatar-pixel').props.style).width).toBe(64);
            expect(screen.getByText('Três seguidas. Você pegou o ritmo.')).toBeTruthy();
        });

        it('com rich, o acerto comum fica feliz e o rótulo diz isso', () => {
            render(<AnswerFeedbackSheet rich correct message="a" actionLabel="Continuar" onAction={jest.fn()} />);
            expect(expressao()).toBe('feliz');
            expect(screen.getByLabelText('Pixel feliz com o acerto')).toBeTruthy();
        });
    });

    it('título e texto não têm teto de fonte', () => {
        render(<AnswerFeedbackSheet correct message="Elétrons têm carga negativa." actionLabel="Continuar" onAction={jest.fn()} />);
        expect(screen.getByText('Resposta correta').props.maxFontSizeMultiplier).toBeUndefined();
        expect(screen.getByText('Elétrons têm carga negativa.').props.maxFontSizeMultiplier).toBeUndefined();
    });
});
