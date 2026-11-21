import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Gramática de gráficos (fase 3). Quadro 320x240, sem texto. Dois gráficos de feixe contra tempo, empilhados e com o
// mesmo eixo de tempo (mesmo x0 e mesma janela, de 36 a 190): em cima, o feixe contínuo, um patamar único; embaixo, o
// pulsado, seis pulsos curtos separados por pausas sem feixe. Área sob a curva a 20% (é o que se expõe: a de cima é
// várias vezes a de baixo). À direita, o monitor, que mostra a imagem o tempo todo, inclusive nas pausas.
// Movimento (um relógio, laço): 0 a 0,06 só os eixos; 0,06 a 0,62 um cursor corre da esquerda para a direita e deixa
// os dois sinais descobertos, linear porque o eixo é tempo; o cursor sai do painel em ~0,59; de 0,62 a 0,9 o gráfico
// inteiro, que é também o quadro parado (posterAt 0,8); 0,9 a 1 os sinais se apagam. A cortina e o cursor são uma
// camada só, com a cor do painel, sempre abaixo de eixos, monitor e moldura.
const X0 = 28; // eixo vertical de ambos
const A = 36; // início da janela de tempo
const B = 190; // fim da janela
const TOP = { base: 96, level: 52 }; // gráfico do feixe contínuo
const BOT = { base: 204, level: 160 }; // gráfico do feixe pulsado
const PULSE = 14;
const STEP = 28;

const stroke = `fill="none" stroke="${P.beam}" stroke-width="3.5" stroke-linejoin="round"`;
const area = (d: string) => `<path d="${d}Z" fill="${P.beam}" fill-opacity="0.2"/>`;
const wave = (g: { base: number; level: number }, xs: number[], w: number) =>
  xs.map((x) => `${area(`M${x} ${g.base}V${g.level}H${x + w}V${g.base}`)}<path d="M${x} ${g.base}V${g.level}H${x + w}V${g.base}" ${stroke}/>`).join('');
const axes = (g: { base: number }, tip: number) =>
  `<path d="M${X0} ${g.base}H204M${X0} ${g.base}V${tip + 12}" fill="none" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round"/>
<polygon points="216,${g.base} 204,${g.base - 5.5} 204,${g.base + 5.5}" fill="${P.muted}"/>
<polygon points="${X0},${tip} ${X0 - 5.5},${tip + 13} ${X0 + 5.5},${tip + 13}" fill="${P.muted}"/>`;
const pulses = [0, 1, 2, 3, 4, 5].map((k) => A + STEP * k);

// Cortina da cor do painel com o cursor na borda esquerda; sai pela direita, sob a moldura. Em t = 0 o cursor está
// exatamente sobre o eixo vertical de cada gráfico (traço 2 sob o eixo de 2,5), então só aparece quando começa a
// correr; e ele cobre só a extensão de cada eixo, como o eixo.
const CUR = X0;
const cursor = (g: { base: number }, tip: number) =>
  `<line x1="${CUR}" y1="${tip + 12}" x2="${CUR}" y2="${g.base}" stroke="${P.line}" stroke-width="2" stroke-linecap="round" stroke-opacity="0.85"/>`;
const curtain = `<rect x="${CUR}" y="26" width="296" height="186" fill="${P.fill}"/>${cursor(TOP, 28)}${cursor(BOT, 124)}`;

export const fluoroscopiaPulsada: DiagramSpec = {
  id: 'fluoroscopia-pulsada',
  alt: 'Duas linhas do tempo: feixe contínuo em barra cheia e feixe pulsado em blocos curtos com pausas; um cursor corre pelas duas e o monitor mantém a imagem.',
  width: 320,
  height: 240,
  periodMs: 6400,
  posterAt: 0.8,
  layers: [
    { svg: `<rect x="8" y="8" width="304" height="224" rx="16" fill="${P.fill}"/>` },
    {
      // Os dois sinais: feixe contínuo (um patamar) e pulsado (seis pulsos).
      svg: `${wave(TOP, [A], B - A)}${wave(BOT, pulses, PULSE)}`,
      motion: { kind: 'fade', from: 1, to: 0, mode: 'loop', keys: [[0, 0], [0.9, 0], [1, 1]], ease: 'inOut' },
    },
    {
      svg: curtain,
      motion: { kind: 'translate', dx: 296, dy: 0, mode: 'loop', keys: [[0, 0], [0.06, 0], [0.62, 1], [1, 1]], ease: 'linear' },
    },
    {
      // Eixos de tempo e de feixe, e o monitor com a imagem retida (sempre visíveis).
      svg: `${axes(TOP, 28)}${axes(BOT, 124)}
<rect x="232" y="84" width="72" height="56" rx="8" fill="${P.bg}" stroke="${P.accent}" stroke-width="3"/>
<rect x="240" y="92" width="56" height="40" rx="4" fill="${P.accent}" fill-opacity="0.3"/>
<circle cx="268" cy="108" r="11" fill="none" stroke="${P.line}" stroke-width="2.5"/>
<path d="M268 119 V132" stroke="${P.line}" stroke-width="2.5" stroke-linecap="round"/>
<path d="M268 140 V156 M252 158 H284" fill="none" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      // Moldura da cor do fundo: esconde a cortina que passa da borda do painel e arredonda os cantos.
      svg: `<path fill-rule="evenodd" fill="${P.bg}" d="M0 0H320V240H0Z M24 8H296A16 16 0 0 1 312 24V216A16 16 0 0 1 296 232H24A16 16 0 0 1 8 216V24A16 16 0 0 1 24 8Z"/>`,
    },
  ],
};
