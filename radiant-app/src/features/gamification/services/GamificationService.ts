/**
 * GamificationService
 * Manages XP, Streaks, Hearts and persistence for the Gamification Light MVP.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { GAMIFICATION_STORAGE_KEY, XP_RULES, formatLocalDateKey } from '../../../constants/gamification';
import type { GamificationStore, GamificationSnapshot, XpAward } from '../../../types/gamification';
import type { QuizResult } from '../../../types/quiz';

const MAX_HEARTS = 5;
/** Intervalo em ms para recarregar 1 coração (30 minutos) */
export const HEART_REFILL_INTERVAL_MS = 30 * 60 * 1000;

const DEFAULT_STORE: GamificationStore = {
    totalXp: 0,
    streakDays: 1,
    lastActiveDate: null,
    updatedAt: new Date().toISOString(),
    hearts: MAX_HEARTS,
    maxHearts: MAX_HEARTS,
    heartsLastRefillAt: null,
};

class GamificationServiceImpl {
    private memCache: GamificationStore | null = null;

    /**
     * Get the current snapshot of gamification state.
     * Applies passive heart refill before returning.
     */
    async getSnapshot(): Promise<GamificationSnapshot> {
        const store = await this.getOrLoadStore();
        await this.applyPassiveHeartRefill(store);
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

    // ── Hearts ───────────────────────────────────────────────

    /**
     * Desconta 1 coração (quando o aluno erra uma questão).
     * Retorna o snapshot atualizado.
     */
    async loseHeart(): Promise<GamificationSnapshot> {
        const store = await this.getOrLoadStore();
        if (store.hearts > 0) {
            store.hearts -= 1;
            // Inicia o timer de recarga ao perder o primeiro coração
            if (!store.heartsLastRefillAt) {
                store.heartsLastRefillAt = new Date().toISOString();
            }
            store.updatedAt = new Date().toISOString();
            await this.saveStore(store);
        }
        return this.toSnapshot(store);
    }

    /**
     * Restaura todos os corações (ex: ao completar uma missão diária).
     */
    async refillHearts(): Promise<GamificationSnapshot> {
        const store = await this.getOrLoadStore();
        store.hearts = store.maxHearts;
        store.heartsLastRefillAt = null;
        store.updatedAt = new Date().toISOString();
        await this.saveStore(store);
        return this.toSnapshot(store);
    }

    /**
     * Verifica se o aluno pode iniciar uma nova lição.
     * Revisões (spaced repetition) NUNCA são bloqueadas por corações.
     */
    async canStartLesson(): Promise<boolean> {
        const store = await this.getOrLoadStore();
        await this.applyPassiveHeartRefill(store);
        return store.hearts > 0;
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
            hearts: store.hearts,
            maxHearts: store.maxHearts,
            heartsNextRefillAt:
                store.hearts < store.maxHearts && store.heartsLastRefillAt
                    ? new Date(
                          new Date(store.heartsLastRefillAt).getTime() + HEART_REFILL_INTERVAL_MS
                      ).toISOString()
                    : null,
        };
    }

    /**
     * Recarga passiva: 1 coração a cada HEART_REFILL_INTERVAL_MS.
     * Mutates store in place; caller must saveStore if changed.
     */
    private async applyPassiveHeartRefill(store: GamificationStore): Promise<void> {
        if (store.hearts >= store.maxHearts || !store.heartsLastRefillAt) return;

        const now = Date.now();
        const lastRefill = new Date(store.heartsLastRefillAt).getTime();
        const elapsed = now - lastRefill;
        const heartsToAdd = Math.floor(elapsed / HEART_REFILL_INTERVAL_MS);

        if (heartsToAdd <= 0) return;

        store.hearts = Math.min(store.maxHearts, store.hearts + heartsToAdd);

        if (store.hearts >= store.maxHearts) {
            store.heartsLastRefillAt = null;
        } else {
            // Avança o timestamp pelo número de corações recarregados
            const newRefillAt = lastRefill + heartsToAdd * HEART_REFILL_INTERVAL_MS;
            store.heartsLastRefillAt = new Date(newRefillAt).toISOString();
        }

        store.updatedAt = new Date().toISOString();
        await this.saveStore(store);
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
