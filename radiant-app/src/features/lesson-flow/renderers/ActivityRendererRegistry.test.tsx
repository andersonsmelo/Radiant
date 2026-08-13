import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import type { LearningInteractionV2 } from '../../../types/learningActivity';
import {
    ActivityInteractionRenderer,
    REGISTERED_INTERACTION_TYPES,
    isInteractionTypeRegistered,
} from './ActivityRendererRegistry';

jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

function multipleChoice(overrides: Partial<LearningInteractionV2> = {}): LearningInteractionV2 {
    return {
        type: 'multiple-choice',
        id: 'interaction:mc-1',
        competencyIds: ['competency:legacy:lesson-1'],
        evidenceKind: 'legacy-lesson-recall',
        completionRule: 'answered',
        criticalSafety: false,
        feedback: { correct: 'Isso mesmo.', incorrect: 'Reveja o conceito.' },
        accessibility: { label: 'Questão sobre densidade' },
        payload: {
            prompt: 'Qual estrutura aparece mais radiopaca?',
            options: [
                { id: 'a', label: 'Osso' },
                { id: 'b', label: 'Ar' },
            ],
            correctOptionId: 'a',
        },
        ...overrides,
    } as LearningInteractionV2;
}

describe('ActivityRendererRegistry', () => {
    it('resolve o tipo registrado e renderiza o enunciado e as opções', () => {
        const { getByText } = render(
            <ActivityInteractionRenderer interaction={multipleChoice()} value={undefined} onChange={jest.fn()} />,
        );

        expect(getByText('Qual estrutura aparece mais radiopaca?')).toBeTruthy();
        expect(getByText('Osso')).toBeTruthy();
        expect(getByText('Ar')).toBeTruthy();
    });

    it('expõe o contrato comum: onChange recebe o valor escolhido', () => {
        const onChange = jest.fn();
        const { getByText } = render(
            <ActivityInteractionRenderer interaction={multipleChoice()} value={undefined} onChange={onChange} />,
        );

        fireEvent.press(getByText('Osso'));

        expect(onChange).toHaveBeenCalledWith('a');
    });

    it('reflete o valor corrente vindo de fora, sem guardar estado próprio', () => {
        const { rerender, getByLabelText } = render(
            <ActivityInteractionRenderer interaction={multipleChoice()} value="a" onChange={jest.fn()} />,
        );

        expect(getByLabelText('Osso').props.accessibilityState.selected).toBe(true);

        rerender(
            <ActivityInteractionRenderer interaction={multipleChoice()} value="b" onChange={jest.fn()} />,
        );

        expect(getByLabelText('Ar').props.accessibilityState.selected).toBe(true);
        expect(getByLabelText('Osso').props.accessibilityState.selected).toBe(false);
    });

    it('rejeita tipo desconhecido com erro seguro, sem lançar', () => {
        const desconhecido = multipleChoice({ type: 'jogo-que-nao-existe' as never });

        expect(() => render(
            <ActivityInteractionRenderer interaction={desconhecido} value={undefined} onChange={jest.fn()} />,
        )).not.toThrow();

        const { getByText } = render(
            <ActivityInteractionRenderer interaction={desconhecido} value={undefined} onChange={jest.fn()} />,
        );

        // O aluno vê um aviso e a lição continua — nada de tela branca.
        expect(getByText('Esta atividade não pode ser exibida')).toBeTruthy();
        expect(getByText(/jogo-que-nao-existe/)).toBeTruthy();
    });

    it('declara os cinco tipos que já têm renderizador', () => {
        expect(isInteractionTypeRegistered('multiple-choice')).toBe(true);
        expect(isInteractionTypeRegistered('hotspot')).toBe(true);
        expect(isInteractionTypeRegistered('comparison')).toBe(true);
        expect(isInteractionTypeRegistered('matching')).toBe(true);
        expect(isInteractionTypeRegistered('ordering')).toBe(true);
        expect(isInteractionTypeRegistered('parameter-lab')).toBe(false);
        expect(REGISTERED_INTERACTION_TYPES).toContain('multiple-choice');
        expect(REGISTERED_INTERACTION_TYPES).toHaveLength(5);
    });
});
