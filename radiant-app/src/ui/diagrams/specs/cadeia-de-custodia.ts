import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Fase 4 da troca das figuras. Quadro 320x240, parado, sem texto: Cadeia de custódia: do material lacrado ao armário.
// Cinco cartões P.fill em serpentina (a mesma grade nas três figuras de fluxo) e, em cada um, um ícone do Lucide
// (ISC, v1.77.0) intacto, só recolorido e posto no centro. Seta cheia em P.accent. Só o passo de imagem é âmbar (cor do feixe).
// Quem rotula os passos é a aula. Figura com área de toque fica parada: sem movimento.
// Gerado por scripts/content/figuras/fluxos/cadeia-de-custodia.mjs: não se edita à mão.
export const cadeiaDeCustodia: DiagramSpec = {
  id: 'cadeia-de-custodia',
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
<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/>
<path d="M12 22V12"/>
<polyline points="3.29 7 12 12 20.71 7"/>
<path d="m7.5 4.27 9 5.15"/>
</g>
<g transform="translate(136 46) scale(2)" fill="none" stroke="${P.line}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<path d="m11 17 2 2a1 1 0 1 0 3-3"/>
<path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/>
<path d="m21 3 1 11h-2"/>
<path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/>
<path d="M3 4h8"/>
</g>
<g transform="translate(240 46) scale(2)" fill="none" stroke="${P.beam}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<path d="M3 7V5a2 2 0 0 1 2-2h2"/>
<path d="M17 3h2a2 2 0 0 1 2 2v2"/>
<path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
<path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
<path d="M7 12h10"/>
</g>
<g transform="translate(240 146) scale(2)" fill="none" stroke="${P.line}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4"/>
<path d="M2 6h4"/>
<path d="M2 10h4"/>
<path d="M2 14h4"/>
<path d="M2 18h4"/>
<path d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/>
</g>
<g transform="translate(136 146) scale(2)" fill="none" stroke="${P.line}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<rect width="8" height="5" x="14" y="17" rx="1"/>
<path d="M10 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v2.5"/>
<path d="M20 17v-2a2 2 0 1 0-4 0v2"/>
</g>`,
    },
  ],
};
