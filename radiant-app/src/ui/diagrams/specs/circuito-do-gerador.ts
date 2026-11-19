import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240. Blocos em linha, da esquerda para a direita, a y=80: rede,
// transformador de alta tensão (secundário com o dobro de espiras), retificador
// em ponte e tubo (cátodo à esquerda, ânodo à direita). Por baixo, o circuito do
// filamento: um transformador pequeno, de baixa tensão, ligado ao cátodo. O
// polo negativo da alta tensão entra no mesmo fio do filamento (ponto no cátodo).
const r1 = (v: number) => Math.round(v * 10) / 10;

/** Bobina vertical em arcos de 8 de altura; `side` 1 abaulado para a direita, -1 para a esquerda. */
const coil = (x: number, y: number, bumps: number, side: 1 | -1) => `M${x} ${y}${` a4 4 0 0 ${side === 1 ? 1 : 0} 0 8`.repeat(bumps)}`;

/** Diodo no lado A->B: triângulo apontando para B, com a barra na ponta. */
const diode = ([ax, ay]: number[], [bx, by]: number[]) => {
  const len = Math.hypot(bx - ax, by - ay);
  const [ux, uy] = [(bx - ax) / len, (by - ay) / len];
  const [nx, ny] = [-uy, ux];
  const [mx, my] = [(ax + bx) / 2, (ay + by) / 2];
  const p = (k: number, s: number) => `${r1(mx + ux * k + nx * s)},${r1(my + uy * k + ny * s)}`;
  return `<polygon points="${p(5, 0)} ${p(-5, 5.5)} ${p(-5, -5.5)}" fill="${P.line}"/>
<line x1="${r1(mx + ux * 5 + nx * 6)}" y1="${r1(my + uy * 5 + ny * 6)}" x2="${r1(mx + ux * 5 - nx * 6)}" y2="${r1(my + uy * 5 - ny * 6)}" stroke="${P.line}" stroke-width="2.5" stroke-linecap="round"/>`;
};
const [L, T, R, B] = [
  [146, 80],
  [170, 56],
  [194, 80],
  [170, 104],
];
const line = `stroke="${P.line}" stroke-width="3" stroke-linecap="round"`;

export const circuitoDoGerador: DiagramSpec = {
  id: 'circuito-do-gerador',
  alt: 'Circuito do gerador: fonte alternada, transformador com secundário de mais espiras, ponte de diodos e tubo; abaixo, um transformador menor liga o filamento.',
  width: 320,
  height: 240,
  layers: [
    {
      // Fios.
      svg: `<g fill="none" stroke="${P.muted}" stroke-width="2.5" stroke-linejoin="round">
<path d="M30 64 H86"/><path d="M30 96 H86"/>
<path d="M58 96 V202 H124"/><path d="M72 64 V178 H124"/>
<path d="M106 48 H140"/><path d="M106 112 H140"/>
<path d="M200 48 H292 V62"/><path d="M200 112 H240"/>
<path d="M240 80 V182 H144"/><path d="M250 80 V198 H144"/>
</g>`,
    },
    {
      // Fonte alternada e os dois transformadores (primário, núcleo, secundário).
      svg: `<circle cx="30" cy="80" r="16" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<path d="M22 80 q4 -9 8 0 t8 0" fill="none" ${line}/>
<g fill="none" ${line} stroke-linejoin="round">
<path d="${coil(86, 64, 4, -1)}"/><path d="${coil(106, 48, 8, 1)}"/>
<path d="M94 44 V116 M98 44 V116"/>
<path d="${coil(124, 178, 3, -1)}"/><path d="${coil(144, 182, 2, 1)}"/>
<path d="M132 174 V206 M136 174 V206"/>
</g>`,
    },
    {
      // Retificador: ponte de quatro diodos dentro do bloco.
      svg: `<rect x="140" y="40" width="60" height="80" rx="8" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<polygon points="${[L, T, R, B].map((q) => q.join(',')).join(' ')}" fill="none" stroke="${P.muted}" stroke-width="2.5" stroke-linejoin="round"/>
${diode(L, T)}
${diode(R, T)}
${diode(B, L)}
${diode(B, R)}`,
    },
    {
      // Tubo: feixe útil, ampola, cátodo (copo e filamento), ânodo e elétrons.
      svg: `<polygon points="284,82 266,128 302,128" fill="${P.beam}" fill-opacity="0.3" stroke="${P.beam}" stroke-width="2" stroke-linejoin="round"/>
<rect x="224" y="56" width="86" height="48" rx="16" fill="${P.bg}" stroke="${P.accent}" stroke-width="3"/>
<path d="M256 68 H234 V92 H256" fill="none" stroke="${P.muted}" stroke-width="3" stroke-linejoin="round"/>
<path d="M240 80 L242 74 L245 86 L247 74 L250 80" fill="none" ${line} stroke-linejoin="round"/>
<line x1="259" y1="80" x2="274" y2="80" stroke="${P.electron}" stroke-width="3" stroke-dasharray="2 7" stroke-linecap="round"/>
<polygon points="282,80 274,75 274,85" fill="${P.electron}"/>
<polygon points="278,64 302,64 302,98 290,98" fill="${P.fill}" stroke="${P.line}" stroke-width="3" stroke-linejoin="round"/>`,
    },
    {
      // Junções de fio.
      svg: `<circle cx="58" cy="96" r="3.5" fill="${P.line}"/><circle cx="72" cy="64" r="3.5" fill="${P.line}"/><circle cx="240" cy="112" r="3.5" fill="${P.line}"/>`,
    },
  ],
};
