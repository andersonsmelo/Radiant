import { MATERIA_ENERGIA_E_RADIACAO_CANDIDATE } from './EditorialCurriculumCandidate';
import {
    PRODUCTION_BATCH_APPROVAL_GATES,
    fingerprintProductionBatchMaterial,
    promoteProductionBatch,
    type ProductionBatchApprovalV1,
    type ProductionBatchDraftV1,
} from './ProductionBatch';

const materialSha256 = fingerprintProductionBatchMaterial(MATERIA_ENERGIA_E_RADIACAO_CANDIDATE);

/**
 * As seis decisões são registros independentes do mesmo aceite explícito do
 * proprietário após a revisão profissional final de 2026-08-13. A referência
 * é opaca de propósito: não carrega nome, email nem identidade do dispositivo.
 */
const approvals: readonly ProductionBatchApprovalV1[] = PRODUCTION_BATCH_APPROVAL_GATES.map((gate) => ({
    schemaVersion: 1,
    gate,
    decision: 'approved',
    reviewerRef: `review:2026-08-13:h4-final:${gate}`,
    reviewerRole: gate === 'product' ? 'project-owner' : `project-owner-assisted-${gate}-review`,
    decidedAt: '2026-08-13T19:41:13.000Z',
    materialSha256,
}));

const draft: ProductionBatchDraftV1 = {
    schemaVersion: 1,
    state: 'ready-for-promotion',
    batchId: 'production-batch:materia-energia-e-radiacao:2026-08-13',
    materialSha256,
    schemaRefs: {
        activity: 'learning-activity.v2',
        checkpoint: 'unit-checkpoint.v1',
        batch: 'production-batch.v1',
    },
    media: [],
    candidate: MATERIA_ENERGIA_E_RADIACAO_CANDIDATE,
    approvals,
};

export const MATERIA_ENERGIA_E_RADIACAO_PRODUCTION_BATCH = promoteProductionBatch(draft, {
    promotedAt: '2026-08-13T19:45:00.000Z',
    promotionRef: 'promotion:2026-08-13:owner-engineering-authorization',
});

export const PRODUCTION_BATCHES = [MATERIA_ENERGIA_E_RADIACAO_PRODUCTION_BATCH] as const;
