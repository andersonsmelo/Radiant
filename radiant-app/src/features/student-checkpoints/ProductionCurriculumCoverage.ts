import { AUTHORED_EVIDENCE_KINDS, type LearningActivityV2 } from '../../types/learningActivity';
import type { ProductionBatchV1 } from './ProductionBatch';
import { LEGACY_COMPETENCY_PREFIX, LEGACY_CONTENT_VERSION } from '../lesson-flow/services/LegacyLessonAdapter';

type Issue = { code: string; id: string; batchId?: string };
export type ActivityOccurrence = { trackId: string; unitId: string; nodeId: string; activity: LearningActivityV2 };
export type CheckpointOccurrence = { trackId: string; unitId: string; nodeId: string; checkpoint: ProductionBatchV1['checkpoint'] };
type CoverageItem = {
    id: string; kind: 'practice-interaction' | 'checkpoint-item';
    provenance: 'promoted' | 'legacy-unmapped'; batchId: string | null;
    trackId: string; unitId: string; activityId: string | null; nodeIds: string[];
    contentVersion: string; competencyIds: string[]; sourceIds: string[];
    interactionType: string; evidenceKind: string | null; expectedClaimIds: string[];
};
type ExpectedClaim = { claimId: string; claimKind: string; provenanceKind: string };

/** Liga referências declaradas, sem atestar correção clínica, licença vigente
 * ou domínio do aluno. Checkpoints não ganham evidenceKind por inferência.
 */
