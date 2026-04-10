/**
 * Gamification Configuration & Constants
 */

/**
 * AsyncStorage key for persisting gamification state.
 * Versioned to allow for future migrations.
 */
export const GAMIFICATION_STORAGE_KEY = 'radiant:gami:v1';

/**
 * Experience Point (XP) Rules
 */
export const XP_RULES = {
    /** Base XP awarded for completing any quiz */
    BASE_XP_PER_QUIZ: 10,
    /** Bonus XP for accuracy >= 80% */
    BONUS_XP_80PCT: 5,
    /** Bonus XP for accuracy >= 90% */
    BONUS_XP_90PCT: 8,
};

/**
 * Helper to format a date as a local 'YYYY-MM-DD' string key.
 * Used for streak calculation to ensure daily uniqueness.
 *
 * @param date The date to format
 * @returns String in YYYY-MM-DD format
 */
export function formatLocalDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
