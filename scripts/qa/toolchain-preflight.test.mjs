import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveToolchain } from './toolchain-preflight.mjs';

test('accepts the supported Node 20 runtime when npm is available beside it', () => {
  const result = resolveToolchain({
    nodeVersion: 'v20.20.2',
    npmPath: '/Users/anderson/.nvm/versions/node/v20.20.2/bin/npm',
    npmExists: () => true,
  });

  assert.deepEqual(result, {
    ok: true,
    nodeMajor: 20,
    npmAvailable: true,
  });
});

test('rejects an unsupported Node major', () => {
  assert.deepEqual(
    resolveToolchain({
      nodeVersion: 'v22.0.0',
      npmPath: '/toolchain/npm',
      npmExists: () => true,
    }),
    {
      ok: false,
      nodeMajor: 22,
      npmAvailable: true,
    }
  );
});

test('rejects a missing npm executable', () => {
  assert.deepEqual(
    resolveToolchain({
      nodeVersion: 'v20.20.2',
      npmPath: '/toolchain/npm',
      npmExists: () => false,
    }),
    {
      ok: false,
      nodeMajor: 20,
      npmAvailable: false,
    }
  );
});
