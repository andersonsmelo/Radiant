import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240. O feixe primário (três filas de traços longos e fortes) desce
// reto pelo paciente até o receptor. De dois pontos dentro do corpo saem fótons
// espalhados em seis direções (60 graus entre elas, duas de volta para o tubo):
// traços curtos, finos e mais fracos, que somem a 60 unidades da pele. Cada fila
// desliza um período e nasce no ponto de espalhamento, sem salto no laço. O
// limite de 8 camadas (parada + primário + uma por direção) fixa as 6 direções.
const S = [
  [160, 92],
  [160, 128],
] as const;
const BODY = { x0: 100, x1: 220, y0: 64, y1: 152 };
const r2 = (v: number) => Math.round(v * 100) / 100;

/** Distância da origem à pele (retângulo do corpo), andando em (ux, uy). */
const toSkin = (x: number, y: number, ux: number, uy: number) =>
  Math.min(
    ux > 0 ? (BODY.x1 - x) / ux : ux < 0 ? (BODY.x0 - x) / ux : Infinity,
    uy > 0 ? (BODY.y1 - y) / uy : uy < 0 ? (BODY.y0 - y) / uy : Infinity,
  );

/** Fótons espalhados na direção (ux, uy): traço de 7, período 32; o último some a 60 da pele. */
const scatter = (ux: number, uy: number, phase: number) => ({
  svg: S.map(([x, y]) => {
    const len = toSkin(x, y, ux, uy) + 60 - 32;
    return `<line x1="${x}" y1="${y}" x2="${r2(x + ux * len)}" y2="${r2(y + uy * len)}" stroke="${P.beam}" stroke-opacity="0.8" stroke-width="2.5" stroke-dasharray="7 25"/>`;
  }).join('\n'),
  motion: { kind: 'translate' as const, dx: r2(ux * 32), dy: r2(uy * 32), mode: 'loop' as const, phase },
});
const D = Math.sqrt(3) / 2;

export const radiacaoEspalhada: DiagramSpec = {
  id: 'radiacao-espalhada',
  alt: 'O feixe primário atravessa o paciente até o receptor; dentro do corpo, fótons mudam de direção e saem para os lados, mais fracos.',
  width: 320,
  height: 240,
  periodMs: 3200,
  posterAt: 0.3,
  layers: [
    {
      // Tubo, paciente e receptor.
      svg: `<rect x="126" y="8" width="68" height="26" rx="8" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<rect x="100" y="64" width="120" height="88" rx="24" fill="${P.muted}" fill-opacity="0.14" stroke="${P.muted}" stroke-width="2"/>
<rect x="120" y="196" width="80" height="8" rx="3" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>`,
    },
    {
      // Feixe primário: três filas retas, do tubo ao receptor.
      svg: [148, 160, 172].map((x) => `<line x1="${x}" y1="34" x2="${x}" y2="170" stroke="${P.beam}" stroke-width="4" stroke-dasharray="10 14"/>`).join('\n'),
      motion: { kind: 'translate', dx: 0, dy: 24, mode: 'loop' },
    },
    scatter(1, 0, 0),
    scatter(0.5, D, 0.3),
    scatter(-0.5, D, 0.6),
    scatter(-1, 0, 0.15),
    scatter(-0.5, -D, 0.45),
    scatter(0.5, -D, 0.75),
  ],
};
