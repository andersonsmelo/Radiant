import { CheckpointCoordinator } from './CheckpointCoordinator';
import { CheckpointStore } from './CheckpointStore';
import { MemoryKeyValueStorage } from './storage';
import { createCommitOperation } from './schemas';
import { checkpoint, FIXED_NOW, lessonIntent } from './testFixtures';

describe('CheckpointCoordinator', () => {
    it('records shadow checkpoints without exposing a navigation decision or commit effect', async () => {
        const storage = new MemoryKeyValueStorage();
        const store = CheckpointStore.shadow(storage, () => FIXED_NOW);
        const commit = jest.fn();
        const coordinator = new CheckpointCoordinator({ mode: 'shadow', store, commitCoordinator: { commit } as never, now: () => FIXED_NOW, id: () => 'generated' });
        const entered = await coordinator.enter(checkpoint());
        expect(entered).toEqual({ checkpoint: expect.objectContaining({ checkpointId: 'checkpoint-1' }), navigationDecision: null });
        expect(await coordinator.commit(lessonIntent())).toEqual({ status: 'shadow-recorded', operation: null });
        expect(commit).not.toHaveBeenCalled();
    });

    it('supports enter/progress/leave and rejects invalid terminal transitions', async () => {
        const storage = new MemoryKeyValueStorage();
        const coordinator = new CheckpointCoordinator({ mode: 'active', store: CheckpointStore.active(storage, () => FIXED_NOW), activeSurfaces: ['lesson'], commitCoordinator: { commit: jest.fn() } as never, now: () => FIXED_NOW, id: () => 'generated' });
        await coordinator.enter(checkpoint());
        expect((await coordinator.progress({ checkpointId: 'checkpoint-1', progressPercent: 50, completedStepCount: 1, totalStepCount: 2, cursorId: 'step-2' }))?.checkpoint.phase).toBe('in_progress');
        expect((await coordinator.leave({ checkpointId: 'checkpoint-1', phase: 'abandoned' }))?.checkpoint.phase).toBe('abandoned');
        await expect(coordinator.progress({ checkpointId: 'checkpoint-1', progressPercent: 75, completedStepCount: 2, totalStepCount: 3, cursorId: 'step-3' })).rejects.toThrow('invalid-transition');
    });

    it('deduplicates an identical enter and rejects active commit before in-progress without effects', async () => {
        const storage = new MemoryKeyValueStorage();
        const commit = jest.fn().mockResolvedValue({ operation: createCommitOperation(lessonIntent(), FIXED_NOW) });
        const coordinator = new CheckpointCoordinator({ mode: 'active', store: CheckpointStore.active(storage, () => FIXED_NOW), activeSurfaces: ['lesson'], commitCoordinator: { commit } as never, now: () => FIXED_NOW, id: () => 'generated' });
        await coordinator.enter(checkpoint());
        const writesAfterFirstEnter = storage.writeCount;
        await coordinator.enter(checkpoint());
        expect(storage.writeCount).toBe(writesAfterFirstEnter);
        await expect(coordinator.commit(lessonIntent())).rejects.toThrow('checkpoint-not-ready');
        expect(commit).not.toHaveBeenCalled();
    });

    it('commits an active checkpoint only after in-progress and then marks the checkpoint committed', async () => {
        const storage = new MemoryKeyValueStorage();
        const operation = createCommitOperation(lessonIntent(), FIXED_NOW);
        const commit = jest.fn().mockResolvedValue({ operation: { ...operation, mandatoryState: 'completed' } });
        const store = CheckpointStore.active(storage, () => FIXED_NOW);
        const coordinator = new CheckpointCoordinator({ mode: 'active', store, activeSurfaces: ['lesson'], commitCoordinator: { commit } as never, now: () => FIXED_NOW, id: () => 'generated' });
        await coordinator.enter(checkpoint());
        await coordinator.progress({ checkpointId: 'checkpoint-1', progressPercent: 100, completedStepCount: 1, totalStepCount: 1, cursorId: 'step-1' });
        await expect(coordinator.commit(lessonIntent())).resolves.toMatchObject({ status: 'committed' });
        expect(commit).toHaveBeenCalledWith(lessonIntent());
        expect((await store.getCheckpointById('checkpoint-1'))?.phase).toBe('committed');
    });

    it('offers restore only for the single globally resumable flow', async () => {
        const storage = new MemoryKeyValueStorage();
        const store = CheckpointStore.active(storage, () => FIXED_NOW);
        const coordinator = new CheckpointCoordinator({ mode: 'active', store, activeSurfaces: ['lesson', 'review'], commitCoordinator: { commit: jest.fn() } as never, now: () => FIXED_NOW, id: () => 'generated' });
        await coordinator.enter(checkpoint());
        await coordinator.enter(checkpoint({ checkpointId: 'checkpoint-review', flowId: 'flow-review', surface: 'review', lessonId: undefined, reviewCardId: 'review-card-1' }));
        await expect(coordinator.restoreCandidate({ surface: 'lesson', flowId: 'flow-1', contentVersion: 'content-v1', cursorIds: ['step-1'] })).resolves.toEqual({ kind: 'none' });
    });

    it('invalidates after the second restore failure and falls back to canonical Home', async () => {
        const storage = new MemoryKeyValueStorage();
        const coordinator = new CheckpointCoordinator({ mode: 'active', store: CheckpointStore.active(storage, () => FIXED_NOW), activeSurfaces: ['lesson'], commitCoordinator: { commit: jest.fn() } as never, now: () => FIXED_NOW, id: () => 'generated' });
        await coordinator.enter(checkpoint());
        expect(await coordinator.restoreCandidate({ surface: 'lesson', flowId: 'other-flow', contentVersion: 'content-v1', cursorIds: ['step-1'] })).toMatchObject({ kind: 'fallback', restoreFailureCount: 1 });
        expect(await coordinator.restoreCandidate({ surface: 'lesson', flowId: 'other-flow', contentVersion: 'content-v1', cursorIds: ['step-1'] })).toMatchObject({ kind: 'fallback', restoreFailureCount: 2, nextAction: 'home' });
    });
});
