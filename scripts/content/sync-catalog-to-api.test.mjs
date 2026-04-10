import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { buildRuntimeCatalog } from "./catalog-runtime.mjs";
import { renderApiCatalogSql } from "./sync-catalog-to-api.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const CATALOG_PAYLOAD_PATH = path.join(
  ROOT,
  "conteúdo/governança/catalog-payload.json"
);

test("buildRuntimeCatalog maps promoted quizzes into the runtime track", async () => {
  const payload = JSON.parse(await readFile(CATALOG_PAYLOAD_PATH, "utf8"));
  const runtimeCatalog = buildRuntimeCatalog(payload);

  assert.equal(runtimeCatalog.version, "1.0.0");
  assert.equal(runtimeCatalog.track.id, "track-ai-fundamentos");
  assert.equal(runtimeCatalog.track.lessonIds.length, 16);
  assert.equal(runtimeCatalog.lessons.length, 16);
  assert.equal(
    runtimeCatalog.lessons[0]?.id,
    "ai-lesson:profissao-e-atuacao-do-tecnico-em-radiologia"
  );
  assert.equal(runtimeCatalog.lessons.at(-1)?.id, "ai-lesson:qualidade-de-imagem");
});

test("renderApiCatalogSql publishes the AI catalog and unpublishes the legacy seed", async () => {
  const payload = JSON.parse(await readFile(CATALOG_PAYLOAD_PATH, "utf8"));
  const sql = renderApiCatalogSql(buildRuntimeCatalog(payload));

  assert.match(sql, /update content_lessons[\s\S]+lesson-1[\s\S]+lesson-2/);
  assert.match(sql, /update content_tracks[\s\S]+track-radiology-foundations/);
  assert.match(sql, /track-ai-fundamentos/);
  assert.match(sql, /ai-lesson:profissao-e-atuacao-do-tecnico-em-radiologia/);
  assert.match(sql, /ai-lesson:qualidade-de-imagem/);
  assert.match(sql, /'1\.0\.0'/);
});
