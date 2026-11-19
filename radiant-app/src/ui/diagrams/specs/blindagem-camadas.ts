import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, dirigido de fora por `progress`: 0 a 5 camadas semirredutoras
// (progress = n/5). Cinco placas ficam sempre desenhadas, a 48 unidades umas das
// outras (a esquerda da placa k em 72 + 48(k-1)). Uma cortina na cor do fundo
// cobre tudo da esquerda da placa n+1 (6 unidades antes) até a borda direita e
// desliza 48 por camada: com n camadas aparecem exatamente n placas e o trecho
// de feixe depois da n-ésima, de intensidade 100/2ⁿ. As faixas de feixe já
// estão desenhadas atrás das placas, cada uma com metade da anterior.
const PLATE_LEFT = (k: number) => 72 + 48 * (k - 1);
const BAND = { y: 106, h: 48 };

// Faixa k: da face direita da placa k (a fonte, para k = 0) até a esquerda da placa k+1.
const stripes = [0, 1, 2, 3, 4, 5]
  .map((k) => {
    const x0 = k === 0 ? 34 : PLATE_LEFT(k) + 14;
    const x1 = k === 5 ? PLATE_LEFT(5) + 14 + 48 : PLATE_LEFT(k + 1);
    return `<rect x="${x0}" y="${BAND.y}" width="${x1 - x0}" height="${BAND.h}" fill="${P.beam}" fill-opacity="${0.9 / 2 ** k}"/>`;
  })
  .join('\n');

const plates = [1, 2, 3, 4, 5]
  .map((k) => `<rect x="${PLATE_LEFT(k)}" y="60" width="14" height="120" rx="2" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5"/>`)
  .join('\n');

export const blindagemCamadas: DiagramSpec = {
  id: 'blindagem-camadas',
  alt: 'Feixe da fonte à esquerda atravessa placas de blindagem. A cada placa o feixe que sai fica com metade da intensidade, até quase sumir.',
  width: 320,
  height: 240,
  posterAt: 0.4,
  layers: [
    {
      // Contorno do feixe, de ponta a ponta.
      svg: `<line x1="34" y1="${BAND.y}" x2="320" y2="${BAND.y}" stroke="${P.muted}" stroke-width="1.5" stroke-dasharray="4 4"/>
<line x1="34" y1="${BAND.y + BAND.h}" x2="320" y2="${BAND.y + BAND.h}" stroke="${P.muted}" stroke-width="1.5" stroke-dasharray="4 4"/>`,
    },
    { svg: stripes },
    { svg: plates },
    {
      // Cortina: cobre da placa n+1 em diante; a borda anda 48 por camada.
      svg: `<rect x="${PLATE_LEFT(1) - 6}" y="0" width="300" height="240" fill="${P.bg}"/>`,
      motion: { kind: 'translate', dx: 240, dy: 0, mode: 'once' },
    },
    {
      // Fonte, por cima da cortina.
      svg: `<circle cx="24" cy="130" r="10" fill="${P.beam}" stroke="${P.line}" stroke-width="2.5"/>`,
    },
  ],
};
