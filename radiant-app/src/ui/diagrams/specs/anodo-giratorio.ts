import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240. Disco do ânodo visto de frente (centro 112,128; raio 80), com a
// pista focal em anel (raio 58 a 72) perto da borda. O disco gira (sentido
// horário); o feixe de elétrons e o ponto de impacto (177,128, na pista) ficam
// parados no espaço, e a pista aquecida se espalha pela borda logo depois do
// ponto de impacto, no sentido do giro, e esfria. O feixe útil sai desse ponto,
// perpendicular à direção dos elétrons. A haste do rotor, vista de frente, é o
// cubo no centro.
const CX = 112;
const CY = 128;
const RING = 65;
const IX = CX + RING;
const r1 = (v: number) => Math.round(v * 10) / 10;
const at = (deg: number, r: number) => `${r1(CX + r * Math.cos((deg * Math.PI) / 180))},${r1(CY + r * Math.sin((deg * Math.PI) / 180))}`;

const xy = (deg: number, r: number) => [r1(CX + r * Math.cos((deg * Math.PI) / 180)), r1(CY + r * Math.sin((deg * Math.PI) / 180))];
const ticks = Array.from({ length: 8 }, (_, k) => {
  const [x1, y1] = xy(k * 45, 28);
  const [x2, y2] = xy(k * 45, 42);
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>`;
}).join('\n');

// Trecho aquecido: quatro arcos de 28 graus, do ponto de impacto para baixo, cada vez mais fracos.
const trail = [0.55, 0.38, 0.24, 0.12]
  .map((o, k) => `<path d="M${at(k * 28, RING)} A${RING} ${RING} 0 0 1 ${at((k + 1) * 28, RING)}" fill="none" stroke="${P.beam}" stroke-opacity="${o}" stroke-width="14"/>`)
  .join('\n');

export const anodoGiratorio: DiagramSpec = {
  id: 'anodo-giratorio',
  alt: 'Disco do ânodo girando visto de frente; o feixe de elétrons bate sempre no mesmo ponto da pista em anel, e dali sai o feixe de raios X.',
  width: 320,
  height: 240,
  periodMs: 4800,
  posterAt: 0.1,
  layers: [
    {
      // Disco, pista focal, marcas que mostram o giro e o cubo da haste.
      svg: `<circle cx="${CX}" cy="${CY}" r="80" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<circle cx="${CX}" cy="${CY}" r="${RING}" fill="none" stroke="${P.beam}" stroke-opacity="0.12" stroke-width="14"/>
${ticks}
<circle cx="${CX + 52}" cy="${CY}" r="4" fill="${P.line}"/>
<circle cx="${CX}" cy="${CY}" r="12" fill="${P.bg}" stroke="${P.line}" stroke-width="3"/>`,
      motion: { kind: 'rotate', degrees: 360, cx: CX, cy: CY, mode: 'loop' },
    },
    {
      // Pista aquecida logo depois do impacto.
      svg: trail,
    },
    {
      // Feixe útil, saindo do ponto de impacto.
      svg: `<polygon points="${IX},${CY} 300,214 205,236" fill="${P.beam}" fill-opacity="0.3" stroke="${P.beam}" stroke-width="2" stroke-linejoin="round"/>`,
    },
    {
      // Cátodo (copo e filamento, abertos para o disco) e feixe de elétrons, parados.
      svg: `<g transform="translate(284 40) rotate(141)"><path d="M14 -12 H0 V12 H14" fill="none" stroke="${P.muted}" stroke-width="3" stroke-linejoin="round"/>
<path d="M4 0 l2 -6 l3 12 l3 -12 l2 6" fill="none" stroke="${P.line}" stroke-width="2.5" stroke-linejoin="round"/></g>
<line x1="266" y1="54" x2="196" y2="110" stroke="${P.electron}" stroke-width="3" stroke-dasharray="2 8" stroke-linecap="round"/>
<polygon points="${IX + 2},${CY - 3} 190,106 198,117" fill="${P.electron}"/>`,
    },
    {
      // Ponto de impacto brilhando.
      svg: `<circle cx="${IX}" cy="${CY}" r="9" fill="${P.beam}" fill-opacity="0.35"/><circle cx="${IX}" cy="${CY}" r="4.5" fill="${P.beam}"/>`,
      motion: { kind: 'fade', from: 0.45, to: 1, mode: 'pingpong' },
    },
  ],
};
