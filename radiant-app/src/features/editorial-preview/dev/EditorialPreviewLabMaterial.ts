import pack from '../../../../../docs/evidence/2026-11-03-pc05-payloads.json';
import type { EditorialPreviewInput } from '../EditorialPreviewMaterial';
import type { EditorialCurriculumCandidateV1 } from '../../student-checkpoints/EditorialCurriculumCandidate';

// One review artifact, supplied directly. Never copy it into a runtime catalog.
export const lessonMaterial = {
    candidate: pack.completeCandidate,
    checkpointOptionFeedback: pack.checkpointOptionFeedback,
    optionalHelp: pack.optionalHelp,
    recoveryActivities: pack.recoveryActivities,
} as unknown as EditorialPreviewInput;
export const practiceMaterial = pack.reviewEnvelope as unknown as EditorialCurriculumCandidateV1;
