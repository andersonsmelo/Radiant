// HISTÓRICO, não é executado por teste nem pelo gate: registra como a fonte versionada em fontes/femur-proximal-e-quadril.svg foi feita
// a partir do original (slides "Bones of pelvis" (Group 308) e "Femur" (Group 50) de SMART-Bones.pptx, Servier Medical Art, CC BY 4.0; os dois SVG de entrada saem de pptx2svg.py (femur-proximal-e-quadril.pptx2svg.py desta pasta)). A regeneração do spec sai da fonte, por build-spec.mjs.
// Os caminhos relativos abaixo valem para a pasta de trabalho de origem (.superpowers/sdd/2026-11-19-figuras-fase-1/1B/femur-proximal-e-quadril/), que não é versionada.
// Compõe a pelve e o fêmur espelhado; posição e escala relativas (FX, FY, FS) foram ajustadas a olho pelo projeto. A fonte entregue usou VB='2700 2300 1700 1275'.
import { readFileSync, writeFileSync } from 'node:fs';
const VB = process.env.VB ?? '2700 2230 1500 1125';
const FX = +(process.env.FX ?? 3330), FY = +(process.env.FY ?? 2640), FS = +(process.env.FS ?? 1.1);
const body = (f) => readFileSync(f, 'utf8').replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const recolor = (s, map) => s.replace(/(fill|stroke)="#([0-9A-Fa-f]{6})"/g, (m, a, c) => {
  const k = c.toUpperCase(); if (!(k in map)) throw new Error('cor ' + c); return `${a}="${map[k]}"`; });
const DARK = '#0B0D12';
const PELVE = { FADC88: '#4A9EFF', FEEAB2: '#8EC3FF', DDBF6C: '#2B6CC4', FFFFFF: '#D4E7FF', 333333: DARK, 666666: DARK, A5C7E0: '#E6E8EE', '5D9FC9': '#9AA3B5' };
const FEMUR = { FADC88: '#FFC21A', FEEAB2: '#FFE08A', DDBF6C: '#C48F00', FFFFFF: '#FFF1BF', 333333: DARK, '7F7F7F': DARK, A5C7E0: '#B6F6FB', '5D9FC9': '#5EEAF7' };
const pelve = recolor(body('cand/s11_Group_308.svg'), PELVE);
const femur = recolor(body('cand/s14_Group_50.svg'), FEMUR);
const g = `<g transform="translate(${FX} ${FY}) scale(${-FS} ${FS}) translate(-2889 -396)">${femur}</g>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB}">${pelve}${g}</svg>\n`;
writeFileSync(process.env.OUT ?? 'fonte.svg', svg);
console.log('KiB', (svg.length / 1024).toFixed(1));
