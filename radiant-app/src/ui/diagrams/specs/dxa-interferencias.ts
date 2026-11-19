import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Esquema de uma imagem de coluna lombar de frente (vértebras claras
// sobre o campo escuro) com quatro problemas: a coluna e a pelve inclinadas em relação ao eixo
// vertical da imagem (linha tracejada), um objeto metálico pequeno e muito claro sobre L3, um
// zíper em linha ao lado da coluna e a caixa de L4 deslocada para baixo, pegando a metade de
// baixo da vértebra e o disco. As caixas de L1 a L3 estão no lugar. As caixas ficam no eixo da
// imagem, como o programa as desenha; a coluna é que está girada.
export const dxaInterferencias: DiagramSpec = {
  id: 'dxa-interferencias',
  alt: 'Imagem de coluna lombar de frente, inclinada, com um ponto metálico muito claro, um zíper ao lado e caixas de vértebra, uma delas fora do lugar.',
  width: 320,
  height: 240,
  layers: [
    {
      // Campo da imagem e o seu eixo vertical.
      svg: `<rect x="18" y="4" width="284" height="232" rx="4" fill="${P.fill}" stroke="${P.muted}" stroke-width="2"/>
<line x1="140" y1="8" x2="140" y2="232" stroke="${P.muted}" stroke-width="1.5" stroke-dasharray="3 5"/>`,
    },
    {
      // Coluna (L1 a L5) e pelve, giradas 8 graus em relação ao eixo da imagem.
      svg: `<g transform="rotate(-8 140 120)">
<rect x="117" y="14" width="46" height="28" rx="4" fill="${P.line}" fill-opacity="0.3" stroke="${P.muted}" stroke-width="2"/>
<rect x="117" y="52" width="46" height="28" rx="4" fill="${P.line}" fill-opacity="0.3" stroke="${P.muted}" stroke-width="2"/>
<rect x="117" y="90" width="46" height="28" rx="4" fill="${P.line}" fill-opacity="0.3" stroke="${P.muted}" stroke-width="2"/>
<rect x="117" y="128" width="46" height="28" rx="4" fill="${P.line}" fill-opacity="0.3" stroke="${P.muted}" stroke-width="2"/>
<rect x="116" y="166" width="48" height="28" rx="4" fill="${P.line}" fill-opacity="0.3" stroke="${P.muted}" stroke-width="2"/>
<path d="M117 28 H106 M163 28 H174 M117 66 H102 M163 66 H178 M117 104 H98 M163 104 H182 M117 142 H102 M163 142 H178" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round"/>
<path d="M118 200 H162 L152 244 H128 Z" fill="${P.line}" fill-opacity="0.2" stroke="${P.muted}" stroke-width="2" stroke-linejoin="round"/>
<path d="M116 202 C106 180 90 162 74 158 C62 162 58 182 62 206 C68 222 86 236 102 244" fill="none" stroke="${P.line}" stroke-width="2.5" stroke-linecap="round"/>
<path d="M164 202 C174 180 190 162 206 158 C218 162 222 182 218 206 C212 222 194 236 178 244" fill="none" stroke="${P.line}" stroke-width="2.5" stroke-linecap="round"/>
</g>`,
    },
    {
      // Caixas de L1 a L3 no lugar e a de L4 deslocada para baixo, sobre meia vértebra e o disco.
      svg: `<rect x="100" y="10" width="54" height="38" fill="none" stroke="${P.electron}" stroke-width="2"/>
<rect x="105" y="48" width="54" height="37" fill="none" stroke="${P.electron}" stroke-width="2"/>
<rect x="111" y="85" width="54" height="38" fill="none" stroke="${P.electron}" stroke-width="2"/>
<rect x="116" y="143" width="54" height="38" fill="none" stroke="${P.electron}" stroke-width="2"/>`,
    },
    {
      // Objeto metálico pequeno, muito claro, sobre L3.
      svg: `<circle cx="146" cy="99" r="5.5" fill="${P.line}"/>
<circle cx="146" cy="99" r="9" fill="none" stroke="${P.line}" stroke-width="1.5"/>`,
    },
    {
      // Zíper em linha ao lado da coluna: dentes, fita e o cursor no alto.
      svg: `<line x1="262" y1="30" x2="262" y2="220" stroke="${P.line}" stroke-width="10" stroke-dasharray="3 4"/>
<line x1="262" y1="30" x2="262" y2="220" stroke="${P.muted}" stroke-width="1.5"/>
<rect x="255" y="16" width="14" height="14" rx="3" fill="${P.line}"/>`,
    },
  ],
};
