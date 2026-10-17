import type { QuizQuestion } from '../../../types/quiz';
import type { LearningActivityV2 } from '../../../types/learningActivity';
import type { CheckpointItemCandidateV1 } from '../../student-checkpoints/EditorialCurriculumCandidate';
import { itemKey, type ItemCard, type ItemIdentity, type ItemAttempt } from '../../../types/itemReview';
import { itemReviewRepository, type ItemReviewRepository } from '../repositories/ItemReviewRepository';
import { SR_SAFETY_CAPS } from '../../../constants/spacedRepetition';

export type ReviewItem = { lessonId: string; question: QuizQuestion; card?: ItemCard };
export type ItemDefinition = { item: ItemIdentity; question: QuizQuestion };
export type ReviewCatalogPort = { definitions(lessonId: string): ItemDefinition[] };

// Resolução tardia: importar a agenda pura não inicializa catálogo, sync ou módulos nativos.
const catalog: ReviewCatalogPort = {
    definitions(lessonId) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { ProductionCurriculumCatalog } = require('../../student-checkpoints/ProductionCurriculumCatalog');
        const checkpoint = ProductionCurriculumCatalog.getCheckpointByNodeId(lessonId);
        const batch = ProductionCurriculumCatalog.getBatchByCheckpointNodeId(lessonId);
        if (checkpoint && batch) return checkpoint.items.map((item: CheckpointItemCandidateV1) => ({
            item: { lessonId, itemId: item.id,
                activityId: batch.activities.find((activity: LearningActivityV2) => activity.competencyIds.includes(item.competencyIds[0]))?.id ?? batch.batchId,
                competencyId: item.competencyIds[0], contentVersion: batch.contentVersion, evidenceKind: 'independent-recall' },
            question: { id: item.id, type: 'multiple-choice' as const, prompt: item.prompt,
                options: item.options.map(option => ({ label: option.label })),
                correctAnswerIndex: item.options.findIndex(option => option.id === item.correctOptionId), explanation: item.feedback.correct },
        }));
        const activity = ProductionCurriculumCatalog.getActivityById(lessonId) as LearningActivityV2 | null;
        if (activity) return activity.steps.flatMap(step => {
            if (step.kind !== 'interaction' || step.interaction.type !== 'multiple-choice') return [];
            const interaction = step.interaction;
            return [{ item: { lessonId, activityId: activity.id, itemId: interaction.id,
                competencyId: interaction.competencyIds[0], contentVersion: activity.provenance.contentVersion, evidenceKind: interaction.evidenceKind },
                question: { id: interaction.id, type: 'multiple-choice' as const, prompt: interaction.payload.prompt,
                    options: interaction.payload.options.map(option => ({ label: option.label })),
                    correctAnswerIndex: interaction.payload.options.findIndex(option => option.id === interaction.payload.correctOptionId), explanation: interaction.feedback.correct } }];
        });
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { LessonCatalogService } = require('../../content/services/LessonCatalogService');
        return (LessonCatalogService.getReviewQuestionsForLesson(lessonId) ?? []).map((question: QuizQuestion) => ({ question,
            item: { lessonId, itemId: question.id, activityId: `activity:legacy:review:${lessonId}`, competencyId: `competency:legacy:${lessonId}`, contentVersion: 'legacy-lesson-catalog', evidenceKind: 'legacy-lesson-recall' },
        }));
    },
};

