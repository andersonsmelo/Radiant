import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Fase 4 da troca das figuras. Quadro 320x240, parado, sem texto: Percurso de um estudo: da aprovação ao arquivo trancado.
// Cinco cartões P.fill em serpentina (a mesma grade nas três figuras de fluxo) e, em cada um, um ícone do Lucide
// (ISC, v1.77.0) intacto, só recolorido e posto no centro. Seta cheia em P.accent. Só o passo de imagem é âmbar (cor do feixe).
// Quem rotula os passos é a aula. Figura com área de toque fica parada: sem movimento.
// Gerado por scripts/content/figuras/fluxos/fluxo-de-pesquisa.mjs: não se edita à mão.
export const fluxoDePesquisa: DiagramSpec = {
  id: 'fluxo-de-pesquisa',
  art: 'imported',
  alt: 'Cinco cartões com ícones ligados por setas: três em cima, da esquerda para a direita, e dois embaixo, da direita para a esquerda.',
  width: 320,
  height: 240,
  layers: [
    {
      // Os cinco cartões.
      svg: `<rect x="18" y="36" width="76" height="68" rx="10" fill="${P.fill}"/>
<rect x="122" y="36" width="76" height="68" rx="10" fill="${P.fill}"/>
<rect x="226" y="36" width="76" height="68" rx="10" fill="${P.fill}"/>
<rect x="226" y="136" width="76" height="68" rx="10" fill="${P.fill}"/>
<rect x="122" y="136" width="76" height="68" rx="10" fill="${P.fill}"/>`,
    },
    {
      // Setas da serpentina.
      svg: `<line x1="99" y1="70" x2="108" y2="70" stroke="${P.accent}" stroke-width="3" stroke-linecap="round"/><polygon points="118,70 107,64.5 107,75.5" fill="${P.accent}" stroke="${P.accent}" stroke-width="1" stroke-linejoin="round"/>
<line x1="203" y1="70" x2="212" y2="70" stroke="${P.accent}" stroke-width="3" stroke-linecap="round"/><polygon points="222,70 211,64.5 211,75.5" fill="${P.accent}" stroke="${P.accent}" stroke-width="1" stroke-linejoin="round"/>
<line x1="264" y1="109" x2="264" y2="119" stroke="${P.accent}" stroke-width="3" stroke-linecap="round"/><polygon points="264,130 258.5,119 269.5,119" fill="${P.accent}" stroke="${P.accent}" stroke-width="1" stroke-linejoin="round"/>
<line x1="221" y1="170" x2="212" y2="170" stroke="${P.accent}" stroke-width="3" stroke-linecap="round"/><polygon points="202,170 213,164.5 213,175.5" fill="${P.accent}" stroke="${P.accent}" stroke-width="1" stroke-linejoin="round"/>`,
    },
    {
      // Os cinco ícones, na ordem do fluxo.
      svg: `<g transform="translate(32 46) scale(2)" fill="none" stroke="${P.line}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/>
<path d="M14 2v5a1 1 0 0 0 1 1h5"/>
<path d="m9 15 2 2 4-4"/>
</g>
<g transform="translate(136 46) scale(2)" fill="none" stroke="${P.line}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<path d="M14.364 13.634a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506l4.013-4.009a1 1 0 0 0-3.004-3.004z"/>
<path d="M14.487 7.858A1 1 0 0 1 14 7V2"/>
<path d="M20 19.645V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l2.516 2.516"/>
<path d="M8 18h1"/>
</g>
<g transform="translate(240 46) scale(2)" fill="none" stroke="${P.beam}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<path d="M3 7V5a2 2 0 0 1 2-2h2"/>
<path d="M17 3h2a2 2 0 0 1 2 2v2"/>
<path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
<path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
<path d="M7 12h10"/>
</g>
<g transform="translate(240 146) scale(2)" fill="none" stroke="${P.line}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/>
<path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/>
<path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/>
<path d="m2 2 20 20"/>
</g>
<g transform="translate(136 146) scale(2)" fill="none" stroke="${P.line}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<rect width="8" height="5" x="14" y="17" rx="1"/>
<path d="M10 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v2.5"/>
<path d="M20 17v-2a2 2 0 1 0-4 0v2"/>
</g>`,
    },
  ],
};
