import type { AdapterRestoreDecision, CheckpointPhase, StudentCheckpointMode } from './contracts';
import { CheckpointCoordinator } from './CheckpointCoordinator';
import { CheckpointStore } from './CheckpointStore';
import { resolveStudentCheckpointMode } from './mode';
import {
    SCREEN_CHECKPOINT_ADAPTERS,
    type ScreenCheckpointContext,
} from './ScreenCheckpointAdapters';
import { asyncStorageKeyValueStorage } from './storage';

export type ShadowCheckpointBinding = Omit<
    ScreenCheckpointContext,
    'checkpointId' | 'createdAt' | 'updatedAt'
> & { surface: keyof typeof SCREEN_CHECKPOINT_ADAPTERS };

export type ShadowCheckpointHandle = {
    checkpointId: string;
    surface: ShadowCheckpointBinding['surface'];
    flowId: string;
    contentVersion: string;
};

type RestoreKind = 'none' | 'resume' | 'fallback';
type ShadowReasonCode = 'navigation-unavailable' | 'privacy-rejected' | 'storage-failed';
type ShadowRestoreReasonCode = 'content-version-mismatch' | 'cursor-missing' | 'surface-mismatch';

export type ShadowCheckpointStartResult = {
    status: 'off' | 'recorded' | 'ignored';
    handle: ShadowCheckpointHandle | null;
    restoreKind: RestoreKind;
    divergenceCode: 'surface-mismatch' | null;
    restoreReasonCode?: ShadowRestoreReasonCode;
    reasonCode?: ShadowReasonCode;
};

type ObserverDependencies = {
    mode: unknown;
    store: Pick<CheckpointStore, 'getResumeCandidate'>;
    coordinator: Pick<CheckpointCoordinator, 'enter' | 'progress' | 'leave' | 'restoreCandidate'>;
    now: () => string;
    id: () => string;
};

function errorReason(error: unknown): ShadowReasonCode {
    const message = error instanceof Error ? error.message : '';
    if (message === 'privacy-rejected') return 'privacy-rejected';
    if (message === 'invalid-contract' || message === 'unknown-field') return 'navigation-unavailable';
    return 'storage-failed';
}

function decisionKind(decision: AdapterRestoreDecision | null): RestoreKind {
    if (!decision) return 'none';
    return decision.kind === 'resume' ? 'resume' : 'fallback';
}

function restoreReason(decision: AdapterRestoreDecision | null): ShadowRestoreReasonCode | undefined {
    if (!decision || decision.kind === 'resume') return undefined;
    return ['content-version-mismatch', 'cursor-missing', 'surface-mismatch'].includes(decision.reasonCode)
        ? decision.reasonCode as ShadowRestoreReasonCode
        : undefined;
}

export class ShadowCheckpointObserver {
    private readonly mode: StudentCheckpointMode;
    private active: ShadowCheckpointHandle | null = null;
    private activeIdentity: string | null = null;

    constructor(private readonly dependencies: ObserverDependencies) {
        this.mode = resolveStudentCheckpointMode(dependencies.mode);
    }

    async start(binding: ShadowCheckpointBinding): Promise<ShadowCheckpointStartResult> {
        if (this.mode !== 'shadow') {
            return { status: 'off', handle: null, restoreKind: 'none', divergenceCode: null };
        }

        const identity = `${binding.surface}:${binding.flowId}:${binding.contentVersion}`;
        if (this.active && this.activeIdentity === identity) {
            return { status: 'recorded', handle: this.active, restoreKind: 'none', divergenceCode: null };
        }

        if (this.active) {
            await this.leave(this.active, 'superseded');
        }

        try {
            const adapter = SCREEN_CHECKPOINT_ADAPTERS[binding.surface];
            const existing = await this.dependencies.store.getResumeCandidate(binding.surface);
            const timestamp = this.dependencies.now();
            const checkpointId = this.dependencies.id();
            const context: ScreenCheckpointContext = {
                ...binding,
                checkpointId,
                createdAt: timestamp,
                updatedAt: timestamp,
            };
            const predictedRestore = existing ? adapter.reconcile(existing, context) : null;
            const actualRestore = await this.dependencies.coordinator.restoreCandidate({
                surface: binding.surface,
                flowId: binding.flowId,
                contentVersion: binding.contentVersion,
                cursorIds: binding.compatibleCursorIds,
            });
            const actualKind: RestoreKind = actualRestore.kind === 'none'
                ? 'none'
                : actualRestore.kind === 'resume'
                    ? 'resume'
                    : 'fallback';
            const expectedKind = decisionKind(predictedRestore);
            const divergenceCode = actualKind === expectedKind ? null : 'surface-mismatch';
            const checkpoint = adapter.create(context);
            const entered = await this.dependencies.coordinator.enter(checkpoint);
            if (!entered) {
                return { status: 'off', handle: null, restoreKind: actualKind, divergenceCode };
            }
            const handle: ShadowCheckpointHandle = {
                checkpointId,
                surface: binding.surface,
                flowId: binding.flowId,
                contentVersion: binding.contentVersion,
            };
            this.active = handle;
            this.activeIdentity = identity;
            const restoreReasonCode = restoreReason(predictedRestore);
            return {
                status: 'recorded',
                handle,
                restoreKind: actualKind,
                divergenceCode,
                ...(restoreReasonCode ? { restoreReasonCode } : {}),
            };
        } catch (error) {
            return {
                status: 'ignored',
                handle: null,
                restoreKind: 'none',
                divergenceCode: null,
                reasonCode: errorReason(error),
            };
        }
    }

    async progress(
        handle: ShadowCheckpointHandle,
        progress: Pick<ShadowCheckpointBinding, 'cursorId' | 'progressPercent' | 'completedStepCount' | 'totalStepCount'>,
    ): Promise<void> {
        if (!this.isActive(handle)) return;
        try {
            await this.dependencies.coordinator.progress({ checkpointId: handle.checkpointId, ...progress });
        } catch {
            // Shadow storage cannot block or change the legacy screen.
        }
    }

    async background(handle: ShadowCheckpointHandle): Promise<void> {
        await this.leave(handle, 'abandoned');
    }

    async leave(
        handle: ShadowCheckpointHandle,
        phase: Extract<CheckpointPhase, 'abandoned' | 'superseded'> = 'abandoned',
    ): Promise<void> {
        if (!this.isActive(handle)) return;
        this.active = null;
        this.activeIdentity = null;
        try {
            await this.dependencies.coordinator.leave({ checkpointId: handle.checkpointId, phase });
        } catch {
            // Shadow storage cannot block or change the legacy screen.
        }
    }

    private isActive(handle: ShadowCheckpointHandle): boolean {
        return this.mode === 'shadow' && this.active?.checkpointId === handle.checkpointId;
    }
}

let nativeObserver: ShadowCheckpointObserver | null = null;

export function getNativeShadowCheckpointObserver(mode: StudentCheckpointMode): ShadowCheckpointObserver {
    if (!nativeObserver) {
        const now = () => new Date().toISOString();
        let sequence = 0;
        const id = () => `checkpoint-shadow-${Date.now()}-${++sequence}`;
        const store = CheckpointStore.shadow(asyncStorageKeyValueStorage, now);
        const coordinator = new CheckpointCoordinator({
            mode,
            store,
            commitCoordinator: {
                commit: async () => {
                    throw new Error('active-runtime-disabled');
                },
            },
            now,
            id,
        });
        nativeObserver = new ShadowCheckpointObserver({ mode, store, coordinator, now, id });
    }
    return nativeObserver;
}
