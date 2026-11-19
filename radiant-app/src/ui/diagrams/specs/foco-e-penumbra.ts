import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240. Fonte (ponto focal) em (160,30); a borda do objeto em
// E=(160,100); receptor em y=190. Distância fonte-objeto 70, objeto-receptor 90:
// a penumbra mede foco * 90/70. O foco vai de 6 a 18 (disco r 3 a 9); os dois
// raios que passam pela borda saem das pontas do foco e giram em torno de E; a
// faixa de penumbra na tira do receptor cresce junto (escala 1 a 3). Todos com
// pingpong e o mesmo período.
const E = { x: 160, y: 100 };
const OID_SOD = 90 / 70;
const HALF0 = 3; // meio foco no menor
const HALF1 = 9; // e no maior
const deg = (rad: number) => (rad * 180) / Math.PI;
const SWING = deg(Math.atan(HALF1 / 70)) - deg(Math.atan(HALF0 / 70));
const P0 = 2 * HALF0 * OID_SOD; // penumbra no menor foco
const N = 6;
const r3 = (v: number) => Math.round(v * 1000) / 1000;
const pingpong = { mode: 'pingpong' } as const;

/** Raio que sai da ponta (160 ± 3, 30), passa por E e chega ao receptor em 160 ∓ 3,857. */
const edgeRay = (side: 1 | -1) => ({
  svg: `<line x1="${E.x + side * HALF0}" y1="30" x2="${r3(E.x - side * HALF0 * OID_SOD)}" y2="190" stroke="${P.beam}" stroke-width="2"/>`,
  motion: { kind: 'rotate' as const, degrees: r3(side * SWING), cx: E.x, cy: E.y, ...pingpong },
});

const slices = Array.from(
  { length: N },
  (_, i) =>
    `<rect x="${r3(E.x - P0 / 2 + (i * P0) / N)}" y="199" width="${r3(P0 / N + 0.05)}" height="14" fill="${P.beam}" fill-opacity="${r3(((i + 1) / (N + 1)) * 0.9)}"/>`,
).join('\n');

export const focoEPenumbra: DiagramSpec = {
  id: 'foco-e-penumbra',
  alt: 'O ponto focal alterna entre pequeno e grande; os raios da borda do objeto abrem, e a faixa borrada na borda da sombra, no receptor, alarga e estreita.',
  width: 320,
  height: 240,
  periodMs: 4000,
  posterAt: 0.5,
  layers: [
    {
      // Caixa da fonte, objeto (lâmina fina, com a borda em E), raio central e receptor.
      svg: `<rect x="124" y="6" width="72" height="24" rx="8" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<line x1="160" y1="30" x2="160" y2="190" stroke="${P.muted}" stroke-width="1.5" stroke-dasharray="4 6"/>
<rect x="70" y="98" width="90" height="4" rx="1" fill="${P.fill}" stroke="${P.line}" stroke-width="2"/>
<rect x="60" y="190" width="200" height="8" rx="3" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>`,
    },
    {
      // Ponto focal.
      svg: `<circle cx="160" cy="30" r="${HALF0}" fill="${P.beam}"/>`,
      motion: { kind: 'scale', from: 1, to: HALF1 / HALF0, cx: 160, cy: 30, ...pingpong },
    },
    edgeRay(1),
    edgeRay(-1),
    {
      // Tira do receptor: sombra, faixa de penumbra e área exposta; cresce a partir do topo.
      svg: `<rect x="20" y="199" width="${r3(160 - P0 / 2 - 20)}" height="14" fill="${P.fill}"/>
${slices}
<rect x="${r3(160 + P0 / 2)}" y="199" width="140" height="14" fill="${P.beam}" fill-opacity="0.9"/>`,
      motion: { kind: 'scale', from: 1, to: HALF1 / HALF0, cx: 160, cy: 199, ...pingpong },
    },
    {
      // Moldura da tira: cobre o que passa dela.
      svg: `<rect x="0" y="199" width="60" height="14" fill="${P.bg}"/>
<rect x="260" y="199" width="60" height="14" fill="${P.bg}"/>
<rect x="0" y="213" width="320" height="27" fill="${P.bg}"/>
<rect x="60" y="199" width="200" height="14" fill="none" stroke="${P.muted}" stroke-width="2"/>`,
    },
  ],
};
