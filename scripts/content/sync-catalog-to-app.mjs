/**
 * sync-catalog-to-app.mjs
 *
 * Reads conteúdo/governança/catalog-payload.json and generates:
 *   radiant-app/src/data/ai-lessons.ts  — QuizLesson[] from quizzes track
 *   radiant-app/src/data/ai-catalog.ts  — LessonCatalogManifest fragment
 *   radiant-app/src/data/catalog.ts     — Wave 1 local catalog slice
 *
 * Run: node scripts/content/sync-catalog-to-app.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { buildRuntimeCatalog } from "./catalog-runtime.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const CATALOG_PAYLOAD_PATH = path.join(
  ROOT,
  "conteúdo/governança/catalog-payload.json"
);
const WAVE1_PRIORITY_TRACKS_PATH = path.join(
  ROOT,
  "conteúdo/governança/wave-1-priority-tracks.json"
);
const AI_LESSONS_PATH = path.join(ROOT, "radiant-app/src/data/ai-lessons.ts");
const AI_CATALOG_PATH = path.join(ROOT, "radiant-app/src/data/ai-catalog.ts");
const APP_CATALOG_PATH = path.join(ROOT, "radiant-app/src/data/catalog.ts");

function renderAiLessons(lessons) {
  const json = JSON.stringify(lessons, null, 2);
  return `// AUTO-GENERATED — do not edit by hand.
// Source: conteúdo/governança/catalog-payload.json
// Run: node scripts/content/sync-catalog-to-app.mjs

import type { QuizLesson } from '../types/quiz';

export const AI_LESSONS: QuizLesson[] = ${json} as const;
`;
}

function renderAiCatalog(track, lessonSummaries, version) {
  return `// AUTO-GENERATED — do not edit by hand.
// Source: conteúdo/governança/catalog-payload.json
// Run: node scripts/content/sync-catalog-to-app.mjs

import type { LearningTrack, LessonCatalogSummary } from '../features/content/content.types';

export const AI_CATALOG_VERSION = ${JSON.stringify(version)};

export const AI_TRACK: LearningTrack = ${JSON.stringify(track, null, 2)} as const;

export const AI_LESSON_SUMMARIES: LessonCatalogSummary[] = ${JSON.stringify(lessonSummaries, null, 2)} as const;
`;
}

function renderWave1Catalog(wave1) {
  const tracks = [...wave1.tracks].sort((left, right) => left.priority - right.priority);
  const lessonIds = tracks.flatMap((track) => track.lessonIds ?? []);
  const uniqueLessonIds = new Set(lessonIds);

  if (uniqueLessonIds.size !== lessonIds.length) {
    throw new Error('Wave 1 priority track contract assigns the same lesson id to more than one track');
  }

  const links = tracks.flatMap((track) =>
    track.lessonIds.map((lessonId, index) => ({
      lessonId,
      trackId: track.id,
      order: index + 1,
    }))
  );

  return `// AUTO-GENERATED — do not edit by hand.
// Source: conteúdo/governança/wave-1-priority-tracks.json
// Run: node scripts/content/sync-catalog-to-app.mjs

import { LESSONS } from './lessons';
import { AI_LESSONS } from './ai-lessons';
import type { LessonCatalogManifest, LessonCatalogSummary, LearningTrack } from '../features/content/content.types';

const WAVE1_CATALOG_VERSION = ${JSON.stringify(wave1.version)};

const WAVE1_TRACKS: LearningTrack[] = ${JSON.stringify(
    tracks.map(({ id, slug, title, description, lessonIds }) => ({ id, slug, title, description, lessonIds })),
    null,
    2
  )};

const WAVE1_LESSON_LINKS = ${JSON.stringify(links, null, 2)};

const LOCAL_LESSONS = [...LESSONS, ...AI_LESSONS];
const LESSONS_BY_ID = new Map(LOCAL_LESSONS.map((lesson) => [lesson.id, lesson] as const));

function lessonSlugFromId(lessonId: string): string {
  if (lessonId === 'lesson-1') {
    return 'fundamentos-de-radiologia';
  }

  if (lessonId === 'lesson-2') {
    return 'principios-de-tomografia-computadorizada';
  }

  return lessonId.replace(/^ai-lesson:/, '');
}

function buildLessonSummaries(): LessonCatalogSummary[] {
  return WAVE1_LESSON_LINKS.map(({ lessonId, trackId, order }) => {
    const lesson = LESSONS_BY_ID.get(lessonId);

    if (!lesson) {
      throw new Error(\`Missing lesson payload for \${lessonId}\`);
    }

    return {
      id: lesson.id,
      slug: lessonSlugFromId(lesson.id),
      title: lesson.title,
      difficulty: lesson.difficulty,
      trackId,
      order,
    };
  });
}

export const LESSON_CATALOG: LessonCatalogManifest = {
  version: WAVE1_CATALOG_VERSION,
  initialLessonId: 'lesson-1',
  tracks: WAVE1_TRACKS,
  lessons: buildLessonSummaries(),
};
`;
}

// ─── main ─────────────────────────────────────────────────────────────────────

const payload = JSON.parse(readFileSync(CATALOG_PAYLOAD_PATH, "utf8"));
const wave1 = JSON.parse(readFileSync(WAVE1_PRIORITY_TRACKS_PATH, "utf8"));
const { version, lessons, track, lessonSummaries } = buildRuntimeCatalog(payload);

writeFileSync(AI_LESSONS_PATH, renderAiLessons(lessons), "utf8");
writeFileSync(AI_CATALOG_PATH, renderAiCatalog(track, lessonSummaries, version), "utf8");
writeFileSync(APP_CATALOG_PATH, renderWave1Catalog(wave1), "utf8");

console.log(`Synced ${lessons.length} lessons → ai-lessons.ts + ai-catalog.ts + catalog.ts`);
