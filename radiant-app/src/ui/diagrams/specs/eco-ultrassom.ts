import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240. Transdutor sobre a pele (y 34); interface entre dois tecidos em
// y 140. O pulso desce, e ao chegar à interface parte volta como eco (mais
// fino) e parte segue para baixo, mais fraco. Os três são barras que andam à
// mesma velocidade. O pulso nasce sob o transdutor e morre sob o tecido de baixo;
// eco e transmitido nascem na interface, no instante em que o pulso chega.
const IFACE = 140;
const START = 24; // base da barra do pulso ao nascer, escondida sob o transdutor
const DIST = IFACE - START; // 116
const TRAVEL = 2.5 * DIST; // a barra cruza a distância em 40% do ciclo
const HIT = 0.4; // fração do ciclo em que o pulso chega à interface
const T0 = 0.2; // instante em que o pulso nasce
const bar = (bottom: number, h: number, fill: string, op: number) =>
  `<rect x="134" y="${bottom - h}" width="52" height="${h}" rx="2" fill="${fill}" fill-opacity="${op}"/>`;

export const ecoUltrassom: DiagramSpec = {
  id: 'eco-ultrassom',
  alt: 'Ultrassom: o transdutor sobre a pele emite um pulso que desce, e na interface entre dois tecidos parte volta como eco ao transdutor e parte segue mais fraca.',
  width: 320,
  height: 240,
  periodMs: 5000,
  posterAt: 0.75,
  layers: [
    {
      // Tecido de cima.
      svg: `<rect x="0" y="34" width="320" height="${IFACE - 34}" fill="${P.fill}"/>`,
    },
    {
      // Pulso que desce.
      svg: bar(START, 8, P.beam, 1),
      motion: { kind: 'translate', dx: 0, dy: TRAVEL, mode: 'loop', phase: -T0 },
    },
    {
      // Eco que sobe, depois de refletido; continua além do transdutor e sai do quadro.
      svg: bar(IFACE, 5, P.electron, 1),
      motion: { kind: 'translate', dx: 0, dy: -TRAVEL, mode: 'loop', phase: 1 - (T0 + HIT) },
    },
    {
      // Tecido de baixo (opaco, esconde o pulso depois da interface) e a interface.
      svg: `<rect x="0" y="${IFACE}" width="320" height="${240 - IFACE}" fill="${P.bg}"/>
<rect x="0" y="${IFACE}" width="320" height="${240 - IFACE}" fill="${P.fill}"/>
<rect x="0" y="${IFACE}" width="320" height="${240 - IFACE}" fill="${P.muted}" fill-opacity="0.2"/>
<line x1="0" y1="${IFACE}" x2="320" y2="${IFACE}" stroke="${P.line}" stroke-width="3"/>`,
    },
    {
      // Parte que segue para baixo, mais fraca.
      svg: bar(IFACE, 6, P.beam, 0.45),
      motion: { kind: 'translate', dx: 0, dy: TRAVEL, mode: 'loop', phase: 1 - (T0 + HIT) },
    },
    {
      // Transdutor sobre a pele.
      svg: `<rect x="130" y="8" width="60" height="26" rx="5" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<line x1="160" y1="8" x2="160" y2="0" stroke="${P.muted}" stroke-width="3"/>
<line x1="0" y1="34" x2="130" y2="34" stroke="${P.muted}" stroke-width="3"/>
<line x1="190" y1="34" x2="320" y2="34" stroke="${P.muted}" stroke-width="3"/>`,
    },
  ],
};
