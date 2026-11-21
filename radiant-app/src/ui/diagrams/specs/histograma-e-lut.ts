import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Gramática de gráficos (fase 3). Quadro 320x240, parado (tem alvo de toque), sem texto. Dois gráficos lado a lado no
// mesmo painel, com 24 de intervalo entre o fim de um eixo e a origem do outro. À esquerda, o histograma do valor do
// pixel (24 barras, o valor cresce para a direita): pico estreito na ponta baixa (área colimada), grupo largo no meio
// (anatomia, azul) e pico estreito na ponta alta (radiação direta). À direita, a curva em S que converte o valor do
// pixel (horizontal) em brilho (vertical). A mesma faixa de valores (faixa de interesse) está sombreada nos dois
// gráficos: no histograma ela leva o colchete e as barras azuis; na curva, o trecho azul da S. Esquemático: as alturas
// não seguem um exame real.
// Alvos da aula (m22): área colimada (42,150), anatomia (97,160), radiação direta (152,150), valores de interesse
// (131,48; ponta direita do colchete) e curva de conversão (248,123). Distância mínima entre alvos: 55.
const HEIGHTS = [140, 60, 0, 0, 0, 0, 20, 45, 70, 90, 100, 95, 105, 85, 70, 45, 25, 10, 0, 0, 0, 10, 130, 60];
const BASE = 200;
const BX = 40; // primeira barra
const bar = (h: number, i: number, color: string) => {
  const v = Math.max(h, 2);
  return `<rect x="${BX + 5 * i}" y="${BASE - v}" width="3.6" height="${v}" rx="1" fill="${color}"/>`;
};
const bars = (from: number, to: number, color: string) => HEIGHTS.map((h, i) => (i >= from && i <= to ? bar(h, i, color) : '')).join('');
const r1 = (v: number) => Math.round(v * 10) / 10;

const axes = (x0: number, tip: number) =>
  `<path d="M${x0} ${BASE} H${tip - 12} M${x0} ${BASE} V32" fill="none" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round"/>
<polygon points="${tip},${BASE} ${tip - 13},${BASE - 5.5} ${tip - 13},${BASE + 5.5}" fill="${P.muted}"/>
<polygon points="${x0},24 ${x0 - 5.5},37 ${x0 + 5.5},37" fill="${P.muted}"/>`;

// Faixa de interesse: bins 6 a 17 (x 67,5 a 131 no histograma) e a mesma fração do eixo no gráfico da curva.
const BAND_L = [67.5, 131];
const U0 = (BAND_L[0] - BX) / 120;
const U1 = (BAND_L[1] - BX) / 120;
const RX = (u: number) => r1(206 + 84 * u);
const logistic = (u: number) => 1 / (1 + Math.exp(-10 * (u - 0.5)));
const s = (u: number) => (logistic(u) - logistic(0)) / (logistic(1) - logistic(0));
const sy = (u: number) => r1(198 - 150 * s(u));
const pts = (from: number, to: number) => {
  const out: string[] = [];
  const n = Math.max(2, Math.round((to - from) / 0.02));
  for (let i = 0; i <= n; i++) {
    const u = from + ((to - from) * i) / n;
    out.push(`${RX(u)},${sy(u)}`);
  }
  return out.join(' ');
};
const curve = (from: number, to: number, color: string) =>
  `<polyline points="${pts(from, to)}" fill="none" stroke="${color}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>`;

export const histogramaELut: DiagramSpec = {
  id: 'histograma-e-lut',
  alt: 'Histograma com um pico estreito em cada ponta e um grupo largo no meio, coberto por uma faixa azul; ao lado, uma curva em S de conversão.',
  width: 320,
  height: 240,
  layers: [
    {
      // Painel, faixa de interesse nos dois gráficos e os eixos com ponta cheia.
      svg: `<rect x="8" y="8" width="304" height="224" rx="16" fill="${P.fill}"/>
<rect x="${BAND_L[0]}" y="34" width="${r1(BAND_L[1] - BAND_L[0])}" height="${BASE - 34}" fill="${P.accent}" fill-opacity="0.18"/>
<rect x="${RX(U0)}" y="34" width="${r1(RX(U1) - RX(U0))}" height="${BASE - 34}" fill="${P.accent}" fill-opacity="0.18"/>
${axes(32, 172)}
${axes(196, 304)}`,
    },
    {
      // Picos das pontas: a área colimada (sem sinal) e a radiação direta, fora do corpo.
      svg: bars(0, 5, P.muted) + bars(18, 23, P.muted),
    },
    {
      // O grupo largo do meio, a anatomia, e o colchete da faixa de interesse.
      svg: `${bars(6, 17, P.accent)}
<path d="M${BAND_L[0]} 56 V48 H${BAND_L[1]} V56" fill="none" stroke="${P.accent}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`,
    },
    {
      // Curva em S: as caudas em apoio (muted), o trecho dentro da faixa em azul.
      svg: `${curve(0, U0, P.muted)}${curve(U1, 1, P.muted)}${curve(U0, U1, P.accent)}`,
    },
  ],
};
