import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Gramática de gráficos (fase 3). Quadro 320x240, sem texto. Dois gráficos de sinal contra tempo no mesmo painel.
// À esquerda, a recuperação T1 (1 - e^(-t/T1)): as duas curvas sobem do zero ao mesmo patamar. À direita, o
// decaimento T2 (e^(-t/T2)): as duas caem do topo rumo a zero. Cor por tecido: âmbar é o tecido de T1 e T2 curtos
// (gordura), azul é o líquido (lento nos dois). A marca em t = T (pontilhado até o eixo) fica em 63% do patamar na
// recuperação e em 37% no decaimento: é o que "T" quer dizer.
// Movimento (um relógio, laço): 0 a 0,06 só os eixos; 0,06 a 0,6 o tempo corre e as curvas aparecem da esquerda para a
// direita, linear porque o eixo é tempo; 0,6 a 0,9 o gráfico inteiro, que é também o quadro parado (posterAt 0,8);
// 0,9 a 1 as curvas se apagam. As cortinas têm a cor do painel e nunca ficam sobre eixo ou moldura (camadas acima).
// Geometria dos alvos da aula (m29) preservada: mesmas origens, patamar e constantes de tempo.
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
  `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>`;
/** Marca de T: pontilhado até o eixo, risco no eixo e ponto com anel da cor do painel. */
const mark = (x0: number, T: number, f: (t: number) => number, color: string) => {
  const x = x0 + T;
  const y = r1(OY - H * f(T));
  return `<line x1="${x}" y1="${y}" x2="${x}" y2="${OY}" stroke="${color}" stroke-width="2" stroke-dasharray="2 5" stroke-linecap="round" stroke-opacity="0.75"/>
<line x1="${x}" y1="${OY}" x2="${x}" y2="${OY + 8}" stroke="${color}" stroke-width="3.5" stroke-linecap="round"/>
<circle cx="${x}" cy="${y}" r="5" fill="${color}" stroke="${P.fill}" stroke-width="2.5"/>`;
};
const axes = (x0: number) =>
  `<path d="M${x0} ${OY} H${x0 + SPAN - 4} M${x0} ${OY} V38" fill="none" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round"/>
<polygon points="${x0 + SPAN + 5},${OY} ${x0 + SPAN - 7},${OY - 5.5} ${x0 + SPAN - 7},${OY + 5.5}" fill="${P.muted}"/>
<polygon points="${x0},28 ${x0 - 5.5},41 ${x0 + 5.5},41" fill="${P.muted}"/>`;

const W = SPAN + 8;
// A cortina começa 2 antes da origem: o início das curvas (ponta redonda, junto ao eixo) fica sob ela em t = 0.
const curtain = (x0: number) => `<rect x="${x0 - 2}" y="26" width="${W}" height="${OY + 12 - 26}" fill="${P.fill}"/>`;
const sweep = { kind: 'translate', dx: W, dy: 0, mode: 'loop', keys: [[0, 0], [0.06, 0], [0.6, 1], [1, 1]], ease: 'linear' } as const;
const clear = { kind: 'fade', from: 1, to: 0, mode: 'loop', keys: [[0, 0], [0.9, 0], [1, 1]], ease: 'inOut' } as const;

export const relaxacaoT1T2: DiagramSpec = {
  id: 'relaxacao-t1-t2',
  alt: 'Dois gráficos no tempo: a magnetização longitudinal sobe (esquerda) e o sinal transversal cai (direita), cada um com uma curva rápida e outra lenta.',
  width: 320,
  height: 240,
  periodMs: 7000,
  posterAt: 0.8,
  layers: [
    { svg: `<rect x="8" y="8" width="304" height="224" rx="16" fill="${P.fill}"/>` },
    // Gráfico T1: tecido de T1 curto (âmbar) e líquido de T1 longo (azul), com as marcas de T.
    {
      svg: `${line(curve(L, t1(18)), P.beam)}${line(curve(L, t1(70)), P.accent)}${mark(L, 18, t1(18), P.beam)}${mark(L, 70, t1(70), P.accent)}`,
      motion: clear,
    },
    { svg: curtain(L), motion: sweep },
    // Gráfico T2: tecido de T2 curto (âmbar) e líquido de T2 longo (azul).
    {
      svg: `${line(curve(R, t2(16)), P.beam)}${line(curve(R, t2(80)), P.accent)}${mark(R, 16, t2(16), P.beam)}${mark(R, 80, t2(80), P.accent)}`,
      motion: clear,
    },
    { svg: curtain(R), motion: sweep },
    {
      // Eixos e patamar comum da recuperação T1, sempre visíveis.
      svg: `${axes(L)}${axes(R)}
<line x1="${L}" y1="${TOP}" x2="${L + SPAN}" y2="${TOP}" stroke="${P.line}" stroke-width="2" stroke-dasharray="6 5" stroke-linecap="round"/>`,
    },
    {
      // Moldura da cor do fundo: esconde a cortina que passa da borda do painel e arredonda os cantos.
      svg: `<path fill-rule="evenodd" fill="${P.bg}" d="M0 0H320V240H0Z M24 8H296A16 16 0 0 1 312 24V216A16 16 0 0 1 296 232H24A16 16 0 0 1 8 216V24A16 16 0 0 1 24 8Z"/>`,
    },
  ],
};
