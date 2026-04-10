/**
 * src/features/onboarding/OnboardingService.ts
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingState, OnboardingStage } from './onboarding.types';
import { TelemetryService } from '../telemetry/TelemetryService';
import { TelemetryPropKeys } from '../telemetry/telemetry.constants';
import { AppConfig } from '../../config';

const STORE_KEY = '@radiant/onboarding';

const DEFAULT_STATE: OnboardingState = {
    startedAt: null,
    dismissedIntro: false,
    firstQuizAt: null,
    firstReviewAt: null,
    completed: false,
};

// Feature flag - can be toggled for dev/testing
const ENABLE_ONBOARDING = true;

class OnboardingServiceImpl {
    private state: OnboardingState = { ...DEFAULT_STATE };
    private initialized = false;

    /**
     * Initializes the service, loading state from storage.
     * Sets 'startedAt' if it's the first ever launch.
     */
    async init(): Promise<void> {
        if (!ENABLE_ONBOARDING) return;

        try {
            const stored = await AsyncStorage.getItem(STORE_KEY);
            if (stored) {
                this.state = JSON.parse(stored);
            } else {
                // First launch ever
                this.state = {
                    ...DEFAULT_STATE,
                    startedAt: Date.now(),
                };
                await this.save();
                TelemetryService.track('onboarding_start', this.getAppStoreProps('onboarding'));
            }
            this.initialized = true;
        } catch (e) {
            console.error('[OnboardingService] Failed to init', e);
        }
    }

    /**
     * Returns the current strict stage (Day 0-7+).
     */
    getStage(): OnboardingStage {
        if (!this.state.startedAt || this.state.completed) return 'graduated';

        const now = Date.now();
        const diffMs = now - this.state.startedAt;
        const days = diffMs / (1000 * 60 * 60 * 24);

        if (days < 1) return 'intro';
        if (days < 3) return 'quiz_guided';
        if (days < 5) return 'review_guided';
        if (days < 7) return 'habit_forming';
        if (days >= 7 && !this.state.completed) return 'closure';

        return 'graduated';
    }

    /**
     * Whether to show the Day 0 Intro Card.
     */
    shouldShowIntro(): boolean {
        // Must be in intro stage AND not dismissed
        return this.getStage() === 'intro' && !this.state.dismissedIntro;
    }

    /**
     * Whether to show the Day 7 Closure details.
     */
    shouldShowClosure(): boolean {
        return this.getStage() === 'closure' && !this.state.completed;
    }

    /**
     * Call when user dismisses the Day 0 card.
     */
    async dismissIntro(): Promise<void> {
        this.state.dismissedIntro = true;
        await this.save();
        TelemetryService.track('onboarding_dismissed_intro', this.getAppStoreProps('onboarding'));
    }

    /**
     * Call when user completes a key action (quiz or review).
     */
    async markAction(action: 'quiz_complete' | 'review_complete'): Promise<void> {
        let changed = false;
        const now = Date.now();
        const hadReachedValue = Boolean(this.state.firstQuizAt || this.state.firstReviewAt);
        const actionProps = {
            ...this.getAppStoreProps('onboarding'),
            action,
        };

        if (action === 'quiz_complete' && !this.state.firstQuizAt) {
            this.state.firstQuizAt = now;
            changed = true;
            TelemetryService.track('onboarding_first_quiz', actionProps);
        }

        if (action === 'review_complete' && !this.state.firstReviewAt) {
            this.state.firstReviewAt = now;
            changed = true;
            TelemetryService.track('onboarding_first_review', actionProps);
        }

        if (changed) {
            if (!hadReachedValue) {
                TelemetryService.track('first_value_moment_reached', actionProps);
            }
            await this.save();
        }
    }

    /**
     * Call to permanently complete onboarding (e.g. dismissing Day 7 banner).
     */
    async complete(): Promise<void> {
        this.state.completed = true;
        await this.save();
        TelemetryService.track('onboarding_complete', this.getAppStoreProps('onboarding'));
    }

    /**
     * Returns helpers for Quiz Summary based on current stage
     */
    getSummaryHelper(): { message: string, type: 'habit' | 'consistency' } | null {
        const stage = this.getStage();

        if (stage === 'quiz_guided' && this.state.firstQuizAt) {
            return { message: "Esse XP constrói sua consistência.", type: 'consistency' };
        }

        if (stage === 'habit_forming') {
            return { message: "Você está criando uma rotina sólida.", type: 'habit' };
        }

        return null;
    }

    private async save() {
        try {
            await AsyncStorage.setItem(STORE_KEY, JSON.stringify(this.state));
        } catch (e) {
            console.error('[OnboardingService] Failed to save', e);
        }
    }

    private getAppStoreProps(entrySurface: string): Record<string, string> {
        const locale = this.resolveLocale();
        const market = this.resolveMarket(locale);

        return {
            [TelemetryPropKeys.LOCALE]: locale,
            [TelemetryPropKeys.MARKET]: market,
            [TelemetryPropKeys.ENTRY_SURFACE]: entrySurface,
            [TelemetryPropKeys.BUILD_CHANNEL]: AppConfig.APP_ENV,
        };
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

    /** Debug only */
    async reset() {
        await AsyncStorage.removeItem(STORE_KEY);
        this.state = { ...DEFAULT_STATE };
        this.initialized = false;
        await this.init();
    }
}

export const OnboardingService = new OnboardingServiceImpl();
