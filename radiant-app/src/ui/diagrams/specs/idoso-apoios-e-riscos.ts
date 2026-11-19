import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Cena de lado: parede à esquerda com o receptor vertical (bucky
// mural) e, abaixo dele, uma barra de apoio; a pessoa idosa em pé, de frente para o receptor,
// com a mão na barra; ao lado dela, um banco. No chão, adiante, um degrau e um tapete solto
// com a ponta levantada; do outro lado da sala, longe, o andador. Sem texto no desenho.
export const idosoApoiosERiscos: DiagramSpec = {
  id: 'idoso-apoios-e-riscos',
  alt: 'Pessoa idosa em pé junto ao receptor vertical na parede, com a mão numa barra; há um banco ao lado, um degrau e um tapete solto no chão e o andador longe.',
  width: 320,
  height: 240,
  layers: [
    {
      // Piso e parede.
      svg: `<line x1="8" y1="214" x2="312" y2="214" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>
<line x1="12" y1="14" x2="12" y2="214" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      // Receptor vertical na parede e a barra de apoio, presa por duas hastes.
      svg: `<rect x="14" y="30" width="14" height="88" rx="2" fill="${P.accent}" fill-opacity="0.3" stroke="${P.accent}" stroke-width="3"/>
<path d="M12 126 H44 V176 H12" fill="none" stroke="${P.line}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`,
    },
    {
      // Pessoa idosa, levemente curvada, de frente para a parede, com a mão na barra.
      svg: `<circle cx="66" cy="62" r="9" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<path d="M62 74 C58 92 60 118 66 148 L82 148 C84 118 82 92 76 74 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="3" stroke-linejoin="round"/>
<rect x="64" y="148" width="7" height="64" rx="3" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="76" y="148" width="7" height="64" rx="3" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<line x1="66" y1="84" x2="46" y2="142" stroke="${P.line}" stroke-width="3" stroke-linecap="round"/>
<circle cx="44" cy="145" r="4" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>`,
    },
    {
      // Banco ao lado.
      svg: `<rect x="96" y="160" width="40" height="8" rx="3" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>
<path d="M102 168 V214 M130 168 V214" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      // Degrau no chão.
      svg: `<rect x="158" y="196" width="30" height="18" rx="2" fill="${P.fill}" stroke="${P.line}" stroke-width="3" stroke-linejoin="round"/>`,
    },
    {
      // Tapete solto, com a ponta levantada.
      svg: `<path d="M204 214 H254 L249 208 H208 C202 208 198 210 204 214 Z" fill="${P.beam}" fill-opacity="0.3" stroke="${P.beam}" stroke-width="3" stroke-linejoin="round"/>
<path d="M204 214 C198 206 200 198 210 199" fill="none" stroke="${P.beam}" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      // Andador, deixado longe, do outro lado da sala.
      svg: `<path d="M272 214 V130 H306 V214 M272 172 H306" fill="none" stroke="${P.muted}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M266 130 H274 M304 130 H312" stroke="${P.line}" stroke-width="4" stroke-linecap="round"/>`,
    },
  ],
};
