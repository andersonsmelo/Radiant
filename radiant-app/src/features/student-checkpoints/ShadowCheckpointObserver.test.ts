import { CheckpointCoordinator } from './CheckpointCoordinator';
import { CheckpointStore } from './CheckpointStore';
import { MemoryKeyValueStorage } from './storage';
import {
    ShadowCheckpointObserver,
    type ShadowCheckpointBinding,
} from './ShadowCheckpointObserver';

const NOW = '2026-08-09T12:00:00.000Z';
const binding: ShadowCheckpointBinding = {
    surface: 'lesson',
    flowId: 'lesson:lesson-1',
    contentVersion: 'shadow-v1',
    cursorId: 'step-1',
    compatibleCursorIds: ['step-1', 'step-2'],
    progressPercent: 0,
    completedStepCount: 0,
    totalStepCount: 2,
    lessonId: 'lesson-1',
};

function realObserver(mode: unknown, storage = new MemoryKeyValueStorage(), startAt = 0) {
    let sequence = startAt;
    const store = CheckpointStore.shadow(storage, () => NOW);
    const coordinator = new CheckpointCoordinator({
        mode,
        store,
        commitCoordinator: { commit: jest.fn() },
        now: () => NOW,
        id: () => `coordinator-${++sequence}`,
    });
    return {
        observer: new ShadowCheckpointObserver({
            mode,
            store,
            coordinator,
            now: () => NOW,
            id: () => `checkpoint-shadow-${++sequence}`,
        }),
        storage,
        store,
    };
}

describe('ShadowCheckpointObserver', () => {
    it('does absolutely no checkpoint work in off mode', async () => {
        const { observer, storage } = realObserver('off');
        const result = await observer.start(binding);

        expect(result).toEqual({ status: 'off', handle: null, restoreKind: 'none', divergenceCode: null });
        expect(storage.readCount).toBe(0);
        expect(storage.writeCount).toBe(0);
    });

    it('records entry, progress and background only in the shadow store', async () => {
        const { observer, store } = realObserver('shadow');
        const started = await observer.start(binding);
        expect(started.status).toBe('recorded');
        expect(started.handle).not.toBeNull();

        await observer.progress(started.handle!, {
            cursorId: 'step-2',
            progressPercent: 50,
            completedStepCount: 1,
            totalStepCount: 2,
        });
        await observer.background(started.handle!);

        expect(await store.getCurrent('lesson')).toMatchObject({
            surface: 'lesson',
            phase: 'abandoned',
            cursorId: 'step-2',
            progressPercent: 50,
        });
    });

    it('deduplicates repeated navigation and lets a relaunch inspect a compatible restore', async () => {
        const shared = new MemoryKeyValueStorage();
        const first = realObserver('shadow', shared, 0);
        const firstStart = await first.observer.start(binding);
        const repeated = await first.observer.start(binding);

        expect(repeated.handle).toEqual(firstStart.handle);

        const relaunched = realObserver('shadow', shared, 20);
        const relaunchedStart = await relaunched.observer.start(binding);
        expect(relaunchedStart).toMatchObject({
            status: 'recorded',
            restoreKind: 'resume',
            divergenceCode: null,
        });
    });

    it('fails closed for a changed catalog and an invalid deep link without throwing', async () => {
        const shared = new MemoryKeyValueStorage();
        const first = realObserver('shadow', shared, 0);
        await first.observer.start(binding);

        const changed = realObserver('shadow', shared, 20);
        await expect(changed.observer.start({
            ...binding,
            contentVersion: 'shadow-v2',
            compatibleCursorIds: ['step-3'],
            cursorId: 'step-3',
        })).resolves.toMatchObject({
            status: 'recorded',
            restoreKind: 'fallback',
            divergenceCode: null,
            restoreReasonCode: 'content-version-mismatch',
        });

        await expect(changed.observer.start({
            ...binding,
            flowId: 'invalid deep link',
        })).resolves.toMatchObject({
            status: 'ignored',
            reasonCode: 'navigation-unavailable',
        });
    });

    it('swallows unavailable storage and never exposes a navigation decision', async () => {
        const unavailable = {
            getResumeCandidate: jest.fn().mockRejectedValue(new Error('storage down')),
        };
        const coordinator = {
            restoreCandidate: jest.fn(),
            enter: jest.fn(),
            progress: jest.fn(),
            leave: jest.fn(),
        };
        const observer = new ShadowCheckpointObserver({
            mode: 'shadow',
            store: unavailable,
            coordinator,
            now: () => NOW,
            id: () => 'checkpoint-shadow-unavailable',
        });

        const result = await observer.start(binding);
        expect(result).toMatchObject({ status: 'ignored', reasonCode: 'storage-failed' });
        expect(result).not.toHaveProperty('navigationDecision');
        expect(coordinator.enter).not.toHaveBeenCalled();
    });
});
