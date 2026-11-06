import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readCurriculumState, assertRetiredCollections, validateRetiredContent } from './curriculum-state.mjs';
const retired = { schemaVersion: 1, state: 'retired', audience: 'radiology-technologist', reason: 'content-restart-2026-11-02' };
function fixture(t, state) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'curriculum-state-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  if (state !== undefined) {
    mkdirSync(path.join(root, 'radiant-app/src/data'), { recursive: true });
    writeFileSync(path.join(root, 'radiant-app/src/data/curriculum-state.json'), JSON.stringify(state));
  }
  return root;
}
test('missing state retains normal validation, malformed retirement is rejected', t => {
  assert.equal(readCurriculumState(fixture(t)), null);
  for (const state of [{ ...retired, schemaVersion: 2 }, { ...retired, state: 'unknown' }, { ...retired, reason: '' }, { ...retired, audience: 'unknown' }]) {
    assert.throws(() => readCurriculumState(fixture(t, state)), /invalid-curriculum-state/);
  }
  assert.deepEqual(readCurriculumState(fixture(t, retired)), retired);
});
test('retirement accepts explicit empty collections and rejects data or missing arrays', () => {
  assert.doesNotThrow(() => assertRetiredCollections({ quizzes: [], lessons: [] }));
  assert.throws(() => assertRetiredCollections({ quizzes: [{}] }), /retired-content-not-empty/);
  assert.throws(() => assertRetiredCollections({ quizzes: null }), /retired-collection-missing/);
});
test('the retirement validator rejects stale governance, hidden bundles and anchored copies', t => {
  const root = fixture(t, retired);
  const source = fileURLToPath(new URL('../..', import.meta.url));
  const files = ['conteúdo/classificação/index.json', 'conteúdo/conceitos/index.json', 'conteúdo/formatos/index.json', 'conteúdo/governança/catalog-payload.json', 'conteúdo/governança/concept-graph.json', 'conteúdo/governança/learning-sequence.json', 'conteúdo/governança/wave-1-priority-tracks.json', 'conteúdo/governança/wave-1-bundle-status.json', 'content-manifest/taxonomy-catalog-map.json'];
  const write = (file, text) => { mkdirSync(path.dirname(path.join(root, file)), { recursive: true }); writeFileSync(path.join(root, file), text); };
  for (const file of files) write(file, readFileSync(path.join(source, file), 'utf8'));
  assert.equal(validateRetiredContent(root).publicationReady, false);
  const file = 'conteúdo/governança/catalog-payload.json';
  const payload = JSON.parse(readFileSync(path.join(root, file), 'utf8'));
  payload.tracks.quizzes.push({ id: 'stale' });
  write(file, JSON.stringify(payload));
  assert.throws(() => validateRetiredContent(root), /retired-content-not-empty:quizzes/);
  payload.tracks.quizzes = []; write(file, JSON.stringify(payload));
  for (const hidden of ['conteúdo/formatos/quizzes/stale/bundles.json', 'content-manifest/lessons/stale.anchored.json', 'conteúdo/governança/foundations-safety-competencies.json']) {
    write(hidden, '{}');
    assert.throws(() => validateRetiredContent(root), /retired-content-not-empty/);
    rmSync(path.join(root, hidden));
  }
});
