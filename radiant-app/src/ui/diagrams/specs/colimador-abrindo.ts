import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240. Fonte no alto (160,54); as lâminas ficam logo abaixo do tubo
// (y 96 a 108) e o campo se alarga quando elas se afastam. A borda do campo é a
// sombra das lâminas: uma cunha que gira em torno da fonte enquanto a lâmina
// anda, para o raio continuar passando pela ponta dela.
const SX = 160;
const SY = 54;
const BLADE_Y = 102;
const GAP_CLOSED = 12;
const GAP_OPEN = 50;
const deg = (rad: number) => (rad * 180) / Math.PI;
const A0 = deg(Math.atan2(GAP_CLOSED, BLADE_Y - SY));
const SWING = deg(Math.atan2(GAP_OPEN, BLADE_Y - SY)) - A0;
const r1 = (v: number) => Math.round(v * 10) / 10;
/** Ponto a `r` da fonte, `angle` graus da vertical; `side` -1 é a esquerda. */
const at = (angle: number, r: number, side: 1 | -1) => {
  const a = (angle * Math.PI) / 180;
  return `${r1(SX + side * r * Math.sin(a))},${r1(SY + r * Math.cos(a))}`;
};
// Lado da sombra: da borda do campo até bem além do quadro, em passos de 40
// graus para a corda nunca entrar no quadro.
const wedge = (side: 1 | -1) =>
  `<polygon points="${SX},${SY} ${[0, 40, 80, 120].map((d) => at(A0 + d, 600, side)).join(' ')}" fill="${P.bg}"/>`;

const blade = (x: number) =>
  `<rect x="${x}" y="96" width="78" height="12" rx="2" fill="${P.fill}" stroke="${P.line}" stroke-width="3" stroke-linejoin="round"/>`;

const pingpong = { mode: 'pingpong' } as const;

export const colimadorAbrindo: DiagramSpec = {
  id: 'colimador-abrindo',
  alt: 'Colimador: duas lâminas logo abaixo do tubo se afastam e o campo de luz sobre o receptor se alarga.',
  width: 320,
  height: 240,
  periodMs: 3600,
  posterAt: 0.5,
  layers: [
    {
      // Luz que sai do tubo, larga; as sombras das lâminas recortam o campo.
      svg: `<polygon points="${SX},${SY} -400,100 -400,600 720,600 720,100" fill="${P.beam}" fill-opacity="0.3"/>`,
    },
    { svg: wedge(-1), motion: { kind: 'rotate', degrees: SWING, cx: SX, cy: SY, ...pingpong } },
    { svg: wedge(1), motion: { kind: 'rotate', degrees: -SWING, cx: SX, cy: SY, ...pingpong } },
    {
      // Cobre o que passa do receptor.
      svg: `<rect x="0" y="208" width="320" height="32" fill="${P.bg}"/>`,
    },
    { svg: blade(70), motion: { kind: 'translate', dx: GAP_CLOSED - GAP_OPEN, dy: 0, ...pingpong } },
    { svg: blade(172), motion: { kind: 'translate', dx: GAP_OPEN - GAP_CLOSED, dy: 0, ...pingpong } },
    {
      // Tubo e receptor.
      svg: `<rect x="118" y="12" width="84" height="38" rx="10" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<circle cx="${SX}" cy="${SY}" r="4" fill="${P.beam}"/>
<rect x="40" y="200" width="240" height="8" rx="3" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>`,
    },
  ],
};
