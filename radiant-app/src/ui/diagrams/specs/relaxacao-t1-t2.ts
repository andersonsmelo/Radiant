import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240. Dois gráficos de sinal contra tempo. À esquerda, a recuperação
// T1 (1 - e^(-t/T1)): as duas curvas sobem do zero ao mesmo patamar. À direita,
// o decaimento T2 (e^(-t/T2)): as duas caem do topo rumo a zero. Cor por tecido:
// amarelo é o tecido de T1 e T2 curtos (gordura), azul é o líquido (lento nos dois).
const OY = 196; // eixo do tempo
const TOP = 56; // patamar (magnetização máxima)
const H = OY - TOP;
const SPAN = 128; // comprimento do eixo do tempo
const L = 22; // origem do gráfico T1
const R = 178; // origem do gráfico T2
const r1 = (v: number) => Math.round(v * 10) / 10;
const curve = (x0: number, f: (t: number) => number) =>
  Array.from({ length: SPAN / 2 + 1 }, (_, i) => `${x0 + 2 * i},${r1(OY - H * f(2 * i))}`).join(' ');
const t1 = (T: number) => (t: number) => 1 - Math.exp(-t / T);
const t2 = (T: number) => (t: number) => Math.exp(-t / T);
const line = (pts: string, color: string) =>
  `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`;
const axes = (x0: number) =>
  `<polyline points="${x0},30 ${x0},${OY} ${x0 + SPAN + 4},${OY}" fill="none" stroke="${P.muted}" stroke-width="2" stroke-linejoin="round"/>
<polygon points="${x0},24 ${x0 - 5},34 ${x0 + 5},34" fill="${P.muted}"/>
<polygon points="${x0 + SPAN + 10},${OY} ${x0 + SPAN},${OY - 5} ${x0 + SPAN},${OY + 5}" fill="${P.muted}"/>`;

export const relaxacaoT1T2: DiagramSpec = {
  id: 'relaxacao-t1-t2',
  alt: 'Dois gráficos de sinal no tempo: num, duas curvas sobem até o mesmo patamar, uma rápida e uma lenta; no outro, duas curvas caem rumo a zero, rápida e lenta.',
  width: 320,
  height: 240,
  layers: [
    { svg: `${axes(L)}${axes(R)}` },
    {
      // Patamar comum da recuperação T1, tracejado.
      svg: `<line x1="${L}" y1="${TOP}" x2="${L + SPAN}" y2="${TOP}" stroke="${P.line}" stroke-width="2" stroke-dasharray="6 5"/>`,
    },
    // Tecido de T1 e T2 curtos (gordura): rápido nos dois gráficos.
    { svg: `${line(curve(L, t1(18)), P.beam)}${line(curve(R, t2(16)), P.beam)}` },
    // Líquido, T1 e T2 longos: lento nos dois gráficos.
    { svg: `${line(curve(L, t1(70)), P.accent)}${line(curve(R, t2(80)), P.accent)}` },
  ],
};
