// HISTÓRICO, não é executado por teste nem pelo gate: registra como a fonte versionada em fontes/linhas-do-cranio.svg foi feita
// a partir do original (limpar rótulos, recolorir). A regeneração do spec sai da fonte, por build-spec.mjs.
// Os caminhos relativos abaixo valem para a pasta de trabalho de origem (.superpowers/sdd/.../1A/linhas-do-cranio/), que não é versionada.
// Gera a fonte (scripts/content/figuras/fontes/linhas-do-cranio.svg: só a arte, sem linhas) e o spec
// (radiant-app/src/ui/diagrams/specs/linhas-do-cranio.ts: arte importada + camadas de linhas em código).
// Uso, da raiz da worktree, com Node 20:
//   node .superpowers/sdd/2026-11-19-figuras-fase-1/1A/linhas-do-cranio/gerar.mjs
// Entradas: original.svg (Human skull front bones, LadyofHats) e scripts/content/figuras/fontes/cranio-de-perfil-ossos.svg
// (Human skull side bones, LadyofHats, já limpo). Precisa do Chrome (conversor versionado).
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { convertSvg } from '../../../../../scripts/content/figuras/convert.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '../../../../../');
const FONTE = path.join(root, 'scripts/content/figuras/fontes/linhas-do-cranio.svg');
const SPEC = path.join(root, 'radiant-app/src/ui/diagrams/specs/linhas-do-cranio.ts');

// ---- pontos anatômicos medidos sobre a arte, em unidades de cada fonte (viewBox original) ----
const PERFIL = { canto: [111.7, 176.7], infra: [73.3, 204.3], meato: [212.7, 226.7] }; // viewBox 552,25 x 377,78
const FRENTE = { orbD: [159, 118], orbE: [240, 118], linhaMedia: 199.5 }; // viewBox 301,185 x 291,585 (orbD = à esquerda de quem vê)
const PONTOS = JSON.parse(readFileSync(path.join(here, 'pontos.json'), 'utf8').replace(/^\s*$/, '{}') || '{}');
Object.assign(PERFIL, PONTOS.perfil ?? {});
Object.assign(FRENTE, PONTOS.frente ?? {});

// ---- recolor neutro (a arte serve de leito das linhas; as linhas é que levam cor) ----
const MAP_FRENTE = {
  fbf4a1: 'B8BFCE', b5d0ed: 'A9B1C2', fdcf8e: 'B0B8C8', ebbbd7: '5E667A', '72c59b': 'CBD0DB', dadd89: 'C5CBD8',
  white: 'E6E8EE', d1eefc: '9AA3B5', e4c3a8: 'A0A8BA', f48969: '7A8398',
};
const MAP_PERFIL = {
  FFC21A: 'B8BFCE', '4A9EFF': 'A9B1C2', '5EEAF7': 'B0B8C8', '2E6FD0': 'A0A8BA', FFE08A: 'C5CBD8', FF8A3D: '7A8398',
  C9B28A: '8F98AB', C9A24A: '8F98AB',
};
const recolor = (svg, map) =>
  svg.replace(/(fill[:=]"?)#?([0-9A-Za-z]+)(?=[";\s/>])/g, (m, pre, c) => {
    const k = Object.keys(map).find((x) => x.toLowerCase() === c.toLowerCase());
    return k ? `${pre}#${map[k]}` : m;
  });

// ---- frente: tira o fundo branco (polígono 0) e os rótulos, as linhas de chamada e o pontilhado (índices 141 a 246) ----
const frenteTxt = readFileSync(path.join(here, 'original.svg'), 'utf8');
let idx = 0;
const frenteLimpa = frenteTxt.replace(/<(path|polygon)\b[^>]*?\/?>/g, (m) => {
  const i = idx++;
  return i === 0 || (i >= 141 && i <= 246) ? '' : m;
});
if (idx !== 253) throw new Error('a arte de frente mudou: ' + idx + ' elementos');
const frente = recolor(frenteLimpa, MAP_FRENTE).replace(/fill:white/g, 'fill:#E6E8EE');

const perfil = recolor(readFileSync(path.join(root, 'scripts/content/figuras/fontes/cranio-de-perfil-ossos.svg'), 'utf8'), MAP_PERFIL);

