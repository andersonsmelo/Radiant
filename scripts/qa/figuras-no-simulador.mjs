#!/usr/bin/env node
// Ids de figura -> roteiros do Maestro que abrem a aula onde cada uma aparece e a capturam no simulador.
//
//   node scripts/qa/figuras-no-simulador.mjs <id>...           grava em radiant-app/.maestro/figuras/
//   node scripts/qa/figuras-no-simulador.mjs --check <id>...   sai com 1 se algum roteiro versionado difere
//   node scripts/qa/figuras-no-simulador.mjs --check           usa o índice (.maestro/figuras/indice.json) e reprova roteiro órfão na pasta
//
// Um roteiro por aula: <unidade>-<aula>.yaml captura as figuras paradas (movimento reduzido ligado, como os roteiros da
// trilha); <unidade>-<aula>-laco.yaml, só para figura em laço usada como `visual` do conceito, grava 8 s com o movimento ligado.
// O passo e a resposta certa até ele vêm do gerador da trilha (lessonCommands), sem cópia da conta.
// Os roteiros de captura foram vistos rodando só no Android, e com três contornos em cópias temporárias (dismiss-dev-client:
// localhost:8081 e botão Close; rolagem do categorize): docs/evidence/2026-11-19-figuras/orcamento.md, seção 7 (Defeitos dos roteiros no Android).
// O roteiro de laço (waitForAnimationToEnd de 8 s) não foi verificado em aparelho nenhum.
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import appContract from '../content/load-app-contract.cjs';
import { readRtgImages, readRtgSources } from '../content/build-rtg-batches.mjs';
import { flowFile, lessonCommands, link, openLink, quote } from './generate-rtg-maestro.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const OUTPUT = path.join(root, 'radiant-app/.maestro/figuras');
const factory = appContract.loadAppContract('features/student-checkpoints/batches/rtgBatchFactory.ts');
const { DIAGRAMS, parseDiagramRef } = appContract.loadAppContract('ui/diagrams/diagramRegistry.ts');
const RECORDING_MS = 8000;
const INDEX = 'indice.json';

/** Onde cada figura aparece: `visual` do conceito ou `imageRef` de uma interação. `step` é 1-based, como "Passo N de M". */
export function findFigureSteps(unitDocs, images, ids) {
  const found = [];
  for (const doc of unitDocs) {
    for (const activity of factory.buildRtgBatch(doc, images).batch.activities) {
      activity.steps.forEach((step, index) => {
        const isVisual = step.kind === 'presentation';
        const figure = isVisual ? step.payload.visual : parseDiagramRef(step.interaction.payload.imageRef ?? '');
        if (figure && ids.includes(figure)) {
          found.push({ id: figure, unit: doc.unit.id, activity, aula: activity.id.split(':').at(-1), step: index + 1, kind: isVisual ? 'visual' : 'interaction', loop: DIAGRAMS[figure]?.periodMs !== undefined });
        }
      });
    }
  }
  return found;
}

