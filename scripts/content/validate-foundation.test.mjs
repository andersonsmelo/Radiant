import test from 'node:test';
import assert from 'node:assert/strict';
import { validateFoundation } from './validate-foundation.mjs';

test('foundation taxonomy is internally consistent', () => {
  const result = validateFoundation();

  assert.equal(result.ok, true, result.errors.join('\n'));
  assert.equal(result.summary.sourceCount, 1);
  assert.equal(result.summary.extractionJobCount, 1);
  assert.deepEqual(result.summary.sourceSlugs, [
    'fundamentos-de-radiologia-everton-costa-pinto',
  ]);
  assert.equal(result.summary.galaxyCount, 3);
  assert.equal(result.summary.planetCount, 6);
  assert.equal(result.summary.starCount, 6);
  assert.deepEqual(result.summary.galaxyIds, [
    'galaxy-anatomia',
    'galaxy-fisica',
    'galaxy-patologias',
  ]);
});

test('governance schemas expose the required contract fields', () => {
  const result = validateFoundation();

  assert.equal(result.ok, true, result.errors.join('\n'));
  assert.deepEqual(result.summary.schemaTitles, [
    'Extraction Record',
    'Classification Record',
    'Concept',
    'Format Bundle',
  ]);
});
