import type { LearningInteractionV2 } from '../../../types/learningActivity';
import {
    decodeInteractionIdSequence,
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
});
