import { XP_RULES } from '../../../constants/gamification';
import type { L1EvidenceKind, L1Misconception } from '../l1-body-reference/l1BodyReference.types';
import { variantOf } from './l1ItemTemplates';
import { createRng } from './seededRandom';
import type { HybridItem } from './hybridItem.types';

export type HybridEvent = 'correct' | 'incorrect' | 'streak3' | 'streak5' | 'heart_lost';

export type HybridAnswerResult = Readonly<{
  correct: boolean;
  costsHeart: boolean;
  feedback: string;
  hint: string | null;
  retrySameItem: boolean;
  requeuedItemId: string | null;
  events: readonly HybridEvent[];
  streak: number;
}>;

export type HybridEvidence = Readonly<{
  itemId: string;
  objectiveId: string;
  evidenceKind: L1EvidenceKind;
  outcome: 'correct' | 'incorrect';
  misconception?: L1Misconception;
}>;

export type HybridSummary = Readonly<{
  xp: number;
  accuracy: number;
  durationMs: number;
  bestStreak: number;
  requeued: number;
  heartsSpent: number;
  misconceptions: Readonly<Record<string, number>>;
  itemTimesMs: Readonly<Record<string, number>>;
}>;

export type HybridLessonSession = Readonly<{
  current(): HybridItem | null;
  position(): Readonly<{ index: number; total: number }>;
  answer(optionId: string): HybridAnswerResult;
  advance(): Readonly<{ complete: boolean }>;
  isComplete(): boolean;
  evidence(): readonly HybridEvidence[];
  summary(): HybridSummary;
}>;

export function createHybridLessonSession(options: Readonly<{ plan: readonly HybridItem[]; now?: () => number; seed?: number }>): HybridLessonSession {
  const now = options.now ?? Date.now;
  const rng = createRng(options.seed ?? 1);
  const queue: HybridItem[] = [...options.plan];
  const originalChallenges = options.plan.filter((item) => item.phase === 'challenge');
  const firstAttemptCorrect = new Map<string, boolean>();
  const answered = new Set<string>();
  const requeued = new Set<string>();
  const evidence: HybridEvidence[] = [];
  const misconceptions: Record<string, number> = {};
  const itemTimesMs: Record<string, number> = {};
  const startedAt = now();
  let shownAt = startedAt;
  let finishedAt: number | null = null;
  let index = 0;
  let streak = 0;
  let bestStreak = 0;
  let heartsSpent = 0;
  let retryPending = false;

  const current = (): HybridItem | null => (index < queue.length ? queue[index] : null);

  return {
    current,
    position: () => ({ index: Math.min(index, queue.length - 1), total: queue.length }),
    isComplete: () => index >= queue.length,
    answer(optionId) {
      const item = current();
      if (!item) throw new Error('HYBRID_SESSION_COMPLETE');
      const correct = optionId === item.correctOptionId;
      if (!answered.has(item.id)) {
        answered.add(item.id);
        itemTimesMs[item.id] = now() - shownAt;
        const independent = item.phase === 'challenge' && !item.variant;
        const evidenceKind: L1EvidenceKind = independent ? 'initial_independent' : 'assisted_practice';
        evidence.push({ itemId: item.id, objectiveId: item.objectiveId, evidenceKind, outcome: correct ? 'correct' : 'incorrect', ...(correct ? {} : { misconception: item.misconception }) });
        if (independent) firstAttemptCorrect.set(item.id, correct);
      }
      if (!correct) misconceptions[item.misconception] = (misconceptions[item.misconception] ?? 0) + 1;
      streak = correct ? streak + 1 : 0;
      bestStreak = Math.max(bestStreak, streak);
      const events: HybridEvent[] = [correct ? 'correct' : 'incorrect'];
      if (correct && streak === 3) events.push('streak3');
      if (correct && streak === 5) events.push('streak5');
      const costsHeart = !correct && item.phase === 'challenge';
      let requeuedItemId: string | null = null;
      if (costsHeart) {
        heartsSpent += 1;
        events.push('heart_lost');
        if (!item.variant && !requeued.has(item.id)) {
          const variant = variantOf(item, rng);
          queue.push(variant);
          requeued.add(item.id);
          requeuedItemId = variant.id;
        }
      }
      retryPending = !correct && item.phase === 'first_contact';
      return {
        correct,
        costsHeart,
        feedback: correct ? item.feedback.correct : item.feedback.incorrect,
        hint: retryPending ? item.hint : null,
        retrySameItem: retryPending,
        requeuedItemId,
        events,
        streak,
      };
    },
    advance() {
      if (!retryPending) index += 1;
      retryPending = false;
      shownAt = now();
      const complete = index >= queue.length;
      if (complete && finishedAt === null) finishedAt = now();
      return { complete };
    },
    evidence: () => [...evidence],
    summary() {
      const correctCount = originalChallenges.filter((item) => firstAttemptCorrect.get(item.id) === true).length;
      const accuracy = originalChallenges.length === 0 ? 0 : correctCount / originalChallenges.length;
      const bonus = accuracy >= 0.9 ? XP_RULES.BONUS_XP_90PCT : accuracy >= 0.8 ? XP_RULES.BONUS_XP_80PCT : 0;
      return {
        xp: XP_RULES.BASE_XP_PER_QUIZ + bonus,
        accuracy,
        durationMs: (finishedAt ?? now()) - startedAt,
        bestStreak,
        requeued: requeued.size,
        heartsSpent,
        misconceptions: { ...misconceptions },
        itemTimesMs: { ...itemTimesMs },
      };
    },
  };
}