export class ItemReviewCoordinator {
    constructor(private readonly repository: ItemReviewRepository, private readonly catalog: ReviewCatalogPort) {}
    async loadQueue(legacyCards: { lessonId: string; nextReviewAt: Date }[], now: Date = new Date()): Promise<ReviewItem[]> {
        const definitions = new Map<string, ItemDefinition[]>();
        const byItem = new Map<string, ItemDefinition>();
        const resolve = (lessonId: string) => {
            if (!definitions.has(lessonId)) {
                const entries = this.catalog.definitions(lessonId);
                definitions.set(lessonId, entries);
                entries.forEach(entry => byItem.set(itemKey(entry.item), entry));
            }
            return definitions.get(lessonId)!;
        };
        const previous = await this.repository.inspect();
        if (!previous.readable) throw new Error('review-store-unavailable');
        const managed = new Set(previous.cards.map(card => card.item.lessonId));
        // Janela de 50 lições por abertura, um commit atômico. Presença dos itens
        // é o cursor durável; um retry pega somente o lote ainda não persistido.
        const groups: { items: ItemIdentity[]; dueAt: string }[] = [];
        const pending = legacyCards.filter(card => !managed.has(card.lessonId) && Number.isFinite(card.nextReviewAt.getTime()))
            .sort((a, b) => a.nextReviewAt.getTime() - b.nextReviewAt.getTime());
        for (const card of pending) {
            const items = resolve(card.lessonId).map(definition => definition.item);
            if (items.length) groups.push({ items, dueAt: card.nextReviewAt.toISOString() });
            if (groups.length === 50) break;
        }
        if (groups.length && !await this.repository.seedLegacyGroups(groups, now.toISOString())) throw new Error('review-store-unavailable');

        const snapshot = await this.repository.inspect();
        if (!snapshot.readable) throw new Error('review-store-unavailable');
        const cards = snapshot.cards;
        const due = cards.filter(card => Date.parse(card.dueAt) <= now.getTime())
            .sort((a, b) => Date.parse(a.dueAt) - Date.parse(b.dueAt) || itemKey(a.item).localeCompare(itemKey(b.item)));
        const queue: ReviewItem[] = [];
        for (const card of due) {
            resolve(card.item.lessonId);
            const definition = byItem.get(itemKey(card.item));
            if (definition) queue.push({ lessonId: card.item.lessonId, question: definition.question, card });
            if (queue.length === SR_SAFETY_CAPS.MAX_CARDS_PER_SESSION) break;
        }
        return queue;
    }
    async effectiveSchedule(legacy: { lessonId: string; dueAtMs: number }[]) {
        const result = new Map(legacy.map(entry => [entry.lessonId, entry]));
        const minimum = new Map<string, number>();
        const definitions = new Map<string, Set<string>>();
        for (const card of await this.repository.getCards()) {
            result.delete(card.item.lessonId);
            if (!definitions.has(card.item.lessonId)) definitions.set(card.item.lessonId, new Set(this.catalog.definitions(card.item.lessonId).map(entry => itemKey(entry.item))));
            if (!definitions.get(card.item.lessonId)!.has(itemKey(card.item))) continue;
            minimum.set(card.item.lessonId, Math.min(minimum.get(card.item.lessonId) ?? Infinity, Date.parse(card.dueAt)));
        }
        for (const [lessonId, dueAtMs] of minimum) result.set(lessonId, { lessonId, dueAtMs });
        return [...result.values()].sort((a, b) => a.dueAtMs - b.dueAtMs);
    }
    async dueCount(legacy: { lessonId: string; dueAtMs: number }[], now: Date) {
        if (!(await this.repository.inspect()).readable) {
            return Math.min(SR_SAFETY_CAPS.MAX_CARDS_PER_SESSION, legacy.filter(entry => entry.dueAtMs <= now.getTime()).length);
        }
        const managed = new Set((await this.repository.getCards()).map(card => card.item.lessonId));
        const current = await this.loadQueue([], now);
        const fallback = legacy.filter(entry => !managed.has(entry.lessonId) && entry.dueAtMs <= now.getTime()).length;
        return Math.min(SR_SAFETY_CAPS.MAX_CARDS_PER_SESSION, current.length + fallback);
    }
    async recordReview(item: ReviewItem, correct: boolean, now: Date = new Date()) {
        if (!item.card || !this.catalog.definitions(item.lessonId).some(definition => itemKey(definition.item) === itemKey(item.card!.item))) return { accepted: false, duplicate: false };
        const attempt: ItemAttempt = {
            attemptId: `review:${Date.parse(item.card.dueAt)}`, item: item.card.item, firstOutcome: correct ? 'correct' : 'incorrect',
            finalOutcome: correct ? 'correct' : 'incorrect', hintUsed: true, mode: 'self-review', durationBand: 'unknown', recordedAt: now.toISOString(),
        };
        return this.repository.record(attempt, item.card.dueAt);
    }
    async recordAnswer(item: ReviewItem, answerIndex: number | null, now: Date = new Date()) {
        const definition = item.card && this.catalog.definitions(item.lessonId).find(entry => itemKey(entry.item) === itemKey(item.card!.item));
        if (!item.card || !definition || (answerIndex !== null && (!Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex >= definition.question.options.length))) {
            return { accepted: false, duplicate: false, correct: false, assisted: answerIndex === null };
        }
        const correct = answerIndex === definition.question.correctAnswerIndex;
        const outcome = answerIndex === null ? 'skipped' : correct ? 'correct' : 'incorrect';
        const attempt: ItemAttempt = { attemptId: `review:${Date.parse(item.card.dueAt)}`, item: definition.item,
            firstOutcome: outcome, finalOutcome: outcome, hintUsed: answerIndex === null, mode: 'review-answer',
            durationBand: 'unknown', recordedAt: now.toISOString(),
            review: { previousReviewedAt: item.card.lastReviewedAt, scheduledDueAt: item.card.dueAt, hasPriorAttempt: item.card.lastAttemptId !== null } };
        return { ...await this.repository.record(attempt, item.card.dueAt), correct, assisted: answerIndex === null };
    }
}
export const ItemReviewService = new ItemReviewCoordinator(itemReviewRepository, catalog);

/** Identidade original da questão legada vem dos IDs das opções, preservados pelo adaptador. */
export function canonicalStudyItemId(interaction: Extract<LearningActivityV2['steps'][number], { kind: 'interaction' }>['interaction']): string {
    if (interaction.type !== 'multiple-choice' || interaction.evidenceKind !== 'legacy-lesson-recall') return interaction.id;
    const prefix = interaction.payload.options[0]?.id.split(':option:')[0];
    return prefix && interaction.payload.options.every(option => option.id.startsWith(`${prefix}:option:`)) ? prefix : interaction.id;
}
