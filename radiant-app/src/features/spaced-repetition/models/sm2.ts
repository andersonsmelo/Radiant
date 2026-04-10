/**
 * Minimal SM-2 model helpers preserved as a shared domain module.
 * The production schedule logic currently lives in `SpacedRepetitionService`.
 */

import { SM2_PARAMS, SR_DEFAULTS, SR_SAFETY_CAPS } from '../../../constants/spacedRepetition';
import type { SRCardState, SRRating } from '../../../types/spacedRepetition';

export function applySm2Step(card: SRCardState, rating: SRRating): SRCardState {
    const nextCard: SRCardState = {
        ...card,
        nextReviewAt: new Date(card.nextReviewAt),
        lastReviewedAt: new Date(card.lastReviewedAt),
        createdAt: new Date(card.createdAt),
    };

    const success = rating >= 3;
    nextCard.repetitions = success ? nextCard.repetitions + 1 : 0;
    nextCard.easeFactor = clampEaseFactor(
        nextCard.easeFactor + (success ? SM2_PARAMS.EASE_STEP_UP : -SM2_PARAMS.EASE_STEP_DOWN)
    );

    if (!success) {
        nextCard.interval = SR_DEFAULTS.INTERVAL;
    } else if (nextCard.repetitions === 1) {
        nextCard.interval = SM2_PARAMS.INITIAL_INTERVALS[0];
    } else if (nextCard.repetitions === 2) {
        nextCard.interval = SM2_PARAMS.INITIAL_INTERVALS[1];
    } else {
        nextCard.interval = Math.min(
            Math.round(nextCard.interval * nextCard.easeFactor),
            SR_SAFETY_CAPS.MAX_INTERVAL_DAYS
        );
    }

    nextCard.lastReviewedAt = new Date();
    nextCard.nextReviewAt = new Date(Date.now() + nextCard.interval * 24 * 60 * 60 * 1000);
    return nextCard;
}

export function clampEaseFactor(value: number): number {
    return Math.min(Math.max(value, SM2_PARAMS.MIN_EASE), SM2_PARAMS.MAX_EASE);
}
