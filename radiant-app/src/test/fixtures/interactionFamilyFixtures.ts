/** Um exemplo completo, com resposta certa e errada, de cada tipo de interação. Só de teste. */
import type { InteractionType, LearningInteractionV2 } from '../../types/learningActivity';
import { encodeBenchValue, encodeInteractionIdSequence } from '../../features/lesson-flow/renderers/InteractionAnswerValue';

export type InteractionFamilyFixture = { interaction: LearningInteractionV2; correctValue: string; wrongValue: string };

const common = {
    competencyIds: ['competency:synthetic:families'],
    evidenceKind: 'guided-practice' as const,
    completionRule: 'answered' as const,
    criticalSafety: false,
    feedback: { correct: 'Isso mesmo, a resposta confere.', incorrect: 'Ainda não, releia o enunciado.' },
};
const label = (name: string) => ({ label: `Interação de exemplo: ${name}` });
const options = [
    { id: 'a', label: 'Primeira', explanation: 'Esta é a certa.' },
    { id: 'b', label: 'Segunda', explanation: 'Esta não é a certa.' },
    { id: 'c', label: 'Terceira', explanation: 'Esta não é a certa.' },
];
const regions = [
    { id: 'r1', label: 'Região um', x: 0.1, y: 0.1, width: 0.3, height: 0.3 },
    { id: 'r2', label: 'Região dois', x: 0.5, y: 0.5, width: 0.3, height: 0.3 },
];

