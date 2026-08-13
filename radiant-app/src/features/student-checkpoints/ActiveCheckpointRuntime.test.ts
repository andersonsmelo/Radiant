import { ActiveCheckpointRuntime } from './ActiveCheckpointRuntime';
import { CheckpointCoordinator } from './CheckpointCoordinator';
import { CheckpointStore } from './CheckpointStore';
import { MemoryKeyValueStorage } from './storage';
import { checkpoint, FIXED_NOW, unitCheckpointIntent } from './testFixtures';

const lessonBinding = {
    surface: 'lesson' as const,
    flowId: 'lesson:block-1',
    contentVersion: 'content-v1',
    cursorId: 'step-2',
    compatibleCursorIds: ['step-1', 'step-2', 'step-3'],
    progressPercent: 50,
    completedStepCount: 1,
    totalStepCount: 3,
    lessonId: 'lesson-1',
    journeyNodeId: 'node-1',
};

function runtime(mode: unknown = 'active') {
    const storage = new MemoryKeyValueStorage();
    const store = CheckpointStore.active(storage, () => FIXED_NOW);
    const commit = jest.fn().mockResolvedValue({ operation: { mandatoryState: 'completed' } });
    const coordinator = new CheckpointCoordinator({
        mode,
        store,
        activeSurfaces: ['first-run', 'lesson', 'review', 'unit-checkpoint'],
        commitCoordinator: { commit } as never,
        now: () => FIXED_NOW,
        id: () => 'generated',
    });
    return {
        storage,
        store,
        commit,
        runtime: new ActiveCheckpointRuntime({ mode, store, coordinator, now: () => FIXED_NOW, id: () => 'generated' }),
    };
}

function measuredRuntime() {
    const storage = new MemoryKeyValueStorage();
    const store = CheckpointStore.active(storage, () => FIXED_NOW);
    const coordinator = new CheckpointCoordinator({
        mode: 'active',
        store,
        activeSurfaces: ['first-run', 'lesson', 'review', 'unit-checkpoint'],
        commitCoordinator: { commit: jest.fn() } as never,
        now: () => FIXED_NOW,
        id: () => 'generated',
    });
    const measure = jest.fn();
    const performance = {
        async measure<T>(metric: 'persistence' | 'restoration', task: () => Promise<T>) {
            measure(metric);
            return task();
        },
    };
    return {
        store,
        measure,
        runtime: new ActiveCheckpointRuntime({
            mode: 'active',
            store,
            coordinator,
            now: () => FIXED_NOW,
            id: () => 'generated',
            performance,
        }),
    };
}

