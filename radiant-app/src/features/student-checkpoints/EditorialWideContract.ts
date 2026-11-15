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

/** Imagem de acervo aberto. O crédito do autor e a licença viajam com o lote. */
export type EditorialLicensedImageV1 = Readonly<{
    id: string;
    file: string;
    sourcePage: string;
    author: string;
    license: string;
    licenseUrl: string;
    retrievedAt: string;
    sha256Original: string;
    sha256Asset: string;
    modification: string;
    alt: string;
    width: number;
    height: number;
}>;

export type EditorialWideContractV1 = Readonly<{
    schemaVersion: 1;
    namespace: 'rtg-2026';
    /** Um par de itens por competência, para depois de uma conferência reprovada. */
    recovery: readonly EditorialWideRecoveryV1[];
    /** Só as imagens que alguma comparação desta unidade usa. */
    images?: readonly EditorialLicensedImageV1[];
}>;

export const WIDE_ACTIVITY_FAMILIES = ['multiple-choice', 'case-decision', 'ordering', 'matching', 'comparison',
    'cloze', 'true-false', 'categorize', 'multi-select'] as const;
export const WIDE_MIN_INTERACTIONS = 3;
export const WIDE_MAX_INTERACTIONS = 8;
const SOURCE_KEYS = ['id', 'title', 'publisher', 'url', 'accessedAt', 'use', 'licenseNote'];
const PAYLOAD_KEYS: Record<string, readonly string[]> = {
    'multiple-choice': ['prompt', 'options', 'correctOptionId'],
    'case-decision': ['context', 'prompt', 'options', 'correctOptionId'],
    ordering: ['prompt', 'items', 'correctOrder'],
    matching: ['prompt', 'pairs'],
    comparison: ['prompt', 'options', 'correctOptionId'],
    cloze: ['prompt', 'segments', 'blanks', 'tokens'],
    'true-false': ['prompt', 'statements'],
    categorize: ['prompt', 'categories', 'items'],
    'multi-select': ['prompt', 'options', 'correctOptionIds'],
};
// Autorização do dono: CC0 ou CC BY, nunca SA, NC ou ND (ADR-2026-11-05, complemento de 2026-11-06).
const ALLOWED_IMAGE_LICENSE = /^(CC0 1\.0|CC BY \d\.\d)$/;
const SHA256 = /^[0-9a-f]{64}$/;
const filled = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;
const https = (value: string) => { try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password; } catch { return false; } };
const date = (value: unknown) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));

const normalized = (value: string) => value.trim().toLocaleLowerCase('pt-BR');
/** "A certa não é sempre a mais longa", na régua da múltipla escolha do verificador: até 1,2× o maior distrator. */
const longestIsCorrect = (correct: readonly string[], others: readonly string[]) =>
    correct.length > 0 && others.length > 0 && Math.max(...correct.map(label => label.length)) > Math.max(...others.map(label => label.length)) * 1.2;

/**
 * A sequência de grupos na tela entrega a resposta pela posição? Sim quando os
 * itens vêm em blocos contíguos (AABB) ou num ciclo que se repete (ABAB, CBACBA):
 * quem acerta o começo deduz o resto.
 */
export function isGroupOrderBiased(groups: readonly string[], groupCount: number): boolean {
    const changes = groups.slice(1).filter((group, index) => group !== groups[index]).length;
    const periodic = Array.from({ length: Math.floor(groups.length / 2) }, (_, index) => index + 1)
        .some(period => groups.every((group, index) => index < period || group === groups[index - period]));
    return changes <= groupCount - 1 || periodic;
}

/**
 * As garantias das famílias de escolha (resposta constante, viés de posição,
 * correta mais longa, retorno de erro próprio) aplicadas às famílias da 1.6.
 */
