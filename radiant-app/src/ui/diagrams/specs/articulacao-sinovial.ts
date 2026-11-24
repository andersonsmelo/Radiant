import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Articulação sinovial genérica em corte frontal: osso de cima com a
// ponta convexa, osso de baixo com a superfície levemente côncava, cartilagem articular em
// cada superfície, cavidade com líquido sinovial entre elas e nos recessos laterais, membrana
// sinovial forrando a cápsula por dentro, cápsula fibrosa por fora e um ligamento colateral
// fora da cápsula, à direita, de osso a osso.
export const articulacaoSinovial: DiagramSpec = {
  id: 'articulacao-sinovial',
  alt: 'Articulação em corte: dois ossos com cartilagem nas pontas, espaço com líquido entre eles, cápsula envolvendo e um ligamento por fora.',
  width: 320,
  height: 240,
  layers: [
    {
      // Cavidade articular com líquido sinovial (os ossos cobrem o centro).
      svg: `<path d="M110,82 C88,92 86,124 110,136 L210,136 C234,124 232,92 210,82 Z" fill="${P.accent}" fill-opacity="0.35"/>`,
    },
    {
      // Ossos: de cima, com a ponta convexa; de baixo, com a superfície côncava.
      svg: `<path d="M136,-4 L136,52 C136,66 104,74 104,90 C104,104 130,112 160,112 C190,112 216,104 216,90 C216,74 184,66 184,52 L184,-4 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="3" stroke-linejoin="round"/>
<path d="M140,244 L140,188 C140,174 106,168 106,150 L106,122 C120,125 140,127 160,127 C180,127 200,125 214,122 L214,150 C214,168 180,174 180,188 L180,244 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="3" stroke-linejoin="round"/>`,
    },
    {
      // Cartilagem articular nas duas superfícies.
      svg: `<path d="M108,98 C116,108 140,111 160,111 C180,111 204,108 212,98 M108,124 C122,127 140,128 160,128 C180,128 198,127 212,124" fill="none" stroke="${P.electron}" stroke-width="6" stroke-linecap="round"/>`,
    },
    {
      // Membrana sinovial, forrando a cápsula por dentro.
      svg: `<path d="M110,82 C88,92 86,124 110,136 M210,82 C232,92 234,124 210,136" fill="none" stroke="${P.beam}" stroke-width="2" stroke-linecap="round"/>`,
    },
    {
      // Cápsula fibrosa, de osso a osso, por fora.
      svg: `<path d="M108,76 C78,90 76,126 106,142 M212,76 C242,90 244,126 214,142" fill="none" stroke="${P.line}" stroke-width="4" stroke-linecap="round"/>`,
    },
    {
      // Ligamento colateral, fora da cápsula.
      svg: `<path d="M198,64 C262,84 262,140 206,166" fill="none" stroke="${P.muted}" stroke-width="7" stroke-linecap="round"/>`,
    },
  ],
};
