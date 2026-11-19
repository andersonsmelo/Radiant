import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240. Dois quadros lado a lado do mesmo próton, com B0 (campo
// principal) fixo. À esquerda, a vista lateral, parada: o eixo inclinado sobre o
// cone tracejado, com uma seta curva no sentido do giro. À direita, a vista de
// cima (B0 sai da tela): a ponta do eixo percorre o círculo, no sentido horário.
const TILT = 25; // inclinação do eixo em relação a B0, graus
const L = 120; // comprimento do eixo
const BX = 85; // base do eixo na vista lateral
const BY = 200;
const R = Math.round(L * Math.sin((TILT * Math.PI) / 180) * 10) / 10; // raio do cone no topo
const TOPY = Math.round((BY - L * Math.cos((TILT * Math.PI) / 180)) * 10) / 10;
const TX = 240; // centro da vista de cima
const TY = 120;

const pingpong = { mode: 'pingpong' } as const;

export const precessaoRm: DiagramSpec = {
  id: 'precessao-rm',
  alt: 'Próton com o eixo sempre inclinado em relação ao campo B0, sobre um cone tracejado com seta de giro; na vista de cima, a ponta do eixo gira em círculo.',
  width: 320,
  height: 240,
  periodMs: 4200,
  posterAt: 0.15,
  layers: [
    {
      // B0 nas duas vistas, o cone da lateral e o círculo de cima.
      svg: `<line x1="${BX}" y1="${BY}" x2="${BX}" y2="28" stroke="${P.accent}" stroke-width="3" stroke-linecap="round"/>
<polygon points="${BX},16 ${BX - 8},32 ${BX + 8},32" fill="${P.accent}"/>
<line x1="${BX}" y1="${BY}" x2="${BX - R}" y2="${TOPY}" stroke="${P.muted}" stroke-width="2" stroke-dasharray="5 5"/>
<line x1="${BX}" y1="${BY}" x2="${BX + R}" y2="${TOPY}" stroke="${P.muted}" stroke-width="2" stroke-dasharray="5 5"/>
<ellipse cx="${BX}" cy="${TOPY}" rx="${R}" ry="14" fill="none" stroke="${P.muted}" stroke-width="2" stroke-dasharray="5 5"/>
<circle cx="${BX}" cy="${BY}" r="5" fill="${P.line}"/>
<line x1="150" y1="40" x2="150" y2="200" stroke="${P.fill}" stroke-width="3"/>
<circle cx="${TX}" cy="${TY}" r="${R}" fill="none" stroke="${P.muted}" stroke-width="2" stroke-dasharray="5 5"/>
<circle cx="${TX}" cy="${TY}" r="12" fill="none" stroke="${P.accent}" stroke-width="3"/>
<circle cx="${TX}" cy="${TY}" r="3.5" fill="${P.accent}"/>`,
    },
    {
      // Vista lateral, parada: o eixo inclinado e a seta curva do sentido do giro.
      svg: `<line x1="${BX}" y1="${BY}" x2="${r1(BX - R)}" y2="${TOPY}" stroke="${P.line}" stroke-width="4" stroke-linecap="round"/>
<circle cx="${r1(BX - R)}" cy="${TOPY}" r="6" fill="${P.beam}"/>
<path d="M${BX - 35} ${r1(TOPY - 19.6)} A${r1(R + 10)} 24 0 0 1 ${BX + 35} ${r1(TOPY - 19.6)}" fill="none" stroke="${P.beam}" stroke-width="3" stroke-linecap="round"/>
<polygon points="${r1(BX + 41)},${r1(TOPY - 15.4)} ${r1(BX + 28.8)},${r1(TOPY - 18)} ${r1(BX + 34.8)},${r1(TOPY - 26)}" fill="${P.beam}"/>`,
    },
    {
      // Vista de cima: a ponta percorre o círculo.
      svg: `<line x1="${TX}" y1="${TY}" x2="${r1(TX - R)}" y2="${TY}" stroke="${P.line}" stroke-width="4" stroke-linecap="round"/>
<circle cx="${r1(TX - R)}" cy="${TY}" r="6" fill="${P.beam}"/>`,
      motion: { kind: 'rotate', degrees: 360, cx: TX, cy: TY, mode: 'loop' },
    },
  ],
};

function r1(v: number) {
  return Math.round(v * 10) / 10;
}
