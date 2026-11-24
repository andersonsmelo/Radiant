import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import type { LearningInteractionV2 } from '../../../types/learningActivity';
import { ActivityInteractionRenderer } from './ActivityRendererRegistry';
import { isCorrectInteractionValue } from './InteractionAnswerValue';

jest.mock('../../../ui/accessibility/useReducedMotionPreference', () => ({
    ...jest.requireActual('../../../ui/accessibility/useReducedMotionPreference'),
    useReducedMotionPreference: () => true,
    useReducedMotionPreferenceState: () => ({ reducedMotionEnabled: true, resolved: true }),
}));
jest.mock('../../../ui/useScreenFocused', () => ({ useScreenFocused: () => true }));

const risk: LearningInteractionV2 = {
    id: 'rh', type: 'risk-hunt', competencyIds: ['competency:test'], evidenceKind: 'guided-practice', completionRule: 'confirmed',
    criticalSafety: true, feedback: { correct: 'Certo.', incorrect: 'Reveja.' }, accessibility: { label: 'Encontre os riscos: sala de raios X' },
    payload: {
        prompt: 'Marque os riscos da sala.', imageRef: 'diagram:sala-com-riscos', riskRegionIds: ['porta', 'campo'],
        regions: [
            { id: 'porta', label: 'Porta aberta', x: 0.02, y: 0.08, width: 0.15, height: 0.82, explanation: 'A porta aberta expõe o corredor.' },
            { id: 'campo', label: 'Campo grande', x: 0.18, y: 0.26, width: 0.33, height: 0.4, explanation: 'O campo grande expõe tecido à toa.' },
            { id: 'biombo', label: 'Biombo', x: 0.7, y: 0.43, width: 0.17, height: 0.47, explanation: 'O biombo protege o operador.' },
            { id: 'avental', label: 'Avental no suporte', x: 0.85, y: 0.17, width: 0.11, height: 0.24, explanation: 'O avental guardado não expõe ninguém.' },
        ],
    },
};

function Harness({ submitted = false, initial }: { submitted?: boolean; initial?: string }) {
    const [value, setValue] = useState<string | undefined>(initial);
    const { Text } = jest.requireActual('react-native');
    return <>
        <ActivityInteractionRenderer interaction={risk} value={value} onChange={setValue} submitted={submitted} />
        <Text testID="probe">{`${value ?? ''}|${isCorrectInteractionValue(risk, value)}`}</Text>
    </>;
}
const probe = () => String(screen.getByTestId('probe').props.children);
const measure = () => fireEvent(screen.getByTestId('interaction-figure'), 'layout', { nativeEvent: { layout: { x: 0, y: 0, width: 280, height: 210 } } });

