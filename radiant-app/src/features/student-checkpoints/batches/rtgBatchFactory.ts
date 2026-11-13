/**
 * Aula-fonte (schemaVersion 1) → lote promovido do contrato amplo.
 *
 * Módulo puro, executado pelo gerador `scripts/content/build-rtg-batches.mjs` e
 * pelos testes. O app não o importa: em produção só entram os lotes já gerados.
 * A forma da aula-fonte é conferida antes pelo verificador
 * (`scripts/content/rtg-lesson-lint.mjs`); aqui o contrato do lote decide, e
 * `promoteProductionBatch` lança com a lista de violações.
 */
import type { CheckpointItemCandidateV1, ClaimProvenanceV1, EditorialWideCandidateV1 } from '../EditorialCurriculumCandidate';
import { isGroupOrderBiased, wideInteractionClaims, type EditorialLicensedImageV1, type EditorialWideRecoveryV1 } from '../EditorialWideContract';
import {
    fingerprintProductionBatchMaterial, promoteProductionBatch, PRODUCTION_BATCH_APPROVAL_GATES,
    type ProductionBatchV1,
} from '../ProductionBatch';
import type { ProductionCatalogEntry } from '../createProductionCurriculumCatalog';
import type { EvidenceKind, LearningActivityV2, LearningInteractionV2, LearningStepV2, LessonDialogueLine } from '../../../types/learningActivity';

type RtgOption = { label: string; correct: boolean; feedback: string };
type RtgChoiceItem = { prompt: string; options: RtgOption[]; sourceIds: string[] };
type RtgInteractionBase = {
    id: string; role: 'prerequisite' | 'prediction' | 'practice' | 'transfer' | 'safety';
    criticalSafety?: boolean; prompt: string; help: string; sourceIds: string[];
};
export type RtgInteractionSource = RtgInteractionBase & (
    | { type: 'multiple-choice'; options: RtgOption[] }
    | { type: 'case-decision'; context: string; options: RtgOption[] }
    | { type: 'comparison'; options: (RtgOption & { imageId: string })[] }
    | { type: 'ordering'; items: string[]; feedbackCorrect: string; feedbackIncorrect: string }
    | { type: 'matching'; pairs: { left: string; right: string }[]; feedbackCorrect: string; feedbackIncorrect: string }
    // Famílias da 1.6 (ADR-2026-11-13). Todas têm retorno de acerto e de erro próprios.
    | { type: 'cloze'; text: string; answers: string[]; distractors: string[]; feedbackCorrect: string; feedbackIncorrect: string }
    | { type: 'true-false'; statements: { text: string; correct: boolean; feedback: string }[]; feedbackCorrect: string; feedbackIncorrect: string }
    | { type: 'categorize'; categories: string[]; items: { label: string; category: string }[]; feedbackCorrect: string; feedbackIncorrect: string }
    | { type: 'multi-select'; options: RtgOption[]; feedbackCorrect: string; feedbackIncorrect: string });
export type RtgLessonSource = {
    id: string; code: string; title: string; objective: string; competency: string; minutes?: number;
    scene: { setting: string; lines: LessonDialogueLine[] };
    concept: { title: string; body: string; keyPoints: string[] };
    interactions: RtgInteractionSource[];
    closing: { title: string; body: string; line?: LessonDialogueLine };
    checkpoint: RtgChoiceItem[];
    recovery: { guided: { hook: string; item: RtgChoiceItem }; transfer: { item: RtgChoiceItem } };
};
export type RtgUnitSource = {
    schemaVersion: 1;
    unit: { id: string; code: string; title: string; summary: string };
    sources: { id: string; title: string; publisher: string; url: string; accessedAt: string; use: 'cc-by-4.0' | 'factual-reference'; licenseNote: string }[];
    lessons: RtgLessonSource[];
};
export type RtgBatchBuild = { batch: ProductionBatchV1; presentation: ProductionCatalogEntry['presentation'] };

