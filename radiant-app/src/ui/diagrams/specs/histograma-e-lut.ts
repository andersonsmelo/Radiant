import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. À esquerda, histograma do valor do pixel (24 barras): pico estreito na
// ponta baixa (área colimada, sem sinal), grupo largo no meio (anatomia) e pico estreito na ponta
// alta (radiação direta). Faixa azul com colchete cobre só o grupo do meio. À direita, a curva em S
// que converte o valor do pixel em brilho. Esquemático: as alturas não seguem um exame real.
const HEIGHTS = [140, 60, 0, 0, 0, 0, 20, 45, 70, 90, 100, 95, 105, 85, 70, 45, 25, 10, 0, 0, 0, 10, 130, 60];
const bar = (h: number, i: number, color: string) =>
  `<rect x="${24 + 6 * i}" y="${190 - Math.max(h, 2)}" width="5" height="${Math.max(h, 2)}" fill="${color}"/>`;
const bars = (from: number, to: number, color: string) =>
  HEIGHTS.map((h, i) => (i >= from && i <= to ? bar(h, i, color) : '')).join('\n');

export const histogramaELut: DiagramSpec = {
  id: 'histograma-e-lut',
  alt: 'Histograma com um pico estreito em cada ponta e um grupo largo no meio, coberto por uma faixa azul; ao lado, uma curva em S de conversão.',
  width: 320,
  height: 240,
  layers: [
    {
      // Eixos do histograma e da curva, e a seta entre eles.
      svg: `<path d="M20 34 V190 H172" fill="none" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M192 34 V190 H304" fill="none" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M174 114 H186 M181 109 L187 114 L181 119" fill="none" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`,
    },
    {
      // Pico estreito na ponta baixa: a área colimada, sem sinal.
      svg: bars(0, 5, P.muted),
    },
    {
      // Faixa de interesse e o grupo largo do meio: a anatomia.
      svg: `<rect x="57" y="34" width="77" height="156" fill="${P.accent}" fill-opacity="0.14"/>
${bars(6, 17, P.line)}`,
    },
    {
      // Pico estreito na ponta alta: a radiação direta, fora do corpo.
      svg: bars(18, 23, P.muted),
    },
    {
      // Colchete da faixa de interesse e a curva em S.
      svg: `<path d="M57 44 V36 H134 V44" fill="none" stroke="${P.accent}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M196 184 C240 184 256 44 300 44" fill="none" stroke="${P.beam}" stroke-width="3" stroke-linecap="round"/>`,
    },
  ],
};
