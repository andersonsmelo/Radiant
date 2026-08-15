import { QUIZ_THRESHOLDS } from '../../../constants/quiz';
import type { LearningAttempt } from '../../progress/services/LearningStatsService';

export type LessonStars = 0 | 1 | 2 | 3;

const TWO_STAR_ACCURACY = 85;

export function resolveLessonStars(correctAnswers: number, totalQuestions: number): LessonStars {
  if (totalQuestions <= 0) { return 0; }
  const accuracy = (correctAnswers / totalQuestions) * 100;
  if (accuracy >= 100) { return 3; }
  if (accuracy >= TWO_STAR_ACCURACY) { return 2; }
  if (accuracy >= QUIZ_THRESHOLDS.PASSING_SCORE) { return 1; }
  return 0;
}

export function resolveBestLessonStars(
  lessonId: string,
  attempts: readonly LearningAttempt[],
  current: { correctAnswers: number; totalQuestions: number; completedAt: string },
): { stars: LessonStars; improved: boolean } {
  const currentStars = resolveLessonStars(current.correctAnswers, current.totalQuestions);

  const previousBest = attempts.reduce<LessonStars>((best, entry) => {
    if (entry.lessonId !== lessonId) { return best; }
    if (entry.completedAt === current.completedAt) { return best; }
    const stars = resolveLessonStars(entry.correctAnswers, entry.totalQuestions);
    return stars > best ? stars : best;
  }, 0);

  return {
    stars: currentStars > previousBest ? currentStars : previousBest,
    improved: currentStars > previousBest,
  };
}
