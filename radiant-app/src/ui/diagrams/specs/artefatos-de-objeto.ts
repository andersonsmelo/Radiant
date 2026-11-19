import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';
import { radiografiaBase } from './radiografia-roteiro';

// Quadro 320x240, parado. A mesma radiografia esquemática de `radiografia-roteiro`, com quatro
// objetos que não são do paciente, em brilho denso: colar com pingente no alto do tórax, trança
// de cabelo descendo sobre o ombro e o ápice direitos (à esquerda de quem vê), botão de roupa
// sobre o campo pulmonar direito e eletrodo com fio sobre o campo pulmonar esquerdo.
export const artefatosDeObjeto: DiagramSpec = {
  id: 'artefatos-de-objeto',
  alt: 'Esquema de radiografia de tórax em PA com quatro objetos densos sobrepostos ao corpo, além de pulmões, coração, costelas e clavículas.',
  width: 320,
  height: 240,
  layers: [
    ...radiografiaBase,
    {
      // Trança: elos sobrepostos, mais claros e difusos, do alto do filme até o ápice.
      svg: `<g fill="${P.line}" fill-opacity="0.28" stroke="${P.line}" stroke-opacity="0.4" stroke-width="1.5">
<ellipse cx="118" cy="12" rx="7" ry="10" transform="rotate(25 118 12)"/>
<ellipse cx="111" cy="27" rx="7" ry="10" transform="rotate(-15 111 27)"/>
<ellipse cx="105" cy="42" rx="7" ry="10" transform="rotate(25 105 42)"/>
<ellipse cx="98" cy="57" rx="7" ry="10" transform="rotate(-15 98 57)"/>
<ellipse cx="92" cy="72" rx="6" ry="9" transform="rotate(25 92 72)"/>
<ellipse cx="87" cy="86" rx="5" ry="7"/>
</g>`,
    },
    {
      // Colar: corrente de contas em volta do pescoço e o pingente, denso.
      svg: `<path d="M138 10 Q160 74 182 10" fill="none" stroke="${P.line}" stroke-width="2.5" stroke-dasharray="2 2.5"/>
<path d="M160 50 L166 58 L160 68 L154 58 Z" fill="${P.line}"/>`,
    },
    {
      // Botão de roupa sobre o campo pulmonar direito: disco denso com quatro furos.
      svg: `<circle cx="102" cy="120" r="8" fill="${P.line}"/>
<circle cx="99" cy="117" r="1.6" fill="${P.bg}"/>
<circle cx="105" cy="117" r="1.6" fill="${P.bg}"/>
<circle cx="99" cy="123" r="1.6" fill="${P.bg}"/>
<circle cx="105" cy="123" r="1.6" fill="${P.bg}"/>`,
    },
    {
      // Eletrodo sobre o campo pulmonar esquerdo, com o fio saindo para a borda do filme.
      svg: `<path d="M236 118 C252 118 258 130 262 150 C266 170 270 180 276 186" fill="none" stroke="${P.line}" stroke-width="2"/>
<circle cx="230" cy="118" r="7" fill="none" stroke="${P.line}" stroke-width="2"/>
<circle cx="230" cy="118" r="3" fill="${P.line}"/>`,
    },
  ],
};
