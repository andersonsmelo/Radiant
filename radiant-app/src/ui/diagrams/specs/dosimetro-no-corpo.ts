import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Profissional de frente, de pé, com avental azul (mesma pessoa de
// `sala-com-riscos`: cabeça redonda, tronco arredondado, pernas retas). Os dosímetros são crachás
// amarelos: um no tórax, sobre o avental; um anel num dedo da mão estendida (à direita de quem vê);
// um pequeno junto ao olho, na haste do óculos. No canto direito, um quadro de parede com o
// dosímetro de referência pendurado, longe do corpo. A figura não tem texto; o conteúdo rotula.
const badge = (x: number, y: number, w: number, h: number) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${P.beam}" stroke="${P.line}" stroke-width="2"/>`;

export const dosimetroNoCorpo: DiagramSpec = {
  id: 'dosimetro-no-corpo',
  alt: 'Profissional de avental, de frente: crachá no tórax, anel no dedo da mão estendida, dosímetro junto ao olho; num canto, quadro de parede com um dosímetro.',
  width: 320,
  height: 240,
  layers: [
    {
      // Piso.
      svg: `<line x1="8" y1="214" x2="312" y2="214" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      // Pernas, braço pendente e braço estendido com a mão afastada do corpo.
      svg: `<path d="M120 150 V214 M140 150 V214" fill="none" stroke="${P.line}" stroke-width="3" stroke-linecap="round"/>
<path d="M108 66 L98 130" fill="none" stroke="${P.line}" stroke-width="3" stroke-linecap="round"/>
<path d="M152 66 L206 96" fill="none" stroke="${P.line}" stroke-width="3" stroke-linecap="round"/>
<circle cx="214" cy="100" r="6" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>`,
    },
    {
      // Tronco e cabeça, óculos com a haste voltada para o lado.
      svg: `<rect x="106" y="56" width="48" height="94" rx="10" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<circle cx="130" cy="30" r="12" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<path d="M122 29 H138 M138 29 L146 28" fill="none" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round"/>`,
    },
    {
      // Avental: do ombro ao joelho, sobre o tronco.
      svg: `<polygon points="108,62 152,62 156,150 104,150" fill="${P.accent}" fill-opacity="0.35" stroke="${P.accent}" stroke-width="3" stroke-linejoin="round"/>`,
    },
    {
      // Quadro de parede, no canto direito, com o dosímetro de referência pendurado.
      svg: `<rect x="252" y="24" width="56" height="96" rx="4" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>
<circle cx="280" cy="36" r="2.5" fill="${P.line}"/>
<line x1="280" y1="38" x2="280" y2="58" stroke="${P.muted}" stroke-width="2"/>
${badge(272, 58, 16, 12)}`,
    },
    {
      // Os três dosímetros do profissional: tórax, anel (aro no dedo) e olho.
      svg: `${badge(118, 76, 16, 12)}
<circle cx="209" cy="98" r="4" fill="none" stroke="${P.beam}" stroke-width="3"/>
${badge(146, 25, 8, 8)}`,
    },
  ],
};
