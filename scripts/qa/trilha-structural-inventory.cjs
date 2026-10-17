#!/usr/bin/env node
'use strict';
// Read-only inventory of trusted, pure catalog modules using installed TypeScript.
// No app bootstrap, AsyncStorage, remote source or file writes. The local manifest
// port replaces storage/network; real journey and lesson-flow services execute.
// All remaining imports must stay inside src; external imports are refused.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const repo = path.resolve(__dirname, '../..');
const root = fs.realpathSync(path.join(repo, 'radiant-app/src'));
const ts = require(path.join(repo, 'radiant-app/node_modules/typescript'));
const cache = new Map();
const sourceHashes = {};
function load(relative) {
  const file = fs.realpathSync(path.resolve(root, relative));
  if (!file.startsWith(root + path.sep) || !file.endsWith('.ts')) throw Error('Source outside inventory scope');
  if (cache.has(file)) return cache.get(file).exports;
  const source = fs.readFileSync(file, 'utf8');
  sourceHashes[path.relative(repo, file).split(path.sep).join('/')] = crypto.createHash('sha256').update(source).digest('hex');
  const module = { exports: {} };
  cache.set(file, module);
  const js = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  function requireLocal(id) {
    if (!id.startsWith('.')) throw Error('External source import blocked: ' + id);
    return load(path.relative(root, path.resolve(path.dirname(file), id + '.ts')));
  }
  vm.runInNewContext(js, { exports: module.exports, module, require: requireLocal }, { filename: file, timeout: 5000 });
  return module.exports;
}
const catalog = load('data/catalog.ts').LESSON_CATALOG;
const ai = load('data/ai-lessons.ts').AI_LESSONS;
const lessons = [...ai, ...load('data/lessons.ts').LESSONS];
const byId = new Map(lessons.map(lesson => [lesson.id, lesson]));
const selected = catalog.lessons.map(summary => {
  const lesson = byId.get(summary.id);
  if (!lesson) throw Error('Unresolved catalog payload: ' + summary.id);
  return lesson;
});
function questionsStats(items) {
  const questions = items.flatMap(lesson => lesson.questions);
  return {
    questions: questions.length,
    imageQuestions: questions.filter(q => q.type === 'image' || q.image || q.imageRef || q.options.some(o => o.imageRef)).length,
    correctLongestIncludingTies: questions.filter(q => q.options[q.correctAnswerIndex].label.length === Math.max(...q.options.map(o => o.label.length))).length,
    correctStrictLongest: questions.filter(q => q.options.every((o, i) => i === q.correctAnswerIndex || q.options[q.correctAnswerIndex].label.length > o.label.length)).length,
  };
}
const production = load('features/student-checkpoints/ProductionCurriculumCatalog.ts').ProductionCurriculumCatalog;
const compose = load('features/content/services/composeCurriculumCatalog.ts').composeCurriculumCatalog;
const facade = compose(catalog, production);
// Fronteira explícita: mesmos dados locais/compositor do serviço, sem hidratação,
// cache remoto ou feature flags. Não é uma sessão real de usuário.
const offlineLessonPort = {
  listTracks: () => facade.tracks,
  listLessonSummaries: () => facade.lessons,
  getLessonById: id => byId.get(id) ?? null,
};
cache.set(fs.realpathSync(path.join(root, 'features/content/services/LessonCatalogService.ts')), {
  exports: { LessonCatalogService: offlineLessonPort },
});
const journey = load('features/journey/services/JourneyDefinitionService.ts').JourneyDefinitionService;
const flow = load('features/lesson-flow/services/LessonFlowService.ts').LessonFlowService;
const audit = load('features/journey/services/JourneyCatalogAudit.ts').auditJourneyCatalog;
const reachability = audit({
  tracks: facade.tracks, summaries: facade.lessons,
  getJourney: id => journey.getTrackDefinition(id),
  getActivity: id => flow.getActivityById(id),
  getCheckpoint: id => production.getCheckpointByNodeId(id),
});
const batches = load('features/student-checkpoints/production-batches.ts').PRODUCTION_BATCHES;
const coverageAudit = load('features/student-checkpoints/ProductionCurriculumCoverage.ts').auditCurriculumCoverage;
const occurrences = facade.tracks.flatMap(track => journey.getTrackDefinition(track.id).units.flatMap(unit => unit.nodes.flatMap(node => {
  const activity = node.blockId ? flow.getActivityById(node.blockId) : null;
  return activity ? [{ trackId: track.id, unitId: unit.id, nodeId: node.id, activity }] : [];
})));
const checkpointOccurrences = facade.tracks.flatMap(track => journey.getTrackDefinition(track.id).units.flatMap(unit => unit.nodes.flatMap(node => {
  const checkpoint = node.type === 'checkpoint' ? production.getCheckpointByNodeId(node.id) : null;
  return checkpoint ? [{ trackId: track.id, unitId: unit.id, nodeId: node.id, checkpoint }] : [];
})));
const coverage = coverageAudit(batches, occurrences, checkpointOccurrences);
const reachedOptionIds = new Set(reachability.tracks.flatMap(track => track.multipleChoiceOptionIds));
const legacyQuestions = selected.flatMap(lesson => lesson.questions);
const reachedQuestions = legacyQuestions.filter(question => reachedOptionIds.has(question.id + ':option:0'));
const reachedQuestionIds = new Set(reachedQuestions.map(question => question.id));
const productionTracks = production.listTracks();
const inventory = {
  schemaVersion: 3,
  authorship: { ai: 'OpenAI Codex', model: 'GPT-6 family; exact variant not exposed' },
  evidenceGrade: 'code',
  method: 'Execute trusted local source modules, substitute only the offline LessonCatalogService port, audit prerequisites, resolve all lesson/review/checkpoint nodes, and link items to declared competencies/sources/claims without clinical or licensing revalidation.',
  measuredAtUtc: new Date().toISOString(),
  timezoneForInterpretation: 'America/Bahia',
  head: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repo, encoding: 'utf8' }).trim(),
  scope: 'Offline local manifest port; real composition, journey builder, lesson-flow resolver and adapter. Graph reachability assuming prerequisites completed; not device availability, remote hydration, clinical validation or learning efficacy.',
  legacy: {
    lessons: selected.length, ...questionsStats(selected),
    authoredJourneyIntro: selected.filter(lesson => lesson.journey?.intro).length,
    aiOnly: { lessons: ai.length, ...questionsStats(ai) },
    tracks: catalog.tracks.map(track => ({
      id: track.id, slug: track.slug, title: track.title, lessons: track.lessonIds.length,
      questions: track.lessonIds.reduce((count, id) => count + byId.get(id).questions.length, 0),
      nodesFromJourneyService: reachability.tracks.find(entry => entry.trackId === track.id).nodes,
    })),
  },
  production: productionTracks.map(track => {
    const definition = production.getJourneyTrackDefinition(track.id);
    return { id: track.id, title: track.title, activities: track.lessonIds.length, nodes: definition.units.reduce((count, unit) => count + unit.nodes.length, 0) };
  }),
  facade: { tracks: facade.tracks.length, lessonSummaries: facade.lessons.length },
  reachability,
  coverage,
  legacyQuestionCoverage: {
    available: legacyQuestions.length,
    reachedByStudyNodes: reachedQuestions.length,
    absentFromStudyNodes: legacyQuestions.filter(question => !reachedQuestionIds.has(question.id)).map(question => question.id),
    interpretation: 'Absence is from Estude lesson/review nodes only, not proof of absence from every quiz or review route.',
  },
  inventoryScriptSha256: crypto.createHash('sha256').update(fs.readFileSync(__filename)).digest('hex'),
  sourceHashes,
};
console.log(JSON.stringify(inventory, null, 2));

if (process.argv.includes('--check') && (reachability.issues.length || coverage.issues.length)) process.exitCode = 1;
