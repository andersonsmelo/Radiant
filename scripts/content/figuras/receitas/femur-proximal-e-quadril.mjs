// Compõe pelve (Group 308, slide "Bones of pelvis") + fêmur (Group 50, slide "Femur") do SMART-Bones (Servier, CC BY 4.0).
// Entradas: s11_Group_308.svg e s14_Group_50.svg nesta pasta (saída de pptx2svg.py sobre original.pptx).
// Padrão = a figura entregue; variáveis só para exploração (TX, TY, VB, OUT).
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const D = dirname(fileURLToPath(import.meta.url));
const VB = process.env.VB ?? '2700 2300 1700 1275';
const TX = +(process.env.TX ?? 3415), TY = +(process.env.TY ?? 2610), FS = 1.05;
const body = (f) => readFileSync(join(D, f), 'utf8').replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const recolor = (s, map) => s.replace(/(fill|stroke)="#([0-9A-Fa-f]{6})"/g, (m, a, c) => {
  const k = c.toUpperCase(); if (!(k in map)) throw new Error('cor ' + c); return `${a}="${map[k]}"`; });
const DARK = '#0B0D12';
const PELVE = { FADC88: '#4A9EFF', FEEAB2: '#8EC3FF', DDBF6C: '#2B6CC4', FFFFFF: '#D4E7FF', 333333: DARK, 666666: DARK, A5C7E0: '#E6E8EE', '5D9FC9': '#9AA3B5' };
const FEMUR = { FADC88: '#FFC21A', FEEAB2: '#FFE08A', DDBF6C: '#C48F00', FFFFFF: '#FFF1BF', 333333: DARK, '7F7F7F': DARK, A5C7E0: '#B6F6FB', '5D9FC9': '#5EEAF7' };
const pelve = recolor(body('s11_Group_308.svg'), PELVE);
const femur = recolor(body('s14_Group_50.svg'), FEMUR);
// espelhado na horizontal (scale -FS) e só transladado; (2889,396) é a origem do grupo na fonte
const g = `<g transform="translate(${TX} ${TY}) scale(${-FS} ${FS}) translate(-2889 -396)">${femur}</g>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB}">${pelve}${g}</svg>\n`;
writeFileSync(process.env.OUT ?? join(D, 'fonte.svg'), svg);
console.log('KiB', (svg.length / 1024).toFixed(1));
