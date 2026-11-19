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

describe('feedbackFor: famílias da 1.6', () => {
    it('true-false: o erro usa o retorno de erro autoral, sem repetir a explicação já lida na afirmação', () => {
        const interaction: LearningInteractionV2 = { ...base, type: 'true-false', payload: { prompt: 'Julgue.', statements: [
            { id: 's1', text: 'Um.', isTrue: true, explanation: 'Um é certa porque a fonte diz.' },
            { id: 's2', text: 'Dois.', isTrue: false, explanation: 'Dois é errada: o dosímetro não protege.' },
        ] } };
        expect(feedbackFor(interaction, '[true,true]', false)).toBe('Reveja o conceito.');
        expect(feedbackFor(interaction, '[true,false]', true)).toBe('Isso mesmo.');
    });

    it('multi-select: o erro diz quais faltaram e quais sobraram, com a explicação da primeira divergência', () => {
        const interaction: LearningInteractionV2 = { ...base, type: 'multi-select', payload: { prompt: 'Marque.', correctOptionIds: ['a', 'c'], options: [
            { id: 'a', label: 'Avental', explanation: 'O avental reduz a dose no tronco.' },
            { id: 'b', label: 'Relógio', explanation: 'O relógio não protege de nada.' },
            { id: 'c', label: 'Distância', explanation: 'A distância reduz a dose.' },
            { id: 'd', label: 'Pressa', explanation: 'Pressa não é proteção.' },
        ] } };
        expect(feedbackFor(interaction, '["a","b"]', false))
            .toBe('Faltou marcar: Distância. Marcou a mais: Relógio. O relógio não protege de nada.');
        expect(feedbackFor(interaction, '["a"]', false)).toBe('Faltou marcar: Distância. A distância reduz a dose.');
    });

    it('cloze e categorize: o erro usa o retorno de erro autoral', () => {
        const cloze: LearningInteractionV2 = { ...base, type: 'cloze', payload: { prompt: 'Complete.', segments: ['A ', '.'],
            blanks: [{ id: 'b1', correctTokenId: 't1' }], tokens: [{ id: 't1', label: 'x' }, { id: 't2', label: 'y' }] } };
        expect(feedbackFor(cloze, '["t2"]', false)).toBe('Reveja o conceito.');
    });

    it('label: o erro acrescenta o rótulo certo do primeiro ponto errado, na ordem dos pontos', () => {
        const interaction: LearningInteractionV2 = { ...base, type: 'label', payload: { prompt: 'Rotule.', imageRef: 'diagram:tubo-raios-x',
            points: [{ id: 'p1', x: 0.3, y: 0.4, where: 'posição 1 da figura', correctLabelId: 'l1' }, { id: 'p2', x: 0.7, y: 0.4, where: 'posição 2 da figura', correctLabelId: 'l2' }, { id: 'p3', x: 0.7, y: 0.7, where: 'posição 3 da figura', correctLabelId: 'l3' }],
            labels: [{ id: 'l3', label: 'Janela' }, { id: 'l1', label: 'Cátodo' }, { id: 'l2', label: 'Ânodo' }] } };
        expect(feedbackFor(interaction, JSON.stringify({ p1: 'l1', p2: 'l3', p3: 'l2' }), false)).toBe('Reveja o conceito. Ponto 2 é Ânodo.');
        expect(feedbackFor(interaction, JSON.stringify({ p1: 'l2', p2: 'l1', p3: 'l3' }), false)).toBe('Reveja o conceito. Ponto 1 é Cátodo.');
        expect(feedbackFor(interaction, JSON.stringify({ p1: 'l1', p2: 'l2', p3: 'l3' }), true)).toBe('Isso mesmo.');
    });

    it('risk-hunt: o erro diz o que faltou e o que sobrou, com a explicação da primeira divergência na ordem da cena', () => {
        const interaction: LearningInteractionV2 = { ...base, type: 'risk-hunt', payload: { prompt: 'Marque os riscos.', imageRef: 'diagram:sala-com-riscos',
            riskRegionIds: ['a', 'c'], regions: [
                { id: 'a', label: 'Porta aberta', x: 0.02, y: 0.08, width: 0.15, height: 0.8, explanation: 'A porta aberta expõe o corredor.' },
                { id: 'b', label: 'Operador atrás do biombo', x: 0.7, y: 0.43, width: 0.17, height: 0.47, explanation: 'O biombo protege o operador.' },
                { id: 'c', label: 'Campo grande', x: 0.18, y: 0.26, width: 0.33, height: 0.4, explanation: 'O campo grande expõe tecido à toa.' },
            ] } };
        expect(feedbackFor(interaction, '["a","b"]', false))
            .toBe('Faltou marcar: Campo grande. Marcou a mais: Operador atrás do biombo. O biombo protege o operador.');
        expect(feedbackFor(interaction, '["a"]', false)).toBe('Faltou marcar: Campo grande. O campo grande expõe tecido à toa.');
        expect(feedbackFor(interaction, '["a","c"]', true)).toBe('Isso mesmo.');
    });

    it('conversation: o erro acrescenta a resposta que cabia no primeiro turno errado', () => {
        const interaction: LearningInteractionV2 = { ...base, type: 'conversation', payload: { prompt: 'Conduza.', speaker: 'duda',
            turns: [
                { id: 't1', line: 'Como começo?', correctOptionId: 'a2', options: [{ id: 'a1', label: 'Pela pressa.', reply: 'Hum.' }, { id: 'a2', label: 'Conferindo o pedido.', reply: 'Faz sentido.' }] },
                { id: 't2', line: 'E o avental?', correctOptionId: 'b1', options: [{ id: 'b1', label: 'Vestir antes.', reply: 'Certo.' }, { id: 'b2', label: 'Deixar de lado.', reply: 'Tá.' }] },
            ] } };
        expect(feedbackFor(interaction, '["a2","b2"]', false)).toBe('Reveja o conceito. No turno 2, a resposta era: Vestir antes.');
        expect(feedbackFor(interaction, '["a1","b2"]', false)).toBe('Reveja o conceito. No turno 1, a resposta era: Conferindo o pedido.');
        expect(feedbackFor(interaction, '["a2","b1"]', true)).toBe('Isso mesmo.');
    });

    it('blitz: o erro diz quantas acertou e traz a explicação da primeira que errou (o tempo esgotado também conta como errada)', () => {
        const statements = [
            { id: 's1', text: 'Um.', isTrue: true, explanation: 'Um é certa porque a fonte diz.' },
            { id: 's2', text: 'Dois.', isTrue: false, explanation: 'Dois é errada: o dosímetro não protege.' },
            { id: 's3', text: 'Três.', isTrue: true, explanation: 'Três é certa: cobre o tronco.' },
            { id: 's4', text: 'Quatro.', isTrue: false, explanation: 'Quatro é errada.' },
        ];
        const interaction: LearningInteractionV2 = { ...base, type: 'blitz', payload: { prompt: 'Rodada.', passCount: 3, statements } };
        expect(feedbackFor(interaction, '[true,true,true,true]', false)).toBe('Você acertou 2 de 4; para passar eram 3. Dois é errada: o dosímetro não protege.');
        expect(feedbackFor(interaction, '[null,false,false,false]', false)).toBe('Você acertou 2 de 4; para passar eram 3. Um é certa porque a fonte diz.');
        expect(feedbackFor(interaction, '[true,false,true,true]', true)).toBe('Isso mesmo.');
    });
});
