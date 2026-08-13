/**
 * Daily Goal Core Types
 * Defines the shape of the persistence layer and runtime snapshots.
 */

/**
 * Persisted state for daily goal tracking.
 * Stored in AsyncStorage or similar.
 */
export interface DailyGoalStore {
    /** Number of quizzes to complete per day */
    goalPerDay: number;
    /** Number of quizzes completed today */
    completedToday: number;
    /** Format: YYYY-MM-DD, used to track daily progress */
    dateKey: string | null;
    /** ISO timestamp of last update */
    updatedAt: string;
}

/**
 * Runtime view of daily goal state.
 * Usually exposed to UI components.
 */
export interface DailyGoalSnapshot {
    goalXp?: number;
    earnedXpToday?: number;
    tierId?: import('../constants/dailyGoal').DailyGoalTierId;
    goalPerDay: number;
    completedToday: number;
    isCompleted: boolean;
    dateKey: string | null;
}
