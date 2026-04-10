import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppConfig } from '../../config';
import { SyncQueueService } from '../sync/SyncQueueService';
import { TelemetryPropKeys } from '../telemetry/telemetry.constants';
import { TelemetryService } from '../telemetry/TelemetryService';
import { PaywallPlan } from './PaywallPlan';

const STORAGE_KEY = '@radiant:paywall_v1';
const PAYWALL_COOLDOWN_DAYS = 14;

type PaywallTrigger = 'reward_complete' | 'quiz_complete' | 'checkpoint_complete';

export type PaywallOffer = {
    offerId: string;
    title: string;
    description: string;
    trigger: PaywallTrigger;
    entrySurface: string;
};

type PaywallContext = {
    trigger: PaywallTrigger;
    entrySurface: string;
    lessonId?: string;
};

type PaywallState = {
    lastShownAt: number | null;
    lastOutcome: 'dismissed' | 'cta_tap' | null;
};

type EligibilityDecision =
    | { status: 'eligible' }
    | { status: 'blocked'; reason: string }
    | { status: 'deferred'; reason: string };

class PaywallServiceImpl {
    private state: PaywallState | null = null;

    async maybePresentOffer(context: PaywallContext): Promise<PaywallOffer | null> {
        const props = await this.buildProps(context);
        const decision = await this.evaluateEligibility();

        if (decision.status !== 'eligible') {
            await TelemetryService.track('paywall_outcome', {
                ...props,
                outcome: decision.status,
                reason: decision.reason,
            });
            return null;
        }

        const offer = this.resolveOffer(context);
        await this.saveState({
            lastShownAt: Date.now(),
            lastOutcome: null,
        });
        await TelemetryService.track('paywall_view', {
            ...props,
            offer_id: offer.offerId,
        });
        return offer;
    }

    async recordOutcome(
        offer: PaywallOffer,
        outcome: 'dismissed' | 'cta_tap',
        context: { lessonId?: string } = {}
    ): Promise<void> {
        const props = await this.buildProps({
            trigger: offer.trigger,
            entrySurface: offer.entrySurface,
            lessonId: context.lessonId,
        });

        if (outcome === 'cta_tap') {
            await TelemetryService.track('paywall_cta_tap', {
                ...props,
                offer_id: offer.offerId,
            });
        }

        await TelemetryService.track('paywall_outcome', {
            ...props,
            offer_id: offer.offerId,
            outcome,
        });

        await this.saveState({
            lastShownAt: (await this.getState()).lastShownAt,
            lastOutcome: outcome,
        });
    }

    async reset(): Promise<void> {
        this.state = null;
        await AsyncStorage.removeItem(STORAGE_KEY);
    }

    private async evaluateEligibility(): Promise<EligibilityDecision> {
        if (!AppConfig.ENABLE_PAYWALL) {
            return { status: 'blocked', reason: 'paywall_disabled' };
        }

        const hasValueMoment = await TelemetryService.hasEvent('first_value_moment_reached');
        if (!hasValueMoment) {
            return { status: 'blocked', reason: 'value_not_reached' };
        }

        const appOpenCount = await TelemetryService.countEvents('app_open');
        if (appOpenCount < PaywallPlan.gate.minimumSessionsBeforeOffer) {
            return { status: 'blocked', reason: 'insufficient_sessions' };
        }

        const installDate = await TelemetryService.getInstallDate();
        if (!installDate) {
            return { status: 'deferred', reason: 'missing_install_date' };
        }

        const installedDaysAgo = this.daysSince(installDate);
        if (installedDaysAgo < PaywallPlan.gate.minimumDaysBeforeOffer) {
            return { status: 'blocked', reason: 'too_early_after_install' };
        }

        const syncSummary = await SyncQueueService.getSummary();
        if (syncSummary.lastError) {
            return { status: 'blocked', reason: 'sync_error_present' };
        }

        const state = await this.getState();
        if (state.lastShownAt && Date.now() - state.lastShownAt < PAYWALL_COOLDOWN_DAYS * 24 * 60 * 60 * 1000) {
            return { status: 'blocked', reason: 'cooldown_active' };
        }

        return { status: 'eligible' };
    }

    private resolveOffer(context: PaywallContext): PaywallOffer {
        return {
            offerId: PaywallPlan.offers.monthly.id,
            title: PaywallPlan.offers.monthly.title,
            description: PaywallPlan.offers.monthly.description,
            trigger: context.trigger,
            entrySurface: context.entrySurface,
        };
    }

    private async buildProps(context: PaywallContext): Promise<Record<string, unknown>> {
        const locale = this.resolveLocale();
        const market = this.resolveMarket(locale);

        return {
            trigger: context.trigger,
            lesson_id: context.lessonId,
            [TelemetryPropKeys.LOCALE]: locale,
            [TelemetryPropKeys.MARKET]: market,
            [TelemetryPropKeys.ENTRY_SURFACE]: context.entrySurface,
            [TelemetryPropKeys.BUILD_CHANNEL]: AppConfig.APP_ENV,
        };
    }

    private async getState(): Promise<PaywallState> {
        if (this.state) {
            return this.state;
        }

        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const state: PaywallState = raw ? JSON.parse(raw) : { lastShownAt: null, lastOutcome: null };
        this.state = state;
        return state;
    }

    private async saveState(state: PaywallState): Promise<void> {
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

    private daysSince(dateString: string): number {
        const start = new Date(dateString);
        const end = new Date();
        const diff = end.getTime() - start.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }
}

export const PaywallService = new PaywallServiceImpl();
