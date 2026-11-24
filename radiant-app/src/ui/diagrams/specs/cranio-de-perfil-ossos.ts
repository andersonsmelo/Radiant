import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Crânio de perfil, face voltada para a esquerda. Cada osso rotulável tem
// cor própria: frontal (azul), parietal (amarelo), temporal (ciano), occipital (cinza), asa maior
// do esfenoide (branco, na fossa temporal, à frente do temporal e abaixo do ptério), maxila
// (amarelo forte, longe do parietal) e mandíbula (massa escura). Zigomático, arco zigomático e
// osso nasal ficam só em contorno, sem cor, porque não são alvo. O meato acústico externo é o
// furo no temporal, logo atrás do côndilo da mandíbula.
export const cranioDePerfilOssos: DiagramSpec = {
  id: 'cranio-de-perfil-ossos',
  alt: 'Crânio de perfil com a face para a esquerda: cada osso da calota, da base lateral e da face pintado de uma cor, com as suturas entre eles.',
  width: 320,
  height: 240,
  layers: [
    {
      // Calota: frontal, parietal, occipital e temporal, com as suturas como bordas brancas.
      svg: `<path d="M78,98 C72,92 70,86 72,80 C70,56 92,24 140,21 C136,50 128,80 124,100 L108,102 C100,96 88,94 78,98 Z" fill="${P.accent}" fill-opacity="0.35" stroke="${P.line}" stroke-width="2" stroke-linejoin="round"/>
<path d="M140,21 C180,14 224,20 242,38 L248,90 L246,128 C232,108 210,86 190,84 C170,84 152,92 146,104 L124,100 C128,80 136,50 140,21 Z" fill="${P.beam}" fill-opacity="0.3" stroke="${P.line}" stroke-width="2" stroke-linejoin="round"/>
<path d="M242,38 C270,48 288,76 288,100 C288,116 284,126 280,134 C272,146 258,152 246,150 L246,128 L248,90 Z" fill="${P.muted}" fill-opacity="0.45" stroke="${P.line}" stroke-width="2" stroke-linejoin="round"/>
<path d="M246,128 C232,108 210,86 190,84 C170,84 152,92 146,104 L150,132 L178,134 C186,138 192,140 198,138 C206,140 214,150 220,162 C222,170 226,174 230,170 C236,164 242,156 246,150 Z" fill="${P.electron}" fill-opacity="0.35" stroke="${P.line}" stroke-width="2" stroke-linejoin="round"/>`,
    },
    {
      // Asa maior do esfenoide, entre frontal, parietal, temporal e zigomático.
      svg: `<path d="M124,100 L146,104 L150,132 L124,130 C121,120 121,110 124,100 Z" fill="${P.line}" fill-opacity="0.55" stroke="${P.line}" stroke-width="2" stroke-linejoin="round"/>`,
    },
    {
      // Zigomático, arco zigomático e osso nasal, só em contorno.
      svg: `<path d="M108,102 L124,100 C121,110 121,120 124,130 L132,128 L132,136 L114,142 C106,140 100,134 98,124 C104,118 106,110 108,102 Z" fill="none" stroke="${P.muted}" stroke-width="2" stroke-linejoin="round"/>
<path d="M132,128 L176,131 L180,135 L174,139 L132,136" fill="none" stroke="${P.muted}" stroke-width="2" stroke-linejoin="round"/>
<path d="M78,98 L66,118 L70,119 L80,101" fill="none" stroke="${P.muted}" stroke-width="2" stroke-linejoin="round"/>`,
    },
    {
      // Maxila, com os dentes de cima.
      svg: `<path d="M80,101 C78,110 80,118 84,121 C90,124 96,124 98,124 L114,142 C120,142 124,148 122,160 L72,160 C68,154 66,148 62,142 C70,136 74,128 70,119 Z" fill="${P.beam}" fill-opacity="0.6" stroke="${P.line}" stroke-width="2" stroke-linejoin="round"/>
<path d="M74,160 H120 V168 H74 Z M82,160 V168 M90,160 V168 M98,160 V168 M106,160 V168 M113,160 V168" fill="none" stroke="${P.muted}" stroke-width="1.5" stroke-linejoin="round"/>`,
    },
    {
      // Mandíbula: corpo, ramo, processo coronoide e côndilo, com os dentes de baixo.
      svg: `<path d="M72,178 L166,178 L174,146 C180,154 184,160 188,158 C192,156 194,152 194,150 C192,144 196,139 200,139 C205,139 206,145 204,150 C204,170 202,190 196,204 C186,210 150,212 100,214 C84,214 74,206 72,196 C70,190 70,184 72,178 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5" stroke-linejoin="round"/>
<path d="M76,170 H122 V178 H76 Z M84,170 V178 M92,170 V178 M100,170 V178 M108,170 V178 M115,170 V178" fill="none" stroke="${P.muted}" stroke-width="1.5" stroke-linejoin="round"/>`,
    },
    {
      // Órbita e meato acústico externo, como aberturas no osso.
      svg: `<ellipse cx="91" cy="110" rx="12" ry="13" fill="${P.bg}" stroke="${P.line}" stroke-width="2.5"/>
<circle cx="212" cy="140" r="5" fill="${P.bg}" stroke="${P.line}" stroke-width="2"/>`,
    },
  ],
};
