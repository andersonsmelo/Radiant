import { CheckpointCoordinator } from './CheckpointCoordinator';
import { CheckpointStore } from './CheckpointStore';
import { MemoryKeyValueStorage } from './storage';
import { checkpoint, FIXED_NOW, lessonIntent } from './testFixtures';

describe('off mode legacy byte equivalence', () => {
    it('does not read, write, route or call an authority across the complete public API', async () => {
        const legacy = {
            '@radiant:journey_progress_v2': '{"completedNodeIds":["node-1"],"xp":17}',
            '@radiant:gamification_v1': '{"totalXp":17,"streakDays":2}',
            '@radiant:daily_goal_v1': '{"completedToday":1,"goalPerDay":3}',
            '@radiant:spaced_repetition_v1': '{"cards":{"lesson-1":{"repetitions":2}}}',
            '@radiant:last_route_v1': '/learn/lesson-2',
        };
        const storage = new MemoryKeyValueStorage(legacy);
        const before = storage.snapshot();
        const commit = jest.fn();
        const clock = jest.fn(() => FIXED_NOW);
        const id = jest.fn(() => 'generated');
        const coordinator = new CheckpointCoordinator({ mode: 'off', store: CheckpointStore.active(storage, clock), commitCoordinator: { commit } as never, now: clock, id });

        await expect(coordinator.enter(checkpoint())).resolves.toBeNull();
        await expect(coordinator.progress({ checkpointId: 'checkpoint-1', progressPercent: 50, completedStepCount: 1, totalStepCount: 2, cursorId: 'step-2' })).resolves.toBeNull();
        await expect(coordinator.commit(lessonIntent())).resolves.toEqual({ status: 'off', operation: null });
        await expect(coordinator.leave({ checkpointId: 'checkpoint-1', phase: 'abandoned' })).resolves.toBeNull();
        await expect(coordinator.restoreCandidate({ surface: 'lesson', flowId: 'flow-1', contentVersion: 'content-v1', cursorIds: ['step-1'] })).resolves.toEqual({ kind: 'none' });
        await expect(coordinator.invalidate({ checkpointId: 'checkpoint-1' })).resolves.toBeNull();

        expect(storage.snapshot()).toEqual(before);
        expect(storage.readCount).toBe(0);
        expect(storage.writeCount).toBe(0);
        expect(commit).not.toHaveBeenCalled();
        expect(clock).not.toHaveBeenCalled();
        expect(id).not.toHaveBeenCalled();
    });
});
