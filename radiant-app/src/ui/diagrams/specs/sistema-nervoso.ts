import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Corpo de frente, cortado nas coxas. Sistema nervoso central
// em amarelo (`beam`): o encéfalo na cabeça e a medula espinal descendo pelo meio até
// a altura da cintura (o fim da medula fica na transição toracolombar, acima do
// quadril). Periférico em ciano (`electron`): nervos saindo da medula para os braços,
// para o tronco, entre as costelas, e, do fim da medula, para as pernas.
const half = (x: (v: number) => number) =>
  `M${x(150)} 52 V62 C${x(130)} 64 ${x(106)} 64 ${x(98)} 72 C${x(88)} 82 ${x(84)} 110 ${x(82)} 140 L${x(78)} 196 C${x(78)} 204 ${x(92)} 204 ${x(92)} 196 L${x(96)} 140 C${x(98)} 120 ${x(102)} 104 ${x(108)} 96 C${x(112)} 120 ${x(112)} 150 ${x(108)} 176 C${x(106)} 200 ${x(110)} 220 ${x(112)} 240 M${x(156)} 240 C${x(156)} 220 ${x(158)} 204 160 196`;
const nerves = (x: (v: number) => number) =>
  `M160 68 C${x(140)} 68 ${x(112)} 70 ${x(100)} 80 C${x(92)} 94 ${x(90)} 130 ${x(86)} 190
M160 76 C${x(142)} 78 ${x(116)} 84 ${x(106)} 96 C${x(100)} 110 ${x(96)} 140 ${x(92)} 160
${[92, 104, 116, 128].map((y) => `M160 ${y} C${x(140)} ${y + 2} ${x(124)} ${y + 6} ${x(114)} ${y + 10}`).join(' ')}
M160 136 C${x(150)} 160 ${x(136)} 180 ${x(130)} 240
M160 142 C${x(156)} 170 ${x(148)} 196 ${x(144)} 240`;
const left = (v: number) => v;
const right = (v: number) => 320 - v;

export const sistemaNervoso: DiagramSpec = {
  id: 'sistema-nervoso',
  alt: 'Corpo de frente até as coxas: o encéfalo e a medula espinal numa cor, e nervos de outra cor saindo da medula para os braços, o tronco e as pernas.',
  width: 320,
  height: 240,
  layers: [
    {
      // Silhueta do corpo.
      svg: `<circle cx="160" cy="30" r="22" fill="none" stroke="${P.muted}" stroke-width="3"/>
<path d="${half(left)} ${half(right)}" fill="none" stroke="${P.muted}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
    },
    {
      // Nervos periféricos.
      svg: `<path d="${nerves(left)} ${nerves(right)}" fill="none" stroke="${P.electron}" stroke-width="2" stroke-linecap="round"/>`,
    },
    {
      // Medula espinal, do tronco encefálico até a altura da cintura.
      svg: `<path d="M160 40 V144" stroke="${P.beam}" stroke-width="5" stroke-linecap="round"/>`,
    },
    {
      // Encéfalo.
      svg: `<ellipse cx="160" cy="27" rx="17" ry="13" fill="${P.beam}" fill-opacity="0.35" stroke="${P.beam}" stroke-width="3"/>
<path d="M150 22 C154 18 158 26 162 20 C166 16 168 26 172 24 M148 32 C152 28 158 36 164 30" fill="none" stroke="${P.beam}" stroke-width="2" stroke-linecap="round"/>`,
    },
  ],
};
