import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. A mesma imagem de 8 x 8 pixels (um disco com borda e centro mais claros)
// três vezes lado a lado: original, comprimida sem perda (idêntica, pixel a pixel) e comprimida com
// perda forte (blocos de 2 x 2 pixels com um só tom, em quatro níveis). Acima de cada uma, uma barra
// proporcional ao tamanho do arquivo: longa, média e curta, sobre uma trilha com o comprimento total.
const OPACITY = [0.1, 0.32, 0.62, 0.95];
const tone = (x: number, y: number) => {
  const d = Math.hypot(x - 3.5, y - 3.5);
  return d < 1.6 ? 3 : d < 2.6 ? 2 : d < 3.6 ? 1 : 0;
};
const cell = (px: number, py: number, size: number, t: number) =>
  `<rect x="${px}" y="${py}" width="${size}" height="${size}" fill="${P.line}" fill-opacity="${OPACITY[t]}" stroke="${P.bg}" stroke-width="0.75"/>`;
const grid = (ox: number, block: number) => {
  const out: string[] = [];
  for (let by = 0; by < 8; by += block) {
    for (let bx = 0; bx < 8; bx += block) {
      let sum = 0;
      for (let y = by; y < by + block; y++) for (let x = bx; x < bx + block; x++) sum += tone(x, y);
      const t = Math.round(sum / (block * block));
      out.push(cell(ox + bx * 10, 96 + by * 10, block * 10, t));
    }
  }
  return `${out.join('\n')}\n<rect x="${ox}" y="96" width="80" height="80" fill="none" stroke="${P.muted}" stroke-width="2"/>`;
};
const track = (ox: number) =>
  `<rect x="${ox}" y="54" width="80" height="12" rx="3" fill="none" stroke="${P.muted}" stroke-width="2"/>`;

export const compressaoDeImagem: DiagramSpec = {
  id: 'compressao-de-imagem',
  alt: 'Imagem de 8 por 8 pixels, um disco, três vezes: original, igual sem perda e em blocos grosseiros com perda; acima, barras longa, média e curta.',
  width: 320,
  height: 240,
  layers: [
    { svg: grid(12, 1) },
    { svg: grid(120, 1) },
    { svg: grid(228, 2) },
    {
      // Trilhas com o comprimento total.
      svg: [12, 120, 228].map(track).join('\n'),
    },
    {
      // Tamanho do arquivo: original, sem perda, com perda.
      svg: `<rect x="12" y="54" width="80" height="12" rx="3" fill="${P.accent}"/>
<rect x="120" y="54" width="52" height="12" rx="3" fill="${P.accent}"/>
<rect x="228" y="54" width="24" height="12" rx="3" fill="${P.accent}"/>`,
    },
  ],
};
