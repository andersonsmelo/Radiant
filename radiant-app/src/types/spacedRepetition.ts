// src/types/spacedRepetition.ts

/**
 * Spaced Repetition Types
 * 
 * This file contains all TypeScript type definitions for the spaced repetition feature.
 * No React imports, AsyncStorage, or business logic - types only.
 */

import type { QuizLessonId } from './quiz';

/**
 * Spaced repetition rating scale
 * 0 = Complete blackout
 * 1 = Incorrect, but familiar
 * 2 = Incorrect, but easy to recall
 * 3 = Correct, but difficult
 * 4 = Correct, with hesitation
 * 5 = Perfect recall
 */
export type SRRating = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Named rating for better UX
 */
export type SRRatingName = 'again' | 'hard' | 'good' | 'easy';

/**
 * Card state for a single lesson in the spaced repetition system
 */
export interface SRCardState {
    lessonId: QuizLessonId;
    easeFactor: number; // Difficulty multiplier (typically 1.3 - 2.5)
    interval: number; // Days until next review
    repetitions: number; // Number of successful reviews
    nextReviewAt: Date; // Next review date (runtime)
    lastReviewedAt: Date; // Last review date (runtime)
    createdAt: Date; // When card was created (runtime)
}

/**
 * Persisted version of SRCardState (dates as ISO strings)
 */
export interface SRCardStatePersisted {
    lessonId: QuizLessonId;
    easeFactor: number;
    interval: number;
    repetitions: number;
    nextReviewAt: string; // ISO string
    lastReviewedAt: string; // ISO string
    createdAt: string; // ISO string
}

/**
 * Record of a single review session
 */
export interface SRReviewRecord {
    lessonId: QuizLessonId;
    rating: SRRating;
    reviewedAt: Date; // Runtime
    previousInterval: number;
    newInterval: number;
    previousEaseFactor: number;
    newEaseFactor: number;
}

/**
 * Persisted version of SRReviewRecord
 */
export interface SRReviewRecordPersisted {
    lessonId: QuizLessonId;
    rating: SRRating;
    reviewedAt: string; // ISO string
    previousInterval: number;
    newInterval: number;
    previousEaseFactor: number;
    newEaseFactor: number;
}

/**
 * Complete spaced repetition schedule store
 * This is the shape persisted to AsyncStorage
 */
export interface SRScheduleStore {
    cards: Record<QuizLessonId, SRCardStatePersisted>;
    reviewHistory: SRReviewRecordPersisted[];
    lastUpdated: string; // ISO string
}

/**
 * Statistics for spaced repetition analytics
 */
export interface SRStatistics {
    totalCards: number;
    dueToday: number;
    dueThisWeek: number;
    averageEaseFactor: number;
    averageInterval: number;
    totalReviews: number;
    retentionRate: number; // Percentage of cards with rating >= 3
}

/**
 * Filter options for due cards
 */
export interface SRDueCardsFilter {
    dueDate?: Date;
    maxCards?: number;
    sortBy?: 'dueDate' | 'easeFactor' | 'interval';
    sortOrder?: 'asc' | 'desc';
}
