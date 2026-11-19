// Grava os diagramas em `.svg` para revisão visual.
// Uso: node radiant-app/scripts/render-diagrams.mjs <pasta> [id...]
// `<id>.svg` no quadro de pôster; para laço, também `<id>@0.svg`, `@25`, `@50`, `@75`.
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import appContract from '../../scripts/content/load-app-contract.cjs';

const { DIAGRAMS, DIAGRAM_IDS } = appContract.loadAppContract('ui/diagrams/diagramRegistry.ts');
const { diagramSvgAt } = appContract.loadAppContract('ui/diagrams/diagramMotion.ts');

// O diagrama não desenha fundo: o painel escuro vem do quadro do app. Aqui o fundo
// entra só para a revisão ver o que o aluno vê.
const withPanel = (svg, spec) => svg.replace('>', `><rect width="${spec.width}" height="${spec.height}" fill="#171920"/>`);

const [dir, ...wanted] = process.argv.slice(2);
if (!dir) {
  console.error('uso: node radiant-app/scripts/render-diagrams.mjs <pasta> [id...]');
  process.exit(2);
}
const ids = wanted.length ? wanted : DIAGRAM_IDS;
const unknown = ids.filter((id) => !DIAGRAMS[id]);
if (unknown.length) {
  console.error(`diagrama desconhecido: ${unknown.join(', ')}`);
  process.exit(2);
}

await mkdir(dir, { recursive: true });
for (const id of ids) {
  const spec = DIAGRAMS[id];
  const files = { [`${id}.svg`]: spec.posterAt ?? 0 };
  if (spec.periodMs) for (const pct of [0, 25, 50, 75]) files[`${id}@${pct}.svg`] = pct / 100;
  for (const [name, progress] of Object.entries(files)) {
    await writeFile(path.join(dir, name), `${withPanel(diagramSvgAt(spec, progress), spec)}\n`);
    console.log(path.join(dir, name));
  }
}
