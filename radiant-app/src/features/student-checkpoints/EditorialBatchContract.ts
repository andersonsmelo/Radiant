import { AUTHORED_EVIDENCE_KINDS, validateLearningActivity } from '../../types/learningActivity';
import type { ClaimProvenanceV1, EditorialCurriculumCandidateV1 } from './EditorialCurriculumCandidate';

const GATES = ['technical', 'editorial', 'accessibility', 'rights', 'schema', 'product'];
const filled = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;
function date(value: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value))
        && new Date(value).toISOString().slice(0, 10) === value;
}
function https(value: string): boolean {
    return /^https:\/\/[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?(?::\d{1,5})?(?:[/?#][^\s]*)?$/i.test(value);
}

/** Contrato v1 sem mídia: uma múltipla escolha por atividade, estágio por competência.
 * Tamanhos e identidades são declarados pelo lote. Não concede nenhum dos seis gates.
 * Outros formatos exigem vínculo de claims/mídia próprio antes de serem promovidos.
 */
export function validateEditorialBatchContract(value: unknown): string[] {
    try { return validate(value as EditorialCurriculumCandidateV1); }
    catch { return ['invalid-candidate-shape']; }
}

function validate(candidate: EditorialCurriculumCandidateV1): string[] {
    const issues: string[] = [];
    const add = (code: string, id?: string) => issues.push(id ? `${code}:${id}` : code);
    const identities = new Set<string>();
    const claimIdentity = (id: string) => {
        if (!filled(id)) add('empty-identity');
        else if (identities.has(id)) add('duplicate-identity', id);
        identities.add(id);
    };
    [candidate.trackId, candidate.unitId, candidate.checkpoint.id].forEach(claimIdentity);
    if (!filled(candidate.contentVersion)) add('invalid-content-version');
    if (candidate.schemaVersion !== 1 || candidate.promotionState !== 'human-gates-pending') add('candidate-must-remain-unpromotable');
    if (Object.keys(candidate.approvals).length !== GATES.length || GATES.some(gate => candidate.approvals[gate as keyof typeof candidate.approvals] !== 'pending')) add('human-approval-must-remain-pending');
    const competencies = new Set(candidate.competencyIds);
    if (!competencies.size || competencies.size !== candidate.competencyIds.length || candidate.competencyIds.some(id => !filled(id))) add('invalid-competencies');
    const slugs = candidate.competencyIds.map(id => id.split(':').at(-1));
    if (new Set(slugs).size !== slugs.length || slugs.some(slug => !filled(slug))) add('duplicate-stage-slug');
    const sourceIds = new Set(candidate.sources.map(source => source.id));
    if (sourceIds.size !== candidate.sources.length) add('duplicate-source');
    if (!sourceIds.size || candidate.sources.some(source => !filled(source.id) || !filled(source.title) || !filled(source.attribution)
        || !https(source.url) || !date(source.accessedAt) || !filled(source.adaptationNotice)
        || !/^[a-f0-9]{64}$/.test(source.retrievedMaterialSha256)
        || source.license.label !== 'CC BY 4.0' || source.license.url !== 'https://creativecommons.org/licenses/by/4.0/')) add('invalid-source-metadata');
    const validSources = (ids: readonly string[]) => ids.length > 0 && new Set(ids).size === ids.length && ids.every(id => sourceIds.has(id));
    const validCompetency = (ids: readonly string[]) => ids.length === 1 && competencies.has(ids[0]);
    const requiredClaims: ClaimProvenanceV1[] = [];
    function claims(id: string, options: readonly { id: string }[], correctOptionId: string, sources: readonly string[]) {
        requiredClaims.push({ claimId: `${id}:prompt`, claimKind: 'prompt', provenanceKind: 'source-backed', sourceIds: sources });
        for (const option of options) {
            claimIdentity(option.id);
            const correct = option.id === correctOptionId;
            requiredClaims.push({ claimId: option.id, claimKind: correct ? 'correct-answer' : 'distractor', provenanceKind: correct ? 'source-backed' : 'authorial-distractor', sourceIds: correct ? sources : [] });
        }
        for (const kind of ['correct', 'incorrect']) requiredClaims.push({ claimId: `${id}:feedback:${kind}`, claimKind: 'feedback', provenanceKind: 'source-backed', sourceIds: sources });
    }
    if (!candidate.activities.length) add('missing-learning-material');
    for (const activity of candidate.activities) {
        claimIdentity(activity.id);
        if (validateLearningActivity(activity).length) add('invalid-activity', activity.id);
        if (activity.provenance.contentVersion !== candidate.contentVersion) add('activity-version-mismatch', activity.id);
        const interactions = activity.steps.flatMap(step => step.kind === 'interaction' ? [step.interaction] : []);
        activity.steps.forEach(step => claimIdentity(step.kind === 'interaction' ? step.interaction.id : step.id));
        if (interactions.length !== 1 || interactions[0].type !== 'multiple-choice') { add('unsupported-activity-family', activity.id); continue; }
        const interaction = interactions[0];
        if (interaction.type !== 'multiple-choice') continue;
        if (!validCompetency(activity.competencyIds) || !validCompetency(interaction.competencyIds)
            || activity.competencyIds[0] !== interaction.competencyIds[0] || interaction.criticalSafety
            || !AUTHORED_EVIDENCE_KINDS.some(kind => kind === interaction.evidenceKind)
            || !validSources(activity.provenance.sourceIds)) add('invalid-activity-contract', activity.id);
        if (interaction.payload.options.some(option => option.imageRef)) add('unsupported-activity-family', activity.id);
        claims(activity.id, interaction.payload.options, interaction.payload.correctOptionId, activity.provenance.sourceIds);
    }
    if (candidate.checkpoint.targetScoreBasisPoints !== 8000 || !candidate.checkpoint.items.length) add('invalid-checkpoint-shape');
    const positionGroups = new Map<number, Set<number>>();
    const groupSizes = new Map<number, number>();
    for (const item of candidate.checkpoint.items) {
        claimIdentity(item.id);
        const correct = item.options.findIndex(option => option.id === item.correctOptionId);
        if (!validCompetency(item.competencyIds) || !validSources(item.sourceIds) || !filled(item.prompt)
            || !filled(item.feedback.correct) || !filled(item.feedback.incorrect) || item.options.length < 2
            || item.options.some(option => !filled(option.label)) || correct < 0) add('invalid-checkpoint-item', item.id);
        const positions = positionGroups.get(item.options.length) ?? new Set<number>();
        positions.add(correct); positionGroups.set(item.options.length, positions);
        groupSizes.set(item.options.length, (groupSizes.get(item.options.length) ?? 0) + 1);
        claims(item.id, item.options, item.correctOptionId, item.sourceIds);
    }
    for (const [count, positions] of positionGroups) if (positions.size < Math.min(count, groupSizes.get(count)!)) add('checkpoint-answer-position-bias');
    for (const competency of competencies) {
        if (!candidate.activities.some(activity => activity.competencyIds.includes(competency))) add('activity-coverage', competency);
        if (candidate.checkpoint.items.filter(item => item.competencyIds.includes(competency)).length < 2) add('checkpoint-coverage', competency);
    }
    const cycles = candidate.reinforcement.cycles;
    if (cycles.length !== 2 || cycles[0].cycle !== 1 || cycles[0].mode !== 'guided-recovery'
        || cycles[1].cycle !== 2 || cycles[1].mode !== 'different-context-retry') add('invalid-reinforcement');
    const supplied = new Map(candidate.claimProvenance.map(claim => [claim.claimId, claim]));
    if (supplied.size !== candidate.claimProvenance.length) add('duplicate-claim');
    const expectedIds = new Set(requiredClaims.map(claim => claim.claimId));
    for (const claim of candidate.claimProvenance) if (!expectedIds.has(claim.claimId)) add('orphan-claim', claim.claimId);
    for (const expected of requiredClaims) {
        const actual = supplied.get(expected.claimId);
        const distractor = expected.claimKind === 'distractor';
        if (!actual || actual.claimKind !== expected.claimKind || actual.provenanceKind !== expected.provenanceKind
            || (distractor ? actual.sourceIds.length !== 0 : !validSources(actual.sourceIds))
            || actual.sourceIds.some(id => !expected.sourceIds.includes(id))) add('missing-claim-provenance', expected.claimId);
    }
    return [...new Set(issues)];
}
