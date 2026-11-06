import assert from 'node:assert/strict';
import test from 'node:test';
import Fastify from 'fastify';
import { existsSync } from 'node:fs';
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

test('retirement removes lesson seeds while preserving the database schema', () => {
    for (const seed of ['002_seed_content.sql', '003_seed_editorial_catalog.sql']) {
        assert.equal(existsSync(fileURLToPath(new URL(`../../sql/${seed}`, import.meta.url))), false, seed);
    }
    assert.equal(existsSync(fileURLToPath(new URL('../../sql/001_initial_schema.sql', import.meta.url))), true);
});
