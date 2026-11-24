import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Tronco e pelve de frente, em contorno do corpo, com os ossos em traço
// fraco por baixo e um ponto em cada marco palpável: incisura jugular, processo xifoide e
// sínfise púbica na linha média; margem costal inferior, ponto mais alto da crista ilíaca,
// espinha ilíaca ântero-superior e trocânter maior dos dois lados. Braços omitidos (contorno termina no ombro).
// Proporção de um tronco adulto (jugular à sínfise perto de 45 cm, cerca de 4,1 unidades por
// cm). O lado direito do paciente fica à esquerda de quem vê.
export const marcosDeSuperficie: DiagramSpec = {
  id: 'marcos-de-superficie',
  alt: 'Tronco e pelve de frente: contorno do corpo, ossos em traço fraco por baixo e pontos sobre os relevos ósseos que se palpam pela pele.',
  width: 320,
  height: 240,
  layers: [
    {
      // Contorno do corpo: pescoço, ombros sem os braços, cintura, quadris e coxas.
      svg: `<path d="M140,0 C141,10 140,16 136,20 C120,28 96,30 82,38 C76,42 74,52 78,60 C82,68 92,72 98,74 C102,96 102,116 102,140 C100,166 88,184 82,206 C82,220 86,232 90,240 M152,240 C154,232 157,228 160,226 M180,0 C179,10 180,16 184,20 C200,28 224,30 238,38 C244,42 246,52 242,60 C238,68 228,72 222,74 C218,96 218,116 218,140 C220,166 232,184 238,206 C238,220 234,232 230,240 M168,240 C166,232 163,228 160,226" fill="none" stroke="${P.line}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`,
    },
    {
      // Tórax em traço fraco: esterno com manúbrio e xifoide, clavículas, caixa e margens costais.
      svg: `<path d="M154,30 L157,28 C158,31 162,31 163,28 L166,30 L165,48 L163,50 L163,88 L162,92 L160,97 L158,92 L157,88 L157,50 L155,48 Z" fill="none" stroke="${P.muted}" stroke-width="2" stroke-opacity="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M156,30 C130,26 106,36 84,38 M156,30 C190,26 214,36 236,38" fill="none" stroke="${P.muted}" stroke-width="2" stroke-opacity="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M157,32 C126,34 100,56 98,90 C97,108 100,122 108,131 C122,124 146,106 157,92 M163,32 C194,34 220,56 222,90 C223,108 220,122 212,131 C198,124 174,106 163,92 M157,46 C136,40 112,48 100,60 M157,58 C136,52 112,60 100,72 M157,70 C136,64 112,72 100,84 M157,82 C136,76 112,84 101,96 M163,46 C184,40 208,48 220,60 M163,58 C184,52 208,60 220,72 M163,70 C184,64 208,72 220,84 M163,82 C184,76 208,84 219,96" fill="none" stroke="${P.muted}" stroke-width="2" stroke-opacity="0.6" stroke-linejoin="round" stroke-linecap="round"/>`,
    },
    {
      // Coluna lombar, ossos do quadril, sacro e fêmures em traço fraco.
      svg: `<rect x="153" y="134" width="14" height="7" rx="1.5" fill="none" stroke="${P.muted}" stroke-width="2" stroke-opacity="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<rect x="153" y="143" width="14" height="7" rx="1.5" fill="none" stroke="${P.muted}" stroke-width="2" stroke-opacity="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<rect x="153" y="152" width="14" height="7" rx="1.5" fill="none" stroke="${P.muted}" stroke-width="2" stroke-opacity="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<rect x="153" y="161" width="14" height="7" rx="1.5" fill="none" stroke="${P.muted}" stroke-width="2" stroke-opacity="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<rect x="153" y="170" width="14" height="7" rx="1.5" fill="none" stroke="${P.muted}" stroke-width="2" stroke-opacity="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M146,172 C142,160 128,153 112,156 C102,158 100,170 106,183 C110,188 114,192 117,196 C116,206 120,214 128,216 C138,218 150,214 157,213 L157,205 C150,203 140,200 134,196 M174,172 C178,160 192,153 208,156 C218,158 220,170 214,183 C210,188 206,192 203,196 C204,206 200,214 192,216 C182,218 170,214 163,213 L163,205 C170,203 180,200 186,196" fill="none" stroke="${P.muted}" stroke-width="2" stroke-opacity="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M146,170 H174 C172,186 166,198 160,202 C154,198 148,186 146,170 Z" fill="none" stroke="${P.muted}" stroke-width="2" stroke-opacity="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M118,205 L96,210 M90,208 C88,212 92,216 97,214 L104,240 M202,205 L224,210 M230,208 C232,212 228,216 223,214 L216,240" fill="none" stroke="${P.muted}" stroke-width="2" stroke-opacity="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<circle cx="124" cy="202" r="8" fill="none" stroke="${P.muted}" stroke-width="2" stroke-opacity="0.6" stroke-linejoin="round" stroke-linecap="round"/>
<circle cx="196" cy="202" r="8" fill="none" stroke="${P.muted}" stroke-width="2" stroke-opacity="0.6" stroke-linejoin="round" stroke-linecap="round"/>`,
    },
    {
      // Pontos dos marcos palpáveis, na linha média e dos dois lados.
      svg: `<circle cx="160" cy="29" r="4.5" fill="${P.beam}" stroke="${P.bg}" stroke-width="1.5"/>
<circle cx="160" cy="97" r="4.5" fill="${P.beam}" stroke="${P.bg}" stroke-width="1.5"/>
<circle cx="160" cy="210" r="4.5" fill="${P.beam}" stroke="${P.bg}" stroke-width="1.5"/>
<circle cx="108" cy="131" r="4.5" fill="${P.beam}" stroke="${P.bg}" stroke-width="1.5"/>
<circle cx="212" cy="131" r="4.5" fill="${P.beam}" stroke="${P.bg}" stroke-width="1.5"/>
<circle cx="112" cy="156" r="4.5" fill="${P.beam}" stroke="${P.bg}" stroke-width="1.5"/>
<circle cx="208" cy="156" r="4.5" fill="${P.beam}" stroke="${P.bg}" stroke-width="1.5"/>
<circle cx="106" cy="183" r="4.5" fill="${P.beam}" stroke="${P.bg}" stroke-width="1.5"/>
<circle cx="214" cy="183" r="4.5" fill="${P.beam}" stroke="${P.bg}" stroke-width="1.5"/>
<circle cx="90" cy="208" r="4.5" fill="${P.beam}" stroke="${P.bg}" stroke-width="1.5"/>
<circle cx="230" cy="208" r="4.5" fill="${P.beam}" stroke="${P.bg}" stroke-width="1.5"/>`,
    },
  ],
};
