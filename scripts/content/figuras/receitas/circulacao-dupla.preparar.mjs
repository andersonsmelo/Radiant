// node preparar.mjs (da raiz): original -> fonte recolorida, recortada pelo viewBox (nenhum caminho apagado)
import { readFileSync, writeFileSync } from 'node:fs';
const WS = '.superpowers/sdd/2026-11-19-figuras-fase-1/1E/circulacao-dupla';
let s = readFileSync(`${WS}/original.svg`, 'utf8');
const MAP = { // cor do autor -> cor do app (mesmo papel)
  '#3a89c5': '#4A9EFF', // sangue pobre em oxigênio
  '#bf473e': '#FFC21A', // sangue rico (vermelho do autor -> âmbar)
  '#b73a37': '#FFC21A',
  '#e07e7e': '#2F7F89', // sombra dos pulmões
  '#f6a8a7': '#3E9AA6', // pulmões
  '#ffd3bb': '#E6E8EE', // corpo
  '#e5a788': '#9AA3B5', // parede do coração
};
for (const [a, b] of Object.entries(MAP)) s = s.replace(new RegExp(a, 'gi'), b);
s = s.replace(/<metadata>[\s\S]*?<\/metadata>/, ''); // dados privados do Illustrator (pgf), não são desenho
s = s.replace('viewBox="0 0 400 400"', 'viewBox="-30 -3 460 345"');
writeFileSync('scripts/content/figuras/fontes/circulacao-dupla.svg', s);
console.log([...new Set(s.match(/#[0-9a-fA-F]{6}\b|#fff\b/g))]);