export const INTERACTION_FAMILY_FIXTURES: Record<InteractionType, InteractionFamilyFixture | 'pending'> = {
    'multiple-choice': {
        interaction: { ...common, id: 'fx:mc', type: 'multiple-choice', accessibility: label('escolha'), payload: { prompt: 'Qual é a certa?', options, correctOptionId: 'a' } },
        correctValue: 'a', wrongValue: 'b',
    },
    'case-decision': {
        interaction: { ...common, id: 'fx:cd', type: 'case-decision', accessibility: label('caso'), payload: { prompt: 'Qual a decisão?', options, correctOptionId: 'a' } },
        correctValue: 'a', wrongValue: 'b',
    },
    comparison: {
        interaction: { ...common, id: 'fx:cmp', type: 'comparison', accessibility: label('comparação'), payload: { prompt: 'Qual imagem?', options, correctOptionId: 'a' } },
        correctValue: 'a', wrongValue: 'b',
    },
    hotspot: {
        interaction: { ...common, id: 'fx:hs', type: 'hotspot', accessibility: label('região'), payload: { prompt: 'Toque na região certa.', imageRef: 'image:synthetic', regions, correctRegionIds: ['r1'] } },
        correctValue: 'r1', wrongValue: 'r2',
    },
    matching: {
        interaction: {
            ...common, id: 'fx:mt', type: 'matching', accessibility: label('associação'),
            payload: { prompt: 'Associe os pares.', pairs: [{ id: 'p1', left: 'A', right: 'um' }, { id: 'p2', left: 'B', right: 'dois' }] },
        },
        correctValue: encodeInteractionIdSequence(['p1', 'p2']), wrongValue: encodeInteractionIdSequence(['p2', 'p1']),
    },
    ordering: {
        interaction: {
            ...common, id: 'fx:or', type: 'ordering', accessibility: label('ordenação'),
            payload: { prompt: 'Coloque em ordem.', items: [{ id: 'i1', label: 'Primeiro' }, { id: 'i2', label: 'Segundo' }, { id: 'i3', label: 'Terceiro' }], correctOrder: ['i1', 'i2', 'i3'] },
        },
        correctValue: encodeInteractionIdSequence(['i1', 'i2', 'i3']), wrongValue: encodeInteractionIdSequence(['i3', 'i2', 'i1']),
    },
    bench: {
        interaction: {
            ...common, id: 'fx:bn', type: 'bench', accessibility: label('bancada'),
            payload: {
                prompt: 'Suba o kV até 100.', simulator: 'exposure', mode: 'challenge',
                controls: [{ id: 'kv', label: 'Tensão', unit: 'kV', min: 40, max: 120, step: 10, initial: 70 }],
                goal: { kind: 'reach', control: 'kv', atLeast: 100 }, phantomLabel: 'Fantoma simulado',
                hints: { tooLow: 'Suba o kV.', tooHigh: 'Desça o kV.' },
            },
        },
        correctValue: encodeBenchValue({ kv: 100 }), wrongValue: encodeBenchValue({ kv: 70 }),
    },
    cloze: {
        interaction: {
            ...common, id: 'fx:cz', type: 'cloze', accessibility: label('lacuna'),
            payload: {
                prompt: 'Complete a frase.', segments: ['A imagem é ', '.'], blanks: [{ id: 'b1', correctTokenId: 't1' }],
                tokens: [{ id: 't1', label: 'nítida' }, { id: 't2', label: 'escura' }, { id: 't3', label: 'borrada' }],
            },
        },
        correctValue: encodeInteractionIdSequence(['t1']), wrongValue: encodeInteractionIdSequence(['t2']),
    },
    'true-false': {
        interaction: {
            ...common, id: 'fx:tf', type: 'true-false', accessibility: label('certo ou errado'),
            payload: {
                prompt: 'Julgue as afirmações.',
                statements: [
                    { id: 's1', text: 'A primeira vale.', isTrue: true, explanation: 'Esta vale, confira o conceito.' },
                    { id: 's2', text: 'A segunda não vale.', isTrue: false, explanation: 'Esta não vale, confira o conceito.' },
                ],
            },
        },
        correctValue: JSON.stringify([true, false]), wrongValue: JSON.stringify([false, true]),
    },
    categorize: {
        interaction: {
            ...common, id: 'fx:ct', type: 'categorize', accessibility: label('classificação'),
            payload: {
                prompt: 'Classifique os itens.', categories: [{ id: 'g1', label: 'Grupo um' }, { id: 'g2', label: 'Grupo dois' }],
                items: [{ id: 'k1', label: 'Item A', categoryId: 'g1' }, { id: 'k2', label: 'Item B', categoryId: 'g2' }],
            },
        },
        correctValue: JSON.stringify({ k1: 'g1', k2: 'g2' }), wrongValue: JSON.stringify({ k1: 'g2', k2: 'g1' }),
    },
    'multi-select': {
        interaction: {
            ...common, id: 'fx:ms', type: 'multi-select', accessibility: label('múltipla seleção'),
            payload: { prompt: 'Marque todas as corretas.', options, correctOptionIds: ['a', 'c'] },
        },
        correctValue: encodeInteractionIdSequence(['a', 'c']), wrongValue: encodeInteractionIdSequence(['a']),
    },
    label: {
        interaction: {
            ...common, id: 'fx:lb', type: 'label', accessibility: label('rotular'),
            payload: {
                prompt: 'Rotule os pontos.', imageRef: 'diagram:tubo-raios-x',
                points: [{ id: 'pt1', x: 0.3, y: 0.4, where: 'posição 1 da figura', correctLabelId: 'la' }, { id: 'pt2', x: 0.7, y: 0.4, where: 'posição 2 da figura', correctLabelId: 'lb' }],
                labels: [{ id: 'lc', label: 'Terceiro' }, { id: 'la', label: 'Primeiro' }, { id: 'lb', label: 'Segundo' }],
            },
        },
        correctValue: JSON.stringify({ pt1: 'la', pt2: 'lb' }), wrongValue: JSON.stringify({ pt1: 'lb', pt2: 'la' }),
    },
    'risk-hunt': {
        interaction: {
            ...common, id: 'fx:rh', type: 'risk-hunt', accessibility: label('caça ao erro'),
            payload: {
                prompt: 'Marque todos os riscos.', imageRef: 'diagram:sala-com-riscos',
                regions: [
                    { ...regions[0], explanation: 'Este é um risco.' }, { ...regions[1], explanation: 'Esta situação está correta.' },
                    { id: 'r3', label: 'Região três', x: 0.1, y: 0.6, width: 0.3, height: 0.3, explanation: 'Este também é um risco.' },
                ],
                riskRegionIds: ['r1', 'r3'],
            },
        },
        correctValue: encodeInteractionIdSequence(['r1', 'r3']), wrongValue: encodeInteractionIdSequence(['r1', 'r2']),
    },
    conversation: {
        interaction: {
            ...common, id: 'fx:cv', type: 'conversation', accessibility: label('conversa'),
            payload: {
                prompt: 'Conduza a conversa.', speaker: 'duda',
                turns: [
                    { id: 't1', line: 'Como eu começo?', correctOptionId: 'a1', options: [
                        { id: 'a1', label: 'Conferindo o pedido.', reply: 'Faz sentido, vou conferir.' }, { id: 'a2', label: 'Chamando o paciente direto, sem olhar o pedido.', reply: 'Hum, certo.' }] },
                    { id: 't2', line: 'E depois?', correctOptionId: 'b2', options: [
                        { id: 'b1', label: 'Posicionar o aparelho sem conversar com o paciente.', reply: 'Tá bom.' }, { id: 'b2', label: 'Explicar o exame.', reply: 'Boa, ele fica mais calmo.' }] },
                ],
            },
        },
        correctValue: encodeInteractionIdSequence(['a1', 'b2']), wrongValue: encodeInteractionIdSequence(['a1', 'b1']),
    },
    blitz: {
        interaction: {
            ...common, id: 'fx:bz', type: 'blitz', accessibility: label('rodada rápida'),
            payload: {
                prompt: 'Responda a rodada.', passCount: 3,
                statements: [
                    { id: 's1', text: 'A distância reduz a dose.', isTrue: true, explanation: 'Longe da fonte, menos dose.' },
                    { id: 's2', text: 'O dosímetro reduz a dose.', isTrue: false, explanation: 'O dosímetro só mede a dose.' },
                    { id: 's3', text: 'O avental cobre o tronco.', isTrue: true, explanation: 'O avental protege o tronco.' },
                    { id: 's4', text: 'Mais tempo na sala reduz a dose.', isTrue: false, explanation: 'Mais tempo aumenta a dose.' },
                ],
            },
        },
        correctValue: JSON.stringify([true, false, true, false]), wrongValue: JSON.stringify([false, true, true, null]),
    },
    // Nasce pendente: a tarefa 9 define o contrato e troca por um exemplo completo.
    'parameter-lab': 'pending',
};
