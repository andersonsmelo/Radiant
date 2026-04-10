import AsyncStorage from '@react-native-async-storage/async-storage';
import type { QuizResult } from '../../types/quiz';
import type { SRCardState } from '../../types/spacedRepetition';
import { AppConfig } from '../../config';
import { AuthService } from '../auth/AuthService';
import { isApiConfigured } from '../../lib/api';
import { LessonProgressSyncRepository } from './repositories/LessonProgressSyncRepository';
import { ReviewCardsSyncRepository } from './repositories/ReviewCardsSyncRepository';
import { TelemetryService } from '../telemetry/TelemetryService';
import type {
    LessonProgressSyncPayload,
    ReviewCardSyncPayload,
    SyncQueueItem,
    SyncQueueSummary,
} from './types';

const SYNC_QUEUE_STORAGE_KEY = '@radiant:sync_queue_v1';
const MAX_RETRY_DELAY_MS = 5 * 60_000;
const BASE_RETRY_DELAY_MS = 15_000;

class SyncQueueServiceImpl {
    private memCache: SyncQueueItem[] | null = null;
    private flushPromise: Promise<void> | null = null;

    async enqueueLessonProgressFromQuizResult(result: QuizResult): Promise<void> {
        const payload: LessonProgressSyncPayload = {
            lessonId: result.lessonId,
            totalQuestions: result.totalQuestions,
            correctAnswers: result.correctAnswers,
            answeredAtIso: result.answeredAt.toISOString(),
        };

        await this.enqueue({
            entity: 'lesson_progress',
            action: 'upsert_quiz_result',
            payload,
        });
        void TelemetryService.track('sync_queue_enqueued', { entity: 'lesson_progress', action: 'upsert_quiz_result' });
    }

    async enqueueReviewCard(card: SRCardState): Promise<void> {
        const payload: ReviewCardSyncPayload = {
            lessonId: card.lessonId,
            easeFactor: card.easeFactor,
            intervalDays: card.interval,
            repetitions: card.repetitions,
            nextReviewAtIso: card.nextReviewAt.toISOString(),
            lastReviewedAtIso: card.lastReviewedAt.toISOString(),
            createdAtIso: card.createdAt.toISOString(),
        };

        await this.enqueue({
            entity: 'review_cards',
            action: 'upsert_review_card',
            payload,
        });
        void TelemetryService.track('sync_queue_enqueued', { entity: 'review_cards', action: 'upsert_review_card' });
    }

    async enqueueSyntheticLessonProgress(input: {
        lessonId: LessonProgressSyncPayload['lessonId'];
        totalQuestions: LessonProgressSyncPayload['totalQuestions'];
        correctAnswers: LessonProgressSyncPayload['correctAnswers'];
        answeredAt: Date;
    }): Promise<void> {
        const payload: LessonProgressSyncPayload = {
            lessonId: input.lessonId,
            totalQuestions: input.totalQuestions,
            correctAnswers: input.correctAnswers,
            answeredAtIso: input.answeredAt.toISOString(),
        };

        await this.enqueue({
            entity: 'lesson_progress',
            action: 'upsert_quiz_result',
            payload,
        });
        void TelemetryService.track('sync_queue_enqueued', {
            entity: 'lesson_progress',
            action: 'upsert_quiz_result',
            source: 'local_migration',
        });
    }

    async flush(): Promise<void> {
        if (this.flushPromise) {
            return this.flushPromise;
        }

        this.flushPromise = this.runFlush().finally(() => {
            this.flushPromise = null;
        });

        return this.flushPromise;
    }

    private async runFlush(): Promise<void> {
        if (!AppConfig.ENABLE_REMOTE_SYNC || !isApiConfigured() || !AuthService.hasAuthenticatedSession()) {
            void TelemetryService.track('sync_flush_skipped', {
                remoteSyncEnabled: AppConfig.ENABLE_REMOTE_SYNC,
                apiConfigured: isApiConfigured(),
                authenticated: AuthService.hasAuthenticatedSession(),
            });
            return;
        }

        const queue = await this.getQueue();
        if (queue.length === 0) {
            void TelemetryService.track('sync_flush_completed', { pending: 0 });
            return;
        }

        void TelemetryService.track('sync_flush_started', { pending: queue.length });
        const remaining: SyncQueueItem[] = [];

        for (const item of queue) {
            if (this.shouldDelayRetry(item)) {
                remaining.push(item);
                continue;
            }

            try {
                if (item.entity === 'lesson_progress' && item.action === 'upsert_quiz_result') {
                    await LessonProgressSyncRepository.syncQuizResult(item.payload as LessonProgressSyncPayload);
                } else if (item.entity === 'review_cards' && item.action === 'upsert_review_card') {
                    await ReviewCardsSyncRepository.syncCard(item.payload as ReviewCardSyncPayload);
                }
            } catch (error) {
                void TelemetryService.track('sync_item_failed', {
                    entity: item.entity,
                    action: item.action,
                    retries: item.retries,
                    message: error instanceof Error ? error.message : 'unknown_sync_error',
                });
                const retries = item.retries + 1;
                remaining.push({
                    ...item,
                    retries,
                    updatedAt: new Date().toISOString(),
                    status: 'retrying',
                    nextRetryAt: new Date(Date.now() + this.getRetryDelayMs(retries)).toISOString(),
                    lastError: error instanceof Error ? error.message : 'unknown_sync_error',
                });
            }
        }

        await this.saveQueue(remaining);
        void TelemetryService.track('sync_flush_completed', { pending: remaining.length });
    }