/** Ordem da trilha: núcleo de M01 a M14, depois os ramos, que só abrem após M14. */
export const RTG_UNIT_ORDER = [
    'm01', 'm02', 'm03', 'm04', 'm05', 'm06', 'm07', 'm08', 'm09', 'm10', 'm11', 'm12', 'm13', 'm14',
    's-tc', 's-rm', 's-md', 's-mn', 's-rt', 's-ir',
] as const;

/** Aceite por IA sob delegação (ADR-2026-11-05, decisão 1). Não é revisão por profissional da área. */
export const RTG_REVIEW = {
    reviewerRole: 'ai-review-delegated',
    reviewerRef: 'claude-fable-5.1:ADR-2026-11-05',
    decidedAt: '2026-11-06T00:00:00.000Z',
} as const;
const PROMOTION = { promotedAt: RTG_REVIEW.decidedAt, promotionRef: 'ADR-2026-11-05-delegacao-de-decisao-e-producao-ampla' };
// A conferência e a recuperação não têm retorno por alternativa no contrato do item.
const TRY_AGAIN = 'Ainda não. Releia o enunciado e compare cada alternativa com o conceito da aula.';
const FAMILY_LABEL = { comparison: 'Comparação', 'multiple-choice': 'Múltipla escolha', 'case-decision': 'Caso com decisão', ordering: 'Ordenação', matching: 'Associação',
    cloze: 'Completar a frase', 'true-false': 'Certo ou errado', categorize: 'Classificação', 'multi-select': 'Marque todas as corretas' } as const;
const EVIDENCE: Record<RtgInteractionBase['role'], EvidenceKind> = {
    prerequisite: 'independent-recall', prediction: 'guided-practice', practice: 'guided-practice',
    safety: 'guided-practice', transfer: 'applied-transfer',
};
const LETTERS = 'abcdefgh';

/**
 * Ordem de exibição estável para uma ordenação. A aula-fonte traz os itens já
 * na ordem certa; entregá-los assim responderia a questão. O embaralhamento
 * depende só da semente, para o gerador ser reprodutível, e nunca devolve a
 * ordem original.
 */
export function seededDisplayOrder<T>(values: readonly T[], seed: string): T[] {
    let state = 2166136261;
    for (let index = 0; index < seed.length; index += 1) state = Math.imul(state ^ seed.charCodeAt(index), 16777619) >>> 0;
    const next = () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296; };
    const order = [...values];
    for (let index = order.length - 1; index > 0; index -= 1) {
        const swap = Math.floor(next() * (index + 1));
        [order[index], order[swap]] = [order[swap], order[index]];
    }
    if (order.length > 1 && order.every((value, index) => value === values[index])) order.push(order.shift() as T);
    return order;
}

/**
 * Ordem de exibição da categorização: embaralhada pela semente, sem blocos por
 * grupo nem ciclo que se repita (`isGroupOrderBiased`, a mesma régua do
 * contrato). Tenta sementes derivadas até achar uma ordem aceita; com 4 a 6
 * itens em 2 ou 3 grupos sempre existe uma.
 */
export function categorizeDisplayOrder<T>(values: readonly T[], group: (value: T) => string, seed: string): T[] {
    const groupCount = new Set(values.map(group)).size;
    for (let attempt = 0; attempt < 200; attempt += 1) {
        const order = seededDisplayOrder(values, attempt ? `${seed}#${attempt}` : seed);
        if (!isGroupOrderBiased(order.map(group), groupCount)) return order;
    }
    throw new Error(`rtg-categorize-order:${seed}`);
}

/** Banco do cloze embaralhado pela semente; as respostas nunca o abrem na ordem das lacunas (viés de posição). */
export function clozeBankOrder<T extends { id: string }>(tokens: readonly T[], answers: readonly string[], seed: string): T[] {
    const shown = seededDisplayOrder(tokens, seed);
    return answers.every((tokenId, index) => shown[index]?.id === tokenId) ? [...shown.slice(1), shown[0]] : shown;
}

