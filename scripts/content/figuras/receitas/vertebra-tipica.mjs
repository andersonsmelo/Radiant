// HISTÓRICO, não é executado por teste nem pelo gate: registra como a fonte versionada em fontes/vertebra-tipica.svg foi feita
// a partir do original (slide "Vertebra" de SMART-Bones.pptx, Servier Medical Art, CC BY 4.0; Group_139.svg sai de pptx2svg.py (vertebra-tipica.pptx2svg.py desta pasta)). A regeneração do spec sai da fonte, por build-spec.mjs.
// Os caminhos relativos abaixo valem para a pasta de trabalho de origem (.superpowers/sdd/2026-11-19-figuras-fase-1/1B/vertebra-tipica/), que não é versionada.
// Fonte e spec de vertebra-tipica. Entrada: cand/Group_139.svg (grupo "Group 139" do slide "Vertebra" de SMART-Bones.pptx, Servier, CC BY 4.0,
// renderizado por pptx2svg.py sem alterar as formas). Recolore por forma (corpo âmbar, arco azul, facetas ciano) e grava a fonte e o spec.
import { readFileSync, writeFileSync } from 'node:fs';
import { convertSvg } from '../../../../../scripts/content/figuras/convert.mjs';
const src = readFileSync('cand/Group_139.svg', 'utf8');
const vb = src.match(/viewBox="([^"]*)"/)[1];
const BODY = new Set([1, 3, 23, 24, 44, 45, 55, 58, 59]);
const PAL = {
  body: { FEEAB2: '#FFE08A', FADC88: '#FFC21A', DDBF6C: '#C48F00', FFFFFF: '#FFF1BF', '9C7A25': '#8A6500', '000000': '#0B0D12' },
  arch: { FEEAB2: '#8EC3FF', FADC88: '#4A9EFF', DDBF6C: '#2B6CC4', FFFFFF: '#D4E7FF', '9C7A25': '#1F4F91', '000000': '#0B0D12' },
  facet: { A5C7E0: '#B6F6FB', '5D9FC9': '#5EEAF7' },
};
let i = 0;
const paths = [...src.matchAll(/<path transform="([^"]*)" d="([^"]*)" fill="([^"]*)"([^>]*)\/>/g)].map((m) => {
  const idx = i++;
  const [, tr, d, fill, rest] = m;
  const nums = [...d.matchAll(/(-?[\d.]+),(-?[\d.]+)/g)].map((a) => [+a[1], +a[2]]);
  const t = tr.match(/translate\(([-\d.]+) ([-\d.]+)\)/);
  const cy = +t[2] + (Math.min(...nums.map((a) => a[1])) + Math.max(...nums.map((a) => a[1]))) / 2;
  const key = (c) => c.replace('#', '').toUpperCase();
  const isFacet = fill !== 'none' ? ['A5C7E0', '5D9FC9'].includes(key(fill)) : false;
  const kind = isFacet ? 'facet' : BODY.has(idx) || cy < 1500 ? 'body' : 'arch';
  const map = PAL[kind];
  const col = (c) => map[key(c)] ?? (() => { throw new Error(`cor ${c} (forma ${idx}, ${kind})`); })();
  const f = fill === 'none' ? 'none' : col(fill);
  const rest2 = rest.replace(/stroke="(#[0-9A-Fa-f]{6})"/, (_, c) => `stroke="${isFacet ? PAL.facet[key(c)] ?? '#0B0D12' : col(c)}"`);
  return `<path transform="${tr}" d="${d}" fill="${f}"${rest2}/>`;
});
const fonte = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${paths.join('')}</svg>\n`;
writeFileSync('../../../../../scripts/content/figuras/fontes/vertebra-tipica.svg', fonte);
// ---- O resto do gerar.mjs original (spec) foi substituído pela entrada de build-spec.mjs. ----
