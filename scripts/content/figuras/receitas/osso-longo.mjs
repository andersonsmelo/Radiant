// Fonte de osso-longo: o fêmur INTEIRO do kit SMART-Bones, slide "Femur", grupo "Group 50" (Servier Medical Art, CC BY 4.0;
// https://smart.servier.com/wp-content/uploads/2016/10/SMART-Bones.pptx, sha256 48f389211210de0a4383ab588ee04b9a30e57e990909475bdbfb15fa0fc566ee).
// Entrada versionada: s14_Group_50.svg (sha256 d599565d9ba086dfbe088c04245e66c6cda5de067e210612995c3cd6048e84fe, saída de
// femur-proximal-e-quadril.pptx2svg.py sobre o SMART-Bones.pptx). Roda num checkout limpo, sem variável de ambiente.
// Uso (da raiz do repositório): node scripts/content/figuras/receitas/osso-longo.mjs
// Só gira o desenho 90 graus (cabeça à esquerda, côndilos à direita) e recolore; os 45 caminhos ficam, sem corte, sem união, sem forma nova.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const D = dirname(fileURLToPath(import.meta.url));
const inp = join(D, 's14_Group_50.svg'), out = join(D, '..', 'fontes', 'osso-longo.svg');
const DARK = '#0B0D12';
const MAP = { FADC88: '#FFC21A', FEEAB2: '#FFE08A', DDBF6C: '#C48F00', FFFFFF: '#FFF1BF', 333333: DARK, '7F7F7F': DARK, A5C7E0: '#B6F6FB', '5D9FC9': '#5EEAF7' };
const src = readFileSync(inp, 'utf8');
const body = src.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const rec = body.replace(/(fill|stroke)="#([0-9A-Fa-f]{6})"/g, (m, a, c) => { const k = c.toUpperCase(); if (!(k in MAP)) throw new Error('cor ' + c); return `${a}="${MAP[k]}"`; });
const n = (t) => (t.match(/<path\b/g) || []).length;
if (n(rec) !== n(src) || n(rec) !== 45) throw new Error('caminhos mudaram');
// original: x 2326..3429, y 153..4132. rotate(-90): (x,y) -> (y,-x); viewBox 4:3 centrado: x' 43..4243 (4200), y' -4452.5..-1302.5 (3150)
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="43 -4452.5 4200 3150"><g transform="rotate(-90)">${rec}</g></svg>\n`;
writeFileSync(out, svg);
console.log('caminhos', n(rec), (svg.length / 1024).toFixed(1), 'KiB');
