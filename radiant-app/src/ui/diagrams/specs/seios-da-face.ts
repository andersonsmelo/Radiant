import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Na metade esquerda, a face de frente em esquema, sem mandíbula: os seios
// frontais (amarelos) acima das órbitas, as células etmoidais (ciano) entre as órbitas, os seios
// maxilares (azuis) abaixo das órbitas, dos lados da cavidade nasal. Na metade direita, a cabeça
// de perfil com a face para a esquerda e as mesmas cores: frontal atrás da glabela, etmoidais
// atrás da órbita, maxilar abaixo dela e o seio esfenoidal (branco) no centro da cabeça, atrás
// dos etmoidais e logo abaixo da sela turca. O lado direito do paciente fica à esquerda de quem
// vê na vista de frente.
export const seiosDaFace: DiagramSpec = {
  id: 'seios-da-face',
  alt: 'Face de frente e cabeça de perfil com as cavidades de ar dos ossos da face pintadas, cada grupo de uma cor, ao redor das órbitas e do nariz.',
  width: 320,
  height: 240,
  layers: [
    {
      // Frente: contorno da face, órbitas, abertura nasal com o septo e a arcada de cima.
      svg: `<path d="M80,10 C120,10 146,34 148,72 C150,96 146,116 140,130 C138,150 132,172 120,190 C110,200 96,204 80,204 C64,204 50,200 40,190 C28,172 22,150 20,130 C14,116 10,96 12,72 C14,34 40,10 80,10 Z" fill="none" stroke="${P.line}" stroke-width="2.5"/>
<ellipse cx="46" cy="108" rx="21" ry="20" fill="none" stroke="${P.muted}" stroke-width="2.5"/>
<ellipse cx="114" cy="108" rx="21" ry="20" fill="none" stroke="${P.muted}" stroke-width="2.5"/>
<path d="M74,132 C68,150 66,170 70,186 L90,186 C94,170 92,150 86,132 C84,128 76,128 74,132 Z M80,132 V186" fill="none" stroke="${P.muted}" stroke-width="2" stroke-linejoin="round"/>
<path d="M58,192 H102 V202 H58 Z M66,192 V202 M74,192 V202 M80,192 V202 M86,192 V202 M94,192 V202" fill="none" stroke="${P.muted}" stroke-width="1.5" stroke-linejoin="round"/>`,
    },
    {
      // Seios frontais, dois lobos separados pelo septo na linha média.
      svg: `<path d="M80,82 L68,84 C60,74 60,58 66,46 C72,40 78,44 80,50 Z M80,82 L92,84 C100,74 100,58 94,46 C88,40 82,44 80,50 Z" fill="${P.beam}" fill-opacity="0.45" stroke="${P.beam}" stroke-width="2" stroke-linejoin="round"/>
<path d="M198,62 C206,58 212,64 212,74 C212,82 206,88 198,88 C196,80 196,70 198,62 Z" fill="${P.beam}" fill-opacity="0.45" stroke="${P.beam}" stroke-width="2" stroke-linejoin="round"/>`,
    },
    {
      // Células etmoidais, entre as órbitas e, no perfil, atrás da órbita.
      svg: `<path d="M69,90 H78 V128 H69 Z M82,90 H91 V128 H82 Z M69,99.5 H78 M69,109 H78 M69,118.5 H78 M82,99.5 H91 M82,109 H91 M82,118.5 H91" fill="${P.electron}" fill-opacity="0.35" stroke="${P.electron}" stroke-width="1.5" stroke-linejoin="round"/>
<path d="M220,96 H246 V118 H220 Z M226.5,96 V118 M233,96 V118 M239.5,96 V118 M220,107 H246" fill="${P.electron}" fill-opacity="0.35" stroke="${P.electron}" stroke-width="1.5" stroke-linejoin="round"/>`,
    },
    {
      // Seios maxilares, abaixo das órbitas e dos lados do nariz.
      svg: `<path d="M68,134 C72,150 70,170 66,184 C54,186 40,180 32,168 C27,156 27,142 31,134 C43,131 56,131 68,134 Z M92,134 C88,150 90,170 94,184 C106,186 120,180 128,168 C133,156 133,142 129,134 C117,131 104,131 92,134 Z" fill="${P.accent}" fill-opacity="0.4" stroke="${P.accent}" stroke-width="2" stroke-linejoin="round"/>
<path d="M204,124 C214,120 236,120 246,124 C248,136 244,150 238,156 C226,158 212,156 206,150 C202,140 202,132 204,124 Z" fill="${P.accent}" fill-opacity="0.4" stroke="${P.accent}" stroke-width="2" stroke-linejoin="round"/>`,
    },
    {
      // Perfil: contorno da cabeça e do pescoço, órbita, sela turca e palato duro.
      svg: `<path d="M322,8 C276,4 214,8 200,34 C192,48 188,66 190,80 C190,86 192,90 194,94 L174,126 L182,132 C186,136 182,140 184,146 L180,152 C184,160 182,174 190,182 C206,188 222,186 236,196 L244,240" fill="none" stroke="${P.line}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
<ellipse cx="212" cy="104" rx="12" ry="15" fill="none" stroke="${P.muted}" stroke-width="2.5"/>
<path d="M254,90 L257,92 C257,102 275,102 275,92 L279,89" fill="none" stroke="${P.line}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M190,162 H262" fill="none" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round"/>`,
    },
    {
      // Seio esfenoidal, no corpo do esfenoide, sob a sela.
      svg: `<path d="M256,104 H276 C281,104 283,108 283,114 C283,121 280,126 274,126 H258 C252,126 249,121 249,114 C249,108 251,104 256,104 Z M266,104 V126" fill="${P.line}" fill-opacity="0.35" stroke="${P.line}" stroke-width="2" stroke-linejoin="round"/>`,
    },
  ],
};
