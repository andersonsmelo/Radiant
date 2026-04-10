import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';
import { AppConfig } from '../config';
import { SyncQueueService } from '../features/sync/SyncQueueService';
import { TelemetryPropKeys } from '../features/telemetry/telemetry.constants';
import { TelemetryService } from '../features/telemetry/TelemetryService';

const STORAGE_KEY = '@radiant:rating_prompt_v1';
const PROMPT_COOLDOWN_DAYS = 30;
const MIN_APP_OPENS = 3;

type RatingPromptTrigger = 'quiz_complete' | 'review_complete' | 'reward_complete';

type RatingPromptContext = {
    trigger: RatingPromptTrigger;
    entrySurface: string;
    lessonId?: string;
    scorePercentage?: number;
    itemsCount?: number;
};

type RatingPromptState = {
    lastShownAt: number | null;
};

type EligibilityDecision =
    | { status: 'eligible'; reason: 'ready' }
    | { status: 'blocked'; reason: string }
    | { status: 'deferred'; reason: string };

class RatingPromptServiceImpl {
    private state: RatingPromptState | null = null;
    private attemptedThisSession = new Set<string>();

    async maybePromptForReview(context: RatingPromptContext): Promise<boolean> {
        const attemptKey = `${context.trigger}:${context.entrySurface}:${context.lessonId ?? 'na'}`;
        if (this.attemptedThisSession.has(attemptKey)) {
            return false;
        }
        this.attemptedThisSession.add(attemptKey);

        const props = this.buildProps(context);
        const decision = await this.evaluateEligibility();

        if (decision.status === 'blocked') {
            await TelemetryService.track('session_quality', {
                ...props,
                status: 'degraded',
                reason: decision.reason,
            });
            await TelemetryService.track('rating_prompt_blocked', {
                ...props,
                reason: decision.reason,
            });
            return false;
        }

        if (decision.status === 'deferred') {
            await TelemetryService.track('rating_prompt_deferred', {
                ...props,
                reason: decision.reason,
            });
            return false;
        }

        await TelemetryService.track('session_quality', {
            ...props,
            status: 'healthy',
        });
        await TelemetryService.track('rating_prompt_eligible', props);

        try {
            await StoreReview.requestReview();
            await TelemetryService.track('rating_prompt_shown', props);
            await this.saveState({ lastShownAt: Date.now() });
            return true;
        } catch (error) {
            await TelemetryService.track('rating_prompt_deferred', {
                ...props,
                reason: error instanceof Error ? error.message : 'request_review_failed',
            });
            return false;
        }
    }

    async reset(): Promise<void> {
        this.state = null;
        this.attemptedThisSession.clear();
        await AsyncStorage.removeItem(STORAGE_KEY);
    }

    private async evaluateEligibility(): Promise<EligibilityDecision> {
        if (!AppConfig.ENABLE_REVIEW) {
            return { status: 'blocked', reason: 'review_disabled' };
        }

        if (AppConfig.APP_ENV !== 'production') {
            return { status: 'blocked', reason: 'non_production_build' };
        }

        if (!StoreReview.hasAction()) {
            return { status: 'deferred', reason: 'store_review_action_unavailable' };
        }

        const isAvailable = await StoreReview.isAvailableAsync();
        if (!isAvailable) {
            return { status: 'deferred', reason: 'store_review_unavailable' };
        }

        const hasValueMoment = await TelemetryService.hasEvent('first_value_moment_reached');
        if (!hasValueMoment) {
            return { status: 'blocked', reason: 'value_not_reached' };
        }

        const appOpenCount = await TelemetryService.countEvents('app_open');
        if (appOpenCount < MIN_APP_OPENS) {
            return { status: 'blocked', reason: 'insufficient_sessions' };
        }

        const syncSummary = await SyncQueueService.getSummary();
        if (syncSummary.lastError) {
            return { status: 'blocked', reason: 'sync_error_present' };
        }

        const state = await this.getState();
        if (state.lastShownAt && Date.now() - state.lastShownAt < PROMPT_COOLDOWN_DAYS * 24 * 60 * 60 * 1000) {
            return { status: 'blocked', reason: 'cooldown_active' };
        }

        return { status: 'eligible', reason: 'ready' };
    }

    private buildProps(context: RatingPromptContext): Record<string, unknown> {
        const locale = this.resolveLocale();
        const market = this.resolveMarket(locale);

        return {
            trigger: context.trigger,
            lesson_id: context.lessonId,
            score_percentage: context.scorePercentage,
            items_count: context.itemsCount,
            [TelemetryPropKeys.LOCALE]: locale,
            [TelemetryPropKeys.MARKET]: market,
            [TelemetryPropKeys.ENTRY_SURFACE]: context.entrySurface,
            [TelemetryPropKeys.BUILD_CHANNEL]: AppConfig.APP_ENV,
        };
    }

    private async getState(): Promise<RatingPromptState> {
        if (this.state) {
            return this.state;
        }

        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const state: RatingPromptState = raw ? JSON.parse(raw) : { lastShownAt: null };
        this.state = state;
        return state;
    }

    private async saveState(state: RatingPromptState): Promise<void> {
        this.state = state;
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    private resolveLocale(): string {
        try {
            return Intl.DateTimeFormat().resolvedOptions().locale || 'unknown';
        } catch {
            return 'unknown';
        }
    }

    private resolveMarket(locale: string): string {
        const [, region] = locale.split('-');
        return region?.toUpperCase() ?? 'unknown';
    }
}

export const RatingPromptService = new RatingPromptServiceImpl();
