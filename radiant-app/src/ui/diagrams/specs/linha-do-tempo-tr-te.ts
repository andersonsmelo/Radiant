import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240. Linha do tempo de uma sequência: pulso de excitação (x 40), o
// eco centrado em x 110 e o pulso seguinte (x 270). Embaixo, a chave curta do
// pulso ao centro do eco (TE); em cima, a chave longa de pulso a pulso (TR). Um
// cursor de tempo corre da esquerda para a direita.
const BASE = 140;
const P1 = 40;
const ECHO = 110;
const P2 = 270;
const r1 = (v: number) => Math.round(v * 10) / 10;
// Eco: oscilação com envelope que cresce e some, máxima no centro.
const echo = Array.from({ length: 61 }, (_, i) => {
  const x = ECHO - 30 + i;
  const d = x - ECHO;
  return `${x},${r1(BASE - 24 * Math.exp(-((d / 11) ** 2)) * Math.cos((2 * Math.PI * d) / 8))}`;
}).join(' ');
const pulse = (x: number) =>
  `<rect x="${x - 4}" y="70" width="8" height="${BASE - 70}" rx="2" fill="${P.beam}"/>`;
const brace = (x1: number, x2: number, y: number, dir: 1 | -1, color: string) =>
  `<path d="M${x1} ${y - 8 * dir} V${y} H${x2} V${y - 8 * dir}" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`;
const dash = (x: number, y1: number, y2: number) =>
  `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="${P.muted}" stroke-width="2" stroke-dasharray="3 4"/>`;

export const linhaDoTempoTrTe: DiagramSpec = {
  id: 'linha-do-tempo-tr-te',
  alt: 'Linha do tempo com um pulso, um eco pouco depois e o pulso seguinte bem adiante; uma chave curta e uma longa marcam os intervalos, e um cursor corre por ela.',
  width: 320,
  height: 240,
  periodMs: 4800,
  // Cursor sobre o centro do eco.
  posterAt: 0.33,
  layers: [
    {
      // Linha do tempo e guias das chaves.
      svg: `<line x1="16" y1="${BASE}" x2="304" y2="${BASE}" stroke="${P.muted}" stroke-width="2"/>
${dash(P1, BASE + 4, 190)}${dash(ECHO, BASE + 26, 190)}${dash(P1, 46, 66)}${dash(P2, 46, 66)}`,
    },
    // Chave curta (TE), embaixo, e chave longa (TR), em cima.
    { svg: `${brace(P1, ECHO, 200, 1, P.electron)}${brace(P1, P2, 36, -1, P.accent)}` },
    { svg: `${pulse(P1)}${pulse(P2)}` },
    {
      svg: `<polyline points="${echo}" fill="none" stroke="${P.electron}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`,
    },
    {
      // Cursor de tempo: de x 16 a x 304.
      svg: `<line x1="16" y1="54" x2="16" y2="182" stroke="${P.line}" stroke-width="2" stroke-opacity="0.8"/>
<circle cx="16" cy="${BASE}" r="4" fill="${P.line}"/>`,
      motion: { kind: 'translate', dx: 288, dy: 0, mode: 'loop' },
    },
  ],
};
