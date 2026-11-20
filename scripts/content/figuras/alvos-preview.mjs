#!/usr/bin/env node
// Prévia dos alvos: a figura no quadro, as regiões declaradas em content-manifest/rtg-2026/figuras/<id>.alvos.json
// (retângulos âmbar) e os alvos de cada aula sobre ela (pontos e regiões ciano). Abra o PNG e confira a olho.
//   node scripts/content/figuras/alvos-preview.mjs <diagramId> <saida.png> [aulas.json...]
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { findChrome } from './convert.mjs';

const { loadAppContract } = createRequire(import.meta.url)('../load-app-contract.cjs');
const { DIAGRAMS } = loadAppContract('ui/diagrams/diagramRegistry.ts');
const { diagramSvgAt } = loadAppContract('ui/diagrams/diagramMotion.ts');
const root = fileURLToPath(new URL('../../../', import.meta.url));
const SCALE = 3;
// O que o app desenha por cima da figura, na largura de 280 pt da régua de toque (LabelStepRenderer: MARKER 28 pt, opaco,
// centrado no ponto; hotspotTouch.ts: selo de 36 x 24 pt no canto da região). Em unidades do quadro, para a prévia mostrar
// o que fica escondido embaixo.
const FRAME_PT = 280;
// As medidas vêm do app: o selo, de hotspotTouch.ts; o marcador, do texto do LabelStepRenderer (const privada de um .tsx
// com React Native, que o carregador de contrato não executa), e a leitura falha alto se a constante sumir.
const { BADGE_SIZE } = loadAppContract('features/lesson-flow/renderers/hotspotTouch.ts');
const marker = /^const MARKER = (\d+);/m.exec(readFileSync(path.join(root, 'radiant-app/src/features/lesson-flow/renderers/LabelStepRenderer.tsx'), 'utf8'));
if (!marker) throw new Error('LabelStepRenderer.tsx não declara mais "const MARKER = <número>;"');
export const MARKER_PT = Number(marker[1]);
export const BADGE_PT = { width: BADGE_SIZE.width, height: BADGE_SIZE.height };

export function previewHtml(id, regions, lessonTargets) {
  const spec = DIAGRAMS[id];
  const { width: w, height: h } = spec;
  const box = (r, color, label) => `<rect x="${r.x * w}" y="${r.y * h}" width="${r.width * w}" height="${r.height * h}" fill="${color}" fill-opacity="0.18" stroke="${color}" stroke-width="1"/><text x="${r.x * w + 2}" y="${r.y * h + 8}" font-size="7" fill="${color}" stroke="#000" stroke-width="0.3" paint-order="stroke">${label}</text>`;
  const ux = w / FRAME_PT;
  const uy = h / ((FRAME_PT * h) / w);
  // Ponto de `label`: o marcador numerado opaco, de raio MARKER_PT / 2, centrado no ponto.
  const dot = (t, n) => `<circle cx="${t.x * w}" cy="${t.y * h}" r="${(MARKER_PT / 2) * ux}" fill="#171920" stroke="#00e5ff" stroke-width="1.2"/><text x="${t.x * w}" y="${t.y * h + 3.5}" text-anchor="middle" font-size="11" font-weight="700" fill="#ffffff">${n}</text>`;
  // Região de `hotspot` e `risk-hunt`: o selo opaco no canto, empurrado para dentro do quadro (badgeBox).
  const seal = (r, n) => {
    const bw = BADGE_PT.width * ux, bh = BADGE_PT.height * uy;
    const bx = Math.max(0, Math.min(r.x * w, w - bw)), by = Math.max(0, Math.min(r.y * h, h - bh));
    return `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="4" fill="#171920" stroke="#00e5ff" stroke-width="1"/><text x="${bx + bw / 2}" y="${by + bh / 2 + 4}" text-anchor="middle" font-size="11" font-weight="700" fill="#ffffff">${n}</text>`;
  };
  const overlay = [
    ...regions.map((r) => box(r, '#ffb300', r.nome)),
    ...lessonTargets.map((t) => (t.width === undefined ? dot(t, t.n) : `${box(t, '#00e5ff', t.label)}${seal(t, t.n)}`)),
  ].join('');
  return `<body style="margin:0"><div style="position:relative;width:${w * SCALE}px;height:${h * SCALE}px">${diagramSvgAt(spec, 0).replace('<svg ', `<svg style="width:${w * SCALE}px;height:${h * SCALE}px" `)}<svg viewBox="0 0 ${w} ${h}" style="position:absolute;left:0;top:0;width:${w * SCALE}px;height:${h * SCALE}px">${overlay}</svg></div></body>`;
}

function main() {
  const [id, out, ...lessonFiles] = process.argv.slice(2);
  if (!id || !out) throw new Error('uso: alvos-preview.mjs <diagramId> <saida.png> [aulas.json...]');
  const regions = JSON.parse(readFileSync(path.join(root, `content-manifest/rtg-2026/figuras/${id}.alvos.json`), 'utf8'));
  const targets = [];
  const walk = (node) => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (!node || typeof node !== 'object') return;
    if (node.diagramId === id) targets.push(...(node.points ?? []).map((p, i) => ({ ...p, n: i + 1 })), ...(node.regions ?? []).map((r, i) => ({ ...r, n: i + 1 })));
    Object.values(node).forEach(walk);
  };
  for (const file of lessonFiles) walk(JSON.parse(readFileSync(file, 'utf8')));
  const chrome = findChrome();
  if (!chrome) throw new Error('Chrome não encontrado (defina CHROME_PATH)');
  const dir = mkdtempSync(path.join(tmpdir(), 'alvos-'));
  try {
    writeFileSync(path.join(dir, 'p.html'), previewHtml(id, regions, targets));
    const { width: w, height: h } = DIAGRAMS[id];
    execFileSync(chrome, ['--headless', '--disable-gpu', `--screenshot=${path.resolve(out)}`, `--window-size=${w * SCALE},${h * SCALE}`, `file://${path.join(dir, 'p.html')}`], { stdio: 'ignore' });
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