export function auditCurriculumCoverage(batches: readonly ProductionBatchV1[], occurrences: readonly ActivityOccurrence[], checkpointOccurrences?: readonly CheckpointOccurrence[]) {
    const issues: Issue[] = [];
    const gaps: Issue[] = [];
    const items: CoverageItem[] = [];
    const registered = new Set(batches.flatMap(batch => batch.activities.map(activity => activity.id)));
    const sources: { batchId: string; sourceId: string; itemIds: string[]; claimIds: string[] }[] = [];
    const competencyDeclarations = new Set(batches.flatMap(batch => [...batch.competencyIds]));
    let expectedClaims = 0;
    let matchedClaims = 0;
    let sourceBackedClaims = 0;
    let authorialDistractorClaims = 0;
    const issue = (code: string, id: string, batchId?: string) => issues.push({ code, id, ...(batchId ? { batchId } : {}) });
    for (const batch of batches) {
        const knownSources = new Set(batch.sources.map(source => source.id));
        if (knownSources.size !== batch.sources.length) issue('duplicate-source', batch.batchId, batch.batchId);
        const sourceRows = new Map([...knownSources].map(sourceId => [sourceId, { batchId: batch.batchId, sourceId, itemIds: [] as string[], claimIds: [] as string[] }]));
        sources.push(...sourceRows.values());
        const claims = new Map(batch.claimProvenance.map(claim => [claim.claimId, claim]));
        if (claims.size !== batch.claimProvenance.length) issue('duplicate-claim', batch.batchId, batch.batchId);
        const expectedIds = new Set<string>();
        const record = (item: CoverageItem, expected: ExpectedClaim[]) => {
            items.push(item);
            if (!item.sourceIds.length) issue('item-without-source', item.id, batch.batchId);
            if (!item.competencyIds.length) issue('item-without-competency', item.id, batch.batchId);
            for (const id of item.competencyIds) if (!batch.competencyIds.includes(id)) issue('unknown-item-competency', item.id, batch.batchId);
            for (const id of item.sourceIds) {
                if (!knownSources.has(id)) issue('unknown-item-source', item.id, batch.batchId);
                else sourceRows.get(id)!.itemIds.push(item.id);
            }
            item.expectedClaimIds = expected.map(claim => claim.claimId);
            expectedClaims += expected.length;
            for (const expectedClaim of expected) {
                expectedIds.add(expectedClaim.claimId);
                const claim = claims.get(expectedClaim.claimId);
                if (!claim) { issue('missing-claim', expectedClaim.claimId, batch.batchId); continue; }
                let valid = true;
                if (claim.claimKind !== expectedClaim.claimKind || claim.provenanceKind !== expectedClaim.provenanceKind) {
                    issue('claim-kind-mismatch', claim.claimId, batch.batchId); valid = false;
                }
                if (claim.provenanceKind === 'source-backed' && !claim.sourceIds.length) {
                    issue('source-backed-claim-without-source', claim.claimId, batch.batchId); valid = false;
                }
                if (claim.provenanceKind === 'authorial-distractor' && claim.sourceIds.length) {
                    issue('authorial-distractor-with-source', claim.claimId, batch.batchId); valid = false;
                }
                for (const id of claim.sourceIds) {
                    if (!knownSources.has(id)) { issue('unknown-claim-source', claim.claimId, batch.batchId); valid = false; }
                    else sourceRows.get(id)!.claimIds.push(claim.claimId);
                }
                if (valid) {
                    matchedClaims += 1;
                    if (claim.provenanceKind === 'source-backed') sourceBackedClaims += 1;
                    else authorialDistractorClaims += 1;
                }
            }
        };
        for (const activity of batch.activities) {
            const locations = occurrences.filter(location => location.activity.id === activity.id);
            if (!locations.length) issue('production-activity-without-node', activity.id, batch.batchId);
            for (const location of locations) {
                if (location.activity.provenance.contentVersion !== activity.provenance.contentVersion) issue('activity-version-mismatch', activity.id, batch.batchId);
                if (location.trackId !== batch.trackId || location.unitId !== batch.unitId) issue('activity-location-mismatch', activity.id, batch.batchId);
            }
            const interactions = activity.steps.flatMap(step => step.kind === 'interaction' ? [step.interaction] : []);
            for (const interaction of interactions) {
                const expected = interaction.type === 'multiple-choice' && interactions.length === 1
                    ? expectedMultipleChoiceClaims(activity.id, interaction.payload.options, interaction.payload.correctOptionId) : [];
                if (!expected.length) gaps.push({ code: 'unsupported-claim-binding', id: interaction.id, batchId: batch.batchId });
                record({ id: interaction.id, kind: 'practice-interaction', provenance: 'promoted', batchId: batch.batchId,
                    trackId: batch.trackId, unitId: batch.unitId, activityId: activity.id, nodeIds: locations.map(location => location.nodeId),
                    contentVersion: activity.provenance.contentVersion, competencyIds: [...interaction.competencyIds],
                    sourceIds: [...activity.provenance.sourceIds], interactionType: interaction.type,
                    evidenceKind: interaction.evidenceKind, expectedClaimIds: [] }, expected);
            }
        }
        for (const item of batch.checkpoint.items) {
            const locations = checkpointOccurrences?.filter(location => location.checkpoint.items.some(candidate => candidate.id === item.id)) ?? [];
            if (checkpointOccurrences && !locations.length) issue('checkpoint-item-without-node', item.id, batch.batchId);
            for (const location of locations) {
                if (location.trackId !== batch.trackId || location.unitId !== batch.unitId) issue('checkpoint-location-mismatch', item.id, batch.batchId);
            }
            record({ id: item.id, kind: 'checkpoint-item', provenance: 'promoted', batchId: batch.batchId,
                trackId: batch.trackId, unitId: batch.unitId, activityId: null, nodeIds: locations.map(location => location.nodeId), contentVersion: batch.contentVersion,
                competencyIds: [...item.competencyIds], sourceIds: [...item.sourceIds], interactionType: 'multiple-choice', evidenceKind: null, expectedClaimIds: [] },
            expectedMultipleChoiceClaims(item.id, item.options, item.correctOptionId));
        }
        for (const claim of batch.claimProvenance) if (!expectedIds.has(claim.claimId)) issue('orphan-claim', claim.claimId, batch.batchId);
        for (const source of sourceRows.values()) {
            source.itemIds = [...new Set(source.itemIds)]; source.claimIds = [...new Set(source.claimIds)];
            if (!source.itemIds.length && !source.claimIds.length) gaps.push({ code: 'unused-declared-source', id: source.sourceId, batchId: batch.batchId });
        }
    }
    for (const location of occurrences) {
        const { activity } = location;
        if (registered.has(activity.id)) continue;
        if (activity.provenance.contentVersion !== LEGACY_CONTENT_VERSION || !activity.competencyIds.every(id => id.startsWith(LEGACY_COMPETENCY_PREFIX))) {
            issue('unregistered-activity', activity.id); continue;
        }
        for (const step of activity.steps) {
            if (step.kind !== 'interaction') continue;
            items.push({ id: step.interaction.id, kind: 'practice-interaction', provenance: 'legacy-unmapped', batchId: null,
                trackId: location.trackId, unitId: location.unitId, activityId: activity.id, nodeIds: [location.nodeId],
                contentVersion: activity.provenance.contentVersion, competencyIds: [...activity.competencyIds], sourceIds: [...activity.provenance.sourceIds],
                interactionType: step.interaction.type, evidenceKind: step.interaction.evidenceKind, expectedClaimIds: [] });
            gaps.push({ code: 'legacy-without-editorial-mapping', id: step.interaction.id });
        }
    }
    const ids = new Set<string>();
    for (const item of items) { if (ids.has(item.id)) issue('duplicate-item', item.id); ids.add(item.id); }
    const competencyIds = new Set([...competencyDeclarations, ...items.flatMap(item => item.competencyIds)]);
    const competencies = [...competencyIds].map(id => {
        const matching = items.filter(item => item.competencyIds.includes(id));
        const evidenceKinds = [...new Set(matching.flatMap(item => item.evidenceKind ? [item.evidenceKind] : []))];
        return { id, classification: competencyDeclarations.has(id) ? 'declared' : id.startsWith(LEGACY_COMPETENCY_PREFIX) ? 'synthetic-legacy' : 'unknown',
            practiceItemIds: matching.filter(item => item.kind === 'practice-interaction').map(item => item.id),
            checkpointItemIds: matching.filter(item => item.kind === 'checkpoint-item').map(item => item.id),
            sourceIds: [...new Set(matching.flatMap(item => item.sourceIds))], evidenceKinds,
            missingAuthoredEvidenceKinds: AUTHORED_EVIDENCE_KINDS.filter(kind => !evidenceKinds.includes(kind)) };
    });
    return { summary: {
        promotedPracticeItems: items.filter(item => item.provenance === 'promoted' && item.kind === 'practice-interaction').length,
        promotedCheckpointItems: items.filter(item => item.kind === 'checkpoint-item').length,
        legacyItems: items.filter(item => item.provenance === 'legacy-unmapped').length,
        checkpointItemsWithNodes: checkpointOccurrences ? items.filter(item => item.kind === 'checkpoint-item' && item.nodeIds.length).length : null,
        declaredSources: sources.length, declaredCompetencies: competencyDeclarations.size,
        expectedClaims, matchedClaims, sourceBackedClaims, authorialDistractorClaims,
    }, issues, gaps, items, competencies, sources };
}

function expectedMultipleChoiceClaims(id: string, options: readonly { id: string }[], correctId: string): ExpectedClaim[] {
    return [
        { claimId: `${id}:prompt`, claimKind: 'prompt', provenanceKind: 'source-backed' },
        ...options.map(option => ({ claimId: option.id, claimKind: option.id === correctId ? 'correct-answer' : 'distractor', provenanceKind: option.id === correctId ? 'source-backed' : 'authorial-distractor' })),
        { claimId: `${id}:feedback:correct`, claimKind: 'feedback', provenanceKind: 'source-backed' },
        { claimId: `${id}:feedback:incorrect`, claimKind: 'feedback', provenanceKind: 'source-backed' },
    ];
}
