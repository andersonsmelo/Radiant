import AsyncStorage from '@react-native-async-storage/async-storage';
import { TelemetryService } from '../TelemetryService';
import { HEURISTICS_CONSTANTS as C } from './heuristics.constants';
import type { HeuristicAlert, HeuristicsStore } from './heuristics.types';

class HeuristicsServiceImpl {
    private memCache: HeuristicsStore | null = null;
    private todayAlertCache: HeuristicAlert | null = null;

    /**
     * getTodayAlert
     * Returns the alert for today if one exists (computed previously).
     * If not computed yet, it evaluates and returns it.
     */
    async getTodayAlert(): Promise<HeuristicAlert | null> {
        const today = this.getTodayKey();
        const store = await this.getOrLoadStore();

        if (store.alerts[today]) {
            return store.alerts[today];
        }

        // Evaluate fresh if not exists
        return this.evaluateToday();
    }

    /**
     * evaluateToday
     * Computes H1-H5 based on telemetry history.
     * Persists the result for today.
     */
    async evaluateToday(): Promise<HeuristicAlert | null> {
        const today = this.getTodayKey();

        // 1. Gather Data
        const lastAppOpenTs = await TelemetryService.getLastAppOpen();
        const previousAppOpenTs = await TelemetryService.getPreviousAppOpen();
        const history = await TelemetryService.getHistory(C.HISTORY_DAYS);

        const activeDaysLast7 = history.days.length; // Approximate, assuming TelemetryService returns only existing entries
        // Note: history.days contains DayActivity entries. TelemetryService.getHistory iterates last 7 days and pushes if exists.

        const reviewDaysLast7 = history.days.filter(d => d.reviewed).length;
        const goalCompleteDaysLast7 = history.days.filter(d => d.goalMet).length;

        // Durations & Counts from Daily Metrics
        let totalReviewDuration = 0;
        let totalReviewCount = 0;
        let totalLearnCount = 0;

        history.daily.forEach(d => {
            // Using totals from daily metrics
            totalReviewDuration += d.totals.reviewDurationMs;
            // Counts: need to check eventCounts for precision
            totalReviewCount += (d.eventCounts['review_complete'] || 0);
            totalLearnCount += (d.eventCounts['learn_complete'] || 0);
        });

        // Computed Metrics
        // Ausência ANTES desta sessão: o intervalo entre os dois últimos
        // lançamentos. Media-se `Date.now() - lastAppOpenTs` até 2026-08-07, e
        // isso era ~0 sempre — `useAppOpenLifecycle` grava `app_open` na linha
        // 64 da HomeScreen e `checkHeuristics` roda no efeito da linha 141, de
        // modo que o "último" open era o do próprio lançamento em curso. Com
        // limiar de 48h, a H3 não tinha como disparar, e o log de shadow mode
        // imprime só o id do alerta — a AUSÊNCIA dela não aparecia em lugar
        // nenhum. Sem open anterior (primeiro lançamento) não há intervalo.
        const hoursAbsentBeforeSession =
            lastAppOpenTs && previousAppOpenTs
                ? (lastAppOpenTs - previousAppOpenTs) / (1000 * 60 * 60)
                : 0;
        const reviewRatio = activeDaysLast7 > 0 ? (reviewDaysLast7 / activeDaysLast7) : 0;
        const avgReviewDuration = totalReviewCount > 0 ? (totalReviewDuration / totalReviewCount) : 0;
        const goalConsistency = activeDaysLast7 > 0 ? (goalCompleteDaysLast7 / activeDaysLast7) : 0;
        const learnReviewRatio = totalLearnCount > 0 ? (totalReviewCount / totalLearnCount) : (totalReviewCount > 0 ? 1.5 : 0);

        let alert: HeuristicAlert | null = null;

        // 2. Evaluate Heuristics (Priority Order)

        // H3: Habit Break (CRITICAL)
        if (!alert && hoursAbsentBeforeSession > C.THRESHOLDS.H3_HABIT_BREAK_HOURS) {
            alert = {
                id: 'H3',
                level: 'critical',
                mascotState: 'thinking',
                message: 'Vamos retomar com algo rápido?',
                suggestedAction: 'continue_learning', // or start_review based on implementation preference
                createdAt: Date.now(),
                context: { hoursAbsent: hoursAbsentBeforeSession.toFixed(1) }
            };
        }

        // H1: Review Avoidance (CRITICAL)
        if (!alert && activeDaysLast7 >= 3 && reviewRatio < C.THRESHOLDS.H1_REVIEW_AVOIDANCE) {
            alert = {
                id: 'H1',
                level: 'critical',
                mascotState: 'oops',
                message: 'Que tal uma revisão rápida hoje? Prometo que é curta.',
                suggestedAction: 'start_review',
                createdAt: Date.now(),
                context: { reviewRatio: reviewRatio.toFixed(2) }
            };
        }

        // H2: Review Too Long (WARNING)
        if (!alert && avgReviewDuration > C.THRESHOLDS.H2_LONG_REVIEW_MS) {
            alert = {
                id: 'H2',
                level: 'warning',
                mascotState: 'thinking',
                message: 'Sua revisão está ficando longa. Vamos fazer uma versão rápida hoje?',
                suggestedAction: 'start_review_quick',
                createdAt: Date.now(),
                context: { avgDuration: Math.round(avgReviewDuration / 1000) }
            };
        }

        // H4: Goal Ignored (WARNING)
        if (!alert && activeDaysLast7 >= 5 && goalConsistency < C.THRESHOLDS.H4_GOAL_IGNORED) {
            alert = {
                id: 'H4',
                level: 'warning',
                mascotState: 'thinking',
                message: 'Só 1 passo hoje já conta. Quer bater a meta rapidinho?',
                suggestedAction: 'continue_learning',
                createdAt: Date.now(),
                context: { consistency: goalConsistency.toFixed(2) }
            };
        }

        // H5: Healthy Flow (INFO)
        if (
            !alert &&
            learnReviewRatio >= C.THRESHOLDS.H5_FLOW_RATIO_MIN &&
            learnReviewRatio <= C.THRESHOLDS.H5_FLOW_RATIO_MAX &&
            goalConsistency >= C.THRESHOLDS.H5_GOAL_CONSISTENCY
        ) {
            alert = {
                id: 'H5',
                level: 'info',
                mascotState: 'happy',
                message: 'Seu ritmo está excelente. Continue assim.',
                suggestedAction: 'none',
                createdAt: Date.now(),
                context: { ratio: learnReviewRatio.toFixed(2), consistency: goalConsistency.toFixed(2) }
            };
        }

        // 3. Persist
        if (alert) {
            const store = await this.getOrLoadStore();
            store.alerts[today] = alert;
            await this.saveStore(store);
            this.todayAlertCache = alert;
        }

        return alert;
    }

