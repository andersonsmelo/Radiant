import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240. Eixos sem texto: energia do fóton para a direita (origem
// x=40, energia máxima x=260), quantidade de fótons para cima (zero em y=200).
// Curva de freamento: Kramers, N(u) = (1-u)/u com u = E/Emax, multiplicada pela
// transmissão da filtração exp(-(0,18/u)^3); toca o eixo em Emax. A versão sem
// filtração (tracejada) sobe sem limite à esquerda; o que a filtração tira fica
// sombreado. Picos característicos em energias fixas (59 e 68 keV, para Emax de
// 100 keV: u = 0,59 e 0,68), abaixo de Emax.
const X0 = 40;
const EMAX_X = 260;
const BASE = 200;
const K = 43;
const r1 = (v: number) => Math.round(v * 10) / 10;
const px = (u: number) => X0 + u * (EMAX_X - X0);
const filtered = (u: number) => ((1 - u) / u) * Math.exp(-((0.18 / u) ** 3));
const yF = (u: number) => r1(BASE - K * filtered(u));
const yU = (u: number) => r1(Math.max(40, BASE - (K * (1 - u)) / u));

const us = (from: number, to: number) => {
  const out: number[] = [];
  for (let u = from; u <= to + 1e-9; u += 0.01) out.push(Math.round(u * 100) / 100);
  return out;
};
const solid = us(0.06, 1).map((u) => `${r1(px(u))},${yF(u)}`);
const dashed = us(0.21, 0.55).map((u) => `${r1(px(u))},${yU(u)}`);
const cut = us(0.08, 0.55);
const lost = [...cut.map((u) => `${r1(px(u))},${yU(u)}`), ...[...cut].reverse().map((u) => `${r1(px(u))},${yF(u)}`)];

/** Pico estreito sobre a curva em u, com altura h acima dela. */
const spike = (u: number, h: number) => {
  const [x, y] = [px(u), yF(u)];
  return `<polygon points="${r1(x - 2.5)},${y + 2} ${r1(x)},${r1(y - h)} ${r1(x + 2.5)},${y + 2}" fill="${P.beam}" stroke="${P.beam}" stroke-width="1.5" stroke-linejoin="round"/>`;
};

export const espectroDeRaiosX: DiagramSpec = {
  id: 'espectro-de-raios-x',
  alt: 'Gráfico sem números: curva larga que sobe e cai até zero na energia máxima, dois picos estreitos sobre ela e, à esquerda, a parte baixa cortada.',
  width: 320,
  height: 240,
  layers: [
    {
      // Eixos com ponta de seta.
      svg: `<g fill="none" stroke="${P.muted}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
<path d="M${X0} ${BASE} H300 M292 ${BASE - 6} L300 ${BASE} L292 ${BASE + 6}"/>
<path d="M${X0} ${BASE} V24 M${X0 - 6} 32 L${X0} 24 L${X0 + 6} 32"/>
</g>`,
    },
    {
      // O que a filtração remove: entre a curva sem filtro (tracejada) e a real.
      svg: `<polygon points="${lost.join(' ')}" fill="${P.muted}" fill-opacity="0.22" stroke="none"/>
<polyline points="${dashed.join(' ')}" fill="none" stroke="${P.muted}" stroke-width="2" stroke-dasharray="5 5" stroke-linecap="round"/>`,
    },
    {
      // Radiação de freamento, filtrada: toca o eixo em Emax.
      svg: `<polygon points="${solid.join(' ')} ${r1(px(1))},${BASE}" fill="${P.accent}" fill-opacity="0.22" stroke="none"/>
<polyline points="${solid.join(' ')}" fill="none" stroke="${P.accent}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`,
    },
    {
      // Radiação característica: dois picos em energias fixas.
      svg: `${spike(0.59, 44)}${spike(0.68, 30)}`,
    },
    {
      // Energia máxima, no eixo.
      svg: `<circle cx="${EMAX_X}" cy="${BASE}" r="5" fill="${P.line}"/>`,
    },
  ],
};
