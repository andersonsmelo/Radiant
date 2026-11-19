import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, mesma geometria de `tubo-raios-x`. Os elétrons saem do
// filamento e correm até o ponto focal (219,105); dali o feixe sai pela janela,
// perpendicular ao eixo cátodo-ânodo. Cada fluxo é uma linha tracejada que
// desliza exatamente um período do traço: o salto do laço fica invisível e um
// traço novo nasce na origem (filamento, ponto focal).
const FX = 219;
const FY = 105;
const loop = { mode: 'loop' } as const;

/** Raio do ponto focal para (x, 236), tracejado, com período 24 e deslocamento de um período. */
const ray = (toX: number, phase: number) => {
  const dx = toX - FX;
  const dy = 236 - FY;
  const len = Math.hypot(dx, dy);
  const [ux, uy] = [dx / len, dy / len];
  const r = (v: number) => Math.round(v * 100) / 100;
  return {
    svg: `<line x1="${FX}" y1="${FY}" x2="${r(FX + ux * 170)}" y2="${r(FY + uy * 170)}" stroke="${P.beam}" stroke-width="3" stroke-dasharray="5 19"/>`,
    motion: { kind: 'translate' as const, dx: r(ux * 24), dy: r(uy * 24), ...loop, phase },
  };
};

export const tuboEmitindo: DiagramSpec = {
  id: 'tubo-emitindo',
  alt: 'Tubo de raios X em funcionamento: elétrons correm do filamento ao alvo do ânodo e, do ponto de impacto, fótons saem pela janela.',
  width: 320,
  height: 240,
  periodMs: 2400,
  posterAt: 0.4,
  layers: [
    {
      // Ampola de vidro e janela.
      svg: `<rect x="30" y="40" width="260" height="130" rx="26" fill="none" stroke="${P.accent}" stroke-width="3"/>
<rect x="198" y="166" width="42" height="8" rx="2" fill="none" stroke="${P.accent}" stroke-width="3"/>`,
    },
    {
      // Campo do feixe útil, do ponto focal para baixo.
      svg: `<polygon points="219,105 190,236 252,236" fill="${P.beam}" fill-opacity="0.18"/>`,
    },
    ray(219, 0),
    ray(190, 0.35),
    ray(252, 0.7),
    {
      // Cátodo: bobina do filamento dentro da capa de focalização.
      svg: `<path d="M100 80 H82 V130 H100" fill="none" stroke="${P.muted}" stroke-width="3" stroke-linejoin="round"/>
<path d="M86 105 l4 -10 l5 20 l5 -20 l5 20 l4 -10" fill="none" stroke="${P.line}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
<line x1="82" y1="105" x2="30" y2="105" stroke="${P.muted}" stroke-width="3"/>`,
    },
    {
      // Elétrons: três filas que nascem junto ao filamento e somem dentro do ânodo.
      svg: [
        [95, 106],
        [105, 116],
        [115, 111],
      ]
        .map(([y, x]) => `<line x1="${x}" y1="${y}" x2="226" y2="${y}" stroke="${P.electron}" stroke-width="3" stroke-dasharray="3 19"/>`)
        .join('\n'),
      motion: { kind: 'translate', dx: 22, dy: 0, ...loop },
    },
    {
      // Ânodo, com a face inclinada voltada para a janela (cobre o fim das filas).
      svg: `<polygon points="212,78 252,78 252,136 227,136" fill="${P.fill}" stroke="${P.line}" stroke-width="3" stroke-linejoin="round"/>
<line x1="252" y1="107" x2="290" y2="107" stroke="${P.muted}" stroke-width="3"/>`,
    },
  ],
};
