import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalAccountMigrationService } from './LocalAccountMigrationService';
import { SpacedRepetitionService } from '../spaced-repetition/services/SpacedRepetitionService';
import { SyncQueueService } from '../sync/SyncQueueService';
import { LessonCatalogService } from '../content/services/LessonCatalogService';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

jest.mock('../spaced-repetition/services/SpacedRepetitionService', () => ({
  SpacedRepetitionService: {
    getAllCards: jest.fn(),
    getLatestRatingsByLesson: jest.fn(),
  },
}));

jest.mock('../sync/SyncQueueService', () => ({
  SyncQueueService: {
    enqueueReviewCard: jest.fn(),
    enqueueSyntheticLessonProgress: jest.fn(),
  },
}));

jest.mock('../content/services/LessonCatalogService', () => ({
  LessonCatalogService: {
    getLessonById: jest.fn(),
  },
}));

jest.mock('../telemetry/TelemetryService', () => ({
  TelemetryService: {
    track: jest.fn().mockResolvedValue(undefined),
  },
}));

const mockedStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const mockedSpacedRepetitionService = SpacedRepetitionService as jest.Mocked<typeof SpacedRepetitionService>;
const mockedSyncQueueService = SyncQueueService as jest.Mocked<typeof SyncQueueService>;
const mockedLessonCatalogService = LessonCatalogService as jest.Mocked<typeof LessonCatalogService>;

describe('LocalAccountMigrationService', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    mockedStorage.getItem.mockResolvedValue(null);
    await LocalAccountMigrationService.resetForTests();
  });

  it('migrates local review cards once for an authenticated user', async () => {
    mockedSpacedRepetitionService.getAllCards.mockResolvedValue([
      {
        lessonId: 'lesson-1',
        easeFactor: 2.3,
        interval: 3,
        repetitions: 1,
        nextReviewAt: new Date('2026-04-02T12:00:00.000Z'),
        lastReviewedAt: new Date('2026-04-01T12:00:00.000Z'),
        createdAt: new Date('2026-03-31T12:00:00.000Z'),
      },
    ]);
    mockedSpacedRepetitionService.getLatestRatingsByLesson.mockResolvedValue({
      'lesson-1': 4,
    });
    mockedLessonCatalogService.getLessonById.mockReturnValue({
      id: 'lesson-1',
      title: 'Lesson 1',
      difficulty: 'beginner',
      questions: [
        { id: 'q1', type: 'multiple-choice', prompt: 'Q1', options: [{ label: 'A' }], correctAnswerIndex: 0, explanation: 'ok' },
        { id: 'q2', type: 'multiple-choice', prompt: 'Q2', options: [{ label: 'A' }], correctAnswerIndex: 0, explanation: 'ok' },
        { id: 'q3', type: 'multiple-choice', prompt: 'Q3', options: [{ label: 'A' }], correctAnswerIndex: 0, explanation: 'ok' },
        { id: 'q4', type: 'multiple-choice', prompt: 'Q4', options: [{ label: 'A' }], correctAnswerIndex: 0, explanation: 'ok' },
        { id: 'q5', type: 'multiple-choice', prompt: 'Q5', options: [{ label: 'A' }], correctAnswerIndex: 0, explanation: 'ok' },
      ],
    } as never);

    await LocalAccountMigrationService.migrateLocalStateToAuthenticatedAccount({
      accessToken: 'access',
      refreshToken: 'refresh',
      user: {
        id: 'user-1',
        email: 'user@example.com',
      },
    });

    expect(mockedSyncQueueService.enqueueReviewCard).toHaveBeenCalledTimes(1);
    expect(mockedSyncQueueService.enqueueSyntheticLessonProgress).toHaveBeenCalledWith({
      lessonId: 'lesson-1',
      totalQuestions: 5,
      correctAnswers: 4,
      answeredAt: new Date('2026-04-01T12:00:00.000Z'),
    });
    expect(mockedStorage.setItem).toHaveBeenCalled();
  });
});
