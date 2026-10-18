import { writeFileSync } from 'fs';
import { ItemReviewRepository, ITEM_ATTEMPT_CAP } from './ItemReviewRepository';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import type { ItemAttempt } from '../../../types/itemReview';

// R6 (A2): mede o store de revisão com 1k e 5k cartões. Fica fora da suíte,
// porque o `testMatch` só coleta `*.test.*`; roda com
//   BENCH_OUT=<arquivo.json> npx jest --runInBand \
//     --testMatch '**/*.capacity.bench.ts' src/features/spaced-repetition
// Mede o JS no Node, não um Android de entrada: o número de aparelho é do G6.

const REPETITIONS = 5;
const ANDROID_DEFAULT_DB_BYTES = 6 * 1024 * 1024;

function memoryStorage(initial?: string) {
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
function attempt(index: number): ItemAttempt {
    const lesson = `materia-energia-e-radiacao-${String(Math.floor(index / 10)).padStart(4, '0')}`;
    return {
        attemptId: `attempt:${lesson}:${String(index).padStart(6, '0')}`,
        item: { lessonId: `lesson:${lesson}`, itemId: `interaction:${lesson}:q${index % 10}`, activityId: `activity:${lesson}:01`,
            competencyId: 'competency:fisica-das-radiacoes', contentVersion: 'v2026-10-17', evidenceKind: 'independent-recall' },
        firstOutcome: 'correct', finalOutcome: 'correct', hintUsed: false, durationBand: 'unknown',
        recordedAt: '2026-10-17T12:00:00.000Z', mode: 'study',
    };
}

async function buildStore(cards: number): Promise<string> {
    const storage = memoryStorage();
    const repository = new ItemReviewRepository(storage);
    for (let start = 0; start < cards; start += ITEM_ATTEMPT_CAP) {
        const batch = Array.from({ length: Math.min(ITEM_ATTEMPT_CAP, cards - start) }, (_, offset) => attempt(start + offset));
        const result = await repository.recordBatch(batch);
        if (!result.accepted) throw new Error(`lote recusado em ${start}`);
    }
    return storage.data.get(STORAGE_KEYS.ITEM_REVIEW) as string;
}

async function time(work: () => Promise<unknown>): Promise<number> {
    const start = performance.now();
    await work();
    return performance.now() - start;
}

function median(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    return Math.round(sorted[Math.floor(sorted.length / 2)] * 10) / 10;
}

async function measure(cards: number) {
    const raw = await buildStore(cards);
    const parsed = JSON.parse(raw) as { cards: Record<string, unknown>; attempts: unknown[] };
    const coldRead: number[] = []; const warmRead: number[] = []; const coldWrite: number[] = []; const warmWrite: number[] = [];
    for (let round = 0; round < REPETITIONS; round += 1) {
        // Leitura fria: storage novo, sem o snapshot validado em cache.
        const reader = new ItemReviewRepository(memoryStorage(raw));
        coldRead.push(await time(() => reader.getCards()));
        warmRead.push(await time(() => reader.getCards()));
        // Escrita de uma resposta: relê, valida, serializa e grava o store inteiro.
        const coldWriter = new ItemReviewRepository(memoryStorage(raw));
        coldWrite.push(await time(() => coldWriter.record(attempt(cards + round))));
        warmWrite.push(await time(() => reader.record(attempt(cards + REPETITIONS + round))));
    }
    return {
        cards: Object.keys(parsed.cards).length,
        attempts: parsed.attempts.length,
        bytes: Buffer.byteLength(raw, 'utf8'),
        shareOfAndroidDefault: Math.round((Buffer.byteLength(raw, 'utf8') / ANDROID_DEFAULT_DB_BYTES) * 1000) / 1000,
        medianMs: { coldRead: median(coldRead), warmRead: median(warmRead), coldWrite: median(coldWrite), warmWrite: median(warmWrite) },
        samplesMs: { coldRead, warmRead, coldWrite, warmWrite },
    };
}

jest.setTimeout(600000);

it('mede o store de revisão com 1k e 5k cartões', async () => {
    const results = [];
    for (const cards of [1000, 5000]) results.push(await measure(cards));
    const report = { measuredAt: new Date().toISOString(), node: process.version, repetitions: REPETITIONS, results };
    if (process.env.BENCH_OUT) writeFileSync(process.env.BENCH_OUT, `${JSON.stringify(report, null, 2)}\n`);
    console.log(JSON.stringify(report.results.map(({ samplesMs: _samples, ...rest }) => rest), null, 2));
    expect(results.map(result => result.cards)).toEqual([1000, 5000]);
});