    async getPendingCount(): Promise<number> {
        const queue = await this.getQueue();
        return queue.length;
    }

    async getSummary(): Promise<SyncQueueSummary> {
        const queue = await this.getQueue();
        const oldestPending = queue.find((item) => item.status === 'pending');
        const lastErrorItem = [...queue].reverse().find((item) => Boolean(item.lastError));

        return {
            pending: queue.filter((item) => item.status === 'pending').length,
            retrying: queue.filter((item) => item.status === 'retrying').length,
            lastError: lastErrorItem?.lastError ?? null,
            oldestPendingAt: oldestPending?.createdAt ?? null,
        };
    }

    async getItems(): Promise<SyncQueueItem[]> {
        const queue = await this.getQueue();
        return [...queue];
    }

    async reset(): Promise<void> {
        this.memCache = [];
        this.flushPromise = null;
        try {
            await AsyncStorage.removeItem(SYNC_QUEUE_STORAGE_KEY);
        } catch (error) {
            console.error('[SyncQueueService] Failed to reset queue:', error);
            throw error;
        }
    }

    private async enqueue(
        input: Omit<SyncQueueItem, 'id' | 'createdAt' | 'updatedAt' | 'retries' | 'status' | 'nextRetryAt' | 'lastError'>
    ): Promise<void> {
        const queue = await this.getQueue();
        const nowIso = new Date().toISOString();
        const item: SyncQueueItem = {
            id: `${input.entity}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
            createdAt: nowIso,
            updatedAt: nowIso,
            retries: 0,
            status: 'pending',
            ...input,
        };

        const nextQueue = queue.filter((existingItem) => !this.isSameResource(existingItem, item));
        nextQueue.push(item);
        await this.saveQueue(nextQueue);
    }

    private async getQueue(): Promise<SyncQueueItem[]> {
        if (this.memCache) {
            return this.memCache;
        }

        try {
            const raw = await AsyncStorage.getItem(SYNC_QUEUE_STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            this.memCache = Array.isArray(parsed) ? parsed.map((item) => this.normalizeQueueItem(item)) : [];
        } catch (error) {
            console.error('[SyncQueueService] Failed to load queue:', error);
            this.memCache = [];
        }

        return this.memCache;
    }

    private async saveQueue(queue: SyncQueueItem[]): Promise<void> {
        this.memCache = [...queue].sort((left, right) => left.createdAt.localeCompare(right.createdAt));
        try {
            await AsyncStorage.setItem(SYNC_QUEUE_STORAGE_KEY, JSON.stringify(this.memCache));
        } catch (error) {
            console.error('[SyncQueueService] Failed to save queue:', error);
        }
    }

    private shouldDelayRetry(item: SyncQueueItem): boolean {
        if (!item.nextRetryAt) {
            return false;
        }

        const nextRetryAtMs = new Date(item.nextRetryAt).getTime();
        return Number.isFinite(nextRetryAtMs) && nextRetryAtMs > Date.now();
    }

    private getRetryDelayMs(retries: number): number {
        return Math.min(BASE_RETRY_DELAY_MS * 2 ** Math.max(retries - 1, 0), MAX_RETRY_DELAY_MS);
    }

    private isSameResource(left: SyncQueueItem, right: SyncQueueItem): boolean {
        return (
            left.entity === right.entity &&
            left.action === right.action &&
            this.resolveLessonId(left.payload) === this.resolveLessonId(right.payload)
        );
    }

    private resolveLessonId(payload: LessonProgressSyncPayload | ReviewCardSyncPayload): string {
        return payload.lessonId;
    }

    private normalizeQueueItem(item: Partial<SyncQueueItem>): SyncQueueItem {
        const createdAt = item.createdAt ?? new Date().toISOString();

        return {
            id: item.id ?? `sync:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
            entity: item.entity ?? 'lesson_progress',
            action: item.action ?? 'upsert_quiz_result',
            createdAt,
            updatedAt: item.updatedAt ?? createdAt,
            retries: typeof item.retries === 'number' ? item.retries : 0,
            status: item.status === 'retrying' ? 'retrying' : 'pending',
            nextRetryAt: item.nextRetryAt,
            lastError: item.lastError,
            payload: item.payload as LessonProgressSyncPayload | ReviewCardSyncPayload,
        };
    }
}

export const SyncQueueService = new SyncQueueServiceImpl();
