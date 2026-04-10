import { AuthService } from '../../auth/AuthService';
import { BetaService } from '../../beta/BetaService';
import { DailyGoalService } from '../../daily-goal/services/DailyGoalService';
import { GamificationService } from '../../gamification/services/GamificationService';
import { HealthScoreService } from '../../health/HealthScoreService';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';
import { OnboardingService } from '../../onboarding/OnboardingService';
import { SpacedRepetitionService } from '../../spaced-repetition/services/SpacedRepetitionService';
import { SyncQueueService } from '../../sync/SyncQueueService';
import { TelemetryService } from '../../telemetry/TelemetryService';
import { HeuristicsService } from '../../telemetry/heuristics/HeuristicsService';

type ResetStep = {
    label: string;
    run: () => Promise<void>;
};

class IosHomologationServiceImpl {
    private readonly resetSteps: ResetStep[] = [
        {
            label: 'journey progress',
            run: async () => JourneyProgressService.reset(),
        },
        {
            label: 'spaced repetition',
            run: async () => SpacedRepetitionService.reset(),
        },
        {
            label: 'daily goal',
            run: async () => DailyGoalService.reset(),
        },
        {
            label: 'gamification',
            run: async () => GamificationService.reset(),
        },
        {
            label: 'sync queue',
            run: async () => SyncQueueService.reset(),
        },
        {
            label: 'auth session',
            run: async () => AuthService.resetLocalSession(),
        },
        {
            label: 'beta access',
            run: async () => BetaService.resetAccess(),
        },
        {
            label: 'telemetry',
            run: async () => TelemetryService.clear(),
        },
        {
            label: 'heuristics',
            run: async () => HeuristicsService.clear(),
        },
        {
            label: 'health score',
            run: async () => HealthScoreService.clear(),
        },
        {
            label: 'onboarding',
            run: async () => OnboardingService.reset(),
        },
    ];

    async resetLocalState(): Promise<void> {
        const failedSteps: string[] = [];

        for (const step of this.resetSteps) {
            try {
                await step.run();
            } catch (error) {
                console.error(`[IosHomologationService] Failed to reset ${step.label}:`, error);
                failedSteps.push(step.label);
            }
        }

        if (failedSteps.length > 0) {
            throw new Error(`Falha ao resetar: ${failedSteps.join(', ')}`);
        }
    }
}

export const IosHomologationService = new IosHomologationServiceImpl();
