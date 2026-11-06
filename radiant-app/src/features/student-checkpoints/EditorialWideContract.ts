import { AUTHORED_EVIDENCE_KINDS, type LearningActivityV2, type LearningInteractionV2 } from '../../types/learningActivity';
import type { CheckpointItemCandidateV1, ClaimProvenanceV1, EditorialWideCandidateV1 } from './EditorialCurriculumCandidate';

/**
 * Fonte do contrato amplo (ADR-2026-11-05, decisão 3). `factual-reference`
 * sustenta o fato com redação própria, sem reproduzir trecho; por isso não há
 * hash do corpo recuperado, que só fazia sentido para material adaptado.
 */
export type EditorialWideSourceV1 = Readonly<{
    id: string;
    title: string;
    publisher: string;
    url: string;
    accessedAt: string;
    use: 'cc-by-4.0' | 'factual-reference';
    licenseNote: string;
}>;

export type EditorialWideRecoveryV1 = Readonly<{
    competencyId: string;
    /** Frase-gancho que abre a recuperação guiada. */
    hook: string;
    guided: CheckpointItemCandidateV1;
    transfer: CheckpointItemCandidateV1;
}>;

export type EditorialWideContractV1 = Readonly<{
    schemaVersion: 1;
    namespace: 'rtg-2026';
    /** Um par de itens por competência, para depois de uma conferência reprovada. */
    recovery: readonly EditorialWideRecoveryV1[];
}>;

export const WIDE_ACTIVITY_FAMILIES = ['multiple-choice', 'case-decision', 'ordering', 'matching'] as const;
export const WIDE_MIN_INTERACTIONS = 3;
export const WIDE_MAX_INTERACTIONS = 8;
const SOURCE_KEYS = ['id', 'title', 'publisher', 'url', 'accessedAt', 'use', 'licenseNote'];
const PAYLOAD_KEYS: Record<string, readonly string[]> = {
    'multiple-choice': ['prompt', 'options', 'correctOptionId'],
    'case-decision': ['context', 'prompt', 'options', 'correctOptionId'],
    ordering: ['prompt', 'items', 'correctOrder'],
    matching: ['prompt', 'pairs'],
};
const filled = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;
const https = (value: string) => { try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password; } catch { return false; } };
const date = (value: unknown) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));

export function wideResponseIds(interaction: LearningInteractionV2): string[] {
    switch (interaction.type) {
        case 'multiple-choice': case 'case-decision': return interaction.payload.options.map(option => option.id);
        case 'ordering': return interaction.payload.items.map(item => item.id);
        case 'matching': return interaction.payload.pairs.map(pair => pair.id);
        default: return [];
    }
}

/** As afirmações esperadas saem da interação escrita, nunca de um gabarito paralelo. */
export function wideInteractionClaims(interaction: LearningInteractionV2, sourceIds: readonly string[]): ClaimProvenanceV1[] {
    const claims: ClaimProvenanceV1[] = [];
    const add = (claimId: string, claimKind: ClaimProvenanceV1['claimKind'], distractor = false) => claims.push({
        claimId, claimKind, provenanceKind: distractor ? 'authorial-distractor' : 'source-backed', sourceIds: distractor ? [] : sourceIds,
    });
    add(`${interaction.id}:prompt`, 'prompt');
    if (interaction.type === 'multiple-choice' || interaction.type === 'case-decision') {
        const { options, correctOptionId } = interaction.payload;
        options.forEach(option => add(option.id, option.id === correctOptionId ? 'correct-answer' : 'distractor', option.id !== correctOptionId));
    } else {
        wideResponseIds(interaction).forEach(id => add(id, 'prompt'));
        add(`${interaction.id}:answer`, 'correct-answer');
    }
    add(`${interaction.id}:feedback:correct`, 'feedback');
    add(`${interaction.id}:feedback:incorrect`, 'feedback');
    return claims;
}

export function wideActivityClaims(activity: LearningActivityV2): ClaimProvenanceV1[] {
    return activity.steps.flatMap(step => step.kind === 'presentation'
        ? [{ claimId: `${step.id}:presentation`, claimKind: 'prompt' as const, provenanceKind: 'source-backed' as const, sourceIds: activity.provenance.sourceIds }]
        : wideInteractionClaims(step.interaction, activity.provenance.sourceIds));
}

/**
 * Só o que a extensão `wide` acrescenta. Identidade única, proveniência por
 * afirmação, cobertura da conferência, resposta constante e viés de posição
 * continuam no contrato genérico. Não concede nenhum dos seis aceites.
 */
