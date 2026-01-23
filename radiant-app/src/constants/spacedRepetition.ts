// src/constants/spacedRepetition.ts

/**
 * Spaced Repetition Constants
 * 
 * This file contains all constants and configuration values for the spaced repetition feature.
 * No React imports, no business logic - configuration only.
 */

/**
 * AsyncStorage keys for spaced repetition data
 */
export const SR_STORAGE_KEYS = {
    SCHEDULE_STORE: '@radiant:sr_schedule_v1',
    REVIEW_HISTORY: '@radiant:sr_history_v1',
} as const;

/**
 * SM-2 Algorithm Parameters (SuperMemo 2)
 * These are the core parameters for the spaced repetition algorithm
 */
export const SM2_PARAMS = {
    /**
     * Initial ease factor for new cards
     * Higher = easier card, longer intervals
     */
    INITIAL_EASE: 2.5,

    /**
     * Minimum ease factor (prevents cards from becoming too difficult)
     */
    MIN_EASE: 1.3,

    /**
     * Maximum ease factor (prevents unrealistic intervals)
     */
    MAX_EASE: 2.5,

    /**
     * Ease factor increase for good/easy ratings
     */
    EASE_STEP_UP: 0.15,

    /**
     * Ease factor decrease for hard/again ratings
     */
    EASE_STEP_DOWN: 0.2,

    /**
     * Initial intervals for first reviews (in days)
     * [0] = first review after rating >= 3
     * [1] = second review after rating >= 3
     */
    INITIAL_INTERVALS: [1, 3],

    /**
     * Multiplier for calculating next interval
     * nextInterval = currentInterval * easeFactor
     */
    INTERVAL_MULTIPLIER: 1.0,
} as const;

/**
 * Safety caps to prevent extreme values
 */
export const SR_SAFETY_CAPS = {
    /**
     * Maximum interval in days (1 year)
     */
    MAX_INTERVAL_DAYS: 365,

    /**
     * Minimum interval in days
     */
    MIN_INTERVAL_DAYS: 1,

    /**
     * Maximum number of cards to review in one session
     */
    MAX_CARDS_PER_SESSION: 50,
} as const;

/**
 * Rating thresholds for determining card performance
 */
export const SR_RATING_THRESHOLDS = {
    /**
     * Minimum rating to consider a review "successful"
     */
    SUCCESS_THRESHOLD: 3,

    /**
     * Rating that resets the card (complete failure)
     */
    RESET_THRESHOLD: 1,
} as const;

/**
 * Time windows for due card filtering
 */
export const SR_TIME_WINDOWS = {
    /**
     * Hours to look ahead for "due soon" cards
     */
    DUE_SOON_HOURS: 24,

    /**
     * Days to look ahead for "upcoming" cards
     */
    UPCOMING_DAYS: 7,
} as const;

/**
 * Default values for new cards
 */
export const SR_DEFAULTS = {
    EASE_FACTOR: SM2_PARAMS.INITIAL_EASE,
    INTERVAL: 0,
    REPETITIONS: 0,
} as const;
