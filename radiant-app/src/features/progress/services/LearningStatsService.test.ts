import { LearningStatsService } from './LearningStatsService';

describe('LearningStatsService', () => {
  it('aggregates persisted attempts without inferring mastery from XP', async () => {
    const service = new LearningStatsService({
      getAttempts: async () => [
        { lessonId: 'lesson-1', topicId: 'thorax', correctAnswers: 8, totalQuestions: 10, completedAt: '2026-07-20T12:00:00.000Z' },
        { lessonId: 'lesson-2', topicId: 'thorax', correctAnswers: 9, totalQuestions: 10, completedAt: '2026-07-21T12:00:00.000Z' },
      ],
    });

    await expect(service.getSnapshot()).resolves.toMatchObject({
      masteredCases: 1,
      accuracyPercent: 85,
      topicMastery: [{ topicId: 'thorax', accuracyPercent: 85, completedCases: 2 }],
    });
  });

  it('returns honest empty metrics when no persisted attempts exist', async () => {
    const service = new LearningStatsService({ getAttempts: async () => [] });

    await expect(service.getSnapshot()).resolves.toEqual({
      masteredCases: null,
      accuracyPercent: null,
      recentAccuracyPercent: null,
      topicMastery: [],
    });
  });
});
