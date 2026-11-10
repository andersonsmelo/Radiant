import { AuthService } from '../../auth/AuthService';
import { AppConfig } from '../../../config';
import { TelemetryService } from '../TelemetryService';
import type { TelemetryEventName } from '../telemetry.types';

const APP_STORE_EVENT_NAMES: TelemetryEventName[] = [
    'first_value_moment_reached',
    'rating_prompt_eligible',
    'rating_prompt_shown',
    'rating_prompt_deferred',
    'rating_prompt_blocked',
];

export interface AppStoreOpsSummary {
    installDate: string | null;
    currentUserEmail: string | null;
    firstValueMomentReached: boolean;
    reviewPromptShownCount: number;
    reviewPromptBlockedCount: number;
    suggestedDecision: 'iterar' | 'conter';
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

        const [installDate, session, firstValueMomentReached, events] = await Promise.all([
            TelemetryService.getInstallDate(),
            Promise.resolve(AuthService.getSession()),
            TelemetryService.hasEvent('first_value_moment_reached'),
            TelemetryService.getEvents({ names: APP_STORE_EVENT_NAMES, limit: 20 }),
        ]);

        const reviewPromptShownCount = this.count(events, 'rating_prompt_shown');
        const reviewPromptBlockedCount = this.count(events, 'rating_prompt_blocked');

        return {
            installDate,
            currentUserEmail: session?.user.email ?? null,
            firstValueMomentReached,
            reviewPromptShownCount,
            reviewPromptBlockedCount,
            // Sem o paywall (removido em 2026-11-10), "escalar" e "reverter" dependiam
            // só de eventos que nada emite: resta conter até o primeiro valor percebido.
            suggestedDecision: firstValueMomentReached ? 'iterar' : 'conter',
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
            '## Recent events',
            recentEvents,
        ].join('\n');
    }

    private count(events: { name: TelemetryEventName }[], target: TelemetryEventName): number {
        return events.filter((event) => event.name === target).length;
    }
}

export const AppStoreOpsService = new AppStoreOpsServiceImpl();
