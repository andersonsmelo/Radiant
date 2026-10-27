import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import type { LearningInteractionV2 } from '../../../types/learningActivity';
import {
    ActivityInteractionRenderer,
    REGISTERED_INTERACTION_TYPES,
    isInteractionTypeRegistered,
} from './ActivityRendererRegistry';
import { MultipleChoiceStepRenderer } from './MultipleChoiceStepRenderer';
import { ReinforceStepRenderer } from './ReinforceStepRenderer';

jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

// A bancada desenha o fantoma com Skia, que o Jest não rasteriza.
jest.mock('@shopify/react-native-skia', () => {
    const ReactInMock = require('react');
    const { View } = require('react-native');
    const host = (name: string) => {
        const Host = ({ children, ...props }: { children?: unknown }) =>
            ReactInMock.createElement(View, { ...props, testID: `skia-${name}` }, children);
        Host.displayName = name;
        return Host;
    };
    return {
        Canvas: host('Canvas'),
        Fill: host('Fill'),
        Shader: host('Shader'),
        Skia: { RuntimeEffect: { Make: jest.fn(() => ({ kind: 'effect' })) } },
    };
});

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

    it('sincroniza hints com a confirmação explícita recebida e mostra o estado selecionado', () => {
        const { getByLabelText, getByText } = render(
            <ActivityInteractionRenderer interaction={multipleChoice()} value="a" onChange={jest.fn()} confirmationLabel="Conferir resposta" />,
        );

        expect(getByLabelText('Osso').props.accessibilityHint).toContain('Conferir resposta');
        expect(getByLabelText('Ar').props.accessibilityHint).toBe('Seleciona esta resposta. Você confirma em Conferir resposta.');
        expect(getByText('Selecionada')).toBeTruthy();
    });

    it('mantém Continuar como default para chamadores do registry e do renderer legado', () => {
        const registry = render(
            <ActivityInteractionRenderer interaction={multipleChoice()} value="a" onChange={jest.fn()} />,
        );
        expect(registry.getByLabelText('Osso').props.accessibilityHint).toContain('Continuar');
        registry.unmount();

        const direct = render(
            <MultipleChoiceStepRenderer
                payload={{ prompt: 'Escolha', options: [{ id: 'a', label: 'Osso' }], correctOptionId: 'a', explanation: 'Isso mesmo.' }}
                onSelect={jest.fn()}
            />,
        );
        expect(direct.getByLabelText('Osso').props.accessibilityHint).toBe('Seleciona esta resposta. Você confirma em Continuar.');
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

    it('declara os seis tipos que já têm renderizador', () => {
        expect(isInteractionTypeRegistered('case-decision')).toBe(false);
        expect(isInteractionTypeRegistered('multiple-choice')).toBe(true);
        expect(isInteractionTypeRegistered('hotspot')).toBe(true);
        expect(isInteractionTypeRegistered('comparison')).toBe(true);
        expect(isInteractionTypeRegistered('matching')).toBe(true);
        expect(isInteractionTypeRegistered('ordering')).toBe(true);
        expect(isInteractionTypeRegistered('bench')).toBe(true);
        expect(isInteractionTypeRegistered('parameter-lab')).toBe(false);
        expect(REGISTERED_INTERACTION_TYPES).toContain('multiple-choice');
        expect(REGISTERED_INTERACTION_TYPES).toContain('bench');
        expect(REGISTERED_INTERACTION_TYPES).toHaveLength(6);
    });

    it('renderiza a bancada pelo registro: enunciado, fantoma e o JSON inicial no onChange', () => {
        const onChange = jest.fn();
        const bancada = {
            ...multipleChoice(),
            type: 'bench',
            payload: {
                prompt: 'Suba o kV até 100.',
                simulator: 'exposure',
                mode: 'explore',
                controls: [
                    { id: 'kv', label: 'Tensão', unit: 'kV', min: 40, max: 120, step: 10, initial: 70 },
                    { id: 'mas', label: 'Carga', unit: 'mAs', min: 1, max: 40, step: 1, initial: 10 },
                ],
                goal: { kind: 'reach', control: 'kv', atLeast: 100 },
                phantomLabel: 'Fantoma simulado',
                hints: { tooLow: 'Suba.', tooHigh: 'Desça.' },
            },
        } as unknown as LearningInteractionV2;

        const { getByText, queryByText } = render(
            <ActivityInteractionRenderer interaction={bancada} value={undefined} onChange={onChange} />,
        );

        expect(getByText('Suba o kV até 100.')).toBeTruthy();
        expect(getByText('Fantoma simulado')).toBeTruthy();
        expect(queryByText('Esta atividade não pode ser exibida')).toBeNull();
        expect(onChange).toHaveBeenCalledWith('{"kv":70,"mas":10}');
    });

    it('mantém a pergunta e o gabarito visíveis junto à explicação no passo de reforço', () => {
        const { getByText, getByTestId } = render(
            <ReinforceStepRenderer
                payload={{
                    title: 'Fixe este ponto',
                    body: 'Resumo de fallback.',
                    tone: 'neutral',
                    prompt: 'Qual estrutura aparece mais radiopaca?',
                    correctAnswerLabel: 'Osso cortical',
                }}
                answeredCorrectly={false}
                explanation="Estruturas densas atenuam mais fótons de raios X."
            />,
        );

        expect(getByText('Vamos reforçar')).toBeTruthy();
        expect(getByTestId('reinforce-question-recap')).toHaveTextContent(
            'Pergunta: Qual estrutura aparece mais radiopaca?'
        );
        expect(getByTestId('reinforce-correct-answer')).toHaveTextContent(
            'Gabarito: Osso cortical'
        );
        expect(getByText('Estruturas densas atenuam mais fótons de raios X.')).toBeTruthy();
    });
});


