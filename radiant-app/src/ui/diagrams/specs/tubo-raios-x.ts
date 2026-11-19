import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240. O cátodo (filamento) à esquerda emite elétrons para o ânodo à
// direita; o feixe útil sai pela janela, embaixo, perpendicular ao eixo
// cátodo-ânodo.
export const tuboRaiosX: DiagramSpec = {
  id: 'tubo-raios-x',
  alt: 'Tubo de raios X: o filamento do cátodo emite elétrons para o ânodo, e o feixe sai pela janela, perpendicular ao eixo entre os dois.',
  width: 320,
  height: 240,
  layers: [
    {
      // Feixe útil: do ponto focal, para baixo, pela janela.
      svg: `<polygon points="219,104 190,236 252,236" fill="${P.beam}" fill-opacity="0.3" stroke="${P.beam}" stroke-width="2" stroke-linejoin="round"/>`,
    },
    {
      // Ampola de vidro e janela.
      svg: `<rect x="30" y="40" width="260" height="130" rx="26" fill="none" stroke="${P.accent}" stroke-width="3"/>
<rect x="198" y="166" width="42" height="8" rx="2" fill="${P.bg}" stroke="${P.accent}" stroke-width="3"/>`,
    },
    {
      // Cátodo: bobina do filamento dentro da capa de focalização.
      svg: `<path d="M100 80 H82 V130 H100" fill="none" stroke="${P.muted}" stroke-width="3" stroke-linejoin="round"/>
<path d="M86 105 l4 -10 l5 20 l5 -20 l5 20 l4 -10" fill="none" stroke="${P.line}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<line x1="82" y1="105" x2="30" y2="105" stroke="${P.muted}" stroke-width="3"/>`,
    },
    {
      // Elétrons do cátodo ao ponto focal.
      svg: `<line x1="122" y1="105" x2="204" y2="105" stroke="${P.electron}" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round"/>
<polygon points="217,105 205,98 205,112" fill="${P.electron}"/>`,
    },
    {
      // Ânodo, com a face inclinada voltada para a janela.
      svg: `<polygon points="212,78 252,78 252,136 227,136" fill="${P.fill}" stroke="${P.line}" stroke-width="3" stroke-linejoin="round"/>
<line x1="252" y1="107" x2="290" y2="107" stroke="${P.muted}" stroke-width="3"/>`,
    },
  ],
};
