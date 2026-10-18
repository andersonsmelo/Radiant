import type { LearningAttempt } from '../../progress/services/LearningStatsService';

export type LessonStars = 0 | 1 | 2 | 3;

// Proposta M7 (2026-10-18), pendente da aprovação do dono na PR.
export function resolveLessonStars(correctAnswers: number, totalQuestions: number): LessonStars {
  if (!Number.isInteger(totalQuestions) || !Number.isInteger(correctAnswers) ||
      totalQuestions <= 0 || correctAnswers <= 0 || correctAnswers > totalQuestions) return 0;
  if (correctAnswers === totalQuestions) return 3;
  if (correctAnswers * 3 >= totalQuestions * 2) return 2;
  return 1;
}

/**
 * As estrelas DESTA tentativa, o recorde da lição e se houve melhora.
 *
 * Até 2026-10-16 o resumo exibia a melhor nota já obtida, com a frase dela: a
 * revisão errada (0 de 1) dizia "Três estrelas. Nada passou despercebido." O
 * resumo honesto (ADR de 2026-10-16) mostra esta tentativa e o recorde à parte.
 */
export function resolveAttemptStars(
  lessonId: string,
  attempts: readonly LearningAttempt[],
  current: { correctAnswers: number; totalQuestions: number; completedAt: string },
): { stars: LessonStars; recordStars: LessonStars; improved: boolean } {
  const currentStars = resolveLessonStars(current.correctAnswers, current.totalQuestions);

  const previousBest = attempts.reduce<LessonStars>((best, entry) => {
    if (entry.lessonId !== lessonId) { return best; }
    if (entry.completedAt === current.completedAt) { return best; }
    const stars = resolveLessonStars(entry.correctAnswers, entry.totalQuestions);
    return stars > best ? stars : best;
  }, 0);

  return {
    stars: currentStars,
    recordStars: currentStars > previousBest ? currentStars : previousBest,
    improved: currentStars > previousBest,
  };
}