describe('ActiveCheckpointRuntime', () => {
    it('offers a lesson resume target without navigating automatically', async () => {
        const subject = runtime();
        await subject.store.saveCheckpoint(checkpoint({
            phase: 'in_progress',
            flowId: 'lesson:block:lesson-1:intro',
            journeyNodeId: 'node:lesson-1',
            cursorId: 'step-3',
            completedStepCount: 2,
            totalStepCount: 4,
        }));

        await expect(subject.runtime.inspectLaunch({
            contentVersion: 'content-v1',
            firstRunAvailable: false,
        })).resolves.toEqual({
            kind: 'offer',
            checkpointId: 'checkpoint-1',
            surface: 'lesson',
            cursorId: 'step-3',
            target: {
                kind: 'route',
                pathname: '/learn',
                params: {
                    blockId: 'block:lesson-1:intro',
                    nodeId: 'node:lesson-1',
                    resumeCheckpointId: 'checkpoint-1',
                    resumeCursorId: 'step-3',
                },
            },
        });
    });

    it('keeps first-run resume inside the presentation gate', async () => {
        const subject = runtime();
        await subject.store.saveCheckpoint(checkpoint({
            surface: 'first-run',
            flowId: 'first-run-v1',
            phase: 'in_progress',
            lessonId: undefined,
            cursorId: 'slide-2',
            completedStepCount: 1,
            totalStepCount: 3,
        }));

        await expect(subject.runtime.inspectLaunch({
            contentVersion: 'content-v1',
            firstRunAvailable: true,
        })).resolves.toMatchObject({
            kind: 'offer',
            surface: 'first-run',
            target: { kind: 'first-run', cursorId: 'slide-2' },
        });
    });

    it('keeps non-allowlisted surfaces on canonical Home', async () => {
        const subject = runtime();
        await subject.store.saveCheckpoint(checkpoint({
            surface: 'home',
            flowId: 'home-v1',
            phase: 'in_progress',
            lessonId: undefined,
            cursorId: 'home',
        }));

        await expect(subject.runtime.inspectLaunch({
            contentVersion: 'content-v1',
            firstRunAvailable: false,
        })).resolves.toEqual({ kind: 'none' });
    });

    it('keeps the first incompatible checkpoint and invalidates it on the second failure', async () => {
        const subject = runtime();
        await subject.store.saveCheckpoint(checkpoint({
            phase: 'in_progress',
            flowId: 'lesson:block-1',
            journeyNodeId: undefined,
        }));

        await expect(subject.runtime.inspectLaunch({
            contentVersion: 'content-v1',
            firstRunAvailable: false,
        })).resolves.toMatchObject({ kind: 'fallback', restoreFailureCount: 1 });
        expect((await subject.store.getCheckpointById('checkpoint-1'))?.phase).toBe('in_progress');

        await expect(subject.runtime.inspectLaunch({
            contentVersion: 'content-v1',
            firstRunAvailable: false,
        })).resolves.toMatchObject({ kind: 'fallback', restoreFailureCount: 2 });
        expect((await subject.store.getCheckpointById('checkpoint-1'))?.phase).toBe('invalidated');
    });

    it('does no active-store work when mode is off', async () => {
        const subject = runtime('off');
        await subject.store.saveCheckpoint(checkpoint({ phase: 'in_progress' }));
        const writesBeforeInspection = subject.storage.writeCount;

        await expect(subject.runtime.inspectLaunch({
            contentVersion: 'content-v1',
            firstRunAvailable: false,
        })).resolves.toEqual({ kind: 'none' });
        expect(subject.storage.writeCount).toBe(writesBeforeInspection);
    });

    it('starts and supersedes an active checkpoint without invoking the commit path', async () => {
        const subject = runtime();

        const started = await subject.runtime.start(lessonBinding);

        expect(started).toMatchObject({ status: 'started', handle: { checkpointId: 'generated' } });
        if (!started.handle) throw new Error('expected-active-handle');
        expect(await subject.store.getGlobalResumeCandidate()).toMatchObject({
            checkpointId: 'generated',
            phase: 'in_progress',
            cursorId: 'step-2',
        });

        await subject.runtime.finish(started.handle);

        expect((await subject.store.getCheckpointById('generated'))?.phase).toBe('superseded');
        expect(await subject.store.getGlobalResumeCandidate()).toBeNull();
    });

    it('commits a unit checkpoint intent through the recoverable coordinator', async () => {
        const subject = runtime();
        const started = await subject.runtime.start({
            surface: 'unit-checkpoint',
            flowId: 'flow-unit',
            contentVersion: 'content-v2',
            cursorId: 'checkpoint-overview',
            compatibleCursorIds: ['checkpoint-overview', 'checkpoint-summary'],
            progressPercent: 100,
            completedStepCount: 1,
            totalStepCount: 1,
            checkpointDefinitionId: 'checkpoint-definition-1',
            journeyNodeId: 'node-unit-1',
            unitId: 'unit-1',
        });
        if (!started.handle) throw new Error('expected-active-handle');
        const intent = {
            ...unitCheckpointIntent(),
            checkpointId: started.handle.checkpointId,
            flowId: started.handle.flowId,
            contentVersion: started.handle.contentVersion,
        };

        await expect(subject.runtime.commit(started.handle, intent)).resolves.toMatchObject({ status: 'committed' });
        expect(subject.commit).toHaveBeenCalledWith(intent);
        expect((await subject.store.getCheckpointById(started.handle.checkpointId))?.phase).toBe('committed');
    });

    it('resumes only the explicitly offered compatible checkpoint', async () => {
        const subject = runtime();
        await subject.store.saveCheckpoint(checkpoint({
            phase: 'in_progress',
            flowId: lessonBinding.flowId,
            cursorId: 'step-2',
            totalStepCount: 3,
        }));

        await expect(subject.runtime.start(lessonBinding, 'checkpoint-1')).resolves.toMatchObject({
            status: 'resumed',
            handle: { checkpointId: 'checkpoint-1' },
        });
        await expect(subject.runtime.start(lessonBinding, 'checkpoint-other')).resolves.toEqual({
            status: 'fallback',
            handle: null,
            restoreFailureCount: null,
        });
    });

    it('measures persistence and restoration around the real coordinator work', async () => {
        const subject = measuredRuntime();

        await subject.runtime.start(lessonBinding);
        await subject.runtime.start(lessonBinding, 'generated');

        expect(subject.measure.mock.calls.map(([metric]) => metric)).toEqual([
            'persistence',
            'restoration',
        ]);
    });

    it('keeps study available when active storage cannot be read', async () => {
        class UnavailableStorage extends MemoryKeyValueStorage {
            override async getItem(): Promise<string | null> {
                throw new Error('storage-unavailable');
            }
        }
        const storage = new UnavailableStorage();
        const store = CheckpointStore.active(storage, () => FIXED_NOW);
        const coordinator = new CheckpointCoordinator({
            mode: 'active',
            store,
            activeSurfaces: ['lesson'],
            commitCoordinator: { commit: jest.fn() } as never,
            now: () => FIXED_NOW,
            id: () => 'generated',
        });
        const subject = new ActiveCheckpointRuntime({
            mode: 'active',
            store,
            coordinator,
            now: () => FIXED_NOW,
            id: () => 'generated',
        });

        await expect(subject.inspectLaunch({ contentVersion: 'content-v1', firstRunAvailable: false }))
            .resolves.toEqual({ kind: 'none' });
        await expect(subject.start(lessonBinding)).resolves.toEqual({ status: 'ignored', handle: null });
    });
});
