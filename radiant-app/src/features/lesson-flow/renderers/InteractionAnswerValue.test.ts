import type { BenchControl, BenchGoal, LearningInteractionV2 } from '../../../types/learningActivity';
import * as exposure from '../../bench/exposureModel';
import {
    benchDirection,
    decodeBenchValue,
    decodeInteractionIdSequence,
    encodeBenchValue,
    encodeInteractionIdSequence,
    isCompleteInteractionValue,
    isCorrectInteractionValue,
} from './InteractionAnswerValue';

const base = {
    id: 'interaction:test',
    competencyIds: ['competency:test'],
    evidenceKind: 'guided-practice' as const,
    completionRule: 'answered' as const,
    criticalSafety: false,
    feedback: { correct: 'Certo.', incorrect: 'Tente novamente.' },
    accessibility: { label: 'Atividade de teste' },
};

describe('InteractionAnswerValue', () => {
    it('serializa sequências sem aceitar valores corrompidos', () => {
        expect(decodeInteractionIdSequence(encodeInteractionIdSequence(['a', 'b']))).toEqual(['a', 'b']);
        expect(decodeInteractionIdSequence('não é json')).toEqual([]);
        expect(decodeInteractionIdSequence('["a", 2]')).toEqual([]);
    });

    it('aceita qualquer região autorizada como resposta correta do hotspot', () => {
        const interaction: LearningInteractionV2 = {
            ...base,
            type: 'hotspot',
            payload: {
                prompt: 'Localize o detector.',
                imageRef: 'asset://xray.png',
                regions: [
                    { id: 'source', label: 'Fonte', x: 0.2, y: 0.1, width: 0.2, height: 0.2 },
                    { id: 'detector', label: 'Detector', x: 0.1, y: 0.7, width: 0.8, height: 0.2 },
                ],
                correctRegionIds: ['detector'],
            },
        };

        expect(isCompleteInteractionValue(interaction, 'detector')).toBe(true);
        expect(isCorrectInteractionValue(interaction, 'detector')).toBe(true);
        expect(isCorrectInteractionValue(interaction, 'source')).toBe(false);
    });

    it('só completa matching e ordering com uma permutação inteira', () => {
        const matching: LearningInteractionV2 = {
            ...base,
            type: 'matching',
            payload: {
                prompt: 'Associe.',
                pairs: [
                    { id: 'kvp', left: 'kVp', right: 'Penetração' },
                    { id: 'mas', left: 'mAs', right: 'Quantidade' },
                ],
            },
        };
        const ordering: LearningInteractionV2 = {
            ...base,
            type: 'ordering',
            payload: {
                prompt: 'Ordene.',
                items: [
                    { id: 'confirmar', label: 'Confirmar identificação' },
                    { id: 'expor', label: 'Realizar exposição' },
                ],
                correctOrder: ['confirmar', 'expor'],
            },
        };

        expect(isCompleteInteractionValue(matching, encodeInteractionIdSequence(['kvp']))).toBe(false);
        expect(isCompleteInteractionValue(matching, encodeInteractionIdSequence(['kvp', 'mas']))).toBe(true);
        expect(isCorrectInteractionValue(matching, encodeInteractionIdSequence(['mas', 'kvp']))).toBe(false);
        expect(isCorrectInteractionValue(ordering, encodeInteractionIdSequence(['confirmar', 'expor']))).toBe(true);
        expect(isCompleteInteractionValue(ordering, encodeInteractionIdSequence(['confirmar', 'confirmar']))).toBe(false);
    });

    describe('bench', () => {
        const controls: BenchControl[] = [
            { id: 'kv', label: 'Tensão', unit: 'kV', min: 40, max: 120, step: 5, initial: 70 },
            { id: 'mas', label: 'Carga', unit: 'mAs', min: 1, max: 40, step: 1, initial: 10 },
        ];

        function bench(goal: BenchGoal): LearningInteractionV2 {
            return {
                ...base,
                type: 'bench',
                payload: {
                    prompt: 'Ajuste a exposição.',
                    simulator: 'exposure',
                    mode: 'challenge',
                    controls,
                    goal,
                    phantomLabel: 'Fantoma simulado',
                    hints: { tooLow: 'Suba.', tooHigh: 'Desça.' },
                },
            };
        }

        const reach = bench({ kind: 'reach', control: 'kv', atLeast: 100 });
        const match = bench({ kind: 'match', reference: { kv: 70, mas: 10 }, tolerance: 0.05 });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        describe('decodeBenchValue', () => {
            it('devolve os initial quando não há valor', () => {
                expect(decodeBenchValue(undefined, controls)).toEqual({ kv: 70, mas: 10 });
            });

            it('devolve os initial para JSON inválido, sem lançar', () => {
                expect(decodeBenchValue('lixo', controls)).toEqual({ kv: 70, mas: 10 });
            });

            it('devolve os initial quando o JSON não é um objeto', () => {
                expect(decodeBenchValue('[70,10]', controls)).toEqual({ kv: 70, mas: 10 });
                expect(decodeBenchValue('null', controls)).toEqual({ kv: 70, mas: 10 });
                expect(decodeBenchValue('85', controls)).toEqual({ kv: 70, mas: 10 });
            });

            it('troca pelo initial o controle fora da faixa', () => {
                expect(decodeBenchValue('{"kv":999}', controls)).toEqual({ kv: 70, mas: 10 });
                expect(decodeBenchValue('{"kv":39,"mas":20}', controls)).toEqual({ kv: 70, mas: 20 });
            });

            it('troca pelo initial o controle não numérico', () => {
                expect(decodeBenchValue('{"kv":"90","mas":null}', controls)).toEqual({ kv: 70, mas: 10 });
            });

            it('completa com o initial o controle ausente e mantém o válido', () => {
                expect(decodeBenchValue('{"kv":70}', controls)).toEqual({ kv: 70, mas: 10 });
                expect(decodeBenchValue('{"mas":25}', controls)).toEqual({ kv: 70, mas: 25 });
            });

            it('aceita os limites da faixa e ignora chave que não é controle', () => {
                expect(decodeBenchValue('{"kv":120,"mas":1,"x":5}', controls)).toEqual({ kv: 120, mas: 1 });
            });

            it('faz o caminho de ida e volta com encodeBenchValue', () => {
                expect(decodeBenchValue(encodeBenchValue({ kv: 95, mas: 12 }), controls)).toEqual({ kv: 95, mas: 12 });
                expect(encodeBenchValue({ kv: 70, mas: 10 })).toBe('{"kv":70,"mas":10}');
            });
        });

        describe('isCompleteInteractionValue', () => {
            it('exige um valor que seja objeto JSON', () => {
                expect(isCompleteInteractionValue(reach, undefined)).toBe(false);
                expect(isCompleteInteractionValue(reach, 'lixo')).toBe(false);
                expect(isCompleteInteractionValue(reach, '[1]')).toBe(false);
                expect(isCompleteInteractionValue(reach, encodeBenchValue({ kv: 70, mas: 10 }))).toBe(true);
            });
        });

        describe('reach', () => {
            it('99 kV não alcança o mínimo de 100, e 100 kV alcança', () => {
                expect(isCorrectInteractionValue(reach, encodeBenchValue({ kv: 99, mas: 10 }))).toBe(false);
                expect(isCorrectInteractionValue(reach, encodeBenchValue({ kv: 100, mas: 10 }))).toBe(true);
            });

            it('olha só o controle do alvo', () => {
                expect(isCorrectInteractionValue(reach, encodeBenchValue({ kv: 100, mas: 1 }))).toBe(true);
                expect(isCorrectInteractionValue(reach, encodeBenchValue({ kv: 99, mas: 40 }))).toBe(false);
            });

            it('respeita atMost', () => {
                const atMost = bench({ kind: 'reach', control: 'mas', atMost: 5 });
                expect(isCorrectInteractionValue(atMost, encodeBenchValue({ kv: 70, mas: 5 }))).toBe(true);
                expect(isCorrectInteractionValue(atMost, encodeBenchValue({ kv: 70, mas: 6 }))).toBe(false);
            });

            it('exige as duas pontas quando as duas existem', () => {
                const faixa = bench({ kind: 'reach', control: 'kv', atLeast: 60, atMost: 80 });
                expect(isCorrectInteractionValue(faixa, encodeBenchValue({ kv: 59, mas: 10 }))).toBe(false);
                expect(isCorrectInteractionValue(faixa, encodeBenchValue({ kv: 70, mas: 10 }))).toBe(true);
                expect(isCorrectInteractionValue(faixa, encodeBenchValue({ kv: 81, mas: 10 }))).toBe(false);
            });

            it('um valor fora da faixa do controle volta ao initial e não passa por correto', () => {
                // 999 kV não é lido como "muito alto": cai no initial (70), que não alcança 100.
                expect(isCorrectInteractionValue(reach, '{"kv":999}')).toBe(false);
            });
        });

        describe('match', () => {
            it('a própria referência é correta e 110 kV não é', () => {
                expect(isCorrectInteractionValue(match, encodeBenchValue({ kv: 70, mas: 10 }))).toBe(true);
                expect(isCorrectInteractionValue(match, encodeBenchValue({ kv: 110, mas: 10 }))).toBe(false);
            });

            it('o mAs não muda o contraste, então não desfaz o acerto', () => {
                expect(isCorrectInteractionValue(match, encodeBenchValue({ kv: 70, mas: 40 }))).toBe(true);
                expect(isCorrectInteractionValue(match, encodeBenchValue({ kv: 70, mas: 1 }))).toBe(true);
            });

            it('o contraste do aluno é comparado ao da referência dentro da tolerância', () => {
                const contrast = (kv: number) =>
                    exposure.subjectContrast(exposure.exposureModel({ kv, mas: 10 }));
                const reference = contrast(70);
                // Os dois lados da tolerância: um kV vizinho passa, um distante não.
                const near = bench({ kind: 'match', reference: { kv: 70, mas: 10 }, tolerance: Math.abs(contrast(75) - reference) + 1e-9 });
                expect(isCorrectInteractionValue(near, encodeBenchValue({ kv: 75, mas: 10 }))).toBe(true);
                expect(isCorrectInteractionValue(near, encodeBenchValue({ kv: 85, mas: 10 }))).toBe(false);
            });

            it('compara também o fundo: com o contraste igual, só o fundo decide', () => {
                // O modelo real tem fundo constante, então o fundo só pode ser
                // exercitado com o modelo substituído: contraste 0,4 nos dois lados.
                const saida = (background: number) => ({ bone: 0.9, soft: 0.5, background, noise: 0.04 });
                const spy = jest.spyOn(exposure, 'exposureModel');
                const aluno = encodeBenchValue({ kv: 80, mas: 10 });

                // Validade: fundo igual e contraste igual, o aluno acerta.
                spy.mockImplementation(() => saida(0.02));
                expect(isCorrectInteractionValue(match, aluno)).toBe(true);

                // Defeito: fundo 0,38 acima do da referência, fora da tolerância de 0,05.
                spy.mockImplementation((input) => saida(input.kv === 70 ? 0.02 : 0.4));
                expect(isCorrectInteractionValue(match, aluno)).toBe(false);
            });
        });

        // Conteúdo escrito à mão pode chegar sem `reference` válida; a validação o
        // recusa (`invalid-goal`), mas o player não pode lançar se ele passar.
        const semReferencia: [string, unknown][] = [
            ['ausente', undefined],
            ['nula', null],
            ['sem kv', { mas: 10 }],
            ['sem mas', { kv: 70 }],
            ['com kv NaN', { kv: Number.NaN, mas: 10 }],
        ];

        describe('match com referência inválida', () => {
            it.each(semReferencia)('isCorrectInteractionValue devolve false, sem lançar, com referência %s', (_nome, reference) => {
                const quebrada = bench({ kind: 'match', tolerance: 0.05, reference } as unknown as BenchGoal);
                const value = encodeBenchValue({ kv: 70, mas: 10 });
                expect(() => isCorrectInteractionValue(quebrada, value)).not.toThrow();
                expect(isCorrectInteractionValue(quebrada, value)).toBe(false);
            });
        });

        describe('benchDirection', () => {
            it('80 kV está abaixo do mínimo de 100: tooLow', () => {
                expect(benchDirection(reach, encodeBenchValue({ kv: 80, mas: 10 }))).toBe('tooLow');
            });

            it('quem alcança o alvo está ok', () => {
                expect(benchDirection(reach, encodeBenchValue({ kv: 100, mas: 10 }))).toBe('ok');
            });

            it('acima do atMost é tooHigh', () => {
                const atMost = bench({ kind: 'reach', control: 'kv', atMost: 60 });
                expect(benchDirection(atMost, encodeBenchValue({ kv: 90, mas: 10 }))).toBe('tooHigh');
                expect(benchDirection(atMost, encodeBenchValue({ kv: 60, mas: 10 }))).toBe('ok');
            });

            it('em match, o kV abaixo da referência é tooLow e acima é tooHigh', () => {
                expect(benchDirection(match, encodeBenchValue({ kv: 50, mas: 10 }))).toBe('tooLow');
                expect(benchDirection(match, encodeBenchValue({ kv: 110, mas: 10 }))).toBe('tooHigh');
                expect(benchDirection(match, encodeBenchValue({ kv: 70, mas: 10 }))).toBe('ok');
            });

            it('concorda com isCorrectInteractionValue: ok se e só se correto', () => {
                for (const kv of [40, 60, 70, 80, 100, 120]) {
                    const value = encodeBenchValue({ kv, mas: 10 });
                    expect(benchDirection(reach, value) === 'ok').toBe(isCorrectInteractionValue(reach, value));
                    expect(benchDirection(match, value) === 'ok').toBe(isCorrectInteractionValue(match, value));
                }
            });

            it.each(semReferencia)('devolve ok, sem lançar, para match com referência %s', (_nome, reference) => {
                const quebrada = bench({ kind: 'match', tolerance: 0.05, reference } as unknown as BenchGoal);
                expect(() => benchDirection(quebrada, encodeBenchValue({ kv: 50, mas: 10 }))).not.toThrow();
                expect(benchDirection(quebrada, encodeBenchValue({ kv: 50, mas: 10 }))).toBe('ok');
            });

            it('devolve ok para interação que não é bancada', () => {
                const choice: LearningInteractionV2 = {
                    ...base,
                    type: 'multiple-choice',
                    payload: { prompt: 'P', options: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }], correctOptionId: 'a' },
                };
                expect(benchDirection(choice, 'b')).toBe('ok');
            });
        });
    });
});
