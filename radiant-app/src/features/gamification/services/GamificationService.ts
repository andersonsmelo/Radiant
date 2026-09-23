/**
 * GamificationService
 * Manages XP, Streaks and persistence for the Gamification Light MVP.
 * As vidas moram no `heartsRepository` (features/hearts) desde 2026-09-23.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { GAMIFICATION_STORAGE_KEY, XP_RULES, formatLocalDateKey } from '../../../constants/gamification';
import type { GamificationStore, GamificationSnapshot, XpAward } from '../../../types/gamification';
import type { QuizResult } from '../../../types/quiz';

const DEFAULT_STORE: GamificationStore = {
    totalXp: 0,
    streakDays: 1,
    lastActiveDate: null,
    updatedAt: new Date().toISOString(),
};

class GamificationServiceImpl {
    private memCache: GamificationStore | null = null;

    /**
     * Get the current snapshot of gamification state.
     */
    async getSnapshot(): Promise<GamificationSnapshot> {
        const store = await this.getOrLoadStore();
        return this.toSnapshot(store);
    }

    /**
     * Record a quiz completion, calculate award, update store, and return details.
     */
    async recordQuizCompletion(result: QuizResult): Promise<{ snapshot: GamificationSnapshot; award: XpAward }> {
        const store = await this.getOrLoadStore();

        const award = this.calculateXpAward(result);
        store.totalXp += award.totalXpAwarded;
        this.updateStreak(store, result.answeredAt);
        store.updatedAt = new Date().toISOString();

        await this.saveStore(store);

        return { snapshot: this.toSnapshot(store), award };
    }

    /**
     * Manually add XP (e.g. for Reviews v2).
     */
    async addManualXp(amount: number): Promise<GamificationSnapshot> {
        const store = await this.getOrLoadStore();
        store.totalXp += amount;
        store.updatedAt = new Date().toISOString();
        await this.saveStore(store);
        return this.toSnapshot(store);
    }

    /**
     * Mescla XP e sequência vindos de um backup: fica com o maior de cada um.
     * Passa pelo cache em memória de propósito — escrever o storage por fora
     * seria sobrescrito na próxima gravação.
     */
    async absorbBackup(backup: { totalXp: number; streakDays: number }): Promise<GamificationSnapshot> {
        const store = await this.getOrLoadStore();
        store.totalXp = Math.max(store.totalXp, backup.totalXp);
        store.streakDays = Math.max(store.streakDays, backup.streakDays);
        store.updatedAt = new Date().toISOString();
        await this.saveStore(store);
        return this.toSnapshot(store);
    }

    async reset(): Promise<void> {
        this.memCache = { ...DEFAULT_STORE };
        try {
            await AsyncStorage.removeItem(GAMIFICATION_STORAGE_KEY);
        } catch (error) {
            console.error('[GamificationService] Failed to reset store:', error);
            throw error;
        }
    }

    // ── Private Helpers ──────────────────────────────────────

    private toSnapshot(store: GamificationStore): GamificationSnapshot {
        return {
            totalXp: store.totalXp,
            streakDays: store.streakDays,
            lastActiveDate: store.lastActiveDate,
        };
    }

    private async getOrLoadStore(): Promise<GamificationStore> {
        if (this.memCache) return this.memCache;

        try {
            const json = await AsyncStorage.getItem(GAMIFICATION_STORAGE_KEY);
            if (json) {
                const parsed = JSON.parse(json);
                this.memCache = { ...DEFAULT_STORE, ...parsed };
            } else {
                this.memCache = { ...DEFAULT_STORE };
            }
        } catch (error) {
            console.error('[GamificationService] Failed to load store, using default:', error);
            this.memCache = { ...DEFAULT_STORE };
        }

        return this.memCache!;
    }

    private async saveStore(store: GamificationStore): Promise<void> {
        this.memCache = store;
        try {
            await AsyncStorage.setItem(GAMIFICATION_STORAGE_KEY, JSON.stringify(store));
        } catch (error) {
            console.error('[GamificationService] Failed to save store:', error);
        }
    }

    private calculateXpAward(result: QuizResult): XpAward {
        const total = result.totalQuestions > 0 ? result.totalQuestions : 1;
        const accuracy = result.correctAnswers / total;
        const baseXp = XP_RULES.BASE_XP_PER_QUIZ;
        let bonusXp = 0;
        if (accuracy >= 0.9) bonusXp = XP_RULES.BONUS_XP_90PCT;
        else if (accuracy >= 0.8) bonusXp = XP_RULES.BONUS_XP_80PCT;
        return { baseXp, bonusXp, totalXpAwarded: baseXp + bonusXp, reason: 'quiz_complete' };
    }

    private updateStreak(store: GamificationStore, answeredAt: Date) {
        const todayKey = formatLocalDateKey(answeredAt);
        if (!store.lastActiveDate) {
            store.streakDays = 1;
            store.lastActiveDate = todayKey;
            return;
        }
        if (store.lastActiveDate === todayKey) return;

        const lastDate = new Date(store.lastActiveDate);
        const nextDay = new Date(lastDate);
        nextDay.setDate(lastDate.getDate() + 1);

        if (todayKey === formatLocalDateKey(nextDay)) {
            store.streakDays += 1;
        } else {
            store.streakDays = 1;
        }
        store.lastActiveDate = todayKey;
    }
}

export const GamificationService = new GamificationServiceImpl();
