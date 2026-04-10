import assert from 'node:assert/strict';
import http from 'node:http';
import test from 'node:test';
import { runRemoteApiSmoke } from './remote-api-smoke.mjs';

test('remote API smoke reports DNS failures before endpoint checks', async () => {
  const summary = await runRemoteApiSmoke({
    baseUrl: 'https://api.example.invalid',
    lookup: async () => {
      throw new Error('ENOTFOUND api.example.invalid');
    },
    fetchImpl: async () => {
      throw new Error('fetch should not be called when DNS fails');
    },
  });

  assert.equal(summary.ok, false);
  assert.deepEqual(summary.checks.map((check) => check.id), ['dns']);
  assert.match(summary.checks[0].message, /ENOTFOUND/);
});

test('remote API smoke validates health, readiness and catalog contracts', async () => {
  const requestedUrls = [];
  const fetchImpl = async (url) => {
    requestedUrls.push(url);

    const payloadByPath = {
      '/health': { ok: true, service: 'radiant-api' },
      '/ready': { ok: true },
      '/v1/content/catalog': {
        version: 'test-v1',
        tracks: [{ id: 'track-1', slug: 'fundamentos', title: 'Fundamentos', lessonIds: ['lesson-1'] }],
        lessons: [{ id: 'lesson-1', slug: 'lesson-1', title: 'Lesson 1', trackId: 'track-1', order: 1 }],
      },
    };

    const path = new URL(url).pathname;
    return {
      ok: true,
      status: 200,
      headers: {
        get: () => 'application/json',
      },
      json: async () => payloadByPath[path],
    };
  };

  const summary = await runRemoteApiSmoke({
    baseUrl: 'https://api.example.test/',
    lookup: async () => ({ address: '203.0.113.10', family: 4 }),
    fetchImpl,
  });

  assert.equal(summary.ok, true);
  assert.deepEqual(summary.checks.map((check) => [check.id, check.ok]), [
    ['dns', true],
    ['health', true],
    ['ready', true],
    ['catalog', true],
  ]);
  assert.deepEqual(requestedUrls, [
    'https://api.example.test/health',
    'https://api.example.test/ready',
    'https://api.example.test/v1/content/catalog',
  ]);
});

test('remote API smoke can use a custom DNS lookup for real HTTP requests', async () => {
  const server = http.createServer((request, response) => {
    const payloadByPath = {
      '/health': { ok: true },
      '/ready': { ok: true },
      '/v1/content/catalog': {
        version: 'test-v1',
        tracks: [{ id: 'track-1', slug: 'fundamentos', title: 'Fundamentos', lessonIds: ['lesson-1'] }],
        lessons: [{ id: 'lesson-1', slug: 'lesson-1', title: 'Lesson 1', trackId: 'track-1', order: 1 }],
      },
    };

    const payload = payloadByPath[request.url];
    response.setHeader('content-type', 'application/json');
    response.end(JSON.stringify(payload ?? { ok: false }));
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));

  try {
    const { port } = server.address();
    const summary = await runRemoteApiSmoke({
      baseUrl: `http://api.example.test:${port}`,
      lookup: async () => ({ address: '127.0.0.1', family: 4 }),
    });

    assert.equal(summary.ok, true);
    assert.deepEqual(summary.checks.map((check) => check.id), ['dns', 'health', 'ready', 'catalog']);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
