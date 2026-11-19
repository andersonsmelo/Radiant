import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado, sem texto. Silhuetas simples; quem rotula as estruturas é a aula.
export const cadeiaDeCustodia: DiagramSpec = {
  id: 'cadeia-de-custodia',
  alt: 'Cinco blocos em serpentina ligados por setas: invólucro lacrado, prancheta entre mãos, aparelho de imagem, livro de registro e armário com cadeado.',
  width: 320,
  height: 240,
  layers: [
    {
      // Os cinco blocos.
      svg: `<rect x="18" y="36" width="76" height="68" rx="10" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>
<rect x="122" y="36" width="76" height="68" rx="10" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>
<rect x="226" y="36" width="76" height="68" rx="10" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>
<rect x="226" y="136" width="76" height="68" rx="10" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>
<rect x="122" y="136" width="76" height="68" rx="10" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>`,
    },
    {
      // Setas da serpentina.
      svg: `<line x1="98" y1="70" x2="112" y2="70" stroke="${P.beam}" stroke-width="3" stroke-linecap="round"/>
<polygon points="118,70 112,74.5 112,65.5" fill="${P.beam}" stroke="${P.beam}" stroke-width="1" stroke-linejoin="round"/>
<line x1="202" y1="70" x2="216" y2="70" stroke="${P.beam}" stroke-width="3" stroke-linecap="round"/>
<polygon points="222,70 216,74.5 216,65.5" fill="${P.beam}" stroke="${P.beam}" stroke-width="1" stroke-linejoin="round"/>
<line x1="264" y1="106" x2="264" y2="128" stroke="${P.beam}" stroke-width="3" stroke-linecap="round"/>
<polygon points="264,134 259.5,128 268.5,128" fill="${P.beam}" stroke="${P.beam}" stroke-width="1" stroke-linejoin="round"/>
<line x1="226" y1="170" x2="208" y2="170" stroke="${P.beam}" stroke-width="3" stroke-linecap="round"/>
<polygon points="202,170 208,165.5 208,174.5" fill="${P.beam}" stroke="${P.beam}" stroke-width="1" stroke-linejoin="round"/>`,
    },
    {
      // Ícone do bloco 1.
      svg: `<path d="M40 54 H68 V92 H40 Z" fill="none" stroke="${P.line}" stroke-width="3" stroke-linejoin="round"/>
<path d="M40 61 H68" fill="none" stroke="${P.beam}" stroke-width="3"/>
<path d="M40 54 l3 -3 l3 3 l3 -3 l3 3 l3 -3 l3 3 l3 -3 l3 3 l1 -1" fill="none" stroke="${P.beam}" stroke-width="2" stroke-linejoin="round"/>
<ellipse cx="54" cy="78" rx="8" ry="6" fill="none" stroke="${P.muted}" stroke-width="2"/>
<path d="M68 68 L78 72" fill="none" stroke="${P.muted}" stroke-width="2"/>
<rect x="75" y="71" width="12" height="17" rx="2" fill="${P.beam}" fill-opacity="0.3" stroke="${P.beam}" stroke-width="2"/>
<circle cx="81" cy="76" r="2" fill="${P.line}"/>`,
    },
    {
      // Ícone do bloco 2.
      svg: `<rect x="147" y="50" width="26" height="38" rx="3" fill="none" stroke="${P.line}" stroke-width="3"/>
<rect x="154" y="46" width="12" height="7" rx="2" fill="${P.fill}" stroke="${P.muted}" stroke-width="2.5"/>
<path d="M152 61 H168 M152 67 H168" fill="none" stroke="${P.muted}" stroke-width="2" stroke-linecap="round"/>
<path d="M152 79 q4 -6 6 0 t6 0 t4 -2" fill="none" stroke="${P.beam}" stroke-width="2.5" stroke-linecap="round"/>
<path d="M152 83 H169" fill="none" stroke="${P.beam}" stroke-width="1.5"/>
<path d="M130 66 h9 v8 h-9 M190 66 h-9 v8 h9" fill="none" stroke="${P.line}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="140" cy="70" r="3" fill="${P.line}"/>
<circle cx="180" cy="70" r="3" fill="${P.line}"/>`,
    },
    {
      // Ícone do bloco 3.
      svg: `<rect x="250" y="44" width="28" height="14" rx="5" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<polygon points="257,58 271,58 279,76 249,76" fill="${P.beam}" fill-opacity="0.22" stroke="${P.beam}" stroke-width="2" stroke-linejoin="round"/>
<rect x="240" y="78" width="48" height="7" rx="3" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<path d="M264 85 V96 M254 96 H274" fill="none" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      // Ícone do bloco 4.
      svg: `<path d="M264 156 L238 150 V184 L264 190 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="3" stroke-linejoin="round"/>
<path d="M264 156 L290 150 V184 L264 190 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="3" stroke-linejoin="round"/>
<path d="M244 162 L257 165 M244 170 L257 173 M284 162 L271 165 M284 170 L271 173" fill="none" stroke="${P.muted}" stroke-width="2" stroke-linecap="round"/>
<path d="M276 153 V172 L280 167 L284 172 V152" fill="${P.beam}" fill-opacity="0.5" stroke="${P.beam}" stroke-width="2" stroke-linejoin="round"/>`,
    },
    {
      // Ícone do bloco 5.
      svg: `<rect x="138" y="144" width="44" height="52" rx="3" fill="none" stroke="${P.line}" stroke-width="3"/>
<path d="M160 144 V196" fill="none" stroke="${P.muted}" stroke-width="2"/>
<circle cx="153" cy="156" r="1.8" fill="${P.muted}"/><circle cx="167" cy="156" r="1.8" fill="${P.muted}"/>
<path d="M155 168 V162 a5 5 0 0 1 10 0 V168" fill="none" stroke="${P.beam}" stroke-width="2.5"/>
<rect x="152" y="168" width="16" height="12" rx="2.5" fill="${P.beam}" fill-opacity="0.35" stroke="${P.beam}" stroke-width="2.5"/>`,
    },
  ],
};
