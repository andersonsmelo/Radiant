import { AuthService } from '../../auth/AuthService';
import { AppConfig } from '../../../config';
import { UpgradeInterestService } from '../../paywall/UpgradeInterestService';
import { TelemetryService } from '../TelemetryService';
import type { TelemetryEventName } from '../telemetry.types';

const APP_STORE_EVENT_NAMES: TelemetryEventName[] = [
    'first_value_moment_reached',
    'rating_prompt_eligible',
    'rating_prompt_shown',
    'rating_prompt_deferred',
    'rating_prompt_blocked',
    'paywall_view',
    'paywall_cta_tap',
    'paywall_outcome',
];

export interface AppStoreOpsSummary {
    installDate: string | null;
    currentUserEmail: string | null;
    firstValueMomentReached: boolean;
    reviewPromptShownCount: number;
    reviewPromptBlockedCount: number;
    paywallViewCount: number;
    paywallCtaTapCount: number;
    paywallDismissedCount: number;
    paywallBlockedCount: number;
    upgradeInterestCount: number;
    latestUpgradeInterestEmail: string | null;
    paywallTapRate: number;
    suggestedDecision: 'escalar' | 'iterar' | 'conter' | 'reverter';
    recentEvents: {
        name: TelemetryEventName;
        ts: number;
        outcome?: string;
        trigger?: string;
        entrySurface?: string;
    }[];
}

class AppStoreOpsServiceImpl {
    async getSummary(): Promise<AppStoreOpsSummary> {
        await AuthService.bootstrap();

        const [installDate, session, firstValueMomentReached, events, interests] = await Promise.all([
            TelemetryService.getInstallDate(),
            Promise.resolve(AuthService.getSession()),
            TelemetryService.hasEvent('first_value_moment_reached'),
            TelemetryService.getEvents({ names: APP_STORE_EVENT_NAMES, limit: 20 }),
            UpgradeInterestService.listInterests(),
        ]);

        const reviewPromptShownCount = this.count(events, 'rating_prompt_shown');
        const reviewPromptBlockedCount = this.count(events, 'rating_prompt_blocked');
        const paywallViewCount = this.count(events, 'paywall_view');
        const paywallCtaTapCount = this.count(events, 'paywall_cta_tap');
        const paywallDismissedCount = this.countOutcome(events, 'dismissed');
        const paywallBlockedCount = this.countOutcome(events, 'blocked');

        return {
            installDate,
            currentUserEmail: session?.user.email ?? null,
            firstValueMomentReached,
            reviewPromptShownCount,
            reviewPromptBlockedCount,
            paywallViewCount,
            paywallCtaTapCount,
            paywallDismissedCount,
            paywallBlockedCount,
            upgradeInterestCount: interests.length,
            latestUpgradeInterestEmail: interests[0]?.email ?? null,
            paywallTapRate: paywallViewCount > 0 ? Number((paywallCtaTapCount / paywallViewCount).toFixed(2)) : 0,
            suggestedDecision: this.resolveSuggestedDecision({
                firstValueMomentReached,
                reviewPromptShownCount,
                reviewPromptBlockedCount,
                paywallViewCount,
                paywallBlockedCount,
                paywallTapRate: paywallViewCount > 0
                    ? Number((paywallCtaTapCount / paywallViewCount).toFixed(2))
                    : 0,
            }),
            recentEvents: events.slice(-5).reverse().map((event) => ({
                name: event.name,
                ts: event.ts,
                outcome: typeof event.props?.outcome === 'string' ? event.props.outcome : undefined,
                trigger: typeof event.props?.trigger === 'string' ? event.props.trigger : undefined,
                entrySurface:
                    typeof event.props?.entry_surface === 'string' ? event.props.entry_surface : undefined,
            })),
        };
    }

    async exportWarRoomReport(): Promise<string> {
        const summary = await this.getSummary();
        const generatedAt = new Date().toLocaleString();
        const recentEvents = summary.recentEvents.length > 0
            ? summary.recentEvents
                .map((event) => {
                    const outcome = event.outcome ? ` • ${event.outcome}` : '';
                    const trigger = event.trigger ? ` • ${event.trigger}` : '';
                    const surface = event.entrySurface ? ` • ${event.entrySurface}` : '';
                    return `- ${new Date(event.ts).toLocaleString()} • ${event.name}${trigger}${surface}${outcome}`;
                })
                .join('\n')
            : '- sem eventos recentes de App Store';

        return [
            '# Radiant App Store War Room Snapshot',
            '',
            `- Generated at: ${generatedAt}`,
            `- Build: ${AppConfig.VERSION} (${AppConfig.APP_ENV})`,
            `- Decision suggested: ${summary.suggestedDecision}`,
            `- Install date: ${summary.installDate ?? 'n/a'}`,
            `- Current user: ${summary.currentUserEmail ?? 'anonimo'}`,
            '',
            '## Habit',
            `- first_value_moment_reached: ${summary.firstValueMomentReached ? 'yes' : 'no'}`,
            `- review_prompt_shown: ${summary.reviewPromptShownCount}`,
            `- review_prompt_blocked: ${summary.reviewPromptBlockedCount}`,
            '',
            '## Monetization',
            `- paywall_view: ${summary.paywallViewCount}`,
            `- paywall_cta_tap: ${summary.paywallCtaTapCount}`,
            `- paywall_dismissed: ${summary.paywallDismissedCount}`,
            `- paywall_blocked: ${summary.paywallBlockedCount}`,
            `- paywall_tap_rate: ${summary.paywallTapRate}`,
            `- upgrade_interest_count: ${summary.upgradeInterestCount}`,
            `- latest_upgrade_interest_email: ${summary.latestUpgradeInterestEmail ?? 'n/a'}`,
            '',
            '## Recent events',
            recentEvents,
        ].join('\n');
    }

    private count(events: { name: TelemetryEventName }[], target: TelemetryEventName): number {
        return events.filter((event) => event.name === target).length;
    }

    private countOutcome(
        events: { name: TelemetryEventName; props?: Record<string, unknown> }[],
        outcome: string
    ): number {
        return events.filter(
            (event) => event.name === 'paywall_outcome' && event.props?.outcome === outcome
        ).length;
    }

    private resolveSuggestedDecision(input: {
        firstValueMomentReached: boolean;
        reviewPromptShownCount: number;
        reviewPromptBlockedCount: number;
        paywallViewCount: number;
        paywallBlockedCount: number;
        paywallTapRate: number;
    }): 'escalar' | 'iterar' | 'conter' | 'reverter' {
        if (!input.firstValueMomentReached && input.paywallViewCount > 0) {
            return 'reverter';
        }

        if (!input.firstValueMomentReached) {
            return 'conter';
        }

        if (input.paywallBlockedCount > input.paywallViewCount && input.reviewPromptBlockedCount > input.reviewPromptShownCount) {
            return 'conter';
        }

        if (input.paywallViewCount > 0 && input.paywallTapRate >= 0.3 && input.reviewPromptShownCount > 0) {
            return 'escalar';
        }

        return 'iterar';
    }
}

export const AppStoreOpsService = new AppStoreOpsServiceImpl();
