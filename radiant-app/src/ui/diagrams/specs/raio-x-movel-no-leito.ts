import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Enfermaria vista de lado. No centro, o leito com a cabeceira elevada
// à direita e o paciente sentado nela, de frente para a esquerda. O aparelho móvel fica aos pés
// do leito: a coluna sobe, o braço avança e o tubo aponta para o tórax, com o feixe (amarelo)
// perpendicular ao detector (azul), que está entre as costas do paciente e a cabeceira. Tubo,
// feixe, detector, tronco e cabeceira são desenhados num grupo girado 21,8 graus em torno da
// dobradiça da cabeceira, para o feixe ficar perpendicular ao tronco inclinado. À esquerda, o
// operador de avental (azul) segura o disparador no fim do cabo, atrás do tubo, a cerca de 2 m
// do paciente, do lado oposto ao sentido do feixe. À direita, uma pessoa sem avental ao lado da
// cabeceira, a menos de um metro, com a radiação espalhada chegando nela, e o leito vizinho com
// outro paciente deitado.
export const raioXMovelNoLeito: DiagramSpec = {
  id: 'raio-x-movel-no-leito',
  alt: 'Raio X no leito visto de lado: paciente sentado, aparelho móvel apontado para o tórax, operador de avental longe, uma pessoa sem avental perto e outro leito.',
  width: 320,
  height: 240,
  layers: [
    {
      // Piso, leito principal (colchão, estrado, pés e rodas) e leito vizinho com o paciente deitado.
      svg: `<line x1="4" y1="224" x2="316" y2="224" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round"/>
<rect x="104" y="180" width="110" height="10" rx="3" fill="${P.fill}" stroke="${P.muted}" stroke-width="2.5"/>
<path d="M104,194 H214 M112,194 V214 M206,194 V214 M270,194 H320 M276,194 V214" fill="none" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round"/>
<circle cx="112" cy="219" r="4" fill="none" stroke="${P.muted}" stroke-width="2"/>
<circle cx="206" cy="219" r="4" fill="none" stroke="${P.muted}" stroke-width="2"/>
<circle cx="276" cy="219" r="4" fill="none" stroke="${P.muted}" stroke-width="2"/>
<rect x="268" y="180" width="60" height="10" rx="3" fill="${P.fill}" stroke="${P.muted}" stroke-width="2.5"/>
<circle cx="281" cy="171" r="7.5" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5"/>
<rect x="291" y="166" width="36" height="14" rx="6" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5"/>`,
    },
    {
      // Pernas do paciente estendidas no colchão.
      svg: `<path d="M168,168 L110,170 C104,170 104,179 110,179 L168,179" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5" stroke-linejoin="round"/>`,
    },
    {
      // Grupo girado na dobradiça da cabeceira: cabeceira, tronco, cabeça, braço, detector, feixe e tubo.
      svg: `<g transform="translate(180 180) rotate(21.8)">
<rect x="0" y="-52" width="6" height="52" rx="2" fill="${P.fill}" stroke="${P.muted}" stroke-width="2.5"/>
<polygon points="-74,-25 -74,-19 -6,-10 -6,-36" fill="${P.beam}" fill-opacity="0.25" stroke="${P.beam}" stroke-width="2" stroke-linejoin="round"/>
<rect x="-22" y="-34" width="15" height="34" rx="6" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5"/>
<circle cx="-14" cy="-43" r="7.5" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5"/>
<path d="M-15,-30 L-19,-14 L-30,-8" fill="none" stroke="${P.line}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="-6" y="-40" width="5" height="32" rx="1" fill="${P.accent}" stroke="${P.accent}" stroke-width="2"/>
<rect x="-102" y="-30" width="22" height="16" rx="4" fill="${P.fill}" stroke="${P.accent}" stroke-width="2.5"/>
<polygon points="-80,-27 -74,-26 -74,-18 -80,-17" fill="${P.fill}" stroke="${P.muted}" stroke-width="2" stroke-linejoin="round"/>
</g>`,
    },
    {
      // Aparelho móvel: base com rodas, corpo, coluna, braço e haste até o tubo.
      svg: `<rect x="54" y="168" width="42" height="38" rx="4" fill="${P.fill}" stroke="${P.muted}" stroke-width="2.5"/>
<rect x="50" y="206" width="50" height="8" rx="2" fill="${P.fill}" stroke="${P.muted}" stroke-width="2.5"/>
<circle cx="58" cy="219" r="5" fill="none" stroke="${P.muted}" stroke-width="2"/>
<circle cx="92" cy="219" r="5" fill="none" stroke="${P.muted}" stroke-width="2"/>
<rect x="70" y="70" width="6" height="98" fill="${P.fill}" stroke="${P.muted}" stroke-width="2.5"/>
<rect x="70" y="68" width="42" height="7" rx="2" fill="${P.fill}" stroke="${P.muted}" stroke-width="2.5"/>
<line x1="107" y1="75" x2="107" y2="117" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round"/>`,
    },
    {
      // Operador afastado, de avental, com o disparador no fim do cabo.
      svg: `<path d="M56,190 C40,200 46,170 38,158" fill="none" stroke="${P.muted}" stroke-width="2" stroke-dasharray="4 3" stroke-linecap="round"/>
<circle cx="28" cy="116" r="8" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5"/>
<rect x="18" y="126" width="20" height="50" rx="7" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5"/>
<polygon points="17,130 39,130 41,184 15,184" fill="${P.accent}" fill-opacity="0.45" stroke="${P.accent}" stroke-width="2.5" stroke-linejoin="round"/>
<path d="M23,176 V224 M33,176 V224 M36,138 L38,158" fill="none" stroke="${P.line}" stroke-width="2.5" stroke-linecap="round"/>`,
    },
    {
      // Pessoa sem avental ao lado da cabeceira, com o espalhamento chegando nela.
      svg: `<path d="M196,140 L224,132 M198,154 L226,152" fill="none" stroke="${P.beam}" stroke-width="2.5" stroke-dasharray="5 4" stroke-linecap="round"/>
<circle cx="240" cy="118" r="8" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5"/>
<rect x="230" y="128" width="20" height="48" rx="7" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5"/>
<path d="M235,176 V224 M245,176 V224" fill="none" stroke="${P.line}" stroke-width="2.5" stroke-linecap="round"/>`,
    },
  ],
};
