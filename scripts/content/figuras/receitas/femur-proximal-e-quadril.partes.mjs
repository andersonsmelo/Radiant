// gera pelve.svg e femur.svg separados (mesmas cores e transformação da composição) para medir. uso: TX=.. TY=.. node partes.mjs
import { readFileSync, writeFileSync } from 'node:fs';
const VB = process.env.VB ?? '3100 2300 900 700';
const TX = +(process.env.TX ?? 3415), TY = +(process.env.TY ?? 2610), FS = 1.05;
const body = (f) => readFileSync(f, 'utf8').replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const svg = (b) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB}"><rect x="-9999" y="-9999" width="30000" height="30000" fill="#FF00FF"/>${b}</svg>`;
writeFileSync('pelve.svg', svg(body('s11_Group_308.svg')));
writeFileSync('femur.svg', svg(`<g transform="translate(${TX} ${TY}) scale(${-FS} ${FS}) translate(-2889 -396)">${body('s14_Group_50.svg')}</g>`));