/** Função pura: `Map<nome do arquivo, YAML>`. Falha se algum id não aparece em aula nenhuma. */
export function renderFigureFlows(unitDocs, images, ids) {
  const found = findFigureSteps(unitDocs, images, ids);
  const missing = ids.filter(id => !found.some(entry => entry.id === id));
  if (missing.length) throw new Error(`figuras-sem-passo:${missing.join(',')}`);
  const lessons = new Map();
  for (const entry of found) {
    const key = `${entry.unit}-${entry.aula}`;
    lessons.set(key, [...(lessons.get(key) ?? []), entry]);
  }
  const files = new Map();
  for (const [key, entries] of lessons) {
    const { unit, aula, activity } = entries[0];
    const open = openLink(link('learn', { blockId: activity.id, nodeId: `node:${activity.id}` }));
    const notes = [
      'Gerado por scripts/qa/figuras-no-simulador.mjs a partir das aulas-fonte. Não edite à mão.',
      'Entrada pelo link da rota /learn, como os roteiros da trilha, respondendo certo até o passo da figura. Não medido em aparelho.',
    ];
    const loopNote = 'O laço (waitForAnimationToEnd de 8 s) não foi verificado em aparelho.';
    // Duas capturas do mesmo id na aula ganham o passo no nome; do contrário o segundo arquivo sobrescreveria o primeiro.
    const shotName = entry => `figura-${entry.id}-${unit}-${aula}${entries.filter(other => other.id === entry.id).length > 1 ? `-passo${entry.step}` : ''}`;
    const stills = entries.filter(entry => entry.kind === 'interaction' || !entry.loop);
    const loops = entries.filter(entry => entry.kind === 'visual' && entry.loop);
    const flow = (list, capture, suffix, reduceMotion) => files.set(`${key}${suffix}.yaml`, flowFile({
      name: `Figuras ${unit.toUpperCase()} ${aula}${suffix ? ' (laço)' : ''}`, tags: ['figuras', 'generated'], notes: suffix ? [...notes, loopNote] : notes, reduceMotion,
      commands: [...open, ...lessonCommands(activity, new Map(list.map(entry => [entry.step, capture(entry)])))],
    }));
    if (stills.length) flow(stills, entry => [`- takeScreenshot: ${quote(shotName(entry))}`], '', '1');
    // shortcut: o laço nunca assenta, então `waitForAnimationToEnd` espera o prazo inteiro; trocar se o Maestro ganhar um `wait` puro.
    if (loops.length) flow(loops, entry => [`- startRecording: ${quote(`${shotName(entry)}-laco`)}`, `- waitForAnimationToEnd:\n    timeout: ${RECORDING_MS}`, '- stopRecording'], '-laco', '0');
  }
  return files;
}

/** Nomes de roteiro na pasta que nenhuma figura do índice gera hoje. */
export const orphanFlows = (generated, onDisk) => onDisk.filter(name => name.endsWith('.yaml') && !generated.has(name)).sort();

/** Compara a pasta com o gerado: conteúdo defasado e, com `full`, roteiro órfão. */
export async function checkFolder(dir, files, { full }) {
  const problems = [];
  for (const [name, content] of files) if (await readFile(path.join(dir, name), 'utf8').catch(() => null) !== content) problems.push(`defasado: ${name}`);
  if (full) for (const name of orphanFlows(files, await readdir(dir))) problems.push(`órfão: ${name}`);
  return problems;
}

async function main() {
  const args = process.argv.slice(2);
  const check = args.includes('--check');
  if (args.some(arg => arg.startsWith('--') && arg !== '--check')) throw new Error('usage: figuras-no-simulador.mjs [--check] [<diagramId>...]');
  const asked = args.filter(arg => !arg.startsWith('--'));
  const indexed = JSON.parse(await readFile(path.join(OUTPUT, INDEX), 'utf8').catch(() => '{"ids":[]}')).ids;
  if (!asked.length && !check) throw new Error('usage: figuras-no-simulador.mjs [--check] [<diagramId>...]');
  const ids = asked.length ? asked : indexed;
  if (!ids.length) throw new Error('figuras-indice-vazio: rode o gerador com ids para criar o índice');
  const files = renderFigureFlows((await readRtgSources()).map(({ doc }) => doc), await readRtgImages(), ids);
  if (check) {
    // Sem ids, o índice é o conjunto de figuras com roteiro: o que está na pasta e ninguém gera mais é órfão.
    const problems = await checkFolder(OUTPUT, files, { full: !asked.length });
    if (problems.length) throw new Error(`figuras-roteiro-stale: rode node scripts/qa/figuras-no-simulador.mjs ${ids.join(' ')}\n${problems.map(problem => `  - ${problem}`).join('\n')}`);
  } else {
    await mkdir(OUTPUT, { recursive: true });
    for (const [name, content] of files) await writeFile(path.join(OUTPUT, name), content, 'utf8');
    await writeFile(path.join(OUTPUT, INDEX), `${JSON.stringify({ ids: [...new Set([...indexed, ...ids])].sort() }, null, 2)}\n`, 'utf8');
  }
  process.stdout.write(`${JSON.stringify({ ok: true, mode: check ? 'check' : 'write', files: [...files.keys()] })}\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main().catch(error => {
  process.stderr.write(`${error.message}\n`); process.exitCode = 1;
});
