import type { LearningActivityV2 } from '../../types/learningActivity';
import type { EditorialPilotContractV1 } from './EditorialPilotContract';

type ApprovalState = 'pending' | 'approved';
type ClaimKind = 'prompt' | 'correct-answer' | 'distractor' | 'feedback';
type ClaimProvenanceKind = 'source-backed' | 'authorial-distractor';

export type EditorialSourceV1 = Readonly<{
    id: string;
    title: string;
    attribution: string;
    url: string;
    license: Readonly<{ label: 'CC BY 4.0'; url: 'https://creativecommons.org/licenses/by/4.0/' }>;
    accessedAt: string;
    /**
     * Fingerprint histórico do corpo HTTPS recuperado. Identifica a captura,
     * mas HTML dinâmico pode mudar entre requisições; não prova sozinho deriva
     * editorial nem aprovação de direitos.
     */
    retrievedMaterialSha256: string;
    adaptationNotice: string;
}>;

export type CheckpointItemCandidateV1 = Readonly<{
    id: string;
    competencyIds: readonly string[];
    prompt: string;
    options: readonly Readonly<{ id: string; label: string }>[];
    correctOptionId: string;
    feedback: Readonly<{ correct: string; incorrect: string }>;
    sourceIds: readonly string[];
}>;

export type ClaimProvenanceV1 = Readonly<{
    claimId: string;
    claimKind: ClaimKind;
    provenanceKind: ClaimProvenanceKind;
    sourceIds: readonly string[];
}>;

export type EditorialCurriculumCandidateV1 = Readonly<{
    schemaVersion: 1;
    promotionState: 'human-gates-pending';
    trackId: string;
    unitId: string;
    contentVersion: string;
    competencyIds: readonly string[];
    sources: readonly EditorialSourceV1[];
    activities: readonly LearningActivityV2[];
    checkpoint: Readonly<{ id: string; targetScoreBasisPoints: 8000; items: readonly CheckpointItemCandidateV1[] }>;
    reinforcement: Readonly<{ cycles: readonly [{ cycle: 1; mode: 'guided-recovery' }, { cycle: 2; mode: 'different-context-retry' }] }>;
    approvals: Readonly<Record<'technical' | 'editorial' | 'accessibility' | 'rights' | 'schema' | 'product', ApprovalState>>;
    claimProvenance: readonly ClaimProvenanceV1[];
    /** Explicit opt-in; absence keeps the original multiple-choice-only contract. */
    pilot?: EditorialPilotContractV1;
}>;

export { validateEditorialBatchContract as validateEditorialCurriculumCandidate } from './EditorialBatchContract';
