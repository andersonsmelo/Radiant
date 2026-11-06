/** Test-only abstract symbols. No clinical teaching or production registration. */
import type { EditorialCurriculumCandidateV1, ClaimProvenanceV1 } from '../../features/student-checkpoints/EditorialCurriculumCandidate';
import { fingerprintProductionBatchMaterial, promoteProductionBatch, PRODUCTION_BATCH_APPROVAL_GATES } from '../../features/student-checkpoints/ProductionBatch';
import type { LearningActivityV2 } from '../../types/learningActivity';

export { validateEditorialCurriculumCandidate } from '../../features/student-checkpoints/EditorialCurriculumCandidate';
export type { EditorialCurriculumCandidateV1 } from '../../features/student-checkpoints/EditorialCurriculumCandidate';

const fixtureNamespace = 'materia-energia-e-radiacao'; // Historical identity only, for persisted-ID regressions.
export const competencyIds = ['estrutura-atomica-e-ionizacao', 'ionizante-e-nao-ionizante', 'frequencia-comprimento-e-energia', 'raios-x-no-espectro', 'atenuacao-como-ponte'].map(id => `competency:${fixtureNamespace}:${id}`);
const sourceIds = Array.from({ length: 8 }, (_, i) => `source:h4:s${i + 1}`);
const contentVersion = 'synthetic-symbols.v1';
const feedback = { correct: 'O símbolo corresponde.', incorrect: 'Compare os símbolos novamente.' };
const options = (id: string) => ['○', '□', '△', '◇'].map((label, i) => ({ id: `${id}:option:${i}`, label }));
const competencyForActivity = (i: number) => competencyIds[i < 3 ? 0 : i < 6 ? 1 : i < 8 ? 2 : i < 10 ? 3 : 4];
const activities: LearningActivityV2[] = Array.from({ length: 12 }, (_, i) => {
    const id = `activity:${fixtureNamespace}:${String(i + 1).padStart(2, '0')}`;
    const choices = options(id);
    const competency = competencyForActivity(i);
    return {
        id, competencyIds: [competency], provenance: { contentVersion, sourceIds: [sourceIds[i % 8]] },
        steps: [
            { kind: 'presentation', id: `${id}:intro`, role: 'hook', payload: { title: `Símbolo ${i + 1}`, body: 'Observe uma forma abstrata.' } },
            { kind: 'interaction', interaction: { id: `${id}:interaction`, type: 'multiple-choice', competencyIds: [competency],
                evidenceKind: i % 2 ? (i >= 10 ? 'applied-transfer' : 'independent-recall') : 'guided-practice',
                completionRule: 'answered', criticalSafety: false, feedback, accessibility: { label: 'Escolha uma forma' },
                payload: { prompt: 'Qual símbolo ocupa a posição indicada?', options: choices, correctOptionId: choices[i % 4].id } } },
            { kind: 'presentation', id: `${id}:outro`, role: 'closing', payload: { title: 'Sequência concluída', body: 'Fim do exercício sintético.' } },
        ],
    };
});
const items = Array.from({ length: 10 }, (_, i) => {
    const id = `checkpoint:${fixtureNamespace}:item:${String(i + 1).padStart(2, '0')}`;
    const choices = options(id);
    return { id, competencyIds: [competencyIds[Math.floor(i / 2)]], prompt: `Encontre o símbolo solicitado ${i + 1}.`, options: choices,
        correctOptionId: choices[i % 4].id, feedback, sourceIds: [sourceIds[i % 8]] };
});
const claims: ClaimProvenanceV1[] = [];
function addClaims(id: string, choices: { id: string }[], correct: string, sources: string[]) {
    claims.push({ claimId: `${id}:prompt`, claimKind: 'prompt', provenanceKind: 'source-backed', sourceIds: sources });
    choices.forEach(choice => claims.push({ claimId: choice.id, claimKind: choice.id === correct ? 'correct-answer' : 'distractor',
        provenanceKind: choice.id === correct ? 'source-backed' : 'authorial-distractor', sourceIds: choice.id === correct ? sources : [] }));
    ['correct', 'incorrect'].forEach(kind => claims.push({ claimId: `${id}:feedback:${kind}`, claimKind: 'feedback', provenanceKind: 'source-backed', sourceIds: sources }));
}
activities.forEach(activity => {
    const step = activity.steps[1];
    if (step.kind !== 'interaction' || step.interaction.type !== 'multiple-choice') throw new Error('invalid synthetic fixture');
    addClaims(activity.id, step.interaction.payload.options, step.interaction.payload.correctOptionId, activity.provenance.sourceIds);
});
items.forEach(item => addClaims(item.id, item.options, item.correctOptionId, item.sourceIds));
export const MATERIA_ENERGIA_E_RADIACAO_CANDIDATE: EditorialCurriculumCandidateV1 = {
    schemaVersion: 1, promotionState: 'human-gates-pending', trackId: 'track:fundamentos-e-seguranca-radiologica',
    unitId: `unit:${fixtureNamespace}`, contentVersion, competencyIds,
    sources: sourceIds.map((id, i) => ({ id, title: `Fonte sintética ${i + 1}`, attribution: 'Fixture de teste, sem material externo',
        url: `https://example.invalid/symbols/${i}`, license: { label: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' },
        accessedAt: '2026-08-13', retrievedMaterialSha256: 'a'.repeat(64), adaptationNotice: 'Tradução/adaptação fictícia para validar o contrato.' })),
    activities, checkpoint: { id: `checkpoint:${fixtureNamespace}`, targetScoreBasisPoints: 8000, items },
    reinforcement: { cycles: [{ cycle: 1, mode: 'guided-recovery' }, { cycle: 2, mode: 'different-context-retry' }] },
    approvals: { technical: 'pending', editorial: 'pending', accessibility: 'pending', rights: 'pending', schema: 'pending', product: 'pending' }, claimProvenance: claims,
};
const materialSha256 = fingerprintProductionBatchMaterial(MATERIA_ENERGIA_E_RADIACAO_CANDIDATE);
export const MATERIA_ENERGIA_E_RADIACAO_PRODUCTION_BATCH = promoteProductionBatch({
    schemaVersion: 1, state: 'ready-for-promotion', batchId: 'production-batch:materia-energia-e-radiacao:synthetic', materialSha256,
    schemaRefs: { activity: 'learning-activity.v2', checkpoint: 'unit-checkpoint.v1', batch: 'production-batch.v1' }, media: [],
    candidate: MATERIA_ENERGIA_E_RADIACAO_CANDIDATE,
    approvals: PRODUCTION_BATCH_APPROVAL_GATES.map(gate => ({ schemaVersion: 1, gate, decision: 'approved', reviewerRef: `synthetic:${gate}`,
        reviewerRole: gate, decidedAt: '2026-08-13T20:00:00.000Z', materialSha256 })),
}, { promotedAt: '2026-08-13T20:10:00.000Z', promotionRef: 'synthetic:test-only' });
export const PRODUCTION_BATCHES = [MATERIA_ENERGIA_E_RADIACAO_PRODUCTION_BATCH];
export const PRODUCTION_CATALOG_ENTRIES = [{ batch: MATERIA_ENERGIA_E_RADIACAO_PRODUCTION_BATCH, presentation: {
    slug: 'synthetic-symbols', title: 'Símbolos sintéticos', description: 'Somente teste.', unitTitle: 'Formas abstratas',
    reward: { id: 'node:reward:materia-energia-e-radiacao', title: 'Sequência completa', description: 'Teste.' },
} }];
