import { L1_BODY_REFERENCE } from './l1BodyReferenceContent';
import type { L1Challenge, L1EvidenceKind, L1Misconception } from './l1BodyReference.types';

export type BodyReferenceEvidence = Readonly<{
  challengeId: string;
  evidenceKind: L1EvidenceKind;
  outcome: 'correct' | 'incorrect';
  misconception?: L1Misconception;
}>;

export type BodyReferenceAnswerResult = Readonly<{
  correct: boolean;
  evidenceKind: L1EvidenceKind;
  awardsXp: boolean;
  demonstratesMastery: boolean;
  misconception?: L1Misconception;
  remediationChallengeId: string;
  feedback: string;
  nextChallengeId?: string;
  nextActionLabel?: string;
  reviewTargetId?: string;
}>;

export type BodyReferenceLessonSession = Readonly<{
  answer(challengeId: string, answerId: string): BodyReferenceAnswerResult;
  requestHint(challengeId: string): string;
  snapshot(): Readonly<{ evidence: readonly BodyReferenceEvidence[] }>;
}>;

function challengeById(challengeId: string): L1Challenge {
  const challenge = L1_BODY_REFERENCE.challenges.find((entry) => entry.id === challengeId);
  if (!challenge) throw new Error(`UNKNOWN_L1_CHALLENGE:${challengeId}`);
  return challenge;
}

export function createBodyReferenceLessonSession(): BodyReferenceLessonSession {
  const evidence: BodyReferenceEvidence[] = [];
  const remediationOrigins = new Map<string, string>();
  const objectivesWithAssistance = new Set<string>();
  const attemptedChallengeIds = new Map<string, Set<string>>();

  return {
    answer(challengeId, answerId) {
      const challenge = challengeById(challengeId);
      const attemptedForObjective = attemptedChallengeIds.get(challenge.objectiveId) ?? new Set<string>();
      const wasAlreadyAttempted = attemptedForObjective.has(challenge.id);
      attemptedForObjective.add(challenge.id);
      attemptedChallengeIds.set(challenge.objectiveId, attemptedForObjective);
      const correct = challenge.correctAnswerId === answerId;
      if (!correct && !remediationOrigins.has(challenge.objectiveId)) {
        remediationOrigins.set(challenge.objectiveId, challenge.id);
      }
      if (challenge.evidenceKind === 'assisted_practice') objectivesWithAssistance.add(challenge.objectiveId);
      const remediationOrigin = remediationOrigins.get(challenge.objectiveId);
      const configuredNextChallengeId = challenge.nextChallengeId;
      const needsAnotherRecovery = correct && challenge.evidenceKind === 'assisted_practice' &&
        configuredNextChallengeId !== undefined && attemptedForObjective.has(configuredNextChallengeId);
      const additionalRecoveryWasAttempted = challenge.additionalRecoveryChallengeId !== undefined &&
        attemptedForObjective.has(challenge.additionalRecoveryChallengeId);
      const needsScheduledReview = needsAnotherRecovery && additionalRecoveryWasAttempted;
      const nextChallengeId = needsScheduledReview ? undefined : needsAnotherRecovery ? challenge.additionalRecoveryChallengeId : configuredNextChallengeId;
      const nextActionLabel = needsAnotherRecovery && !needsScheduledReview ? 'Tentar outro cenário sem apoio' : challenge.nextActionLabel;
      const demonstratesMastery = correct && challenge.evidenceKind === 'later_independent_retrieval' &&
        (remediationOrigin === undefined || remediationOrigin !== challenge.id) &&
        (!objectivesWithAssistance.has(challenge.objectiveId) || !wasAlreadyAttempted);
      evidence.push({
        challengeId,
        evidenceKind: challenge.evidenceKind,
        outcome: correct ? 'correct' : 'incorrect',
        ...(correct ? {} : { misconception: challenge.misconception }),
      });

      return {
        correct,
        evidenceKind: challenge.evidenceKind,
        awardsXp: correct && challenge.awardsXp,
        demonstratesMastery,
        ...(correct ? {} : { misconception: challenge.misconception }),
        remediationChallengeId: challenge.remediationChallengeId,
        feedback: correct ? challenge.feedback.correct : challenge.feedback.incorrect,
        ...(nextChallengeId ? { nextChallengeId, nextActionLabel } : {}),
        ...(needsScheduledReview ? { reviewTargetId: challenge.reviewTargetId } : {}),
      };
    },
    requestHint(challengeId) {
      const challenge = challengeById(challengeId);
      return `Compare a relação pedida com a referência anatômica antes de escolher. Depois, responda a ${challenge.remediationChallengeId} sem considerar isso domínio.`;
    },
    snapshot() {
      return { evidence: [...evidence] };
    },
  };
}
