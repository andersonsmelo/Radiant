import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Pelve de frente (AP), cerca de 10 unidades por cm (cristas ilíacas a
// 28 cm): o lado direito do paciente fica à esquerda de quem vê. Cada osso do quadril em três
// partes que se encontram no acetábulo: ílio (azul), ísquio (ciano) e púbis (amarelo). Sacro no
// centro, entre os ílios, com os forames sacrais; linhas das sacroilíacas; sínfise púbica na
// linha média; forames obturados entre ísquio e púbis; acetábulos nas laterais. Cóccix curto.
export const pelveDeFrente: DiagramSpec = {
  id: 'pelve-de-frente',
  alt: 'Pelve de frente, lado direito do paciente à esquerda: dois ossos do quadril com três partes em cores diferentes, o sacro no meio e a última lombar acima.',
  width: 320,
  height: 240,
  layers: [
    {
      // Quinta vértebra lombar, em traço fraco, só para situar o sacro.
      svg: `<rect x="136" y="36" width="48" height="18" rx="3" fill="none" stroke="${P.muted}" stroke-width="2" stroke-opacity="0.6"/>`,
    },
    {
      // Sacro com os forames sacrais e o cóccix.
      svg: `<path d="M118,60 L202,60 L190,122 C180,140 170,150 164,155 L156,155 C150,150 140,140 130,122 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5" stroke-linejoin="round"/>
<ellipse cx="146" cy="74" rx="3.5" ry="3" fill="none" stroke="${P.muted}" stroke-width="1.5"/>
<ellipse cx="174" cy="74" rx="3.5" ry="3" fill="none" stroke="${P.muted}" stroke-width="1.5"/>
<ellipse cx="148" cy="90" rx="3.5" ry="3" fill="none" stroke="${P.muted}" stroke-width="1.5"/>
<ellipse cx="172" cy="90" rx="3.5" ry="3" fill="none" stroke="${P.muted}" stroke-width="1.5"/>
<ellipse cx="150" cy="106" rx="3.5" ry="3" fill="none" stroke="${P.muted}" stroke-width="1.5"/>
<ellipse cx="170" cy="106" rx="3.5" ry="3" fill="none" stroke="${P.muted}" stroke-width="1.5"/>
<ellipse cx="152" cy="122" rx="3.5" ry="3" fill="none" stroke="${P.muted}" stroke-width="1.5"/>
<ellipse cx="168" cy="122" rx="3.5" ry="3" fill="none" stroke="${P.muted}" stroke-width="1.5"/>
<path d="M157,158 L163,158 L161,165 L159,165 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="1.5" stroke-linejoin="round"/>`,
    },
    {
      // Ílios (asas largas em cima), dos dois lados.
      svg: `<path d="M74,148 L50,140 C48,128 50,114 54,104 C50,90 44,78 40,68 C26,58 22,40 32,30 C50,14 92,16 118,60 L130,122 C118,128 106,134 100,140 Z" fill="${P.accent}" fill-opacity="0.25" stroke="${P.accent}" stroke-width="2" stroke-linejoin="round"/>
<path d="M246,148 L270,140 C272,128 270,114 266,104 C270,90 276,78 280,68 C294,58 298,40 288,30 C270,14 228,16 202,60 L190,122 C202,128 214,134 220,140 Z" fill="${P.accent}" fill-opacity="0.25" stroke="${P.accent}" stroke-width="2" stroke-linejoin="round"/>`,
    },
    {
      // Ísquios (embaixo e atrás), dos dois lados.
      svg: `<path d="M74,148 L108,166 A14 20 0 1 0 118,200 L124,210 C114,216 104,220 94,218 C82,216 74,206 66,192 C58,176 52,160 50,140 Z" fill="${P.electron}" fill-opacity="0.25" stroke="${P.electron}" stroke-width="2" stroke-linejoin="round"/>
<path d="M246,148 L212,166 A14 20 0 1 1 202,200 L196,210 C206,216 216,220 226,218 C238,216 246,206 254,192 C262,176 268,160 270,140 Z" fill="${P.electron}" fill-opacity="0.25" stroke="${P.electron}" stroke-width="2" stroke-linejoin="round"/>`,
    },
    {
      // Púbis (embaixo e à frente), que se encontram na sínfise.
      svg: `<path d="M74,148 L100,140 C120,148 140,158 155,168 L155,204 C146,208 134,210 124,210 L118,200 A14 20 0 0 0 108,166 Z" fill="${P.beam}" fill-opacity="0.25" stroke="${P.beam}" stroke-width="2" stroke-linejoin="round"/>
<path d="M246,148 L220,140 C200,148 180,158 165,168 L165,204 C174,208 186,210 196,210 L202,200 A14 20 0 0 1 212,166 Z" fill="${P.beam}" fill-opacity="0.25" stroke="${P.beam}" stroke-width="2" stroke-linejoin="round"/>`,
    },
    {
      // Articulações sacroilíacas, sínfise púbica e rebordos dos acetábulos.
      svg: `<path d="M118,60 L130,122 M202,60 L190,122 M160,168 L160,206" fill="none" stroke="${P.line}" stroke-width="3" stroke-linecap="round"/>
<path d="M52.4,140.1 A23 23 0 1 1 85.5,167.9" fill="none" stroke="${P.line}" stroke-width="3" stroke-linecap="round"/>
<path d="M267.6,140.1 A23 23 0 1 0 234.5,167.9" fill="none" stroke="${P.line}" stroke-width="3" stroke-linecap="round"/>`,
    },
  ],
};