export function buildRtgBatch(doc: RtgUnitSource, images: readonly EditorialLicensedImageV1[] = []): RtgBatchBuild {
    const unit = doc.unit.id;
    if (!(RTG_UNIT_ORDER as readonly string[]).includes(unit)) throw new Error(`rtg-batch-unknown-unit:${unit}`);
    const id = (kind: string, ...parts: string[]) => [kind, 'rtg-2026', unit, ...parts].join(':');
    const sourceId = (value: string) => id('source', value);
    const contentVersion = `rtg-2026-${unit}-v1`; // shortcut: versão fixa; ao reescrever uma unidade já publicada, suba o sufixo aqui.
    const claims: ClaimProvenanceV1[] = [];

    const item = (itemId: string, optionScope: string, competencyId: string, source: RtgChoiceItem): CheckpointItemCandidateV1 => {
        const options = source.options.map((option, index) => ({ id: id('option', ...optionScope.split(':'), LETTERS[index]), label: option.label }));
        const correct = source.options.findIndex(option => option.correct);
        const sourceIds = source.sourceIds.map(sourceId);
        claims.push({ claimId: `${itemId}:prompt`, claimKind: 'prompt', provenanceKind: 'source-backed', sourceIds });
        options.forEach((option, index) => claims.push(index === correct
            ? { claimId: option.id, claimKind: 'correct-answer', provenanceKind: 'source-backed', sourceIds }
            : { claimId: option.id, claimKind: 'distractor', provenanceKind: 'authorial-distractor', sourceIds: [] }));
        for (const kind of ['correct', 'incorrect']) claims.push({ claimId: `${itemId}:feedback:${kind}`, claimKind: 'feedback', provenanceKind: 'source-backed', sourceIds });
        return { id: itemId, competencyIds: [competencyId], prompt: source.prompt, options, correctOptionId: options[correct]?.id ?? '',
            feedback: { correct: source.options[correct]?.feedback ?? '', incorrect: TRY_AGAIN }, sourceIds };
    };

    const activities: LearningActivityV2[] = [];
    const checkpointItems: CheckpointItemCandidateV1[] = [];
    const recovery: EditorialWideRecoveryV1[] = [];
    const competencyIds: string[] = [];
    const usedImages: EditorialLicensedImageV1[] = [];
    const licensedImage = (imageId: string) => {
        const image = images.find(entry => entry.id === imageId);
        if (!image) throw new Error(`rtg-unknown-image:${imageId}`);
        if (!usedImages.includes(image)) usedImages.push(image);
        return image;
    };

    for (const lesson of doc.lessons) {
        const slug = `aula-${lesson.id.slice(-2)}`;
        const competencyId = id('competency', slug);
        competencyIds.push(competencyId);
        const activitySources = [...new Set(lesson.interactions.flatMap(interaction => interaction.sourceIds))].map(sourceId);

        const interactionSteps = lesson.interactions.map((source): LearningStepV2 => {
            const interactionId = id('interaction', slug, source.id);
            const base = {
                id: interactionId, competencyIds: [competencyId], evidenceKind: EVIDENCE[source.role],
                completionRule: 'confirmed' as const, criticalSafety: source.criticalSafety === true,
                accessibility: { label: `${FAMILY_LABEL[source.type]}: ${source.prompt}` }, help: source.help,
            };
            let interaction: LearningInteractionV2;
            if (source.type === 'multiple-choice' || source.type === 'case-decision') {
                const options = source.options.map((option, index) => ({
                    id: id('option', slug, source.id, LETTERS[index]), label: option.label, explanation: option.feedback,
                }));
                const correct = source.options.findIndex(option => option.correct);
                const feedback = { correct: source.options[correct]?.feedback ?? '', incorrect: TRY_AGAIN };
                const correctOptionId = options[correct]?.id ?? '';
                interaction = source.type === 'case-decision'
                    ? { ...base, type: 'case-decision', feedback, payload: { context: source.context, prompt: source.prompt, options, correctOptionId } }
                    : { ...base, type: 'multiple-choice', feedback, payload: { prompt: source.prompt, options, correctOptionId } };
            } else if (source.type === 'comparison') {
                const options = source.options.map((option, index) => ({
                    id: id('option', slug, source.id, LETTERS[index]), label: option.label, explanation: option.feedback,
                    imageRef: option.imageId, imageAlt: licensedImage(option.imageId).alt,
                }));
                const correct = source.options.findIndex(option => option.correct);
                interaction = { ...base, type: 'comparison', feedback: { correct: source.options[correct]?.feedback ?? '', incorrect: TRY_AGAIN },
                    payload: { prompt: source.prompt, options, correctOptionId: options[correct]?.id ?? '' } };
            } else if (source.type === 'ordering') {
                const items = source.items.map((label, index) => ({ id: id('item', slug, source.id, String(index + 1)), label }));
                interaction = { ...base, type: 'ordering', feedback: { correct: source.feedbackCorrect, incorrect: source.feedbackIncorrect },
                    payload: { prompt: source.prompt, items: seededDisplayOrder(items, interactionId), correctOrder: items.map(entry => entry.id) } };
            } else if (source.type === 'cloze') {
                const parts = source.text.split(/\{\{\d\}\}/);
                const tokens = [...source.answers, ...source.distractors].map((label, index) => ({ id: id('token', slug, source.id, String(index + 1)), label }));
                const answers = tokens.slice(0, source.answers.length).map(token => token.id);
                const shown = clozeBankOrder(tokens, answers, interactionId);
                interaction = { ...base, type: 'cloze', feedback: { correct: source.feedbackCorrect, incorrect: source.feedbackIncorrect },
                    payload: { prompt: source.prompt, segments: parts, tokens: shown,
                        blanks: answers.map((tokenId, index) => ({ id: id('blank', slug, source.id, String(index + 1)), correctTokenId: tokenId })) } };
            } else if (source.type === 'true-false') {
                interaction = { ...base, type: 'true-false', feedback: { correct: source.feedbackCorrect, incorrect: source.feedbackIncorrect },
                    payload: { prompt: source.prompt, statements: source.statements.map((statement, index) => ({
                        id: id('statement', slug, source.id, String(index + 1)), text: statement.text, isTrue: statement.correct, explanation: statement.feedback })) } };
            } else if (source.type === 'categorize') {
                const categories = source.categories.map((label, index) => ({ id: id('group', slug, source.id, LETTERS[index]), label }));
                const items = source.items.map((item, index) => ({ id: id('item', slug, source.id, String(index + 1)), label: item.label,
                    categoryId: categories[source.categories.indexOf(item.category)]?.id ?? '' }));
                interaction = { ...base, type: 'categorize', feedback: { correct: source.feedbackCorrect, incorrect: source.feedbackIncorrect },
                    payload: { prompt: source.prompt, categories, items: categorizeDisplayOrder(items, item => item.categoryId, interactionId) } };
            } else if (source.type === 'multi-select') {
                const options = source.options.map((option, index) => ({ id: id('option', slug, source.id, LETTERS[index]), label: option.label, explanation: option.feedback }));
                interaction = { ...base, type: 'multi-select', feedback: { correct: source.feedbackCorrect, incorrect: source.feedbackIncorrect },
                    payload: { prompt: source.prompt, options, correctOptionIds: options.filter((_, index) => source.options[index].correct).map(option => option.id) } };
            } else {
                interaction = { ...base, type: 'matching', feedback: { correct: source.feedbackCorrect, incorrect: source.feedbackIncorrect },
                    payload: { prompt: source.prompt, pairs: source.pairs.map((pair, index) => ({ id: id('pair', slug, source.id, String(index + 1)), ...pair })) } };
            }
            // A afirmação cita a fonte do próprio item, que é um subconjunto das fontes da aula.
            claims.push(...wideInteractionClaims(interaction, source.sourceIds.map(sourceId)));
            return { kind: 'interaction', interaction };
        });

        const steps: LearningStepV2[] = [
            { kind: 'presentation', id: id('step', slug, 'abertura'), role: 'hook', payload: {
                // Sem `eyebrow`: o código da aula (M01.01) é de produção, e o contrato de texto não admite rótulo novo.
                title: lesson.title, body: lesson.objective,
                dialogue: { setting: lesson.scene.setting, lines: lesson.scene.lines },
            } },
            { kind: 'presentation', id: id('step', slug, 'conceito'), role: 'concept', payload: {
                title: lesson.concept.title, body: lesson.concept.body, keyPoints: lesson.concept.keyPoints,
            } },
            ...interactionSteps,
            { kind: 'presentation', id: id('step', slug, 'fecho'), role: 'closing', payload: {
                title: lesson.closing.title, body: lesson.closing.body, tone: 'positive',
                ...(lesson.closing.line ? { dialogue: { lines: [lesson.closing.line] } } : {}),
            } },
        ];
        for (const step of steps) {
            if (step.kind === 'presentation') claims.push({ claimId: `${step.id}:presentation`, claimKind: 'prompt', provenanceKind: 'source-backed', sourceIds: activitySources });
        }
        activities.push({ id: id('activity', slug), competencyIds: [competencyId], provenance: { contentVersion, sourceIds: activitySources }, steps });

        lesson.checkpoint.forEach((source, index) => {
            const key = `c${index + 1}`;
            checkpointItems.push(item(id('checkpoint-item', slug, key), `${slug}:${key}`, competencyId, source));
        });
        recovery.push({
            competencyId, hook: lesson.recovery.guided.hook,
            guided: item(id('recovery-item', slug, 'guiada'), `${slug}:rg`, competencyId, lesson.recovery.guided.item),
            transfer: item(id('recovery-item', slug, 'transferencia'), `${slug}:rt`, competencyId, lesson.recovery.transfer.item),
        });
    }

    const candidate: EditorialWideCandidateV1 = {
        schemaVersion: 1, promotionState: 'human-gates-pending',
        trackId: id('track'), unitId: id('unit'), contentVersion, competencyIds,
        sources: doc.sources.map(source => ({
            id: sourceId(source.id), title: source.title, publisher: source.publisher, url: source.url,
            accessedAt: source.accessedAt, use: source.use, licenseNote: source.licenseNote,
        })),
        activities,
        checkpoint: { id: id('checkpoint'), targetScoreBasisPoints: 8000, items: checkpointItems },
        reinforcement: { cycles: [{ cycle: 1, mode: 'guided-recovery' }, { cycle: 2, mode: 'different-context-retry' }] },
        approvals: { technical: 'pending', editorial: 'pending', accessibility: 'pending', rights: 'pending', schema: 'pending', product: 'pending' },
        claimProvenance: claims,
        wide: { schemaVersion: 1, namespace: 'rtg-2026', recovery, ...(usedImages.length ? { images: usedImages.map(({ id: imageId, file, sourcePage, author, license, licenseUrl, retrievedAt, sha256Original, sha256Asset, modification, alt, width, height }) => ({ id: imageId, file, sourcePage, author, license, licenseUrl, retrievedAt, sha256Original, sha256Asset, modification, alt, width, height })) } : {}) },
    };
    const materialSha256 = fingerprintProductionBatchMaterial(candidate);
    const batch = promoteProductionBatch({
        schemaVersion: 1, state: 'ready-for-promotion', batchId: id('batch'), materialSha256,
        schemaRefs: { activity: 'learning-activity.v2', checkpoint: 'unit-checkpoint.v1', batch: 'production-batch.v1' },
        media: [], candidate,
        approvals: PRODUCTION_BATCH_APPROVAL_GATES.map(gate => ({ schemaVersion: 1 as const, gate, decision: 'approved' as const, ...RTG_REVIEW, materialSha256 })),
    }, PROMOTION);
    return {
        batch,
        presentation: {
            slug: `rtg-2026-${unit}`, title: doc.unit.title, description: doc.unit.summary, unitTitle: doc.unit.title,
            reward: { id: `node:reward:rtg-2026:${unit}`, title: 'Unidade concluída', description: `Você concluiu a unidade ${doc.unit.title}.` },
        },
    };
}
