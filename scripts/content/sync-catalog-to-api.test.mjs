import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { buildRuntimeCatalog } from './catalog-runtime.mjs';
import { renderApiCatalogSql, run } from './sync-catalog-to-api.mjs';
const payload = { version: 'synthetic-1', tracks: { quizzes: [{ id: 'bundle:test:quizzes:shapes', title: 'Formas', aiContent: [{ question: 'Qual forma?', options: ['cubo', 'cone'], correct: 0, explanation: 'Fixture.' }] }] } };
test('runtime generation preserves generic mapping and SQL escaping', () => {
  const runtime = buildRuntimeCatalog(payload);
  assert.equal(runtime.lessons.length, 1);
  assert.equal(runtime.track.lessonIds[0], 'ai-lesson:shapes');
  const sql = renderApiCatalogSql(runtime);
  assert.match(sql, /ai-lesson:shapes/);
  assert.match(sql, /synthetic-1/);
  assert.match(sql, /insert into content_lessons/);
});
test('retirement refuses to regenerate API seed and accidental empty stays invalid', () => {
  const seed = fileURLToPath(new URL('../../radiant-api/sql/003_seed_editorial_catalog.sql', import.meta.url));
  assert.equal(existsSync(seed), false);
  assert.throws(run, /curriculum-retired/);
  assert.equal(existsSync(seed), false);
  assert.throws(() => buildRuntimeCatalog({ tracks: { quizzes: [] } }), /No quizzes/);
  assert.deepEqual(buildRuntimeCatalog({ version: 'retired', tracks: { quizzes: [] } }, { retired: true }).lessons, []);
  assert.throws(() => buildRuntimeCatalog(payload, { retired: true }), /retired-content-not-empty/);
});
