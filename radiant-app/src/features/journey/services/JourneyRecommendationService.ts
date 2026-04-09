import type {
    JourneyNode,
    JourneyNodeDefinition,
    JourneyProgress,
    JourneySnapshot,
    JourneyTrack,
    JourneyTrackDefinition,
    JourneyUnit,
    JourneyUnitDefinition,
} from '../../../types/journey';

function isNodeCompleted(progress: JourneyProgress, nodeId: string): boolean {
    return progress.completedNodeIds.includes(nodeId);
}

function unlockRuleSatisfied(node: JourneyNodeDefinition, progress: JourneyProgress): boolean {
    const requiresNodeIds = node.unlockRule?.requiresNodeIds ?? [];
    const requiresReviewClear = node.unlockRule?.requiresReviewClear ?? false;

    if (requiresNodeIds.some((requiredNodeId) => !progress.completedNodeIds.includes(requiredNodeId))) {
        return false;
    }

    if (requiresReviewClear && progress.pendingReviewNodeIds.length > 0) {
        return false;
    }

    return true;
}

function resolveNodeStatus(node: JourneyNodeDefinition, progress: JourneyProgress): JourneyNode['status'] {
    if (progress.resumableNodeId === node.id) {
        return 'resumable';
    }

    if (progress.currentNodeId === node.id) {
        return 'active';
    }

    const completed = isNodeCompleted(progress, node.id);
    const unlocked = unlockRuleSatisfied(node, progress);

    if (node.type === 'review') {
        if (progress.pendingReviewNodeIds.includes(node.id) && unlocked) {
            return 'due-review';
        }

        return completed ? 'completed' : 'locked';
    }

    if (completed) {
        return 'completed';
    }

    return unlocked ? 'available' : 'locked';
}

function resolveUnit(unit: JourneyUnitDefinition, progress: JourneyProgress): JourneyUnit {
    return {
        ...unit,
        nodes: unit.nodes.map((node) => ({
            ...node,
            status: resolveNodeStatus(node, progress),
        })),
    };
}

function isUnitComplete(unit: JourneyUnit): boolean {
    return unit.nodes
        .filter((node) => node.type !== 'review')
        .every((node) => node.status === 'completed');
}

export class JourneyRecommendationService {
    static resolveTrack(track: JourneyTrackDefinition, progress: JourneyProgress): JourneyTrack {
        return {
            ...track,
            units: track.units.map((unit) => resolveUnit(unit, progress)),
        };
    }

    static getNextRecommendedNode(track: JourneyTrack, currentUnitId: string = track.initialUnitId): JourneyNode | null {
        const currentUnitIndex = Math.max(track.units.findIndex((unit) => unit.id === currentUnitId), 0);

        const searchUnits = [
            ...track.units.slice(currentUnitIndex),
            ...track.units.slice(0, currentUnitIndex),
        ];

        for (const unit of searchUnits) {
            const dueReview = unit.nodes.find((node) => node.status === 'due-review');
            if (dueReview) {
                return dueReview;
            }

            const available = unit.nodes.find((node) => node.status === 'available');
            if (available) {
                return available;
            }

            if (!isUnitComplete(unit)) {
                return null;
            }
        }

        return null;
    }

    static computeSnapshot(trackDefinition: JourneyTrackDefinition, progress: JourneyProgress): JourneySnapshot {
        const resolvedTrack = this.resolveTrack(trackDefinition, progress);
        const nextRecommendedNode = this.getNextRecommendedNode(resolvedTrack, progress.currentUnitId);

        return {
            track: resolvedTrack,
            progress,
            nextRecommendedNode,
            completedCount: progress.completedNodeIds.length,
            dueReviewCount: progress.pendingReviewNodeIds.length,
        };
    }

    static resolveCurrentUnitId(track: JourneyTrack, progress: JourneyProgress): string {
        const resumableNode = track.units
            .flatMap((unit) => unit.nodes)
            .find((node) => node.id === progress.resumableNodeId);

        if (resumableNode) {
            return resumableNode.unitId;
        }

        const activeNode = track.units
            .flatMap((unit) => unit.nodes)
            .find((node) => node.id === progress.currentNodeId);

        if (activeNode) {
            return activeNode.unitId;
        }

        const nextRecommendedNode = this.getNextRecommendedNode(track, progress.currentUnitId);
        return nextRecommendedNode?.unitId ?? track.initialUnitId;
    }
}
