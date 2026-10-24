import React, { useState } from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import type { BenchControl, BenchGoal, LearningInteractionV2 } from '../../../types/learningActivity';
import { exposureModel, REFERENCE_EXPOSURE } from '../../bench/exposureModel';
import { BenchStepRenderer } from './BenchStepRenderer';
import { decodeBenchValue, isCompleteInteractionValue } from './InteractionAnswerValue';

// A bancada na tela. O Jest não rasteriza Skia: o módulo é trocado por um dublê
// em que o `Shader` expõe os uniformes, e as asserções recaem sobre o que decide
// o que o aluno vê: quantas imagens há, com que números do modelo cada uma é
// pintada e que JSON a tela entrega ao player.

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

const HIDDEN = { includeHiddenElements: true };

const controls: BenchControl[] = [
    { id: 'kv', label: 'Tensão', unit: 'kV', min: 40, max: 120, step: 10, initial: 70 },
    { id: 'mas', label: 'Carga', unit: 'mAs', min: 1, max: 40, step: 1, initial: 10 },
];

const base = {
    id: 'interaction:bench-1',
    competencyIds: ['competency:bancada'],
    evidenceKind: 'simulated-practice',
    completionRule: 'answered',
    criticalSafety: false,
    feedback: { correct: 'Isso.', incorrect: 'Reveja.' },
    accessibility: { label: 'Bancada de exposição' },
};

function bench(
    goal: BenchGoal,
    mode: 'explore' | 'challenge' | 'correct' = 'explore',
    id: string = base.id,
): LearningInteractionV2 {
    return {
        ...base,
        id,
        type: 'bench',
        payload: {
            prompt: 'Suba o kV até 100.',
            simulator: 'exposure',
            mode,
            controls,
            goal,
            phantomLabel: 'Fantoma simulado',
            hints: { tooLow: 'Suba.', tooHigh: 'Desça.' },
        },
    } as LearningInteractionV2;
}

const reach: BenchGoal = { kind: 'reach', control: 'kv', atLeast: 100 };
const match: BenchGoal = { kind: 'match', reference: { kv: 90, mas: 20 }, tolerance: 0.05 };

/** O player: guarda o valor e o devolve ao renderizador, como a tela da lição faz. */
function Player({
    interaction,
    onChange,
    initial,
    submitted,
}: {
    interaction: LearningInteractionV2;
    onChange: (value: string) => void;
    initial?: string;
    submitted?: boolean;
}) {
    const [value, setValue] = useState<string | undefined>(initial);
    return (
        <BenchStepRenderer
            interaction={interaction}
            value={value}
            submitted={submitted}
            onChange={(next) => {
                onChange(next);
                setValue(next);
            }}
        />
    );
}

function uniformsOf({
    getAllByTestId,
}: {
    getAllByTestId: (id: string) => { props: { uniforms: Record<string, number> } }[];
}) {
    return getAllByTestId('skia-Shader').map((node) => node.props.uniforms);
}

