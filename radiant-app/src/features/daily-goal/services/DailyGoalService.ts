// src/features/daily-goal/services/DailyGoalService.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyGoalSnapshot } from '../../../types/dailyGoal';
import {
    DAILY_GOAL_STORAGE_KEY,
    DEFAULT_DAILY_GOAL,
    formatLocalDateKey
} from '../../../constants/dailyGoal';

/**
 * Internal storage structure for daily goal data
 */
interface DailyGoalStore {
    dateKey: string | null;
    completedToday: number;
    goalPerDay: number;
}

/**
 * DailyGoalService
 *
 * Manages daily quiz completion tracking using AsyncStorage.
 * Calendar days are based on local date keys (YYYY-MM-DD).
 * Automatically resets progress when a new day is detected.
 */
class DailyGoalServiceClass {
    /**
     * Loads the current store from AsyncStorage
     * Returns safe defaults if storage is missing or corrupt
     */
    private async loadStore(): Promise<DailyGoalStore> {
        try {
            const raw = await AsyncStorage.getItem(DAILY_GOAL_STORAGE_KEY);

            if (!raw) {
                return this.getDefaultStore();
            }

            const parsed = JSON.parse(raw);

            // Validate structure
            if (
                typeof parsed === 'object' &&
                parsed !== null &&
                typeof parsed.completedToday === 'number' &&
                typeof parsed.goalPerDay === 'number'
            ) {
                return {
                    dateKey: parsed.dateKey ?? null,
                    completedToday: Math.max(0, parsed.completedToday),
                    goalPerDay: Math.max(1, parsed.goalPerDay),
                };
            }

            return this.getDefaultStore();
        } catch (error) {
            console.warn('[DailyGoalService] Failed to load store, using defaults:', error);
            return this.getDefaultStore();
        }
    }

    /**
     * Saves the store to AsyncStorage
     */
    private async saveStore(store: DailyGoalStore): Promise<void> {
        try {
            await AsyncStorage.setItem(DAILY_GOAL_STORAGE_KEY, JSON.stringify(store));
        } catch (error) {
            console.error('[DailyGoalService] Failed to save store:', error);
            throw error;
        }
    }

    /**
     * Returns default store values
     */
    private getDefaultStore(): DailyGoalStore {
        return {
            dateKey: null,
            completedToday: 0,
            goalPerDay: DEFAULT_DAILY_GOAL,
        };
    }

    /**
     * Ensures the store is synchronized with the given date
     * Resets completedToday if the dateKey doesn't match today
     */
    private ensureDateSync(store: DailyGoalStore, todayKey: string): DailyGoalStore {
        if (store.dateKey !== todayKey) {
            return {
                ...store,
                dateKey: todayKey,
                completedToday: 0,
            };
        }
        return store;
    }

    /**
     * Converts internal store to public snapshot
     */
    private toSnapshot(store: DailyGoalStore): DailyGoalSnapshot {
        return {
            completedToday: store.completedToday,
            goalPerDay: store.goalPerDay,
            isCompleted: store.completedToday >= store.goalPerDay,
            dateKey: store.dateKey,
        };
    }

    /**
     * Gets the current daily goal snapshot
     *
     * @param now - Optional date to use as "today" (defaults to current time)
     * @returns Current daily goal snapshot
     */
    async getSnapshot(now: Date = new Date()): Promise<DailyGoalSnapshot> {
        const todayKey = formatLocalDateKey(now);
        let store = await this.loadStore();

        // Sync with today's date (resets if new day)
        store = this.ensureDateSync(store, todayKey);

        // Save if date changed
        if (store.dateKey !== todayKey) {
            await this.saveStore(store);
        }

        return this.toSnapshot(store);
    }

    /**
     * Records a quiz completion and updates the daily goal progress
     *
     * @param answeredAt - The date/time when the quiz was completed
     * @returns Updated daily goal snapshot
     */
    async recordQuizCompletion(answeredAt: Date = new Date()): Promise<DailyGoalSnapshot> {
        const dayKey = formatLocalDateKey(answeredAt);
        let store = await this.loadStore();

        // Ensure store is for the correct day
        store = this.ensureDateSync(store, dayKey);

        // Increment completedToday, capped at goalPerDay
        store.completedToday = Math.min(store.goalPerDay, store.completedToday + 1);

        // Save updated store
        await this.saveStore(store);

        return this.toSnapshot(store);
    }

    async reset(): Promise<void> {
        await AsyncStorage.removeItem(DAILY_GOAL_STORAGE_KEY);
    }
}

/**
 * Singleton instance of DailyGoalService
 */
export const DailyGoalService = new DailyGoalServiceClass();
