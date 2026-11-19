import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Dois campos de densitometria de frente. À esquerda, a coluna lombar
// (L1 a L5), com as costelas 11 e 12 em cima e as asas do ilíaco e o sacro embaixo; uma caixa
// sobre cada vértebra de L1 a L4. À direita, o fêmur proximal direito: o lado direito do
// paciente fica à esquerda de quem vê, então a cabeça (no acetábulo) aponta para a direita do
// quadro, para a linha média, e o trocanter maior fica à esquerda, do lado de fora. Uma caixa
// estreita atravessa o colo, uma região cobre o trocanter e um contorno maior (quadril total)
// vai do colo à diáfise logo abaixo do trocanter menor. O fêmur é desenhado em 125 % por
// `transform` para as regiões ficarem separadas.
export const dxaRegioesDeInteresse: DiagramSpec = {
  id: 'dxa-regioes-de-interesse',
  alt: 'Coluna lombar de frente com quatro caixas, uma por vértebra, e fêmur proximal com caixa no colo, região no trocanter e contorno do quadril total.',
  width: 320,
  height: 240,
  layers: [
    {
      // Coluna lombar: T12 cortada no alto, L1 a L5, pedículos, processos transversos e as
      // costelas 11 e 12 descendo para os lados.
      svg: `<rect x="48" y="-8" width="44" height="24" rx="4" fill="${P.fill}" stroke="${P.muted}" stroke-width="2.5"/>
<rect x="48" y="26" width="44" height="26" rx="4" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5"/>
<rect x="48" y="60" width="44" height="26" rx="4" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5"/>
<rect x="48" y="94" width="44" height="26" rx="4" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5"/>
<rect x="48" y="128" width="44" height="26" rx="4" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5"/>
<rect x="47" y="162" width="46" height="26" rx="4" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5"/>
<path d="M48 39 H38 M92 39 H102 M48 73 H34 M92 73 H106 M48 107 H30 M92 107 H110 M48 141 H34 M92 141 H106 M47 175 H38 M93 175 H102" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round"/>
<path d="M46 6 C34 12 22 26 14 42 M94 6 C106 12 118 26 126 42 M44 -2 C30 4 16 16 6 28 M96 -2 C110 4 124 16 134 28" fill="none" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round"/>`,
    },
    {
      // Pelve: sacro e as duas asas do ilíaco, com a crista na altura de L4 e L5.
      svg: `<path d="M52 194 H88 L80 240 H60 Z" fill="${P.fill}" stroke="${P.muted}" stroke-width="2.5" stroke-linejoin="round"/>
<path d="M52 200 C44 178 30 156 14 152 C4 156 2 176 6 200 C12 220 30 234 46 240" fill="none" stroke="${P.line}" stroke-width="2.5" stroke-linecap="round"/>
<path d="M88 200 C96 178 110 156 126 152 C136 156 138 176 134 200 C128 220 110 234 94 240" fill="none" stroke="${P.line}" stroke-width="2.5" stroke-linecap="round"/>`,
    },
    {
      // Caixas de L1 a L4, de disco a disco.
      svg: `<rect x="40" y="22" width="60" height="34" fill="none" stroke="${P.electron}" stroke-width="2"/>
<rect x="40" y="56" width="60" height="34" fill="none" stroke="${P.electron}" stroke-width="2"/>
<rect x="40" y="90" width="60" height="34" fill="none" stroke="${P.electron}" stroke-width="2"/>
<rect x="40" y="124" width="60" height="34" fill="none" stroke="${P.electron}" stroke-width="2"/>`,
    },
    {
      // Fêmur proximal direito no acetábulo, em 125 %: cabeça, colo, trocanter maior (fora),
      // trocanter menor (dentro) e diáfise; acima, o teto do acetábulo e o ilíaco.
      svg: `<g transform="translate(-77.5 -14.5) scale(1.25)">
<path d="M206 236 L202 150 C198 125 190 100 194 84 C196 72 210 68 216 76 C232 66 252 50 266 44 A24.4 24.4 0 1 1 272 78 C264 92 250 108 248 122 C256 128 258 140 246 144 L240 236 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="2.2" stroke-linejoin="round"/>
<path d="M262 38 A31 31 0 0 1 314 72" fill="none" stroke="${P.line}" stroke-width="2.2" stroke-linecap="round"/>
<path d="M262 38 C252 28 252 16 258 4 M314 72 C318 86 318 96 322 106" fill="none" stroke="${P.muted}" stroke-width="2.2" stroke-linecap="round"/>
</g>`,
    },
    {
      // Regiões do fêmur: caixa estreita no colo, região do trocanter e contorno do quadril total.
      svg: `<polygon points="232,46 271,102 250,150 236,202 150,202 152,68 200,56" fill="none" stroke="${P.accent}" stroke-width="2" stroke-dasharray="5 4" stroke-linejoin="round"/>
<polygon points="220,59 192,66 162,76 160,128 254,111" fill="${P.electron}" fill-opacity="0.12" stroke="${P.electron}" stroke-width="2" stroke-linejoin="round"/>
<rect x="-7.5" y="-31" width="15" height="62" transform="translate(244 80) rotate(-35)" fill="${P.bg}" fill-opacity="0.35" stroke="${P.electron}" stroke-width="2"/>`,
    },
  ],
};