describe('BenchStepRenderer', () => {
    let warn: jest.SpyInstance;

    beforeEach(() => {
        warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    });

    afterEach(() => {
        warn.mockRestore();
    });

    describe('o que mostra', () => {
        it('mostra o enunciado, o rótulo do fantoma e uma linha por controle', () => {
            const { getByText, getByLabelText } = render(
                <Player interaction={bench(reach)} onChange={jest.fn()} />,
            );

            expect(getByText('Suba o kV até 100.')).toBeTruthy();
            expect(getByText('Fantoma simulado')).toBeTruthy();
            expect(getByText('70 kV')).toBeTruthy();
            expect(getByText('10 mAs')).toBeTruthy();
            expect(getByLabelText('Tensão').props.accessibilityRole).toBe('adjustable');
            expect(getByLabelText('Carga').props.accessibilityRole).toBe('adjustable');
        });

        it('em explore tem uma só imagem, pintada com os números do modelo para os controles', () => {
            const { getAllByTestId } = render(<Player interaction={bench(reach)} onChange={jest.fn()} />);
            const [only, ...rest] = uniformsOf({ getAllByTestId });
            const out = exposureModel({ kv: 70, mas: 10 });

            expect(rest).toHaveLength(0);
            expect(only).toMatchObject({ bone: out.bone, soft: out.soft, background: out.background, noise: out.noise });
        });

        it('em challenge com alvo match, mostra a referência ao lado, pintada com goal.reference', () => {
            const { getAllByTestId, getByText } = render(
                <Player interaction={bench(match, 'challenge')} onChange={jest.fn()} />,
            );
            const images = uniformsOf({ getAllByTestId });
            const reference = exposureModel({ kv: 90, mas: 20 });
            const student = exposureModel({ kv: 70, mas: 10 });

            expect(images).toHaveLength(2);
            expect(getByText('Referência')).toBeTruthy();
            expect(images[0]).toMatchObject({ bone: reference.bone, soft: reference.soft, noise: reference.noise });
            expect(images[1]).toMatchObject({ bone: student.bone, soft: student.soft, noise: student.noise });
            // A referência é diferente da imagem do aluno: senão o desafio não existiria.
            expect(images[0].bone - images[0].soft).not.toBe(images[1].bone - images[1].soft);
        });

        it('a imagem de referência não entrega o kV nem o mAs no rótulo', () => {
            const { getByLabelText } = render(
                <Player interaction={bench(match, 'challenge')} onChange={jest.fn()} />,
            );
            const label = getByLabelText(/imagem de referência/i).props.accessibilityLabel as string;

            expect(label).not.toMatch(/\bkV\b|\bmAs\b|90|20/);
        });

        it('em challenge com alvo reach não há referência: uma só imagem', () => {
            const { getAllByTestId } = render(<Player interaction={bench(reach, 'challenge')} onChange={jest.fn()} />);

            expect(uniformsOf({ getAllByTestId })).toHaveLength(1);
        });

        it('em challenge com match SEM reference não quebra: usa a referência padrão e avisa uma vez', () => {
            const semReferencia = { kind: 'match', tolerance: 0.05 } as unknown as BenchGoal;
            const interaction = bench(semReferencia, 'challenge', 'interaction:sem-referencia');

            const first = render(<Player interaction={interaction} onChange={jest.fn()} />);
            const fallback = exposureModel(REFERENCE_EXPOSURE);
            const [reference] = uniformsOf(first);
            expect(first.getAllByTestId('skia-Shader')).toHaveLength(2);
            expect(reference).toMatchObject({ bone: fallback.bone, soft: fallback.soft, noise: fallback.noise });
            first.unmount();

            // Montar de novo a mesma interação não repete o aviso.
            render(<Player interaction={interaction} onChange={jest.fn()} />);
            expect(warn).toHaveBeenCalledTimes(1);
            expect(String(warn.mock.calls[0][0])).toContain('interaction:sem-referencia');
        });
    });

    describe('o valor que sobe ao player', () => {
        it('emite o JSON com os valores iniciais assim que monta, e o passo fica completo', () => {
            const onChange = jest.fn();
            const interaction = bench(reach);
            render(<Player interaction={interaction} onChange={onChange} />);

            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith('{"kv":70,"mas":10}');
            expect(isCompleteInteractionValue(interaction, onChange.mock.calls[0][0])).toBe(true);
        });

        it('não reemite quando o valor guardado já é o canônico', () => {
            const onChange = jest.fn();
            render(<Player interaction={bench(reach)} onChange={onChange} initial='{"kv":100,"mas":10}' />);

            expect(onChange).not.toHaveBeenCalled();
        });

        it('reemite o valor normalizado quando o guardado está fora da faixa', () => {
            const onChange = jest.fn();
            render(<Player interaction={bench(reach)} onChange={onChange} initial='{"kv":999,"mas":10}' />);

            expect(onChange).toHaveBeenCalledWith('{"kv":70,"mas":10}');
        });

        it('tocar + três vezes no kV, com passo 10 a partir de 70, entrega kv 100 e o rótulo vira "100 kV"', () => {
            const onChange = jest.fn();
            const { getByLabelText, getByText } = render(<Player interaction={bench(reach)} onChange={onChange} />);

            fireEvent.press(getByLabelText('Aumentar Tensão'));
            fireEvent.press(getByLabelText('Aumentar Tensão'));
            fireEvent.press(getByLabelText('Aumentar Tensão'));

            expect(onChange).toHaveBeenLastCalledWith('{"kv":100,"mas":10}');
            expect(getByText('100 kV')).toBeTruthy();
        });

        it('as ações increment e decrement entregam o mesmo valor que os botões', () => {
            const onChange = jest.fn();
            const { getByLabelText } = render(<Player interaction={bench(reach)} onChange={onChange} />);
            const adjustable = getByLabelText('Tensão');
            const act = (actionName: string) => fireEvent(adjustable, 'accessibilityAction', { nativeEvent: { actionName } });

            act('increment');
            act('increment');
            act('increment');
            expect(onChange).toHaveBeenLastCalledWith('{"kv":100,"mas":10}');

            act('decrement');
            expect(onChange).toHaveBeenLastCalledWith('{"kv":90,"mas":10}');
        });

        it('mexer num controle preserva o outro e o valor segue dentro da faixa', () => {
            const onChange = jest.fn();
            const { getByLabelText } = render(<Player interaction={bench(reach)} onChange={onChange} />);

            for (let i = 0; i < 60; i += 1) {
                fireEvent.press(getByLabelText('Aumentar Carga'));
            }

            const last = onChange.mock.calls[onChange.mock.calls.length - 1][0] as string;
            expect(decodeBenchValue(last, controls)).toEqual({ kv: 70, mas: 40 });
            expect(JSON.parse(last).mas).toBeLessThanOrEqual(40);
        });

        it('conferida (submitted), a bancada trava: os botões não mudam mais o valor', () => {
            const onChange = jest.fn();
            const { getByLabelText } = render(
                <Player interaction={bench(reach)} onChange={onChange} initial='{"kv":70,"mas":10}' submitted />,
            );

            fireEvent.press(getByLabelText('Aumentar Tensão'));

            expect(onChange).not.toHaveBeenCalled();
        });
    });

    describe('o arrasto', () => {
        it('a imagem acompanha o arrasto a cada valor, mas o player só recebe o JSON no passo', () => {
            const onChange = jest.fn();
            const { getAllByTestId, getByTestId } = render(<Player interaction={bench(reach)} onChange={onChange} />);
            const slider = getByTestId('bench-slider-kv', HIDDEN);
            onChange.mockClear();

            fireEvent(slider, 'valueChange', 73);
            const live = exposureModel({ kv: 73, mas: 10 });
            expect(uniformsOf({ getAllByTestId })[0]).toMatchObject({ bone: live.bone, soft: live.soft });
            expect(onChange).not.toHaveBeenCalled();

            fireEvent(slider, 'valueChange', 86);
            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith('{"kv":90,"mas":10}');

            // Ao soltar, a imagem volta ao valor do passo (90), e não fica em 86.
            fireEvent(slider, 'slidingComplete', 86);
            const settled = exposureModel({ kv: 90, mas: 10 });
            expect(uniformsOf({ getAllByTestId })[0]).toMatchObject({ bone: settled.bone, soft: settled.soft });
        });
    });

    describe('a bancada de colimação', () => {
        const field: BenchControl[] = [
            { id: 'fieldWidth', label: 'Largura do campo', unit: 'cm', min: 5, max: 27, step: 1, initial: 27 },
            { id: 'fieldHeight', label: 'Altura do campo', unit: 'cm', min: 5, max: 33, step: 1, initial: 33 },
        ];

        function collimation(
            goal: BenchGoal = { kind: 'reach', control: 'fieldWidth', atMost: 18 },
            mode: 'explore' | 'challenge' | 'correct' = 'challenge',
        ): LearningInteractionV2 {
            return {
                ...base,
                id: 'interaction:colimacao',
                type: 'bench',
                payload: {
                    prompt: 'Feche o campo até o joelho.',
                    simulator: 'collimation',
                    mode,
                    controls: field,
                    goal,
                    phantomLabel: 'Fantoma simulado',
                    hints: { tooLow: 'Abra.', tooHigh: 'Feche.' },
                },
            } as LearningInteractionV2;
        }

        function fieldOf(rendered: { getAllByTestId: (id: string) => { props: { uniforms: Record<string, unknown> } }[] }) {
            return rendered.getAllByTestId('skia-Shader').map((node) => node.props.uniforms.field as number[]);
        }

        it('escolhe a imagem pelo simulador: o fantoma de referência com a máscara do campo', () => {
            const rendered = render(<Player interaction={collimation()} onChange={jest.fn()} />);
            const [only, ...rest] = uniformsOf(rendered);
            const out = exposureModel(REFERENCE_EXPOSURE);

            expect(rest).toHaveLength(0);
            expect(only).toMatchObject({ bone: out.bone, soft: out.soft, noise: out.noise });
            expect(fieldOf(rendered)).toEqual([[1, 1]]);
        });

        it('a bancada de exposição continua sem máscara', () => {
            const rendered = render(<Player interaction={bench(reach)} onChange={jest.fn()} />);

            expect(fieldOf(rendered)).toEqual([[1, 1]]);
        });

        it('mostra em texto o campo e o produto dose-área, e o rótulo da imagem diz o campo', () => {
            const { getByText, getByLabelText } = render(<Player interaction={collimation()} onChange={jest.fn()} />);

            expect(getByText('27 cm')).toBeTruthy();
            expect(getByText('33 cm')).toBeTruthy();
            expect(getByText('Campo de 27 × 33 cm, 891 cm²')).toBeTruthy();
            expect(getByText('Produto dose-área: 100% do campo todo')).toBeTruthy();
            expect(getByLabelText('Fantoma simulado: campo de 27 × 33 cm').props.accessibilityRole).toBe('image');
        });

        it('emite o JSON do campo ao montar', () => {
            const onChange = jest.fn();
            render(<Player interaction={collimation()} onChange={onChange} />);

            expect(onChange).toHaveBeenCalledWith('{"fieldWidth":27,"fieldHeight":33}');
        });

        it('fechar a largura em 9 cm encolhe a máscara, baixa o produto dose-área no texto e entrega o JSON', () => {
            const onChange = jest.fn();
            const rendered = render(<Player interaction={collimation()} onChange={onChange} />);

            for (let i = 0; i < 9; i += 1) {
                fireEvent.press(rendered.getByLabelText('Diminuir Largura do campo'));
            }

            expect(onChange).toHaveBeenLastCalledWith('{"fieldWidth":18,"fieldHeight":33}');
            const [[width, height]] = fieldOf(rendered);
            expect(width).toBeCloseTo(18 / 27, 12);
            expect(height).toBe(1);
            // 18 × 33 = 594 cm², 594 / 891 = 67%.
            expect(rendered.getByText('Campo de 18 × 33 cm, 594 cm²')).toBeTruthy();
            expect(rendered.getByText('Produto dose-área: 67% do campo todo')).toBeTruthy();
        });

        it('no arrasto, a máscara acompanha o dedo e o texto fica no valor do passo', () => {
            const rendered = render(<Player interaction={collimation()} onChange={jest.fn()} />);

            fireEvent(rendered.getByTestId('bench-slider-fieldWidth', HIDDEN), 'valueChange', 20.3);

            expect(fieldOf(rendered)[0][0]).toBeCloseTo(20.3 / 27, 12);
            expect(rendered.getByText('Campo de 20 × 33 cm, 660 cm²')).toBeTruthy();
        });

        it('match numa colimação (conteúdo defeituoso) não abre imagem de referência', () => {
            const wrong: BenchGoal = { kind: 'match', reference: { kv: 90, mas: 20 }, tolerance: 0.05 };
            const rendered = render(<Player interaction={collimation(wrong, 'challenge')} onChange={jest.fn()} />);

            expect(uniformsOf(rendered)).toHaveLength(1);
            expect(rendered.queryByText('Referência')).toBeNull();
        });
    });
});
