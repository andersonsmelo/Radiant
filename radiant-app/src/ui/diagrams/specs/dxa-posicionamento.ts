import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Duas cenas separadas por uma linha. À esquerda, a coluna, vista de
// lado (cabeça à esquerda): paciente de costas, quadris e joelhos dobrados, pernas sobre um
// bloco alto; a coluna lombar fica reta, encostada na mesa. À direita, o fêmur, visto de cima
// (cabeça no alto, lado direito do paciente à esquerda de quem vê): pernas estendidas, um
// posicionador entre os pés e o pé direito girado para dentro, preso ao posicionador por uma
// faixa. O pé é desenhado como uma forma alongada para o giro aparecer de cima.
export const dxaPosicionamento: DiagramSpec = {
  id: 'dxa-posicionamento',
  alt: 'Duas cenas: de lado, paciente com as pernas dobradas sobre um bloco; de cima, pernas estendidas, posicionador entre os pés e um pé girado preso por faixa.',
  width: 320,
  height: 240,
  layers: [
    {
      // Divisória entre as cenas, mesa vista de lado e mesa vista de cima.
      svg: `<line x1="163" y1="12" x2="163" y2="228" stroke="${P.muted}" stroke-width="2" stroke-dasharray="4 6" stroke-linecap="round"/>
<rect x="6" y="150" width="150" height="9" rx="3" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="172" y="2" width="144" height="236" rx="6" fill="${P.fill}" stroke="${P.muted}" stroke-width="2"/>`,
    },
    {
      // Bloco alto sob as pernas.
      svg: `<rect x="120" y="104" width="34" height="46" rx="3" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>`,
    },
    {
      // Paciente de lado: cabeça, tronco, coxa subindo, perna sobre o bloco e pé.
      svg: `<circle cx="18" cy="139" r="10" fill="none" stroke="${P.muted}" stroke-width="3"/>
<path d="M28 150 V140 C28 130 36 126 48 126 L92 128 Q100 130 100 140 V150" fill="none" stroke="${P.muted}" stroke-width="3" stroke-linejoin="round"/>
<path d="M88 132 L108 90 Q114 84 120 92 L118 102 L102 146" fill="none" stroke="${P.muted}" stroke-width="3" stroke-linejoin="round"/>
<path d="M116 90 H146 Q150 90 150 94 V104 H118" fill="none" stroke="${P.muted}" stroke-width="3" stroke-linejoin="round"/>
<path d="M146 90 V78 Q146 74 150 76 L154 80 V104" fill="none" stroke="${P.muted}" stroke-width="3" stroke-linejoin="round"/>`,
    },
    {
      // Coluna lombar reta, encostada na mesa.
      svg: `<path d="M36 141 h8 v6 h-8 z M48 141 h8 v6 h-8 z M60 141 h8 v6 h-8 z M72 141 h8 v6 h-8 z M84 141 h8 v6 h-8 z" fill="${P.line}"/>`,
    },
    {
      // Pernas estendidas vistas de cima e o pé esquerdo do paciente, reto.
      svg: `<polygon points="188,2 222,2 220,110 214,186 196,186 190,110" fill="none" stroke="${P.muted}" stroke-width="3" stroke-linejoin="round"/>
<polygon points="274,2 308,2 306,110 300,186 282,186 276,110" fill="none" stroke="${P.muted}" stroke-width="3" stroke-linejoin="round"/>
<ellipse cx="291" cy="206" rx="10" ry="22" fill="none" stroke="${P.muted}" stroke-width="3"/>`,
    },
    {
      // Posicionador entre os pés.
      svg: `<polygon points="226,120 270,120 274,170 266,226 226,226 222,170" fill="${P.fill}" stroke="${P.accent}" stroke-width="3" stroke-linejoin="round"/>`,
    },
    {
      // Pé direito girado para dentro, com a ponta voltada para a linha média.
      svg: `<ellipse cx="211" cy="205" rx="10" ry="22" transform="rotate(-25 211 205)" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>`,
    },
    {
      // Faixa que prende o pé girado ao posicionador.
      svg: `<rect x="198" y="205" width="74" height="9" rx="3" fill="${P.electron}" fill-opacity="0.4" stroke="${P.electron}" stroke-width="2"/>`,
    },
  ],
};
