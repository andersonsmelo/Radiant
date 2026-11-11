import React from 'react';
import { Pressable, Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { ActivityInteractionRenderer } from './ActivityRendererRegistry';
import { useLearningActivity } from '../hooks/useLearningActivity';
import { isCompleteInteractionValue, isCorrectInteractionValue } from './InteractionAnswerValue';
import { validateLearningActivity, type LearningActivityV2, type LearningInteractionV2, type CaseDecisionPayload } from '../../../types/learningActivity';

jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

function question(phase: NonNullable<CaseDecisionPayload['phase']>): Extract<LearningInteractionV2, { type: 'case-decision' }> {
    return { id: `case:${phase}`, type: 'case-decision', competencyIds: ['competency:fixture'],
        evidenceKind: 'applied-transfer', criticalSafety: false, completionRule: 'answered',
        accessibility: { label: `Treino ${phase}` },
        feedback: { correct: `Retorno correto ${phase}`, incorrect: `Retorno incorreto ${phase}` },
        payload: { phase, context: `Informação do capítulo ${phase}`, prompt: `Escolha simulada ${phase}`,
            options: [{ id: `${phase}:a`, label: `Escolha A ${phase}` },
                { id: `${phase}:b`, label: `Escolha B ${phase}`, explanation: `Motivo autoral ${phase}` }],
            correctOptionId: `${phase}:a` },
    };
}

const chapterActivity: LearningActivityV2 = {
    id: 'activity:fixture:case', competencyIds: ['competency:fixture'],
    provenance: { contentVersion: 'fixture-v1', sourceIds: ['source:fixture'] },
    steps: (['decision', 'reason', 'support'] as const).map(phase => ({ kind: 'interaction', interaction: question(phase) })),
};

function Chapters() {
    const player = useLearningActivity(chapterActivity, 0, { feedbackPerItem: true });
    const step = player.currentStep;
    return <>
        {step?.kind === 'interaction' ? <ActivityInteractionRenderer interaction={step.interaction}
            value={player.value} onChange={player.setValue} submitted={player.showingFeedback}
            confirmationLabel="Conferir resposta" /> : null}
        <Text testID="case-value">{player.value ?? 'none'}</Text>
        <Text testID="case-first-answers">{JSON.stringify(player.firstConfirmedAnswers)}</Text>
        {player.showingFeedback ? <Text>{player.lastFeedback?.message}</Text> : null}
        <Pressable accessibilityRole="button" accessibilityLabel={player.showingFeedback ? 'Continuar' : 'Conferir resposta'}
            accessibilityState={{ disabled: !player.canContinue }} disabled={!player.canContinue}
            onPress={() => player.confirm()}><Text>{player.showingFeedback ? 'Continuar' : 'Conferir resposta'}</Text></Pressable>
    </>;
}

describe('Q6 renderer and real player', () => {
    it('selects by explicit identity without exposing the answer or feedback before confirmation', () => {
        const interaction = question('decision'); const onChange = jest.fn();
        const view = render(<ActivityInteractionRenderer interaction={interaction} value={undefined} onChange={onChange} />);
        expect(view.getByText('Informação do capítulo decision')).toBeTruthy();
        expect(view.getByText('Decisão')).toBeTruthy();
        expect(view.queryByText('Motivo autoral decision')).toBeNull();
        fireEvent.press(view.getByRole('button', { name: 'Escolha B decision' }));
        expect(onChange).toHaveBeenCalledWith('decision:b');
        expect(isCompleteInteractionValue(interaction, 'Escolha A decision')).toBe(false);
        expect(isCorrectInteractionValue(interaction, 'frase com decisão motivo apoio')).toBe(false);
        expect(isCorrectInteractionValue(interaction, 'decision:a')).toBe(true);
    });
    it('locks the submitted choice including its accessibility state', () => {
        const onChange = jest.fn();
        const view = render(<ActivityInteractionRenderer interaction={question('support')} value="support:b" onChange={onChange} submitted />);
        const chosen = view.getByRole('button', { name: 'Escolha B support' });
        expect(chosen.props.accessibilityState).toEqual({ selected: true, disabled: true });
        fireEvent.press(view.getByRole('button', { name: 'Escolha A support' }));
        expect(onChange).not.toHaveBeenCalled();
    });
    it('supports existing payloads with no phase/context and refuses image options', () => {
        const simple = question('decision');
        const { phase: _phase, context: _context, ...payload } = simple.payload;
        const view = render(<ActivityInteractionRenderer interaction={{ ...simple, payload }} value={undefined} onChange={jest.fn()} />);
        expect(view.getByText(payload.prompt)).toBeTruthy();
        view.rerender(<ActivityInteractionRenderer interaction={{ ...simple, payload: { ...payload, options: payload.options.map(option => ({ ...option, imageRef: 'not-rendered' })) } }} value={undefined} onChange={jest.fn()} />);
        expect(view.getByText('Esta atividade não pode ser exibida')).toBeTruthy();
        expect(view.queryByText('Escolha A decision')).toBeNull();
    });
    it('confirms decision, reason and support separately, clears selection and retains first responses', () => {
        expect(validateLearningActivity(chapterActivity)).toEqual([]);
        const view = render(<Chapters />);
        expect(view.getByRole('button', { name: 'Conferir resposta' }).props.accessibilityState.disabled).toBe(true);
        fireEvent.press(view.getByRole('button', { name: 'Escolha B decision' }));
        expect(view.queryByText('Motivo autoral decision')).toBeNull();
        fireEvent.press(view.getByRole('button', { name: 'Conferir resposta' }));
        expect(view.getByText('Motivo autoral decision')).toBeTruthy();
        fireEvent.press(view.getByRole('button', { name: 'Escolha A decision' }));
        expect(view.getByTestId('case-value').props.children).toBe('decision:b');
        fireEvent.press(view.getByRole('button', { name: 'Continuar' }));
        expect(view.getByText('Motivo')).toBeTruthy();
        expect(view.queryByText('Informação do capítulo decision')).toBeNull();
        expect(view.getByTestId('case-value').props.children).toBe('none');
        fireEvent.press(view.getByRole('button', { name: 'Escolha A reason' }));
        fireEvent.press(view.getByRole('button', { name: 'Conferir resposta' }));
        expect(view.getByText('Retorno correto reason')).toBeTruthy();
        fireEvent.press(view.getByRole('button', { name: 'Continuar' }));
        expect(view.getByText('Ação de apoio')).toBeTruthy();
        fireEvent.press(view.getByRole('button', { name: 'Escolha A support' }));
        fireEvent.press(view.getByRole('button', { name: 'Conferir resposta' }));
        expect(JSON.parse(view.getByTestId('case-first-answers').props.children)).toEqual({ 'case:decision': false, 'case:reason': true, 'case:support': true });
    });
});
