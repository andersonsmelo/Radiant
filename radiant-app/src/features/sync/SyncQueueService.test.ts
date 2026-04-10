import AsyncStorage from '@react-native-async-storage/async-storage';
import { SyncQueueService } from './SyncQueueService';
import { LessonProgressSyncRepository } from './repositories/LessonProgressSyncRepository';
import { ReviewCardsSyncRepository } from './repositories/ReviewCardsSyncRepository';
import { AuthService } from '../auth/AuthService';
import { TelemetryService } from '../telemetry/TelemetryService';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

jest.mock('../../config', () => ({
  AppConfig: {
    ENABLE_REMOTE_SYNC: true,
  },
}));

jest.mock('../../lib/api', () => ({
  isApiConfigured: jest.fn(() => true),
}));

jest.mock('../auth/AuthService', () => ({
  AuthService: {
    hasAuthenticatedSession: jest.fn(() => true),
    getValidAccessToken: jest.fn().mockResolvedValue('access-token'),
  },
}));

jest.mock('./repositories/LessonProgressSyncRepository', () => ({
  LessonProgressSyncRepository: {
    syncQuizResult: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('./repositories/ReviewCardsSyncRepository', () => ({
  ReviewCardsSyncRepository: {
    syncCard: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('../telemetry/TelemetryService', () => ({
  TelemetryService: {
    track: jest.fn().mockResolvedValue(undefined),
  },
}));

const storage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const syncQuizResult = LessonProgressSyncRepository.syncQuizResult as jest.MockedFunction<
  typeof LessonProgressSyncRepository.syncQuizResult
>;
const syncCard = ReviewCardsSyncRepository.syncCard as jest.MockedFunction<typeof ReviewCardsSyncRepository.syncCard>;
const hasAuthenticatedSession = AuthService.hasAuthenticatedSession as jest.MockedFunction<
  typeof AuthService.hasAuthenticatedSession
>;
const telemetryTrack = TelemetryService.track as jest.MockedFunction<typeof TelemetryService.track>;

describe('SyncQueueService', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    hasAuthenticatedSession.mockReturnValue(true);
    syncQuizResult.mockResolvedValue(undefined);
    syncCard.mockResolvedValue(undefined);
    await SyncQueueService.reset();
  });

  it('deduplicates lesson progress items for the same lesson', async () => {
    const result = {
      lessonId: 'lesson-1',
      totalQuestions: 10,
      correctAnswers: 8,
      answeredAt: new Date('2026-03-29T10:00:00.000Z'),
    } as const;

    await SyncQueueService.enqueueLessonProgressFromQuizResult(result);
    await SyncQueueService.enqueueLessonProgressFromQuizResult(result);

    expect(await SyncQueueService.getPendingCount()).toBe(1);
    expect(storage.setItem).toHaveBeenCalled();
  });

  it('flushes pending items through the matching repositories', async () => {
    await SyncQueueService.enqueueLessonProgressFromQuizResult({
      lessonId: 'lesson-1',
      totalQuestions: 10,
      correctAnswers: 8,
      answeredAt: new Date('2026-03-29T10:00:00.000Z'),
    });

    await SyncQueueService.enqueueReviewCard({
      lessonId: 'lesson-1',
      easeFactor: 2.3,
      interval: 4,
      repetitions: 3,
      nextReviewAt: new Date('2026-03-30T10:00:00.000Z'),
      lastReviewedAt: new Date('2026-03-29T10:00:00.000Z'),
      createdAt: new Date('2026-03-20T10:00:00.000Z'),
    });

    expect(hasAuthenticatedSession()).toBe(true);

    await SyncQueueService.flush();

    expect(syncQuizResult).toHaveBeenCalledTimes(1);
    expect(syncCard).toHaveBeenCalledTimes(1);
    expect(await SyncQueueService.getPendingCount()).toBe(0);
  });

  it('skips flush when there is no authenticated session and preserves the queue', async () => {
    hasAuthenticatedSession.mockReturnValue(false);

    await SyncQueueService.enqueueLessonProgressFromQuizResult({
      lessonId: 'lesson-2',
      totalQuestions: 8,
      correctAnswers: 6,
      answeredAt: new Date('2026-03-29T11:00:00.000Z'),
    });

    await SyncQueueService.flush();

    expect(syncQuizResult).not.toHaveBeenCalled();
    expect(await SyncQueueService.getPendingCount()).toBe(1);
    expect(telemetryTrack).toHaveBeenCalledWith(
      'sync_flush_skipped',
      expect.objectContaining({ authenticated: false })
    );
  });

  it('keeps failed items queued and marks them for retry', async () => {
    syncQuizResult.mockRejectedValueOnce(new Error('temporary upstream failure'));

    await SyncQueueService.enqueueLessonProgressFromQuizResult({
      lessonId: 'lesson-3',
      totalQuestions: 10,
      correctAnswers: 7,
      answeredAt: new Date('2026-03-29T12:00:00.000Z'),
    });

    await SyncQueueService.flush();

    const items = await SyncQueueService.getItems();
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      entity: 'lesson_progress',
      action: 'upsert_quiz_result',
      retries: 1,
      status: 'retrying',
      lastError: 'temporary upstream failure',
    });
    expect(items[0].nextRetryAt).toBeTruthy();
    expect(await SyncQueueService.getPendingCount()).toBe(1);
  });
});
