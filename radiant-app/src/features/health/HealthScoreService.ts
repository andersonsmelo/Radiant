import AsyncStorage from '@react-native-async-storage/async-storage';
import { TelemetryService } from '../telemetry/TelemetryService';
import type { HealthScore, HealthComponents, HealthLabel } from './health.types';

const STORAGE_KEY = 'health.score.v1';
const WINDOW_DAYS = 7;

class HealthScoreServiceImpl {
    private memCache: HealthScore | null = null;

    /**
     * getScore
     * Returns the current health score.
     * Uses cache if available and same day, unless force=true.
     */
    async getScore(opts?: { force?: boolean }): Promise<HealthScore | null> {
        const today = new Date().toISOString().split('T')[0];

        // Check Cache
        if (!opts?.force) {
            const cached = await this.getLastScore();
            if (cached && cached.dayKey === today) {
                return cached;
            }
        }

        // Compute Fresh
        return this.computeScore(today);
    }

    async getLastScore(): Promise<HealthScore | null> {
        if (this.memCache) return this.memCache;
        try {
            const json = await AsyncStorage.getItem(STORAGE_KEY);
            if (json) {
                this.memCache = JSON.parse(json);
                return this.memCache;
            }
        } catch (e) {
            console.warn('[HealthScore] Failed to load cache', e);
        }
        return null;
    }

    async clear(): Promise<void> {
        await AsyncStorage.removeItem(STORAGE_KEY);
        this.memCache = null;
    }

    // --- Private ---

    private async computeScore(dayKey: string): Promise<HealthScore | null> {
        const history = await TelemetryService.getHistory(WINDOW_DAYS); // last 7 days
        const lastAppOpenTs = await TelemetryService.getLastAppOpen();

        // 1. Raw Metrics
        const activeDaysLast7 = history.days.length; // Approximate active days (days with record)

        // If insufficient data, return null
        if (activeDaysLast7 < 3) {
            return null;
        }

        const reviewDaysLast7 = history.days.filter(d => d.reviewed).length;
        const goalCompleteDaysLast7 = history.days.filter(d => d.goalMet).length;

        let reviewCompleteLast7 = 0;
        let learnCompleteLast7 = 0;

        history.daily.forEach(d => {
            reviewCompleteLast7 += (d.eventCounts['review_complete'] || 0);
            learnCompleteLast7 += (d.eventCounts['learn_complete'] || 0);
        });

        const hoursSinceLastOpen = lastAppOpenTs ? (Date.now() - lastAppOpenTs) / (1000 * 60 * 60) : 0;

        // 2. Components Calculation

        // C: Consistency (0..35)
        const consistencyRaw = this.clamp((activeDaysLast7 - 2) / 5, 0, 1);
        const C = Math.round(consistencyRaw * 35);

        // R: Review Stickiness (0..35)
        const reviewRatio = activeDaysLast7 > 0 ? this.clamp(reviewDaysLast7 / activeDaysLast7, 0, 1) : 0;
        const reviewRaw = this.clamp(reviewRatio / 0.6, 0, 1);
        const R = Math.round(reviewRaw * 35);

        // B: Balance (0..20)
        // ratio = reviews / max(1, learns)
        const ratio = reviewCompleteLast7 / Math.max(1, learnCompleteLast7);
        let balanceRaw = 0;
        if (ratio <= 0.3) balanceRaw = 0;
        else if (ratio < 0.7) balanceRaw = (ratio - 0.3) / 0.4;
        else if (ratio <= 1.3) balanceRaw = 1;
        else if (ratio < 2.0) balanceRaw = (2.0 - ratio) / 0.7;
        else balanceRaw = 0;

        const B = Math.round(this.clamp(balanceRaw, 0, 1) * 20);

        // G: Goal Consistency (0..10)
        const goalRatio = activeDaysLast7 > 0 ? this.clamp(goalCompleteDaysLast7 / activeDaysLast7, 0, 1) : 0;
        const G = Math.round(goalRatio * 10);

        // P: Penalty
        let penalty = 0;
        if (hoursSinceLastOpen > 72) penalty = 15;
        else if (hoursSinceLastOpen > 48) penalty = 8;

        // Final Score
        const score = this.clamp(C + R + B + G - penalty, 0, 100);

        // Label Logic
        let label: HealthLabel = 'adjusting';
        let microcopy = "Vamos retomar com algo curto hoje.";

        if (score >= 85) {
            label = 'excellent';
            microcopy = "Excelente constância. Continue assim.";
        } else if (score >= 60) {
            label = 'strong';
            microcopy = "Ótimo! Você está mantendo o hábito.";
        } else if (score >= 30) {
            label = 'consistent';
            microcopy = "Bom ritmo. Uma revisão rápida mantém a consistência.";
        }

        const components: HealthComponents = {
            consistency: C,
            reviewStickiness: R,
            balance: B,
            goalConsistency: G,
            penalty
        };

        const result: HealthScore = {
            score,
            label,
            microcopy,
            components,
            windowDays: WINDOW_DAYS,
            computedAt: Date.now(),
            dayKey
        };

        await this.persist(result);
        return result;
    }

    private async persist(score: HealthScore) {
        this.memCache = score;
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(score));
        } catch (e) {
            console.warn('[HealthScore] Failed to persist', e);
        }
    }

    private clamp(val: number, min: number, max: number): number {
        return Math.min(Math.max(val, min), max);
    }
}

export const HealthScoreService = new HealthScoreServiceImpl();
