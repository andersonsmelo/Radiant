import { useState, useEffect, useCallback } from 'react';
import { SpacedRepetitionService } from '../../spaced-repetition/services/SpacedRepetitionService';
import { GamificationService } from '../../gamification/services/GamificationService';
import { TelemetryService } from '../../telemetry/TelemetryService';
import type { QuizLessonId, QuizQuestion } from '../../../types/quiz';
import { LessonCatalogService } from '../../content/services/LessonCatalogService';
import { SyncQueueService } from '../../sync/SyncQueueService';

export type ReviewItem = {
    lessonId: QuizLessonId;
    question: QuizQuestion;
};

export type ReviewState = 'loading' | 'start' | 'review' | 'finished';

const REVIEW_XP_PER_ITEM = 4;

export function useReview() {
    const [state, setState] = useState<ReviewState>('loading');
    const [queue, setQueue] = useState<ReviewItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [sessionXp, setSessionXp] = useState(0);

    // Initial load
    useEffect(() => {
        loadDueReviews();
    }, []);

    const loadDueReviews = async () => {
        try {
            // Get due lessons from SR service
            const dueLessonIds = await SpacedRepetitionService.getDueLessons();

            const items: ReviewItem[] = [];

            dueLessonIds.forEach(lessonId => {
                const questions = LessonCatalogService.getReviewQuestionsForLesson(lessonId);

                if (questions && questions.length > 0) {
                    items.push({
                        lessonId,
                        question: questions[0]
                    });
                }
            });

            setQueue(items);
            setState('start');
        } catch (error) {
            console.error('Error loading reviews:', error);
            setState('start'); // Allow UI to handle empty queue
        }
    };

    const startReview = () => {
        if (queue.length > 0) {
            TelemetryService.track('review_start', { dueCount: queue.length });
            TelemetryService.markDayReviewed();
            TelemetryService.startTimer('review');
            setState('review');
        }
    };

    const submitRating = useCallback(async (isCorrect: boolean) => {
        const currentItem = queue[currentIndex];
        if (!currentItem) return;

        // 1. Record SR Result (Micro-quiz: 1 question)
        await SpacedRepetitionService.recordQuizResult({
            lessonId: currentItem.lessonId,
            totalQuestions: 1,
            correctAnswers: isCorrect ? 1 : 0,
            answeredAt: new Date(),
        });

        const updatedCard = await SpacedRepetitionService.getCardState(currentItem.lessonId);
        if (updatedCard) {
            await SyncQueueService.enqueueReviewCard(updatedCard);
            void SyncQueueService.flush();
        }

        // 2. Award XP/Stats
        if (isCorrect) {
            await GamificationService.addManualXp(REVIEW_XP_PER_ITEM);
            setSessionXp(prev => prev + REVIEW_XP_PER_ITEM);

            TelemetryService.track('xp_awarded', { source: 'review', amount: REVIEW_XP_PER_ITEM });
        }

        TelemetryService.track('review_item', {
            lessonId: currentItem.lessonId,
            correct: isCorrect
        });

        // 3. Advance Queue
        if (currentIndex < queue.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            const durationMs = TelemetryService.stopTimer('review');
            TelemetryService.track('review_complete', {
                itemsCount: queue.length,
                durationMs
            });
            setState('finished');
        }
    }, [queue, currentIndex]);

    return {
        state,
        queue,
        currentIndex,
        currentItem: queue[currentIndex],
        sessionXp,
        totalItems: queue.length,
        loading: state === 'loading',
        startReview,
        submitRating,
    };
}
