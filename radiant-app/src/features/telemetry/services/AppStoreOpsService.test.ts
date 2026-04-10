import { AuthService } from '../../auth/AuthService';
import { UpgradeInterestService } from '../../paywall/UpgradeInterestService';
import { TelemetryService } from '../TelemetryService';
import { AppStoreOpsService } from './AppStoreOpsService';

jest.mock('../../auth/AuthService', () => ({
    AuthService: {
        bootstrap: jest.fn().mockResolvedValue(null),
        getSession: jest.fn().mockReturnValue({
            user: {
                id: 'user-1',
                email: 'user@example.com',
            },
        }),
    },
}));

jest.mock('../../paywall/UpgradeInterestService', () => ({
    UpgradeInterestService: {
        listInterests: jest.fn().mockResolvedValue([
            {
                id: 'interest-1',
                email: 'user@example.com',
            },
        ]),
    },
}));

jest.mock('../TelemetryService', () => ({
    TelemetryService: {
        getInstallDate: jest.fn().mockResolvedValue('2026-03-01'),
        hasEvent: jest.fn().mockResolvedValue(true),
        getEvents: jest.fn().mockResolvedValue([
            { name: 'paywall_view', ts: 1, props: { trigger: 'quiz_complete', entry_surface: 'quiz_summary' } },
            { name: 'paywall_cta_tap', ts: 2, props: { trigger: 'quiz_complete', entry_surface: 'quiz_summary' } },
            { name: 'paywall_outcome', ts: 3, props: { outcome: 'dismissed', trigger: 'reward_complete' } },
            { name: 'rating_prompt_shown', ts: 4, props: { trigger: 'reward_complete' } },
            { name: 'rating_prompt_blocked', ts: 5, props: { trigger: 'quiz_complete' } },
        ]),
    },
}));

const mockedAuthService = AuthService as jest.Mocked<typeof AuthService>;
const mockedUpgradeInterestService = UpgradeInterestService as jest.Mocked<typeof UpgradeInterestService>;
const mockedTelemetryService = TelemetryService as jest.Mocked<typeof TelemetryService>;

describe('AppStoreOpsService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('builds an operational summary from telemetry and upgrade interest data', async () => {
        const summary = await AppStoreOpsService.getSummary();

        expect(summary).toEqual(
            expect.objectContaining({
                installDate: '2026-03-01',
                currentUserEmail: 'user@example.com',
                firstValueMomentReached: true,
                reviewPromptShownCount: 1,
                reviewPromptBlockedCount: 1,
                paywallViewCount: 1,
                paywallCtaTapCount: 1,
                paywallDismissedCount: 1,
                upgradeInterestCount: 1,
                latestUpgradeInterestEmail: 'user@example.com',
                paywallTapRate: 1,
                suggestedDecision: 'escalar',
            })
        );
        expect(summary.recentEvents).toHaveLength(5);
        expect(mockedAuthService.bootstrap).toHaveBeenCalled();
        expect(mockedTelemetryService.getEvents).toHaveBeenCalled();
        expect(mockedUpgradeInterestService.listInterests).toHaveBeenCalled();
    });

    it('exports a shareable war room report', async () => {
        const report = await AppStoreOpsService.exportWarRoomReport();

        expect(report).toContain('# Radiant App Store War Room Snapshot');
        expect(report).toContain('Decision suggested: escalar');
        expect(report).toContain('review_prompt_shown: 1');
        expect(report).toContain('upgrade_interest_count: 1');
    });
});
