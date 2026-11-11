import type {
    BenchGoal,
    ChoiceOption,
    LearningActivityV2,
    LearningInteractionV2,
} from '../../../types/learningActivity';
import { learningActivityWarnings, validateLearningActivity } from '../../../types/learningActivity';
import { encodeBenchValue } from '../renderers/InteractionAnswerValue';
import { feedbackFor } from './feedbackFor';

const base = {
    id: 'interaction:test',
    competencyIds: ['competency:test'],
    evidenceKind: 'guided-practice' as const,
    completionRule: 'answered' as const,
    criticalSafety: false,
    feedback: { correct: 'Isso mesmo.', incorrect: 'Reveja o conceito.' },
    accessibility: { label: 'Atividade de teste' },
};

function choice(
    type: 'multiple-choice' | 'comparison' | 'case-decision',
    options: ChoiceOption[],
): LearningInteractionV2 {
    return { ...base, type, payload: { prompt: 'Qual?', options, correctOptionId: 'a' } };
}

const options: ChoiceOption[] = [
    { id: 'a', label: 'A', explanation: 'A é a certa porque sim.' },
    { id: 'b', label: 'B', explanation: 'B erra porque o tempo não protege.' },
    { id: 'c', label: 'C' },
    { id: 'd', label: 'D', explanation: '   ' },
];

function bench(goal: BenchGoal): LearningInteractionV2 {
    return {
        ...base,
        type: 'bench',
        payload: {
            prompt: 'Ajuste a exposição.',
            simulator: 'exposure',
            mode: 'challenge',
            controls: [
                { id: 'kv', label: 'Tensão', unit: 'kV', min: 40, max: 120, step: 5, initial: 70 },
                { id: 'mas', label: 'Carga', unit: 'mAs', min: 1, max: 40, step: 1, initial: 10 },
            ],
            goal,
            phantomLabel: 'Fantoma simulado',
            hints: { tooLow: 'Suba o kV.', tooHigh: 'Desça o kV.' },
        },
    };
}

describe('feedbackFor', () => {
    describe('acerto', () => {
        it('devolve feedback.correct, mesmo que a alternativa tenha explicação', () => {
            expect(feedbackFor(choice('multiple-choice', options), 'a', true)).toBe('Isso mesmo.');
        });

        it('devolve feedback.correct na bancada, sem dica de direção', () => {
            const reach = bench({ kind: 'reach', control: 'kv', atLeast: 100 });
            expect(feedbackFor(reach, encodeBenchValue({ kv: 100, mas: 10 }), true)).toBe('Isso mesmo.');
        });
    });

    describe('escolha errada', () => {
        it.each(['multiple-choice', 'comparison', 'case-decision'] as const)(
            'em %s, devolve a explicação da alternativa marcada',
            (type) => {
                expect(feedbackFor(choice(type, options), 'b', false)).toBe('B erra porque o tempo não protege.');
            },
        );

        it('sem explicação na alternativa marcada, devolve feedback.incorrect', () => {
            expect(feedbackFor(choice('multiple-choice', options), 'c', false)).toBe('Reveja o conceito.');
        });

        it('explicação em branco conta como ausente', () => {
            expect(feedbackFor(choice('multiple-choice', options), 'd', false)).toBe('Reveja o conceito.');
        });

        it('sem alternativa marcada ou com id desconhecido, devolve feedback.incorrect', () => {
            expect(feedbackFor(choice('multiple-choice', options), undefined, false)).toBe('Reveja o conceito.');
            expect(feedbackFor(choice('multiple-choice', options), 'zzz', false)).toBe('Reveja o conceito.');
        });
    });

    describe('bancada errada', () => {
        const reach = bench({ kind: 'reach', control: 'kv', atLeast: 100 });
        const match = bench({ kind: 'match', reference: { kv: 70, mas: 10 }, tolerance: 0.05 });

        it('abaixo do alvo, devolve hints.tooLow', () => {
            expect(feedbackFor(reach, encodeBenchValue({ kv: 80, mas: 10 }), false)).toBe('Suba o kV.');
        });

        it('acima do alvo, devolve hints.tooHigh', () => {
            const atMost = bench({ kind: 'reach', control: 'kv', atMost: 60 });
            expect(feedbackFor(atMost, encodeBenchValue({ kv: 90, mas: 10 }), false)).toBe('Desça o kV.');
        });

        it('em match, segue o lado do kV em relação à referência', () => {
            expect(feedbackFor(match, encodeBenchValue({ kv: 50, mas: 10 }), false)).toBe('Suba o kV.');
            expect(feedbackFor(match, encodeBenchValue({ kv: 110, mas: 10 }), false)).toBe('Desça o kV.');
        });

        it('sem direção (resposta fora do contrato), devolve feedback.incorrect', () => {
            expect(feedbackFor(reach, undefined, false)).toBe('Reveja o conceito.');
            // match sem referência: benchDirection devolve 'ok' e a dica não vale.
            const quebrada = bench({ kind: 'match', tolerance: 0.05 } as unknown as BenchGoal);
            expect(feedbackFor(quebrada, encodeBenchValue({ kv: 50, mas: 10 }), false)).toBe('Reveja o conceito.');
        });

        it('dica em branco cai em feedback.incorrect', () => {
            const semDica = bench({ kind: 'reach', control: 'kv', atLeast: 100 });
            if (semDica.type === 'bench') {
                semDica.payload.hints = { tooLow: '  ', tooHigh: 'Desça o kV.' };
            }
            expect(feedbackFor(semDica, encodeBenchValue({ kv: 80, mas: 10 }), false)).toBe('Reveja o conceito.');
        });
    });

    describe('qualquer outro erro', () => {
        it('devolve feedback.incorrect em hotspot, ordering e matching', () => {
            const hotspot: LearningInteractionV2 = {
                ...base,
                type: 'hotspot',
                payload: {
                    prompt: 'Onde?',
                    imageRef: 'img',
                    regions: [{ id: 'r1', label: 'R1', x: 0, y: 0, width: 0.5, height: 0.5 }],
                    correctRegionIds: ['r1'],
                },
            };
            const ordering: LearningInteractionV2 = {
                ...base,
                type: 'ordering',
                payload: { prompt: 'Ordene.', items: [{ id: 'x', label: 'X' }, { id: 'y', label: 'Y' }], correctOrder: ['x', 'y'] },
            };
            expect(feedbackFor(hotspot, 'r2', false)).toBe('Reveja o conceito.');
            expect(feedbackFor(ordering, '["y","x"]', false)).toBe('Reveja o conceito.');
        });
    });
});

