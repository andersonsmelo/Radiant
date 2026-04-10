/**
 * src/features/beta/BetaService.ts
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppConfig } from '../../config';

const ACCESS_KEY = '@radiant/beta_access';
const FEEDBACK_KEY = '@radiant/beta_feedback';
const ACCESS_RETRY_DELAY_MS = 150;
const ACCESS_READ_ATTEMPTS = 2;

export interface BetaFeedback {
    id: string;
    ts: number;
    category: 'bug' | 'confusing' | 'suggestion' | 'praise';
    text: string;
}

class BetaServiceImpl {
    private hasAccess: boolean = false;

    private wait(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * Checks if the user has already unlocked the beta.
     */
    async checkAccess(): Promise<boolean> {
        if (!AppConfig.ENABLE_BETA_GATE) {
            this.hasAccess = true;
            return true;
        }

        for (let attempt = 1; attempt <= ACCESS_READ_ATTEMPTS; attempt += 1) {
            try {
                const granted = await AsyncStorage.getItem(ACCESS_KEY);
                this.hasAccess = granted === 'true';
                return this.hasAccess;
            } catch (error) {
                if (attempt === ACCESS_READ_ATTEMPTS) {
                    console.error('[BetaService] Failed to read beta access state', error);
                    this.hasAccess = false;
                    return false;
                }

                await this.wait(ACCESS_RETRY_DELAY_MS);
            }
        }

        this.hasAccess = false;
        return false;
    }

    /**
     * returns cached access state (synchronous check for UI)
     */
    isAccessGranted(): boolean {
        return !AppConfig.ENABLE_BETA_GATE || this.hasAccess;
    }

    /**
     * Attempts to unlock with a code.
     */
    async submitCode(code: string): Promise<boolean> {
        const normalized = code.trim().toUpperCase();
        const expected = AppConfig.BETA_INVITE_CODE.toUpperCase();

        if (normalized === expected) {
            this.hasAccess = true;
            await AsyncStorage.setItem(ACCESS_KEY, 'true');
            return true;
        }
        return false;
    }

    /**
     * Saves feedback locally and logs an event.
     */
    async submitFeedback(text: string, category: BetaFeedback['category']): Promise<void> {
        const entry: BetaFeedback = {
            id: Math.random().toString(36).substr(2, 9),
            ts: Date.now(),
            category,
            text,
        };

        try {
            const existing = await AsyncStorage.getItem(FEEDBACK_KEY);
            const list: BetaFeedback[] = existing ? JSON.parse(existing) : [];
            list.push(entry);
            await AsyncStorage.setItem(FEEDBACK_KEY, JSON.stringify(list));

            // Log event (beta specific)
            // Note: 'beta_feedback' is not in strict types yet, we might need to add it or generic track.
            // For now, let's just save locally as primary source.
            console.log('[BetaService] Feedback saved:', entry);
        } catch (e) {
            console.error('[BetaService] Failed to save feedback', e);
        }
    }

    /**
     * Debug: Reset access
     */
    async resetAccess() {
        await AsyncStorage.removeItem(ACCESS_KEY);
        this.hasAccess = false;
    }
}

export const BetaService = new BetaServiceImpl();
