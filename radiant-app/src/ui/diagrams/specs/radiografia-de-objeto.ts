import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado, sem texto. Silhuetas simples; quem rotula as estruturas é a aula.
export const radiografiaDeObjeto: DiagramSpec = {
  id: 'radiografia-de-objeto',
  alt: 'Tubo num suporte, quadro num cavalete no feixe e detector atrás; área isolada por cordão com sinal de aviso e uma pessoa ao lado do painel de comando.',
  width: 320,
  height: 240,
  layers: [
    {
      // Piso.
      svg: `<line x1="4" y1="214" x2="316" y2="214" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>
<line x1="190" y1="214" x2="254" y2="214" stroke="${P.beam}" stroke-width="4" stroke-linecap="round"/>`,
    },
    {
      // Tubo de raios X no suporte, com o colimador.
      svg: `<line x1="28" y1="116" x2="28" y2="208" stroke="${P.muted}" stroke-width="3"/>
<rect x="12" y="207" width="32" height="7" rx="2" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>
<rect x="8" y="92" width="38" height="24" rx="6" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<polygon points="46,96 58,100 58,108 46,112" fill="${P.fill}" stroke="${P.muted}" stroke-width="3" stroke-linejoin="round"/>`,
    },
    {
      // Feixe do colimador até o detector.
      svg: `<polygon points="58,100 58,108 136,146 136,62" fill="${P.beam}" fill-opacity="0.22" stroke="${P.beam}" stroke-width="2.5" stroke-linejoin="round"/>`,
    },
    {
      // Cavalete com o quadro no caminho do feixe.
      svg: `<path d="M86 78 L66 214 M92 100 L114 214" fill="none" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>
<rect x="80" y="136" width="20" height="5" rx="1.5" fill="${P.fill}" stroke="${P.muted}" stroke-width="2.5"/>
<rect x="87" y="74" width="8" height="62" rx="1.5" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>`,
    },
    {
      // Detector atrás do quadro.
      svg: `<rect x="136" y="62" width="10" height="86" rx="2" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<path d="M141 148 V214 M129 214 H153" fill="none" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      // Cordão entre pedestais e o sinal de aviso (triângulo).
      svg: `<path d="M198 214 V124 M246 214 V168" fill="none" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>
<path d="M198 172 Q222 188 246 172" fill="none" stroke="${P.beam}" stroke-width="3" stroke-linecap="round"/>
<polygon points="198,94 215,124 181,124" fill="${P.beam}" fill-opacity="0.3" stroke="${P.beam}" stroke-width="3" stroke-linejoin="round"/>
<path d="M198 103 V113" fill="none" stroke="${P.beam}" stroke-width="2.5" stroke-linecap="round"/>
<circle cx="198" cy="118.5" r="1.8" fill="${P.beam}"/>`,
    },
    {
      // Painel de comando e a pessoa fora da área.
      svg: `<rect x="256" y="150" width="20" height="64" rx="3" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="259" y="156" width="14" height="12" rx="2" fill="${P.accent}" fill-opacity="0.5"/>
<circle cx="263" cy="180" r="2" fill="${P.electron}"/><circle cx="270" cy="180" r="2" fill="${P.electron}"/>
<circle cx="294" cy="120" r="9" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="283" y="131" width="22" height="40" rx="7" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<path d="M289 171 V214 M299 171 V214" fill="none" stroke="${P.line}" stroke-width="3" stroke-linecap="round"/>
<path d="M284 140 L277 160" fill="none" stroke="${P.line}" stroke-width="3" stroke-linecap="round"/>`,
    },
  ],
};
