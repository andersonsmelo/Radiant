import AsyncStorage from '@react-native-async-storage/async-storage';
import { TELEMETRY_CONSTANTS } from './telemetry.constants';
import type {
    CrashReportingAdapter,
    DailyMetric,
    DayActivity,
    ProductAnalyticsAdapter,
    TelemetryEvent,
    TelemetryEventName,
    TelemetryStore,
} from './telemetry.types';

class TelemetryServiceImpl {
    private queue: TelemetryEvent[] = [];
    private timers: Record<string, number> = {};
    private isPersisting = false;
    private memCache: TelemetryStore | null = null;
    private productAnalyticsAdapters: ProductAnalyticsAdapter[] = [];
    private crashReportingAdapters: CrashReportingAdapter[] = [];

    registerProductAnalyticsAdapter(adapter: ProductAnalyticsAdapter): void {
        this.productAnalyticsAdapters.push(adapter);
    }

    registerCrashReportingAdapter(adapter: CrashReportingAdapter): void {
        this.crashReportingAdapters.push(adapter);
    }

    async track(name: TelemetryEventName, props?: Record<string, unknown>): Promise<void> {
        const event: TelemetryEvent = {
            id: Math.random().toString(36).substring(2, 15),
            ts: Date.now(),
            name,
            props,
        };

        this.queue.push(event);
        void this.persist();

        for (const adapter of this.crashReportingAdapters) {
            try {
                await adapter.addBreadcrumb?.(name, props);
            } catch (error) {
                console.warn('[Telemetry] Crash reporting breadcrumb failed:', error);
            }
        }

        for (const adapter of this.productAnalyticsAdapters) {
            try {
                await adapter.track(event);
            } catch (error) {
                console.warn('[Telemetry] Product analytics adapter failed:', error);
            }
        }
    }

    /**
     * startTimer
     * Starts a timer for duration tracking.
     */
    startTimer(key: string): void {
        this.timers[key] = Date.now();
    }

    /**
     * stopTimer
     * Stops a timer and returns duration in ms.
     */
    stopTimer(key: string): number {
        const start = this.timers[key];
        if (!start) return 0;
        const duration = Date.now() - start;
        delete this.timers[key];
        return duration;
    }

    /**
     * getDailySummary
     * Returns stats for a specific date (defaults to today).
     */
    async getDailySummary(dateStr?: string): Promise<DailyMetric | null> {
        const targetDate = dateStr || this.getTodayKey();
        const store = await this.getOrLoadStore();
        return store.dailyHelpers[targetDate] || null;
    }

    /**
     * exportEvents
     * Returns JSON string of all events.
     */
    async exportEvents(): Promise<string> {
        const store = await this.getOrLoadStore();
        return JSON.stringify(store, null, 2);
    }

    /**
     * clear
     * Wipes telemetry data.
     */
    async clear(): Promise<void> {
        await AsyncStorage.multiRemove([
            TELEMETRY_CONSTANTS.STORAGE_KEYS.EVENTS,
            TELEMETRY_CONSTANTS.STORAGE_KEYS.DAILY_STATS,
            TELEMETRY_CONSTANTS.STORAGE_KEYS.COHORTS,
            TELEMETRY_CONSTANTS.STORAGE_KEYS.DAYS,
        ]);
        this.queue = [];
        this.memCache = null;
    }

    // --- v1.1: Retention & Engagement ---

    async markDayOpen(): Promise<void> {
        const store = await this.getOrLoadStore();
        const today = this.getTodayKey();

        // 1. Init Cohort if empty
        if (!store.cohort.installDate) {
            store.cohort.installDate = today;
        }

        // 2. Mark Day Activity
        if (!store.days[today]) {
            store.days[today] = { date: today, opened: true, reviewed: false, goalMet: false };
        } else {
            store.days[today].opened = true;
        }

        // 3. Check Retention
        const daysDiff = this.daysBetween(store.cohort.installDate, today);
        if (daysDiff === 1) store.cohort.retention.d1 = true;
        if (daysDiff === 3) store.cohort.retention.d3 = true;
        if (daysDiff === 7) store.cohort.retention.d7 = true;

        await this.saveStore(store);
    }

    async markDayReviewed(): Promise<void> {
        const store = await this.getOrLoadStore();
        const today = this.getTodayKey();

        if (!store.days[today]) {
            store.days[today] = { date: today, opened: true, reviewed: true, goalMet: false };
        } else {
            store.days[today].reviewed = true;
        }

        await this.saveStore(store);
    }

    async markDayGoalMet(): Promise<void> {
        const store = await this.getOrLoadStore();
        const today = this.getTodayKey();

        if (!store.days[today]) {
            store.days[today] = { date: today, opened: true, reviewed: false, goalMet: true };
        } else {
            store.days[today].goalMet = true;
        }

        await this.saveStore(store);
    }

