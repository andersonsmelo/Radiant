import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, vista de frente do gantry. O anel (carcaça) tem o furo no
// centro; tubo e arco de detectores ficam dentro da carcaça, em lados opostos,
// e giram juntos com o leque do feixe entre eles. O paciente fica parado.
const CX = 160;
const CY = 120;
const R = 100; // raio em que o tubo e os detectores giram
const A = 34; // meio-ângulo do arco de detectores, graus a partir de baixo
const rad = (d: number) => (d * Math.PI) / 180;
const r1 = (v: number) => Math.round(v * 10) / 10;
const arcPt = (r: number, side: 1 | -1) => `${r1(CX + side * r * Math.sin(rad(A)))} ${r1(CY + r * Math.cos(rad(A)))}`;

const loop = { mode: 'loop', kind: 'rotate', degrees: 360, cx: CX, cy: CY } as const;

export const corteTomograficoGirando: DiagramSpec = {
  id: 'corte-tomografico-girando',
  alt: 'Tomógrafo de frente: o paciente fica parado no centro do anel, e o tubo e o arco de detectores, em lados opostos, giram juntos em torno dele.',
  width: 320,
  height: 240,
  periodMs: 4800,
  posterAt: 0,
  layers: [
    {
      // Carcaça do gantry com o furo central.
      svg: `<circle cx="${CX}" cy="${CY}" r="116" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>
<circle cx="${CX}" cy="${CY}" r="82" fill="${P.bg}" stroke="${P.line}" stroke-width="3"/>`,
    },
    {
      // Corte do paciente sobre a mesa.
      svg: `<rect x="96" y="148" width="128" height="10" rx="3" fill="${P.fill}" stroke="${P.line}" stroke-width="3" stroke-linejoin="round"/>
<ellipse cx="${CX}" cy="118" rx="44" ry="30" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>`,
    },
    {
      // Leque do feixe: do tubo, atravessando o paciente, até o arco de detectores.
      svg: `<polygon points="${CX},30 ${arcPt(R - 5, 1)} ${arcPt(R - 5, -1)}" fill="${P.beam}" fill-opacity="0.3" stroke="${P.beam}" stroke-width="2" stroke-linejoin="round"/>`,
      motion: loop,
    },
    {
      // Tubo no alto e arco de detectores embaixo.
      svg: `<rect x="140" y="8" width="40" height="22" rx="6" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<path d="M${arcPt(R, -1)} A${R} ${R} 0 0 0 ${arcPt(R, 1)}" fill="none" stroke="${P.accent}" stroke-width="10" stroke-linecap="round" stroke-dasharray="7 3"/>`,
      motion: loop,
    },
  ],
};
