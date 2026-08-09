import type { QuizLessonId } from './quiz';

export const JOURNEY_PROGRESS_SCHEMA_VERSION = 'journey-progress.v2';

export type JourneyNodeType = 'lesson' | 'review' | 'checkpoint' | 'reward';

export type JourneyNodeStatus =
    | 'locked'
    | 'available'
    | 'active'
    | 'completed'
    | 'resumable'
    | 'due-review';

export type UnlockRule = {
    requiresNodeIds?: string[];
    requiresReviewClear?: boolean;
};

export type JourneyNodeDefinition = {
    id: string;
    unitId: string;
    type: JourneyNodeType;
    title: string;
    description?: string;
    lessonId?: QuizLessonId;
    blockId?: string;
    unlockRule?: UnlockRule;
};

export type JourneyNode = JourneyNodeDefinition & {
    status: JourneyNodeStatus;
};

export type JourneyUnitDefinition = {
    id: string;
    title: string;
    theme?: string;
    nodes: JourneyNodeDefinition[];
};

export type JourneyUnit = Omit<JourneyUnitDefinition, 'nodes'> & {
    nodes: JourneyNode[];
};

export type JourneyTrackDefinition = {
    id: string;
    title: string;
    units: JourneyUnitDefinition[];
    initialUnitId: string;
};

export type JourneyTrack = Omit<JourneyTrackDefinition, 'units'> & {
    units: JourneyUnit[];
};

export type JourneySyncEventType = 'node_completed' | 'review_completed' | 'reward_awarded';

export type JourneySyncEvent = {
    id: string;
    type: JourneySyncEventType;
    nodeId: string;
    occurredAt: string;
};

export type JourneyProgress = {
    schemaVersion: string;
    activeTrackId: string;
    currentUnitId: string;
    currentNodeId: string | null;
    completedNodeIds: string[];
    pendingReviewNodeIds: string[];
    lastUpdatedAt: string;
    lastCompletedNodeId?: string;
    resumableNodeId?: string;
    pendingSyncEvents: JourneySyncEvent[];
};

export type JourneyProgressStore = {
    schemaVersion: string;
    activeTrackId: string;
    tracks: Record<string, JourneyProgress>;
};

export type RecommendationReason = 'due-review' | 'weak-competency' | 'next-new';

export type JourneySnapshot = {
    track: JourneyTrack;
    progress: JourneyProgress;
    nextRecommendedNode: JourneyNode | null;
    completedCount: number;
    dueReviewCount: number;
    /**
     * Por que este nó foi recomendado. Ordena entre os já disponíveis; nunca
     * destrava.
     */
    recommendationReason: RecommendationReason;
};
