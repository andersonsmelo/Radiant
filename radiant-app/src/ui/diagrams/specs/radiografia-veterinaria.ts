import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado, sem texto. Silhuetas simples; quem rotula as estruturas é a aula.
export const radiografiaVeterinaria: DiagramSpec = {
  id: 'radiografia-veterinaria',
  alt: 'Cão deitado de lado sobre a mesa, com sacos de areia nas patas e calha de espuma; tubo acima com campo de luz no tórax; três pessoas em posições diferentes.',
  width: 320,
  height: 240,
  layers: [
    {
      // Piso e trilho do teto.
      svg: `<line x1="4" y1="214" x2="316" y2="214" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>
<line x1="150" y1="12" x2="230" y2="12" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      // Porta ao fundo e a pessoa afastada, sem avental, junto a ela.
      svg: `<rect x="4" y="100" width="40" height="114" fill="none" stroke="${P.muted}" stroke-width="3" stroke-linejoin="round"/>
<circle cx="38" cy="160" r="2.5" fill="${P.line}"/>
<circle cx="28" cy="120" r="9" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="17" y="131" width="22" height="40" rx="7" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<path d="M23 171 V214 M33 171 V214" fill="none" stroke="${P.line}" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      // Mesa de exame com pedestal e a calha de espuma.
      svg: `<rect x="150" y="166" width="20" height="48" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>
<rect x="94" y="156" width="158" height="10" rx="3" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>`,
    },
    {
      // O tutor, sem avental, junto à mesa, com o espalhamento chegando nele.
      svg: `<line x1="140" y1="126" x2="102" y2="116" stroke="${P.beam}" stroke-width="3" stroke-dasharray="6 5" stroke-linecap="round"/>
<line x1="140" y1="138" x2="102" y2="128" stroke="${P.beam}" stroke-width="3" stroke-dasharray="6 5" stroke-linecap="round"/>
<circle cx="82" cy="120" r="9" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="71" y="131" width="22" height="40" rx="7" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<path d="M77 171 V214 M87 171 V214" fill="none" stroke="${P.line}" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      // Cão deitado de lado: tronco alongado, cabeça com focinho e orelha, quatro patas, cauda, dois sacos de areia e a calha de espuma por cima do contorno.
      svg: `<ellipse cx="158" cy="136" rx="52" ry="15" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<path d="M124 142 L164 149 M130 148 L170 155 M182 142 L232 147 M188 148 L242 155" fill="none" stroke="${P.line}" stroke-width="9" stroke-linecap="round"/>
<path d="M124 142 L164 149 M130 148 L170 155 M182 142 L232 147 M188 148 L242 155" fill="none" stroke="${P.fill}" stroke-width="3" stroke-linecap="round"/>
<path d="M108 130 Q94 128 90 114" fill="none" stroke="${P.line}" stroke-width="3" stroke-linecap="round"/>
<ellipse cx="222" cy="127" rx="14" ry="10" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<ellipse cx="237" cy="132" rx="9" ry="6" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<polygon points="214,119 224,112 224,123" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5" stroke-linejoin="round"/>
<circle cx="228" cy="125" r="1.8" fill="${P.line}"/>
<rect x="140" y="141" width="26" height="11" rx="4" fill="${P.accent}" fill-opacity="0.4" stroke="${P.accent}" stroke-width="3"/>
<rect x="214" y="141" width="26" height="11" rx="4" fill="${P.accent}" fill-opacity="0.4" stroke="${P.accent}" stroke-width="3"/>
<path d="M112 128 L124 156 H196 L208 128" fill="none" stroke="${P.muted}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
    },
    {
      // Tubo no trilho, colimador e o campo de luz sobre o tórax.
      svg: `<line x1="190" y1="12" x2="190" y2="24" stroke="${P.muted}" stroke-width="3"/>
<rect x="168" y="24" width="44" height="26" rx="6" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<polygon points="178,50 202,50 206,58 174,58" fill="${P.fill}" stroke="${P.muted}" stroke-width="3" stroke-linejoin="round"/>
<polygon points="180,58 200,58 208,152 168,152" fill="${P.beam}" fill-opacity="0.22" stroke="${P.beam}" stroke-width="2.5" stroke-linejoin="round"/>`,
    },
    {
      // Quem segura: avental, luvas e guia longa; as mãos ficam fora do campo.
      svg: `<circle cx="302" cy="120" r="9" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="291" y="131" width="22" height="40" rx="7" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<path d="M297 171 V214 M307 171 V214" fill="none" stroke="${P.line}" stroke-width="3" stroke-linecap="round"/>
<path d="M292 134 H312 V176 H292 Z" fill="${P.accent}" fill-opacity="0.4" stroke="${P.accent}" stroke-width="3" stroke-linejoin="round"/>
<path d="M296 140 L282 130" fill="none" stroke="${P.line}" stroke-width="3" stroke-linecap="round"/>
<circle cx="281" cy="130" r="4.5" fill="${P.accent}" stroke="${P.line}" stroke-width="2"/>
<path d="M246 132 Q262 176 281 130" fill="none" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round"/>`,
    },
  ],
};