it('M2 anuncia opções conferidas como indisponíveis e preserva a escolha na tela', () => {
    const onChange = jest.fn();
    const { getByLabelText } = render(<ActivityInteractionRenderer
        interaction={multipleChoice()} value="b" onChange={onChange} submitted />);
    expect(getByLabelText('Ar').props.accessibilityState).toMatchObject({ selected: true, disabled: true });
    expect(getByLabelText('Osso').props.accessibilityHint).toBe('Resposta já conferida. Leia o feedback e continue.');
    fireEvent.press(getByLabelText('Osso'));
    expect(onChange).not.toHaveBeenCalled();
    expect(getByLabelText('Ar')).toBeTruthy();
});


it('T04 pinta o grão da leitura com o modelo e mantém enunciado e resposta', () => {
    const interaction = multipleChoice();
    const image = { input: { kv: 70, mas: 2 }, label: 'Fantoma simulado' };
    const withImage = { ...interaction, payload: { ...interaction.payload, exposureImage: image } } as LearningInteractionV2;
    const view = render(<ActivityInteractionRenderer interaction={withImage} value={undefined} onChange={jest.fn()} />);
    expect(view.getByRole('image', { name: 'Fantoma simulado' })).toBeTruthy();
    expect(view.getByText('Qual estrutura aparece mais radiopaca?')).toBeTruthy();
    const uniforms = view.getByTestId('skia-Shader').props.uniforms;
    expect(uniforms.noise).toBeCloseTo(0.045 * Math.sqrt(12 / 2));
    const grain = uniforms.noise as number;
    view.rerender(<ActivityInteractionRenderer interaction={{ ...interaction, payload: { ...interaction.payload, exposureImage: { ...image, input: { kv: 70, mas: 10 } } } } as LearningInteractionV2} value={undefined} onChange={jest.fn()} />);
    const reference = view.getByTestId('skia-Shader').props.uniforms;
    expect(grain).toBeGreaterThan(reference.noise);
    for (const tone of ['bone', 'soft', 'background']) expect(uniforms[tone]).toBe(reference[tone]);
    expect(view.getByRole('button', { name: 'Ar' })).toBeTruthy();
});
