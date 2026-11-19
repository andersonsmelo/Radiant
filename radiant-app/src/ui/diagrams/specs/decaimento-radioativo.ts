import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, dirigido de fora por `progress`: 0 a 6 meias-vidas (n/6).
// 64 átomos, agrupados por meia-vida em que decaem: 32, 16, 8, 4, 2, 1 e o
// último, que sobrevive a seis meias-vidas (1). Sete colunas de 40 unidades, os
// átomos empilhados de baixo para cima. Um véu na cor do fundo (opaco a 72%)
// cobre da esquerda até a coluna n e avança 40 por meia-vida: os átomos
// decaídos continuam lá, em cor fraca. Acesos depois de n meias-vidas: 64/2ⁿ.
const SLOT = 40;
const X0 = 20;
const BASE = 214;
const PITCH = 11;
// Átomos por grupo, em duas colunas (o grupo de 1 ocupa só a da esquerda).
const GROUPS = [32, 16, 8, 4, 2, 1, 1];

const atoms = GROUPS.map((count, slot) => {
  const cx = X0 + SLOT * slot + SLOT / 2;
  return Array.from({ length: count }, (_, i) => {
    const x = cx + (i % 2 === 0 ? -PITCH / 2 : PITCH / 2);
    const y = BASE - PITCH / 2 - Math.floor(i / 2) * PITCH - 3;
    return `<circle cx="${x}" cy="${y}" r="4" fill="${P.electron}"/>`;
  }).join('');
}).join('\n');

export const decaimentoRadioativo: DiagramSpec = {
  id: 'decaimento-radioativo',
  alt: 'Sessenta e quatro átomos agrupados por quando decaem. A cada meia-vida, metade dos que restavam apaga: 32, 16, 8, 4, 2, 1.',
  width: 320,
  height: 240,
  posterAt: 1 / 6,
  layers: [
    { svg: atoms },
    {
      // Véu dos decaídos: a borda direita começa em x=20 e anda 40 por meia-vida.
      svg: `<rect x="${X0 - 300}" y="0" width="300" height="240" fill="${P.bg}" fill-opacity="0.72"/>`,
      motion: { kind: 'translate', dx: 240, dy: 0, mode: 'once' },
    },
    {
      svg: `<line x1="14" y1="${BASE}" x2="306" y2="${BASE}" stroke="${P.muted}" stroke-width="2"/>`,
    },
  ],
};
