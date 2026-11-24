import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Gramática de gráficos (fase 3). Quadro 320x240, parado (tem alvo de toque), sem texto. Painel opaco; DNA em escada
// reta: as duas fitas azuis (3,5) e degraus finos (muted). Fóton âmbar (traço ondulado com ponta).
// Alvos da aula (m21): impacto direto (64,160) na fita de cima; água atingida (214,70) no O grande; radical (226,127)
// no meio do trilho tracejado; quebra simples (136,196) na fita de baixo; quebra dupla (256,178), entre as duas fitas.
// Cor segue a entidade: azul é a molécula (fitas e O da água), âmbar é a radiação (fótons e marca do impacto), branco
// marca o que é pontual (radical, pontas rompidas). Alvos a 54 ou mais um do outro (toque de 44 pt sem sobrepor).
const r = (v: number) => Math.round(v * 100) / 100;
const TOP = 160;
const BOT = 196;

/** Traço ondulado de (x1,y1) a (x2,y2) com ponta em chevron: `cycles` ondas de amplitude `amp`. */
const photon = (x1: number, y1: number, x2: number, y2: number, amp: number, cycles: number) => {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const [ux, uy] = [(x2 - x1) / len, (y2 - y1) / len];
  const n = Math.round(len / 3);
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const o = amp * Math.sin(t * cycles * 2 * Math.PI);
    return `${r(x1 + ux * len * t - uy * o)},${r(y1 + uy * len * t + ux * o)}`;
  });
  const back = (s: number) => `${r(x2 - ux * 9 + uy * s * 5.5)},${r(y2 - uy * 9 - ux * s * 5.5)}`;
  return `<polyline points="${pts.join(' ')}" fill="none" stroke="${P.beam}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
<polyline points="${back(1)} ${r(x2)},${r(y2)} ${back(-1)}" fill="none" stroke="${P.beam}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
};

// Degraus a cada 24 de 52 a 268; o do meio da quebra dupla (x=256) fica só em dois cotos.
const rungs = Array.from({ length: 10 }, (_, j) => 52 + 24 * j)
  .map((x) => `M${x} ${TOP} V${BOT}`)
  .join(' ');
const flare = (x: number, y: number, side: 1 | -1) => `M${x} ${y} l${5 * side} -6 M${x} ${y} l${5 * side} 6`;

export const danoAoDna: DiagramSpec = {
  id: 'dano-ao-dna',
  alt: 'Trecho de DNA em escada: um fóton atinge a fita; outro atinge uma molécula de água, que lança um radical até a fita. A fita tem uma quebra simples e uma dupla.',
  width: 320,
  height: 240,
  layers: [
    {
      // Painel, degraus e as duas fitas; a de baixo tem a quebra simples (x 128 a 144), as duas têm a dupla (x 248 a 264).
      svg: `<rect x="8" y="8" width="304" height="224" rx="16" fill="${P.fill}"/>
<path d="${rungs} M256 ${TOP + 3} V${TOP + 12} M256 ${BOT - 12} V${BOT - 3}" fill="none" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round"/>
<path d="M28 ${TOP} H248 M264 ${TOP} H292 M28 ${BOT} H128 M144 ${BOT} H248 M264 ${BOT} H292" fill="none" stroke="${P.accent}" stroke-width="3.5" stroke-linecap="round"/>`,
    },
    {
      // Pontas rompidas em leque: dizem "interrompido".
      svg: `<path d="${flare(128, BOT, -1)} ${flare(144, BOT, 1)} ${flare(248, TOP, -1)} ${flare(264, TOP, 1)} ${flare(248, BOT, -1)} ${flare(264, BOT, 1)}" fill="none" stroke="${P.line}" stroke-width="2.5" stroke-linecap="round"/>`,
    },
    {
      // Ação direta: o fóton desce até a fita de cima e o ponto de impacto fica marcado.
      svg: `${photon(64, 20, 64, 146, 4, 6)}
<circle cx="64" cy="${TOP}" r="9" fill="none" stroke="${P.beam}" stroke-width="2.5"/>
<circle cx="64" cy="${TOP}" r="3" fill="${P.beam}"/>`,
    },
    {
      // Ação indireta: o fóton atinge a molécula de água (O grande, dois H e as ligações).
      svg: `${photon(156, 24, 201, 62, 3.5, 5)}
<path d="M205 81 L201 87 M223 81 L227 87" fill="none" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round"/>
<circle cx="214" cy="70" r="13" fill="${P.accent}" fill-opacity="0.35" stroke="${P.accent}" stroke-width="3"/>
<circle cx="198" cy="94" r="6" fill="none" stroke="${P.line}" stroke-width="2.5"/>
<circle cx="230" cy="94" r="6" fill="none" stroke="${P.line}" stroke-width="2.5"/>`,
    },
    {
      // O radical sai da água e anda pelo trilho tracejado até a fita de cima, longe da quebra dupla (a quebra do radical é simples).
      svg: `<path d="M229 106 L223 150" fill="none" stroke="${P.muted}" stroke-width="2.5" stroke-dasharray="4 5" stroke-linecap="round"/>
<polyline points="217,143 222,153 228,144" fill="none" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="226" cy="127" r="7" fill="${P.line}" stroke="${P.fill}" stroke-width="2.5"/>
<circle cx="226" cy="127" r="13" fill="none" stroke="${P.line}" stroke-width="2" stroke-opacity="0.6"/>`,
    },
  ],
};
