import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Gramática de gráficos (fase 3). Quadro 320x240, sem texto. Três gráficos de tensão contra tempo empilhados, cada um
// com seus eixos (tempo para a direita, tensão para cima) e todos com o mesmo pico (28, marcado por uma linha tracejada
// por faixa). (a) alternada: dois ciclos, zero na base (y=64). (b) onda completa: só os meios ciclos positivos, cada um
// cai a zero (base y=142). (c) quase constante: ondulação pequena logo abaixo do pico (base y=208). Mesma tensão, mesma
// cor (azul), área a 20%.
// Movimento (um relógio, laço): 0 a 0,06 só os eixos; 0,06 a 0,6 o tempo corre e os três traçados aparecem da esquerda
// para a direita, linear (o eixo é tempo); 0,6 a 0,9 o quadro completo, que é também o quadro parado (posterAt 0,8);
// 0,9 a 1 os traçados se apagam. A cortina da cor do painel nunca fica sobre os eixos nem sobre a moldura.
// Sem alvo de toque nas aulas (m19 usa só como visual do conceito).
const X0 = 40;
const X1 = 284;
const PEAK = 28;
const BASES = [64, 142, 208];
const r1 = (v: number) => Math.round(v * 10) / 10;
const trace = (base: number, f: (x: number) => number) => {
  const pts: string[] = [];
  for (let x = X0; x <= X1; x += 2) pts.push(`${x},${r1(base + f(x))}`);
  return pts;
};
const area = (base: number, pts: string[]) => `M${X0},${base} L${pts.join(' L')} L${X1},${base} Z`;
const S = (2 * Math.PI * 2) / (X1 - X0); // dois ciclos de rede entre X0 e X1
const sine = (x: number) => Math.sin(S * (x - X0));

const a = trace(BASES[0], (x) => -PEAK * sine(x));
const b = trace(BASES[1], (x) => -PEAK * Math.abs(sine(x)));
// Ondulação de 5: sobe de zero ao pico em 12 unidades e oscila com período 35.
const c = trace(BASES[2], (x) => {
  const ripple = 2.5 * (1 - Math.cos((2 * Math.PI * (x - X0)) / 35));
  const rise = Math.min(1, (x - X0) / 12);
  return -(PEAK - ripple) * Math.sin((rise * Math.PI) / 2);
});
const wave = (base: number, pts: string[]) =>
  `<path d="${area(base, pts)}" fill="${P.accent}" fill-opacity="0.2" stroke="none"/><polyline points="${pts.join(' ')}" fill="none" stroke="${P.accent}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>`;

// Eixo de tempo com ponta cheia; eixo de tensão de `top` a `bottom` com ponta cheia em `top`.
const axes = (base: number, top: number, bottom: number) =>
  `<path d="M32 ${base} H292 M32 ${bottom} V${top + 13}" fill="none" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round"/>
<polygon points="304,${base} 291,${base - 5.5} 291,${base + 5.5}" fill="${P.muted}"/>
<polygon points="32,${top} 26.5,${top + 13} 37.5,${top + 13}" fill="${P.muted}"/>
<line x1="${X0}" y1="${base - PEAK}" x2="${X1}" y2="${base - PEAK}" stroke="${P.line}" stroke-width="2" stroke-dasharray="6 5" stroke-linecap="round" stroke-opacity="0.7"/>`;

const W = X1 - 38;

export const retificacaoDeOnda: DiagramSpec = {
  id: 'retificacao-de-onda',
  alt: 'Três traçados de tensão empilhados: onda alternada, onda retificada que cai a zero a cada meio ciclo e tensão quase constante com ondulação pequena.',
  width: 320,
  height: 240,
  periodMs: 7000,
  posterAt: 0.8,
  layers: [
    { svg: `<rect x="8" y="8" width="304" height="224" rx="16" fill="${P.fill}"/>` },
    {
      svg: `${wave(BASES[0], a)}${wave(BASES[1], b)}${wave(BASES[2], c)}`,
      motion: { kind: 'fade', from: 1, to: 0, mode: 'loop', keys: [[0, 0], [0.9, 0], [1, 1]], ease: 'inOut' },
    },
    {
      svg: `<rect x="38" y="24" width="${W}" height="204" fill="${P.fill}"/>`,
      motion: { kind: 'translate', dx: W, dy: 0, mode: 'loop', keys: [[0, 0], [0.06, 0], [0.6, 1], [1, 1]], ease: 'linear' },
    },
    {
      // Eixos e a linha do pico comum, sempre visíveis.
      svg: `${axes(BASES[0], 24, 92)}${axes(BASES[1], 102, 144)}${axes(BASES[2], 170, 210)}`,
    },
    {
      // Moldura da cor do fundo: esconde a cortina que passa da borda do painel e arredonda os cantos.
      svg: `<path fill-rule="evenodd" fill="${P.bg}" d="M0 0H320V240H0Z M24 8H296A16 16 0 0 1 312 24V216A16 16 0 0 1 296 232H24A16 16 0 0 1 8 216V24A16 16 0 0 1 24 8Z"/>`,
    },
  ],
};
