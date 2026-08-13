import type { CheckpointSurface, CommitIntentV1, StudentCheckpointMode } from './contracts';
import { AuthorityStore } from './AuthorityStore';
import { CheckpointCoordinator } from './CheckpointCoordinator';
import { CheckpointStore } from './CheckpointStore';
import { CommitCoordinator } from './CommitCoordinator';
import { OutboxStore } from './OutboxStore';
import { resolveStudentCheckpointMode } from './mode';
import {
    SCREEN_CHECKPOINT_ADAPTERS,
    type ScreenCheckpointContext,
} from './ScreenCheckpointAdapters';
import { asyncStorageKeyValueStorage } from './storage';
import {
    checkpointPerformanceProbe,
    type CheckpointPerformanceMetric,
} from './CheckpointPerformance';

export const ACTIVE_CHECKPOINT_SURFACES = [
    'first-run',
    'lesson',
    'review',
    'unit-checkpoint',
] as const satisfies readonly CheckpointSurface[];

const ACTIVE_SURFACE_SET = new Set<CheckpointSurface>(ACTIVE_CHECKPOINT_SURFACES);

export type ActiveCheckpointBinding = Omit<
    ScreenCheckpointContext,
    'checkpointId' | 'createdAt' | 'updatedAt'
> & { surface: (typeof ACTIVE_CHECKPOINT_SURFACES)[number] };

export type ActiveCheckpointHandle = {
    checkpointId: string;
    surface: ActiveCheckpointBinding['surface'];
    flowId: string;
    contentVersion: string;
};

type ResumeRouteTarget = {
    kind: 'route';
    pathname: '/learn' | '/review' | '/checkpoint';
    params: Record<string, string>;
};

type FirstRunTarget = {
    kind: 'first-run';
    checkpointId: string;
    cursorId: string;
};

export type ActiveResumeLaunch =
    | { kind: 'none' }
    | {
        kind: 'offer';
        checkpointId: string;
        surface: ActiveCheckpointBinding['surface'];
        cursorId: string;
        target: ResumeRouteTarget | FirstRunTarget;
    }
    | {
        kind: 'fallback';
        checkpointId: string;
        restoreFailureCount: 1 | 2;
        nextAction: 'home';
    };

export type ActiveCheckpointStartResult =
    | { status: 'off' | 'ignored'; handle: null }
    | { status: 'started' | 'resumed'; handle: ActiveCheckpointHandle }
    | { status: 'fallback'; handle: null; restoreFailureCount: 1 | 2 | null };

type RuntimeDependencies = {
    mode: unknown;
    store: Pick<CheckpointStore, 'getCheckpointById' | 'getGlobalResumeCandidate'>;
    coordinator: Pick<CheckpointCoordinator, 'enter' | 'progress' | 'leave' | 'restoreCandidate' | 'commit'>;
    now: () => string;
    id: () => string;
    performance?: { measure<T>(metric: CheckpointPerformanceMetric, task: () => Promise<T>): Promise<T> };
};

function routeTarget(
    checkpoint: Awaited<ReturnType<CheckpointStore['getGlobalResumeCandidate']>> & {},
    firstRunAvailable: boolean,
): ResumeRouteTarget | FirstRunTarget | null {
    const resumeParams = {
        resumeCheckpointId: checkpoint.checkpointId,
        resumeCursorId: checkpoint.cursorId,
    };

    if (checkpoint.surface === 'first-run') {
        if (!firstRunAvailable || checkpoint.flowId !== 'first-run-v1'
            || !['slide-1', 'slide-2', 'slide-3'].includes(checkpoint.cursorId)) return null;
        return { kind: 'first-run', checkpointId: checkpoint.checkpointId, cursorId: checkpoint.cursorId };
    }

    if (checkpoint.surface === 'lesson') {
        const blockId = checkpoint.flowId.startsWith('lesson:')
            ? checkpoint.flowId.slice('lesson:'.length)
            : '';
        const step = /^step-(\d+)$/.exec(checkpoint.cursorId);
        if (!blockId || !checkpoint.journeyNodeId || !step
            || Number(step[1]) < 1 || Number(step[1]) > checkpoint.totalStepCount) return null;
        return {
            kind: 'route',
            pathname: '/learn',
            params: { blockId, nodeId: checkpoint.journeyNodeId, ...resumeParams },
        };
    }

    if (checkpoint.surface === 'review') {
        return { kind: 'route', pathname: '/review', params: resumeParams };
    }

    if (checkpoint.surface === 'unit-checkpoint') {
        const nodeId = checkpoint.journeyNodeId ?? checkpoint.checkpointDefinitionId;
        if (!nodeId || !['checkpoint-overview', 'checkpoint-summary'].includes(checkpoint.cursorId)) return null;
        return { kind: 'route', pathname: '/checkpoint', params: { nodeId, ...resumeParams } };
    }

    return null;
}