    async getHistory(daysBack: number): Promise<{ days: DayActivity[]; daily: DailyMetric[] }> {
        const store = await this.getOrLoadStore();
        const today = new Date();
        const resultDays: DayActivity[] = [];
        const resultDaily: DailyMetric[] = [];

        for (let i = 0; i < daysBack; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];

            if (store.days[dateStr]) {
                resultDays.push(store.days[dateStr]);
            }
            if (store.dailyHelpers[dateStr]) {
                resultDaily.push(store.dailyHelpers[dateStr]);
            }
        }
        return { days: resultDays, daily: resultDaily };
    }

    async getLastAppOpen(): Promise<number | null> {
        const store = await this.getOrLoadStore();
        // search reverse in events? Events are chronologically appended.
        // Assuming queue is saved.
        for (let i = store.events.length - 1; i >= 0; i--) {
            if (store.events[i].name === 'app_open') {
                return store.events[i].ts;
            }
        }
        return null;
    }

    /**
     * getPreviousAppOpen
     * O penúltimo `app_open`, ou `null` quando só existe um.
     *
     * `app_open` é latcheado por processo (`useAppOpenLifecycle`), então dois
     * eventos consecutivos são dois lançamentos, e o intervalo entre eles é
     * quanto tempo o usuário passou fora. Quem quer medir ausência precisa
     * DESTE valor junto com `getLastAppOpen()`: sozinho, o último é o evento do
     * próprio lançamento em curso, e o intervalo até agora dá ~0 sempre.
     */
    async getPreviousAppOpen(): Promise<number | null> {
        const store = await this.getOrLoadStore();
        let encontrados = 0;
        for (let i = store.events.length - 1; i >= 0; i--) {
            if (store.events[i].name === 'app_open') {
                encontrados += 1;
                if (encontrados === 2) {
                    return store.events[i].ts;
                }
            }
        }
        return null;
    }

    async countEvents(name: TelemetryEventName): Promise<number> {
        const store = await this.getOrLoadStore();
        return store.events.filter((event) => event.name === name).length;
    }

    async hasEvent(name: TelemetryEventName): Promise<boolean> {
        return (await this.countEvents(name)) > 0;
    }

    async getEvents(options?: {
        names?: TelemetryEventName[];
        limit?: number;
    }): Promise<TelemetryEvent[]> {
        const store = await this.getOrLoadStore();
        let events = store.events;

        if (options?.names && options.names.length > 0) {
            const allowed = new Set(options.names);
            events = events.filter((event) => allowed.has(event.name));
        }

        if (options?.limit && options.limit > 0) {
            return events.slice(-options.limit);
        }

        return events;
    }

    async getRetentionStats(): Promise<{ d1: boolean; d3: boolean; d7: boolean }> {
        const store = await this.getOrLoadStore();
        return store.cohort.retention;
    }

    async getInstallDate(): Promise<string | null> {
        const store = await this.getOrLoadStore();
        return store.cohort.installDate || null;
    }

    async getReviewStickiness(): Promise<number> {
        const store = await this.getOrLoadStore();
        const days = Object.values(store.days);
        if (days.length === 0) return 0;

        const reviewedCount = days.filter(d => d.reviewed).length;
        return Number((reviewedCount / days.length).toFixed(2));
    }

    async getGoalConsistency(): Promise<number> {
        const store = await this.getOrLoadStore();
        // Simple definition: Days Goal Met / Days Since Install (capped at 30? or all time local?)
        // Let's use Days Opened for now as denominator to be stickiness-relative?
        // Or strictly days active. Let's use days active.
        const days = Object.values(store.days);
        if (days.length === 0) return 0;

        const goalMetCount = days.filter(d => d.goalMet).length;
        return Number((goalMetCount / days.length).toFixed(2));
    }

    async getLearningMaintenanceRatio(): Promise<number> {
        // XP Review / XP Total
        const store = await this.getOrLoadStore();
        let totalXpReview = 0;
        let totalXpLearn = 0;

        Object.values(store.dailyHelpers).forEach(day => {
            totalXpReview += day.totals.xpReview;
            totalXpLearn += day.totals.xpQuiz;
        });

        const total = totalXpReview + totalXpLearn;
        if (total === 0) return 0;

        return Number((totalXpReview / total).toFixed(2));
    }

    async setUserContext(user: { id: string; email?: string } | null): Promise<void> {
        for (const adapter of this.productAnalyticsAdapters) {
            try {
                if (user) {
                    await adapter.identify?.(user.id, user.email ? { email: user.email } : undefined);
                } else {
                    await adapter.reset?.();
                }
            } catch (error) {
                console.warn('[Telemetry] Product analytics identity failed:', error);
            }
        }

        for (const adapter of this.crashReportingAdapters) {
            try {
                await adapter.setUserId?.(user?.id ?? null);
            } catch (error) {
                console.warn('[Telemetry] Crash reporting user context failed:', error);
            }
        }
    }

    // --- Private ---

    async captureError(error: unknown, context?: Record<string, unknown>): Promise<void> {
        await this.track('error_boundary', {
            message: error instanceof Error ? error.message : 'unknown_error',
            context,
        });

        for (const adapter of this.crashReportingAdapters) {
            try {
                await adapter.capture(error, context);
            } catch (adapterError) {
                console.warn('[Telemetry] Crash reporting adapter failed:', adapterError);
            }
        }
    }

    private async persist(): Promise<void> {
        if (this.isPersisting) return;
        this.isPersisting = true;

        try {
            const store = await this.getOrLoadStore();

            const newEvents = [...this.queue];
            store.events = [...store.events, ...newEvents];
            this.queue = [];

            for (const ev of newEvents) {
                const dateKey = new Date(ev.ts).toISOString().split('T')[0];
                if (!store.dailyHelpers[dateKey]) {
                    store.dailyHelpers[dateKey] = this.createEmptyDaily(dateKey);
                }
                const day = store.dailyHelpers[dateKey];

                day.eventCounts[ev.name] = (day.eventCounts[ev.name] || 0) + 1;

                if (ev.name === 'xp_awarded') {
                    const amount = typeof ev.props?.amount === 'number' ? ev.props.amount : 0;
                    if (ev.props?.source === 'quiz') day.totals.xpQuiz += amount;
                    if (ev.props?.source === 'review') day.totals.xpReview += amount;
                }
                if (ev.name === 'review_item') {
                    day.totals.reviewItemsAnswered += 1;
                }
                if (ev.name === 'error_boundary') {
                    day.totals.errors += 1;
                }
                if (ev.name === 'review_complete' && typeof ev.props?.durationMs === 'number') {
                    day.totals.reviewDurationMs += ev.props.durationMs;
                }
                if (ev.name === 'learn_complete' && typeof ev.props?.durationMs === 'number') {
                    day.totals.quizDurationMs += ev.props.durationMs;
                }
            }

            if (store.events.length > TELEMETRY_CONSTANTS.LIMITS.MAX_EVENTS) {
                const removeCount = store.events.length - TELEMETRY_CONSTANTS.LIMITS.MAX_EVENTS;
                store.events.splice(0, removeCount);
            }

            await this.saveStore(store);

        } catch (err) {
            console.error('[Telemetry] Persist failed', err);
        } finally {
            this.isPersisting = false;
            // Drain queue recursively if needed
            if (this.queue.length > 0) void this.persist();
        }
    }

    private async getOrLoadStore(): Promise<TelemetryStore> {
        if (this.memCache) return this.memCache;

        try {
            const eventsJson = await AsyncStorage.getItem(TELEMETRY_CONSTANTS.STORAGE_KEYS.EVENTS);
            const dailyJson = await AsyncStorage.getItem(TELEMETRY_CONSTANTS.STORAGE_KEYS.DAILY_STATS);
            const cohortsJson = await AsyncStorage.getItem(TELEMETRY_CONSTANTS.STORAGE_KEYS.COHORTS);
            const daysJson = await AsyncStorage.getItem(TELEMETRY_CONSTANTS.STORAGE_KEYS.DAYS);

            this.memCache = {
                events: eventsJson ? JSON.parse(eventsJson) : [],
                dailyHelpers: dailyJson ? JSON.parse(dailyJson) : {},
                cohort: cohortsJson ? JSON.parse(cohortsJson) : { installDate: '', retention: { d1: false, d3: false, d7: false } }, // Defaults
                days: daysJson ? JSON.parse(daysJson) : {},
            };
        } catch {
            this.memCache = {
                events: [],
                dailyHelpers: {},
                cohort: { installDate: '', retention: { d1: false, d3: false, d7: false } },
                days: {},
            };
        }
        return this.memCache!;
    }

    private async saveStore(store: TelemetryStore): Promise<void> {
        this.memCache = store; // Update memory
        await AsyncStorage.multiSet([
            [TELEMETRY_CONSTANTS.STORAGE_KEYS.EVENTS, JSON.stringify(store.events)],
            [TELEMETRY_CONSTANTS.STORAGE_KEYS.DAILY_STATS, JSON.stringify(store.dailyHelpers)],
            [TELEMETRY_CONSTANTS.STORAGE_KEYS.COHORTS, JSON.stringify(store.cohort)],
            [TELEMETRY_CONSTANTS.STORAGE_KEYS.DAYS, JSON.stringify(store.days)],
        ]);
    }

    private createEmptyDaily(date: string): DailyMetric {
        return {
            date,
            eventCounts: {},
            totals: {
                xpQuiz: 0,
                xpReview: 0,
                reviewItemsAnswered: 0,
                reviewDurationMs: 0,
                quizDurationMs: 0,
                errors: 0,
            },
        };
    }

    private getTodayKey(): string {
        return new Date().toISOString().split('T')[0];
    }

    private daysBetween(date1: string, date2: string): number {
        const d1 = new Date(date1).getTime();
        const d2 = new Date(date2).getTime();
        const diff = d2 - d1;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }
}

export const TelemetryService = new TelemetryServiceImpl();
