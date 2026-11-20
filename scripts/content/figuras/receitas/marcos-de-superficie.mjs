// HISTÓRICO, não é executado por teste nem pelo gate: registra como a fonte versionada em fontes/marcos-de-superficie.svg foi feita
// a partir do original (Wikimedia Commons, Human_skeleton_front_no-text_no-color.svg, LadyofHats, domínio público). A regeneração do spec sai da fonte, por build-spec.mjs.
// Os caminhos relativos valem para a pasta de trabalho de origem (.superpowers/sdd/2026-11-19-figuras-fase-1/1C/marcos-de-superficie/), que não é versionada.
// Passo 1: bbox.mjs mede cada caminho com o Chrome (receita marcos-de-superficie.bbox.mjs); passo 2: este prep.mjs <pasta com original.svg e bbox.json>.
// Versão de 2026-11-20 (integração): antebraços e mãos que entram no quadro voltam à fonte, em cinza (antes saíam), e as coordenadas dos caminhos passam a 0,1 para caber no teto de 240 KiB.
// Versão de 2026-11-20 (correção I2): as escápulas (caminhos 214, 215, 219, 220 do original) ficam cinza e as primeiras costelas (426 a 428 e 433 a 435) azuis, por índice, sem mexer em forma; antes a classificação por centro de caixa as trocava.
// Prepara a fonte: recorta o tronco e a pelve, recolore por região (sem mexer nas formas) e tira o fundo e a cabeça.
// Uso: node prep.mjs <WS>   (le <WS>/original.svg e <WS>/bbox.json; grava scripts/content/figuras/fontes/marcos-de-superficie.svg)
import { readFileSync, writeFileSync } from 'node:fs';
const ws = process.argv[2];
const src = readFileSync(`${ws}/original.svg`, 'utf8');
const bb = JSON.parse(readFileSync(`${ws}/bbox.json`, 'utf8'));
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const toHex = (a) => '#' + a.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
const mix = (h, t) => { const c = hex(h); const to = t >= 0 ? 255 : 0; return toHex(c.map((v) => v + (to - v) * Math.abs(t))); };
const BLUE = '#4A9EFF', AMBER = '#FFC21A', CYAN = '#5EEAF7', LIGHT = '#E6E8EE', GRAY = '#9AA3B5';
const BOX = [-7, 148, 470, 353]; // x, y, w, h do recorte, no sistema do original
const MID = 207;
const ESCAPULAS = new Set([214, 215, 219, 220]); // índices no original
const PRIMEIRAS_COSTELAS = new Set([426, 427, 428, 433, 434, 435]);
const klass = (cx, cy, w) => {
  if (cy > 440 && (cx < 118 || cx > 300)) return GRAY; // antebraços e mãos (cinza dos braços): antes saíam da fonte
  if (Math.abs(cx - MID) < 6 && cy > 195 && cy < 272 && w >= 18) return AMBER; // esterno
  if (cy >= 290 && cy <= 425 && Math.abs(cx - MID) < 8 && w < 100) return CYAN; // coluna e sacro
  if (cy < 215 || cx < 112 || cx > 305) return GRAY; // clavículas, escápulas, braços
  if (cy < 372) return mix(BLUE, 0.35); // costelas e cartilagens
  if (cy >= 428 && (cx < 166 || cx > 250)) return mix(AMBER, 0.45); // fêmures
  return LIGHT; // pelve
};
let i = 0, kept = 0;
let body = src.slice(src.indexOf('<rect'), src.lastIndexOf('</svg>'));
body = body.replace(/<rect[^>]*\/>/, '').replace(/<linearGradient[\s\S]*?<\/linearGradient>/g, '');
body = body.replace(/<path\b[\s\S]*?\/>/g, (p) => {
  const idx = i;
  const [x, y, w, h] = bb[i++];
  if (p.includes('url(')) return '';
  if (x > BOX[0] + BOX[2] || x + w < BOX[0] || y > BOX[1] + BOX[3] || y + h < BOX[1]) return '';
  const body0 = /fill="none"/.test(p) && /stroke="#CFD0D2"/.test(p);
  if (body0) return p.replace('#CFD0D2', '#5B6478');
  const base = ESCAPULAS.has(idx) ? GRAY : PRIMEIRAS_COSTELAS.has(idx) ? mix(BLUE, 0.35) : klass(x + w / 2, y + h / 2, w);
  if (!base) return '';
  kept++;
  const f = { '#FFFFFF': base, '#E2E3E4': mix(base, -0.1), '#CFD0D2': mix(base, -0.25), '#BCBEC0': mix(base, -0.4), '#9D9FA1': mix(base, -0.5), '#DDC16D': mix(base, -0.15), '#CDB35C': mix(base, -0.2) };
  return p.replace(/fill="(#[0-9A-F]{6})"/g, (_, c) => `fill="${f[c] ?? base}"`).replace(/stroke="#(000000|967348)"/g, 'stroke="#10131A"')
    .replace(/(\d+\.\d{2})\d+/g, '$1')
    .replace(/ d="([^"]*)"/, (_, d) => ' d="' + d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(parseFloat(n) * 10) / 10)) + '"'); // coordenadas dos caminhos a 0,1: as mãos cabem sob o teto de 240 KiB
});
body = body.replace(/<g>\s*<\/g>/g, '').replace(/\s+/g, ' ');
if (i !== bb.length) throw new Error('caminhos ' + i + ' vs ' + bb.length);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${BOX.join(' ')}">${body}</svg>\n`;
writeFileSync('scripts/content/figuras/fontes/marcos-de-superficie.svg', svg);
console.log(kept, 'caminhos', svg.length, 'bytes');
