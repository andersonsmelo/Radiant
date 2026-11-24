#!/usr/bin/env node
// Compõe fontes/seios-da-face.svg a partir de duas obras do mesmo kit (Servier Medical Art, CC BY 4.0), já em SVG por pptx2svg.mjs:
// à esquerda "Paranasal sinuses" (vista de frente), à direita "Nasal cavity" (corte sagital). Só recolore, posiciona e escala.
import { readFileSync, writeFileSync } from 'node:fs';
const here = new URL('.', import.meta.url).pathname;
const parse = (f) => {
  const t = readFileSync(here + f, 'utf8');
  return [...t.matchAll(/<path id="([^"]*)" d="([^"]*)" fill="([^"]*)"(?: stroke="([^"]*)" stroke-width="([^"]*)")?/g)].map((m) => {
    const n = [...m[2].matchAll(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g)].map((p) => [+p[1], +p[2]]);
    const xs = n.map((p) => p[0]), ys = n.map((p) => p[1]);
    return { id: m[1], num: +m[1].split('-')[1], d: m[2], fill: m[3], stroke: m[4], sw: m[5], bb: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] };
  });
};
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => '#' + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');
const light = (c, t = 0.35) => mix(c, '#FFFFFF', t), dark = (c, t = 0.3) => mix(c, '#000000', t);
const inside = (p, b) => { const cx = (p.bb[0] + p.bb[2]) / 2, cy = (p.bb[1] + p.bb[3]) / 2; return cx >= b[0] && cx <= b[2] && cy >= b[1] && cy <= b[3]; };
const BLUE = '#4A9EFF', CYAN = '#5EEAF7', AMBER = '#FFC21A', G1 = '#E6E8EE', G2 = '#9AA3B5';

// ---- A: vista de frente (kit "Paranasal sinuses", Group 3). Sem a cabeça (pele, orelhas, pescoço, boca, linha do cabelo): ficam seios, olhos, sobrancelhas e nariz.
const A = parse('cand/sinus-vec.svg');
const dropA = new Set(); // nada é descartado: o que passa do quadro sai pelo enquadramento
// Bases: 24 e 29 = massas principais (frontal + maxilar + passagem nasal); as demais, células etmoidais.
const mainA = A.filter((p) => [33, 38].includes(p.num));
const ethA = A.filter((p) => [32, 34, 35, 36, 37, 39].includes(p.num));
const own = (p) => { const e = ethA.find((q) => inside(p, q.bb) && q !== p); if (e) return CYAN; const m = mainA.find((q) => inside(p, q.bb)); return m ? BLUE : null; };
const recA = (p) => {
  if (dropA.has(p.num)) return null;
  const f = p.fill.toUpperCase();
  let fill = p.fill, stroke = p.stroke;
  if (f === '#C8E8F3') fill = '#2A2F3B';
  else if (f === '#9ED7E8') fill = G2;
  else if (f === '#F2CBDC') { // parede (rim): neutra, e ciano nas células etmoidais
    const o = [ethA.find((q) => inside(p, q.bb) || (p.bb[0] <= q.bb[0] + 4 && p.bb[2] >= q.bb[2] - 4 && p.bb[1] <= q.bb[1] + 4 && p.bb[3] >= q.bb[3] - 4))];
    fill = o[0] ? light(CYAN, 0.55) : G1;
  } else if (f === '#D18DB8') fill = p.num === 33 || p.num === 38 ? BLUE : CYAN;
  else if (['#DD9EC3', '#BD72A8', '#FFFFFF'].includes(f)) {
    const c = own(p) ?? BLUE;
    fill = f === '#DD9EC3' ? light(c, 0.3) : f === '#BD72A8' ? dark(c, 0.3) : light(c, 0.7);
  }
  if (stroke === '#9ED7E8') stroke = G2; else if (stroke === '#343434') stroke = '#171920';
  return { ...p, fill, stroke };
};
// ---- B: corte sagital (kit "Nasal cavity", Group 3)
const B = parse('cand/s4-Group_3.svg');
const FRONT = [2120, 1373, 2484, 1899], SPH = [3347, 1915, 3921, 2610];
const recB = (p) => {
  const f = p.fill.toUpperCase();
  let fill = p.fill, stroke = p.stroke;
  const base = inside(p, SPH) ? AMBER : inside(p, FRONT) ? BLUE : null;
  const MAP = { '#F2C9AA': '#6B7488', '#E5DFAE': G2, '#DD9EC3': '#232733', '#CF86B4': '#2F3544', '#E8B8D3': '#3A4152', '#E0A9CA': '#2F3544', '#863187': '#3A4152', '#B370A8': '#4A5163', '#CCA3C8': '#5A6275', '#CCD6E1': '#C3C9D6', '#F8E6BD': '#C3C9D6', '#F0F2F3': G1, '#F6EA62': '#4A5163', '#933E8D': '#4A5163', '#D2ABCD': '#6B7488', '#F9E2D2': '#C3C9D6', '#F3BF9D': G2, '#A57E5C': '#5A6275' };
  if (f === '#D18DB8') fill = f === '#D18DB8' && inside(p, SPH) ? AMBER : BLUE;
  else if (base && ['#BD72A8', '#DD9EC3', '#FFFFFF'].includes(f)) fill = f === '#BD72A8' ? dark(base, 0.3) : f === '#DD9EC3' ? light(base, 0.3) : light(base, 0.7);
  else if (MAP[f]) fill = MAP[f];
  else if (f === '#FFFFFF' && p.stroke == null) fill = G1;
  if (stroke === '#343434' || stroke === '#843F8E' || stroke === '#A57E5C') stroke = '#171920';
  if (stroke === '#FFFFFF') stroke = G1;
  return { ...p, fill, stroke };
};
const out = (arr) => arr.filter(Boolean).map((p) => `<path d="${p.d}" fill="${p.fill}"${p.stroke ? ` stroke="${p.stroke}" stroke-width="${p.sw}" stroke-linejoin="round"` : ''}/>`).join('');
const Ar = A.map(recA), Br = B.map(recB);
// Cada vista ocupa o quadro 320x240 inteiro; o que passa do quadro é cortado pelo viewBox (sem clipPath).
export const FR = { s: 0.15, cx: 1810, cy: 2180 }, CO = { s: 0.1, cx: 2652, cy: 2200 };
const frame = (arr, { s, cx, cy }) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240"><g transform="translate(${(160 - cx * s).toFixed(3)} ${(120 - cy * s).toFixed(3)}) scale(${s})">${out(arr)}</g></svg>\n`;
writeFileSync(here + 'composto-frente.svg', frame(Ar, FR));
writeFileSync(here + 'composto-corte.svg', frame(Br, CO));
console.log('caminhos frente', Ar.filter(Boolean).length, 'de', A.length, '| corte', Br.length, 'de', B.length);