describe('RiskHuntStepRenderer', () => {
    it('cada região é um checkbox sobre a figura e na lista, com o rótulo, e o contador começa em zero', () => {
        render(<Harness />);
        for (const name of ['Porta aberta', 'Campo grande', 'Biombo', 'Avental no suporte']) {
            // A região sobre a figura sai da árvore de acessibilidade: a lista é o caminho completo do leitor de tela.
            const onFigure = screen.getByTestId(`risk-region-${name}`, { includeHiddenElements: true });
            expect(onFigure.props.accessibilityElementsHidden).toBe(true);
            expect(onFigure.props.importantForAccessibility).toBe('no-hide-descendants');
            expect(onFigure.props.accessible).toBe(false);
            expect(screen.queryByLabelText(`${name}, na imagem`)).toBeNull();
            expect(screen.getByLabelText(name).props.accessibilityRole).toBe('checkbox');
        }
        expect(screen.getByText('0 marcadas')).toBeTruthy();
    });

    it('marcar pela figura ou pela lista alterna a mesma região, e o contador acompanha', () => {
        render(<Harness />);
        fireEvent.press(screen.getByTestId('risk-region-Porta aberta', { includeHiddenElements: true }));
        expect(probe()).toBe('["porta"]|false');
        expect(screen.getByText('1 marcada')).toBeTruthy();
        expect(screen.getByLabelText('Porta aberta').props.accessibilityState.checked).toBe(true);
        fireEvent.press(screen.getByTestId('risk-hunt-Campo grande'));
        expect(probe()).toBe('["porta","campo"]|true');
        expect(screen.getByText('2 marcadas')).toBeTruthy();
        fireEvent.press(screen.getByLabelText('Porta aberta'));
        expect(probe()).toBe('["campo"]|false');
        expect(screen.getByTestId('risk-region-Porta aberta', { includeHiddenElements: true }).props.accessibilityState.checked).toBe(false);
    });

    it('o alvo sobre a figura passa de 44 pt por hitSlop simétrico e a região marcada ganha borda e marca', () => {
        render(<Harness initial='["avental"]' />);
        measure();
        // Avental: 0,11 x 0,24 de 280 x 210 pt = 30,8 x 50,4 pt; falta ampliar só a largura (6,6 pt de cada lado).
        const small = screen.getByTestId('risk-region-Avental no suporte', { includeHiddenElements: true });
        expect(small.props.hitSlop.left).toBeCloseTo(6.6);
        expect(small.props.hitSlop.right).toBeCloseTo(6.6);
        expect(small.props.hitSlop.top).toBe(0);
        expect(StyleSheet.flatten(small.props.style).borderWidth).toBe(3);
        expect(screen.getByTestId('risk-hunt-selected-mark', { includeHiddenElements: true })).toBeTruthy();
        expect(StyleSheet.flatten(screen.getByTestId('risk-region-Biombo', { includeHiddenElements: true }).props.style).borderWidth).toBe(2);
    });

    it('depois de conferir, cada região diz o que era, com ícone, e não aceita mais toque', () => {
        render(<Harness submitted initial='["porta","biombo"]' />);
        expect(screen.getByLabelText('Porta aberta, marcada, certo')).toBeTruthy();
        expect(screen.getByLabelText('Campo grande, faltou marcar, errado')).toBeTruthy();
        expect(screen.getByLabelText('Biombo, marcou a mais, errado')).toBeTruthy();
        expect(screen.getByLabelText('Avental no suporte, não marcada, certo')).toBeTruthy();
        expect(screen.getAllByTestId('verdict-icon-correct', { includeHiddenElements: true })).toHaveLength(1);
        expect(screen.getAllByTestId('verdict-icon-incorrect', { includeHiddenElements: true })).toHaveLength(2);
        const frozen = screen.getByTestId('risk-region-Campo grande', { includeHiddenElements: true });
        expect(frozen.props.accessibilityState.disabled).toBe(true);
        fireEvent.press(frozen);
        expect(probe()).toBe('["porta","biombo"]|false');
    });

    it('a figura leva o rótulo da interação, e não a descrição do diagrama', () => {
        render(<Harness />);
        expect(screen.getByLabelText('Encontre os riscos: sala de raios X')).toBeTruthy();
    });

    // E11: a marca de marcada não pode esconder a situação que a região mostra.
    it('a marca de selecionada fica fora da região e inteira no quadro', () => {
        render(<Harness initial='["biombo"]' />);
        measure();
        const style = StyleSheet.flatten(screen.getByTestId('risk-hunt-selected-mark', { includeHiddenElements: true }).props.style);
        const region = risk.payload.regions.find(entry => entry.id === 'biombo')!;
        // A marca é irmã da região: o estilo já vem em pontos do quadro.
        const box = { left: style.left, top: style.top, width: style.width, height: style.height };
        const area = { left: 280 * region.x, top: 210 * region.y, width: 280 * region.width, height: 210 * region.height };
        expect(box.left < area.left + area.width && area.left < box.left + box.width && box.top < area.top + area.height && area.top < box.top + box.height).toBe(false);
        expect(box.left).toBeGreaterThanOrEqual(0);
        expect(box.top).toBeGreaterThanOrEqual(0);
        expect(box.left + box.width).toBeLessThanOrEqual(280);
        expect(box.top + box.height).toBeLessThanOrEqual(210);
    });

    // Revoga a E13 (2026-11-20): a marca não recebe toque, para não marcar quem toca a estrutura errada sob ela.
    it('a marca de selecionada não recebe toque: o toque atravessa e a região não alterna por ela', () => {
        render(<Harness initial='["porta","campo"]' />);
        measure();
        const marks = screen.getAllByTestId('risk-hunt-selected-mark', { includeHiddenElements: true });
        expect(marks).toHaveLength(2);
        marks.forEach(mark => {
            expect(mark.props.pointerEvents).toBe('none');
            expect(mark.props.onClick).toBeUndefined();
            expect(mark.props.accessible).toBeFalsy();
        });
        fireEvent.press(marks[1]);
        expect(probe()).toBe('["porta","campo"]|true');
    });
});