describe('learningActivityWarnings — missing-option-explanation', () => {
    function activityWith(interaction: LearningInteractionV2): LearningActivityV2 {
        return {
            id: 'activity:aviso-1',
            competencyIds: ['competency:test'],
            provenance: { contentVersion: 'v1', sourceIds: ['source:1'] },
            steps: [
                { kind: 'presentation', id: 'step:hook', role: 'hook', payload: { title: 'Gancho' } },
                { kind: 'interaction', interaction },
                { kind: 'presentation', id: 'step:closing', role: 'closing', payload: { title: 'Fim' } },
            ],
        };
    }

    it('avisa quando uma alternativa errada não tem explicação', () => {
        const warnings = learningActivityWarnings(activityWith(choice('multiple-choice', options)));
        expect(warnings).toEqual([{ path: 'interaction:test', rule: 'missing-option-explanation' }]);
    });

    it.each(['comparison', 'case-decision'] as const)('avisa também em %s', (type) => {
        expect(learningActivityWarnings(activityWith(choice(type, [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }]))))
            .toEqual([{ path: 'interaction:test', rule: 'missing-option-explanation' }]);
    });

    it('trata explicação em branco como ausente', () => {
        const emBranco = [{ id: 'a', label: 'A' }, { id: 'b', label: 'B', explanation: '  ' }];
        expect(learningActivityWarnings(activityWith(choice('multiple-choice', emBranco))))
            .toHaveLength(1);
    });

    it('não avisa pela alternativa certa sem explicação', () => {
        const soCertaSemExplicacao = [{ id: 'a', label: 'A' }, { id: 'b', label: 'B', explanation: 'Porque não.' }];
        expect(learningActivityWarnings(activityWith(choice('multiple-choice', soCertaSemExplicacao)))).toEqual([]);
    });

    it('não avisa quando toda alternativa errada explica', () => {
        const completas = [{ id: 'a', label: 'A' }, { id: 'b', label: 'B', explanation: 'Porque não.' }];
        expect(learningActivityWarnings(activityWith(choice('multiple-choice', completas)))).toEqual([]);
    });

    it('é aviso, não reprovação: validateLearningActivity continua sem apontá-lo', () => {
        const activity = activityWith(choice('multiple-choice', options));
        expect(learningActivityWarnings(activity)).toHaveLength(1);
        expect(validateLearningActivity(activity)).toEqual([]);
    });
});
