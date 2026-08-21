import type {
    AdapterRestoreDecision,
    CheckpointSurface,
    ScreenCheckpointAdapter,
    StudentCheckpointV1,
} from './contracts';
import { LESSON_CATALOG } from '../../data/catalog';

export const STUDENT_CHECKPOINT_SHADOW_CONTENT_VERSION = LESSON_CATALOG.version;

export const STUDENT_CHECKPOINT_SURFACES = [
    'first-run',
    'home',
    'missions',
    'progress',
    'lesson',
    'legacy-quiz',
    'unit-checkpoint',
    'review',
    'reward',
] as const satisfies readonly CheckpointSurface[];

export type ScreenCheckpointContext = {
    checkpointId: string;
    flowId: string;
    contentVersion: string;
    cursorId: string;
    compatibleCursorIds: string[];
    progressPercent: number;
    completedStepCount: number;
    totalStepCount: number;
    createdAt: string;
    updatedAt: string;
    trackId?: string;
    unitId?: string;
    journeyNodeId?: string;
    lessonId?: string;
    activityId?: string;
    checkpointDefinitionId?: string;
    missionId?: string;
    reviewCardId?: string;
    rewardId?: string;
    galaxyId?: string;
    planetId?: string;
    competencyIds?: string[];
};

function createAdapter(surface: CheckpointSurface): ScreenCheckpointAdapter<ScreenCheckpointContext> {
    return {
        surface,
        belongsTo(checkpoint, context) {
            return checkpoint.surface === surface && checkpoint.flowId === context.flowId;
        },
        create(context) {
            return {
                schemaVersion: 1,
                checkpointId: context.checkpointId,
                flowId: context.flowId,
                surface,
                phase: 'entered',
                trackId: context.trackId,
                unitId: context.unitId,
                journeyNodeId: context.journeyNodeId,
                lessonId: context.lessonId,
                activityId: context.activityId,
                checkpointDefinitionId: context.checkpointDefinitionId,
                missionId: context.missionId,
                reviewCardId: context.reviewCardId,
                rewardId: context.rewardId,
                galaxyId: context.galaxyId,
                planetId: context.planetId,
                competencyIds: context.competencyIds,
                contentVersion: context.contentVersion,
                cursorId: context.cursorId,
                progressPercent: context.progressPercent,
                completedStepCount: context.completedStepCount,
                totalStepCount: context.totalStepCount,
                nextAction: 'resume',
                sequence: 1,
                restoreFailureCount: 0,
                createdAt: context.createdAt,
                updatedAt: context.updatedAt,
            };
        },
        reconcile(checkpoint, context): AdapterRestoreDecision {
            if (!this.belongsTo(checkpoint, context)) {
                return { kind: 'discard', reasonCode: 'surface-mismatch' };
            }
            if (checkpoint.contentVersion !== context.contentVersion) {
                return { kind: 'fallback', nextAction: 'home', reasonCode: 'content-version-mismatch' };
            }
            if (!context.compatibleCursorIds.includes(checkpoint.cursorId)) {
                return { kind: 'fallback', nextAction: 'home', reasonCode: 'cursor-missing' };
            }
            return { kind: 'resume', cursorId: checkpoint.cursorId };
        },
    };
}

export const SCREEN_CHECKPOINT_ADAPTERS = Object.fromEntries(
    STUDENT_CHECKPOINT_SURFACES.map((surface) => [surface, createAdapter(surface)]),
) as Record<CheckpointSurface, ScreenCheckpointAdapter<ScreenCheckpointContext>>;

export function isSameCheckpointBinding(
    checkpoint: StudentCheckpointV1,
    context: Pick<ScreenCheckpointContext, 'flowId' | 'contentVersion'>,
): boolean {
    return checkpoint.flowId === context.flowId && checkpoint.contentVersion === context.contentVersion;
}
