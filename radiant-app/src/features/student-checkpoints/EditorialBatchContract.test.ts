import { MATERIA_ENERGIA_E_RADIACAO_CANDIDATE, validateEditorialCurriculumCandidate, type EditorialCurriculumCandidateV1 } from './EditorialCurriculumCandidate';
import { fingerprintProductionBatchMaterial, promoteProductionBatch, PRODUCTION_BATCH_APPROVAL_GATES, type ProductionBatchDraftV1 } from './ProductionBatch';
import { createProductionCurriculumCatalog } from './createProductionCurriculumCatalog';

function candidate(): EditorialCurriculumCandidateV1 {
    const base = JSON.parse(JSON.stringify(MATERIA_ENERGIA_E_RADIACAO_CANDIDATE)) as EditorialCurriculumCandidateV1;
    const activities = [0, 1, 3, 4].map(index => ({ ...base.activities[index], provenance: { ...base.activities[index].provenance, contentVersion: 'synthetic-g3-v1' } }));
    const items = base.checkpoint.items.slice(0, 4).map((item, index) => {
        const options = [...item.options];
        const correct = options.splice(options.findIndex(option => option.id === item.correctOptionId), 1)[0];
        options.splice(index, 0, correct);
        return { ...item, options };
    });
    const ids = [...activities, ...items].map(item => item.id);
    return { ...base, unitId: 'unit:synthetic-g3', contentVersion: 'synthetic-g3-v1', competencyIds: base.competencyIds.slice(0, 2),
        activities, checkpoint: { ...base.checkpoint, items },
        sources: base.sources.filter(source => ['source:h4:s1', 'source:h4:s2', 'source:h4:s4', 'source:h4:s7'].includes(source.id)).map(source => ({ ...source, accessedAt: '2026-10-17' })),
        claimProvenance: base.claimProvenance.filter(claim => ids.some(id => claim.claimId.startsWith(`${id}:`))),
    };
}

