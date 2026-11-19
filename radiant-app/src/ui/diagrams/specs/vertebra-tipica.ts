import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Vértebra lombar em plano axial, vista de cima, cerca de 28 unidades
// por cm: frente do corpo para o alto, processo espinhoso para baixo. Corpo em forma de rim
// (4,8 por 3,3 cm), pedículos curtos, forame vertebral triangular (2,4 cm de largura), lâminas
// fechando o arco atrás, processos transversos longos e finos, um processo articular de cada
// lado na junção pedículo-lâmina (o superior e o inferior desenhados como um só).
export const vertebraTipica: DiagramSpec = {
  id: 'vertebra-tipica',
  alt: 'Vértebra lombar vista de cima, frente do corpo para o alto: corpo grande na frente, um anel de osso atrás em volta de um furo e três processos saindo do anel.',
  width: 320,
  height: 240,
  layers: [
    {
      // Corpo vertebral em forma de rim, com a face de trás côncava.
      svg: `<path d="M93,55 C93,22 120,10 160,10 C200,10 227,22 227,55 C227,82 214,102 196,103 C184,104 172,98 160,98 C148,98 136,104 124,103 C106,102 93,82 93,55 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5" stroke-linejoin="round"/>
<path d="M104,55 C104,30 126,20 160,20 C194,20 216,30 216,55 C216,76 206,92 194,93 C180,94 172,88 160,88 C148,88 140,94 126,93 C114,92 104,76 104,55 Z" fill="none" stroke="${P.muted}" stroke-width="1.5" stroke-opacity="0.6"/>`,
    },
    {
      // Processos transversos, para os lados.
      svg: `<path d="M100,112 L56,112 C48,112 44,116 44,120 C44,124 48,128 56,128 L104,130 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5" stroke-linejoin="round"/>
<path d="M220,112 L264,112 C272,112 276,116 276,120 C276,124 272,128 264,128 L216,130 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5" stroke-linejoin="round"/>`,
    },
    {
      // Pedículos, do corpo ao arco.
      svg: `<path d="M98,96 L128,100 L128,134 L104,136 C100,124 98,108 98,96 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5" stroke-linejoin="round"/>
<path d="M222,96 L192,100 L192,134 L216,136 C220,124 222,108 222,96 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5" stroke-linejoin="round"/>`,
    },
    {
      // Lâminas, fechando o arco atrás do forame.
      svg: `<path d="M128,130 L160,150 L160,170 C146,166 128,160 112,152 L108,138 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5" stroke-linejoin="round"/>
<path d="M192,130 L160,150 L160,170 C174,166 192,160 208,152 L212,138 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5" stroke-linejoin="round"/>`,
    },
    {
      // Processo espinhoso, para trás.
      svg: `<path d="M150,160 L170,160 L170,226 C170,234 166,237 160,237 C154,237 150,234 150,226 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5" stroke-linejoin="round"/>`,
    },
    {
      // Processos articulares na junção pedículo-lâmina.
      svg: `<path d="M100,134 C94,140 96,152 106,156 C114,158 120,152 118,144 C114,140 106,138 100,134 Z" fill="${P.fill}" stroke="${P.muted}" stroke-width="2" stroke-linejoin="round"/>
<path d="M220,134 C226,140 224,152 214,156 C206,158 200,152 202,144 C206,140 214,138 220,134 Z" fill="${P.fill}" stroke="${P.muted}" stroke-width="2" stroke-linejoin="round"/>`,
    },
  ],
};
