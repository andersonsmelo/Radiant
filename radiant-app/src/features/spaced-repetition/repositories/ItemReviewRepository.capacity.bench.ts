import { writeFileSync } from 'fs';
import { ItemReviewRepository } from './ItemReviewRepository';
import { attempt, buildStore, median, memoryStorage, time } from './itemReviewBenchFixtures';

// R6 (A2): mede o store de revisão com 1k e 5k cartões. Fica fora da suíte,
// porque o `testMatch` só coleta `*.test.*`; roda com
//   BENCH_OUT=<arquivo.json> npx jest --runInBand \
//     --testMatch '**/*.capacity.bench.ts' src/features/spaced-repetition
// Mede o JS no Node, não um Android de entrada: o número de aparelho é do G6.

const REPETITIONS = 5;
const ANDROID_DEFAULT_DB_BYTES = 6 * 1024 * 1024;

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
