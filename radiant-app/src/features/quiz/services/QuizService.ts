// src/features/quiz/services/QuizService.ts

/**
 * Quiz Service — Core business logic
 * Manages quiz session state, answer validation, and progress tracking
 */

import type {
    QuizLesson,
    QuizQuestion,
    QuizResult,
    QuizAnswerState,
    QuizProgress,
    QuizFeedback,
} from '../../../types/quiz';
import { QUIZ_THRESHOLDS } from '../../../constants/quiz';

export class QuizService {
    private lesson: QuizLesson;
    private currentQuestionIndex: number;
    private correctAnswers: number;
    private answerStates: Map<string, QuizAnswerState>;
    private startTime: number;

    constructor(lesson: QuizLesson) {
        this.lesson = lesson;
        this.currentQuestionIndex = 0;
        this.correctAnswers = 0;
        this.answerStates = new Map();
        this.startTime = Date.now();
    }

    /**
     * Get the current question
     */
    getCurrentQuestion(): QuizQuestion | null {
        if (this.currentQuestionIndex >= this.lesson.questions.length) {
            return null;
        }
        return this.lesson.questions[this.currentQuestionIndex];
    }

    /**
     * Get current progress
     */
    getProgress(): QuizProgress {
        return {
            currentQuestionIndex: this.currentQuestionIndex,
            totalQuestions: this.lesson.questions.length,
        };
    }

    /**
     * Check if quiz is finished
     */
    isFinished(): boolean {
        return this.currentQuestionIndex >= this.lesson.questions.length;
    }

    /**
     * Submit an answer for the current question
     */
    submitAnswer(selectedAnswerIndex: number): QuizFeedback {
        const currentQuestion = this.getCurrentQuestion();

        if (!currentQuestion) {
            throw new Error('No current question available');
        }

        const isCorrect = selectedAnswerIndex === currentQuestion.correctAnswerIndex;

        if (isCorrect) {
            this.correctAnswers++;
        }

        // Store answer state
        const answerState: QuizAnswerState = {
            selectedAnswerIndex,
            isAnswered: true,
            correctAnswers: this.correctAnswers,
        };
        this.answerStates.set(currentQuestion.id, answerState);

        // Return feedback
        return {
            visible: true,
            isCorrect,
            explanation: currentQuestion.explanation,
        };
    }

    /**
     * Advance to the next question
     */
    nextQuestion(): void {
        if (!this.isFinished()) {
            this.currentQuestionIndex++;
        }
    }

    /**
     * Get the answer state for a specific question
     */
    getAnswerState(questionId: string): QuizAnswerState | undefined {
        return this.answerStates.get(questionId);
    }

    /**
     * Finish the quiz and return the result
     */
    finishQuiz(): QuizResult {
        const totalQuestions = this.lesson.questions.length;

        return {
            lessonId: this.lesson.id,
            totalQuestions,
            correctAnswers: this.correctAnswers,
            answeredAt: new Date(),
        };
    }

    /**
     * Calculate the score percentage
     */
    getScore(): number {
        if (this.lesson.questions.length === 0) {
            return 0;
        }
        return Math.round((this.correctAnswers / this.lesson.questions.length) * 100);
    }

    /**
     * Check if the user passed the quiz
     */
    hasPassed(): boolean {
        return this.getScore() >= QUIZ_THRESHOLDS.PASSING_SCORE;
    }

    /**
     * Get the lesson being quizzed
     */
    getLesson(): QuizLesson {
        return this.lesson;
    }

    /**
     * Reset the quiz to start over
     */
    reset(): void {
        this.currentQuestionIndex = 0;
        this.correctAnswers = 0;
        this.answerStates.clear();
        this.startTime = Date.now();
    }
}