    /**
     * markShownToday
     * Marks that the alert was shown to the user today, preventing spam.
     */
    async markShownToday() {
        const today = this.getTodayKey();
        const store = await this.getOrLoadStore();
        store.shown[today] = true;
        await this.saveStore(store);
    }

    /**
     * wasShownToday
     * Returns true if an alert was already shown today.
     */
    async wasShownToday(): Promise<boolean> {
        const today = this.getTodayKey();
        const store = await this.getOrLoadStore();
        return !!store.shown[today];
    }

    async getHistory(days: number): Promise<{ date: string; alert: HeuristicAlert }[]> {
        const store = await this.getOrLoadStore();
        const result = [];
        const today = new Date();
        for (let i = 0; i < days; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            if (store.alerts[key]) {
                result.push({ date: key, alert: store.alerts[key] });
            }
        }
        return result;
    }

    async clear() {
        await AsyncStorage.multiRemove([C.STORAGE_KEYS.ALERTS, C.STORAGE_KEYS.SHOWN]);
        this.memCache = null;
        this.todayAlertCache = null;
    }

    // --- Private ---

    private async getOrLoadStore(): Promise<HeuristicsStore> {
        if (this.memCache) return this.memCache;

        try {
            const alertsJson = await AsyncStorage.getItem(C.STORAGE_KEYS.ALERTS);
            const shownJson = await AsyncStorage.getItem(C.STORAGE_KEYS.SHOWN);

            this.memCache = {
                alerts: alertsJson ? JSON.parse(alertsJson) : {},
                shown: shownJson ? JSON.parse(shownJson) : {},
            };
        } catch {
            this.memCache = { alerts: {}, shown: {} };
        }
        return this.memCache!;
    }

    private async saveStore(store: HeuristicsStore) {
        this.memCache = store;
        await AsyncStorage.multiSet([
            [C.STORAGE_KEYS.ALERTS, JSON.stringify(store.alerts)],
            [C.STORAGE_KEYS.SHOWN, JSON.stringify(store.shown)],
        ]);
    }

    private getTodayKey(): string {
        return new Date().toISOString().split('T')[0];
    }
}

export const HeuristicsService = new HeuristicsServiceImpl();
