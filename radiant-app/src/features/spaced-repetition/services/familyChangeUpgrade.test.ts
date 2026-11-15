/**
 * Atualização da 1.5.0 para a 1.6 (ADR-2026-11-13, seção "Quem atualiza").
 * Em M01 a M03, algumas interações de múltipla escolha viraram família nova
 * com o MESMO id e a mesma `contentVersion`. A revisão só sabe mostrar
 * múltipla escolha, então o cartão de uma interação convertida fica sem
 * definição. O comportamento definido: o coordenador o reconcilia (sai da
 * fila), os demais cartões da aula ficam como estavam, a fila e a contagem
 * concordam e nenhuma tela de revisão abre vazia.
 */
import { ItemReviewCoordinator, reviewCatalog, type ItemDefinition } from './ItemReviewService';
import { ItemReviewRepository } from '../repositories/ItemReviewRepository';
import { RTG_2026_BATCHES } from '../../student-checkpoints/batches';

const LESSON = 'activity:rtg-2026:m01:aula-01';
const item = (itemId: string): ItemDefinition => ({
    item: { lessonId: LESSON, itemId, activityId: LESSON, competencyId: 'competency:rtg-2026:m01:aula-01', contentVersion: 'rtg-2026-m01-v1', evidenceKind: 'guided-practice' },
    question: { id: itemId, type: 'multiple-choice', prompt: 'Fixture', options: [{ label: 'A' }, { label: 'B' }], correctAnswerIndex: 0, explanation: 'Fixture' },
});

describe('quem atualiza da 1.5.0 com cartão de interação que mudou de família', () => {
    it('o cartão convertido sai da fila, os outros ficam com a data, e fila e contagem concordam', async () => {
        const data = new Map<string, string>();
        const repository = new ItemReviewRepository({ getItem: async key => data.get(key) ?? null, setItem: async (key, value) => { data.set(key, value); }, removeItem: async key => { data.delete(key); } });
        const ids = ['interaction:rtg-2026:m01:aula-01:i1', 'interaction:rtg-2026:m01:aula-01:i3', 'interaction:rtg-2026:m01:aula-01:i5'];
        // 1.5.0: as três eram múltipla escolha; o estudo criou um cartão para cada.
        for (const [index, id] of ids.entries()) {
            await repository.record({ attemptId: `study:${index}`, item: item(id).item, mode: 'study', firstOutcome: 'correct', finalOutcome: 'correct',
                hintUsed: false, durationBand: 'unknown', recordedAt: `2026-11-0${index + 1}T12:00:00.000Z` });
        }
        const before = await repository.getCards();
        // 1.6: i3 virou true-false e deixou de ter definição de revisão.
        const coordinator = new ItemReviewCoordinator(repository, { definitions: () => [item(ids[0]), item(ids[2])] });
        const later = new Date('2027-01-01T12:00:00.000Z');
        const queue = await coordinator.loadQueue([], later);
        expect(queue.map(entry => entry.question.id)).toEqual([ids[0], ids[2]]);
        expect(await coordinator.dueCount([], later)).toBe(queue.length);
        const after = await repository.getCards();
        expect(after.map(card => card.item.itemId).sort()).toEqual([ids[0], ids[2]]);
        for (const card of after) expect(card).toEqual(before.find(entry => entry.item.itemId === card.item.itemId));
    });

    it('toda aula de M01 a M03 continua com ao menos uma questão de revisão, e todas são múltipla escolha', () => {
        const units = RTG_2026_BATCHES.filter(batch => /^batch:rtg-2026:(m01|m02|m03)$/.test(batch.batchId));
        expect(units).toHaveLength(3);
        for (const activity of units.flatMap(batch => batch.activities)) {
            const definitions = reviewCatalog.definitions(activity.id);
            expect(definitions.length).toBeGreaterThan(0);
            const multipleChoice = new Set(activity.steps.flatMap(step => step.kind === 'interaction' && step.interaction.type === 'multiple-choice' ? [step.interaction.id] : []));
            for (const definition of definitions) expect(multipleChoice.has(definition.item.itemId)).toBe(true);
        }
    });
});
