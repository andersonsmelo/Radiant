import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Fase 4 da troca das figuras. Quadro 320x240, parado, sem texto: Caminho do pedido: do cadastro à estação de visualização.
// Cinco cartões P.fill em serpentina (a mesma grade nas três figuras de fluxo) e, em cada um, um ícone do Lucide
// (ISC, v1.77.0) intacto, só recolorido e posto no centro. Seta cheia em P.accent. Só o passo de imagem é âmbar (cor do feixe).
// Quem rotula os passos é a aula. Figura com área de toque fica parada: sem movimento.
// Gerado por scripts/content/figuras/fluxos/fluxo-ris-pacs.mjs: não se edita à mão.
export const fluxoRisPacs: DiagramSpec = {
  id: 'fluxo-ris-pacs',
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
<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
<path d="M12 11h4"/>
<path d="M12 16h4"/>
<path d="M8 11h.01"/>
<path d="M8 16h.01"/>
</g>
<g transform="translate(136 46) scale(2)" fill="none" stroke="${P.line}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<path d="M13 5h8"/>
<path d="M13 12h8"/>
<path d="M13 19h8"/>
<path d="m3 17 2 2 4-4"/>
<path d="m3 7 2 2 4-4"/>
</g>
<g transform="translate(240 46) scale(2)" fill="none" stroke="${P.beam}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<path d="M12 12h.01"/>
<path d="M14 15.4641a4 4 0 0 1-4 0L7.52786 19.74597 A 1 1 0 0 0 7.99303 21.16211 10 10 0 0 0 16.00697 21.16211 1 1 0 0 0 16.47214 19.74597z"/>
<path d="M16 12a4 4 0 0 0-2-3.464l2.472-4.282a1 1 0 0 1 1.46-.305 10 10 0 0 1 4.006 6.94A1 1 0 0 1 21 12z"/>
<path d="M8 12a4 4 0 0 1 2-3.464L7.528 4.254a1 1 0 0 0-1.46-.305 10 10 0 0 0-4.006 6.94A1 1 0 0 0 3 12z"/>
</g>
<g transform="translate(240 146) scale(2)" fill="none" stroke="${P.line}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<path d="M10 16h.01"/>
<path d="M2.212 11.577a2 2 0 0 0-.212.896V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.527a2 2 0 0 0-.212-.896L18.55 5.11A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
<path d="M21.946 12.013H2.054"/>
<path d="M6 16h.01"/>
</g>
<g transform="translate(136 146) scale(2)" fill="none" stroke="${P.line}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<path d="m9 10 2 2 4-4"/>
<rect width="20" height="14" x="2" y="3" rx="2"/>
<path d="M12 17v4"/>
<path d="M8 21h8"/>
</g>`,
    },
  ],
};
