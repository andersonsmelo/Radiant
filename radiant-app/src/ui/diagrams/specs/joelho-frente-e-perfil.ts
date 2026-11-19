import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Joelho direito em duas vistas, cerca de 13 unidades por cm. À
// esquerda, de frente (AP): o lado lateral do joelho direito fica à esquerda de quem vê, então a
// fíbula e o côndilo lateral ficam à esquerda; a patela aparece em traço fraco sobre o fêmur. À
// direita, de perfil (lateral): frente do joelho para a direita, patela à frente da tróclea,
// côndilos salientes para trás e fíbula atrás da tíbia. Meniscos e partes moles omitidos.
export const joelhoFrenteEPerfil: DiagramSpec = {
  id: 'joelho-frente-e-perfil',
  alt: 'Joelho direito em duas vistas: de frente à esquerda, com o lado de fora do joelho à esquerda; de perfil à direita, com a frente para a direita.',
  width: 320,
  height: 240,
  layers: [
    {
      // Fíbulas, atrás da tíbia nas duas vistas (cabeça abaixo do platô, sem tocar o fêmur).
      svg: `<path d="M26,152 C26,146 40,144 46,149 C50,155 48,166 44,172 L44,244 L34,244 L34,174 C28,168 26,160 26,152 Z" fill="${P.fill}" stroke="${P.muted}" stroke-width="2.5" stroke-linejoin="round"/>
<path d="M198,154 C198,146 212,144 216,150 C218,158 216,166 212,172 L212,244 L204,244 L204,172 C200,166 198,160 198,154 Z" fill="${P.fill}" stroke="${P.muted}" stroke-width="2.5" stroke-linejoin="round"/>`,
    },
    {
      // Vista de frente: fêmur distal com os côndilos e a fossa intercondilar; tíbia com o platô e a eminência.
      svg: `<path d="M60,-4 L60,50 C58,68 40,76 32,90 C26,102 30,120 46,124 C58,126 66,118 70,108 C74,102 86,102 90,108 C94,118 102,126 114,125 C130,122 134,104 128,90 C120,76 102,68 100,50 L100,-4 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5" stroke-linejoin="round"/>
<path d="M32,131 C40,128 60,130 72,129 L75,121 L78,128 L82,128 L85,121 L88,129 C100,130 120,128 128,131 C132,140 124,152 112,160 C102,168 98,178 98,190 L98,244 L62,244 L62,190 C62,178 58,168 48,160 C36,152 30,140 32,131 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5" stroke-linejoin="round"/>`,
    },
    {
      // Vista de frente: patela sobreposta ao fêmur distal, em traço fraco.
      svg: `<ellipse cx="80" cy="90" rx="19" ry="23" fill="none" stroke="${P.accent}" stroke-width="2" stroke-opacity="0.7" stroke-dasharray="4 3"/>`,
    },
    {
      // Vista de perfil: fêmur com os côndilos para trás e a tíbia com a tuberosidade à frente.
      svg: `<path d="M230,-4 L230,58 C226,74 200,82 194,100 C190,116 204,130 222,128 C238,127 252,126 262,118 C270,110 272,96 270,84 L269,-4 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5" stroke-linejoin="round"/>
<path d="M198,136 C206,132 240,132 262,131 C268,134 268,142 266,150 C270,156 272,166 266,172 C262,180 258,190 258,200 L258,244 L224,244 L224,200 C224,184 214,166 204,156 C198,150 196,142 198,136 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5" stroke-linejoin="round"/>`,
    },
    {
      // Vista de perfil: patela à frente da tróclea do fêmur.
      svg: `<ellipse cx="284" cy="94" rx="10" ry="24" transform="rotate(-8 284 94)" fill="${P.accent}" fill-opacity="0.3" stroke="${P.accent}" stroke-width="2.5"/>`,
    },
    {
      // Separador entre as duas vistas.
      svg: `<line x1="160" y1="14" x2="160" y2="226" stroke="${P.muted}" stroke-width="1.5" stroke-opacity="0.5" stroke-dasharray="3 5"/>`,
    },
  ],
};
