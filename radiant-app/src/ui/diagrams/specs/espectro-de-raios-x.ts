import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Gramática de gráficos (fase 3). Quadro 320x240, sem texto. Painel opaco inset 8, eixos de 2,5 com ponta
// cheia, curva principal de 3,5 com área a 20%, secundária tracejada de 2,5, marcas com anel da cor da superfície.
// Eixos: energia do fóton para a direita (origem x=40, energia máxima x=260), quantidade de fótons para cima
// (zero em y=200). Curva de freamento: Kramers, N(u) = (1-u)/u com u = E/Emax, multiplicada pela transmissão da
// filtração exp(-(0,18/u)^3); toca o eixo em Emax. A versão sem filtração (tracejada) sobe sem limite à esquerda;
// o que a filtração tira fica sombreado. Picos característicos em energias fixas (59 e 68 keV, para Emax de
// 100 keV: u = 0,59 e 0,68), abaixo de Emax; a marca âmbar no eixo diz que a energia deles não muda.
// Geometria dos alvos da aula (m19) preservada: curva, picos, ponto de Emax e faixa filtrada nos mesmos lugares.
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
// A tracejada e a faixa removida terminam em u = 0,36: mais adiante a filtração quase não tira nada, e o ponto da curva
// (u = 0,41) fica sobre a curva real, e não sobre a tracejada.
const dashed = us(0.21, 0.36).map((u) => `${r1(px(u))},${yU(u)}`);
const cut = us(0.08, 0.36);
const lost = [...cut.map((u) => `${r1(px(u))},${yU(u)}`), ...[...cut].reverse().map((u) => `${r1(px(u))},${yF(u)}`)];

/** Linha característica: haste de 4,5 com ponta redonda, da curva até h acima dela. */
const spike = (u: number, h: number) => `M${r1(px(u))} ${yF(u) + 1} V${r1(yF(u) - h)}`;
const tick = (u: number) => `M${r1(px(u))} ${BASE} v9`;

export const espectroDeRaiosX: DiagramSpec = {
  id: 'espectro-de-raios-x',
  alt: 'Gráfico sem números: curva larga que sobe e cai até zero na energia máxima, dois picos estreitos sobre ela e, à esquerda, a parte baixa cortada.',
  width: 320,
  height: 240,
  layers: [
    {
      // Painel e eixos com ponta cheia.
      svg: `<rect x="8" y="8" width="304" height="224" rx="16" fill="${P.fill}"/>
<g fill="none" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round">
<path d="M${X0} ${BASE} H292"/><path d="M${X0} ${BASE} V32"/>
</g>
<polygon points="304,${BASE} 291,${BASE - 5.5} 291,${BASE + 5.5}" fill="${P.muted}"/>
<polygon points="${X0},24 ${X0 - 5.5},37 ${X0 + 5.5},37" fill="${P.muted}"/>`,
    },
    {
      // O que a filtração remove: entre a curva sem filtro (tracejada) e a real.
      svg: `<polygon points="${lost.join(' ')}" fill="${P.muted}" fill-opacity="0.3" stroke="none"/>
<polyline points="${dashed.join(' ')}" fill="none" stroke="${P.muted}" stroke-width="2.5" stroke-dasharray="6 6" stroke-linecap="round"/>`,
    },
    {
      // Radiação de freamento, filtrada: toca o eixo em Emax.
      svg: `<polygon points="${solid.join(' ')} ${r1(px(1))},${BASE}" fill="${P.accent}" fill-opacity="0.2" stroke="none"/>
<polyline points="${solid.join(' ')}" fill="none" stroke="${P.accent}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>`,
    },
    {
      // Radiação característica: duas linhas em energias fixas, com a marca no eixo.
      svg: `<path d="${spike(0.59, 44)} ${spike(0.68, 30)}" fill="none" stroke="${P.beam}" stroke-width="4.5" stroke-linecap="round"/>
<path d="${tick(0.59)} ${tick(0.68)}" fill="none" stroke="${P.beam}" stroke-width="3.5" stroke-linecap="round"/>`,
    },
    {
      // Energia máxima, no eixo.
      svg: `<circle cx="${EMAX_X}" cy="${BASE}" r="6" fill="${P.line}" stroke="${P.fill}" stroke-width="2.5"/>`,
    },
  ],
};
