import assert from 'node:assert/strict';
import test from 'node:test';
import Fastify from 'fastify';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { ApiCatalogLessonSummary } from '../types.js';
import { registerContentRoutes } from './content.js';

test('GET /v1/content/catalog adds metadata when upstream omits it', async (t) => {
    const app = Fastify();
    t.after(() => app.close());

    await registerContentRoutes(app, {
        getCatalog: async () => ({
            version: 'wave-1-2026-04-09',
            initialLessonId: 'lesson-1',
            tracks: [],
            lessons: [],
        }),
    });

    const response = await app.inject({
        method: 'GET',
        url: '/v1/content/catalog',
    });

    const body = response.json();

    assert.equal(response.statusCode, 200);
    assert.equal(body.version, 'wave-1-2026-04-09');
    assert.equal(body.initialLessonId, 'lesson-1');
    assert.equal(body.meta.source, 'remote');
    assert.equal(typeof body.meta.generatedAt, 'string');
});

// C1 (revisão da PR #42): `questionIndex` e `reinforceBody` deixaram de ter
// leitor no app com o motor híbrido. Saem do contrato aqui e no app juntos.
type JourneyStage = NonNullable<NonNullable<NonNullable<ApiCatalogLessonSummary['payload']>['journey']>['intro']>;
// @ts-expect-error questionIndex saiu do estágio da jornada (C1)
const stageWithIndex: JourneyStage = { questionIndex: 0 };
// @ts-expect-error reinforceBody saiu do estágio da jornada (C1)
const stageWithReinforce: JourneyStage = { reinforceBody: 'Reforço' };
void stageWithIndex;
void stageWithReinforce;

test('the content seed serves journey stages with only the fields the app reads', () => {
    const seed = readFileSync(fileURLToPath(new URL('../../sql/002_seed_content.sql', import.meta.url)), 'utf8');
    const payloads = [...seed.matchAll(/\$\$([\s\S]*?)\$\$/g)].map(([, json]) => JSON.parse(json) as {
        id: string; journey?: Record<string, Record<string, unknown>>;
    });
    assert.ok(payloads.length >= 2, `the seed parse found only ${payloads.length} payloads`);

    const stray = payloads.flatMap((payload) => Object.entries(payload.journey ?? {}).flatMap(([stage, copy]) =>
        Object.keys(copy).filter((key) => !['contextBody', 'teachBody'].includes(key)).map((key) => `${payload.id}.${stage}.${key}`)));
    assert.deepEqual(stray, []);
});
