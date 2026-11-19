import React, { useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import type { LearningInteractionV2 } from '../../../types/learningActivity';
import { ActivityInteractionRenderer } from './ActivityRendererRegistry';
import { isCompleteInteractionValue, isCorrectInteractionValue } from './InteractionAnswerValue';

jest.mock('../../../ui/accessibility/useReducedMotionPreference', () => ({
    ...jest.requireActual('../../../ui/accessibility/useReducedMotionPreference'),
    useReducedMotionPreference: () => true,
    useReducedMotionPreferenceState: () => ({ reducedMotionEnabled: true, resolved: true }),
}));
jest.mock('../../../ui/useScreenFocused', () => ({ useScreenFocused: () => true }));

const lab: LearningInteractionV2 = {
    id: 'pl', type: 'parameter-lab', competencyIds: ['competency:test'], evidenceKind: 'guided-practice', completionRule: 'confirmed',
    criticalSafety: false, feedback: { correct: 'Certo.', incorrect: 'Reveja.' }, accessibility: { label: 'Laboratório: distância' },
    payload: {
        prompt: 'Afaste a fonte até a intensidade cair a um quarto.', model: 'inverse-square', start: 1, goal: { atLeast: 2 },
        hints: { tooLow: 'Perto demais.', tooHigh: 'Longe demais.' },
    },
};

function Harness({ submitted = false, initial, onSpy }: { submitted?: boolean; initial?: string; onSpy?: (value: string) => void }) {
    const [value, setValue] = useState<string | undefined>(initial);
    const { Text } = jest.requireActual('react-native');
    return <>
        <ActivityInteractionRenderer interaction={lab} value={value} onChange={next => { onSpy?.(next); setValue(next); }} submitted={submitted} />
        <Text testID="probe">{`${value ?? ''}|${isCompleteInteractionValue(lab, value)}|${isCorrectInteractionValue(lab, value)}`}</Text>
    </>;
}
const probe = () => String(screen.getByTestId('probe').props.children);

describe('ParameterLabStepRenderer', () => {
    afterEach(() => jest.restoreAllMocks());

    it('mostra o enunciado, o valor de partida e a leitura em texto, sem responder sozinho', () => {
        const spy = jest.fn();
        render(<Harness onSpy={spy} />);
        expect(screen.getByText('Afaste a fonte até a intensidade cair a um quarto.')).toBeTruthy();
        expect(screen.getByText('1 m')).toBeTruthy();
        expect(screen.getByText('Intensidade relativa: 100%')).toBeTruthy();
        expect(spy).not.toHaveBeenCalled();
        expect(probe()).toBe('|false|false');
    });

    it('o botão Aumentar sobe um passo, grava o valor como texto, atualiza a leitura e anuncia', () => {
        const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => undefined);
        render(<Harness />);
        fireEvent.press(screen.getByLabelText('Aumentar Distância'));
        expect(probe()).toBe('1.5|true|false');
        // O valor guardado é o número em texto; o que o aluno lê e o leitor de tela falam leva vírgula.
        expect(screen.getByText('1,5 m')).toBeTruthy();
        expect(screen.getByRole('adjustable', { name: 'Distância' }).props.accessibilityValue.text).toBe('1,5 m');
        expect(screen.getByText('Intensidade relativa: 44,4%')).toBeTruthy();
        expect(announce).toHaveBeenCalledWith('Intensidade relativa: 44,4%');
        fireEvent.press(screen.getByLabelText('Aumentar Distância'));
        expect(probe()).toBe('2|true|true');
        expect(screen.getByText('Intensidade relativa: 25%')).toBeTruthy();
        fireEvent.press(screen.getByLabelText('Diminuir Distância'));
        expect(probe()).toBe('1.5|true|false');
    });

    it('volta ao valor de partida depois de mexer: a resposta existe, e erra', () => {
        render(<Harness />);
        fireEvent.press(screen.getByLabelText('Aumentar Distância'));
        fireEvent.press(screen.getByLabelText('Diminuir Distância'));
        expect(probe()).toBe('1|true|false');
    });

    it('retoma o valor guardado', () => {
        render(<Harness initial="3" />);
        expect(screen.getByText('3 m')).toBeTruthy();
        expect(screen.getByText('Intensidade relativa: 11,1%')).toBeTruthy();
    });

    it('o controle é ajustável e tem os botões com rótulo; depois de conferir, não aceita toque', () => {
        const { unmount } = render(<Harness />);
        expect(screen.getByRole('adjustable', { name: 'Distância' }).props.accessibilityValue).toEqual({ min: 1, max: 4, now: 1, text: '1 m' });
        unmount();
        render(<Harness submitted initial="1.5" />);
        fireEvent.press(screen.getByLabelText('Aumentar Distância'));
        expect(probe()).toBe('1.5|true|false');
    });

    it('as leituras são região viva e o diagrama é decorativo para o leitor de tela', () => {
        render(<Harness />);
        expect(screen.getByTestId('parameter-lab-readouts').props.accessibilityLiveRegion).toBe('polite');
        const frame = screen.getByTestId('diagram-frame', { includeHiddenElements: true });
        expect(frame.props.accessibilityElementsHidden).toBe(true);
        expect(frame.props.accessible).toBe(false);
    });
});
