import type { QuizLessonId, QuizResult } from '../../types/quiz';
import type { SRCardState } from '../../types/spacedRepetition';

export type SyncEntity = 'lesson_progress' | 'review_cards';
export type SyncAction = 'upsert_quiz_result' | 'upsert_review_card';
export type SyncQueueStatus = 'pending' | 'retrying';
export type SyncFailureReason = 'missing_auth' | 'api_unavailable' | 'queue_error' | 'remote_error';

export interface LessonProgressSyncPayload {
    lessonId: QuizLessonId;
    totalQuestions: QuizResult['totalQuestions'];
    correctAnswers: QuizResult['correctAnswers'];
    answeredAtIso: string;
}

export interface ReviewCardSyncPayload {
    lessonId: SRCardState['lessonId'];
    easeFactor: SRCardState['easeFactor'];
    intervalDays: SRCardState['interval'];
    repetitions: SRCardState['repetitions'];
    nextReviewAtIso: string;
    lastReviewedAtIso: string;
    createdAtIso: string;
}

export interface SyncQueueItem {
    id: string;
    entity: SyncEntity;
    action: SyncAction;
    createdAt: string;
    updatedAt: string;
    retries: number;
    status: SyncQueueStatus;
    nextRetryAt?: string;
    lastError?: string;
    payload: LessonProgressSyncPayload | ReviewCardSyncPayload;
}

export interface SyncQueueSummary {
    pending: number;
    retrying: number;
    lastError: string | null;
    oldestPendingAt: string | null;
}
