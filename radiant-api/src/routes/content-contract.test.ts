import assert from 'node:assert/strict';
import test from 'node:test';
import Fastify from 'fastify';
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
