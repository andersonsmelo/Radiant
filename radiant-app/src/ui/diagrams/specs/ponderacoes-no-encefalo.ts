import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240. O mesmo corte axial esquemático da cabeça três vezes (frente
// para cima): gordura do couro cabeludo por fora, a tábua óssea sem sinal,
// substância cinzenta por fora, branca por dentro e os ventrículos laterais em
// borboleta. Os tons são o branco do app com opacidades diferentes sobre o fundo.
// 1: T1 (líquido escuro, gordura clara, branca mais clara que a cinzenta).
// 2: T2 (líquido claro, branca mais escura que a cinzenta).
// 3: T2 com o líquido suprimido (FLAIR): tecidos como em T2, líquido escuro.
const CY = 122;
type Tones = { fat: number; gray: number; white: number; csf: number };
const shade = (shape: string, o: number) =>
  `<${shape} fill="${P.bg}"/><${shape} fill="${P.line}" fill-opacity="${o}"/>`;
const head = (cx: number, t: Tones) => {
  const vent = (side: 1 | -1) =>
    `ellipse cx="${cx + 8 * side}" cy="108" rx="14" ry="6" transform="rotate(${-52 * side} ${cx + 8 * side} 108)"`;
  return `${shade(`ellipse cx="${cx}" cy="${CY}" rx="48" ry="66"`, t.fat)}
<ellipse cx="${cx}" cy="${CY}" rx="48" ry="66" fill="none" stroke="${P.muted}" stroke-width="1.5"/>
<ellipse cx="${cx}" cy="${CY}" rx="43" ry="60" fill="${P.bg}"/>
${shade(`ellipse cx="${cx}" cy="${CY}" rx="40" ry="57"`, t.gray)}
${shade(`ellipse cx="${cx}" cy="${CY + 1}" rx="30" ry="49"`, t.white)}
${shade(vent(-1), t.csf)}${shade(vent(1), t.csf)}`;
};

export const ponderacoesNoEncefalo: DiagramSpec = {
  id: 'ponderacoes-no-encefalo',
  alt: 'Três vezes o mesmo corte axial da cabeça, com ventrículos em borboleta; o brilho do líquido, da gordura e das substâncias branca e cinzenta muda em cada um.',
  width: 320,
  height: 240,
  layers: [
    { svg: head(54, { fat: 0.92, gray: 0.34, white: 0.58, csf: 0.06 }) },
    { svg: head(160, { fat: 0.62, gray: 0.55, white: 0.3, csf: 0.95 }) },
    { svg: head(266, { fat: 0.62, gray: 0.55, white: 0.3, csf: 0.06 }) },
  ],
};
