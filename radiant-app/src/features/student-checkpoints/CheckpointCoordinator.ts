import type { CheckpointPhase, CheckpointSurface, CommitIntentV1, CommitOperationV1, StudentCheckpointMode, StudentCheckpointV1 } from './contracts';
import type { CommitCoordinator } from './CommitCoordinator';
import type { CheckpointStore } from './CheckpointStore';
import { resolveStudentCheckpointMode } from './mode';

type CoordinatorDependencies = {
    mode: unknown;
    store: CheckpointStore;
    commitCoordinator: Pick<CommitCoordinator, 'commit'>;
    now: () => string;
    id: () => string;
    activeSurfaces?: CheckpointSurface[];
};

type ProgressInput = {
    checkpointId: string;
    progressPercent: number;
    completedStepCount: number;
    totalStepCount: number;
    cursorId: string;
};

type RestoreInput = {
    surface: CheckpointSurface;
    flowId: string;
    contentVersion: string;
    cursorIds: string[];
};

type CommitStatus =
    | { status: 'off'; operation: null }
    | { status: 'shadow-recorded'; operation: null }
    | { status: 'committed'; operation: CommitOperationV1 };

export class CheckpointCoordinator {
    private readonly mode: StudentCheckpointMode;
    private readonly activeSurfaces: Set<CheckpointSurface>;

    constructor(private readonly dependencies: CoordinatorDependencies) {
        this.mode = resolveStudentCheckpointMode(dependencies.mode);
        this.activeSurfaces = new Set(dependencies.activeSurfaces ?? []);
    }

    async enter(checkpoint: StudentCheckpointV1): Promise<{ checkpoint: StudentCheckpointV1; navigationDecision: null } | null> {
        if (!this.isEnabled(checkpoint.surface)) return null;
        this.dependencies.id();
        await this.dependencies.store.saveCheckpoint(checkpoint);
        return { checkpoint, navigationDecision: null };
    }

    async progress(input: ProgressInput): Promise<{ checkpoint: StudentCheckpointV1 } | null> {
        if (this.mode === 'off') return null;
        const current = await this.dependencies.store.getCheckpointById(input.checkpointId);
        if (!current || !this.isEnabled(current.surface)) return null;
        const checkpoint: StudentCheckpointV1 = {
            ...current,
            phase: 'in_progress',
            progressPercent: input.progressPercent,
            completedStepCount: input.completedStepCount,
            totalStepCount: input.totalStepCount,
            cursorId: input.cursorId,
            sequence: current.sequence + 1,
            updatedAt: this.dependencies.now(),
        };
        await this.dependencies.store.saveCheckpoint(checkpoint);
        return { checkpoint };
    }

    async commit(intent: CommitIntentV1): Promise<CommitStatus> {
        if (this.mode === 'off') return { status: 'off', operation: null };
        if (this.mode === 'active' && !this.activeSurfaces.has(intent.surface)) return { status: 'off', operation: null };
        if (this.mode === 'shadow') {
            const shadowCheckpoint = await this.dependencies.store.getCheckpointById(intent.checkpointId);
            if (shadowCheckpoint?.phase === 'in_progress') await this.markCheckpointCommitted(intent);
            return { status: 'shadow-recorded', operation: null };
        }
        const checkpoint = await this.dependencies.store.getCheckpointById(intent.checkpointId);
        if (!checkpoint
            || checkpoint.phase !== 'in_progress'
            || checkpoint.flowId !== intent.flowId
            || checkpoint.surface !== intent.surface
            || checkpoint.contentVersion !== intent.contentVersion) {
            throw new Error('checkpoint-not-ready');
        }
        const result = await this.dependencies.commitCoordinator.commit(intent);
        await this.markCheckpointCommitted(intent);
        return { status: 'committed', operation: result.operation };
    }

    async leave(input: { checkpointId: string; phase: Extract<CheckpointPhase, 'abandoned' | 'superseded'> }): Promise<{ checkpoint: StudentCheckpointV1 } | null> {
        if (this.mode === 'off') return null;
        const current = await this.dependencies.store.getCheckpointById(input.checkpointId);
        if (!current || !this.isEnabled(current.surface)) return null;
        const checkpoint: StudentCheckpointV1 = {
            ...current,
            phase: input.phase,
            sequence: current.sequence + 1,
            updatedAt: this.dependencies.now(),
        };
        await this.dependencies.store.saveCheckpoint(checkpoint);
        return { checkpoint };
    }

    async restoreCandidate(input: RestoreInput): Promise<
        | { kind: 'none' }
        | { kind: 'resume'; checkpoint: StudentCheckpointV1; cursorId: string }
        | { kind: 'fallback'; restoreFailureCount: 1 | 2; nextAction: 'home'; reasonCode: 'restore-mismatch' }
    > {
        if (!this.isEnabled(input.surface)) return { kind: 'none' };
        const current = await this.dependencies.store.getResumeCandidate(input.surface);
        if (!current || ['completed', 'abandoned', 'superseded', 'invalidated'].includes(current.phase)) return { kind: 'none' };
        const compatible = current.flowId === input.flowId
            && current.contentVersion === input.contentVersion
            && input.cursorIds.includes(current.cursorId);
        if (compatible) return { kind: 'resume', checkpoint: current, cursorId: current.cursorId };
        const restoreFailureCount = Math.min(2, current.restoreFailureCount + 1) as 1 | 2;
        const checkpoint: StudentCheckpointV1 = {
            ...current,
            phase: restoreFailureCount === 2 ? 'invalidated' : current.phase,
            restoreFailureCount,
            nextAction: 'home',
            sequence: current.sequence + 1,
            updatedAt: this.dependencies.now(),
        };
        await this.dependencies.store.saveCheckpoint(checkpoint);
        return { kind: 'fallback', restoreFailureCount, nextAction: 'home', reasonCode: 'restore-mismatch' };
    }

    async invalidate(input: { checkpointId: string }): Promise<{ checkpoint: StudentCheckpointV1 } | null> {
        if (this.mode === 'off') return null;
        const current = await this.dependencies.store.getCheckpointById(input.checkpointId);
        if (!current || !this.isEnabled(current.surface)) return null;
        const checkpoint: StudentCheckpointV1 = {
            ...current,
            phase: 'invalidated',
            nextAction: 'home',
            sequence: current.sequence + 1,
            updatedAt: this.dependencies.now(),
        };
        await this.dependencies.store.saveCheckpoint(checkpoint);
        return { checkpoint };
    }

    private isEnabled(surface: CheckpointSurface): boolean {
        if (this.mode === 'off') return false;
        return this.mode === 'shadow' || this.activeSurfaces.has(surface);
    }

    private async markCheckpointCommitted(intent: CommitIntentV1): Promise<void> {
        const current = await this.dependencies.store.getCheckpointById(intent.checkpointId);
        if (!current) return;
        await this.dependencies.store.saveCheckpoint({
            ...current,
            operationId: intent.operationId,
            phase: 'committed',
            sequence: current.sequence + 1,
            updatedAt: this.dependencies.now(),
        });
    }
}
