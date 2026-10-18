import { AssessmentAttemptRepository } from './AssessmentAttemptRepository';
import { MemoryKeyValueStorage } from './storage';
import { MATERIA_ENERGIA_E_RADIACAO_PRODUCTION_BATCH as batch } from './production-batches';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { ItemReviewRepository } from '../spaced-repetition/repositories/ItemReviewRepository';

const activities = batch.activities.filter(activity => activity.competencyIds.includes(batch.activities[0].competencyIds[0]));
function submission(id: string) {
    return {
        operationId: `operation:${id}`, checkpointId: `checkpoint:${id}`, flowId: 'flow:assessment', attemptId: id,
        checkpointDefinitionId: 'definition:assessment', unitId: batch.unitId, journeyNodeId: 'node:assessment',
        activityId: batch.batchId, contentVersion: batch.contentVersion, curriculumKind: 'v2' as const,
        committedAt: `2026-10-12T12:00:0${id.match(/:(\d)$/)?.[1] ?? '0'}Z`, itemOutcomes: [{
            itemId: 'item:one', activityId: activities[0].id, competencyIds: [...activities[0].competencyIds],
            evidenceKind: 'independent-recall' as const, outcome: 'incorrect' as const,
            isCriticalError: false, hintUsed: false, durationBucket: 'unknown' as const,
        }],
    };
}
async function reinforce(repository: AssessmentAttemptRepository) {
    for (const activity of activities) {
        const answers = Object.fromEntries(activity.steps.flatMap(step => step.kind === 'interaction' ? [[step.interaction.id, true]] : []));
        await repository.completeActivity(activity, answers);
    }
}

