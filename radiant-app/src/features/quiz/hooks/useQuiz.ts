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
import { QuizService } from '../services/QuizService';
import { SpacedRepetitionService } from '../../spaced-repetition/services/SpacedRepetitionService';

interface UseQuizState {
    currentQuestion: QuizQuestion | null;
    progress: QuizProgress;
    selectedAnswerIndex: number | null;
    isAnswered: boolean;
    correctAnswers: number;
    feedback: QuizFeedback;
    isFinished: boolean;
    result: QuizResult | null;
}

interface UseQuizActions {
    selectAnswer: (answerIndex: number) => void;
    next: () => void;
    reset: () => void;
}

export type UseQuizReturn = UseQuizState & UseQuizActions;

export function useQuiz(lesson: QuizLesson): UseQuizReturn {
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
        },
        [isAnswered, service]
    );

    const next = useCallback(() => {
        service.nextQuestion();
        setFeedback({
            visible: false,
            isCorrect: false,
            explanation: '',
        });
        forceUpdate((n) => n + 1);
    }, [service]);

    const reset = useCallback(() => {
        service.reset();
        setFeedback({
            visible: false,
            isCorrect: false,
            explanation: '',
        });
        forceUpdate((n) => n + 1);
    }, [service]);

    // Record quiz result to spaced repetition when quiz is completed
    useEffect(() => {
        if (result) {
            try {
                SpacedRepetitionService.recordQuizResult(result);
            } catch (error) {
                console.error('[useQuiz] Error recording quiz result to SR:', error);
                // Don't crash UI - spaced repetition is not critical to quiz flow
            }
        }
    }, [result]);

    return {
        currentQuestion,
        progress,
        selectedAnswerIndex,
        isAnswered,
        correctAnswers,
        feedback,
        isFinished,
        result,
        selectAnswer,
        next,
        reset,
    };
}
