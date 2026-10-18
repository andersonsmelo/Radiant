import { auditCurriculumCoverage, type ActivityOccurrence } from './ProductionCurriculumCoverage';
import { PRODUCTION_BATCHES } from './production-batches';
import type { ProductionBatchV1 } from './ProductionBatch';

const batch = PRODUCTION_BATCHES[0];
const occurrences = (value: ProductionBatchV1): ActivityOccurrence[] => value.activities.map(activity => ({ trackId: value.trackId, unitId: value.unitId, nodeId: `node:${activity.id}`, activity }));
function audit(value: ProductionBatchV1 = batch) { return auditCurriculumCoverage([value], occurrences(value)); }

describe('matriz de cobertura editorial', () => {
    it('liga cada interação e item às competências, fontes e claims declarados', () => {
        const report = audit();
        expect(report.issues).toEqual([]);
        expect(report.summary).toMatchObject({ promotedPracticeItems: 12, promotedCheckpointItems: 10, legacyItems: 0, declaredSources: 8, expectedClaims: 154, matchedClaims: 154 });
        expect(report.competencies).toHaveLength(5);
        expect(report.competencies.map(c => c.checkpointItemIds.length)).toEqual([2, 2, 2, 2, 2]);
        expect(report.items.every(item => item.sourceIds.length > 0 && item.competencyIds.length > 0)).toBe(true);
    });
    it('detecta fonte desconhecida em item e claim', () => {
        const changed = { ...batch, checkpoint: { ...batch.checkpoint, items: batch.checkpoint.items.map((item, i) => i ? item : { ...item, sourceIds: ['source:missing'] }) }, claimProvenance: batch.claimProvenance.map((claim, i) => i ? claim : { ...claim, sourceIds: ['source:missing'] }) };
        expect(audit(changed).issues).toContainEqual(expect.objectContaining({ code: 'unknown-item-source' }));
        expect(audit(changed).issues).toContainEqual(expect.objectContaining({ code: 'unknown-claim-source' }));
    });
    it('detecta claim ausente, duplicado, órfão e com classificação incorreta', () => {
        expect(audit({ ...batch, claimProvenance: batch.claimProvenance.slice(1) }).issues).toContainEqual(expect.objectContaining({ code: 'missing-claim' }));
        expect(audit({ ...batch, claimProvenance: [...batch.claimProvenance, batch.claimProvenance[0]] }).issues).toContainEqual(expect.objectContaining({ code: 'duplicate-claim' }));
        expect(audit({ ...batch, claimProvenance: [...batch.claimProvenance, { ...batch.claimProvenance[0], claimId: 'orphan' }] }).issues).toContainEqual(expect.objectContaining({ code: 'orphan-claim' }));
        expect(audit({ ...batch, claimProvenance: batch.claimProvenance.map((claim, i) => i ? claim : { ...claim, claimKind: 'distractor' }) }).issues).toContainEqual(expect.objectContaining({ code: 'claim-kind-mismatch' }));
    });
    it('não trata referência de fonte vazia como cobertura válida', () => {
        const changed = { ...batch, claimProvenance: batch.claimProvenance.map((claim, i) => i ? claim : { ...claim, sourceIds: [] }) };
        expect(audit(changed).issues).toContainEqual(expect.objectContaining({ code: 'source-backed-claim-without-source' }));
    });
    it('detecta competência órfã e atividade promovida sem nó de jornada', () => {
        const changed = { ...batch, checkpoint: { ...batch.checkpoint, items: batch.checkpoint.items.map((item, i) => i ? item : { ...item, competencyIds: ['competency:missing'] }) } };
        expect(audit(changed).issues).toContainEqual(expect.objectContaining({ code: 'unknown-item-competency' }));
        expect(auditCurriculumCoverage([batch], []).issues).toContainEqual(expect.objectContaining({ code: 'production-activity-without-node' }));
    });
    it('detecta versão resolvida diferente da atividade promovida', () => {
        const locations = occurrences(batch);
        locations[0] = { ...locations[0], activity: { ...locations[0].activity, provenance: { ...locations[0].activity.provenance, contentVersion: 'stale' } } };
        expect(auditCurriculumCoverage([batch], locations).issues).toContainEqual(expect.objectContaining({ code: 'activity-version-mismatch' }));
    });
    it('detecta item de avaliação promovido sem nó quando a resolução é fornecida', () => {
        expect(auditCurriculumCoverage([batch], occurrences(batch), []).issues)
            .toContainEqual(expect.objectContaining({ code: 'checkpoint-item-without-node' }));
    });
    it('mantém evidência de checkpoint separada dos quatro métodos autorais', () => {
        expect(audit().items.filter(item => item.kind === 'checkpoint-item').every(item => item.evidenceKind === null)).toBe(true);
        expect(audit().competencies.every(c => c.missingAuthoredEvidenceKinds.includes('delayed-retention'))).toBe(true);
    });
    it('não transforma placeholders do legado em mapeamento curricular ou fonte clínica', () => {
        const activity = { ...batch.activities[0], id: 'activity:legacy:fixture', competencyIds: ['competency:legacy:lesson'],
            provenance: { contentVersion: 'legacy-lesson-catalog', sourceIds: ['legacy-lesson'] },
            steps: batch.activities[0].steps.map(step => step.kind === 'interaction' ? { ...step, interaction: { ...step.interaction, competencyIds: ['competency:legacy:lesson'], evidenceKind: 'legacy-lesson-recall' as const } } : step) };
        const report = auditCurriculumCoverage([], [{ trackId: 'legacy-track', unitId: 'legacy-unit', nodeId: 'legacy-node', activity }]);
        expect(report.issues).toEqual([]);
        expect(report.summary).toMatchObject({ legacyItems: 1, declaredSources: 0, matchedClaims: 0 });
        expect(report.items[0].provenance).toBe('legacy-unmapped');
        expect(report.gaps).toContainEqual(expect.objectContaining({ code: 'legacy-without-editorial-mapping' }));
    });
    it('recusa tratar uma atividade V2 não registrada como se fosse legado', () => {
        const activity = { ...batch.activities[0], id: 'activity:not-registered' };
        expect(auditCurriculumCoverage([], [{ trackId: 'x', unitId: 'u', nodeId: 'n', activity }]).issues)
            .toContainEqual(expect.objectContaining({ code: 'unregistered-activity' }));
    });

});
