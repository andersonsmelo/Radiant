import test from 'node:test';
import assert from 'node:assert/strict';
import { validateFoundation } from './validate-foundation.mjs';
test('retirement validates the preserved library, schemas, media and taxonomy without active lessons', () => {
  const result = validateFoundation();
  assert.equal(result.ok, true, result.errors.join('\n'));
  assert.equal(result.summary.state, 'retired');
  assert.equal(result.summary.lessonCount, 0);
  assert.equal(result.summary.publicationReady, false);
  assert.ok(result.summary.sourceCount > 0);
});
