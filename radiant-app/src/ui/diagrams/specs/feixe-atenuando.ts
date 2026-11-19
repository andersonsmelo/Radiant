import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240. Feixe paralelo (simplificação) saindo da fonte, no alto,
// atravessando tecido mole com um osso no meio e chegando ao receptor. Cada fila
// de traços desliza 24, múltiplo do período dos traços (12 e 24), então o laço
// não salta; o começo da fila fica sob a fonte e o fim, sob o osso ou o receptor.
const COLS_SOFT = [88, 112, 208, 232];
const COLS_BONE = [136, 160, 184];
const dense = (x: number, y1: number, y2: number) =>
  `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="${P.beam}" stroke-width="3" stroke-dasharray="4 8"/>`;
const sparse = (x: number, y1: number, y2: number) =>
  `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="${P.beam}" stroke-width="3" stroke-dasharray="4 20"/>`;

export const feixeAtenuando: DiagramSpec = {
  id: 'feixe-atenuando',
  alt: 'Feixe atravessa tecido mole com um osso no meio: atrás do osso chegam poucos fótons e o receptor fica mais claro, menos exposto.',
  width: 320,
  height: 240,
  periodMs: 2400,
  posterAt: 0.5,
  layers: [
    {
      // Campo do feixe e o corpo (tecido mole).
      svg: `<rect x="76" y="28" width="168" height="150" fill="${P.beam}" fill-opacity="0.07"/>
<rect x="76" y="64" width="168" height="88" rx="12" fill="${P.muted}" fill-opacity="0.14" stroke="${P.muted}" stroke-width="2"/>`,
    },
    {
      // Fótons: cheios fora do osso; nas três filas do osso, cheios até entrar nele e ralos ao sair.
      svg: [
        ...COLS_SOFT.map((x) => dense(x, 4, 190)),
        ...COLS_BONE.map((x) => dense(x, 4, 104)),
        ...COLS_BONE.map((x) => sparse(x, 104, 190)),
      ].join('\n'),
      motion: { kind: 'translate', dx: 0, dy: 24, mode: 'loop' },
    },
    {
      // Osso: mais denso, absorve parte do feixe.
      svg: `<rect x="124" y="88" width="72" height="40" rx="14" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>`,
    },
    {
      // Cobre o que passa do receptor; receptor; resposta dele, mais clara onde chegou menos radiação.
      svg: `<rect x="0" y="186" width="320" height="54" fill="${P.bg}"/>
<rect x="76" y="178" width="168" height="8" rx="3" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<rect x="76" y="194" width="48" height="16" fill="${P.fill}" stroke="${P.muted}" stroke-width="2"/>
<rect x="124" y="194" width="72" height="16" fill="${P.line}" stroke="${P.muted}" stroke-width="2"/>
<rect x="196" y="194" width="48" height="16" fill="${P.fill}" stroke="${P.muted}" stroke-width="2"/>`,
    },
    {
      // Fonte: de baixo dela saem os fótons.
      svg: `<rect x="76" y="4" width="168" height="24" rx="8" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>`,
    },
  ],
};
