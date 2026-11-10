import { AuthService } from '../../auth/AuthService';
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

jest.mock('../TelemetryService', () => ({
    TelemetryService: {
        getInstallDate: jest.fn().mockResolvedValue('2026-03-01'),
        hasEvent: jest.fn().mockResolvedValue(true),
        getEvents: jest.fn().mockResolvedValue([
            { name: 'first_value_moment_reached', ts: 1, props: {} },
            { name: 'rating_prompt_shown', ts: 4, props: { trigger: 'reward_complete' } },
            { name: 'rating_prompt_blocked', ts: 5, props: { trigger: 'quiz_complete' } },
        ]),
    },
}));

const mockedAuthService = AuthService as jest.Mocked<typeof AuthService>;
const mockedTelemetryService = TelemetryService as jest.Mocked<typeof TelemetryService>;

describe('AppStoreOpsService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('builds an operational summary from telemetry', async () => {
        const summary = await AppStoreOpsService.getSummary();

        expect(summary).toEqual({
            installDate: '2026-03-01',
            currentUserEmail: 'user@example.com',
            firstValueMomentReached: true,
            reviewPromptShownCount: 1,
            reviewPromptBlockedCount: 1,
            suggestedDecision: 'iterar',
            recentEvents: expect.any(Array),
        });
        expect(summary.recentEvents).toHaveLength(3);
        expect(mockedAuthService.bootstrap).toHaveBeenCalled();
        expect(mockedTelemetryService.getEvents).toHaveBeenCalled();
    });

    it('contains rollout while the first value moment has not been reached', async () => {
        mockedTelemetryService.hasEvent.mockResolvedValueOnce(false);

        expect((await AppStoreOpsService.getSummary()).suggestedDecision).toBe('conter');
    });

    // O paywall antigo saiu em 2026-11-10 (auditoria, achado 14): o relatório não
    // tem mais a seção de monetização, que só contava eventos que nada emitia.
    it('exports a shareable war room report without the removed paywall section', async () => {
        const report = await AppStoreOpsService.exportWarRoomReport();

        expect(report).toContain('# Radiant App Store War Room Snapshot');
        expect(report).toContain('Decision suggested: iterar');
        expect(report).toContain('review_prompt_shown: 1');
        expect(report).not.toMatch(/paywall|upgrade_interest|Monetization/);
    });
});
