import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

export function readCurriculumState(root) {
  const file = path.join(root, 'radiant-app/src/data/curriculum-state.json');
  if (!existsSync(file)) return null;
  const state = JSON.parse(readFileSync(file, 'utf8'));
  if (state?.schemaVersion !== 1 || state.state !== 'retired'
    || state.audience !== 'radiology-technologist' || state.reason !== 'content-restart-2026-11-02') {
    throw Error('invalid-curriculum-state');
  }
  return state;
}

export function assertRetiredCollections(collections) {
  for (const [name, entries] of Object.entries(collections)) {
    if (!Array.isArray(entries)) throw Error(`retired-collection-missing:${name}`);
    if (entries.length !== 0) throw Error(`retired-content-not-empty:${name}`);
  }
}

/** The state marker alone never makes nonempty lesson data valid. No raw extracts are read. */
export function validateRetiredContent(root) {
  const state = readCurriculumState(root);
  if (!state) throw Error('explicit-curriculum-retirement-required');
  const read = name => JSON.parse(readFileSync(path.join(root, name), 'utf8'));
  const base = 'conteúdo/';
  const payload = read(base + 'governança/catalog-payload.json');
  const graph = read(base + 'governança/concept-graph.json');
  const sequence = read(base + 'governança/learning-sequence.json');
  const collections = {
    classifications: read(base + 'classificação/index.json').jobs,
    concepts: read(base + 'conceitos/index.json').jobs,
    formats: read(base + 'formatos/index.json').jobs,
    priorityTracks: read(base + 'governança/wave-1-priority-tracks.json').tracks,
    bundleStatus: read(base + 'governança/wave-1-bundle-status.json').tracks,
    taxonomyMap: read('content-manifest/taxonomy-catalog-map.json'),
    graphNodes: graph.nodes, graphEdges: graph.edges, sequences: sequence.sequences,
  };
  for (const name of ['microlições', 'quizzes', 'reviews', 'casos', 'checkpoints', 'rewards']) collections[name] = payload.tracks?.[name];
  assertRetiredCollections(collections);
  const lessonsDir = path.join(root, 'content-manifest/lessons');
  const anchored = existsSync(lessonsDir) ? readdirSync(lessonsDir).filter(name => /\.(anchored|claims)\.json$/.test(name)) : [];
  assertRetiredCollections({ anchored });
  const walk = directory => !existsSync(directory) ? [] : readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);
  const artifacts = ['classificação', 'conceitos', 'formatos'].flatMap(name => walk(path.join(root, base, name)))
    .filter(file => file.endsWith('.json') && path.basename(file) !== 'index.json');
  assertRetiredCollections({ editorialArtifacts: artifacts });
  if (existsSync(path.join(root, base, 'governança/foundations-safety-competencies.json'))) throw Error('retired-content-not-empty:competency-payload');
  return { state: state.state, lessonCount: 0, publicationReady: false, scope: 'explicit-local-content-retirement' };
}
