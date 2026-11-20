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
// O que o app desenha por cima da figura, na largura de 280 pt da régua de toque. As posições vêm do app
// (hotspotTouch.ts): o ponto pequeno do `label` sobre o alvo, e o selo do número FORA do ponto ou da região.
// Em unidades do quadro, para a prévia mostrar o que o app mostra.
const FRAME_PT = 280;
const { BADGE_SIZE, LABEL_DOT, badgeBoxes, labelBadgeBoxes } = loadAppContract('features/lesson-flow/renderers/hotspotTouch.ts');
export const MARKER_PT = LABEL_DOT;
export const BADGE_PT = { width: BADGE_SIZE.width, height: BADGE_SIZE.height };

export function previewHtml(id, regions, lessonTargets) {
  const spec = DIAGRAMS[id];
  const { width: w, height: h } = spec;
  const box = (r, color, label) => `<rect x="${r.x * w}" y="${r.y * h}" width="${r.width * w}" height="${r.height * h}" fill="${color}" fill-opacity="0.18" stroke="${color}" stroke-width="1"/><text x="${r.x * w + 2}" y="${r.y * h + 8}" font-size="7" fill="${color}" stroke="#000" stroke-width="0.3" paint-order="stroke">${label}</text>`;
  const ux = w / FRAME_PT;
  const uy = h / ((FRAME_PT * h) / w);
  const frame = { width: FRAME_PT, height: (FRAME_PT * h) / w };
  const tag = (bx, by, bw, bh, n) => `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="4" fill="#171920" stroke="#00e5ff" stroke-width="1"/><text x="${bx + bw / 2}" y="${by + bh / 2 + 4}" text-anchor="middle" font-size="11" font-weight="700" fill="#ffffff">${n}</text>`;
  // Os selos de um item são postos em conjunto (badgeBoxes / labelBadgeBoxes), como no app: o alvo carrega `item`.
  const groups = new Map();
  for (const t of lessonTargets) {
    const key = `${t.item ?? 0}:${t.width === undefined ? 'p' : 'r'}`;
    groups.set(key, [...(groups.get(key) ?? []), t]);
  }
  const sealOf = new Map();
  for (const group of groups.values()) {
    const boxes = (group[0].width === undefined ? labelBadgeBoxes : badgeBoxes)(group, frame);
    group.forEach((t, i) => sealOf.set(t, boxes[i]));
  }
  // Ponto de `label`: o marcador pequeno (LABEL_DOT) exatamente sobre o alvo, e o número num selo ao lado.
  const dot = (t, n) => {
    const s = sealOf.get(t);
    return `<circle cx="${t.x * w}" cy="${t.y * h}" r="${(LABEL_DOT / 2) * ux}" fill="#171920" stroke="#00e5ff" stroke-width="1.2"/>${tag(s.left * ux, s.top * uy, s.width * ux, s.height * uy, n)}`;
  };
  // Região de `hotspot` e `risk-hunt`: o selo opaco fora da região, na posição de badgeBoxes.
  const seal = (r, n) => {
    const s = sealOf.get(r);
    return tag(s.left * ux, s.top * uy, s.width * ux, s.height * uy, n);
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
  let item = 0;
  const walk = (node) => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (!node || typeof node !== 'object') return;
    if (node.diagramId === id) { item += 1; targets.push(...(node.points ?? []).map((p, i) => ({ ...p, n: i + 1, item })), ...(node.regions ?? []).map((r, i) => ({ ...r, n: i + 1, item }))); }
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
