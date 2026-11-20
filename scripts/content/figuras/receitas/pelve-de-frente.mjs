// Fonte de pelve-de-frente: slide "Bones of pelvis" (grupo "Group 308"), kit SMART-Bones, Servier Medical Art (CC BY 4.0;
// https://smart.servier.com/wp-content/uploads/2016/10/SMART-Bones.pptx, sha256 48f389211210de0a4383ab588ee04b9a30e57e990909475bdbfb15fa0fc566ee).
// Entrada versionada: s11_Group_308.svg (sha256 be524a5ef90d5024484e3c082f50f95862b425e0229d6c2b73bc2809d7601883, saída de
// femur-proximal-e-quadril.pptx2svg.py sobre o SMART-Bones.pptx). Só recolore e enquadra; nenhum dos 129 caminhos é tocado. Roda num checkout limpo.
// Uso (da raiz do repositório): node scripts/content/figuras/receitas/pelve-de-frente.mjs   (depois, pelve-de-frente-recorte.mjs)
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const D = dirname(fileURLToPath(import.meta.url));
const DARK = '#0B0D12';
// Uma cor para o osso, como o autor o desenhou (ílio, sacro, púbis e ísquio não têm divisa na arte): azul do app com os
// tons derivados do sombreado do autor; sínfise púbica em cinza claro, como no autor (azul-acinzentado).
const MAP = { FADC88: '#4A9EFF', FEEAB2: '#8EC3FF', DDBF6C: '#2B6CC4', FFFFFF: '#D4E7FF', 333333: DARK, 666666: DARK, A5C7E0: '#E6E8EE' };
const recolor = (s) => s.replace(/(fill|stroke)="#([0-9A-Fa-f]{6})"/g, (m, a, c) => {
  const k = c.toUpperCase(); if (!(k in MAP)) throw new Error('cor ' + c); return `${a}="${MAP[k]}"`; });
const src = readFileSync(join(D, 's11_Group_308.svg'), 'utf8');
const body = recolor(src.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, ''));
// Caixa do autor: 2902 1200 2428 1979. Quadro 4:3 com 3% de margem em cima e embaixo, centrado.
const bh = 1979, bw = 2428, H = Math.round(bh / 0.94), W = Math.round(H * 4 / 3);
const vx = Math.round(2902 + bw / 2 - W / 2), vy = Math.round(1200 + bh / 2 - H / 2);
writeFileSync(join(D, '..', 'fontes', 'pelve-de-frente.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vx} ${vy} ${W} ${H}">${body}</svg>\n`);
