import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Esqueleto de frente, da cabeça ao meio das coxas (o corte acima dos
// joelhos dá espaço para separar os alvos). Proporção por cabeças: queixo a 1, mamilos a 2,
// crista ilíaca perto de 3,3 e sínfise a 4. Axial (crânio, coluna, costelas, esterno e sacro) em
// azul; apendicular (clavículas, escápulas, membros superiores, ossos do quadril e fêmures) em
// amarelo. Braços e pernas levemente afastados do corpo para os alvos não se tocarem. O lado
// direito do paciente fica à esquerda de quem vê.
export const esqueletoAxialApendicular: DiagramSpec = {
  id: 'esqueleto-axial-apendicular',
  alt: 'Esqueleto de frente, da cabeça ao meio das coxas: crânio, coluna, costelas e esterno numa cor; cinturas e membros em outra cor.',
  width: 320,
  height: 240,
  layers: [
    {
      // Coluna: cervical, torácica atrás das costelas, lombar, sacro e cóccix (axial).
      svg: `<rect x="156.5" y="54" width="7" height="2.8" rx="1" fill="${P.accent}" fill-opacity="0.7"/>
<rect x="156.5" y="57.6" width="7" height="2.8" rx="1" fill="${P.accent}" fill-opacity="0.7"/>
<rect x="156.5" y="61.2" width="7" height="2.8" rx="1" fill="${P.accent}" fill-opacity="0.7"/>
<rect x="155.5" y="65" width="9" height="4.4" rx="1.2" fill="${P.accent}" fill-opacity="0.45"/>
<rect x="155.4" y="70.4" width="9.3" height="4.4" rx="1.2" fill="${P.accent}" fill-opacity="0.45"/>
<rect x="155.2" y="75.8" width="9.6" height="4.4" rx="1.2" fill="${P.accent}" fill-opacity="0.45"/>
<rect x="155.1" y="81.2" width="9.9" height="4.4" rx="1.2" fill="${P.accent}" fill-opacity="0.45"/>
<rect x="154.9" y="86.6" width="10.2" height="4.4" rx="1.2" fill="${P.accent}" fill-opacity="0.45"/>
<rect x="154.8" y="92" width="10.5" height="4.4" rx="1.2" fill="${P.accent}" fill-opacity="0.45"/>
<rect x="154.6" y="97.4" width="10.8" height="4.4" rx="1.2" fill="${P.accent}" fill-opacity="0.45"/>
<rect x="154.5" y="102.8" width="11.1" height="4.4" rx="1.2" fill="${P.accent}" fill-opacity="0.45"/>
<rect x="154.3" y="108.2" width="11.4" height="4.4" rx="1.2" fill="${P.accent}" fill-opacity="0.45"/>
<rect x="154.2" y="113.6" width="11.7" height="4.4" rx="1.2" fill="${P.accent}" fill-opacity="0.45"/>
<rect x="154" y="119" width="12" height="4.4" rx="1.2" fill="${P.accent}" fill-opacity="0.45"/>
<rect x="153.9" y="124.4" width="12.3" height="4.4" rx="1.2" fill="${P.accent}" fill-opacity="0.45"/>
<rect x="153" y="131" width="14" height="5.4" rx="1.6" fill="${P.accent}" fill-opacity="0.75"/>
<rect x="152.6" y="137.6" width="14.8" height="5.4" rx="1.6" fill="${P.accent}" fill-opacity="0.75"/>
<rect x="152.2" y="144.2" width="15.6" height="5.4" rx="1.6" fill="${P.accent}" fill-opacity="0.75"/>
<rect x="151.8" y="150.8" width="16.4" height="5.4" rx="1.6" fill="${P.accent}" fill-opacity="0.75"/>
<rect x="151.4" y="157.4" width="17.2" height="5.4" rx="1.6" fill="${P.accent}" fill-opacity="0.75"/>
<path d="M147,165 H173 C171,176 166,186 160,190 C154,186 149,176 147,165 Z" fill="${P.accent}" fill-opacity="0.45" stroke="${P.accent}" stroke-width="2" stroke-linejoin="round"/>
<line x1="160" y1="192" x2="160" y2="197" stroke="${P.accent}" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      // Caixa torácica: contorno, costelas, esterno e processo xifoide (axial).
      svg: `<path d="M160,66 C142,66 130,76 128,96 C127,112 129,124 132,131 L136,131 C146,124 154,115 160,111 C166,115 174,124 184,131 L188,131 C191,124 193,112 192,96 C190,76 178,66 160,66 Z" fill="${P.accent}" fill-opacity="0.12" stroke="${P.accent}" stroke-width="2.5" stroke-linejoin="round"/>
<path d="M157,74 C146,69 134,72 131,81 M157,84 C146,79 134,82 131,91 M157,94 C146,89 134,92 131,101 M157,104 C146,99 134,102 131,111 M163,74 C174,69 186,72 189,81 M163,84 C174,79 186,82 189,91 M163,94 C174,89 186,92 189,101 M163,104 C174,99 186,102 189,111" fill="none" stroke="${P.accent}" stroke-width="2" stroke-linecap="round"/>
<rect x="157" y="67" width="6" height="40" rx="2" fill="${P.accent}" fill-opacity="0.6" stroke="${P.accent}" stroke-width="1.5"/>
<polygon points="158,107 162,107 160,113" fill="${P.accent}"/>`,
    },
    {
      // Crânio com órbitas, cavidade nasal e mandíbula (axial).
      svg: `<ellipse cx="160" cy="27" rx="17" ry="19" fill="${P.accent}" fill-opacity="0.15" stroke="${P.accent}" stroke-width="2.5"/>
<path d="M146,38 C146,48 152,53 160,53 C168,53 174,48 174,38" fill="none" stroke="${P.accent}" stroke-width="2.5" stroke-linecap="round"/>
<circle cx="153" cy="29" r="4.5" fill="none" stroke="${P.accent}" stroke-width="2"/>
<circle cx="167" cy="29" r="4.5" fill="none" stroke="${P.accent}" stroke-width="2"/>
<polygon points="160,34 157,40 163,40" fill="none" stroke="${P.accent}" stroke-width="1.5" stroke-linejoin="round"/>`,
    },
    {
      // Cintura escapular (clavícula e escápula) e membros superiores (apendicular).
      svg: `<path d="M156,66 C142,60 128,62 116,60" fill="none" stroke="${P.beam}" stroke-width="3.5" stroke-linecap="round"/>
<polygon points="119,62 137,65 132,98" fill="${P.beam}" fill-opacity="0.18" stroke="${P.beam}" stroke-width="1.5" stroke-linejoin="round"/>
<line x1="115" y1="70" x2="99" y2="134" stroke="${P.beam}" stroke-width="6" stroke-linecap="round"/>
<circle cx="117" cy="66" r="6" fill="${P.beam}" fill-opacity="0.5" stroke="${P.beam}" stroke-width="2"/>
<line x1="98" y1="140" x2="88" y2="184" stroke="${P.beam}" stroke-width="3" stroke-linecap="round"/>
<line x1="103" y1="140" x2="94" y2="185" stroke="${P.beam}" stroke-width="3" stroke-linecap="round"/>
<ellipse cx="90" cy="199" rx="6" ry="12" fill="${P.beam}" fill-opacity="0.5" stroke="${P.beam}" stroke-width="2"/>
<path d="M164,66 C178,60 192,62 204,60" fill="none" stroke="${P.beam}" stroke-width="3.5" stroke-linecap="round"/>
<polygon points="201,62 183,65 188,98" fill="${P.beam}" fill-opacity="0.18" stroke="${P.beam}" stroke-width="1.5" stroke-linejoin="round"/>
<line x1="205" y1="70" x2="221" y2="134" stroke="${P.beam}" stroke-width="6" stroke-linecap="round"/>
<circle cx="203" cy="66" r="6" fill="${P.beam}" fill-opacity="0.5" stroke="${P.beam}" stroke-width="2"/>
<line x1="222" y1="140" x2="232" y2="184" stroke="${P.beam}" stroke-width="3" stroke-linecap="round"/>
<line x1="217" y1="140" x2="226" y2="185" stroke="${P.beam}" stroke-width="3" stroke-linecap="round"/>
<ellipse cx="230" cy="199" rx="6" ry="12" fill="${P.beam}" fill-opacity="0.5" stroke="${P.beam}" stroke-width="2"/>`,
    },
    {
      // Ossos do quadril: ílio, ísquio, púbis e forame obturado (apendicular).
      svg: `<path d="M150,168 C148,158 143,150 136,149 C130,149 126,153 127,160 C128,166 131,171 134,175 C134,184 138,193 145,196 C151,198 156,193 157,189 L157,181 C153,179 150,176 148,172 Z" fill="${P.beam}" fill-opacity="0.2" stroke="${P.beam}" stroke-width="2.5" stroke-linejoin="round"/>
<path d="M170,168 C172,158 177,150 184,149 C190,149 194,153 193,160 C192,166 189,171 186,175 C186,184 182,193 175,196 C169,198 164,193 163,189 L163,181 C167,179 170,176 172,172 Z" fill="${P.beam}" fill-opacity="0.2" stroke="${P.beam}" stroke-width="2.5" stroke-linejoin="round"/>
<ellipse cx="148" cy="187" rx="4" ry="5" fill="none" stroke="${P.beam}" stroke-width="1.5"/>
<ellipse cx="172" cy="187" rx="4" ry="5" fill="none" stroke="${P.beam}" stroke-width="1.5"/>`,
    },
    {
      // Fêmures: cabeça, colo, trocânter maior e diáfise, cortados no meio da coxa (apendicular).
      svg: `<line x1="130" y1="188" x2="118" y2="240" stroke="${P.beam}" stroke-width="8" stroke-linecap="round"/>
<line x1="139" y1="180" x2="130" y2="187" stroke="${P.beam}" stroke-width="6" stroke-linecap="round"/>
<circle cx="140" cy="178" r="7" fill="${P.beam}" fill-opacity="0.5" stroke="${P.beam}" stroke-width="2"/>
<circle cx="127" cy="185" r="5" fill="${P.beam}"/>
<line x1="190" y1="188" x2="202" y2="240" stroke="${P.beam}" stroke-width="8" stroke-linecap="round"/>
<line x1="181" y1="180" x2="190" y2="187" stroke="${P.beam}" stroke-width="6" stroke-linecap="round"/>
<circle cx="180" cy="178" r="7" fill="${P.beam}" fill-opacity="0.5" stroke="${P.beam}" stroke-width="2"/>
<circle cx="193" cy="185" r="5" fill="${P.beam}"/>`,
    },
  ],
};
