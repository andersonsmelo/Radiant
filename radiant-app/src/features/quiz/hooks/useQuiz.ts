// src/features/quiz/hooks/useQuiz.ts

/**
 * useQuiz Hook — React binding for QuizService
 * Manages quiz state and exposes UI-friendly interface
 */

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type {
    QuizLesson,
    QuizQuestion,
    QuizResult,
    QuizProgress,
    QuizFeedback,
} from '../../../types/quiz';
import type { XpAward } from '../../../types/gamification';
import { QuizService } from '../services/QuizService';
import { SpacedRepetitionService } from '../../spaced-repetition/services/SpacedRepetitionService';
import { GamificationService } from '../../gamification/services/GamificationService';
import { DailyGoalService } from '../../daily-goal/services/DailyGoalService';
import { SyncQueueService } from '../../sync/SyncQueueService';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';
import { hapticError, hapticLifeLost, hapticSuccess } from '../../../ui/feedback/haptics';

interface UseQuizState {
    currentQuestion: QuizQuestion | null;
    progress: QuizProgress;
    selectedAnswerIndex: number | null;
    isAnswered: boolean;
    correctAnswers: number;
    feedback: QuizFeedback;
    isFinished: boolean;
    result: QuizResult | null;
    xpAward: XpAward | null;
    dailyGoalJustCompleted: boolean;
    hearts: number;
    maxHearts: number;
}

interface UseQuizActions {
    selectAnswer: (answerIndex: number) => void;
    next: () => void;
    reset: () => void;
}

export type UseQuizReturn = UseQuizState & UseQuizActions;

const MAX_HEARTS_DEFAULT = 5;

type JourneyCompletionMode = 'none' | 'lesson' | 'review';

