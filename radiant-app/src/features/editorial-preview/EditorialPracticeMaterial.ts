import { validateEditorialBatchContract } from '../student-checkpoints/EditorialBatchContract';
import type { EditorialCurriculumCandidateV1 } from '../student-checkpoints/EditorialCurriculumCandidate';
import type { EditorialDiagramAssetV1 } from '../student-checkpoints/EditorialPilotContract';
import type { EditorialPreviewSession } from './EditorialPreviewMaterial';
import { isAbstractCollimationInteraction } from './AbstractCollimationRenderer';
import { resolveEditorialLocalDiagram } from './EditorialLocalDiagrams';

type Result = Readonly<{ ok: true; session: EditorialPreviewSession; assets: readonly EditorialDiagramAssetV1[]; promotionReady: false; coverageGaps: readonly string[] }>
    | Readonly<{ ok: false; issues: readonly string[] }>;

/** Preview-only opt-in. Missing checkpoint coverage is reported by PC05 and never becomes promotion approval. */
export function createEditorialPracticeMaterial(raw: unknown, activityId: string): Result {
    try {
        const candidate = raw as EditorialCurriculumCandidateV1;
        if (!candidate.pilot) return { ok: false, issues: ['missing-pilot-contract'] };
        const allIssues = Array.from(validateEditorialBatchContract(candidate));
        const coverageGaps = allIssues.filter(issue => issue.startsWith('checkpoint-coverage:'));
        const issues = allIssues.filter(issue => !issue.startsWith('checkpoint-coverage:'));
        if (issues.length) return { ok: false, issues };
        if (candidate.pilot.assets.some(asset => !resolveEditorialLocalDiagram(asset)))
            return { ok: false, issues: ['unresolved-local-diagram'] };
        const activity = candidate.activities.find(activity => activity.id === activityId);
        if (!activity) return { ok: false, issues: ['unknown-preview-activity'] };
        const interactions = activity.steps.flatMap(step => step.kind === 'interaction' ? [step.interaction] : []);
        if (interactions.length !== 1 || (interactions[0].type === 'bench' && !isAbstractCollimationInteraction(interactions[0])))
            return { ok: false, issues: ['unsupported-abstract-scene'] };
        return { ok: true, promotionReady: false, coverageGaps, assets: candidate.pilot.assets, session: {
            activity, targetIds: { [interactions[0].id]: activity.id },
        } };
    } catch { return { ok: false, issues: ['invalid-practice-material'] }; }
}
