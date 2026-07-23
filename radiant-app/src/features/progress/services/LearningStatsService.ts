export interface LearningAttempt {
  lessonId: string;
  topicId: string;
  correctAnswers: number;
  totalQuestions: number;
  completedAt: string;
}

export interface LearningTopicMastery {
  topicId: string;
  accuracyPercent: number;
  completedCases: number;
}

export interface LearningStatsSnapshot {
  masteredCases: number | null;
  accuracyPercent: number | null;
  recentAccuracyPercent: number | null;
  topicMastery: LearningTopicMastery[];
}

export interface LearningStatsDependencies {
  getAttempts(): Promise<LearningAttempt[]>;
  now?(): Date;
}

function accuracyPercent(correctAnswers: number, totalQuestions: number): number | null {
  if (totalQuestions <= 0) return null;
  return Math.round((correctAnswers / totalQuestions) * 100);
}

export class LearningStatsService {
  constructor(private readonly dependencies: LearningStatsDependencies) {}

  async getSnapshot(): Promise<LearningStatsSnapshot> {
    const attempts = await this.dependencies.getAttempts();
    if (attempts.length === 0) {
      return { masteredCases: null, accuracyPercent: null, recentAccuracyPercent: null, topicMastery: [] };
    }

    const validAttempts = attempts.filter((attempt) => attempt.totalQuestions > 0 && attempt.correctAnswers >= 0);
    if (validAttempts.length === 0) {
      return { masteredCases: null, accuracyPercent: null, recentAccuracyPercent: null, topicMastery: [] };
    }

    const totals = validAttempts.reduce(
      (sum, attempt) => ({ correctAnswers: sum.correctAnswers + attempt.correctAnswers, totalQuestions: sum.totalQuestions + attempt.totalQuestions }),
      { correctAnswers: 0, totalQuestions: 0 },
    );
    const latestByLesson = new Map<string, LearningAttempt>();
    for (const attempt of validAttempts) {
      const current = latestByLesson.get(attempt.lessonId);
      if (!current || new Date(attempt.completedAt).getTime() >= new Date(current.completedAt).getTime()) latestByLesson.set(attempt.lessonId, attempt);
    }
    const topics = new Map<string, { correctAnswers: number; totalQuestions: number; lessonIds: Set<string> }>();
    for (const attempt of validAttempts) {
      const topic = topics.get(attempt.topicId) ?? { correctAnswers: 0, totalQuestions: 0, lessonIds: new Set<string>() };
      topic.correctAnswers += attempt.correctAnswers;
      topic.totalQuestions += attempt.totalQuestions;
      topic.lessonIds.add(attempt.lessonId);
      topics.set(attempt.topicId, topic);
    }

    const now = this.dependencies.now?.() ?? new Date();
    const recentCutoff = now.getTime() - 7 * 24 * 60 * 60 * 1000;
    const recentTotals = validAttempts
      .filter((attempt) => new Date(attempt.completedAt).getTime() >= recentCutoff)
      .reduce(
        (sum, attempt) => ({ correctAnswers: sum.correctAnswers + attempt.correctAnswers, totalQuestions: sum.totalQuestions + attempt.totalQuestions }),
        { correctAnswers: 0, totalQuestions: 0 },
      );

    return {
      masteredCases: [...latestByLesson.values()].filter((attempt) => accuracyPercent(attempt.correctAnswers, attempt.totalQuestions)! >= 90).length,
      accuracyPercent: accuracyPercent(totals.correctAnswers, totals.totalQuestions),
      recentAccuracyPercent: accuracyPercent(recentTotals.correctAnswers, recentTotals.totalQuestions),
      topicMastery: [...topics.entries()]
        .map(([topicId, topic]) => ({
          topicId,
          accuracyPercent: accuracyPercent(topic.correctAnswers, topic.totalQuestions) ?? 0,
          completedCases: topic.lessonIds.size,
        }))
        .sort((left, right) => left.topicId.localeCompare(right.topicId)),
    };
  }
}
