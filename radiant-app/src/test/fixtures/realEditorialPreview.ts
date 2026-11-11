import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { EditorialCurriculumCandidateV1 } from '../../features/student-checkpoints/EditorialCurriculumCandidate';
import type { EditorialPreviewInput } from '../../features/editorial-preview/EditorialPreviewMaterial';

/** Test-only read of the real review artifact; never imported by product code. */
export function realEditorialPreview(): EditorialPreviewInput {
    const pack = JSON.parse(readFileSync(resolve(__dirname, '../../../../docs/evidence/2026-11-03-pc05-payloads.json'), 'utf8'));
    return {
        candidate: pack.completeCandidate,
        checkpointOptionFeedback: pack.checkpointOptionFeedback,
        optionalHelp: pack.optionalHelp,
        recoveryActivities: pack.recoveryActivities,
    };
}

/** Opt-in review envelope with the five pilot lessons, approvals still pending; test data only. */
export function realEditorialPilotEnvelope(): EditorialCurriculumCandidateV1 {
    const pack = JSON.parse(readFileSync(resolve(__dirname, '../../../../docs/evidence/2026-11-03-pc05-payloads.json'), 'utf8'));
    return pack.reviewEnvelope;
}
