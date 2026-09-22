import { L2_SLICING_SPACE } from './l2SlicingSpaceContent';
import type { L2Challenge, L2EvidenceKind, L2Misconception } from './l2SlicingSpace.types';

type L2EvidenceRecord = Readonly<{
  challengeId: string;
  objectiveId: string;
  evidenceKind: L2EvidenceKind;
  outcome: 'correct' | 'incorrect';
  misconception: L2Misconception;
  visualScenarioId: string;
}>;

export type SlicingSpaceAnswerResult = Readonly<{
  correct: boolean;
  feedback: string;
  misconception: L2Misconception;
  evidenceKind: L2EvidenceKind;
  awardsXp: boolean;
  demonstratesMastery: boolean;
  remediationChallengeId: string;
  nextChallengeId?: string;
  nextActionLabel?: string;
  reviewTargetId: string;
}>;

export type SlicingSpaceLessonSession = Readonly<{
  answer: (challengeId: string, answerId: string) => SlicingSpaceAnswerResult;
  snapshot: () => Readonly<{ evidence: readonly L2EvidenceRecord[] }>;
}>;

const challengeById = (challengeId: string): L2Challenge => {
  const challenge = L2_SLICING_SPACE.challenges.find(({ id }) => id === challengeId);
  if (!challenge) throw new Error(`Unknown L2 challenge: ${challengeId}`);
  return challenge;
};

export const createSlicingSpaceLessonSession = (): SlicingSpaceLessonSession => {
  const evidence: L2EvidenceRecord[] = [];

  const answer = (challengeId: string, answerId: string): SlicingSpaceAnswerResult => {
    const challenge = challengeById(challengeId);
    const correct = challenge.correctAnswerId === answerId;
    const attemptedThisRecovery = challenge.evidenceKind === 'later_independent_retrieval'
      && evidence.some((entry) => entry.challengeId === challengeId);
    const failedEarlierRecovery = evidence.some((entry) => entry.objectiveId === challenge.objectiveId
      && entry.evidenceKind === 'later_independent_retrieval' && entry.outcome === 'incorrect');
    const seenScenarioForObjective = evidence.some((entry) => entry.objectiveId === challenge.objectiveId
      && entry.visualScenarioId === challenge.visualScenarioId);
    // Uma recuperação só demonstra domínio depois de o objetivo ter sido
    // enfrentado sem ajuda pelo menos uma vez. É isso que impede a chamada
    // direta à recuperação de conceder XP — o achado v2 (4). Exigir ERRO
    // prévio era forte demais: tornava o objetivo inalcançável para quem
    // acerta, contra a §5.1, que pede item novo e independente para todo
    // objetivo essencial (achado C4).
    const hasAttemptedObjectiveIndependently = evidence.some((entry) => entry.objectiveId === challenge.objectiveId
      && entry.evidenceKind === 'initial_independent');
    const hasErredOnObjective = evidence.some((entry) => entry.objectiveId === challenge.objectiveId && entry.outcome === 'incorrect');
    const hasCompletedAssistedPractice = evidence.some((entry) => entry.objectiveId === challenge.objectiveId
      && entry.evidenceKind === 'assisted_practice' && entry.outcome === 'correct');
    // Quem errou precisa ter fechado a prática assistida; quem não errou não
    // tem apoio a cumprir.
    const supportRequirementSatisfied = !hasErredOnObjective || hasCompletedAssistedPractice;
    const supportCannotOpenRepeatedRecovery = challenge.evidenceKind === 'assisted_practice'
      && correct && failedEarlierRecovery;
    const demonstratesMastery = correct
      && challenge.evidenceKind === 'later_independent_retrieval'
      && !attemptedThisRecovery
      && !seenScenarioForObjective
      && hasAttemptedObjectiveIndependently
      && supportRequirementSatisfied;

    evidence.push(Object.freeze({
      challengeId,
      objectiveId: challenge.objectiveId,
      evidenceKind: challenge.evidenceKind,
      outcome: correct ? 'correct' : 'incorrect',
      misconception: challenge.misconception,
      visualScenarioId: challenge.visualScenarioId,
    }));

    // Acertar o item inicial não fecha o objetivo: a recuperação independente
    // em cenário novo é o que a §5.1 exige, e ela estava declarada em
    // `additionalRecoveryChallengeId` sem nenhum leitor no motor da L2 — o
    // caminho correto pulava direto para o objetivo seguinte (achado C4).
    const pendingRecoveryChallengeId = correct
      && challenge.evidenceKind === 'initial_independent'
      && challenge.additionalRecoveryChallengeId !== undefined
      && !evidence.some((entry) => entry.challengeId === challenge.additionalRecoveryChallengeId)
      ? challenge.additionalRecoveryChallengeId
      : undefined;
    const nextChallengeId = !correct
      ? challenge.remediationChallengeId
      : supportCannotOpenRepeatedRecovery
        ? undefined
        : pendingRecoveryChallengeId ?? challenge.nextChallengeId;

    return Object.freeze({
      correct,
      feedback: correct ? challenge.feedback.correct : challenge.feedback.incorrect,
      misconception: challenge.misconception,
      evidenceKind: challenge.evidenceKind,
      awardsXp: correct && demonstratesMastery && challenge.awardsXp,
      demonstratesMastery,
      remediationChallengeId: challenge.remediationChallengeId,
      ...(nextChallengeId ? { nextChallengeId } : {}),
      ...(nextChallengeId
        ? pendingRecoveryChallengeId
          ? { nextActionLabel: 'Tentar um cenário novo sem apoio' }
          : challenge.nextActionLabel
            ? { nextActionLabel: challenge.nextActionLabel }
            : {}
        : {}),
      reviewTargetId: challenge.reviewTargetId,
    });
  };

  return Object.freeze({
    answer,
    snapshot: () => Object.freeze({ evidence: Object.freeze([...evidence]) }),
  });
};