export function validateEditorialWideContract(candidate: EditorialWideCandidateV1): string[] {
    const { wide } = candidate;
    const issues: string[] = [];
    const add = (code: string, id?: string) => issues.push(id ? `${code}:${id}` : code);
    if (wide.schemaVersion !== 1 || wide.namespace !== 'rtg-2026' || !Array.isArray(wide.recovery)) add('invalid-wide-envelope');
    if ((candidate as { pilot?: unknown }).pilot !== undefined) add('conflicting-contract-extensions');
    const identity = (value: string) => {
        if (typeof value !== 'string' || !/^[a-z-]+:rtg-2026:[a-z0-9-]+(?::[a-z0-9-]+)*$/.test(value)) add('invalid-wide-identity', String(value));
    };
    [candidate.trackId, candidate.unitId, candidate.checkpoint.id, ...candidate.competencyIds,
        ...candidate.sources.map(source => source.id)].forEach(identity);
    if (!/^rtg-2026-[a-z0-9.-]+$/.test(candidate.contentVersion)) add('invalid-wide-version');
    const sourceIds = new Set(candidate.sources.map(source => source.id));
    const sources = (ids: readonly string[]) => Array.isArray(ids) && ids.length > 0 && new Set(ids).size === ids.length && ids.every(id => sourceIds.has(id));
    const competencies = new Set(candidate.competencyIds);
    const competency = (ids: readonly string[]) => Array.isArray(ids) && ids.length === 1 && competencies.has(ids[0]);
    for (const source of candidate.sources) {
        if (Object.keys(source).some(key => !SOURCE_KEYS.includes(key))
            || !filled(source.title) || !filled(source.publisher) || !filled(source.licenseNote)
            || !filled(source.url) || !https(source.url) || !date(source.accessedAt)
            || (source.use !== 'cc-by-4.0' && source.use !== 'factual-reference')) add('invalid-source-metadata', source.id);
    }
    for (const activity of candidate.activities) {
        identity(activity.id);
        const interactions = activity.steps.flatMap(step => step.kind === 'interaction' ? [step.interaction] : []);
        activity.steps.forEach(step => identity(step.kind === 'interaction' ? step.interaction.id : step.id));
        if (interactions.length < WIDE_MIN_INTERACTIONS || interactions.length > WIDE_MAX_INTERACTIONS) add('invalid-wide-interaction-count', activity.id);
        if (!competency(activity.competencyIds) || !sources(activity.provenance.sourceIds)) add('invalid-activity-contract', activity.id);
        for (const interaction of interactions) {
            const allowed = PAYLOAD_KEYS[interaction.type];
            if (!WIDE_ACTIVITY_FAMILIES.some(type => type === interaction.type) || !allowed) { add('unsupported-activity-family', activity.id); continue; }
            wideResponseIds(interaction).forEach(identity);
            if (!competency(interaction.competencyIds) || interaction.competencyIds[0] !== activity.competencyIds[0]
                || !AUTHORED_EVIDENCE_KINDS.some(kind => kind === interaction.evidenceKind)) add('invalid-activity-contract', activity.id);
            if (interaction.completionRule !== 'confirmed') add('unconfirmed-wide-interaction', interaction.id);
            const labels: unknown[] = interaction.type === 'ordering' ? interaction.payload.items.map(item => item.label)
                : interaction.type === 'matching' ? interaction.payload.pairs.flatMap(pair => [pair.left, pair.right])
                    : interaction.type === 'multiple-choice' || interaction.type === 'case-decision' ? interaction.payload.options.map(option => option.label) : [];
            const choiceImages = (interaction.type === 'multiple-choice' || interaction.type === 'case-decision')
                && interaction.payload.options.some(option => option.imageRef !== undefined);
            if (Object.keys(interaction.payload).some(key => !allowed.includes(key)) || choiceImages
                || labels.some(label => !filled(label))) add('unsupported-wide-payload', interaction.id);
        }
    }
    for (const item of candidate.checkpoint.items) { identity(item.id); item.options.forEach(option => identity(option.id)); }
    for (const id of candidate.competencyIds) {
        const entries = wide.recovery.filter(entry => entry.competencyId === id);
        if (entries.length !== 1) add('missing-wide-recovery', id);
    }
    for (const entry of wide.recovery) {
        const valid = competencies.has(entry.competencyId) && filled(entry.hook) && [entry.guided, entry.transfer].every(item => item
            && competency(item.competencyIds) && item.competencyIds[0] === entry.competencyId && sources(item.sourceIds)
            && filled(item.prompt) && filled(item.feedback?.correct) && filled(item.feedback?.incorrect)
            && Array.isArray(item.options) && item.options.length >= 2 && item.options.every(option => filled(option.label))
            && item.options.some(option => option.id === item.correctOptionId));
        if (!valid) { add('invalid-wide-recovery', entry.competencyId); continue; }
        for (const item of [entry.guided, entry.transfer]) { identity(item.id); item.options.forEach(option => identity(option.id)); }
    }
    return issues;
}
