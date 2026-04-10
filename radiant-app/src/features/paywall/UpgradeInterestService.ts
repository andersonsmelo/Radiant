import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { AppConfig } from '../../config';
import { AuthService } from '../auth/AuthService';
import type { PaywallOffer } from './PaywallService';

const MAX_INTEREST_ENTRIES = 50;
const DUPLICATE_WINDOW_DAYS = 30;

type CaptureInterestContext = {
    lessonId?: string;
};

export interface UpgradeInterestEntry {
    id: string;
    ts: number;
    offerId: string;
    offerTitle: string;
    trigger: string;
    entrySurface: string;
    lessonId?: string;
    userId?: string;
    email?: string;
    locale: string;
    market: string;
    buildChannel: string;
    status: 'captured';
}

class UpgradeInterestServiceImpl {
    async captureInterest(
        offer: PaywallOffer,
        context: CaptureInterestContext = {}
    ): Promise<UpgradeInterestEntry> {
        await AuthService.bootstrap();

        const session = AuthService.getSession();
        const entries = await this.listInterests();
        const signature = this.getSignature({
            offerId: offer.offerId,
            userId: session?.user.id,
            email: session?.user.email,
        });

        const duplicate = entries.find((entry) => {
            return (
                this.getSignature({
                    offerId: entry.offerId,
                    userId: entry.userId,
                    email: entry.email,
                }) === signature && this.isWithinDuplicateWindow(entry.ts)
            );
        });

        if (duplicate) {
            return duplicate;
        }

        const locale = this.resolveLocale();
        const entry: UpgradeInterestEntry = {
            id: Math.random().toString(36).slice(2, 11),
            ts: Date.now(),
            offerId: offer.offerId,
            offerTitle: offer.title,
            trigger: offer.trigger,
            entrySurface: offer.entrySurface,
            lessonId: context.lessonId,
            userId: session?.user.id,
            email: session?.user.email,
            locale,
            market: this.resolveMarket(locale),
            buildChannel: AppConfig.APP_ENV,
            status: 'captured',
        };

        const nextEntries = [entry, ...entries].slice(0, MAX_INTEREST_ENTRIES);
        await AsyncStorage.setItem(STORAGE_KEYS.UPGRADE_INTEREST, JSON.stringify(nextEntries));
        return entry;
    }

    async listInterests(): Promise<UpgradeInterestEntry[]> {
        const raw = await AsyncStorage.getItem(STORAGE_KEYS.UPGRADE_INTEREST);
        if (!raw) {
            return [];
        }

        try {
            const parsed = JSON.parse(raw) as UpgradeInterestEntry[];
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error('[UpgradeInterestService] Failed to parse stored interests:', error);
            return [];
        }
    }

    async reset(): Promise<void> {
        await AsyncStorage.removeItem(STORAGE_KEYS.UPGRADE_INTEREST);
    }

    private getSignature(input: { offerId: string; userId?: string; email?: string }): string {
        return [input.offerId, input.userId ?? 'anonymous', input.email ?? 'no-email'].join('::');
    }

    private isWithinDuplicateWindow(timestamp: number): boolean {
        return Date.now() - timestamp < DUPLICATE_WINDOW_DAYS * 24 * 60 * 60 * 1000;
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

export const UpgradeInterestService = new UpgradeInterestServiceImpl();
