import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';
import { radiografiaBase } from './radiografia-roteiro';

// Quadro 320x240, parado. A mesma radiografia esquemática de `radiografia-roteiro`, com três
// marcas do equipamento: uma linha vertical sem sinal (clara) de alto a baixo do filme, sobre
// o lado esquerdo do paciente; corte de grade, com a lateral à esquerda de quem vê mais clara
// e a exposição crescendo em faixas para o centro; e o contorno fraco de uma mão espalmada,
// imagem residual de exame anterior, no canto inferior à direita de quem vê.
export const artefatosDoDetector: DiagramSpec = {
  id: 'artefatos-do-detector',
  alt: 'Esquema de radiografia de tórax em PA com três marcas estranhas à anatomia sobre a imagem, além de pulmões, coração, costelas e diafragma.',
  width: 320,
  height: 240,
  layers: [
    ...radiografiaBase,
    {
      // Corte de grade: faixas claras que perdem brilho da borda para o centro.
      svg: `<rect x="44" y="6" width="20" height="228" fill="${P.line}" fill-opacity="0.55"/>
<rect x="64" y="6" width="20" height="228" fill="${P.line}" fill-opacity="0.4"/>
<rect x="84" y="6" width="20" height="228" fill="${P.line}" fill-opacity="0.26"/>
<rect x="104" y="6" width="20" height="228" fill="${P.line}" fill-opacity="0.13"/>`,
    },
    {
      // Linha morta do detector: fina, reta, de alto a baixo, sem sinal.
      svg: `<line x1="250" y1="6" x2="250" y2="234" stroke="${P.line}" stroke-width="1.5"/>`,
    },
    {
      // Imagem residual: contorno fraco de uma mão espalmada no canto inferior.
      svg: `<g fill="${P.line}" fill-opacity="0.1" stroke="${P.line}" stroke-opacity="0.3" stroke-width="2">
<rect x="202" y="194" width="38" height="40" rx="8"/>
<rect x="203" y="168" width="8" height="30" rx="4"/>
<rect x="212" y="162" width="8" height="36" rx="4"/>
<rect x="221" y="164" width="8" height="34" rx="4"/>
<rect x="230" y="172" width="8" height="26" rx="4"/>
<rect x="200" y="188" width="8" height="26" rx="4" transform="rotate(-40 204 214)"/>
</g>`,
    },
  ],
};