describe('contrato editorial genérico G3', () => {
    it('valida lote menor, com competências e fontes declaradas, e compila pelo catálogo do app', () => {
        const material = candidate();
        expect(validateEditorialCurriculumCandidate(material)).toEqual([]);
        const hash = fingerprintProductionBatchMaterial(material);
        const draft: ProductionBatchDraftV1 = { schemaVersion: 1, state: 'ready-for-promotion', batchId: 'batch:synthetic-g3', materialSha256: hash,
            candidate: material, schemaRefs: { activity: 'learning-activity.v2', checkpoint: 'unit-checkpoint.v1', batch: 'production-batch.v1' }, media: [],
            approvals: PRODUCTION_BATCH_APPROVAL_GATES.map(gate => ({ schemaVersion: 1, gate, decision: 'approved', reviewerRef: 'synthetic-test-only', reviewerRole: gate, decidedAt: '2026-10-17T12:00:00Z', materialSha256: hash })) };
        const batch = promoteProductionBatch(draft, { promotedAt: '2026-10-17T12:00:01Z', promotionRef: 'synthetic-only' });
        const catalog = createProductionCurriculumCatalog([{ batch, presentation: { slug: 'synthetic', title: 'Synthetic', description: 'Fixture', unitTitle: 'Fixture', reward: { id: 'reward:synthetic', title: 'Fixture', description: 'Fixture' } } }]);
        expect(catalog.listLessonSummaries()).toHaveLength(4);
        expect(catalog.getActivityById(material.activities[3].id)).toEqual(material.activities[3]);
        const checkpoints = catalog.getJourneyTrackDefinition(batch.trackId)!.units[0].nodes.filter(node => node.type === 'checkpoint');
        expect(checkpoints).toHaveLength(2);
        checkpoints.forEach(node => expect(catalog.getCheckpointByNodeId(node.id)?.items).toHaveLength(2));
    });

    it('valida e promove 100 lotes independentes menores sem reutilizar identidades', () => {
        const entries = Array.from({ length: 100 }, (_, index) => {
            const material = JSON.parse(JSON.stringify(candidate())
                .replaceAll('materia-energia-e-radiacao', `synthetic-${index}`)
                .replaceAll('track:fundamentos-e-seguranca-radiologica', `track:synthetic:${index}`)
                .replaceAll('source:h4:', `source:synthetic-${index}:`)
                .replaceAll('synthetic-g3', `synthetic-unit-${index}`)) as EditorialCurriculumCandidateV1;
            const hash = fingerprintProductionBatchMaterial(material);
            const batch = promoteProductionBatch({ schemaVersion: 1, state: 'ready-for-promotion', batchId: `batch:synthetic:${index}`, materialSha256: hash,
                candidate: material, schemaRefs: { activity: 'learning-activity.v2', checkpoint: 'unit-checkpoint.v1', batch: 'production-batch.v1' }, media: [],
                approvals: PRODUCTION_BATCH_APPROVAL_GATES.map(gate => ({ schemaVersion: 1, gate, decision: 'approved', reviewerRef: 'synthetic-test-only', reviewerRole: gate, decidedAt: '2026-10-17T12:00:00Z', materialSha256: hash })) },
            { promotedAt: '2026-10-17T12:00:01Z', promotionRef: 'synthetic-test-only' });
            return { batch, presentation: { slug: `synthetic-${index}`, title: 'Fixture', description: 'Fixture', unitTitle: 'Fixture', reward: { id: `reward:synthetic:${index}`, title: 'Fixture', description: 'Fixture' } } };
        });
        const catalog = createProductionCurriculumCatalog(entries);
        expect(catalog.listTracks()).toHaveLength(100);
        expect(catalog.listLessonSummaries()).toHaveLength(400);
        for (const { batch } of entries) expect(catalog.getActivityById(batch.activities[3].id)).toEqual(batch.activities[3]);
    });

    it.each([
        ['atividade duplicada', (c: any) => c.activities.push(c.activities[0]), 'duplicate-identity'],
        ['fonte duplicada', (c: any) => c.sources.push(c.sources[0]), 'duplicate-source'],
        ['claim duplicado', (c: any) => c.claimProvenance.push(c.claimProvenance[0]), 'duplicate-claim'],
        ['claim órfão', (c: any) => c.claimProvenance.push({ ...c.claimProvenance[0], claimId: 'unknown' }), 'orphan-claim'],
        ['claim ausente', (c: any) => c.claimProvenance.shift(), 'missing-claim-provenance'],
        ['competência sem avaliação', (c: any) => { c.checkpoint.items = c.checkpoint.items.slice(0, 2); }, 'checkpoint-coverage'],
        ['competência sem prática', (c: any) => { c.activities = c.activities.slice(0, 2); }, 'activity-coverage'],
        ['competência desconhecida', (c: any) => { c.activities[0].competencyIds = ['unknown']; }, 'invalid-activity-contract'],
        ['interação adicional sem claims', (c: any) => c.activities[0].steps.push(c.activities[0].steps[1]), 'unsupported-activity-family'],
        ['gabarito inexistente', (c: any) => { c.checkpoint.items[0].correctOptionId = 'unknown'; }, 'invalid-checkpoint-item'],
        ['alternativa duplicada', (c: any) => c.checkpoint.items[0].options.push(c.checkpoint.items[0].options[0]), 'duplicate-identity'],
        ['versão divergente', (c: any) => { c.activities[0].provenance.contentVersion = 'stale'; }, 'activity-version-mismatch'],
        ['fonte sem atribuição', (c: any) => { c.sources[0].attribution = ''; }, 'invalid-source-metadata'],
        ['data impossível', (c: any) => { c.sources[0].accessedAt = '2026-02-30'; }, 'invalid-source-metadata'],
        ['origem HTTP', (c: any) => { c.sources[0].url = 'http://example.org'; }, 'invalid-source-metadata'],
        ['fonte inexistente', (c: any) => { c.activities[0].provenance.sourceIds = ['unknown']; }, 'invalid-activity-contract'],
        ['fonte diferente do item', (c: any) => { c.claimProvenance[0].sourceIds = ['source:h4:s4']; }, 'missing-claim-provenance'],
        ['aprovação interna ausente', (c: any) => { delete c.approvals.rights; }, 'human-approval-must-remain-pending'],
        ['limiar alterado', (c: any) => { c.checkpoint.targetScoreBasisPoints = 5000; }, 'invalid-checkpoint-shape'],
        ['reforço alterado', (c: any) => { c.reinforcement.cycles = []; }, 'invalid-reinforcement'],
    ])('recusa %s', (_name, mutate, issue) => {
        const value = candidate();
        mutate(value);
        expect(validateEditorialCurriculumCandidate(value).some(entry => entry.startsWith(issue))).toBe(true);
    });
});
