import { useState, useEffect, useCallback, useRef } from 'react';
import { SpacedRepetitionService } from '../../spaced-repetition/services/SpacedRepetitionService';
import { GamificationService } from '../../gamification/services/GamificationService';
import { TelemetryService } from '../../telemetry/TelemetryService';
import { LessonCatalogService } from '../../content/services/LessonCatalogService';
import { SyncQueueService } from '../../sync/SyncQueueService';
import { OnboardingService } from '../../onboarding/OnboardingService';
import { ItemReviewService, type ReviewItem } from '../../spaced-repetition/services/ItemReviewService';
import type { ReviewAnswerFeedback } from '../components/ReviewCard';

export type { ReviewItem } from '../../spaced-repetition/services/ItemReviewService';

export type ReviewState = 'loading' | 'start' | 'review' | 'finished';

type UseReviewOptions = {
    resumeCursorId?: string;
};

const REVIEW_XP_PER_ITEM = 4;

export function useReview(options: UseReviewOptions = {}) {
    const [state, setState] = useState<ReviewState>('loading');
    const [queue, setQueue] = useState<ReviewItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [sessionXp, setSessionXp] = useState(0);
    const [persistenceError, setPersistenceError] = useState<string | null>(null);
    const busy = useRef(false);
    const consumed = useRef(new Set<string>());
    const pendingRating = useRef<boolean | null>(null);
    const pendingAnswer = useRef<{ index: number | null; at: Date } | null>(null);
    const [answerFeedback, setAnswerFeedback] = useState<ReviewAnswerFeedback | null>(null);
    const [saving, setSaving] = useState(false);

    const loadDueReviews = useCallback(async () => {
        try {
            setPersistenceError(null);
            const legacyCards = typeof SpacedRepetitionService.getAllCards === 'function'
                ? await SpacedRepetitionService.getAllCards() : [];
            let items: ReviewItem[] = await ItemReviewService.loadQueue(legacyCards);
            // Portas parciais antigas continuam legíveis; runtime real sempre oferece getAllCards.
            if (typeof SpacedRepetitionService.getAllCards !== 'function') {
                items = (await SpacedRepetitionService.getDueLessons()).flatMap(lessonId => {
                    const question = LessonCatalogService.getReviewQuestionsForLesson(lessonId)?.[0];
                    return question ? [{ lessonId, question }] : [];
                }).slice(0, 50);
            }

            setQueue(items);
            setCurrentIndex(0);
            if (options.resumeCursorId && options.resumeCursorId !== 'review-start') {
                const resumeIndex = items.findIndex((item) => item.question.id === options.resumeCursorId);
                if (resumeIndex >= 0) {
                    setCurrentIndex(resumeIndex);
                    TelemetryService.startTimer('review');
                    setState('review');
                    return;
                }
            }
            setState('start');
        } catch (error) {
            console.error('Error loading reviews:', error);
            setPersistenceError('Não foi possível carregar sua revisão. Tente novamente.');
            setState('start');
        }
    }, [options.resumeCursorId]);
    useEffect(() => { void loadDueReviews(); }, [loadDueReviews]);

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
        const token = currentItem ? `${currentItem.lessonId}:${currentItem.question.id}` : '';
        if (!currentItem || busy.current || consumed.current.has(token)) return;
        busy.current = true;
        pendingRating.current = isCorrect;
        setPersistenceError(null);
        try {
            let duplicate = false;
            if (currentItem.card) {
                const committed = await ItemReviewService.recordReview(currentItem, isCorrect);
                if (!committed.accepted) throw new Error('review-not-persisted');
                duplicate = committed.duplicate;
            }
            consumed.current.add(token);
            pendingRating.current = null;

            // 1. Record SR Result (Micro-quiz: 1 question)
            await SpacedRepetitionService.recordQuizResult({
                lessonId: currentItem.lessonId,
                totalQuestions: 1,
                correctAnswers: isCorrect ? 1 : 0,
                answeredAt: new Date(),
            });

            try {
            const updatedCard = await SpacedRepetitionService.getCardState(currentItem.lessonId);
            if (updatedCard) {
                await SyncQueueService.enqueueReviewCard(updatedCard);
                void SyncQueueService.flush();
            }

            } catch { /* Sync secundário não invalida uma resposta já persistida. */ }

            // 2. Award XP/Stats
            if (isCorrect && !duplicate) {
                try {
                    await GamificationService.addManualXp(REVIEW_XP_PER_ITEM);
                    setSessionXp(prev => prev + REVIEW_XP_PER_ITEM);
                    TelemetryService.track('xp_awarded', { source: 'review', amount: REVIEW_XP_PER_ITEM });
                } catch { /* Recompensa best-effort; não repete a tentativa confirmada. */ }
            }

            TelemetryService.track('review_item', {
                lessonId: currentItem.lessonId,
                correct: isCorrect
            });

            // 3. Advance Queue
            if (currentIndex < queue.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                // Persist the value milestone before the summary can ask for a store review.
                await OnboardingService.markAction('review_complete');
                const durationMs = TelemetryService.stopTimer('review');
                TelemetryService.track('review_complete', {
                    itemsCount: queue.length,
                    durationMs
                });
                setState('finished');
            }
        } catch {
            setPersistenceError('Não foi possível salvar esta revisão. Tente novamente.');
        } finally { busy.current = false; }
    }, [queue, currentIndex]);

    const submitAnswer = useCallback(async (index: number | null) => {
        const item = queue[currentIndex];
        const token = item ? `${item.lessonId}:${item.question.id}` : '';
        if (!item || busy.current || answerFeedback || consumed.current.has(token)) return;
        pendingAnswer.current ??= { index, at: new Date() };
        const request = pendingAnswer.current;
        busy.current = true;
        setSaving(true);
        setPersistenceError(null);
        try {
            const committed = await ItemReviewService.recordAnswer(item, request.index, request.at);
            if (!committed.accepted) throw Error('review-not-persisted');
            consumed.current.add(token);
            pendingAnswer.current = null;
            setAnswerFeedback({ correct: committed.correct, assisted: committed.assisted });
            try {
                await SpacedRepetitionService.recordQuizResult({ lessonId: item.lessonId, totalQuestions: 1,
                    correctAnswers: committed.correct ? 1 : 0, answeredAt: request.at });
                const card = await SpacedRepetitionService.getCardState(item.lessonId);
                if (card) { await SyncQueueService.enqueueReviewCard(card); void SyncQueueService.flush(); }
            } catch { /* Agregado/sync secundários não repetem a tentativa confirmada. */ }
            if (committed.correct && !committed.assisted && !committed.duplicate) {
                try {
                    await GamificationService.addManualXp(REVIEW_XP_PER_ITEM);
                    setSessionXp(value => value + REVIEW_XP_PER_ITEM);
                    TelemetryService.track('xp_awarded', { source: 'review', amount: REVIEW_XP_PER_ITEM });
                } catch { /* Crédito best-effort; journal permanece confirmado. */ }
            }
            TelemetryService.track('review_item', { lessonId: item.lessonId, correct: committed.correct });
        } catch { setPersistenceError('Não foi possível salvar esta revisão. Tente novamente.'); }
        finally { busy.current = false; setSaving(false); }
    }, [queue, currentIndex, answerFeedback]);

    const continueReview = useCallback(async () => {
        if (!answerFeedback || busy.current) return;
        busy.current = true; setSaving(true); setPersistenceError(null);
        try {
            if (currentIndex < queue.length - 1) {
                setAnswerFeedback(null);
                setCurrentIndex(value => value + 1);
            } else {
                await OnboardingService.markAction('review_complete');
                TelemetryService.track('review_complete', { itemsCount: queue.length, durationMs: TelemetryService.stopTimer('review') });
                setState('finished');
            }
        } catch { setPersistenceError('Não foi possível concluir esta revisão. Tente novamente.'); }
        finally { busy.current = false; setSaving(false); }
    }, [answerFeedback, currentIndex, queue.length]);

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
        submitAnswer,
        continueReview,
        answerFeedback,
        saving,
        persistenceError,
        retrySubmission: () => pendingAnswer.current ? submitAnswer(pendingAnswer.current.index)
            : answerFeedback ? continueReview() : pendingRating.current === null ? loadDueReviews() : submitRating(pendingRating.current),
    };
}
