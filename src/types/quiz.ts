// src/types/quiz.ts

/**
 * Quiz Engine — Core domain types
 * This file defines the contract used by hooks, services and screens.
 * No UI, no storage, no side effects.
 */

export type QuizDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type QuizQuestionType = 'multiple-choice' | 'image';

export type QuizQuestionId = string;
export type QuizLessonId = string;

export type QuizAnswerOption = {
    label: string;
};

export type QuizQuestion = {
    id: QuizQuestionId;
    type: QuizQuestionType;
    prompt: string;
    imageUrl?: string;
    options: QuizAnswerOption[];
    correctAnswerIndex: number;
    explanation: string;
    hint?: string;
};

export type QuizLesson = {
    id: QuizLessonId;
    title: string;
    difficulty: QuizDifficulty;
    questions: QuizQuestion[];
};

export type QuizAnswerState = {
    selectedAnswerIndex: number | null;
    isAnswered: boolean;
    correctAnswers: number;
};

export type QuizFeedback = {
    visible: boolean;
    isCorrect: boolean;
    explanation: string;
};

export type QuizProgress = {
    currentQuestionIndex: number;
    totalQuestions: number;
};

export type QuizResult = {
    lessonId: QuizLessonId;
    totalQuestions: number;
    correctAnswers: number;
    answeredAt: Date;
};