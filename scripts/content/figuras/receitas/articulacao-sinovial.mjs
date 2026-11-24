// HISTÓRICO, não é executado por teste nem pelo gate: registra como a fonte versionada em fontes/articulacao-sinovial.svg foi feita
// a partir do original (limpar rótulos, recolorir). A regeneração do spec sai da fonte, por build-spec.mjs.
// Os caminhos relativos abaixo valem para a pasta de trabalho de origem (.superpowers/sdd/.../1A/articulacao-sinovial/), que não é versionada.
// Gera radiant-app/src/ui/diagrams/specs/articulacao-sinovial.ts (mesmo molde do crânio; sem entrada em FIGURES: o integrador a acrescenta).
import { readFileSync, writeFileSync } from 'node:fs';
import { convertSvg } from '../../../../scripts/content/figuras/convert.mjs';
const clean = (s) => s.replace(/&#(9|10|13);/g, ' ').replace(/\s{2,}/g, ' ').replace(/ "/g, '"');
const o = convertSvg(readFileSync('scripts/content/figuras/fontes/articulacao-sinovial.svg', 'utf8'), { dropBackground: true });
console.log(JSON.stringify(o.report), o.layers.length, o.bbox);
const svg = clean(o.layers.map((l) => l.svg).join(''));
const alt = 'Articulação em corte frontal: dois ossos com pontas lisas, espaço escuro entre elas, capa que envolve tudo e uma faixa estreita do lado direito.';
console.log('alt', alt.length, 'svg', svg.length);
writeFileSync('radiant-app/src/ui/diagrams/specs/articulacao-sinovial.ts', `import type { DiagramSpec } from '../diagramTypes';

// Arte importada (art: 'imported'), gerada por script a partir do acervo; não editar à mão.
// Obra: "Normal joint" e "Knee (2), frontal view" (Servier Medical Art, kit SMART-Bones, CC BY 4.0),
// vetores copiados do pptx do kit (a faixa do lado direito é uma fibra do ligamento colateral do joelho,
// recolocada ao lado da cápsula), sem rótulos, recolorida para a paleta do app e achatada para
// atributos de apresentação. Quadro 320x240, parado; corte frontal com os ossos saindo do quadro.
// Cores: osso cinza claro com poros mais escuros, cartilagem ciano, cavidade e líquido azul-petróleo,
// membrana sinovial azul médio, cápsula azul vivo por fora, ligamento âmbar à direita.
export const articulacaoSinovial: DiagramSpec = {
  id: 'articulacao-sinovial',
  alt: ${JSON.stringify(alt)},
  width: 320,
  height: 240,
  art: 'imported',
  layers: [
    {
      svg: ${JSON.stringify(svg)},
    },
  ],
};
`);
