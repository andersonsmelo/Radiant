import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240. Tórax de frente: o lado direito do paciente fica à esquerda de
// quem vê. Pulmões e costelas crescem a partir do alto da traqueia (160,50) e o
// diafragma desce junto: no meio do ciclo, a inspiração cheia; nas pontas, a
// expiração. O pulmão direito é mais largo e a cúpula direita fica mais alta.
const AX = 160;
const AY = 50;
const pingpong = { mode: 'pingpong' } as const;

const rib = (y: number) =>
  `<path d="M150 ${y} C112 ${y - 14} 62 ${y - 8} 46 ${y + 18} M170 ${y} C208 ${y - 14} 258 ${y - 8} 274 ${y + 18}"/>`;

export const respiracaoDiafragma: DiagramSpec = {
  id: 'respiracao-diafragma',
  alt: 'Tórax de frente com traqueia, dois pulmões, costelas e o diafragma em cúpula: os pulmões crescem enquanto o diafragma desce, e depois tudo volta.',
  width: 320,
  height: 240,
  periodMs: 4800,
  posterAt: 0.5,
  layers: [
    {
      // Contorno do pescoço, dos ombros e da parede do tronco.
      svg: `<path d="M140 2 V20 C120 28 62 26 38 40 C28 46 26 60 26 80 L24 238 M180 2 V20 C200 28 258 26 282 40 C292 46 294 60 294 80 L296 238" fill="none" stroke="${P.muted}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
    },
    {
      // Pulmões: o direito, mais largo; o esquerdo, com a incisura do coração.
      svg: `<path d="M112 52 C90 52 72 86 68 130 C65 160 62 178 62 190 C78 172 96 160 114 160 C130 160 142 166 148 172 L148 92 C147 70 134 52 112 52 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="3" stroke-linejoin="round"/>
<path d="M208 52 C230 52 248 86 252 130 C255 160 258 180 258 192 C242 176 226 166 210 166 C200 166 194 170 190 172 C190 156 186 140 176 128 L172 92 C173 70 186 52 208 52 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="3" stroke-linejoin="round"/>`,
      motion: { kind: 'scale', from: 1, to: 1.1, cx: AX, cy: AY, ...pingpong },
    },
    {
      // Costelas, traço de apoio, que se abrem um pouco na inspiração.
      svg: `<g fill="none" stroke="${P.muted}" stroke-width="2" stroke-linecap="round">${[66, 88, 110, 132, 154].map(rib).join('')}</g>`,
      motion: { kind: 'scale', from: 1, to: 1.04, cx: AX, cy: AY, ...pingpong },
    },
    {
      // Diafragma em cúpula, sob as bases dos pulmões; a cúpula direita é mais alta.
      svg: `<path d="M42 206 C52 200 58 194 64 188 C80 172 98 160 114 160 C130 160 142 166 160 172 C178 168 194 166 210 166 C226 166 244 178 256 190 C264 198 272 204 278 208" fill="none" stroke="${P.accent}" stroke-width="5" stroke-linecap="round"/>`,
      motion: { kind: 'translate', dx: 0, dy: 12, ...pingpong },
    },
    {
      // Traqueia com anéis e os dois brônquios principais; o direito, mais vertical.
      svg: `<rect x="153" y="8" width="14" height="56" rx="5" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<path d="M155 20 H165 M155 32 H165 M155 44 H165" stroke="${P.muted}" stroke-width="2"/>
<path d="M156 62 L136 90 M164 62 L192 86" stroke="${P.line}" stroke-width="5" stroke-linecap="round"/>`,
    },
  ],
};