describe('histórico persistente da avaliação V2', () => {
    it('não projeta nem sobrescreve quando tentativa e intent persistidos divergem', async () => {
        const storage = new MemoryKeyValueStorage(); const input = submission('attempt:corrupt');
        await new AssessmentAttemptRepository(storage).submit(input, batch.activities);
        const store = JSON.parse(storage.snapshot()[STORAGE_KEYS.ASSESSMENT_ATTEMPTS]);
        store.attempts[0].journalStatus = 'pending';
        store.attempts[0].evaluation.attempt.itemOutcomes[0].hintUsed = true;
        await storage.setItem(STORAGE_KEYS.ASSESSMENT_ATTEMPTS, JSON.stringify(store));
        const before = storage.snapshot();
        await expect(new AssessmentAttemptRepository(storage).getState(input.journeyNodeId)).rejects.toThrow('assessment-history-invalid');
        expect(storage.snapshot()).toEqual(before);
    });
    it.each([STORAGE_KEYS.ASSESSMENT_ATTEMPTS, STORAGE_KEYS.ITEM_REVIEW])('falha na primeira escrita de %s não confirma a operação e retry restaura uma vez', async keyToFail => {
        const storage = new MemoryKeyValueStorage(); const input = submission('attempt:write');
        const set = storage.setItem.bind(storage); let failed = false;
        jest.spyOn(storage, 'setItem').mockImplementation(async (key, raw) => {
            if (!failed && key === keyToFail) { failed = true; throw Error('full'); }
            return set(key, raw);
        });
        await expect(new AssessmentAttemptRepository(storage).submit(input, batch.activities)).rejects.toThrow();
        expect(await new ItemReviewRepository(storage).getAttempts()).toEqual([]);
        await new AssessmentAttemptRepository(storage).submit(input, batch.activities);
        expect(await new ItemReviewRepository(storage).getAttempts()).toHaveLength(1);
        expect(JSON.parse(storage.snapshot()[STORAGE_KEYS.ASSESSMENT_ATTEMPTS]).attempts).toHaveLength(1);
    });

    it('morte após confirmar o journal e antes do recibo retoma sem duplicar na reabertura', async () => {
        const storage = new MemoryKeyValueStorage(); const input = submission('attempt:receipt');
        const set = storage.setItem.bind(storage); let ledgerWrites = 0;
        jest.spyOn(storage, 'setItem').mockImplementation(async (key, raw) => {
            if (key === STORAGE_KEYS.ASSESSMENT_ATTEMPTS && ++ledgerWrites === 2) throw Error('crash');
            return set(key, raw);
        });
        await expect(new AssessmentAttemptRepository(storage).submit(input, batch.activities)).rejects.toThrow('crash');
        const journal = new ItemReviewRepository(storage);
        const before = storage.snapshot()[STORAGE_KEYS.ITEM_REVIEW];
        expect(await journal.getAttempts()).toHaveLength(1);
        expect(JSON.parse(storage.snapshot()[STORAGE_KEYS.ASSESSMENT_ATTEMPTS]).attempts[0].journalStatus).toBe('pending');
        await new AssessmentAttemptRepository(storage).getState(input.journeyNodeId);
        expect(storage.snapshot()[STORAGE_KEYS.ITEM_REVIEW]).toBe(before);
        expect(JSON.parse(storage.snapshot()[STORAGE_KEYS.ASSESSMENT_ATTEMPTS]).attempts[0].journalStatus).toBe('confirmed');
    });

    it('duas instâncias da mesma porta não perdem avaliações concorrentes', async () => {
        const storage = new MemoryKeyValueStorage();
        await Promise.all(['a', 'b'].map(id => new AssessmentAttemptRepository(storage).submit({ ...submission(`attempt:${id}`), journeyNodeId: `node:${id}` }, batch.activities)));
        expect(JSON.parse(storage.snapshot()[STORAGE_KEYS.ASSESSMENT_ATTEMPTS]).attempts).toHaveLength(2);
        expect(await new ItemReviewRepository(storage).getAttempts()).toHaveLength(2);
    });

    it('histórico anterior sem marcador continua legível e não gera backfill implícito', async () => {
        const storage = new MemoryKeyValueStorage(); const input = submission('attempt:legacy');
        await new AssessmentAttemptRepository(storage).submit(input, batch.activities);
        const legacy = JSON.parse(storage.snapshot()[STORAGE_KEYS.ASSESSMENT_ATTEMPTS]);
        delete legacy.attempts[0].journalStatus;
        await storage.setItem(STORAGE_KEYS.ASSESSMENT_ATTEMPTS, JSON.stringify(legacy));
        await storage.removeItem(STORAGE_KEYS.ITEM_REVIEW);
        expect((await new AssessmentAttemptRepository(storage).getState(input.journeyNodeId)).blocked).toBe(true);
        expect(await new ItemReviewRepository(storage).getAttempts()).toEqual([]);
    });

    it('projeta todos os itens de uma avaliação confirmada no journal comum, inclusive reprovação', async () => {
        const storage = new MemoryKeyValueStorage();
        const repository = new AssessmentAttemptRepository(storage);
        const input = submission('attempt:journal');
        input.itemOutcomes.push({ ...input.itemOutcomes[0], itemId: 'item:two' });
        await repository.submit(input, batch.activities);
        const journal = new ItemReviewRepository(storage);
        expect(await journal.getAttempts()).toHaveLength(2);
        expect(await journal.getCards()).toHaveLength(2);
        expect((await journal.getAttempts())[0]).toMatchObject({ mode: 'assessment', firstOutcome: 'incorrect', recordedAt: '2026-10-12T12:00:00.000Z' });
        await new AssessmentAttemptRepository(storage).submit(input, batch.activities);
        expect(await journal.getAttempts()).toHaveLength(2);
    });

    it('recusa mesmo ID com respostas diferentes sem mudar o histórico', async () => {
        const storage = new MemoryKeyValueStorage();
        const repository = new AssessmentAttemptRepository(storage);
        const input = submission('attempt:conflict');
        await repository.submit(input, batch.activities);
        const before = storage.snapshot();
        await expect(repository.submit({ ...input, itemOutcomes: [{ ...input.itemOutcomes[0], hintUsed: true }] }, batch.activities))
            .rejects.toThrow('assessment-idempotency-conflict');
        expect(storage.snapshot()).toEqual(before);
    });

    it('preserva journal futuro e retoma a tentativa persistida após recuperar a dependência', async () => {
        const storage = new MemoryKeyValueStorage();
        const future = '{"schemaVersion":"item-review.v9","future":true}';
        await storage.setItem(STORAGE_KEYS.ITEM_REVIEW, future);
        const input = submission('attempt:retry');
        await expect(new AssessmentAttemptRepository(storage).submit(input, batch.activities)).rejects.toThrow('assessment-journal-unavailable');
        expect(storage.snapshot()[STORAGE_KEYS.ITEM_REVIEW]).toBe(future);
        expect(JSON.parse(storage.snapshot()[STORAGE_KEYS.ASSESSMENT_ATTEMPTS]).attempts).toHaveLength(1);
        await storage.removeItem(STORAGE_KEYS.ITEM_REVIEW); // Recuperação explícita da fixture, não rotina do app.
        await new AssessmentAttemptRepository(storage).getState(input.journeyNodeId);
        expect(await new ItemReviewRepository(storage).getAttempts()).toHaveLength(1);
    });

    it('remontar e concluir só parte do reforço não libera outra tentativa', async () => {
        const storage = new MemoryKeyValueStorage();
        const original = new AssessmentAttemptRepository(storage);
        await reinforce(original); // Old lesson completions cannot satisfy a later failure.
        await original.submit(submission('attempt:1'), batch.activities);
        const reopened = new AssessmentAttemptRepository(storage);
        expect((await reopened.getState('node:assessment')).blocked).toBe(true);
        await reopened.completeActivity(activities[0], {}); // Merely opening is insufficient.
        await expect(reopened.submit(submission('attempt:2'), batch.activities)).rejects.toThrow('reinforcement-required');
        const answers = Object.fromEntries(activities[0].steps.flatMap(step => step.kind === 'interaction' ? [[step.interaction.id, false]] : []));
        await reopened.completeActivity(activities[0], answers);
        expect((await reopened.getState('node:assessment')).remainingActivityIds).toEqual(activities.slice(1).map(activity => activity.id));
        await expect(reopened.submit(submission('attempt:2'), batch.activities)).rejects.toThrow('reinforcement-required');
    });

    it('preserva a sequência dos dois ciclos e pede apoio depois da terceira reprovação', async () => {
        const storage = new MemoryKeyValueStorage();
        const repository = new AssessmentAttemptRepository(storage);
        await repository.submit(submission('attempt:1'), batch.activities);
        await reinforce(repository);
        expect((await repository.getState('node:assessment')).blocked).toBe(false);
        const second = await repository.submit(submission('attempt:2'), batch.activities);
        expect(second.attempt).toMatchObject({ sourceAttemptId: 'attempt:1', reinforcementCycle: 1, resultingSupportState: 'cycle-2-required' });
        expect((await repository.getState('node:assessment')).blocked).toBe(true);
        await reinforce(repository);
        const third = await repository.submit(submission('attempt:3'), batch.activities);
        expect(third.attempt).toMatchObject({ sourceAttemptId: 'attempt:2', reinforcementCycle: 2, resultingSupportState: 'support-required' });
        await reinforce(repository);
        await expect(repository.submit(submission('attempt:4'), batch.activities)).rejects.toThrow('reinforcement-required');
        expect(JSON.parse(storage.snapshot()[STORAGE_KEYS.ASSESSMENT_ATTEMPTS]).attempts).toHaveLength(3);
    });

    it('não presume conclusão quando falta conteúdo nem quando o histórico está corrompido', async () => {
        const storage = new MemoryKeyValueStorage();
        const repository = new AssessmentAttemptRepository(storage);
        await repository.submit(submission('attempt:1'), []);
        expect((await repository.getState('node:assessment')).blocked).toBe(true);
        await storage.setItem(STORAGE_KEYS.ASSESSMENT_ATTEMPTS, '{');
        await expect(repository.getState('node:assessment')).rejects.toThrow();
    });

    it('reexecução idempotente não duplica o histórico nem retira o reforço', async () => {
        const storage = new MemoryKeyValueStorage();
        const repository = new AssessmentAttemptRepository(storage);
        const result = await repository.submit(submission('attempt:1'), batch.activities);
        expect(await repository.submit(submission('attempt:1'), batch.activities)).toEqual(result);
        expect(JSON.parse(storage.snapshot()[STORAGE_KEYS.ASSESSMENT_ATTEMPTS]).attempts).toHaveLength(1);
        expect((await repository.getState('node:assessment')).blocked).toBe(true);
    });

    it('não grava identificador inválido nem presume reforço salvo quando a escrita falha', async () => {
        const storage = new MemoryKeyValueStorage();
        const repository = new AssessmentAttemptRepository(storage);
        await expect(repository.submit({ ...submission('attempt:bad'), operationId: 'a'.repeat(97) }, batch.activities))
            .rejects.toThrow('assessment-attempt-invalid');
        expect(storage.snapshot()[STORAGE_KEYS.ASSESSMENT_ATTEMPTS]).toBeUndefined();
        await repository.submit(submission('attempt:1'), batch.activities);
        const failedWrite = jest.spyOn(storage, 'setItem').mockRejectedValueOnce(new Error('storage-full'));
        const activity = activities[0];
        const answers = Object.fromEntries(activity.steps.flatMap(step => step.kind === 'interaction' ? [[step.interaction.id, true]] : []));
        await expect(repository.completeActivity(activity, answers)).rejects.toThrow('storage-full');
        failedWrite.mockRestore();
        expect((await repository.getState('node:assessment')).remainingActivityIds).toContain(activity.id);
        expect((await repository.getState('node:assessment')).blocked).toBe(true);
    });
});
