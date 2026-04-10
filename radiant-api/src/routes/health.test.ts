import assert from 'node:assert/strict';
import test from 'node:test';
import Fastify from 'fastify';
import { registerHealthRoutes } from './health.js';

test('GET /health returns the service health payload', async (t) => {
    const app = Fastify();
    t.after(() => app.close());

    await registerHealthRoutes(app, {
        serviceName: 'radiant-api',
        getNow: async () => '2026-03-29T12:00:00.000Z',
    });

    const response = await app.inject({
        method: 'GET',
        url: '/health',
    });

    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.json(), {
        ok: true,
        service: 'radiant-api',
        now: '2026-03-29T12:00:00.000Z',
    });
});