export function useQuiz(
    lesson: QuizLesson,
    options: { journeyCompletionMode?: JourneyCompletionMode } = {}
): UseQuizReturn {
    const journeyCompletionMode = options.journeyCompletionMode ?? 'none';
    const serviceRef = useRef<QuizService>(new QuizService(lesson));
    const [, forceUpdate] = useState(0);

    const service = serviceRef.current;

    const currentQuestion = service.getCurrentQuestion();
    const progress = service.getProgress();
    const isFinished = service.isFinished();

    const currentAnswerState = currentQuestion
        ? service.getAnswerState(currentQuestion.id)
        : undefined;

    const selectedAnswerIndex = currentAnswerState?.selectedAnswerIndex ?? null;
    const isAnswered = currentAnswerState?.isAnswered ?? false;
    const correctAnswers = service.getCorrectAnswers();

    const [feedback, setFeedback] = useState<QuizFeedback>({
        visible: false,
        isCorrect: false,
        explanation: '',
    });
    const [xpAward, setXpAward] = useState<XpAward | null>(null);
    const [dailyGoalJustCompleted, setDailyGoalJustCompleted] = useState<boolean>(false);
    const [hearts, setHearts] = useState<number>(MAX_HEARTS_DEFAULT);
    // Espelho em ref porque `selectAnswer` não tem `hearts` nas dependências —
    // ler o state pelo closure entregaria o valor da renderização em que o
    // callback foi criado, e a comparação "caiu?" sairia errada exatamente
    // depois da primeira perda.
    const heartsRef = useRef(hearts);
    heartsRef.current = hearts;
    const [maxHearts, setMaxHearts] = useState<number>(MAX_HEARTS_DEFAULT);

    // Load hearts on mount
    useEffect(() => {
        GamificationService.getSnapshot().then((snap) => {
            setHearts(snap.hearts);
            setMaxHearts(snap.maxHearts);
        });
    }, []);

    const result = useMemo(() => {
        if (isFinished) {
            return service.finishQuiz();
        }
        return null;
    }, [isFinished, service]);

    const selectAnswer = useCallback(
        (answerIndex: number) => {
            if (isAnswered) {
                return;
            }

            const feedbackResult = service.submitAnswer(answerIndex);
            setFeedback(feedbackResult);
            forceUpdate((n) => n + 1);

            // O toque acontece junto com a resposta, não depois dela: é o
            // retorno mais imediato que o app consegue dar.
            if (feedbackResult.isCorrect) {
                hapticSuccess();
            } else {
                hapticError();
            }

            // Lose a heart on wrong answer (not in review mode)
            if (!feedbackResult.isCorrect && journeyCompletionMode !== 'review') {
                // Capturado ANTES da escrita: comparar depois contra o ref
                // dependeria de o re-render ainda não ter reatribuído o espelho,
                // o que é verdade hoje por causa do batching do React e deixaria
                // a corretude apoiada num detalhe de agendamento.
                const heartsBefore = heartsRef.current;

                GamificationService.loseHeart().then((snap) => {
                    setHearts(snap.hearts);
                    setMaxHearts(snap.maxHearts);

                    // O único evento punitivo do app passava em silêncio: o
                    // contador trocava e nada mais. O `hapticError` acima é o
                    // mesmo no modo revisão, onde nada é cobrado — então ele
                    // sinaliza "errou", nunca "custou".
                    //
                    // Disparado aqui, e não junto do erro, de propósito: a
                    // sequência "errou" → "e custou uma vida" é o que encena a
                    // perda. Os dois no mesmo tick viram uma vibração só.
                    // Condicionado à queda real do contador, para não vibrar
                    // quando já se está em zero e não há mais o que perder.
                    if (snap.hearts < heartsBefore) {
                        hapticLifeLost();
                    }
                });
            }
        },
        [isAnswered, service, journeyCompletionMode]
    );

    const next = useCallback(() => {
        service.nextQuestion();
        setFeedback({
            visible: false,
            isCorrect: false,
            explanation: '',
        });
        setXpAward(null);
        setDailyGoalJustCompleted(false);
        forceUpdate((n) => n + 1);
    }, [service]);

    const reset = useCallback(() => {
        service.reset();
        setFeedback({
            visible: false,
            isCorrect: false,
            explanation: '',
        });
        setXpAward(null);
        setDailyGoalJustCompleted(false);
        forceUpdate((n) => n + 1);
    }, [service]);

    // Record quiz result to spaced repetition when quiz is completed
    useEffect(() => {
        if (result) {
            (async () => {
                try {
                    await SpacedRepetitionService.recordQuizResult(result);
                    await SyncQueueService.enqueueLessonProgressFromQuizResult(result);

                    const cardState = await SpacedRepetitionService.getCardState(result.lessonId);
                    if (cardState) {
                        await SyncQueueService.enqueueReviewCard(cardState);
                    }

                    await SyncQueueService.flush();
                } catch (error) {
                    console.error('[useQuiz] Error syncing quiz result:', error);
                }
            })();

            // Record gamification award (XP/Streak)
            try {
                GamificationService.recordQuizCompletion(result).then(({ award }) => {
                    setXpAward(award);
                });
            } catch (error) {
                console.error('[useQuiz] Error recording gamification:', error);
            }

            // Record daily goal completion
            try {
                // Get snapshot before recording this quiz
                DailyGoalService.getSnapshot().then((beforeSnapshot) => {
                    const wasNotCompleted = !beforeSnapshot.isCompleted;

                    // Record the quiz completion
                    DailyGoalService.recordQuizCompletion(result.answeredAt).then((afterSnapshot) => {
                        // Only set flag if this quiz caused the transition to completed
                        if (wasNotCompleted && afterSnapshot.isCompleted) {
                            setDailyGoalJustCompleted(true);
                        }
                    });
                });
            } catch (error) {
                console.error('[useQuiz] Error recording daily goal:', error);
            }

            if (journeyCompletionMode !== 'none') {
                const completionPromise =
                    journeyCompletionMode === 'review'
                        ? JourneyProgressService.markReviewNodeCompleted(result.lessonId)
                        : JourneyProgressService.markLessonNodeCompleted(result.lessonId);

                completionPromise.catch((error) => {
                    console.error('[useQuiz] Error syncing journey progress:', error);
                });
            }
        }
    }, [result, journeyCompletionMode]);

    return {
        currentQuestion,
        progress,
        selectedAnswerIndex,
        isAnswered,
        correctAnswers,
        feedback,
        isFinished,
        result,
        xpAward,
        dailyGoalJustCompleted,
        hearts,
        maxHearts,
        selectAnswer,
        next,
        reset,
    };
}
