import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { LessonCatalogService } from '../content/services/LessonCatalogService';
import { SyncQueueService } from '../sync/SyncQueueService';
import { SpacedRepetitionService } from '../spaced-repetition/services/SpacedRepetitionService';
import { TelemetryService } from '../telemetry/TelemetryService';
import type { AuthSession } from './types';
import type { QuizLessonId } from '../../types/quiz';
import type { SRRating } from '../../types/spacedRepetition';

type MigrationState = Record<string, string>;

class LocalAccountMigrationServiceImpl {
    async migrateLocalStateToAuthenticatedAccount(session: AuthSession): Promise<void> {
        if (!session.user.id) {
            return;
        }

        const migrationState = await this.loadState();
        if (migrationState[session.user.id]) {
            return;
        }

        const [cards, latestRatings] = await Promise.all([
            SpacedRepetitionService.getAllCards(),
            SpacedRepetitionService.getLatestRatingsByLesson(),
        ]);

        if (cards.length === 0) {
            await this.markMigrated(session.user.id, migrationState);
            return;
        }

        for (const card of cards) {
            await SyncQueueService.enqueueReviewCard(card);

            const lesson = LessonCatalogService.getLessonById(card.lessonId);
            const totalQuestions = lesson?.questions.length ?? 1;
            const rating = latestRatings[card.lessonId] ?? this.deriveFallbackRating(card.repetitions);
            const correctAnswers = this.deriveCorrectAnswers(totalQuestions, rating);

            await SyncQueueService.enqueueSyntheticLessonProgress({
                lessonId: card.lessonId,
                totalQuestions,
                correctAnswers,
                answeredAt: card.lastReviewedAt,
            });
        }

        await this.markMigrated(session.user.id, migrationState);
        void TelemetryService.track('auth_local_state_migrated', {
            migratedLocalState: true,
            migratedLessons: cards.length,
            userId: session.user.id,
        });
    }

    async resetForTests(): Promise<void> {
        await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_MIGRATION_STATE);
    }

    private deriveFallbackRating(repetitions: number): SRRating {
        if (repetitions >= 2) {
            return 4;
        }

        if (repetitions === 1) {
            return 3;
        }

        return 1;
    }

    private deriveCorrectAnswers(totalQuestions: number, rating: SRRating): number {
        const normalizedTotal = Math.max(totalQuestions, 1);
        const ratioByRating: Record<SRRating, number> = {
            0: 0,
            1: 0.25,
            2: 0.4,
            3: 0.6,
            4: 0.8,
            5: 1,
        };

        return Math.max(0, Math.min(normalizedTotal, Math.round(normalizedTotal * ratioByRating[rating])));
    }

    private async loadState(): Promise<MigrationState> {
        try {
            const raw = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_MIGRATION_STATE);
            if (!raw) {
                return {};
            }

            const parsed = JSON.parse(raw) as MigrationState;
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch (error) {
            console.error('[LocalAccountMigrationService] Failed to load migration state:', error);
            return {};
        }
    }

    private async markMigrated(userId: string, currentState: MigrationState): Promise<void> {
        const nextState: MigrationState = {
            ...currentState,
            [userId]: new Date().toISOString(),
        };

        try {
            await AsyncStorage.setItem(STORAGE_KEYS.AUTH_MIGRATION_STATE, JSON.stringify(nextState));
        } catch (error) {
            console.error('[LocalAccountMigrationService] Failed to persist migration state:', error);
        }
    }
}

export const LocalAccountMigrationService = new LocalAccountMigrationServiceImpl();
