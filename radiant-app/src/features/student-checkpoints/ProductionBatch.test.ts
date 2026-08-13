import {
    MATERIA_ENERGIA_E_RADIACAO_CANDIDATE,
    type EditorialCurriculumCandidateV1,
} from './EditorialCurriculumCandidate';
import {
    PRODUCTION_BATCH_APPROVAL_GATES,
    fingerprintProductionBatchMaterial,
    promoteProductionBatch,
    validateProductionBatchDraft,
    type ProductionBatchApprovalV1,
    type ProductionBatchDraftV1,
} from './ProductionBatch';

const MATERIAL_SHA256 = fingerprintProductionBatchMaterial(MATERIA_ENERGIA_E_RADIACAO_CANDIDATE);

function approval(
    gate: ProductionBatchApprovalV1['gate'],
    materialSha256 = MATERIAL_SHA256,
): ProductionBatchApprovalV1 {
    return {
        schemaVersion: 1,
        gate,
        decision: 'approved',
        reviewerRef: `reviewer:${gate}:opaque`,
        reviewerRole: gate,
        decidedAt: '2026-08-13T20:00:00.000Z',
        materialSha256,
    };
}

function draft(overrides: Partial<ProductionBatchDraftV1> = {}): ProductionBatchDraftV1 {
    return {
        schemaVersion: 1,
        state: 'ready-for-promotion',
        batchId: 'production-batch:materia-energia-e-radiacao:2026-08-13',
        materialSha256: MATERIAL_SHA256,
        schemaRefs: {
            activity: 'learning-activity.v2',
            checkpoint: 'unit-checkpoint.v1',
            batch: 'production-batch.v1',
        },
        media: [],
        candidate: MATERIA_ENERGIA_E_RADIACAO_CANDIDATE,
        approvals: PRODUCTION_BATCH_APPROVAL_GATES.map((gate) => approval(gate)),
        ...overrides,
    };
}

describe('ProductionBatchV1', () => {
    it('promove o lote inteiro e imutável somente com os seis gates vinculados ao mesmo material', () => {
        const batch = promoteProductionBatch(draft(), {
            promotedAt: '2026-08-13T20:10:00.000Z',
            promotionRef: 'promotion:owner-explicit:opaque',
        });

        expect(batch).toMatchObject({
            schemaVersion: 1,
            state: 'promoted',
            trackId: 'track:fundamentos-e-seguranca-radiologica',
            unitId: 'unit:materia-energia-e-radiacao',
            materialSha256: MATERIAL_SHA256,
            promotionRef: 'promotion:owner-explicit:opaque',
        });
        expect(batch.activities).toHaveLength(12);
        expect(batch.checkpoint.items).toHaveLength(10);
        expect(batch.approvals.map((entry) => entry.gate)).toEqual(PRODUCTION_BATCH_APPROVAL_GATES);
        expect(Object.isFrozen(batch)).toBe(true);
        expect(Object.isFrozen(batch.activities)).toBe(true);
    });

    it('recusa promoção quando um gate independente está ausente', () => {
        const withoutRights = draft({
            approvals: PRODUCTION_BATCH_APPROVAL_GATES
                .filter((gate) => gate !== 'rights')
                .map((gate) => approval(gate)),
        });

        expect(validateProductionBatchDraft(withoutRights)).toContain('missing-approval:rights');
        expect(() => promoteProductionBatch(withoutRights, {
            promotedAt: '2026-08-13T20:10:00.000Z',
            promotionRef: 'promotion:owner-explicit:opaque',
        })).toThrow('production-batch-invalid:missing-approval:rights');
    });

    it('invalida todas as decisões antigas quando o hash material muda', () => {
        const changedMaterial = draft({ materialSha256: 'b'.repeat(64) });

        expect(validateProductionBatchDraft(changedMaterial)).toEqual([
            'production-batch-material-hash-mismatch',
            ...PRODUCTION_BATCH_APPROVAL_GATES.map((gate) => `approval-material-mismatch:${gate}`),
        ]);
    });

    it('recalcula o hash do candidato e recusa conteúdo alterado com fingerprint antigo', () => {
        const changedCandidate = {
            ...MATERIA_ENERGIA_E_RADIACAO_CANDIDATE,
            activities: MATERIA_ENERGIA_E_RADIACAO_CANDIDATE.activities.map((activity, index) => index === 0
                ? {
                    ...activity,
                    steps: activity.steps.map((step, stepIndex) => stepIndex === 0 && step.kind === 'presentation'
                        ? { ...step, payload: { ...step.payload, title: 'Título materialmente alterado' } }
                        : step),
                }
                : activity),
        } as EditorialCurriculumCandidateV1;
        const changedWithOldHash = draft({ candidate: changedCandidate });

        expect(fingerprintProductionBatchMaterial(changedCandidate)).not.toBe(MATERIAL_SHA256);
        expect(validateProductionBatchDraft(changedWithOldHash)).toContain('production-batch-material-hash-mismatch');
    });

    it('recusa decisão duplicada para o mesmo gate', () => {
        const approvals = PRODUCTION_BATCH_APPROVAL_GATES.map((gate) => approval(gate));
        const duplicated = draft({ approvals: [...approvals, approval('technical')] });

        expect(validateProductionBatchDraft(duplicated)).toContain('duplicate-approval:technical');
    });
});
