import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, dirigido de fora por `progress` (sem `periodMs`): 0 = 1 m,
// 1 = 4 m. A fonte fica em x=28; cada metro vale 62 unidades (1 m em x=90, 4 m
// em x=276). O cone é fixo; o detector anda sobre ele. Embaixo, a pegada do
// mesmo feixe no plano do detector: o lado cresce com a distância (1 m -> 4 m),
// logo a área cresce 16 vezes, e o detector (tamanho fixo) recebe uma fração
// cada vez menor da mesma radiação.
export const inversoDoQuadrado: DiagramSpec = {
  id: 'inverso-do-quadrado',
  alt: 'Fonte à esquerda emite um feixe que se abre em cone. O detector se afasta; a área iluminada por ele cresce, e a mesma radiação se espalha.',
  width: 320,
  height: 240,
  posterAt: 0.5,
  layers: [
    {
      // Cone do feixe: meia-abertura de 70 em x=300.
      svg: `<polygon points="28,150 300,80 300,220" fill="${P.beam}" fill-opacity="0.22" stroke="${P.beam}" stroke-width="2" stroke-linejoin="round"/>`,
    },
    {
      // Fonte e régua de 1 a 4 m.
      svg: `<circle cx="28" cy="150" r="9" fill="${P.beam}" stroke="${P.line}" stroke-width="2.5"/>
<line x1="90" y1="228" x2="276" y2="228" stroke="${P.muted}" stroke-width="2"/>
<line x1="90" y1="222" x2="90" y2="234" stroke="${P.muted}" stroke-width="2"/>
<line x1="152" y1="222" x2="152" y2="234" stroke="${P.muted}" stroke-width="2"/>
<line x1="214" y1="222" x2="214" y2="234" stroke="${P.muted}" stroke-width="2"/>
<line x1="276" y1="222" x2="276" y2="234" stroke="${P.muted}" stroke-width="2"/>`,
    },
    {
      // Detector: a 1 m; anda 186 unidades até 4 m.
      svg: `<rect x="85" y="136" width="10" height="28" rx="2" fill="${P.accent}" stroke="${P.line}" stroke-width="2.5"/>`,
      motion: { kind: 'translate', dx: 186, dy: 0, mode: 'once' },
    },
    {
      // Pegada máxima (a 4 m), só o contorno.
      svg: `<rect x="236" y="8" width="64" height="64" rx="2" fill="none" stroke="${P.muted}" stroke-width="2" stroke-dasharray="4 4"/>`,
    },
    {
      // Pegada do feixe: lado proporcional à distância, de 1/4 a 1.
      svg: `<rect x="236" y="8" width="64" height="64" rx="2" fill="${P.beam}" fill-opacity="0.45" stroke="${P.beam}" stroke-width="2"/>`,
      motion: { kind: 'scale', from: 0.25, to: 1, cx: 268, cy: 40, mode: 'once' },
    },
    {
      // O detector visto de frente: tamanho fixo no centro da pegada.
      svg: `<rect x="263" y="35" width="10" height="10" rx="1" fill="${P.accent}" stroke="${P.line}" stroke-width="2"/>`,
    },
  ],
};
