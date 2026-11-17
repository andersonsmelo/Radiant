import React from 'react';
import { AccessibilityInfo, Animated, StyleSheet } from 'react-native';
import { fireEvent, render, screen, within } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { feedbackColors } from '../../../ui/theme';
import { space } from '../../../ui/styles';
import { AnswerFeedbackSheet, feedbackSheetMaxHeight, revealOffset } from './AnswerFeedbackSheet';

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
        expect(screen.getByRole('header', { name: 'Resposta incorreta. Vamos reforçar' })).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Continuar' })).toBeTruthy();
    });

    it('o título tem rótulo próprio para o leitor, sem mudar o texto visível', () => {
        const view = render(<AnswerFeedbackSheet correct message="a" actionLabel="Continuar" onAction={jest.fn()} />);
        expect(screen.getByRole('header', { name: 'Resposta correta' })).toBeTruthy();
        expect(screen.getByText('Resposta correta')).toBeTruthy();
        view.rerender(<AnswerFeedbackSheet correct={false} message="a" actionLabel="Continuar" onAction={jest.fn()} />);
        expect(screen.getByRole('header', { name: 'Resposta incorreta. Vamos reforçar' })).toBeTruthy();
        expect(screen.getByText('Vamos reforçar')).toBeTruthy();
    });

    it('heartLost mostra "Menos 1 vida"', () => {
        const view = render(<AnswerFeedbackSheet correct={false} message="a" actionLabel="Continuar" onAction={jest.fn()} />);
        expect(screen.queryByText('Menos 1 vida')).toBeNull();

        view.rerender(<AnswerFeedbackSheet correct={false} heartLost message="a" actionLabel="Continuar" onAction={jest.fn()} />);
        expect(within(screen.getByTestId('lesson-item-feedback')).getByText('Menos 1 vida')).toBeTruthy();
        expect(screen.getByRole('header', { name: 'Resposta incorreta. Vamos reforçar' })).toBeTruthy();
    });

    it('a vida perdida diz ao leitor de tela quantas restam, quando a tela sabe', () => {
        const view = render(<AnswerFeedbackSheet correct={false} heartLost heartsLeft={{ current: 3, max: 5 }} message="a" actionLabel="Continuar" onAction={jest.fn()} />);
        const aviso = () => screen.getByTestId('lesson-feedback-heart-loss-group');
        expect(aviso().props.accessible).toBe(true);
        expect(aviso().props.accessibilityLabel).toContain('Restam 3 de 5');
        // O texto visível continua o mesmo.
        expect(within(aviso()).getByText('Menos 1 vida')).toBeTruthy();

        view.rerender(<AnswerFeedbackSheet correct={false} heartLost message="a" actionLabel="Continuar" onAction={jest.fn()} />);
        expect(aviso().props.accessibilityLabel).toBe('Você perdeu uma vida.');
        expect(aviso().props.accessibilityLabel).not.toContain('Restam');
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

    it('entra sempre pelo gancho da base: 220 ms sem a chave, 150 ms com ela', () => {
        const view = render(<AnswerFeedbackSheet correct message="a" actionLabel="Continuar" onAction={jest.fn()} />);
        expect(timing.mock.calls.length).toBeGreaterThan(0);
        for (const [, config] of timing.mock.calls) expect(config.duration).toBe(220);
        view.unmount();

        timing.mockClear();
        render(<AnswerFeedbackSheet rich correct message="a" actionLabel="Continuar" onAction={jest.fn()} />);
        expect(timing.mock.calls.length).toBeGreaterThan(0);
        for (const [, config] of timing.mock.calls) expect(config.duration).toBe(150);
    });

    it.each([false, true])('sob "Reduzir movimento" aparece no lugar, visível (rich=%s)', (rich) => {
        mockReducedMotion = true;
        render(<AnswerFeedbackSheet rich={rich} correct message="a" actionLabel="Continuar" onAction={jest.fn()} />);
        expect(timing).not.toHaveBeenCalled();
        expect(StyleSheet.flatten(screen.getByTestId('lesson-item-feedback').props.style).opacity).toBe(1);
        expect(screen.getByText('Resposta correta')).toBeTruthy();
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

    // Tarefa 11: sobrava uma faixa do fundo da aula abaixo da folha. A cor dela
    // vai até a borda da tela, e o inset da área segura vira padding interno.
    it('a superfície vai até a borda de baixo e o padding inferior inclui o inset da área segura', () => {
        const metrics = { frame: { x: 0, y: 0, width: 402, height: 874 }, insets: { top: 0, left: 0, right: 0, bottom: 34 } };
        render(
            <SafeAreaProvider initialMetrics={metrics}>
                <AnswerFeedbackSheet correct={false} message="a" actionLabel="Continuar" onAction={jest.fn()} />
            </SafeAreaProvider>,
        );
        const folha = StyleSheet.flatten(screen.getByTestId('lesson-item-feedback').props.style);
        expect(folha.position).toBe('absolute');
        expect(folha.bottom).toBe(0);
        expect(folha.paddingBottom).toBe(space.s3 + 34);
        // Validade: o botão continua dentro da folha, acima do indicador de início.
        expect(within(screen.getByTestId('lesson-item-feedback')).getByRole('button', { name: 'Continuar' })).toBeTruthy();
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

    describe('revealOffset: quanto rolar para a alternativa escolhida ficar acima da folha', () => {
        // Janela de rolagem de 600 pt, folha de 240: sobram 360 visíveis.
        const base = { scrollY: 0, viewportHeight: 600, sheetHeight: 240, margin: 12 };

        it('alternativa já visível acima da folha não rola', () => {
            expect(revealOffset({ ...base, top: 100, bottom: 160 })).toBeNull();
        });

        it('alternativa sob a folha rola o mínimo para o fim dela encostar na folha, com a margem', () => {
            // Fim em 500 + 12 de margem, menos os 360 visíveis.
            expect(revealOffset({ ...base, top: 440, bottom: 500 })).toBe(152);
            const depois = revealOffset({ ...base, top: 440, bottom: 500 })!;
            // Validade: depois de rolar, a alternativa inteira está entre o topo e a folha.
            expect(440).toBeGreaterThanOrEqual(depois);
            expect(500 + 12).toBeLessThanOrEqual(depois + 600 - 240);
        });

        it('alternativa acima do topo visível volta até ela', () => {
            expect(revealOffset({ ...base, scrollY: 300, top: 200, bottom: 260 })).toBe(188);
        });

        it('alternativa mais alta que a área visível mostra o começo dela', () => {
            expect(revealOffset({ ...base, top: 100, bottom: 600 })).toBe(88);
        });

        it('nunca rola para antes do início', () => {
            expect(revealOffset({ ...base, scrollY: 50, top: 4, bottom: 60 })).toBe(0);
        });
    });
});

