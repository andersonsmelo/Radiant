import assert from 'node:assert/strict';
import test from 'node:test';
import Fastify from 'fastify';
import { registerBasicRateLimit } from './rateLimit.js';

test('rate limiter blocks requests above configured threshold', async (t) => {
    const app = Fastify();
    t.after(() => app.close());

    registerBasicRateLimit(app, {
        windowMs: 60_000,
        max: 2,
    });

    app.get('/limited', async () => ({ ok: true }));

    const first = await app.inject({
        method: 'GET',
        url: '/limited',
        remoteAddress: '203.0.113.10',
    });
    const second = await app.inject({
        method: 'GET',
        url: '/limited',
        remoteAddress: '203.0.113.10',
    });
    const third = await app.inject({
        method: 'GET',
        url: '/limited',
        remoteAddress: '203.0.113.10',
    });

    assert.equal(first.statusCode, 200);
    assert.equal(second.statusCode, 200);
    assert.equal(third.statusCode, 429);

    const payload = third.json();
    assert.equal(payload.error, 'rate_limit_exceeded');
    assert.ok(Number(third.headers['retry-after']) >= 1);
});

test('rate limiter can skip explicit health paths', async (t) => {
    const app = Fastify();
    t.after(() => app.close());

    registerBasicRateLimit(app, {
        windowMs: 60_000,
        max: 1,
        skipPaths: ['/health'],
    });

    app.get('/health', async () => ({ ok: true }));

    const first = await app.inject({
        method: 'GET',
        url: '/health',
        remoteAddress: '198.51.100.2',
    });
    const second = await app.inject({
        method: 'GET',
        url: '/health',
        remoteAddress: '198.51.100.2',
    });

    assert.equal(first.statusCode, 200);
    assert.equal(second.statusCode, 200);
});
