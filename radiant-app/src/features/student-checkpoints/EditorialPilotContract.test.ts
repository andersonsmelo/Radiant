import { syntheticEditorialPilot } from '../../test/fixtures/syntheticEditorialPilot';
import { validateEditorialBatchContract } from './EditorialBatchContract';
import { fingerprintProductionBatchMaterial, promoteProductionBatch, validatePromotedProductionBatch, PRODUCTION_BATCH_APPROVAL_GATES, type ProductionBatchDraftV1 } from './ProductionBatch';
import { createProductionCurriculumCatalog } from './createProductionCurriculumCatalog';

function draft(): ProductionBatchDraftV1 {
    const candidate = syntheticEditorialPilot();
    const materialSha256 = fingerprintProductionBatchMaterial(candidate);
    return { schemaVersion: 1, state: 'ready-for-promotion', batchId: 'batch:rtg-2026:synthetic:pilot',
        materialSha256, candidate, media: candidate.pilot.assets, schemaRefs: { activity: 'learning-activity.v2', checkpoint: 'unit-checkpoint.v1', batch: 'production-batch.v1' },
        approvals: PRODUCTION_BATCH_APPROVAL_GATES.map(gate => ({ schemaVersion: 1, gate, decision: 'approved', reviewerRef: 'synthetic-only',
            reviewerRole: gate, decidedAt: '2026-11-03T09:00:00Z', materialSha256 })) };
}

