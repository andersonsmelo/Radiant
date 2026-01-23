// src/features/spaced-repetition/services/SpacedRepetitionService.ts

/**
 * Spaced Repetition Service
 * Implements SM-2 algorithm for scheduling reviews based on quiz performance
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
    SRCardState,
    SRCardStatePersisted,
    SRScheduleStore,
    SRRating,
    SRReviewRecord,
    SRReviewRecordPersisted,
} from '../../../types/spacedRepetition';
import type { QuizResult, QuizLessonId } from '../../../types/quiz';
import {
    SM2_PARAMS,
    SR_STORAGE_KEYS,
    SR_SAFETY_CAPS,
    SR_RATING_THRESHOLDS,
    SR_DEFAULTS,
} from '../../../constants/spacedRepetition';

export class SpacedRepetitionService {
    /**
     * Record a quiz result and update the review schedule
     */
    static async recordQuizResult(result: QuizResult): Promise<void> {
        try {
            const store = await this.loadStore();
            const lessonId = result.lessonId;

            // Calculate quality rating based on performance
            const quality = this.calculateQuality(result);

            // Get or create card for this lesson
            let cardState: SRCardState;
            const existingCard = store.cards[lessonId];
            if (!existingCard) {
                cardState = this.createNewCard(lessonId);
            } else {
                cardState = this.deserializeCard(existingCard);
            }

            // Apply SM-2 algorithm
            const updatedCard = this.applySM2(cardState, quality);

            // Create review record
            const reviewRecord: SRReviewRecord = {
                lessonId,
                rating: quality,
                reviewedAt: new Date(),
                previousInterval: cardState.interval,
                newInterval: updatedCard.interval,
                previousEaseFactor: cardState.easeFactor,
                newEaseFactor: updatedCard.easeFactor,
            };

            // Update store
            store.cards[lessonId] = this.serializeCard(updatedCard);
            store.reviewHistory.push(this.serializeReviewRecord(reviewRecord));
            store.lastUpdated = new Date().toISOString();

            // Save to storage
            await this.saveStore(store);
        } catch (error) {
            console.error('[SpacedRepetitionService] Error recording quiz result:', error);
            // Don't throw - we don't want to crash the UI
        }
    }

    /**
     * Calculate quality rating from quiz result
     * MVP: Simple mapping - correct = 4, incorrect = 1
     */
    private static calculateQuality(result: QuizResult): SRRating {
        const percentage = (result.correctAnswers / result.totalQuestions) * 100;

        if (percentage >= 90) return 5; // Perfect
        if (percentage >= 70) return 4; // Good
        if (percentage >= 50) return 3; // Acceptable
        if (percentage >= 30) return 2; // Poor
        if (percentage > 0) return 1; // Very poor
        return 0; // Complete failure
    }

    /**
     * Apply SM-2 algorithm to calculate next review interval
     */
    private static applySM2(card: SRCardState, quality: SRRating): SRCardState {
        const newCard = { ...card };

        // If quality < 3, reset the card
        if (quality < SR_RATING_THRESHOLDS.SUCCESS_THRESHOLD) {
            newCard.interval = SM2_PARAMS.INITIAL_INTERVALS[0];
            newCard.repetitions = 0;
        } else {
            // Successful review - increase interval
            if (newCard.repetitions === 0) {
                newCard.interval = SM2_PARAMS.INITIAL_INTERVALS[0];
            } else if (newCard.repetitions === 1) {
                newCard.interval = SM2_PARAMS.INITIAL_INTERVALS[1];
            } else {
                newCard.interval = Math.round(newCard.interval * newCard.easeFactor);
            }
            newCard.repetitions += 1;
        }

        // Update ease factor using SM-2 formula
        newCard.easeFactor =
            newCard.easeFactor +
            (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

        // Apply ease factor constraints
        if (newCard.easeFactor < SM2_PARAMS.MIN_EASE) {
            newCard.easeFactor = SM2_PARAMS.MIN_EASE;
        }
        if (newCard.easeFactor > SM2_PARAMS.MAX_EASE) {
            newCard.easeFactor = SM2_PARAMS.MAX_EASE;
        }

        // Apply interval safety caps
        if (newCard.interval > SR_SAFETY_CAPS.MAX_INTERVAL_DAYS) {
            newCard.interval = SR_SAFETY_CAPS.MAX_INTERVAL_DAYS;
        }
        if (newCard.interval < SR_SAFETY_CAPS.MIN_INTERVAL_DAYS) {
            newCard.interval = SR_SAFETY_CAPS.MIN_INTERVAL_DAYS;
        }

        // Calculate next review date
        const now = new Date();
        newCard.nextReviewAt = new Date(now.getTime() + newCard.interval * 24 * 60 * 60 * 1000);
        newCard.lastReviewedAt = now;

        return newCard;
    }

    /**
     * Create a new card for a lesson
     */
    private static createNewCard(lessonId: QuizLessonId): SRCardState {
        const now = new Date();
        return {
            lessonId,
            easeFactor: SR_DEFAULTS.EASE_FACTOR,
            interval: SR_DEFAULTS.INTERVAL,
            repetitions: SR_DEFAULTS.REPETITIONS,
            nextReviewAt: now,
            lastReviewedAt: now,
            createdAt: now,
        };
    }

    /**
     * Load the schedule store from AsyncStorage
     */
    private static async loadStore(): Promise<SRScheduleStore> {
        try {
            const data = await AsyncStorage.getItem(SR_STORAGE_KEYS.SCHEDULE_STORE);
            if (data) {
                return JSON.parse(data);
            }
        } catch (error) {
            console.error('[SpacedRepetitionService] Error loading store:', error);
        }

        // Return empty store if not found or error
        return {
            cards: {},
            reviewHistory: [],
            lastUpdated: new Date().toISOString(),
        };
    }

    /**
     * Save the schedule store to AsyncStorage
     */
    private static async saveStore(store: SRScheduleStore): Promise<void> {
        try {
            await AsyncStorage.setItem(SR_STORAGE_KEYS.SCHEDULE_STORE, JSON.stringify(store));
        } catch (error) {
            console.error('[SpacedRepetitionService] Error saving store:', error);
        }
    }

    /**
     * Serialize card for storage (convert Dates to ISO strings)
     */
    private static serializeCard(card: SRCardState): SRCardStatePersisted {
        return {
            lessonId: card.lessonId,
            easeFactor: card.easeFactor,
            interval: card.interval,
            repetitions: card.repetitions,
            nextReviewAt: card.nextReviewAt.toISOString(),
            lastReviewedAt: card.lastReviewedAt.toISOString(),
            createdAt: card.createdAt.toISOString(),
        };
    }

    /**
     * Deserialize card from storage (convert ISO strings to Dates)
     */
    private static deserializeCard(persisted: SRCardStatePersisted): SRCardState {
        return {
            lessonId: persisted.lessonId,
            easeFactor: persisted.easeFactor,
            interval: persisted.interval,
            repetitions: persisted.repetitions,
            nextReviewAt: new Date(persisted.nextReviewAt),
            lastReviewedAt: new Date(persisted.lastReviewedAt),
            createdAt: new Date(persisted.createdAt),
        };
    }

    /**
     * Serialize review record for storage
     */
    private static serializeReviewRecord(record: SRReviewRecord): SRReviewRecordPersisted {
        return {
            lessonId: record.lessonId,
            rating: record.rating,
            reviewedAt: record.reviewedAt.toISOString(),
            previousInterval: record.previousInterval,
            newInterval: record.newInterval,
            previousEaseFactor: record.previousEaseFactor,
            newEaseFactor: record.newEaseFactor,
        };
    }

    /**
     * Get all cards due for review
     */
    static async getDueCards(): Promise<SRCardState[]> {
        try {
            const store = await this.loadStore();
            const now = new Date();

            return Object.values(store.cards)
                .map((card) => this.deserializeCard(card))
                .filter((card) => card.nextReviewAt <= now)
                .sort((a, b) => a.nextReviewAt.getTime() - b.nextReviewAt.getTime())
                .slice(0, SR_SAFETY_CAPS.MAX_CARDS_PER_SESSION);
        } catch (error) {
            console.error('[SpacedRepetitionService] Error getting due cards:', error);
            return [];
        }
    }

    /**
     * Get count of cards due for review
     */
    static async getDueCount(): Promise<number> {
        try {
            const dueCards = await this.getDueCards();
            return dueCards.length;
        } catch (error) {
            console.error('[SpacedRepetitionService] Error getting due count:', error);
            return 0;
        }
    }
}
