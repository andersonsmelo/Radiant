import { readFile, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..");
const CONTENT_ROOT = join(REPO_ROOT, "conteúdo");
const FORMATS_ROOT = join(CONTENT_ROOT, "formatos");
const SEQUENCE_PATH = join(CONTENT_ROOT, "governança", "learning-sequence.json");
const OUTPUT_PATH = join(CONTENT_ROOT, "governança", "catalog-payload.json");

export async function collectApprovedBundles(formatsRoot = FORMATS_ROOT) {
  const approved = [];

  let formatTypes;
  try {
    formatTypes = await readdir(formatsRoot);
  } catch {
    return approved;
  }

  for (const formatType of formatTypes) {
    let sources;
    try {
      sources = await readdir(join(formatsRoot, formatType));
    } catch {
      continue;
    }

    for (const sourceSlug of sources) {
      const aiBundlesPath = join(formatsRoot, formatType, sourceSlug, "ai-bundles.json");
      if (!existsSync(aiBundlesPath)) continue;

      const data = JSON.parse(await readFile(aiBundlesPath, "utf-8"));
      for (const bundle of data.bundles ?? []) {
        if (bundle.reviewStatus === "approved") {
          approved.push(bundle);
        }
      }
    }
  }

  return approved;
}

export function sortBySequence(bundles, sequenceIds) {
  const indexMap = new Map(sequenceIds.map((id, i) => [id, i]));

  return [...bundles].sort((a, b) => {
    const aId = a.conceptIds?.[0] ?? "";
    const bId = b.conceptIds?.[0] ?? "";
    const aIdx = indexMap.has(aId) ? indexMap.get(aId) : Infinity;
    const bIdx = indexMap.has(bId) ? indexMap.get(bId) : Infinity;
    return aIdx - bIdx;
  });
}

export function buildCatalogPayload(bundles, version) {
  const approved = bundles.filter((b) => b.reviewStatus === "approved");
  const tracks = {};

  for (const bundle of approved) {
    const type = bundle.formatType;
    if (!tracks[type]) tracks[type] = [];
    tracks[type].push(bundle);
  }

  return {
    version,
    generatedAt: new Date().toISOString(),
    tracks,
  };
}

async function loadSequenceIds() {
  if (!existsSync(SEQUENCE_PATH)) return [];
  const data = JSON.parse(await readFile(SEQUENCE_PATH, "utf-8"));
  return (data.sequences ?? []).flatMap((s) => s.sequence ?? []);
}

async function bumpVersion(outputPath) {
  if (!existsSync(outputPath)) return "1.0.0";
  try {
    const existing = JSON.parse(await readFile(outputPath, "utf-8"));
    const [major, minor, patch] = (existing.version ?? "1.0.0").split(".").map(Number);
    return `${major}.${minor}.${patch + 1}`;
  } catch {
    return "1.0.0";
  }
}

async function run() {
  const bundles = await collectApprovedBundles();
  const sequenceIds = await loadSequenceIds();
  const sorted = sortBySequence(bundles, sequenceIds);
  const version = await bumpVersion(OUTPUT_PATH);
  const payload = buildCatalogPayload(sorted, version);

  await writeFile(OUTPUT_PATH, JSON.stringify(payload, null, 2), "utf-8");

  const total = Object.values(payload.tracks).reduce((sum, arr) => sum + arr.length, 0);
  const types = Object.keys(payload.tracks).join(", ") || "(nenhum)";
  console.log(`Promoted ${total} bundles (${types}) → version ${version}`);
  console.log(`Output: ${OUTPUT_PATH}`);
}

// Run when invoked directly
const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) run().catch((err) => { console.error(err); process.exit(1); });
