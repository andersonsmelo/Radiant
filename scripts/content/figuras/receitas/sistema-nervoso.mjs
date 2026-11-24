// HISTÓRICO, não é executado por teste nem pelo gate: o script do agente de arte que gerou o primeiro spec da fonte versionada em fontes/sistema-nervoso.svg (Servier Medical Art, "Nervous system", CC BY 4.0).
// A regeneração vale agora por build-spec.mjs (entrada "sistema-nervoso" de FIGURES), que difere deste script só no enquadramento: escala 0,07 (margem de 3,2) em vez de caixa() com 10 de margem; as 360 formas e as cores são as mesmas. Os caminhos absolutos abaixo são os da pasta de trabalho do agente.
// Gera radiant-app/src/ui/diagrams/specs/sistema-nervoso.ts a partir de fontes/sistema-nervoso.svg, com a mesma
// lógica de `importada` e `caixa` de scripts/content/figuras/build-spec.mjs (que o integrador estende com a entrada de FIGURES do relatório).
import { readFileSync, writeFileSync } from 'node:fs';
import { convertSvg } from '/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-dobrada/scripts/content/figuras/convert.mjs';
const root = '/Users/anderson/Developer/Radiant/.claude/worktrees/trilha-dobrada/';
const clean = (s) => s.replace(/&#(9|10|13);/g, ' ').replace(/\s{2,}/g, ' ').replace(/ "/g, '"');
const r = (n) => Math.round(n * 1000) / 1000;
const caixa = ([bx, by, bw, bh]) => { const s = Math.min(300 / bw, 220 / bh); return `translate(${r((320 - bw * s) / 2 - bx * s)} ${r((240 - bh * s) / 2 - by * s)}) scale(${r(s)})`; };
const o = convertSvg(readFileSync(root + 'scripts/content/figuras/fontes/sistema-nervoso.svg', 'utf8'), { dropBackground: true });
console.log('filtros', JSON.stringify(o.report.filters), 'viewBox', o.viewBox, 'bbox', JSON.stringify(o.bbox), 'camadas', o.layers.length);
const art = clean(o.layers[0].svg);
const svg = `<g transform="${caixa([812, 719, 1293, 3337])}">${art}</g>`;
const header = `// Arte importada (art: 'imported'), gerada por script a partir do acervo; não editar à mão.
// Obra: "Nervous system" (Servier Medical Art, kit SMART-Nervous-system, slide29.xml do pacote, grupo "Group 3", CC BY 4.0), vetores copiados do pptx do kit.
// Corpo de frente inteiro, com o contorno; sem rótulos (a arte original não tem). Recolorida para a paleta do app e achatada
// para atributos de apresentação. Fonte versionada: scripts/content/figuras/fontes/sistema-nervoso.svg.
// Quadro 320x240, parado; o desenho ocupa a caixa ${r(1293 * Math.min(300 / 1293, 220 / 3337))}x220 centrada. Lado direito do paciente à esquerda de quem vê.
// Cores: encéfalo âmbar (cerebelo em âmbar mais escuro), medula espinal âmbar, nervos periféricos ciano; corpo em cinza-azulado escuro com contorno cinza.`;
const alt = 'Corpo humano de frente, com a cabeça de perfil: encéfalo e medula espinal numa cor, e uma rede de nervos de outra cor que desce pelos braços, tórax e pernas.';
if (alt.length < 20 || alt.length > 160) throw new Error('alt ' + alt.length);
const text = `import type { DiagramSpec } from '../diagramTypes';

${header}
export const sistemaNervoso: DiagramSpec = {
  id: 'sistema-nervoso',
  alt: '${alt}',
  width: 320,
  height: 240,
  art: 'imported',
  layers: [
    {
      svg: ${JSON.stringify(svg)},
    },
  ],
};
`;
writeFileSync(root + 'radiant-app/src/ui/diagrams/specs/sistema-nervoso.ts', text);
console.log('KiB', (Buffer.byteLength(text) / 1024).toFixed(1), 'alt', alt.length);
