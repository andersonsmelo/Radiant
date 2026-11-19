import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240. O mesmo corte axial esquemático da coxa duas vezes: gordura sob
// a pele, músculo, a cortical do fêmur (sem sinal) e a medula gordurosa. À
// esquerda, sem supressão: gordura e medula claras. À direita, com supressão de
// gordura: as duas apagadas, menos um crescente da gordura junto de um pequeno
// objeto metálico na pele, onde o campo ficou heterogêneo e a supressão falhou.
const CY = 112;
const shade = (shape: string, o: number) =>
  `<${shape} fill="${P.bg}"/><${shape} fill="${P.line}" fill-opacity="${o}"/>`;
const leg = (cx: number, fat: number, marrow: number) =>
  `${shade(`ellipse cx="${cx}" cy="${CY}" rx="58" ry="66"`, fat)}
<ellipse cx="${cx}" cy="${CY}" rx="58" ry="66" fill="none" stroke="${P.muted}" stroke-width="1.5"/>
${shade(`ellipse cx="${cx}" cy="${CY}" rx="48" ry="56"`, 0.3)}
<circle cx="${cx}" cy="${CY}" r="18" fill="${P.bg}"/>
${shade(`circle cx="${cx}" cy="${CY}" r="12"`, marrow)}`;

const RX = 236;
const r1 = (v: number) => Math.round(v * 10) / 10;
// Crescente da falha: a faixa de gordura entre -25 e 82 graus (0 = lado de fora).
const ring = (rx: number, ry: number, from: number, to: number) =>
  Array.from({ length: 13 }, (_, i) => {
    const a = ((from + ((to - from) * i) / 12) * Math.PI) / 180;
    return `${r1(RX + rx * Math.cos(a))},${r1(CY + ry * Math.sin(a))}`;
  });
const failure = [...ring(57, 65, -25, 82), ...ring(49, 57, 82, -25)].join(' ');

export const supressaoDeGordura: DiagramSpec = {
  id: 'supressao-de-gordura',
  alt: 'O mesmo corte da coxa duas vezes: num, a gordura sob a pele e a medula brilham; no outro, estão apagadas, menos um trecho junto de um pequeno objeto metálico.',
  width: 320,
  height: 240,
  layers: [
    { svg: leg(76, 0.92, 0.85) },
    { svg: leg(RX, 0.08, 0.08) },
    {
      // Falha da supressão, clara, junto do objeto.
      svg: `<polygon points="${failure}" fill="${P.line}" fill-opacity="0.85" stroke-linejoin="round"/>`,
    },
    {
      // Objeto metálico (um clipe) sobre a pele, embaixo e à direita.
      svg: `<rect x="238" y="178" width="18" height="10" rx="3" fill="${P.muted}" stroke="${P.line}" stroke-width="2" transform="rotate(-12 247 183)"/>`,
    },
  ],
};
