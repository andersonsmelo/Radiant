import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Pé direito em vista dorsal, deitado: calcanhar à esquerda, dedos à
// direita e o lado medial (do hálux) em cima. 26 ossos em três grupos: tarso (7) em branco,
// metatarsos (5) em azul e falanges (14) em amarelo. Comprimento do pé perto de 26 cm (cerca
// de 11 unidades por cm): o tarso ocupa quase metade, o segundo metatarso é o mais longo, e o
// hálux, só com duas falanges, é o dedo mais grosso. Sesamoides e acessórios omitidos.
export const ossosDoPe: DiagramSpec = {
  id: 'ossos-do-pe',
  alt: 'Pé direito visto de cima e deitado: calcanhar à esquerda, dedos à direita, lado do hálux em cima. Tarso, metatarsos e falanges em três cores.',
  width: 320,
  height: 240,
  layers: [
    {
      // Tarso: calcâneo, tálus, navicular, três cuneiformes e cuboide.
      svg: `<path d="M12,122 C10,104 22,94 40,94 C52,94 58,100 60,110 L98,120 C104,121 108,126 108,132 L108,156 C108,162 102,165 94,164 L50,160 C30,158 14,144 12,122 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="2" stroke-linejoin="round"/>
<path d="M58,92 C58,84 66,80 76,80 L96,82 C104,80 114,82 118,90 C121,98 120,106 115,111 C109,115 101,114 96,116 L72,122 C62,123 57,114 58,92 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="2" stroke-linejoin="round"/>
<path d="M122,77 L136,76 C138,90 138,108 136,122 L122,122 C127,108 127,90 122,77 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="2" stroke-linejoin="round"/>
<path d="M139,70 L158,69 C161,69 162,71 162,74 L162,88 C162,91 160,92 157,92 L139,92 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="2" stroke-linejoin="round"/>
<path d="M139,94 L153,94 C155,94 156,95 156,97 L156,104 C156,106 155,107 153,107 L139,107 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="2" stroke-linejoin="round"/>
<path d="M139,109 L157,109 C159,109 160,110 160,112 L160,121 C160,123 159,124 157,124 L139,124 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="2" stroke-linejoin="round"/>
<path d="M112,128 L141,126 C145,126 147,129 147,133 L147,158 C147,162 144,165 140,165 L115,163 C111,163 110,160 110,156 L110,131 C110,129 111,128 112,128 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="2" stroke-linejoin="round"/>`,
    },
    {
      // Metatarsos, do primeiro (hálux, em cima) ao quinto, com a tuberosidade do quinto.
      svg: `<path d="M163.9,88.4 Q178.1,85.7 196.2,82.5 Q214.5,81.2 228.9,80.4 A7.5,7.5 0 0 0 227.1,65.6 Q212.9,68.3 194.8,71.5 Q176.5,72.8 162.1,73.6 A7.5,7.5 0 0 0 163.9,88.4 Z" fill="${P.accent}" fill-opacity="0.3" stroke="${P.accent}" stroke-width="2" stroke-linejoin="round"/>
<path d="M158.2,105 Q176,103.4 198.7,101.5 Q221.4,101.1 239.2,101 A5,5 0 0 0 238.8,91 Q221,92.6 198.3,94.5 Q175.6,94.9 157.8,95 A5,5 0 0 0 158.2,105 Z" fill="${P.accent}" fill-opacity="0.3" stroke="${P.accent}" stroke-width="2" stroke-linejoin="round"/>
<path d="M162.1,121 Q178.6,119.8 199.6,118.5 Q220.6,118.7 237.1,119 A5,5 0 0 0 236.9,109 Q220.4,110.2 199.4,111.5 Q178.4,111.3 161.9,111 A5,5 0 0 0 162.1,121 Z" fill="${P.accent}" fill-opacity="0.3" stroke="${P.accent}" stroke-width="2" stroke-linejoin="round"/>
<path d="M149.9,137.5 Q167.3,136.7 189.5,136 Q211.6,137 228.9,138 A5,5 0 0 0 229.1,128 Q211.7,128.5 189.5,129 Q167.4,127.7 150.1,126.5 A5.5,5.5 0 0 0 149.9,137.5 Z" fill="${P.accent}" fill-opacity="0.3" stroke="${P.accent}" stroke-width="2" stroke-linejoin="round"/>
<path d="M150.9,156 Q166.3,155 186,154 Q205.5,155 220.9,156 A5,5 0 0 0 221.1,146 Q205.7,146.5 186,147 Q166.5,145.5 151.1,144 A6,6 0 0 0 150.9,156 Z" fill="${P.accent}" fill-opacity="0.3" stroke="${P.accent}" stroke-width="2" stroke-linejoin="round"/>
<path d="M150,146 C146,150 144,157 148,161 C152,164 158,160 160,155 Z" fill="${P.accent}" fill-opacity="0.3" stroke="${P.accent}" stroke-width="2" stroke-linejoin="round"/>`,
    },
    {
      // Falanges: duas no hálux, três em cada um dos outros dedos.
      svg: `<path d="M232.4,78.5 Q239,77.3 247.3,76 Q255.8,75.9 262.4,76 A6,6 0 0 0 261.6,64 Q255,65 246.7,66 Q238.2,65.8 231.6,65.5 A6.5,6.5 0 0 0 232.4,78.5 Z" fill="${P.beam}" fill-opacity="0.3" stroke="${P.beam}" stroke-width="1.8" stroke-linejoin="round"/>
<path d="M266.2,76 Q271.7,75 278.7,74 Q285.7,73.7 291.2,73.5 A4.5,4.5 0 0 0 290.8,64.5 Q285.3,64.7 278.3,65 Q271.3,64.5 265.8,64 A6,6 0 0 0 266.2,76 Z" fill="${P.beam}" fill-opacity="0.3" stroke="${P.beam}" stroke-width="1.8" stroke-linejoin="round"/>
<path d="M244.2,99 Q249,98.3 255.1,97.5 Q261.3,97.5 266.2,97.5 A3.5,3.5 0 0 0 265.8,90.5 Q261,91 254.9,91.5 Q248.7,91.3 243.8,91 A4,4 0 0 0 244.2,99 Z" fill="${P.beam}" fill-opacity="0.3" stroke="${P.beam}" stroke-width="1.8" stroke-linejoin="round"/>
<path d="M270,97.5 Q272,97.3 274.5,97 Q277,97 279,97 A3,3 0 0 0 279,91 Q277,91 274.5,91 Q272,90.8 270,90.5 A3.5,3.5 0 0 0 270,97.5 Z" fill="${P.beam}" fill-opacity="0.3" stroke="${P.beam}" stroke-width="1.8" stroke-linejoin="round"/>
<path d="M282,97 Q283.5,96.8 285.5,96.5 Q287.5,96.5 289,96.5 A2.5,2.5 0 0 0 289,91.5 Q287.5,91.5 285.5,91.5 Q283.5,91.3 282,91 A3,3 0 0 0 282,97 Z" fill="${P.beam}" fill-opacity="0.3" stroke="${P.beam}" stroke-width="1.8" stroke-linejoin="round"/>
<path d="M242,118 Q246.4,117.5 252,117 Q257.6,117.3 262,117.5 A3.5,3.5 0 0 0 262,110.5 Q257.6,110.8 252,111 Q246.4,110.5 242,110 A4,4 0 0 0 242,118 Z" fill="${P.beam}" fill-opacity="0.3" stroke="${P.beam}" stroke-width="1.8" stroke-linejoin="round"/>
<path d="M265.5,117.5 Q267.1,117.4 269.1,117.5 Q271,117.7 272.6,118 A3,3 0 0 0 273.4,112 Q271.9,111.8 269.9,111.5 Q268,111 266.5,110.5 A3.5,3.5 0 0 0 265.5,117.5 Z" fill="${P.beam}" fill-opacity="0.3" stroke="${P.beam}" stroke-width="1.8" stroke-linejoin="round"/>
<path d="M277,118 Q278.3,117.8 280,117.5 Q281.7,117.5 283,117.5 A2.5,2.5 0 0 0 283,112.5 Q281.7,112.5 280,112.5 Q278.3,112.3 277,112 A3,3 0 0 0 277,118 Z" fill="${P.beam}" fill-opacity="0.3" stroke="${P.beam}" stroke-width="1.8" stroke-linejoin="round"/>
<path d="M233.8,137 Q237.8,136.7 242.8,136.5 Q247.9,137 251.8,137.5 A3.5,3.5 0 0 0 252.2,130.5 Q248.2,130.5 243.2,130.5 Q238.2,129.7 234.2,129 A4,4 0 0 0 233.8,137 Z" fill="${P.beam}" fill-opacity="0.3" stroke="${P.beam}" stroke-width="1.8" stroke-linejoin="round"/>
<path d="M255.4,137.5 Q256.8,137.4 258.5,137.5 Q260.2,137.7 261.5,138 A3,3 0 0 0 262.5,132 Q261.2,131.8 259.5,131.5 Q257.9,131 256.6,130.5 A3.5,3.5 0 0 0 255.4,137.5 Z" fill="${P.beam}" fill-opacity="0.3" stroke="${P.beam}" stroke-width="1.8" stroke-linejoin="round"/>
<path d="M265.4,137.9 Q266.6,137.9 268,138 Q269.4,138.2 270.5,138.5 A2.5,2.5 0 0 0 271.5,133.5 Q270.4,133.3 269,133 Q267.6,132.5 266.6,132.1 A3,3 0 0 0 265.4,137.9 Z" fill="${P.beam}" fill-opacity="0.3" stroke="${P.beam}" stroke-width="1.8" stroke-linejoin="round"/>
<path d="M224.5,155 Q227.8,154.9 232.1,155 Q236.3,155.8 239.5,156.5 A3.5,3.5 0 0 0 240.5,149.5 Q237.1,149.3 232.9,149 Q228.8,148 225.5,147 A4,4 0 0 0 224.5,155 Z" fill="${P.beam}" fill-opacity="0.3" stroke="${P.beam}" stroke-width="1.8" stroke-linejoin="round"/>
<path d="M243.4,156.9 Q244.6,156.9 246,157 Q247.4,157.2 248.5,157.5 A2.5,2.5 0 0 0 249.5,152.5 Q248.4,152.3 247,152 Q245.6,151.5 244.6,151.1 A3,3 0 0 0 243.4,156.9 Z" fill="${P.beam}" fill-opacity="0.3" stroke="${P.beam}" stroke-width="1.8" stroke-linejoin="round"/>
<path d="M252.4,157.4 Q253.3,157.4 254.5,157.4 Q255.6,157.7 256.5,157.9 A2,2 0 0 0 257.5,154.1 Q256.6,153.8 255.5,153.6 Q254.4,153 253.6,152.6 A2.5,2.5 0 0 0 252.4,157.4 Z" fill="${P.beam}" fill-opacity="0.3" stroke="${P.beam}" stroke-width="1.8" stroke-linejoin="round"/>`,
    },
  ],
};
