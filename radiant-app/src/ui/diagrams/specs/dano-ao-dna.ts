import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Um trecho de DNA em escada reta (fita de cima azul, fita de baixo clara,
// degraus entre elas). Do lado esquerdo, o fóton (traço ondulado amarelo) atinge a própria fita
// (ação direta). No alto à direita, o fóton atinge uma molécula de água (O grande, dois H pequenos)
// e dela sai um radical (ponto ciano) que chega à fita (ação indireta). Na fita de baixo, uma quebra
// simples (só uma fita interrompida); à direita, uma quebra dupla (as duas fitas e o degrau
// interrompidos na mesma altura). A figura não tem texto; o conteúdo rotula.
const r = (v: number) => Math.round(v * 100) / 100;

/** Traço ondulado de (x1,y1) a (x2,y2): `cycles` ondas de amplitude `amp`. */
const wave = (x1: number, y1: number, x2: number, y2: number, amp: number, cycles: number) => {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const [ux, uy] = [(x2 - x1) / len, (y2 - y1) / len];
  const n = Math.round(len / 3);
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const o = amp * Math.sin(t * cycles * 2 * Math.PI);
    return `${r(x1 + ux * len * t - uy * o)},${r(y1 + uy * len * t + ux * o)}`;
  });
  return `<polyline points="${pts.join(' ')}" fill="none" stroke="${P.beam}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
};

const TOP = 160;
const BOT = 196;
// Degraus, menos o que cai na quebra dupla (x=270).
const rungs = [28, 44, 60, 76, 92, 108, 124, 140, 156, 172, 188, 204, 220, 236, 252, 288]
  .map((x) => `<line x1="${x}" y1="${TOP}" x2="${x}" y2="${BOT}" stroke="${P.muted}" stroke-width="2"/>`)
  .join('\n');

export const danoAoDna: DiagramSpec = {
  id: 'dano-ao-dna',
  alt: 'Trecho de DNA em escada: um fóton atinge a fita; outro atinge uma molécula de água, que lança um radical até a fita. A fita tem uma quebra simples e uma dupla.',
  width: 320,
  height: 240,
  layers: [
    {
      // Degraus e as duas fitas; a de baixo tem a quebra simples (x 112 a 128), as duas têm a dupla (x 262 a 278).
      svg: `${rungs}
<path d="M16 ${TOP} H262 M278 ${TOP} H304" fill="none" stroke="${P.accent}" stroke-width="3" stroke-linecap="round"/>
<path d="M16 ${BOT} H112 M128 ${BOT} H262 M278 ${BOT} H304" fill="none" stroke="${P.line}" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      // Pontas rompidas: ficam abertas em leque, para dizer "interrompido".
      svg: `<path d="M112 ${BOT} l-4 6 M128 ${BOT} l4 6 M112 ${BOT} l-4 -6 M128 ${BOT} l4 -6" fill="none" stroke="${P.line}" stroke-width="2.5" stroke-linecap="round"/>
<path d="M262 ${TOP} l-4 -6 M278 ${TOP} l4 -6 M262 ${BOT} l-4 6 M278 ${BOT} l4 6" fill="none" stroke="${P.line}" stroke-width="2.5" stroke-linecap="round"/>`,
    },
    {
      // Ação direta: o fóton desce até a fita de cima e o ponto de impacto fica marcado.
      svg: `${wave(44, 16, 44, 146, 4, 6)}
<polyline points="38,136 44,148 50,136" fill="none" stroke="${P.beam}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="44" cy="${TOP}" r="8" fill="none" stroke="${P.beam}" stroke-width="2.5"/>
<circle cx="44" cy="${TOP}" r="2.5" fill="${P.beam}"/>`,
    },
    {
      // Ação indireta: o fóton atinge a molécula de água (O e dois H) ao lado do DNA.
      svg: `${wave(160, 14, 200, 48, 3.5, 5)}
<circle cx="215" cy="62" r="13" fill="${P.accent}" fill-opacity="0.35" stroke="${P.accent}" stroke-width="3"/>
<circle cx="199" cy="78" r="6" fill="none" stroke="${P.line}" stroke-width="2.5"/>
<circle cx="233" cy="78" r="6" fill="none" stroke="${P.line}" stroke-width="2.5"/>`,
    },
    {
      // O radical sai da água, anda até a fita (rastro tracejado) e chega ao ponto da quebra dupla.
      svg: `<path d="M224 76 L238 112" fill="none" stroke="${P.electron}" stroke-width="2.5" stroke-dasharray="4 5" stroke-linecap="round"/>
<path d="M240 126 L262 150" fill="none" stroke="${P.electron}" stroke-width="2.5" stroke-dasharray="4 5" stroke-linecap="round"/>
<circle cx="238" cy="119" r="8" fill="${P.electron}"/>
<circle cx="238" cy="119" r="12" fill="none" stroke="${P.electron}" stroke-width="2"/>`,
    },
  ],
};