function newFamilyIssues(interaction: LearningInteractionV2): string[] {
    const codes: string[] = [];
    if (interaction.type === 'cloze') {
        const { segments, blanks, tokens } = interaction.payload;
        const answers = blanks.map(blank => blank.correctTokenId);
        const labels = new Set(tokens.map(token => normalized(token.label)));
        if (blanks.length < 1 || blanks.length > 2 || segments.length !== blanks.length + 1 || tokens.length - blanks.length < 2
            || tokens.length - blanks.length > 4 || labels.size !== tokens.length) codes.push('invalid-wide-shape');
        if (answers.every((tokenId, index) => tokens[index]?.id === tokenId)) codes.push('wide-answer-position-bias');
        if (longestIsCorrect(tokens.filter(token => answers.includes(token.id)).map(token => token.label),
            tokens.filter(token => !answers.includes(token.id)).map(token => token.label))) codes.push('wide-longest-is-correct');
    } else if (interaction.type === 'true-false') {
        const { statements } = interaction.payload;
        if (statements.length < 3 || statements.length > 4 || new Set(statements.map(statement => normalized(statement.text))).size !== statements.length
            || new Set(statements.map(statement => normalized(statement.explanation))).size !== statements.length) codes.push('invalid-wide-shape');
        if (statements.every(statement => statement.isTrue === statements[0]?.isTrue)) codes.push('wide-constant-answer');
        else if (longestIsCorrect(statements.filter(statement => statement.isTrue).map(statement => statement.text),
            statements.filter(statement => !statement.isTrue).map(statement => statement.text))) codes.push('wide-longest-is-correct');
    } else if (interaction.type === 'categorize') {
        const { categories, items } = interaction.payload;
        if (categories.length < 2 || categories.length > 3 || items.length < 4 || items.length > 6
            || categories.some(category => !items.some(item => item.categoryId === category.id))
            || new Set(items.map(item => normalized(item.label))).size !== items.length) codes.push('invalid-wide-shape');
        // Em blocos contíguos, a posição entrega o grupo.
        if (isGroupOrderBiased(items.map(item => item.categoryId), categories.length)) codes.push('wide-answer-position-bias');
        if (items.some(item => categories.some(category => normalized(item.label).includes(normalized(category.label))))) codes.push('wide-label-gives-answer');
    } else if (interaction.type === 'multi-select') {
        const { options, correctOptionIds } = interaction.payload;
        if (options.length < 4 || options.length > 6 || new Set(options.map(option => normalized(option.label))).size !== options.length
            || options.some(option => !filled(option.explanation))
            || new Set(options.map(option => normalized(option.explanation ?? ''))).size !== options.length) codes.push('invalid-wide-shape');
        if (correctOptionIds.length < 2 || correctOptionIds.length > options.length - 1) codes.push('wide-constant-answer');
        if (options.slice(0, correctOptionIds.length).every(option => correctOptionIds.includes(option.id))) codes.push('wide-answer-position-bias');
        if (longestIsCorrect(options.filter(option => correctOptionIds.includes(option.id)).map(option => option.label),
            options.filter(option => !correctOptionIds.includes(option.id)).map(option => option.label))) codes.push('wide-longest-is-correct');
    } else {
        return codes;
    }
    if (normalized(interaction.feedback.correct) === normalized(interaction.feedback.incorrect)) codes.push('wide-feedback-not-distinct');
    return codes;
}

/** Licença permitida e crédito completo. O gerador aplica a todo o cadastro, usado ou não. */
export function isValidLicensedImage(image: EditorialLicensedImageV1): boolean {
    return ALLOWED_IMAGE_LICENSE.test(image.license) && filled(image.file) && filled(image.author) && filled(image.alt)
        && filled(image.modification) && filled(image.sourcePage) && https(image.sourcePage)
        && filled(image.licenseUrl) && https(image.licenseUrl) && date(image.retrievedAt)
        && SHA256.test(image.sha256Original) && SHA256.test(image.sha256Asset)
        && image.width > 0 && image.height > 0;
}

