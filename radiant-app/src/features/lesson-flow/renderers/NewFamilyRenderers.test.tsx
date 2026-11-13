import React, { useState } from 'react';
import { AccessibilityInfo, StyleSheet } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import type { LearningInteractionV2 } from '../../../types/learningActivity';
import { ActivityInteractionRenderer, isInteractionTypeRegistered } from './ActivityRendererRegistry';
import { isCorrectInteractionValue } from './InteractionAnswerValue';
import { F2_MOTION } from './TapChip';

const base = {
    competencyIds: ['competency:test'], evidenceKind: 'guided-practice' as const, completionRule: 'confirmed' as const,
    criticalSafety: false, feedback: { correct: 'Certo.', incorrect: 'Reveja.' }, accessibility: { label: 'Teste' },
};
const cloze: LearningInteractionV2 = { ...base, id: 'cloze', type: 'cloze', payload: {
    prompt: 'Complete a frase.', segments: ['O ', ' protege o ', '.'],
    blanks: [{ id: 'b1', correctTokenId: 't-avental' }, { id: 'b2', correctTokenId: 't-tronco' }],
    tokens: [{ id: 't-luva', label: 'luva' }, { id: 't-tronco', label: 'tronco' }, { id: 't-avental', label: 'avental' }, { id: 't-olho', label: 'olho' }],
} };
const trueFalse: LearningInteractionV2 = { ...base, id: 'tf', type: 'true-false', payload: { prompt: 'Julgue.', statements: [
    { id: 's1', text: 'A distância reduz a dose.', isTrue: true, explanation: 'Certo: longe da fonte, menos dose.' },
    { id: 's2', text: 'O dosímetro protege.', isTrue: false, explanation: 'Errado: o dosímetro só mede.' },
    { id: 's3', text: 'O avental cobre o tronco.', isTrue: true, explanation: 'Certo: cobre o tronco.' },
] } };
const categorize: LearningInteractionV2 = { ...base, id: 'cat', type: 'categorize', payload: { prompt: 'Classifique.',
    categories: [{ id: 'g1', label: 'Técnica' }, { id: 'g2', label: 'Clínica' }],
    items: [{ id: 'i1', label: 'Posicionar', categoryId: 'g1' }, { id: 'i2', label: 'Laudar', categoryId: 'g2' },
        { id: 'i3', label: 'Colimar', categoryId: 'g1' }, { id: 'i4', label: 'Indicar', categoryId: 'g2' }] } };
const multi: LearningInteractionV2 = { ...base, id: 'ms', type: 'multi-select', payload: { prompt: 'Marque todas.', correctOptionIds: ['b', 'd'],
    options: [{ id: 'a', label: 'Dosímetro' }, { id: 'b', label: 'Distância' }, { id: 'c', label: 'Pressa' }, { id: 'd', label: 'Avental' }] } };

/** O player de verdade guarda o valor fora do renderizador; aqui, o mínimo disso. */
function Harness({ interaction, submitted = false, initial }: { interaction: LearningInteractionV2; submitted?: boolean; initial?: string }) {
    const [value, setValue] = useState<string | undefined>(initial);
    return <>
        <ActivityInteractionRenderer interaction={interaction} value={value} onChange={setValue} submitted={submitted} />
        <ValueProbe value={value} interaction={interaction} />
    </>;
}
function ValueProbe({ value, interaction }: { value?: string; interaction: LearningInteractionV2 }) {
    const { Text } = jest.requireActual('react-native');
    return <Text testID="probe">{`${value ?? ''}|${isCorrectInteractionValue(interaction, value)}`}</Text>;
}
const probe = (screen: ReturnType<typeof render>) => String(screen.getByTestId('probe').props.children);

