/**
 * sync-catalog-to-app.mjs
 *
 * Reads conteúdo/governança/catalog-payload.json and generates:
 *   radiant-app/src/data/ai-lessons.ts  — QuizLesson[] from quizzes track
 *   radiant-app/src/data/ai-catalog.ts  — LessonCatalogManifest fragment
 *
 * Run: node scripts/content/sync-catalog-to-app.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const CATALOG_PAYLOAD_PATH = path.join(
  ROOT,
  "conteúdo/governança/catalog-payload.json"
);
const AI_LESSONS_PATH = path.join(
  ROOT,
  "radiant-app/src/data/ai-lessons.ts"
);
const AI_CATALOG_PATH = path.join(
  ROOT,
  "radiant-app/src/data/ai-catalog.ts"
);

// ─── helpers ──────────────────────────────────────────────────────────────────

function slugFromBundleId(bundleId) {
  // "format:quizzes:source-slug:concept-slug:ai" → concept-slug
  return bundleId.split(":")[3];
}

function lessonIdFromBundleId(bundleId) {
  const slug = slugFromBundleId(bundleId);
  return `ai-lesson:${slug}`;
}

function mapQuizBundle(bundle) {
  const questions = bundle.aiContent.map((q, i) => ({
    id: `${lessonIdFromBundleId(bundle.id)}:q${i + 1}`,
    type: "multiple-choice",
    prompt: q.question,
    options: q.options.map((label) => ({ label })),
    correctAnswerIndex: q.correct,
    explanation: q.explanation,
  }));

  return {
    id: lessonIdFromBundleId(bundle.id),
    title: bundle.title,
    difficulty: "beginner",
    questions,
  };
}

function renderAiLessons(lessons) {
  const json = JSON.stringify(lessons, null, 2);
  return `// AUTO-GENERATED — do not edit by hand.
// Source: conteúdo/governança/catalog-payload.json
// Run: node scripts/content/sync-catalog-to-app.mjs

import type { QuizLesson } from '../types/quiz';

export const AI_LESSONS: QuizLesson[] = ${json} as const;
`;
}

function renderAiCatalog(lessons, version) {
  const TRACK_ID = "track-ai-fundamentos";
  const lessonIds = lessons.map((l) => l.id);

  const summaries = lessons.map((l, i) => ({
    id: l.id,
    slug: slugFromLessonId(l.id),
    title: l.title,
    difficulty: l.difficulty,
    trackId: TRACK_ID,
    order: i + 1,
  }));

  const track = {
    id: TRACK_ID,
    slug: "ai-fundamentos-de-radiologia",
    title: "Fundamentos de Radiologia (IA)",
    description:
      "16 conceitos essenciais de radiologia gerados pelo Radiant AI, ordenados por sequência de aprendizagem.",
    lessonIds,
  };

  return `// AUTO-GENERATED — do not edit by hand.
// Source: conteúdo/governança/catalog-payload.json
// Run: node scripts/content/sync-catalog-to-app.mjs

import type { LearningTrack, LessonCatalogSummary } from '../features/content/content.types';

export const AI_CATALOG_VERSION = ${JSON.stringify(version)};

export const AI_TRACK: LearningTrack = ${JSON.stringify(track, null, 2)} as const;

export const AI_LESSON_SUMMARIES: LessonCatalogSummary[] = ${JSON.stringify(summaries, null, 2)} as const;
`;
}

function slugFromLessonId(lessonId) {
  // "ai-lesson:energia-e-materia" → "energia-e-materia"
  return lessonId.replace(/^ai-lesson:/, "");
}

// ─── main ─────────────────────────────────────────────────────────────────────

const payload = JSON.parse(readFileSync(CATALOG_PAYLOAD_PATH, "utf8"));
const quizBundles = payload.tracks.quizzes;

if (!quizBundles || quizBundles.length === 0) {
  console.error("No quizzes found in catalog-payload.json");
  process.exit(1);
}

const lessons = quizBundles.map(mapQuizBundle);

writeFileSync(AI_LESSONS_PATH, renderAiLessons(lessons), "utf8");
writeFileSync(AI_CATALOG_PATH, renderAiCatalog(lessons, payload.version), "utf8");

console.log(`Synced ${lessons.length} lessons → ai-lessons.ts + ai-catalog.ts`);
