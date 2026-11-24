import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Exame de corpo inteiro: silhueta deitada de costas, vista de cima,
// com os braços soltos ao lado do corpo e o esqueleto em traço fraco por dentro. As linhas de
// região separam a cabeça (abaixo do queixo), cada braço (pelo ombro, entre o braço e o
// tronco) e cada perna (oblíquas pelo colo do fêmur, encontrando-se abaixo da pelve); o resto
// é o tronco. Ao lado, três faixas empilhadas, uma cor por componente: osso, massa magra e
// gordura, sem texto. As faixas são uma legenda de cores, não proporções medidas.
export const corpoInteiroComposicao: DiagramSpec = {
  id: 'corpo-inteiro-composicao',
  alt: 'Corpo inteiro deitado visto de cima, com o esqueleto por dentro e linhas que o dividem em regiões; ao lado, três faixas de cores diferentes empilhadas.',
  width: 320,
  height: 240,
  layers: [
    {
      // Silhueta: cabeça, tronco com as pernas e os dois braços afastados do corpo.
      svg: `<g transform="translate(0 6)">
<ellipse cx="110" cy="22" rx="12" ry="15" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5"/>
<path d="M104 36 V44 C96 46 86 46 84 52 L86 100 C84 110 84 118 86 126 L88 180 L92 222 L90 230 H106 L104 222 L108 132 Q110 128 112 132 L116 222 L114 230 H130 L128 222 L132 180 L134 126 C136 118 136 110 134 100 L136 52 C134 46 124 46 116 44 V36" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5" stroke-linejoin="round"/>
<path d="M80 50 C72 50 70 56 70 64 L66 100 L64 138 Q64 154 70 154 Q76 154 76 138 L78 100 L80 70 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5" stroke-linejoin="round"/>
<path d="M140 50 C148 50 150 56 150 64 L154 100 L156 138 Q156 154 150 154 Q144 154 144 138 L142 100 L140 70 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5" stroke-linejoin="round"/>
</g>`,
    },
    {
      // Esqueleto em traço fraco: crânio, coluna, clavículas, caixa torácica, pelve e ossos longos.
      svg: `<g transform="translate(0 6)" fill="none" stroke="${P.muted}" stroke-width="1.5" stroke-opacity="0.7" stroke-linecap="round">
<ellipse cx="110" cy="21" rx="8" ry="10"/>
<path d="M110 36 V112 M108 49 L88 52 M112 49 L132 52"/>
<ellipse cx="110" cy="72" rx="19" ry="20"/>
<path d="M92 104 C96 116 104 120 110 120 C116 120 124 116 128 104"/>
<path d="M80 56 L74 98 L70 136 M140 56 L146 98 L150 136 M94 120 L96 178 L98 220 M126 120 L124 178 L122 220"/>
</g>`,
    },
    {
      // Linhas de região: cabeça, braços e pernas.
      svg: `<g transform="translate(0 6)" fill="none" stroke="${P.accent}" stroke-width="2" stroke-linecap="round">
<path d="M94 38 H126 M84 34 L81 162 M136 34 L139 162 M86 108 L110 140 L134 108"/>
</g>`,
    },
    {
      // Três componentes, uma faixa para cada: osso, massa magra e gordura.
      svg: `<rect x="222" y="52" width="80" height="38" rx="5" fill="${P.line}" fill-opacity="0.55" stroke="${P.line}" stroke-width="2"/>
<rect x="222" y="98" width="80" height="38" rx="5" fill="${P.accent}" fill-opacity="0.55" stroke="${P.accent}" stroke-width="2"/>
<rect x="222" y="144" width="80" height="38" rx="5" fill="${P.beam}" fill-opacity="0.55" stroke="${P.beam}" stroke-width="2"/>`,
    },
  ],
};
