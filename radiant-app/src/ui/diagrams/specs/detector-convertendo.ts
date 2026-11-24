import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, corte de um detector indireto. Três placas (cintilador,
// fotodiodo, leitura) e, entre elas, três sinais que descem: raios X (amarelo)
// acima do cintilador, luz (branco) entre o cintilador e o fotodiodo, carga
// elétrica (ciano) entre o fotodiodo e a leitura. Cada sinal é uma linha
// tracejada que anda um passo do tracejado por ciclo (emenda invisível); as
// pontas da linha ficam sob as placas, que são opacas. Os três tracejados
// têm a mesma fase, então um pulso que some sob uma placa reaparece sob ela.
const STEP = 24;
const COLS = [70, 115, 160, 205, 250];
const PLATE = { x: 40, w: 240 };
// Faixas: [topo da faixa do sinal, base]; as linhas começam um passo acima do
// topo (dentro da placa de cima) e terminam na base.
const X = { top: 0, bottom: 68 };
const L = { top: 92, bottom: 132 };
const Q = { top: 156, bottom: 196 };

const flow = (band: { top: number; bottom: number }, color: string, dash: string, width: number, cap: 'butt' | 'round') => {
  const start = band.top - STEP;
  const offset = ((start % STEP) + STEP) % STEP;
  const d = COLS.map((x) => `M${x} ${start}V${band.bottom}`).join('');
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="${cap}" stroke-dasharray="${dash}" stroke-dashoffset="${offset}"/>`;
};
const plate = (y: number, h: number, body: string) =>
  `<rect x="${PLATE.x}" y="${y}" width="${PLATE.w}" height="${h}" rx="3" fill="${P.bg}"/>${body}`;
const slab = (y: number, h: number, fill: string, op: number, stroke: string) =>
  `<rect x="${PLATE.x}" y="${y}" width="${PLATE.w}" height="${h}" rx="3" fill="${fill}" fill-opacity="${op}" stroke="${stroke}" stroke-width="3"/>`;
const loop = { kind: 'translate', dx: 0, dy: STEP, mode: 'loop' } as const;

export const detectorConvertendo: DiagramSpec = {
  id: 'detector-convertendo',
  alt: 'Detector digital indireto em corte: raios X descem ao cintilador, que os converte em luz; o fotodiodo converte a luz em carga, lida pela matriz embaixo.',
  width: 320,
  height: 240,
  periodMs: 2400,
  posterAt: 0.3,
  layers: [
    { svg: flow(X, P.beam, '10 14', 4, 'butt'), motion: loop },
    { svg: flow(L, P.line, '4 20', 4, 'round'), motion: loop },
    { svg: flow(Q, P.electron, '0.1 23.9', 6, 'round'), motion: loop },
    {
      // Placas: cintilador, fotodiodo e matriz de leitura.
      svg: `${plate(68, 24, slab(68, 24, P.accent, 0.3, P.accent))}
${plate(132, 24, slab(132, 24, P.fill, 1, P.muted))}
${plate(196, 28, slab(196, 28, P.fill, 1, P.muted))}
${COLS.map((x) => `<rect x="${x - 9}" y="203" width="18" height="14" rx="2" fill="none" stroke="${P.muted}" stroke-width="2"/>`).join('')}`,
    },
    {
      // O cintilador brilha ao converter.
      svg: `<rect x="${PLATE.x}" y="68" width="${PLATE.w}" height="24" rx="3" fill="${P.line}"/>`,
      motion: { kind: 'fade', from: 0, to: 0.4, mode: 'pingpong' },
    },
    {
      // O fotodiodo brilha ao gerar carga, um pouco depois.
      svg: `<rect x="${PLATE.x}" y="132" width="${PLATE.w}" height="24" rx="3" fill="${P.electron}"/>`,
      motion: { kind: 'fade', from: 0, to: 0.4, mode: 'pingpong', phase: 0.25 },
    },
  ],
};
