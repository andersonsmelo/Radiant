import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Gramática de gráficos (fase 3). Quadro 320x240, parado, sem texto. Painel opaco. A mesma imagem de 8 x 8 pixels (um
// disco com borda e centro mais claros) três vezes lado a lado, cada uma num poço escuro: original, comprimida sem
// perda (idêntica, pixel a pixel) e comprimida com perda forte (blocos de 2 x 2 pixels com um só tom, em quatro
// níveis). Acima de cada uma, uma barra com o tamanho do arquivo sobre uma trilha com o comprimento total: a parte
// azul é o que o arquivo ocupa, a parte muted a 30% é o que a compressão economizou (longa, média, curta).
// Sem alvo de toque nas aulas (m22 usa só como visual do conceito). Parado de propósito: as três imagens se comparam
// de uma vez, e uma barra que enche não acrescenta nada que o comprimento final já não diga.
const OPACITY = [0.1, 0.32, 0.62, 0.95];
const X = [26, 120, 214]; // 80 de largura cada, 14 de intervalo
const IMG_Y = 98;
const CELL = 10;
const tone = (x: number, y: number) => {
  const d = Math.hypot(x - 3.5, y - 3.5);
  return d < 1.6 ? 3 : d < 2.6 ? 2 : d < 3.6 ? 1 : 0;
};
const cell = (px: number, py: number, size: number, t: number) =>
  `<rect x="${px}" y="${py}" width="${size}" height="${size}" fill="${P.line}" fill-opacity="${OPACITY[t]}" stroke="${P.bg}" stroke-width="0.5"/>`;
const grid = (ox: number, block: number) => {
  const out: string[] = [];
  for (let by = 0; by < 8; by += block) {
    for (let bx = 0; bx < 8; bx += block) {
      let sum = 0;
      for (let y = by; y < by + block; y++) for (let x = bx; x < bx + block; x++) sum += tone(x, y);
      out.push(cell(ox + bx * CELL, IMG_Y + by * CELL, block * CELL, Math.round(sum / (block * block))));
    }
  }
  return `<rect x="${ox - 3}" y="${IMG_Y - 3}" width="86" height="86" rx="8" fill="${P.bg}"/>\n${out.join('\n')}`;
};
const SIZES = [80, 52, 24];
const sizeBar = (ox: number, w: number) =>
  `<rect x="${ox}" y="62" width="80" height="12" rx="6" fill="${P.muted}" fill-opacity="0.3"/>
<rect x="${ox}" y="62" width="${w}" height="12" rx="6" fill="${P.accent}"/>`;

export const compressaoDeImagem: DiagramSpec = {
  id: 'compressao-de-imagem',
  alt: 'Imagem de 8 por 8 pixels, um disco, três vezes: original, igual sem perda e em blocos grosseiros com perda; acima, barras longa, média e curta.',
  width: 320,
  height: 240,
  layers: [
    { svg: `<rect x="8" y="8" width="304" height="224" rx="16" fill="${P.fill}"/>` },
    { svg: grid(X[0], 1) },
    { svg: grid(X[1], 1) },
    { svg: grid(X[2], 2) },
    {
      // Tamanho do arquivo: original (cheio), sem perda (médio), com perda (curto).
      svg: X.map((x, i) => sizeBar(x, SIZES[i])).join('\n'),
    },
  ],
};