describe('famílias da 1.6 no tocador', () => {
    it('as quatro famílias estão registradas', () => {
        for (const type of ['cloze', 'true-false', 'categorize', 'multi-select']) expect(isInteractionTypeRegistered(type)).toBe(true);
    });

    it('as durações das microinterações ficam nas faixas pedidas', () => {
        expect(F2_MOTION.press).toBeGreaterThanOrEqual(80); expect(F2_MOTION.press).toBeLessThanOrEqual(120);
        expect(F2_MOTION.confirm).toBeGreaterThanOrEqual(120); expect(F2_MOTION.confirm).toBeLessThanOrEqual(180);
        expect(F2_MOTION.enter).toBeGreaterThanOrEqual(160); expect(F2_MOTION.enter).toBeLessThanOrEqual(240);
    });

    it('cloze: o banco preenche as lacunas em ordem, a lacuna devolve a palavra, e o alvo tem 44 pt', () => {
        const screen = render(<Harness interaction={cloze} />);
        const token = screen.getByLabelText('Usar avental na lacuna 1');
        expect(token.props.accessibilityRole).toBe('button');
        expect(StyleSheet.flatten(token.props.style).minHeight).toBeGreaterThanOrEqual(44);
        fireEvent.press(token);
        fireEvent.press(screen.getByLabelText('Usar luva na lacuna 2'));
        expect(probe(screen)).toBe('["t-avental","t-luva"]|false');
        fireEvent.press(screen.getByLabelText('Lacuna 2: luva'));
        fireEvent.press(screen.getByLabelText('Usar tronco na lacuna 2'));
        expect(probe(screen)).toBe('["t-avental","t-tronco"]|true');
    });

    it('cloze: depois de conferir, a lacuna errada mostra a palavra certa em texto', () => {
        const screen = render(<Harness interaction={cloze} submitted initial='["t-luva","t-tronco"]' />);
        expect(screen.getByText('✗ Lacuna 1: luva (certa: avental)')).toBeTruthy();
        expect(screen.getByText('✓ Lacuna 2: tronco')).toBeTruthy();
    });

    it('true-false: uma afirmação por vez, com retorno imediato e sem voltar atrás', () => {
        const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => undefined);
        const screen = render(<Harness interaction={trueFalse} />);
        expect(screen.queryByText('O dosímetro protege.')).toBeNull();
        fireEvent.press(screen.getByLabelText('Certo: A distância reduz a dose.'));
        expect(screen.getByText('Certo: longe da fonte, menos dose.')).toBeTruthy();
        expect(announce).toHaveBeenLastCalledWith('Acertou. Certo: longe da fonte, menos dose.');
        expect(screen.queryByLabelText('Certo: A distância reduz a dose.')).toBeNull();
        fireEvent.press(screen.getByLabelText('Certo: O dosímetro protege.'));
        expect(announce).toHaveBeenLastCalledWith('Não é isso. Errado: o dosímetro só mede.');
        fireEvent.press(screen.getByLabelText('Certo: O avental cobre o tronco.'));
        expect(probe(screen)).toBe('[true,true,true]|false');
        announce.mockRestore();
    });

    it('categorize: toca no item, depois no grupo; o item colocado volta com um toque', () => {
        const screen = render(<Harness interaction={categorize} />);
        fireEvent.press(screen.getByLabelText('Item: Laudar'));
        expect(screen.getByLabelText('Item: Laudar').props.accessibilityState.selected).toBe(true);
        fireEvent.press(screen.getByLabelText('Colocar Laudar em Clínica'));
        fireEvent.press(screen.getByLabelText('Colocar Posicionar em Técnica'));
        fireEvent.press(screen.getByLabelText('Colocar Colimar em Clínica'));
        fireEvent.press(screen.getByLabelText('Colimar, em Clínica'));
        fireEvent.press(screen.getByLabelText('Colocar Colimar em Técnica'));
        fireEvent.press(screen.getByLabelText('Colocar Indicar em Clínica'));
        expect(probe(screen)).toBe(`${JSON.stringify({ i2: 'g2', i1: 'g1', i3: 'g1', i4: 'g2' })}|true`);
    });

    it('categorize: depois de conferir, o item no grupo errado diz qual é o certo', () => {
        const screen = render(<Harness interaction={categorize} submitted initial={JSON.stringify({ i1: 'g2', i2: 'g2', i3: 'g1', i4: 'g2' })} />);
        expect(screen.getByLabelText('Posicionar, em Clínica, errado; o grupo certo é Técnica')).toBeTruthy();
    });

    it('multi-select: caixas de marcar com estado, e o retorno diz o que faltou e o que sobrou', () => {
        const screen = render(<Harness interaction={multi} />);
        const box = screen.getByLabelText('Distância');
        expect(box.props.accessibilityRole).toBe('checkbox');
        fireEvent.press(box);
        fireEvent.press(screen.getByLabelText('Pressa'));
        expect(screen.getByLabelText('Distância').props.accessibilityState.checked).toBe(true);
        expect(probe(screen)).toBe('["b","c"]|false');
        const after = render(<Harness interaction={multi} submitted initial='["b","c"]' />);
        expect(after.getByText('✗ Avental (faltou marcar)')).toBeTruthy();
        expect(after.getByText('✗ Pressa (marcou a mais)')).toBeTruthy();
        expect(after.getByText('✓ Distância')).toBeTruthy();
    });

    it('depois de conferir, nenhum controle muda a resposta', () => {
        const screen = render(<Harness interaction={multi} submitted initial='["b"]' />);
        fireEvent.press(screen.getByLabelText('Pressa'));
        expect(probe(screen)).toBe('["b"]|false');
    });
});
