// src/constants/dailyGoal.ts

/**
 * Daily Goal Constants
 * Manages AsyncStorage keys and default values for daily goal tracking
 */

/**
 * AsyncStorage key for daily goal (versioned)
 */
export const DAILY_GOAL_STORAGE_KEY = 'radiant:daily-goal:v1';

/**
 * Default daily goal value
 */
export const DEFAULT_DAILY_GOAL = 1;

/**
 * Formats a Date object into a local date key string (YYYY-MM-DD)
 * @param date - The date to format
 * @returns Date string in YYYY-MM-DD format
 *
 * @example
 * formatLocalDateKey(new Date('2026-01-26T19:39:20-03:00')) // '2026-01-26'
 */
export function formatLocalDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}
