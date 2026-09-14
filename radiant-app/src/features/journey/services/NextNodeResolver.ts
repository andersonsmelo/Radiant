import type { NextNodeCandidate, NextNodeDecision } from '../../../types/journey';

export type NextNodeResolverInput = {
    candidates: readonly NextNodeCandidate[];
    nowMs: number;
};

function byCurriculumOrder(
    left: NextNodeCandidate,
    right: NextNodeCandidate,
): number {
    return left.order - right.order || left.nodeId.localeCompare(right.nodeId);
}

function isPausedLesson(candidate: NextNodeCandidate): boolean {
    return candidate.type === 'lesson'
        && Number.isInteger(candidate.pausedStepIndex)
        && candidate.pausedStepIndex! >= 0;
}

function isDueReview(candidate: NextNodeCandidate, nowMs: number): boolean {
    return candidate.type === 'review'
        && Number.isFinite(candidate.dueAtMs)
        && candidate.dueAtMs! <= nowMs;
}

export const NextNodeResolver = {
    resolve({ candidates, nowMs }: NextNodeResolverInput): NextNodeDecision | null {
        const available = candidates.filter(candidate => candidate.unlocked && !candidate.completed);
        const dueReviews = available
            .filter(candidate => isDueReview(candidate, nowMs))
            .sort((left, right) => left.dueAtMs! - right.dueAtMs! || byCurriculumOrder(left, right));
        const dueReviewCount = dueReviews.length;

        const pausedLesson = available
            .filter(isPausedLesson)
            .sort(byCurriculumOrder)[0];
        if (pausedLesson) {
            return {
                nodeId: pausedLesson.nodeId,
                reason: 'paused-lesson',
                resumeStepIndex: pausedLesson.pausedStepIndex,
                dueReviewCount,
            };
        }

        const dueReview = dueReviews[0];
        if (dueReview) {
            return {
                nodeId: dueReview.nodeId,
                reason: 'due-review',
                dueReviewCount,
            };
        }

        const checkpoint = available
            .filter(candidate => candidate.type === 'checkpoint')
            .sort(byCurriculumOrder)[0];
        if (checkpoint) {
            return {
                nodeId: checkpoint.nodeId,
                reason: 'checkpoint',
                dueReviewCount,
            };
        }

        const lesson = available
            .filter(candidate => candidate.type === 'lesson')
            .sort(byCurriculumOrder)[0];
        if (lesson) {
            return {
                nodeId: lesson.nodeId,
                reason: 'next-lesson',
                dueReviewCount,
            };
        }

        return null;
    },
};
