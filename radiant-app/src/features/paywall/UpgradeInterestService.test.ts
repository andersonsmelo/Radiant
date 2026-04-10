import AsyncStorage from '@react-native-async-storage/async-storage';
import { UpgradeInterestService } from './UpgradeInterestService';
import { AuthService } from '../auth/AuthService';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
}));

jest.mock('../auth/AuthService', () => ({
    AuthService: {
        bootstrap: jest.fn().mockResolvedValue(null),
        getSession: jest.fn().mockReturnValue(null),
    },
}));

const mockedStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const mockedAuthService = AuthService as jest.Mocked<typeof AuthService>;

describe('UpgradeInterestService', () => {
    beforeEach(async () => {
        jest.clearAllMocks();
        mockedStorage.getItem.mockResolvedValue(null);
        mockedStorage.setItem.mockResolvedValue();
        mockedStorage.removeItem.mockResolvedValue();
        mockedAuthService.getSession.mockReturnValue({
            accessToken: 'token',
            user: {
                id: 'user-1',
                email: 'user@example.com',
            },
        });
        await UpgradeInterestService.reset();
    });

    it('captures an interest entry with authenticated user context', async () => {
        const entry = await UpgradeInterestService.captureInterest(
            {
                offerId: 'monthly_plus',
                title: 'Radiant Plus mensal',
                description: 'Acesso expandido',
                trigger: 'reward_complete',
                entrySurface: 'reward',
            },
            {
                lessonId: 'reward-1',
            }
        );

        expect(entry).toEqual(
            expect.objectContaining({
                offerId: 'monthly_plus',
                userId: 'user-1',
                email: 'user@example.com',
                lessonId: 'reward-1',
                status: 'captured',
            })
        );
        expect(mockedStorage.setItem).toHaveBeenCalled();
    });

    it('deduplicates repeated interest capture for the same offer and user within the active window', async () => {
        const existingEntry = {
            id: 'existing',
            ts: Date.now(),
            offerId: 'monthly_plus',
            offerTitle: 'Radiant Plus mensal',
            trigger: 'reward_complete',
            entrySurface: 'reward',
            lessonId: 'reward-1',
            userId: 'user-1',
            email: 'user@example.com',
            locale: 'pt-BR',
            market: 'BR',
            buildChannel: 'preview',
            status: 'captured' as const,
        };
        mockedStorage.getItem.mockResolvedValue(JSON.stringify([existingEntry]));

        const entry = await UpgradeInterestService.captureInterest({
            offerId: 'monthly_plus',
            title: 'Radiant Plus mensal',
            description: 'Acesso expandido',
            trigger: 'reward_complete',
            entrySurface: 'reward',
        });

        expect(entry).toEqual(existingEntry);
        expect(mockedStorage.setItem).not.toHaveBeenCalled();
    });
});
