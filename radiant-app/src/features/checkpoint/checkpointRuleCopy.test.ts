import { checkpointIntroCopy, checkpointRequirementCopy, requiredCorrectItems } from './checkpointRuleCopy';
import { UnitCheckpointService } from '../student-checkpoints/UnitCheckpointService';

describe('requiredCorrectItems', () => {
    it.each([
        [2, 8000, 2],
        [5, 8000, 4],
        [10, 8000, 8],
        [3, 8000, 3],
    ])('%i itens com limiar %i exigem %i acertos', (items, target, expected) => {
        expect(requiredCorrectItems(items, target)).toBe(expected);
    });

    // O número anunciado precisa ser o que a avaliação aplica: um acerto a
    // menos reprova, e o número anunciado aprova.
    it.each([2, 3, 5, 10])('concorda com UnitCheckpointService para %i itens', (items) => {
        const required = requiredCorrectItems(items, 8000);
        const evaluate = (correct: number) => UnitCheckpointService.evaluate({
            operationId: 'operation:teste',
            checkpointId: 'checkpoint:teste',
            flowId: 'unit-checkpoint:node:teste',
            attemptId: `attempt:teste:${correct}`,
            checkpointDefinitionId: 'checkpoint:teste',
            unitId: 'unit:teste',
            journeyNodeId: 'node:teste',
            activityId: 'batch:teste',
            contentVersion: 'v-teste',
            curriculumKind: 'v2',
            committedAt: '2026-09-24T12:00:00.000Z',
            itemOutcomes: Array.from({ length: items }, (_, index) => ({
                itemId: `item:${index}`,
                activityId: 'activity:teste',
                competencyIds: ['competency:teste'],
                evidenceKind: 'independent-recall' as const,
                outcome: index < correct ? 'correct' as const : 'incorrect' as const,
                isCriticalError: false,
                hintUsed: false,
                durationBucket: 'unknown' as const,
            })),
        }).attempt.passed;

        expect(evaluate(required)).toBe(true);
        expect(evaluate(required - 1)).toBe(false);
    });
});

describe('texto da regra', () => {
    it('pede todas quando o limiar exige todos os itens', () => {
        expect(checkpointIntroCopy(2, 2)).toBe('Responda as 2 questões. Para avançar, acerte todas.');
    });

    it('diz o mínimo quando ele é menor que o total', () => {
        expect(checkpointIntroCopy(10, 8)).toBe('Responda 10 questões. Para avançar, acerte pelo menos 8.');
    });

    it('concorda o número com a palavra', () => {
        expect(checkpointRequirementCopy(1)).toBe('A aprovação exige 1 acerto.');
        expect(checkpointRequirementCopy(2)).toBe('A aprovação exige 2 acertos.');
    });
});