const inner = (svg) => svg.replace(/^[\s\S]*?<svg\b[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<rect x="-10"[^>]*\/>/, '');
const bbox = (svg) => convertSvg(svg, { dropBackground: true }).bbox;
const bP = bbox(perfil);
const bF = bbox(frente);

// ---- composição em 320 x 240: perfil à esquerda, frente à direita ----
const BOX_P = { x: 3, w: 190, h: 232 }, BOX_F = { x: 197, w: 120, h: 220 };
const place = (b, box) => {
  const s = Math.min(box.w / b[2], box.h / b[3]);
  return { s, tx: box.x + (box.w - b[2] * s) / 2 - b[0] * s, ty: (240 - b[3] * s) / 2 - b[1] * s };
};
const tP = place(bP, BOX_P), tF = place(bF, BOX_F);
const fonte = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="960" height="720" viewBox="0 0 320 240">
<g transform="translate(${tP.tx.toFixed(3)} ${tP.ty.toFixed(3)}) scale(${tP.s.toFixed(4)})">${inner(perfil)}</g>
<g transform="translate(${tF.tx.toFixed(3)} ${tF.ty.toFixed(3)}) scale(${tF.s.toFixed(4)})">${inner(frente)}</g>
</svg>
`;
writeFileSync(FONTE, fonte);

const r = (n) => Math.round(n * 10) / 10;
const pP = ([x, y]) => [r(tP.tx + x * tP.s), r(tP.ty + y * tP.s)];
const pF = ([x, y]) => [r(tF.tx + x * tF.s), r(tF.ty + y * tF.s)];
const px = PONTOS.perfilPx ?? {};
const canto = px.canto ?? pP(PERFIL.canto), infra = px.infra ?? pP(PERFIL.infra), meato = px.meato ?? pP(PERFIL.meato);
const xM = pF([FRENTE.linhaMedia, 0])[0];
// Centros das aberturas orbitais medidos sobre a arte já no quadro 320x240: 24,5 de cada lado da linha média, y 115,5.
const yI = 115.5, oD = [r(xM - 24.5), yI], oE = [r(xM + 24.5), yI];
const topo = r(pF([0, bF[1]])[1]), base = r(pF([0, bF[1] + bF[3]])[1]);
const pontos = { canto, infra, meato, pupilaD: [oD[0], yI], pupilaE: [oE[0], yI], xMedia: xM, topo, base };
writeFileSync(path.join(here, 'pontos-medidos.json'), JSON.stringify(pontos, null, 1));

const o = convertSvg(fonte, { dropBackground: true });
const art = o.layers[0].svg.replace(/&#(9|10|13);/g, ' ').replace(/\s{2,}/g, ' ').replace(/ "/g, '"');
const casing = (d) => `<path d="${d}" fill="none" stroke="#171920" stroke-width="4.6" stroke-linecap="round"/>`;
const L = (a, b, c, extra = '') =>
  `${casing(`M${a[0]},${a[1]} L${b[0]},${b[1]}`)}<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${c}" stroke-width="2.5" stroke-linecap="round"${extra}/>`;
const dot = (p, c) => `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="${c}" stroke="#171920" stroke-width="1.2"/>`;
const AMBAR = '#ffc21a', CIANO = '#5eeaf7', AZUL = '#4a9eff', CINZA = '#e6e8ee';
const yTop = Math.max(4, topo - 10), yBase = Math.min(236, base + 8);
const layers = [
  ['Perfil e frente: a cabeça (crânio) sem linhas, em tom neutro.', art],
  ['Linha orbitomeatal (âmbar): do meato acústico externo ao canto externo do olho (margem lateral da órbita).', `${L(meato, canto, AMBAR)}${dot(meato, AMBAR)}${dot(canto, AMBAR)}`],
  ['Linha infraorbitomeatal (ciano): do mesmo meato à margem inferior da órbita.', `${L(meato, infra, CIANO)}${dot(infra, CIANO)}`],
  ['Linha interpupilar (azul): pelo centro das duas órbitas, na vista de frente.', `${L([r(oD[0] - 8), yI], [r(oE[0] + 8), yI], AZUL)}${dot([oD[0], yI], AZUL)}${dot([oE[0], yI], AZUL)}`],
  ['Plano sagital mediano (cinza claro tracejado): vertical pela linha média, visto de lado como linha.', `${casing(`M${xM},${yTop} L${xM},${yBase}`)}<line x1="${xM}" y1="${yTop}" x2="${xM}" y2="${yBase}" stroke="${CINZA}" stroke-width="2.2" stroke-dasharray="7 5" stroke-linecap="round"/>`],
];
const kib = (s) => (Buffer.byteLength(s) / 1024).toFixed(1);
const text = `import type { DiagramSpec } from '../diagramTypes';

// Arte importada (art: 'imported') mais linhas de referência em código; gerada por script, não editar à mão.
// Cabeça: "Human skull side bones" e "Human skull front bones" (LadyofHats, Mariana Ruiz Villarreal), Wikimedia
// Commons, domínio público; sem rótulos nem linhas de chamada, recoloridas em tons neutros. Fonte versionada:
// scripts/content/figuras/fontes/linhas-do-cranio.svg. Quadro 320x240, parado. Perfil à esquerda (face para a
// esquerda) e frente à direita (o lado direito do paciente fica à esquerda de quem vê). As linhas são código,
// cada uma de uma cor, e passam pelos pontos da arte: meato acústico externo ${meato}, canto externo (margem
// lateral da órbita) ${canto}, margem inferior da órbita ${infra}; centros das órbitas ${oD[0]} e ${oE[0]} em y ${yI};
// linha média x ${xM}.
export const linhasDoCranio: DiagramSpec = {
  id: 'linhas-do-cranio',
  alt: 'Crânio de perfil com duas linhas do meato acústico à órbita; crânio de frente com uma linha horizontal pelas órbitas e uma vertical tracejada.',
  width: 320,
  height: 240,
  art: 'imported',
  layers: [
${layers.map(([n, s]) => `    {\n      // ${n}\n      svg: ${JSON.stringify(s)},\n    },`).join('\n')}
  ],
};
`;
writeFileSync(SPEC, text);
console.log('fonte', kib(fonte), 'KiB; spec', kib(text), 'KiB; filtros removidos:', o.report.filters.length);
console.log(JSON.stringify(pontos), 'bboxP', bP.map(r), 'bboxF', bF.map(r), 'escalas', tP.s.toFixed(3), tF.s.toFixed(3));
