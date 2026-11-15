import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import type { LessonDialogue } from '../../../types/learningActivity';
import { DialogueScene, dialogueLineLabel, visibleDialogueLines } from './DialogueScene';

let mockReducedMotion = false;
jest.mock('../../../ui/accessibility/useReducedMotionPreference', () => ({
    useReducedMotionPreference: () => mockReducedMotion,
    useReducedMotionPreferenceState: () => ({ reducedMotionEnabled: mockReducedMotion, resolved: true }),
}));

const CENA: LessonDialogue = {
    setting: 'Sala de exames, início do plantão.',
    lines: [
        { speaker: 'lia', text: 'Antes de posicionar, confira o pedido.' },
        { speaker: 'paciente', name: 'Seu Antônio', text: 'Vai demorar muito, doutora?' },
        { speaker: 'pixel', text: 'Repare em como ela responde.' },
    ],
};

const falasLidas = () => screen.getAllByTestId('dialogue-line').map((fala) => fala.props.accessibilityLabel);

describe('DialogueScene', () => {
    let timing: jest.SpyInstance;

    beforeEach(() => {
        mockReducedMotion = false;
        timing = jest.spyOn(Animated, 'timing');
    });

    afterEach(() => timing.mockRestore());

    it('abre com o cenário e só a primeira fala, e diz em texto quantas faltam', () => {
        render(<DialogueScene dialogue={CENA} visibleCount={1} />);

        expect(screen.getByText('Sala de exames, início do plantão.')).toBeTruthy();
        expect(falasLidas()).toEqual(['Profa. Lia: Antes de posicionar, confira o pedido.']);
        expect(screen.queryByText('Vai demorar muito, doutora?')).toBeNull();
        expect(screen.getByText('Fala 1 de 3')).toBeTruthy();
    });

    it('revela uma fala de cada vez, e as anteriores continuam na tela', () => {
        const view = render(<DialogueScene dialogue={CENA} visibleCount={1} />);
        view.rerender(<DialogueScene dialogue={CENA} visibleCount={2} />);

        expect(falasLidas()).toEqual([
            'Profa. Lia: Antes de posicionar, confira o pedido.',
            'Seu Antônio: Vai demorar muito, doutora?',
        ]);
        expect(screen.getByText('Fala 2 de 3')).toBeTruthy();
    });

    it('o leitor de tela lê as falas na ordem escrita, cada uma com o nome de quem fala (foco 3)', () => {
        render(<DialogueScene dialogue={CENA} visibleCount={3} />);

        expect(falasLidas()).toEqual([
            'Profa. Lia: Antes de posicionar, confira o pedido.',
            'Seu Antônio: Vai demorar muito, doutora?',
            'Pixel: Repare em como ela responde.',
        ]);
        // Cada fala é um nó só; o retrato não é anunciado de novo ao lado dela.
        for (const fala of screen.getAllByTestId('dialogue-line')) expect(fala.props.accessible).toBe(true);
        expect(screen.queryByLabelText('Profa. Lia, supervisora de estágio')).toBeNull();
        expect(screen.queryByLabelText('Seu Antônio, paciente')).toBeNull();
        expect(screen.queryByLabelText('Pixel, guia de estudo')).toBeNull();
        // Com todas as falas na tela, a contagem some: o botão volta a avançar o passo.
        expect(screen.queryByText(/^Fala \d+ de \d+$/u)).toBeNull();
    });

    it('o nome de quem fala também está escrito, não só no rótulo do leitor de tela', () => {
        render(<DialogueScene dialogue={CENA} visibleCount={3} />);

        expect(screen.getByText('Profa. Lia')).toBeTruthy();
        expect(screen.getByText('Seu Antônio')).toBeTruthy();
        expect(screen.getByText('Pixel')).toBeTruthy();
    });

    it('com movimento, cada fala entra animada em 220 ms', () => {
        render(<DialogueScene dialogue={CENA} visibleCount={2} />);

        expect(timing).toHaveBeenCalled();
        for (const [, config] of timing.mock.calls) expect(config.duration).toBe(220);
    });

    it('com "Reduzir movimento", as falas aparecem no lugar, sem animação (foco 5)', () => {
        mockReducedMotion = true;
        render(<DialogueScene dialogue={CENA} visibleCount={3} />);

        expect(timing).not.toHaveBeenCalled();
        expect(falasLidas()).toHaveLength(3);
        for (const fala of screen.getAllByTestId('dialogue-line')) {
            expect(StyleSheet.flatten(fala.props.style).opacity).toBe(1);
        }
    });

    it('com texto ampliado nada é cortado: sem teto de fonte, sem limite de linhas, sem altura fixa', () => {
        render(<DialogueScene dialogue={CENA} visibleCount={3} />);

        for (const texto of ['Sala de exames, início do plantão.', 'Seu Antônio', 'Vai demorar muito, doutora?']) {
            const node = screen.getByText(texto);
            expect(node.props.maxFontSizeMultiplier).toBeUndefined();
            expect(node.props.numberOfLines).toBeUndefined();
            const style = StyleSheet.flatten(node.props.style);
            expect(style.height).toBeUndefined();
            expect(style.lineHeight).toBeUndefined();
        }
    });

    it('cada retrato mostra a expressão que a fala pede: afirmação neutra, paciente que pergunta preocupado', () => {
        render(<DialogueScene dialogue={CENA} visibleCount={3} />);

        const rostos = screen.getAllByTestId(/^cast-face-/u, { includeHiddenElements: true }).map((rosto) => rosto.props.testID);
        // Lia afirma; o paciente pergunta. O Pixel não tem rosto do elenco: a tela dele é outra.
        expect(rostos).toEqual(['cast-face-neutro', 'cast-face-preocupado']);
    });

    it('quem é da equipe e pergunta fica pensativo, não preocupado', () => {
        render(<DialogueScene dialogue={{ lines: [{ speaker: 'duda', text: 'Então quanto mais, melhor?' }] }} visibleCount={1} />);

        expect(screen.getByTestId('cast-face-pensativo', { includeHiddenElements: true })).toBeTruthy();
    });

    it('a Dona da cena ganha o retrato dela, não o do senhor grisalho', () => {
        render(<DialogueScene dialogue={{ lines: [{ speaker: 'paciente', name: 'Dona Marta', text: 'Tem problema fazer o raio X hoje?' }] }} visibleCount={1} />);

        expect(screen.getByTestId('cast-hair-paciente-dona', { includeHiddenElements: true })).toBeTruthy();
        expect(screen.queryByTestId('cast-hair-paciente', { includeHiddenElements: true })).toBeNull();
    });

    it('a contagem pedida nunca esconde a primeira fala nem passa do fim', () => {
        expect(visibleDialogueLines(CENA, 0)).toHaveLength(1);
        expect(visibleDialogueLines(CENA, 99)).toHaveLength(3);
        expect(dialogueLineLabel({ speaker: 'paciente', text: 'Bom dia.' })).toBe('Paciente: Bom dia.');
    });
});
