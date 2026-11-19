import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Três perfis da mesma borda (um degrau), empilhados, cada um sobre a sua
// linha de base: o original (rampa curta), o realçado (ultrapassagem para baixo antes da borda e
// para cima depois dela: o halo) e o suavizado (rampa bem mais larga). Nos dois de baixo, o
// original aparece tracejado ao fundo, para comparar. Sem texto.
export const realceESuavizacao: DiagramSpec = {
  id: 'realce-e-suavizacao',
  alt: 'Três perfis empilhados de uma mesma borda: degrau com rampa curta, degrau com ultrapassagem antes e depois da borda, e degrau com rampa larga e suave.',
  width: 320,
  height: 240,
  layers: [
    {
      // Linhas de base de cada perfil.
      svg: `<line x1="24" y1="72" x2="296" y2="72" stroke="${P.muted}" stroke-width="2" stroke-linecap="round"/>
<line x1="24" y1="150" x2="296" y2="150" stroke="${P.muted}" stroke-width="2" stroke-linecap="round"/>
<line x1="24" y1="228" x2="296" y2="228" stroke="${P.muted}" stroke-width="2" stroke-linecap="round"/>`,
    },
    {
      // Original, rampa curta; repetido tracejado atrás dos outros dois.
      svg: `<path d="M30 54 H150 L170 22 H290" fill="none" stroke="${P.line}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M30 132 H150 L170 100 H290" fill="none" stroke="${P.muted}" stroke-width="2" stroke-dasharray="5 5" stroke-linejoin="round"/>
<path d="M30 210 H150 L170 178 H290" fill="none" stroke="${P.muted}" stroke-width="2" stroke-dasharray="5 5" stroke-linejoin="round"/>`,
    },
    {
      // Realçado: afunda antes da borda e passa do patamar depois dela.
      svg: `<path d="M30 132 H132 L146 146 L166 86 L182 100 H290" fill="none" stroke="${P.accent}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`,
    },
    {
      // Suavizado: a rampa ocupa cerca de cinco vezes a largura.
      svg: `<path d="M30 210 H108 C140 210 140 178 172 178 H290" fill="none" stroke="${P.beam}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`,
    },
  ],
};
