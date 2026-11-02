import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { validateRetiredContent } from './curriculum-state.mjs';
test('retired priority tracks cannot expose old lessons', () => {
  assert.deepEqual(validateRetiredContent(fileURLToPath(new URL('../..', import.meta.url))), {
    state: 'retired', lessonCount: 0, publicationReady: false, scope: 'explicit-local-content-retirement',
  });
});
