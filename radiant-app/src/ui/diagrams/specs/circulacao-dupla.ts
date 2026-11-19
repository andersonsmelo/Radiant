import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240. Coração de frente no centro, em quatro câmaras: o lado direito do
// paciente (átrio e ventrículo direitos) fica à esquerda de quem vê. Azul (`accent`)
// é o sangue pobre em oxigênio; amarelo (`beam`), o rico. Volta pequena para cima:
// ventrículo direito, artéria pulmonar, pulmões, veias pulmonares, átrio esquerdo.
// Volta grande para baixo: ventrículo esquerdo, aorta, corpo, veias cavas, átrio
// direito. A artéria pulmonar cruza na frente da veia cava: a camada que sobe vem
// depois da que vai para a direita.
//
// O fluxo são pontos que correm sobre cada trecho reto. Cada camada junta os trechos
// de um mesmo sentido e anda STEP, múltiplo do padrão do tracejado, então o quadro
// final é igual ao primeiro. Cada trecho termina STEP antes do fim, para o ponto
// não passar da curva.
const STEP = 24;
const loop = { mode: 'loop' } as const;

const seg = (x1: number, y1: number, x2: number, y2: number, color: string) => {
  const ex = x2 - Math.sign(x2 - x1) * STEP;
  const ey = y2 - Math.sign(y2 - y1) * STEP;
  return `<line x1="${x1}" y1="${y1}" x2="${ex}" y2="${ey}" stroke="${color}"/>`;
};
const dots = (body: string) =>
  `<g stroke-width="4" stroke-dasharray="4 8" stroke-linecap="round">${body}</g>`;

export const circulacaoDupla: DiagramSpec = {
  id: 'circulacao-dupla',
  alt: 'Coração de quatro câmaras com uma volta pequena até os pulmões e outra grande até o corpo; pontos azuis e amarelos correm pelas voltas.',
  width: 320,
  height: 240,
  periodMs: 2400,
  posterAt: 0.3,
  layers: [
    {
      // Vasos (tubo largo e apagado), pulmões, leito do corpo e as câmaras do coração.
      svg: `<g fill="none" stroke-width="8" stroke-opacity="0.35" stroke-linejoin="round">
<path d="M56 196 V106 H104" stroke="${P.accent}"/>
<path d="M216 138 H264 V196" stroke="${P.beam}"/>
<path d="M224 32 H236 V106 H216" stroke="${P.beam}"/>
<path d="M84 96 V116" stroke="${P.bg}" stroke-width="16" stroke-opacity="1"/>
<path d="M104 138 H84 V32 H96" stroke="${P.accent}"/>
</g>
<ellipse cx="128" cy="32" rx="32" ry="20" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<ellipse cx="192" cy="32" rx="32" ry="20" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="40" y="196" width="240" height="30" rx="15" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="104" y="92" width="56" height="60" fill="${P.accent}" fill-opacity="0.3"/>
<rect x="160" y="92" width="56" height="60" fill="${P.beam}" fill-opacity="0.3"/>
<rect x="104" y="92" width="112" height="60" rx="10" fill="none" stroke="${P.line}" stroke-width="3"/>
<path d="M160 92 V152 M104 122 H216" stroke="${P.line}" stroke-width="2"/>`,
    },
    {
      // Para a direita: pelos pulmões (chega azul, sai amarelo), aorta e veia cava.
      svg: dots(
        seg(96, 32, 160, 32, P.accent) + seg(160, 32, 224, 32, P.beam) + seg(216, 138, 264, 138, P.beam) + seg(56, 106, 104, 106, P.accent),
      ),
      motion: { kind: 'translate', dx: STEP, dy: 0, ...loop },
    },
    {
      // Para cima: artéria pulmonar e veia cava.
      svg: dots(seg(84, 138, 84, 32, P.accent) + seg(56, 196, 56, 106, P.accent)),
      motion: { kind: 'translate', dx: 0, dy: -STEP, ...loop },
    },
    {
      // Para baixo: veias pulmonares, aorta e a passagem de átrio a ventrículo.
      svg: dots(
        seg(236, 32, 236, 106, P.beam) +
          seg(264, 138, 264, 211, P.beam) +
          seg(132, 98, 132, 148, P.accent) +
          seg(188, 98, 188, 148, P.beam),
      ),
      motion: { kind: 'translate', dx: 0, dy: STEP, ...loop },
    },
    {
      // Para a esquerda: pelo corpo (chega amarelo, sai azul).
      svg: dots(seg(264, 211, 160, 211, P.beam) + seg(160, 211, 56, 211, P.accent)),
      motion: { kind: 'translate', dx: -STEP, dy: 0, ...loop },
    },
    {
      // Pontas de seta onde o sangue chega: pulmões, átrio esquerdo, corpo e átrio direito.
      svg: `<polygon points="100,32 91,26 91,38" fill="${P.accent}"/>
<polygon points="216,106 225,100 225,112" fill="${P.beam}"/>
<polygon points="264,200 258,191 270,191" fill="${P.beam}"/>
<polygon points="104,106 95,100 95,112" fill="${P.accent}"/>`,
    },
  ],
};
