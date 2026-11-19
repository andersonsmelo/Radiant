import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, vista de cima do receptor. Campo de luz 140x120 em (90,60);
// campo de radiação do mesmo tamanho, deslocado 32 para a direita e 14 para baixo.
export const coincidenciaDeCampo: DiagramSpec = {
  id: 'coincidencia-de-campo',
  alt: 'Vista de cima de um receptor: um retângulo de luz com marcadores nos cantos e no centro e um retângulo de radiação igual, deslocado de lado.',
  width: 320,
  height: 240,
  layers: [
    {
      // Receptor.
      svg: `<rect x="50" y="28" width="240" height="184" rx="6" fill="none" stroke="${P.muted}" stroke-width="3"/>`,
    },
    {
      // Campo de luz: tinta fraca amarela.
      svg: `<rect x="90" y="60" width="140" height="120" fill="${P.beam}" fill-opacity="0.12"/>`,
    },
    {
      // Campo de radiação: área preenchida mais escura, deslocada.
      svg: `<rect x="122" y="74" width="140" height="120" fill="${P.accent}" fill-opacity="0.4"/>`,
    },
    {
      // Contorno do campo de luz.
      svg: `<rect x="90" y="60" width="140" height="120" fill="none" stroke="${P.beam}" stroke-width="3"/>`,
    },
    {
      // Marcadores metálicos: um L em cada canto e uma cruz no centro.
      svg: `<path d="M90 80 V60 H110 M230 80 V60 H210 M90 160 V180 H110 M230 160 V180 H210" fill="none" stroke="${P.line}" stroke-width="4" stroke-linejoin="miter"/>
<path d="M152 120 H168 M160 112 V128" fill="none" stroke="${P.line}" stroke-width="3"/>`,
    },
  ],
};
