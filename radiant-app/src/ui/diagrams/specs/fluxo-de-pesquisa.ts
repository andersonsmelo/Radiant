import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado, sem texto. Silhuetas simples; quem rotula as estruturas é a aula.
export const fluxoDePesquisa: DiagramSpec = {
  id: 'fluxo-de-pesquisa',
  alt: 'Cinco blocos em serpentina ligados por setas: documento com selo, folha com caneta, aparelho de imagem, ficha com tarja e cilindro com cadeado.',
  width: 320,
  height: 240,
  layers: [
    {
      // Os cinco blocos.
      svg: `<rect x="18" y="36" width="76" height="68" rx="10" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<rect x="122" y="36" width="76" height="68" rx="10" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<rect x="226" y="36" width="76" height="68" rx="10" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<rect x="226" y="136" width="76" height="68" rx="10" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<rect x="122" y="136" width="76" height="68" rx="10" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>`,
    },
    {
      // Setas da serpentina.
      svg: `<line x1="98" y1="70" x2="112" y2="70" stroke="${P.electron}" stroke-width="3" stroke-linecap="round"/>
<polygon points="118,70 112,74.5 112,65.5" fill="${P.electron}" stroke="${P.electron}" stroke-width="1" stroke-linejoin="round"/>
<line x1="202" y1="70" x2="216" y2="70" stroke="${P.electron}" stroke-width="3" stroke-linecap="round"/>
<polygon points="222,70 216,74.5 216,65.5" fill="${P.electron}" stroke="${P.electron}" stroke-width="1" stroke-linejoin="round"/>
<line x1="264" y1="106" x2="264" y2="128" stroke="${P.electron}" stroke-width="3" stroke-linecap="round"/>
<polygon points="264,134 259.5,128 268.5,128" fill="${P.electron}" stroke="${P.electron}" stroke-width="1" stroke-linejoin="round"/>
<line x1="226" y1="170" x2="208" y2="170" stroke="${P.electron}" stroke-width="3" stroke-linecap="round"/>
<polygon points="202,170 208,165.5 208,174.5" fill="${P.electron}" stroke="${P.electron}" stroke-width="1" stroke-linejoin="round"/>`,
    },
    {
      // Ícone do bloco 1.
      svg: `<path d="M40 46 H64 L74 56 V94 H40 Z" fill="none" stroke="${P.line}" stroke-width="3" stroke-linejoin="round"/>
<path d="M64 46 V56 H74" fill="none" stroke="${P.line}" stroke-width="2" stroke-linejoin="round"/>
<path d="M47 58 H60 M47 65 H66" fill="none" stroke="${P.muted}" stroke-width="2" stroke-linecap="round"/>
<path d="M61 84 l-5 12 l5 -3 l5 3 Z" fill="${P.electron}" fill-opacity="0.4" stroke="${P.electron}" stroke-width="1.5" stroke-linejoin="round"/>
<circle cx="61" cy="80" r="10" fill="${P.fill}" stroke="${P.electron}" stroke-width="3"/>
<path d="M56 80 l4 4 l7 -8" fill="none" stroke="${P.electron}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`,
    },
    {
      // Ícone do bloco 2.
      svg: `<rect x="140" y="46" width="34" height="46" rx="3" fill="none" stroke="${P.line}" stroke-width="3"/>
<path d="M147 56 H167 M147 63 H167 M147 70 H167" fill="none" stroke="${P.muted}" stroke-width="2" stroke-linecap="round"/>
<path d="M147 84 H165" fill="none" stroke="${P.electron}" stroke-width="1.5"/>
<polygon points="164,82 180,58 185,62 169,86" fill="${P.electron}" fill-opacity="0.4" stroke="${P.electron}" stroke-width="2" stroke-linejoin="round"/>
<polygon points="164,82 169,86 162,90" fill="${P.line}" stroke="${P.line}" stroke-width="1" stroke-linejoin="round"/>`,
    },
    {
      // Ícone do bloco 3.
      svg: `<circle cx="264" cy="66" r="25" fill="none" stroke="${P.line}" stroke-width="3"/>
<circle cx="264" cy="66" r="14" fill="none" stroke="${P.electron}" stroke-width="3"/>
<rect x="234" y="88" width="60" height="8" rx="3" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>
<path d="M256 74 H272 V88 H256 Z" fill="none" stroke="${P.muted}" stroke-width="2" stroke-linejoin="round"/>`,
    },
    {
      // Ícone do bloco 4.
      svg: `<rect x="244" y="145" width="40" height="50" rx="3" fill="none" stroke="${P.line}" stroke-width="3"/>
<rect x="249" y="150" width="30" height="9" rx="2" fill="${P.line}"/>
<path d="M249 168 H279 M249 176 H279 M249 184 H269" fill="none" stroke="${P.muted}" stroke-width="2" stroke-linecap="round"/>
<circle cx="276" cy="185" r="3.5" fill="${P.electron}"/>`,
    },
    {
      // Ícone do bloco 5.
      svg: `<path d="M136 148 V186 a24 8 0 0 0 48 0 V148" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<ellipse cx="160" cy="148" rx="24" ry="8" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<path d="M136 164 a24 8 0 0 0 48 0" fill="none" stroke="${P.accent}" stroke-width="2"/>
<path d="M155 168 V162 a5 5 0 0 1 10 0 V168" fill="none" stroke="${P.electron}" stroke-width="2.5"/>
<rect x="152" y="168" width="16" height="12" rx="2.5" fill="${P.electron}" fill-opacity="0.35" stroke="${P.electron}" stroke-width="2.5"/>`,
    },
  ],
};
