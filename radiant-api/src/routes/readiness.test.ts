import assert from 'node:assert/strict';
import test from 'node:test';
import Fastify from 'fastify';
import { registerReadinessRoutes } from './readiness.js';

test('GET /ready returns readiness status', async (t) => {
    const app = Fastify();
    t.after(() => app.close());

    let checked = false;
    await registerReadinessRoutes(app, {
        serviceName: 'radiant-api',
        checkReady: async () => {
            checked = true;
        },
    });

    const response = await app.inject({
        method: 'GET',
        url: '/ready',
    });

    assert.equal(response.statusCode, 200);
    assert.equal(checked, true);
    assert.deepEqual(response.json(), {
        ok: true,
        service: 'radiant-api',
        ready: true,
    });
});
