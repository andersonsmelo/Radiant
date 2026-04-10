import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

const wave1 = readJson('conteúdo/governança/wave-1-priority-tracks.json');
const galaxias = readJson('conteúdo/taxonomia/galaxias.json');
const planetas = readJson('conteúdo/taxonomia/planetas.json');
const estrelas = readJson('conteúdo/taxonomia/estrelas.json');

test('wave 1 priority tracks define a stable launch contract', () => {
  assert.equal(wave1.version, 'wave-1-2026-04-09');
  assert.ok(Array.isArray(wave1.tracks));
  assert.equal(wave1.tracks.length, 3);

  const trackIds = wave1.tracks.map((track) => track.id);
  const trackSlugs = wave1.tracks.map((track) => track.slug);
  const lessonIds = wave1.tracks.flatMap((track) => track.lessonIds ?? []);

  assert.deepEqual(trackIds, [
    'track-radiology-foundations',
    'track-thorax-patterns',
    'track-abdomen-essentials',
  ]);
  assert.deepEqual(trackSlugs, ['fundamentos', 'torax', 'abdome']);
  assert.equal(new Set(trackIds).size, trackIds.length);
  assert.equal(new Set(trackSlugs).size, trackSlugs.length);
  assert.equal(new Set(lessonIds).size, lessonIds.length);

  for (const track of wave1.tracks) {
    assert.equal(typeof track.title, 'string');
    assert.equal(typeof track.goal, 'string');
    assert.equal(typeof track.description, 'string');
    assert.ok(track.title.length > 0);
    assert.ok(track.goal.length > 0);
    assert.ok(track.description.length > 0);
    assert.ok(Array.isArray(track.lessonIds));
    assert.ok(track.lessonIds.length > 0);
  }
});

test('wave 1 contract is mirrored by the editorial taxonomia', () => {
  assert.ok(galaxias.some((item) => item.slug === 'fundamentos'));
  assert.ok(planetas.some((item) => item.slug === 'torax'));
  assert.ok(planetas.some((item) => item.slug === 'abdome'));
  assert.ok(estrelas.some((item) => item.slug === 'fundamentos'));
  assert.ok(estrelas.some((item) => item.slug === 'torax'));
  assert.ok(estrelas.some((item) => item.slug === 'abdome'));
});
