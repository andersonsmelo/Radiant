import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Criança pequena deitada de costas na mesa, vista de lado, com o tubo
// acima. À esquerda, um acompanhante de avental segura os braços dela com as mãos fora do
// campo de luz; faixa larga sobre as pernas e apoio de espuma no fim da mesa. À direita, outra
// pessoa sem avental, perto da mesa, com o espalhamento chegando nela. Sem texto no desenho.
export const contencaoPediatrica: DiagramSpec = {
  id: 'contencao-pediatrica',
  alt: 'Criança pequena deitada na mesa sob o tubo, com faixa nas pernas e espuma ao lado; acompanhante de avental segura os braços e outra pessoa está sem avental.',
  width: 320,
  height: 240,
  layers: [
    {
      // Piso, mesa e pedestal.
      svg: `<line x1="8" y1="214" x2="312" y2="214" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>
<rect x="70" y="150" width="192" height="8" rx="3" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="160" y="158" width="24" height="56" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>`,
    },
    {
      // Tubo no trilho do teto e colimador.
      svg: `<line x1="80" y1="14" x2="156" y2="14" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>
<line x1="118" y1="14" x2="118" y2="26" stroke="${P.muted}" stroke-width="3"/>
<rect x="98" y="26" width="40" height="26" rx="6" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<polygon points="106,52 130,52 134,60 102,60" fill="${P.fill}" stroke="${P.muted}" stroke-width="3" stroke-linejoin="round"/>`,
    },
    {
      // Campo de luz: cone do colimador e retângulo claro sobre o tórax.
      svg: `<polygon points="108,60 128,60 142,131 98,131" fill="${P.beam}" fill-opacity="0.2" stroke="${P.beam}" stroke-width="2.5" stroke-linejoin="round"/>
<rect x="100" y="131" width="42" height="19" fill="${P.beam}" fill-opacity="0.35" stroke="${P.beam}" stroke-width="2.5"/>`,
    },
    {
      // Criança: cabeça, tronco, pernas e o braço levado para o lado da cabeça.
      svg: `<circle cx="86" cy="141" r="9" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="98" y="134" width="46" height="16" rx="7" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="144" y="138" width="76" height="12" rx="6" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<path d="M102 135 Q86 118 64 138" fill="none" stroke="${P.line}" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      // Faixa larga sobre as pernas e apoio de espuma no fim da mesa.
      svg: `<rect x="156" y="130" width="28" height="24" rx="3" fill="${P.accent}" fill-opacity="0.45" stroke="${P.accent}" stroke-width="3"/>
<rect x="228" y="124" width="18" height="26" rx="6" fill="${P.muted}" fill-opacity="0.45" stroke="${P.muted}" stroke-width="3"/>`,
    },
    {
      // Acompanhante de avental, com as mãos nos braços da criança, fora do campo.
      svg: `<circle cx="34" cy="58" r="9" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<polygon points="20,72 48,72 51,82 49,130 19,130 17,82" fill="${P.accent}" fill-opacity="0.35" stroke="${P.accent}" stroke-width="3" stroke-linejoin="round"/>
<path d="M27 130 V214 M41 130 V214" stroke="${P.line}" stroke-width="3" stroke-linecap="round"/>
<line x1="46" y1="84" x2="60" y2="136" stroke="${P.line}" stroke-width="3" stroke-linecap="round"/>
<circle cx="62" cy="139" r="5" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>`,
    },
    {
      // Pessoa sem avental perto da mesa, com o espalhamento chegando nela.
      svg: `<line x1="146" y1="126" x2="272" y2="92" stroke="${P.beam}" stroke-width="2.5" stroke-dasharray="6 5" stroke-linecap="round"/>
<line x1="148" y1="122" x2="272" y2="76" stroke="${P.beam}" stroke-width="2.5" stroke-dasharray="6 5" stroke-linecap="round"/>
<circle cx="290" cy="58" r="9" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="278" y="72" width="24" height="58" rx="8" fill="none" stroke="${P.line}" stroke-width="3"/>
<path d="M285 130 V214 M295 130 V214" stroke="${P.line}" stroke-width="3" stroke-linecap="round"/>`,
    },
  ],
};
