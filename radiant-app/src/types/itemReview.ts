import type { LearningEvidence, EvidenceOutcome } from './learningEvidence';

export type ItemIdentity = Pick<LearningEvidence, 'activityId' | 'competencyId' | 'contentVersion' | 'evidenceKind'> & {
    lessonId: string;
    itemId: string;
};
export type ItemAttempt = {
    attemptId: string;
    item: ItemIdentity;
    firstOutcome: EvidenceOutcome;
    finalOutcome: EvidenceOutcome;
    hintUsed: boolean;
    durationBand: LearningEvidence['durationBand'];
    recordedAt: string;
    mode: 'study' | 'self-review' | 'assessment' | 'review-answer';
    assessment?: { competencyIds: string[]; isCriticalError: boolean };
    review?: { previousReviewedAt: string; scheduledDueAt: string; hasPriorAttempt: boolean };
};
export type ItemCard = {
    item: ItemIdentity;
    easeFactor: number;
    interval: number;
    repetitions: number;
    createdAt: string;
    lastReviewedAt: string;
    dueAt: string;
    lastAttemptId: string | null;
};
export const itemKey = (item: Pick<ItemIdentity, 'lessonId' | 'itemId' | 'contentVersion'>): string =>
    JSON.stringify([item.lessonId, item.itemId, item.contentVersion]);

/** A autoavaliação ocorre depois de revelar a resposta: não é recall independente. */
export function itemAttemptEvidence(attempt: ItemAttempt): LearningEvidence {
    return {
        activityId: attempt.item.activityId, interactionId: attempt.item.itemId,
        competencyId: attempt.item.competencyId, contentVersion: attempt.item.contentVersion,
        evidenceKind: attempt.item.evidenceKind === 'legacy-lesson-recall' ? 'legacy-lesson-recall'
            : attempt.mode === 'self-review' || (attempt.mode === 'review-answer' && attempt.hintUsed) ? 'guided-practice'
            : attempt.mode === 'review-answer' ? 'independent-recall' : attempt.item.evidenceKind,
        outcome: attempt.assessment?.isCriticalError ? 'incorrect' : attempt.firstOutcome, hintUsed: attempt.hintUsed || attempt.mode === 'self-review',
        durationBand: attempt.durationBand, recordedAt: attempt.recordedAt,
    };
}

/** Sinal temporal operacional; não promove a evidência a delayed-retention. */
export function itemReviewTiming(attempt: ItemAttempt): 'unverified' | 'same-day' | 'after-interval' {
    if (!attempt.review?.hasPriorAttempt) return 'unverified';
    return Date.parse(attempt.recordedAt) >= Date.parse(attempt.review.scheduledDueAt)
        && Date.parse(attempt.recordedAt) - Date.parse(attempt.review.previousReviewedAt) >= 86400000
        ? 'after-interval' : 'same-day';
}

/** Um cartão por item; evidência para cada competência atribuída na avaliação. */
export function itemAttemptEvidenceEntries(attempt: ItemAttempt): LearningEvidence[] {
    const evidence = itemAttemptEvidence(attempt);
    return (attempt.assessment?.competencyIds ?? [attempt.item.competencyId]).map(competencyId => ({ ...evidence, competencyId }));
}
