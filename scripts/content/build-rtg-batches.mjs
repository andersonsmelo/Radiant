#!/usr/bin/env node
// Aulas-fonte (content-manifest/rtg-2026/aulas/*.json) → lotes de produção em
// TypeScript (radiant-app/src/features/student-checkpoints/batches/).
//
//   node scripts/content/build-rtg-batches.mjs           grava os arquivos gerados
//   node scripts/content/build-rtg-batches.mjs --check   falha se o gerado estiver defasado
//
// A saída depende só das aulas-fonte: ordem fixa da trilha, datas fixas da ADR,
// nenhum relógio. É isso que permite ao `--check` comparar byte a byte.
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import appContract from './load-app-contract.cjs';
import { lintUnit } from './rtg-lesson-lint.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const DEFAULT_SOURCE = path.join(root, 'content-manifest/rtg-2026/aulas');
const DEFAULT_OUTPUT = path.join(root, 'radiant-app/src/features/student-checkpoints/batches');
const HEADER = '// Gerado por scripts/content/build-rtg-batches.mjs a partir de content-manifest/rtg-2026/aulas.\n// Não edite à mão: mude a aula-fonte e rode o gerador.\n';
const GENERATED = /^(rtg-2026-.+|index|entries)\.ts$/;
const factory = appContract.loadAppContract('features/student-checkpoints/batches/rtgBatchFactory.ts');
const { createProductionCurriculumCatalog } = appContract.loadAppContract('features/student-checkpoints/createProductionCurriculumCatalog.ts');
const constantName = unit => `RTG_2026_${unit.toUpperCase().replace(/-/g, '_')}`;

/**
 * Função pura: recebe `{ file, doc }` de cada aula-fonte e devolve os arquivos a
 * gravar. Reprova a unidade inteira diante de qualquer erro do verificador ou
 * do contrato; nunca gera lote parcial.
 */
export function renderRtgBatches(inputs) {
  const order = Array.from(factory.RTG_UNIT_ORDER);
  const seen = new Set();
  for (const { file, doc } of inputs) {
    const unit = doc?.unit?.id;
    const errors = lintUnit(doc);
    if (errors.length) throw new Error(`rtg-lint:${file}\n${errors.map(error => `  - ${error}`).join('\n')}`);
    if (!order.includes(unit)) throw new Error(`rtg-unknown-unit:${file}:${unit}`);
    if (file !== `${unit}.json`) throw new Error(`rtg-file-name:${file}: o arquivo de ${unit} deve se chamar ${unit}.json`);
    if (seen.has(unit)) throw new Error(`rtg-duplicate-unit:${unit}`);
    seen.add(unit);
  }
  const builds = [...inputs].sort((a, b) => order.indexOf(a.doc.unit.id) - order.indexOf(b.doc.unit.id)).map(({ file, doc }) => {
    try { return { unit: doc.unit.id, ...factory.buildRtgBatch(doc) }; }
    catch (error) { throw new Error(`rtg-contract:${file}:${error.message}`); }
  });
  // Identidades entre unidades e montagem da trilha: o mesmo compositor que o app usa.
  createProductionCurriculumCatalog(builds.map(({ batch, presentation }) => ({ batch, presentation })));

  const files = new Map();
  for (const { unit, batch } of builds) {
    files.set(`rtg-2026-${unit}.ts`, `${HEADER}import type { ProductionBatchV1 } from '../ProductionBatch';\n\nexport const ${constantName(unit)}: ProductionBatchV1 = ${JSON.stringify(batch, null, 2)};\n`);
  }
  files.set('index.ts', `${HEADER}import type { ProductionBatchV1 } from '../ProductionBatch';\n${
    builds.map(({ unit }) => `import { ${constantName(unit)} } from './rtg-2026-${unit}';\n`).join('')
  }\n/** Lotes da trilha rtg-2026 na ordem do percurso: núcleo de M01 a M14, depois os ramos. */\nexport const RTG_2026_BATCHES: readonly ProductionBatchV1[] = [${
    builds.map(({ unit }) => `\n  ${constantName(unit)},`).join('')}${builds.length ? '\n' : ''}];\n`);
  files.set('entries.ts', `${HEADER}import type { ProductionCatalogEntry } from '../createProductionCurriculumCatalog';\n\n/** Textos de apresentação de cada unidade, por batchId. */\nexport const RTG_2026_PRESENTATIONS: Readonly<Record<string, ProductionCatalogEntry['presentation']>> = ${
    JSON.stringify(Object.fromEntries(builds.map(({ batch, presentation }) => [batch.batchId, presentation])), null, 2)};\n`);
  return { files, units: builds.map(({ unit, batch }) => ({ unit, batchId: batch.batchId, lessons: batch.activities.length,
    checkpointItems: batch.checkpoint.items.length, materialSha256: batch.materialSha256 })) };
}

export async function readRtgSources(sourceDir = DEFAULT_SOURCE) {
  let names = [];
  try { names = (await readdir(sourceDir)).filter(name => name.endsWith('.json')).sort(); }
  catch (error) { if (error?.code !== 'ENOENT') throw error; }
  const inputs = [];
  for (const file of names) {
    let doc;
    try { doc = JSON.parse(await readFile(path.join(sourceDir, file), 'utf8')); }
    catch (error) { throw new Error(`rtg-lint:${file}\n  - JSON inválido: ${error.message}`); }
    inputs.push({ file, doc });
  }
  return inputs;
}

/** Arquivos gerados que diferem do disco: defasados, ausentes ou sobrando. */
export async function staleRtgFiles(files, outputDir = DEFAULT_OUTPUT) {
  const stale = [];
  for (const [name, content] of files) {
    const current = await readFile(path.join(outputDir, name), 'utf8').catch(() => null);
    if (current !== content) stale.push(current === null ? `${name} (ausente)` : `${name} (defasado)`);
  }
  const existing = await readdir(outputDir).catch(() => []);
  for (const name of existing) if (/^rtg-2026-.+\.ts$/.test(name) && !files.has(name)) stale.push(`${name} (sem aula-fonte)`);
  return stale;
}

async function main() {
  const args = process.argv.slice(2);
  const option = name => args.find(arg => arg.startsWith(`--${name}=`))?.slice(name.length + 3);
  if (args.some(arg => arg !== '--check' && !/^--(source|out)=/.test(arg))) throw new Error('usage: [--check] [--source=<dir>] [--out=<dir>]');
  const outputDir = option('out') ? path.resolve(option('out')) : DEFAULT_OUTPUT;
  const { files, units } = renderRtgBatches(await readRtgSources(option('source') ? path.resolve(option('source')) : DEFAULT_SOURCE));
  if (args.includes('--check')) {
    const stale = await staleRtgFiles(files, outputDir);
    if (stale.length) throw new Error(`rtg-generated-stale: rode node scripts/content/build-rtg-batches.mjs\n${stale.map(name => `  - ${name}`).join('\n')}`);
  } else {
    await mkdir(outputDir, { recursive: true });
    for (const name of await readdir(outputDir)) if (GENERATED.test(name) && /^rtg-2026-/.test(name) && !files.has(name)) await rm(path.join(outputDir, name));
    for (const [name, content] of files) await writeFile(path.join(outputDir, name), content, 'utf8');
  }
  process.stdout.write(`${JSON.stringify({ ok: true, mode: args.includes('--check') ? 'check' : 'write', units }, null, 2)}\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main().catch(error => {
  process.stderr.write(`${error.message}\n`); process.exitCode = 1;
});
