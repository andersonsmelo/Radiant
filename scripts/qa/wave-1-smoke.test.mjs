import assert from 'node:assert/strict';
import test from 'node:test';
import { buildWave1Checks, runWave1Smoke } from './wave-1-smoke.mjs';

test('wave 1 smoke defines app, content and platform checks', () => {
  const checks = buildWave1Checks();
  const ids = checks.map((check) => check.id);

  assert.deepEqual(ids, [
    'documentation-contract',
    'sync-catalog-app',
    'sync-catalog-api',
    'content-foundation',
    'content-route',
    'editorial-status',
    'remote-api',
  ]);
});

test('wave 1 smoke can skip remote API checks for local-only preflight', () => {
  const checks = buildWave1Checks({ includeRemote: false });
  const ids = checks.map((check) => check.id);

  assert.deepEqual(ids, [
    'documentation-contract',
    'sync-catalog-app',
    'sync-catalog-api',
    'content-foundation',
    'content-route',
    'editorial-status',
  ]);
});

test('wave 1 smoke marks executor failures without aborting remaining checks', () => {
  const checks = buildWave1Checks({ includeRemote: false }).filter((check) =>
    ['sync-catalog-app', 'sync-catalog-api'].includes(check.id)
  );
  const results = runWave1Smoke({
    checks,
    executor: (check) => ({
      id: check.id,
      status: check.id === 'sync-catalog-api' ? 1 : 0,
      stdout: '',
      stderr: '',
    }),
  });

  assert.deepEqual(
    results.map((result) => [result.id, result.ok]),
    [
      ['sync-catalog-app', true],
      ['sync-catalog-api', false],
    ]
  );
});
