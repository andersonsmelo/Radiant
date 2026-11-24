import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240. Entre o paciente e o receptor, lâminas finas paralelas ao
// feixe primário. Os fótons primários (retos) passam entre as lâminas; os
// espalhados (oblíquos, tan 0,6) batem numa lâmina e param. O "parar" é feito
// por cobertura: atrás de cada lâmina, a sombra dela (paralelogramo da cor do
// fundo, na direção do raio) esconde o que a atravessaria. As lâminas à esquerda
// do centro recebem raios que descem para a esquerda; as da direita, o inverso.
const TAN = 0.6;
const SIN = TAN / Math.hypot(1, TAN);
const COS = 1 / Math.hypot(1, TAN);
const GY0 = 146;
const GY1 = 176;
const H = GY1 - GY0;
const W = 4;
const LAMELLAE = Array.from({ length: 13 }, (_, i) => 62 + 16 * i);
const r1 = (v: number) => Math.round(v * 10) / 10;
const dir = { ux: SIN, uy: COS };

/** Fótons espalhados: filas oblíquas que nascem dentro do paciente, período 32. */
const scattered = (starts: [number, number][], side: 1 | -1, phase: number) => ({
  svg: starts
    .map(([x, y]) => `<line x1="${x}" y1="${y}" x2="${r1(x + side * dir.ux * 130)}" y2="${r1(y + dir.uy * 130)}" stroke="${P.beam}" stroke-opacity="0.55" stroke-width="2.5" stroke-dasharray="3 29"/>`)
    .join('\n'),
  motion: { kind: 'translate' as const, dx: r1(side * dir.ux * 32), dy: r1(dir.uy * 32), mode: 'loop' as const, phase },
});

const shadow = (lx: number, i: number) =>
  i >= 7
    ? `<polygon points="${lx},${GY0} ${lx + W},${GY0} ${r1(lx + W + H * TAN)},${GY1} ${lx},${GY1}" fill="${P.bg}"/>`
    : `<polygon points="${lx + W},${GY0} ${lx},${GY0} ${r1(lx - H * TAN)},${GY1} ${lx + W},${GY1}" fill="${P.bg}"/>`;

export const gradeAntidifusora: DiagramSpec = {
  id: 'grade-antidifusora',
  alt: 'Grade entre paciente e receptor: fótons primários retos passam entre as lâminas; os espalhados, oblíquos, batem nas lâminas e param.',
  width: 320,
  height: 240,
  periodMs: 3000,
  posterAt: 0.5,
  layers: [
    {
      // Campo do feixe e paciente.
      svg: `<rect x="100" y="34" width="120" height="112" fill="${P.beam}" fill-opacity="0.07"/>
<rect x="100" y="64" width="120" height="52" rx="20" fill="${P.muted}" fill-opacity="0.14" stroke="${P.muted}" stroke-width="2"/>`,
    },
    scattered([[146, 80], [158, 92], [170, 84], [182, 98], [194, 88], [206, 102]], 1, 0),
    scattered([[174, 80], [162, 92], [150, 84], [138, 98], [126, 88], [114, 102]], -1, 0.5),
    {
      // Sombras das lâminas, o que passa abaixo da grade e o receptor.
      svg: `${LAMELLAE.map(shadow).join('\n')}
<rect x="0" y="${GY1}" width="320" height="${240 - GY1}" fill="${P.bg}"/>
<rect x="62" y="190" width="196" height="8" rx="3" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>`,
    },
    {
      svg: LAMELLAE.map((lx) => `<rect x="${lx}" y="${GY0}" width="${W}" height="${H}" fill="${P.muted}" stroke="${P.line}" stroke-width="1.5" stroke-linejoin="round"/>`).join('\n'),
    },
    {
      // Primários: uma fila no meio de cada vão, dentro do campo.
      svg: [104, 120, 136, 152, 168, 184, 200, 216]
        .map((x) => `<line x1="${x}" y1="10" x2="${x}" y2="166" stroke="${P.beam}" stroke-width="3" stroke-dasharray="2 10"/>`)
        .join('\n'),
      motion: { kind: 'translate', dx: 0, dy: 24, mode: 'loop' },
    },
    {
      // Tubo: cobre o começo das filas.
      svg: `<rect x="92" y="8" width="136" height="26" rx="8" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>`,
    },
  ],
};
