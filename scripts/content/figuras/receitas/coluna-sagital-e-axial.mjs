// Fonte de coluna-sagital-e-axial: corte sagital da coluna lombar, slide 9 ("Vertebral Column (2)", grupo "Group 3") do kit
// SMART-Bones (Servier Medical Art, CC BY 4.0; https://smart.servier.com/wp-content/uploads/2016/10/SMART-Bones.pptx).
// Entrada versionada: coluna-sagital-e-axial.original.svg (sha256 150285d6283c7ce12222821541c14884f33354a056262fe04cf84d35e5f4efc1),
// saída de vertebra-tipica.pptx2svg.py (com suporte a elipse) sobre o SMART-Bones.pptx (sha256 48f389211210de0a4383ab588ee04b9a30e57e990909475bdbfb15fa0fc566ee).
// Só recolore por valor de cor, enquadra em 4:3 pelo viewBox e deixa de copiar os caminhos inteiramente fora do quadro
// (1289 dos 2158; o render no quadro é idêntico ao do original no mesmo viewBox). Coordenadas intactas. Roda num checkout limpo.
// A figura axial (coluna-axial) era um disco em perspectiva e não entrou: registrado para o dono em docs/evidence/2026-11-19-figuras/lote-1F.md.
// Uso (da raiz do repositório): node scripts/content/figuras/receitas/coluna-sagital-e-axial.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const D = dirname(fileURLToPath(import.meta.url));
const hex = (s) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
const toHex = (a) => '#' + a.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
const hsv = ([r, g, b]) => { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; let h = 0; if (d) { if (mx === r) h = ((g - b) / d + 6) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; } return { h: h * 60, s: mx ? d / mx : 0, v: mx }; };
const lum = ([r, g, b]) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
// rampas: do mais escuro ao mais claro
const RAMP = {
  amber: ['#8A6500', '#C48F00', '#FFC21A', '#FFE08A', '#FFF1BF'],
  blue: ['#1F4F91', '#2B6CC4', '#4A9EFF', '#8EC3FF', '#D4E7FF'],
  cyan: ['#0E6E78', '#1FA9B8', '#5EEAF7', '#A8F3FA', '#E0FBFD'],
  gray: ['#2A2F3C', '#5A6275', '#9AA3B5', '#C5CBD8', '#E6E8EE'],
};
const ramp = (fam, l, lo, hi) => {
  const t = Math.min(1, Math.max(0, (l - lo) / (hi - lo))) * 4, i = Math.min(3, Math.floor(t)), f = t - i;
  const a = hex(RAMP[fam][i]), b = hex(RAMP[fam][i + 1]);
  return toHex(a.map((v, k) => v + (b[k] - v) * f));
};
const cache = new Map();
const mapa = (c) => {
  c = c.toUpperCase();
  if (cache.has(c)) return cache.get(c);
  let out;
  const rgb = hex(c), { h, s } = hsv(rgb), l = lum(rgb);
  if (c === '#FFFFFF') out = c;
  else if (c === '#000000') out = '#0B0D12';
  else if (h >= 35 && h <= 60 && s > 0.85) out = ramp('cyan', l, 0.35, 1.19); // medula e raízes (amarelo saturado)
  else if (h >= 35 && h <= 60 && s > 0.15) out = ramp('amber', l, 0.4, 0.95); // osso (creme e tons de terra)
  else if (h >= 170 && h <= 270) out = ramp('blue', l, 0.4, 0.97); // disco
  else if (c === '#6A4A23') out = RAMP.gray[0]; // dura-máter
  else out = ramp('gray', l, 0.2, 1.9); // tecidos moles e ligamentos
  cache.set(c, out);
  return out;
};
const VB = '1842 1790 1562 1172';
const src = readFileSync(join(D, 'coluna-sagital-e-axial.original.svg'), 'utf8')
  .replace(/(fill|stroke)="(#[0-9A-Fa-f]{6})"/g, (_, a, c) => `${a}="${mapa(c)}"`)
  .replace(/viewBox="[^"]*"/, `viewBox="${VB}"`);
// Remove os caminhos INTEIRAMENTE fora do viewBox (as transformações da arte são translações puras).
const [vx, vy, vw, vh] = VB.split(' ').map(Number);
let total = 0, mantidos = 0;
const out = src.replace(/<path transform="translate\(([-\d.]+) ([-\d.]+)\)" d="([^"]*)"([^>]*)\/>/g, (all, tx, ty, d, rest) => {
  total++;
  const nums = [...d.matchAll(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g)].map((m) => [+m[1] + +tx, +m[2] + +ty]);
  const sw = +(rest.match(/stroke-width="([\d.]+)"/)?.[1] ?? 0);
  const xs = nums.map((n) => n[0]), ys = nums.map((n) => n[1]);
  const fora = Math.max(...xs) + sw < vx || Math.min(...xs) - sw > vx + vw || Math.max(...ys) + sw < vy || Math.min(...ys) - sw > vy + vh;
  if (fora) return '';
  mantidos++;
  return all;
});
writeFileSync(join(D, '..', 'fontes', 'coluna-sagital-e-axial.svg'), out);
console.log('coluna-sagital-e-axial: caminhos', total, '-> mantidos', mantidos);
