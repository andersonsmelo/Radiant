// src/constants/quiz.ts

/**
 * Quiz Engine — Constants and Configuration
 * This file contains all constants, enums, and configuration values for the quiz feature.
 * No React imports, no business logic - configuration only.
 */

import type { QuizDifficulty, QuizQuestionType } from '../types/quiz';

/**
 * Quiz difficulty levels
 */
export const QUIZ_DIFFICULTY: Record<string, QuizDifficulty> = {
    BEGINNER: 'beginner',
    INTERMEDIATE: 'intermediate',
    ADVANCED: 'advanced',
} as const;

/**
 * Quiz question types
 */
export const QUIZ_QUESTION_TYPE: Record<string, QuizQuestionType> = {
    MULTIPLE_CHOICE: 'multiple-choice',
    IMAGE: 'image',
} as const;

/**
 * Feedback display timing (in milliseconds)
 */
export const FEEDBACK_DISPLAY_DELAY = 500;

/**
 * Minimum time to display feedback before allowing next question (in milliseconds)
 */
export const MIN_FEEDBACK_DURATION = 1000;

/**
 * Maximum number of answer options per question
 */
export const MAX_ANSWER_OPTIONS = 5;

/**
 * Minimum number of answer options per question
 */
export const MIN_ANSWER_OPTIONS = 2;

/**
 * Feedback messages
 */
export const FEEDBACK_MESSAGES = {
    CORRECT: 'Correto!',
    INCORRECT: 'Incorreto',
} as const;

/**
 * Quiz completion thresholds
 */
export const QUIZ_THRESHOLDS = {
    PASSING_SCORE: 70, // Percentage
    EXCELLENT_SCORE: 90, // Percentage
} as const;

/**
 * Storage keys for AsyncStorage
 */
export const STORAGE_KEYS = {
    QUIZ_RESULTS: '@radiant:quiz_results',
    QUIZ_PROGRESS: '@radiant:quiz_progress',
} as const;

/**
 * Animation durations (in milliseconds)
 */
export const ANIMATION_DURATION = {
    FEEDBACK_ENTER: 300,
    FEEDBACK_EXIT: 200,
    QUESTION_TRANSITION: 400,
} as const;

/**
 * UI Configuration
 */
export const UI_CONFIG = {
    BUTTON_HEIGHT: 56,
    BUTTON_BORDER_RADIUS: 12,
    IMAGE_MAX_HEIGHT: 300,
} as const;