export class ActiveCheckpointRuntime {
    private readonly mode: StudentCheckpointMode;

    constructor(private readonly dependencies: RuntimeDependencies) {
        this.mode = resolveStudentCheckpointMode(dependencies.mode);
    }

    private measure<T>(metric: CheckpointPerformanceMetric, task: () => Promise<T>): Promise<T> {
        return this.dependencies.performance?.measure(metric, task) ?? task();
    }

    async inspectLaunch(input: { contentVersion: string; firstRunAvailable: boolean }): Promise<ActiveResumeLaunch> {
        if (this.mode !== 'active') return { kind: 'none' };
        try {
            const checkpoint = await this.dependencies.store.getGlobalResumeCandidate();
            if (!checkpoint || !ACTIVE_SURFACE_SET.has(checkpoint.surface)) return { kind: 'none' };
            const target = routeTarget(checkpoint, input.firstRunAvailable);
            if (checkpoint.contentVersion !== input.contentVersion || !target) {
                const failed = await this.dependencies.coordinator.restoreCandidate({
                    surface: checkpoint.surface,
                    flowId: checkpoint.flowId,
                    contentVersion: input.contentVersion,
                    cursorIds: [],
                });
                if (failed.kind !== 'fallback') return { kind: 'none' };
                return {
                    kind: 'fallback',
                    checkpointId: checkpoint.checkpointId,
                    restoreFailureCount: failed.restoreFailureCount,
                    nextAction: 'home',
                };
            }
            return {
                kind: 'offer',
                checkpointId: checkpoint.checkpointId,
                surface: checkpoint.surface as ActiveCheckpointBinding['surface'],
                cursorId: checkpoint.cursorId,
                target,
            };
        } catch {
            return { kind: 'none' };
        }
    }

    async start(binding: ActiveCheckpointBinding, resumeCheckpointId?: string): Promise<ActiveCheckpointStartResult> {
        if (this.mode !== 'active' || !ACTIVE_SURFACE_SET.has(binding.surface)) {
            return { status: 'off', handle: null };
        }
        try {
            if (resumeCheckpointId) {
                return await this.measure('restoration', async () => {
                    const checkpoint = await this.dependencies.store.getCheckpointById(resumeCheckpointId);
                    if (!checkpoint) return { status: 'fallback', handle: null, restoreFailureCount: null };
                    const restored = await this.dependencies.coordinator.restoreCandidate({
                        surface: binding.surface,
                        flowId: binding.flowId,
                        contentVersion: binding.contentVersion,
                        cursorIds: binding.compatibleCursorIds,
                    });
                    if (restored.kind !== 'resume' || restored.checkpoint.checkpointId !== resumeCheckpointId) {
                        return {
                            status: 'fallback',
                            handle: null,
                            restoreFailureCount: restored.kind === 'fallback' ? restored.restoreFailureCount : null,
                        };
                    }
                    await this.dependencies.coordinator.progress({
                        checkpointId: checkpoint.checkpointId,
                        cursorId: binding.cursorId,
                        progressPercent: binding.progressPercent,
                        completedStepCount: binding.completedStepCount,
                        totalStepCount: binding.totalStepCount,
                    });
                    return {
                        status: 'resumed',
                        handle: {
                            checkpointId: checkpoint.checkpointId,
                            surface: binding.surface,
                            flowId: binding.flowId,
                            contentVersion: binding.contentVersion,
                        },
                    };
                });
            }

            return await this.measure('persistence', async () => {
                const timestamp = this.dependencies.now();
                const checkpointId = this.dependencies.id();
                const checkpoint = SCREEN_CHECKPOINT_ADAPTERS[binding.surface].create({
                    ...binding,
                    checkpointId,
                    createdAt: timestamp,
                    updatedAt: timestamp,
                });
                const entered = await this.dependencies.coordinator.enter(checkpoint);
                if (!entered) return { status: 'off', handle: null };
                await this.dependencies.coordinator.progress({
                    checkpointId,
                    cursorId: binding.cursorId,
                    progressPercent: binding.progressPercent,
                    completedStepCount: binding.completedStepCount,
                    totalStepCount: binding.totalStepCount,
                });
                return {
                    status: 'started',
                    handle: { checkpointId, surface: binding.surface, flowId: binding.flowId, contentVersion: binding.contentVersion },
                };
            });
        } catch {
            return { status: 'ignored', handle: null };
        }
    }

