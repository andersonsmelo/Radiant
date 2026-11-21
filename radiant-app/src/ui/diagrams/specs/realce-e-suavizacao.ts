import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Gramática de gráficos (fase 3). Quadro 320x240, sem texto. Três perfis da mesma borda (um degrau), empilhados, cada
// um com seus eixos (posição para a direita, valor do pixel para cima): original (rampa curta), realçado (afunda antes
// da borda e passa do patamar depois dela: o halo) e suavizado (rampa bem mais larga). Nos dois de baixo, o original
// aparece tracejado ao fundo (referência, muted). O que o realce acrescenta (o halo) é a região âmbar entre o realçado
// e o original; o que a suavização tira (o detalhe fino da borda) é a região muted a 30% entre o original e o suavizado.
// Movimento (um relógio, laço): 0 a 0,06 só os eixos; 0,06 a 0,6 a posição corre e os três perfis aparecem da esquerda
// para a direita, linear (o eixo é posição); 0,6 a 0,9 o quadro completo, que é também o quadro parado (posterAt 0,8);
// 0,9 a 1 os perfis se apagam. A cortina da cor do painel nunca fica sobre os eixos nem sobre a moldura.
// Sem alvo de toque nas aulas (m22 usa só como visual do conceito).
const B = [76, 142, 208]; // base de cada perfil
const X0 = 40;
const X1 = 284;
const XE = 160; // a borda
const LOW = 16;
const HIGH = 38;
const r1 = (v: number) => Math.round(v * 10) / 10;
const ptsStr = (pts: [number, number][]) => pts.map(([x, y]) => `${r1(x)},${r1(y)}`).join(' ');
const orig = (b: number): [number, number][] => [[X0, b - LOW], [XE - 8, b - LOW], [XE + 8, b - HIGH], [X1, b - HIGH]];
const realce = (b: number): [number, number][] => [[X0, b - LOW], [XE - 28, b - LOW], [XE - 15, b - LOW + 8], [XE + 3, b - HIGH - 8], [XE + 16, b - HIGH], [X1, b - HIGH]];
const smooth = (b: number): [number, number][] => {
  const out: [number, number][] = [[X0, b - LOW]];
  for (let x = XE - 52; x <= XE + 52; x += 4) {
    const t = (x - (XE - 52)) / 104;
    out.push([x, b - LOW - (HIGH - LOW) * t * t * (3 - 2 * t)]);
  }
  out.push([X1, b - HIGH]);
  return out;
};
const line = (pts: [number, number][], color: string) =>
  `<polyline points="${ptsStr(pts)}" fill="none" stroke="${color}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>`;
const ref = (b: number) =>
  `<polyline points="${ptsStr(orig(b))}" fill="none" stroke="${P.muted}" stroke-width="2.5" stroke-dasharray="6 6" stroke-linejoin="round" stroke-linecap="round"/>`;
/** Região entre dois perfis: um percorrido de ida e o outro de volta. */
const between = (a: [number, number][], b: [number, number][], color: string, op = 0.3) =>
  `<polygon points="${ptsStr([...a, ...[...b].reverse()])}" fill="${color}" fill-opacity="${op}" stroke="none"/>`;

const axes = (b: number) =>
  `<path d="M32 ${b} H292 M32 ${b} V${b - 44}" fill="none" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round"/>
<polygon points="304,${b} 291,${b - 5.5} 291,${b + 5.5}" fill="${P.muted}"/>
<polygon points="32,${b - 52} 26.5,${b - 39} 37.5,${b - 39}" fill="${P.muted}"/>`;

const W = X1 - 36;

export const realceESuavizacao: DiagramSpec = {
  id: 'realce-e-suavizacao',
  alt: 'Três perfis empilhados de uma mesma borda: degrau com rampa curta, degrau com ultrapassagem antes e depois da borda, e degrau com rampa larga e suave.',
  width: 320,
  height: 240,
  periodMs: 7000,
  posterAt: 0.8,
  layers: [
    { svg: `<rect x="8" y="8" width="304" height="224" rx="16" fill="${P.fill}"/>` },
    {
      // Os três perfis, com o halo (âmbar) e o detalhe perdido (muted).
      svg: `${line(orig(B[0]), P.accent)}
${between(realce(B[1]), orig(B[1]), P.beam, 0.5)}${ref(B[1])}${line(realce(B[1]), P.accent)}
${between(smooth(B[2]), orig(B[2]), P.muted)}${ref(B[2])}${line(smooth(B[2]), P.accent)}`,
      motion: { kind: 'fade', from: 1, to: 0, mode: 'loop', keys: [[0, 0], [0.9, 0], [1, 1]], ease: 'inOut' },
    },
    {
      svg: `<rect x="36" y="24" width="${W}" height="204" fill="${P.fill}"/>`,
      motion: { kind: 'translate', dx: W, dy: 0, mode: 'loop', keys: [[0, 0], [0.06, 0], [0.6, 1], [1, 1]], ease: 'linear' },
    },
    { svg: B.map(axes).join('\n') },
    {
      // Moldura da cor do fundo: esconde a cortina que passa da borda do painel e arredonda os cantos.
      svg: `<path fill-rule="evenodd" fill="${P.bg}" d="M0 0H320V240H0Z M24 8H296A16 16 0 0 1 312 24V216A16 16 0 0 1 296 232H24A16 16 0 0 1 8 216V24A16 16 0 0 1 24 8Z"/>`,
    },
  ],
};
