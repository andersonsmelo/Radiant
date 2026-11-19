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
    // Nascem pendentes: as tarefas 9 e 10 definem o contrato e trocam por um exemplo completo.
    'parameter-lab': 'pending',
    'risk-hunt': 'pending',
};