    async progress(
        handle: ActiveCheckpointHandle,
        progress: Pick<ActiveCheckpointBinding, 'cursorId' | 'progressPercent' | 'completedStepCount' | 'totalStepCount'>,
    ): Promise<void> {
        if (this.mode !== 'active') return;
        try {
            await this.dependencies.coordinator.progress({ checkpointId: handle.checkpointId, ...progress });
        } catch {
            // Checkpoint persistence cannot block the legacy learning path.
        }
    }

    async commit(handle: ActiveCheckpointHandle, intent: CommitIntentV1) {
        if (this.mode !== 'active') return { status: 'off' as const, operation: null };
        if (handle.checkpointId !== intent.checkpointId
            || handle.flowId !== intent.flowId
            || handle.contentVersion !== intent.contentVersion
            || handle.surface !== intent.surface) {
            throw new Error('checkpoint-intent-mismatch');
        }
        return this.dependencies.coordinator.commit(intent);
    }

    async finish(handle: ActiveCheckpointHandle): Promise<void> {
        if (this.mode !== 'active') return;
        try {
            await this.dependencies.coordinator.leave({ checkpointId: handle.checkpointId, phase: 'superseded' });
        } catch {
            // A confirmed legacy completion remains authoritative.
        }
    }
}

let nativeRuntime: ActiveCheckpointRuntime | null = null;
let nativeRuntimeMode: StudentCheckpointMode | null = null;

export function getNativeActiveCheckpointRuntime(mode: StudentCheckpointMode): ActiveCheckpointRuntime {
    if (!nativeRuntime || nativeRuntimeMode !== mode) {
        const now = () => new Date().toISOString();
        let sequence = 0;
        const id = () => `checkpoint-active-${Date.now()}-${++sequence}`;
        const store = CheckpointStore.active(asyncStorageKeyValueStorage, now);
        const mandatorySteps = ['attempt', 'evidence', 'mastery', 'review', 'xp', 'goal', 'journey'] as const;
        const authorities = Object.fromEntries(mandatorySteps.map((step) => [
            step,
            new AuthorityStore(asyncStorageKeyValueStorage, step, now),
        ])) as ConstructorParameters<typeof CommitCoordinator>[0]['authorities'];
        const commitCoordinator = new CommitCoordinator({
            checkpointStore: store,
            authorities,
            outbox: new OutboxStore(asyncStorageKeyValueStorage, now),
            now,
        });
        const coordinator = new CheckpointCoordinator({
            mode,
            store,
            activeSurfaces: [...ACTIVE_CHECKPOINT_SURFACES],
            commitCoordinator,
            now,
            id,
        });
        nativeRuntime = new ActiveCheckpointRuntime({
            mode,
            store,
            coordinator,
            now,
            id,
            performance: checkpointPerformanceProbe,
        });
        nativeRuntimeMode = mode;
    }
    return nativeRuntime;
}
