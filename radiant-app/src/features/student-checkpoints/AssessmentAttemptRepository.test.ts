import { AssessmentAttemptRepository } from './AssessmentAttemptRepository';
import { MemoryKeyValueStorage } from './storage';
import { MATERIA_ENERGIA_E_RADIACAO_PRODUCTION_BATCH as batch } from './production-batches';
import { STORAGE_KEYS } from '../../constants/storageKeys';

const activities = batch.activities.filter(activity => activity.competencyIds.includes(batch.activities[0].competencyIds[0]));
function submission(id: string) {
    return {
        operationId: `operation:${id}`, checkpointId: `checkpoint:${id}`, flowId: 'flow:assessment', attemptId: id,
        checkpointDefinitionId: 'definition:assessment', unitId: batch.unitId, journeyNodeId: 'node:assessment',
        activityId: batch.batchId, contentVersion: batch.contentVersion, curriculumKind: 'v2' as const,
        committedAt: '2026-10-12T12:00:00Z', itemOutcomes: [{
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
