// HISTÓRICO, não é executado por teste nem pelo gate: registra como a fonte versionada em fontes/ossos-do-pe.svg foi feita
// a partir do original (Wikimedia Commons, 202110_Dorsal_view_of_bones_of_right_foot.svg, DBCLS, CC BY 4.0). A regeneração do spec sai da fonte, por build-spec.mjs.
// Os caminhos relativos valem para a pasta de trabalho de origem (.superpowers/sdd/2026-11-19-figuras-fase-1/1C/ossos-do-pe/), que não é versionada.
// Uso: node prep.mjs <original.svg> <fonte.svg>
// Prepara a fonte do pé: recolore por osso (sem mexer nas formas), gira 90 graus (calcanhar à esquerda, dedos à direita) e tira <style>/<switch>.
import { readFileSync, writeFileSync } from 'node:fs';
const src = readFileSync(process.argv[2], 'utf8');
const start = src.indexOf('<g i:extraneous="self">') + '<g i:extraneous="self">'.length;
const end = src.lastIndexOf('</g>', src.lastIndexOf('</switch>'));
const inner = src.slice(start, end);
// grupos de nível 1
const groups = []; let depth = 0, from = -1;
for (const m of inner.matchAll(/<g>|<\/g>/g)) {
  if (m[0] === '<g>') { if (depth++ === 0) from = m.index; }
  else if (--depth === 0) groups.push(inner.slice(from, m.index + 4));
}
if (groups.length !== 28) throw new Error('grupos: ' + groups.length);
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const toHex = (a) => '#' + a.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
const mix = (h, t) => { const c = hex(h); const to = t >= 0 ? 255 : 0; return toHex(c.map((v) => v + (to - v) * Math.abs(t))); };
const lum = (h) => { const [r, g, b] = hex(h); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; };
const A = '#EEF0F5', B = '#C3C9D6', C = '#A6AEC0', BLUE = '#4A9EFF', AMBER = '#FFC21A';
const NAME = {};
const col = {};
const set = (ids, c, nome) => ids.forEach((i) => { col[i] = c; NAME[i] = nome; });
set([0], A, 'calcâneo'); set([19, 20], B, 'tálus'); set([18], A, 'navicular'); set([17], B, 'cuboide');
set([16], C, 'cuneiforme lateral'); set([5], B, 'cuneiforme intermédio'); set([21], C, 'cuneiforme medial');
set([2], BLUE, 'MT1'); set([8], mix(BLUE, .18), 'MT2'); set([12], BLUE, 'MT3'); set([11], mix(BLUE, .18), 'MT4'); set([15], BLUE, 'MT5');
set([1], mix(BLUE, .4), 'sesamoide');
// falanges: dedo 1 (22 prox, 27 dist), dedo 2 (4, 3, 26), 3 (7, 6, 25), 4 (10, 9, 24), 5 (14, 13, 23); proximal âmbar, seguintes alternam
for (const [ids] of [[[22, 27]], [[4, 3, 26]], [[7, 6, 25]], [[10, 9, 24]], [[14, 13, 23]]]) ids.forEach((i, k) => { col[i] = k % 2 ? mix(AMBER, .2) : AMBER; NAME[i] = 'falange'; });
const roles = (base) => {
  const light = lum(base) > 0.75;
  const cart = (t) => mix(base, light ? -t * 0.35 : t);
  return { st0: base, st1: mix(base, -0.25), st4: mix(base, -0.55), st6: mix(base, 0.45), st7: mix(base, -0.12), st5: cart(0.5), st2: cart(0.28), st3: cart(0.2), st8: cart(0.62) };
};
const out = groups.map((g, i) => { const R = roles(col[i]); return g.replace(/<path class="(st\d)"/g, (_, c) => `<path fill="${R[c]}"`); });
const body = out.join('\n');
// rotate(90): (x,y) -> (-y,x); caixa do pé no original 132..269 x 13..387 (com folga de 2)
const [x0, y0, x1, y1] = [130, 11, 271, 389];
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-y1} ${x0} ${y1 - y0} ${x1 - x0}"><g transform="rotate(90)">\n${body}\n</g></svg>\n`;
writeFileSync(process.argv[3], svg);
console.log(svg.length, 'bytes', JSON.stringify(NAME));
