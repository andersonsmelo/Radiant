/**
 * sync-catalog-to-api.mjs
 *
 * Reads conteúdo/governança/catalog-payload.json and generates:
 *   radiant-api/sql/003_seed_editorial_catalog.sql
 *
 * Run: node scripts/content/sync-catalog-to-api.mjs
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
const API_SQL_PATH = path.join(
  ROOT,
  "radiant-api/sql/003_seed_editorial_catalog.sql"
);

const LEGACY_TRACK_IDS = ["track-radiology-foundations"];
const LEGACY_LESSON_IDS = ["lesson-1", "lesson-2"];

function sqlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlStringList(values) {
  return values.map(sqlString).join(", ");
}

function renderTrackUpsert(track) {
  return `insert into content_tracks (
    id,
    slug,
    title,
    description,
    sort_order,
    is_published
)
values (
    ${sqlString(track.id)},
    ${sqlString(track.slug)},
    ${sqlString(track.title)},
    ${sqlString(track.description)},
    1,
    true
)
on conflict (id) do update set
    slug = excluded.slug,
    title = excluded.title,
    description = excluded.description,
    sort_order = excluded.sort_order,
    is_published = excluded.is_published,
    updated_at = now();`;
}

function renderLessonTuple(lesson, index, trackId, version) {
  const jsonTag = `$lesson_${index + 1}$`;
  const payload = {
    id: lesson.id,
    title: lesson.title,
    difficulty: lesson.difficulty,
    questions: lesson.questions,
  };

  return `(
    ${sqlString(lesson.id)},
    ${sqlString(trackId)},
    ${sqlString(lesson.id.replace(/^ai-lesson:/, ""))},
    ${sqlString(lesson.title)},
    ${sqlString(lesson.difficulty)},
    ${index + 1},
    ${sqlString(version)},
    ${jsonTag}${JSON.stringify(payload, null, 2)}${jsonTag}::jsonb,
    true
)`;
}

function renderLessonsUpsert(trackId, lessons, version) {
  const values = lessons
    .map((lesson, index) => renderLessonTuple(lesson, index, trackId, version))
    .join(",\n");

  return `insert into content_lessons (
    id,
    track_id,
    slug,
    title,
    difficulty,
    sort_order,
    content_version,
    payload,
    is_published
)
values
${values}
on conflict (id) do update set
    track_id = excluded.track_id,
    slug = excluded.slug,
    title = excluded.title,
    difficulty = excluded.difficulty,
    sort_order = excluded.sort_order,
    content_version = excluded.content_version,
    payload = excluded.payload,
    is_published = excluded.is_published,
    updated_at = now();`;
}

function renderLegacyUnpublish() {
  return `update content_lessons
set is_published = false,
    updated_at = now()
where id in (${sqlStringList(LEGACY_LESSON_IDS)});

update content_tracks
set is_published = false,
    updated_at = now()
where id in (${sqlStringList(LEGACY_TRACK_IDS)});`;
}

export function renderApiCatalogSql(runtimeCatalog) {
  return `-- AUTO-GENERATED — do not edit by hand.
-- Source: conteúdo/governança/catalog-payload.json
-- Run: node scripts/content/sync-catalog-to-api.mjs

${renderLegacyUnpublish()}

${renderTrackUpsert(runtimeCatalog.track)}

${renderLessonsUpsert(runtimeCatalog.track.id, runtimeCatalog.lessons, runtimeCatalog.version)}
`;
}

export function run() {
  const payload = JSON.parse(readFileSync(CATALOG_PAYLOAD_PATH, "utf8"));
  const runtimeCatalog = buildRuntimeCatalog(payload);
  const sql = renderApiCatalogSql(runtimeCatalog);

  writeFileSync(API_SQL_PATH, sql, "utf8");

  console.log(
    `Synced ${runtimeCatalog.lessons.length} lessons → radiant-api/sql/003_seed_editorial_catalog.sql`
  );
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  run();
}
