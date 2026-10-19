import { ItemReviewRepository, ITEM_ATTEMPT_CAP } from './ItemReviewRepository';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import type { ItemAttempt } from '../../../types/itemReview';
import type { QuizQuestion } from '../../../types/quiz';
import type { ItemDefinition, ReviewCatalogPort } from '../services/ItemReviewService';

// Gerador do store de revisão para medição, extraído do
// `ItemReviewRepository.capacity.bench.ts` (R6) para que o bench no Node e o
// medidor no aparelho (FILA 61) montem o mesmo store. Não importa nada do Node:
// roda no Jest e no app.

export function memoryStorage(initial?: string) {
    const data = new Map<string, string>();
    if (initial !== undefined) data.set(STORAGE_KEYS.ITEM_REVIEW, initial);
    return {
        data,
        getItem: async (key: string) => data.get(key) ?? null,
        setItem: async (key: string, value: string) => { data.set(key, value); },
        removeItem: async (key: string) => { data.delete(key); },
    };
}

// Identificadores no comprimento dos do catálogo V2 (por exemplo,
// `activity:materia-energia-e-radiacao:01`): com IDs curtos, o tamanho medido
// sairia menor que o do aparelho.
export function attempt(index: number): ItemAttempt {
    const lesson = `materia-energia-e-radiacao-${String(Math.floor(index / 10)).padStart(4, '0')}`;
    return {
        attemptId: `attempt:${lesson}:${String(index).padStart(6, '0')}`,
        item: { lessonId: `lesson:${lesson}`, itemId: `interaction:${lesson}:q${index % 10}`, activityId: `activity:${lesson}:01`,
            competencyId: 'competency:fisica-das-radiacoes', contentVersion: 'v2026-10-17', evidenceKind: 'independent-recall' },
        firstOutcome: 'correct', finalOutcome: 'correct', hintUsed: false, durationBand: 'unknown',
        recordedAt: '2026-10-17T12:00:00.000Z', mode: 'study',
    };
}

export async function buildStore(cards: number): Promise<string> {
    const storage = memoryStorage();
    const repository = new ItemReviewRepository(storage);
    for (let start = 0; start < cards; start += ITEM_ATTEMPT_CAP) {
        const batch = Array.from({ length: Math.min(ITEM_ATTEMPT_CAP, cards - start) }, (_, offset) => attempt(start + offset));
        const result = await repository.recordBatch(batch);
        if (!result.accepted) throw new Error(`lote recusado em ${start}`);
    }
    return storage.data.get(STORAGE_KEYS.ITEM_REVIEW) as string;
}

export async function time(work: () => Promise<unknown>): Promise<number> {
    const start = performance.now();
    await work();
    return performance.now() - start;
}

export function median(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    return Math.round(sorted[Math.floor(sorted.length / 2)] * 10) / 10;
}

// Catálogo que conhece exatamente os itens que `buildStore(cards)` grava: cada
// lição gerada por `attempt` vira uma definição por item, com uma pergunta de
// quatro alternativas. Sem ele, o coordenador da revisão descartaria os
// cartões como órfãos, e a medição não passaria pelo caminho do aluno.
export function benchCatalog(cards: number): ReviewCatalogPort {
    const byLesson = new Map<string, ItemDefinition[]>();
    for (let index = 0; index < cards; index += 1) {
        const { item } = attempt(index);
        const question: QuizQuestion = {
            id: item.itemId, type: 'multiple-choice', prompt: `Pergunta ${index}`,
            options: ['A', 'B', 'C', 'D'].map(label => ({ label })), correctAnswerIndex: 0, explanation: 'Explicação.',
        };
        const entries = byLesson.get(item.lessonId) ?? [];
        entries.push({ item, question });
        byLesson.set(item.lessonId, entries);
    }
    return { definitions: lessonId => byLesson.get(lessonId) ?? [] };
}

// Percentil pelo posto mais próximo: com 30 amostras, o p95 é a 29ª menor.
export function percentile(values: number[], p: number): number {
    const sorted = [...values].sort((a, b) => a - b);
    const rank = Math.min(sorted.length, Math.max(1, Math.ceil((p / 100) * sorted.length)));
    return Math.round(sorted[rank - 1] * 10) / 10;
}