describe('PC05 editorial pilot extension', () => {
    it('accepts each of the five pilot families with provenance, rubric, accessible response and authorial assets', () => {
        const candidate = syntheticEditorialPilot();
        expect(candidate.activities.map(activity => activity.steps[1].kind === 'interaction' && activity.steps[1].interaction.type))
            .toEqual(['multiple-choice', 'ordering', 'hotspot', 'comparison', 'bench']);
        expect(validateEditorialBatchContract(candidate)).toEqual([]);
    });

    it.each([
        ['missing rubric', (c: any) => { c.pilot.evidence[0].successCriterion = ''; }, 'invalid-pilot-evidence'],
        ['missing critical barrier', (c: any) => { c.pilot.evidence[1].criticalErrors = []; }, 'invalid-pilot-critical-errors'],
        ['missing accessible alternative', (c: any) => { c.pilot.evidence[2].accessibleAlternative = ''; }, 'invalid-pilot-evidence'],
        ['gesture-only response', (c: any) => { c.pilot.evidence[1].responseMode = 'drag-only'; }, 'invalid-pilot-response-mode'],
        ['model without limits', (c: any) => { delete c.pilot.evidence[4].modelLimits; }, 'missing-pilot-model-limits'],
        ['unnamed comparison controls', (c: any) => { c.activities[3].steps[1].interaction.payload.options.forEach((option: any) => { option.label = ''; }); }, 'invalid-pilot-choice'],
        ['identical comparison image', (c: any) => { c.activities[3].steps[1].interaction.payload.options[1].imageRef = c.activities[3].steps[1].interaction.payload.options[0].imageRef; }, 'invalid-pilot-comparison'],
        ['comparison assets with identical bytes', (c: any) => { c.pilot.assets[1].sha256 = c.pilot.assets[0].sha256; }, 'invalid-pilot-comparison'],
        ['unlicensed asset', (c: any) => { c.pilot.assets[0].license.label = 'CC BY-NC'; }, 'invalid-pilot-asset'],
        ['unattributed asset', (c: any) => { c.pilot.assets[0].attribution = ''; }, 'invalid-pilot-asset'],
        ['undeclared image', (c: any) => { c.activities[2].steps[1].interaction.payload.imageRef = 'https://example.invalid/unknown.svg'; }, 'undeclared-pilot-asset'],
        ['orphan asset', (c: any) => { c.pilot.assets.push({ ...c.pilot.assets[0], id: 'asset:rtg-2026:synthetic:orphan', uri: 'https://example.invalid/orphan.svg' }); }, 'unused-pilot-asset'],
        ['missing factual source', (c: any) => { c.pilot.evidence[0].sourceIds = ['unknown']; }, 'invalid-pilot-evidence'],
        ['unknown review target', (c: any) => { c.pilot.evidence[0].targetId = 'activity:rtg-2026:unknown'; }, 'orphan-pilot-evidence'],
        ['missing review target', (c: any) => { c.pilot.evidence.pop(); }, 'missing-pilot-evidence'],
        ['variant attached to another target', (c: any) => { c.pilot.evidence[0].variantId += '-wrong'; }, 'invalid-pilot-variant'],
        ['duplicate variant', (c: any) => { c.pilot.evidence[1].variantId = c.pilot.evidence[0].variantId; }, 'duplicate-pilot-identity'],
        ['retired identity', (c: any) => { c.activities[0].id = 'lesson-1'; }, 'invalid-pilot-identity'],
        ['new namespace bypass', (c: any) => { c.pilot.namespace = 'legacy'; }, 'invalid-pilot-envelope'],
        ['unsupported renderer', (c: any) => { c.activities[0].steps[1].interaction.type = 'case-decision'; }, 'unsupported-activity-family'],
        ['bench disguised as choice', (c: any) => { c.activities[0].steps[1].interaction.payload.exposureImage = { label: 'Synthetic', input: { kv: 60, mas: 5 } }; }, 'unsupported-pilot-payload'],
        ['empty hotspot URI', (c: any) => { c.activities[2].steps[1].interaction.payload.imageRef = ''; }, 'undeclared-pilot-asset'],
        ['zero-area hotspot region', (c: any) => { c.activities[2].steps[1].interaction.payload.regions[0].width = 0; c.activities[2].steps[1].interaction.payload.regions[0].height = 0; }, 'invalid-pilot-regions'],
        ['repeated hotspot answer', (c: any) => { c.activities[2].steps[1].interaction.payload.correctRegionIds.push(c.activities[2].steps[1].interaction.payload.correctRegionIds[0]); }, 'invalid-pilot-regions'],
        ['invalid ordering permutation', (c: any) => { c.activities[1].steps[1].interaction.payload.correctOrder.reverse().pop(); }, 'invalid-activity'],
        ['unconfirmed practice', (c: any) => { c.activities[0].steps[1].interaction.completionRule = 'answered'; }, 'unconfirmed-pilot-interaction'],
    ])('rejects %s', (_name, mutate, code) => {
        const value = syntheticEditorialPilot(); mutate(value);
        expect(validateEditorialBatchContract(value).some(issue => issue.startsWith(code))).toBe(true);
    });

    it('requires source-backed claims for new answers, model, presentations and feedback', () => {
        for (const suffix of [':ordering:answer', ':hotspot:answer', ':bench:model', ':comparison-hook:presentation']) {
            const value = syntheticEditorialPilot();
            const claim = value.claimProvenance.find(entry => entry.claimId.endsWith(suffix));
            expect(claim).toBeDefined();
            value.claimProvenance.splice(value.claimProvenance.indexOf(claim!), 1);
            expect(validateEditorialBatchContract(value)).toContain(`missing-claim-provenance:${claim!.claimId}`);
        }
    });

    it('promotes and revalidates all metadata through the same app catalog', () => {
        const source = draft();
        const batch = promoteProductionBatch(source, { promotedAt: '2026-11-03T09:01:00Z', promotionRef: 'synthetic-only' });
        expect(validatePromotedProductionBatch(batch)).toEqual([]);
        expect(batch.pilot).toEqual(source.candidate.pilot);
        expect(batch.media).toEqual(source.media);
        const catalog = createProductionCurriculumCatalog([{ batch, presentation: { slug: 'synthetic-pilot', title: 'Synthetic', description: 'Fixture', unitTitle: 'Fixture', reward: { id: 'reward:rtg-2026:synthetic', title: 'Fixture', description: 'Fixture' } } }]);
        expect(catalog.listLessonSummaries()).toHaveLength(5);
        source.candidate.activities.forEach(activity => expect(catalog.getActivityById(activity.id)).toEqual(activity));
    });

    it('binds assets, variants, rubric, controls and model limits to approvals via the material hash', () => {
        const original = syntheticEditorialPilot();
        for (const mutate of [
            (c: any) => { c.pilot.assets[0].sha256 = 'c'.repeat(64); },
            (c: any) => { c.pilot.evidence[0].variantId += '-new'; },
            (c: any) => { c.pilot.evidence[0].successCriterion += ' changed'; },
            (c: any) => { c.pilot.evidence[4].modelLimits += ' changed'; },
        ]) {
            const changed = syntheticEditorialPilot(); mutate(changed);
            expect(fingerprintProductionBatchMaterial(changed)).not.toBe(fingerprintProductionBatchMaterial(original));
        }
        const source = draft();
        const batch = promoteProductionBatch(source, { promotedAt: '2026-11-03T09:01:00Z', promotionRef: 'synthetic-only' });
        const tampered = JSON.parse(JSON.stringify(batch)); tampered.media[0].sha256 = 'c'.repeat(64);
        expect(validatePromotedProductionBatch(tampered)).toContain('unapproved-production-batch-media');
    });
});
