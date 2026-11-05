import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
const require = createRequire(import.meta.url);
const { withEditorialPreviewIsolation } = require('./editorial-preview-resolver.cjs');
const root = resolve(import.meta.dirname, '..');
const lab = resolve(root, 'src/features/editorial-preview/dev/EditorialPreviewLab.tsx');
const scenario = resolve(root, 'src/features/editorial-preview/dev/SyntheticCasePreview.ts');
const material = resolve(root, '../docs/evidence/2026-11-03-pc05-payloads.json');
const stub = resolve(root, 'src/features/editorial-preview/EditorialPreviewUnavailable.tsx');
for (const enabled of [false, true]) for (const dev of [false, true, undefined]) {
  test(`isolates lab, scenario and review pack with enabled=${enabled}, dev=${dev}`, () => {
    const config = withEditorialPreviewIsolation({ resolver: {} }, enabled);
    for (const filePath of [lab, scenario, material]) {
      const result = config.resolver.resolveRequest({ dev, resolveRequest: () => ({ type: 'sourceFile', filePath }) }, 'ignored', 'ios');
      assert.equal(result.filePath, dev === true && enabled ? filePath : stub);
    }
  });
}
test('composes the previous resolver and preserves unrelated modules and assets', () => {
  let calls = 0;
  const original = { type: 'assetFiles', filePaths: ['diagram.png'] };
  const config = withEditorialPreviewIsolation({ resolver: { resolveRequest: () => { calls++; return original; } } }, false);
  assert.equal(config.resolver.resolveRequest({ dev: false }, 'asset', 'android'), original);
  assert.equal(calls, 1);
});
test('actual Metro config blocks the lab in release even with opt-in', () => {
  const result = execFileSync(process.execPath, ['-e', `
    const config = require('./metro.config.js');
    const result = config.resolver.resolveRequest({ dev: false, resolveRequest: () => ({ type: 'sourceFile', filePath: ${JSON.stringify(lab)} }) }, 'lab', 'ios');
    process.stdout.write(result.filePath);
  `], { cwd: root, env: { ...process.env, STORYBOOK_ENABLED: 'false', EXPO_PUBLIC_RADIANT_EDITORIAL_PREVIEW: '1' } }).toString();
  assert.equal(result, stub);
});
