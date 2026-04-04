import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');
const contentRoot = path.join(repoRoot, 'conteúdo');

function readJson(relativePath) {
  const absolutePath = path.join(contentRoot, relativePath);
  return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
}

export function validateFoundation() {
  const errors = [];
  const galaxias = readJson('taxonomia/galaxias.json');
  const planetas = readJson('taxonomia/planetas.json');
  const estrelas = readJson('taxonomia/estrelas.json');
  const schemaPaths = [
    'governança/esquemas/extraction-record.schema.json',
    'governança/esquemas/classification-record.schema.json',
    'governança/esquemas/concept.schema.json',
    'governança/esquemas/format-bundle.schema.json',
  ];
  const schemas = schemaPaths.map(readJson);

  const galaxyIds = new Set(galaxias.map((item) => item.id));
  const planetIds = new Set(planetas.map((item) => item.id));

  for (const planeta of planetas) {
    if (!galaxyIds.has(planeta.galaxyId)) {
      errors.push(`Planet ${planeta.id} references unknown galaxy ${planeta.galaxyId}`);
    }
  }

  for (const estrela of estrelas) {
    if (!galaxyIds.has(estrela.galaxyId)) {
      errors.push(`Star ${estrela.id} references unknown galaxy ${estrela.galaxyId}`);
    }
    if (!planetIds.has(estrela.parentPlanetId)) {
      errors.push(`Star ${estrela.id} references unknown parent planet ${estrela.parentPlanetId}`);
    }
  }

  for (const schema of schemas) {
    if (!schema.title) {
      errors.push('Schema is missing title');
    }
    if (!Array.isArray(schema.required) || schema.required.length === 0) {
      errors.push(`Schema ${schema.title ?? 'unknown'} is missing required fields`);
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    summary: {
      galaxyCount: galaxias.length,
      planetCount: planetas.length,
      starCount: estrelas.length,
      galaxyIds: galaxias.map((item) => item.id),
      schemaTitles: schemas.map((schema) => schema.title),
    },
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = validateFoundation();

  if (!result.ok) {
    console.error(JSON.stringify(result, null, 2));
    process.exit(1);
  }

  console.log(JSON.stringify(result, null, 2));
}
