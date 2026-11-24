import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, laço. Duas faixas de linha do tempo, de x 20 a 204: em cima, o feixe
// contínuo (barra cheia); embaixo, o feixe pulsado (seis blocos curtos separados por
// pausas). Um cursor de tempo corre da esquerda para a direita nas duas faixas. À direita,
// o monitor mostra a imagem o tempo todo, inclusive nas pausas (última imagem retida).
// Único movimento: o cursor (loop). O quadro parado fica numa pausa entre dois pulsos.
const pulses = [0, 1, 2, 3, 4, 5]
  .map((k) => `<rect x="${20 + 30 * k}" y="134" width="12" height="24" rx="2" fill="${P.beam}"/>`)
  .join('');

export const fluoroscopiaPulsada: DiagramSpec = {
  id: 'fluoroscopia-pulsada',
  alt: 'Duas linhas do tempo: feixe contínuo em barra cheia e feixe pulsado em blocos curtos com pausas; um cursor corre pelas duas e o monitor mantém a imagem.',
  width: 320,
  height: 240,
  periodMs: 4800,
  posterAt: 0.62,
  layers: [
    {
      // Faixa do feixe contínuo e eixo do tempo.
      svg: `<rect x="20" y="44" width="184" height="32" rx="4" fill="none" stroke="${P.muted}" stroke-width="2"/>
<rect x="22" y="48" width="180" height="24" rx="2" fill="${P.beam}"/>
<path d="M20 196 H200 M192 190 L200 196 L192 202" fill="none" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`,
    },
    {
      // Faixa do feixe pulsado.
      svg: `<rect x="20" y="130" width="184" height="32" rx="4" fill="none" stroke="${P.muted}" stroke-width="2"/>${pulses}`,
    },
    {
      // Monitor com a imagem retida e o suporte.
      svg: `<rect x="230" y="62" width="76" height="60" rx="5" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<rect x="238" y="70" width="60" height="44" fill="${P.accent}" fill-opacity="0.3"/>
<circle cx="268" cy="92" r="12" fill="none" stroke="${P.line}" stroke-width="2.5"/>
<path d="M268 104 V114" stroke="${P.line}" stroke-width="2.5" stroke-linecap="round"/>
<path d="M268 122 V138 M252 140 H284" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      // Cursor de tempo, de x 20 a 200.
      svg: `<line x1="20" y1="30" x2="20" y2="180" stroke="${P.line}" stroke-width="2.5" stroke-linecap="round"/>
<polygon points="13,22 27,22 20,32" fill="${P.line}"/>`,
      motion: { kind: 'translate', dx: 180, dy: 0, mode: 'loop' },
    },
  ],
};
