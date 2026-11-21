import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Gramática de gráficos (fase 3). Quadro 320x240, sem texto. Sinal contra tempo de uma repetição da sequência: o
// pulso de excitação (barra âmbar, x 52), o sinal que começa a se desfazer, o eco (máximo em x 124) e o pulso
// seguinte (x 268). Duas chaves em P.line, ambas contadas a partir do pulso: embaixo a curta (TE, do pulso ao centro
// do eco) e em cima a longa (TR, de um pulso ao seguinte), cada uma ligada por pontilhado de leitura às marcas que
// fecha. O sinal oscila em torno do eixo do tempo; é a curva principal (azul).
// Movimento (um relógio, laço): 0 a 0,06 só os eixos; 0,06 a 0,62 um cursor corre da esquerda para a direita e vai
// descobrindo pulso, sinal, chaves e pulso seguinte (linear: o eixo é tempo); o cursor sai do painel em ~0,61; de
// 0,62 a 0,9 o gráfico inteiro, que é também o quadro parado (posterAt 0,8); 0,9 a 1 tudo se apaga.
const BASE = 128;
const P1 = 52;
const ECHO = 124;
const P2 = 268;
const r1 = (v: number) => Math.round(v * 10) / 10;
// Sinal: oscilação de período 10 com envelope = decaimento logo após o pulso + crescimento e queda do eco.
const signal = Array.from({ length: 106 }, (_, i) => {
  const x = P1 + 4 + i;
  const env = 22 * Math.exp(-(x - (P1 + 4)) / 12) + 24 * Math.exp(-(((x - ECHO) / 14) ** 2));
  return `${x},${r1(BASE - env * Math.cos((2 * Math.PI * (x - ECHO)) / 10))}`;
}).join(' ');
const pulse = (x: number) => `<rect x="${x - 4}" y="70" width="8" height="${BASE - 70}" rx="2" fill="${P.beam}"/>`;
const brace = (x1: number, x2: number, y: number, dir: 1 | -1) =>
  `<path d="M${x1} ${y - 8 * dir}V${y}H${x2}V${y - 8 * dir}" fill="none" stroke="${P.line}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`;
const dots = (x: number, y1: number, y2: number) =>
  `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="${P.line}" stroke-width="2" stroke-dasharray="2 5" stroke-linecap="round" stroke-opacity="0.75"/>`;

const CUR = 30;
const curtain = `<rect x="${CUR}" y="26" width="290" height="186" fill="${P.fill}"/>
<line x1="${CUR}" y1="30" x2="${CUR}" y2="210" stroke="${P.line}" stroke-width="2.5" stroke-linecap="round" stroke-opacity="0.85"/>`;

export const linhaDoTempoTrTe: DiagramSpec = {
  id: 'linha-do-tempo-tr-te',
  alt: 'Linha do tempo com um pulso, um eco pouco depois e o pulso seguinte bem adiante; uma chave curta e uma longa marcam os intervalos, e um cursor corre por ela.',
  width: 320,
  height: 240,
  periodMs: 6400,
  posterAt: 0.8,
  layers: [
    { svg: `<rect x="8" y="8" width="304" height="224" rx="16" fill="${P.fill}"/>` },
    {
      // Pulsos, sinal, chaves e pontilhados de leitura.
      svg: `${dots(P1, BASE + 6, 180)}${dots(ECHO, BASE + 30, 180)}${dots(P1, 54, 66)}${dots(P2, 54, 66)}${brace(P1, ECHO, 190, 1)}${brace(P1, P2, 44, -1)}${pulse(P1)}${pulse(P2)}
<polyline points="${signal}" fill="none" stroke="${P.accent}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`,
      motion: { kind: 'fade', from: 1, to: 0, mode: 'loop', keys: [[0, 0], [0.9, 0], [1, 1]], ease: 'inOut' },
    },
    {
      svg: curtain,
      motion: { kind: 'translate', dx: 288, dy: 0, mode: 'loop', keys: [[0, 0], [0.06, 0], [0.62, 1], [1, 1]], ease: 'linear' },
    },
    {
      // Eixo do tempo (a meio do sinal) e eixo do sinal, sempre visíveis.
      svg: `<path d="M24 ${BASE}H292M24 ${BASE}V164" fill="none" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round"/>
<polygon points="304,${BASE} 292,${BASE - 5.5} 292,${BASE + 5.5}" fill="${P.muted}"/>
<path d="M24 ${BASE}V41" fill="none" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round"/>
<polygon points="24,28 18.5,41 29.5,41" fill="${P.muted}"/>`,
    },
    {
      svg: `<path fill-rule="evenodd" fill="${P.bg}" d="M0 0H320V240H0Z M24 8H296A16 16 0 0 1 312 24V216A16 16 0 0 1 296 232H24A16 16 0 0 1 8 216V24A16 16 0 0 1 24 8Z"/>`,
    },
  ],
};