export function wideResponseIds(interaction: LearningInteractionV2): string[] {
    switch (interaction.type) {
        case 'multiple-choice': case 'case-decision': case 'comparison': return interaction.payload.options.map(option => option.id);
        case 'ordering': return interaction.payload.items.map(item => item.id);
        case 'matching': return interaction.payload.pairs.map(pair => pair.id);
        case 'cloze': return [...interaction.payload.blanks.map(blank => blank.id), ...interaction.payload.tokens.map(token => token.id)];
        case 'true-false': return interaction.payload.statements.map(statement => statement.id);
        case 'categorize': return [...interaction.payload.categories.map(category => category.id), ...interaction.payload.items.map(item => item.id)];
        case 'multi-select': return interaction.payload.options.map(option => option.id);
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
    if (interaction.type === 'multiple-choice' || interaction.type === 'case-decision' || interaction.type === 'comparison') {
        const { options, correctOptionId } = interaction.payload;
        options.forEach(option => add(option.id, option.id === correctOptionId ? 'correct-answer' : 'distractor', option.id !== correctOptionId));
    } else if (interaction.type === 'multi-select') {
        const correct = new Set(interaction.payload.correctOptionIds);
        interaction.payload.options.forEach(option => add(option.id, correct.has(option.id) ? 'correct-answer' : 'distractor', !correct.has(option.id)));
    } else if (interaction.type === 'true-false') {
        // A afirmação errada é redação do autor, como o distrator; só a certa cita a fonte.
        interaction.payload.statements.forEach(statement => add(statement.id, statement.isTrue ? 'prompt' : 'distractor', !statement.isTrue));
        add(`${interaction.id}:answer`, 'correct-answer');
    } else if (interaction.type === 'cloze') {
        // A palavra que completa a frase é afirmação da fonte; a que sobra no banco é distrator autoral.
        const answers = new Set(interaction.payload.blanks.map(blank => blank.correctTokenId));
        interaction.payload.blanks.forEach(blank => add(blank.id, 'prompt'));
        interaction.payload.tokens.forEach(token => add(token.id, answers.has(token.id) ? 'correct-answer' : 'distractor', !answers.has(token.id)));
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
    const images = wide.images ?? [];
    const registeredImages = new Set(images.map(image => image.id));
    const usedImages = new Set<string>();
    for (const image of images) {
        identity(image.id);
        if (!isValidLicensedImage(image)) add('invalid-licensed-image', image.id);
    }
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
            if (interaction.type === 'comparison') {
                interaction.payload.options.forEach(option => { if (option.imageRef) usedImages.add(option.imageRef); });
                if (interaction.payload.options.some(option => !option.imageRef || !registeredImages.has(option.imageRef))) add('unregistered-licensed-image', interaction.id);
            }
            const labels: unknown[] = interaction.type === 'ordering' ? interaction.payload.items.map(item => item.label)
                : interaction.type === 'matching' ? interaction.payload.pairs.flatMap(pair => [pair.left, pair.right])
                    : interaction.type === 'multiple-choice' || interaction.type === 'case-decision' || interaction.type === 'comparison'
                        || interaction.type === 'multi-select' ? interaction.payload.options.map(option => option.label)
                        : interaction.type === 'cloze' ? interaction.payload.tokens.map(token => token.label)
                            : interaction.type === 'true-false' ? interaction.payload.statements.map(statement => statement.text)
                                : interaction.type === 'categorize' ? [...interaction.payload.categories.map(category => category.label), ...interaction.payload.items.map(item => item.label)] : [];
            const choiceImages = (interaction.type === 'multiple-choice' || interaction.type === 'case-decision')
                && interaction.payload.options.some(option => option.imageRef !== undefined);
            newFamilyIssues(interaction).forEach(code => add(code, interaction.id));
            if (Object.keys(interaction.payload).some(key => !allowed.includes(key)) || choiceImages
                || labels.some(label => !filled(label))) add('unsupported-wide-payload', interaction.id);
        }
    }
    for (const id of registeredImages) if (!usedImages.has(id)) add('unused-licensed-image', id);
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
