import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Tronco de frente, do alto do abdome à pelve: o lado
// direito do paciente fica à esquerda de quem vê. Os rins ladeiam a coluna, com o
// direito um pouco mais baixo (o fígado fica em cima dele); os ureteres descem do
// hilo de cada rim até a parte de trás da bexiga, na pelve; a uretra sai da base da
// bexiga. Coluna, sacro e asas do ilíaco entram só como traço de apoio.
const kidney = (dy: number, flip: boolean) => {
  const x = (v: number) => (flip ? 320 - v : v);
  const p = (vx: number, vy: number) => `${x(vx)} ${vy + dy}`;
  return `<path d="M${p(112, 30)} C${p(100, 30)} ${p(94, 42)} ${p(94, 54)} C${p(94, 66)} ${p(100, 78)} ${p(112, 78)} C${p(122, 78)} ${p(128, 70)} ${p(128, 64)} C${p(128, 60)} ${p(122, 58)} ${p(122, 54)} C${p(122, 50)} ${p(128, 48)} ${p(128, 44)} C${p(128, 38)} ${p(122, 30)} ${p(112, 30)} Z" fill="${P.fill}" stroke="${P.line}" stroke-width="3" stroke-linejoin="round"/>`;
};

export const sistemaUrinario: DiagramSpec = {
  id: 'sistema-urinario',
  alt: 'Tronco de frente com os dois rins ao lado da coluna, os dois ureteres descendo até a bexiga na pelve e a uretra saindo da bexiga.',
  width: 320,
  height: 240,
  layers: [
    {
      // Contorno do tronco.
      svg: `<path d="M52 0 C48 50 58 90 54 120 C50 160 44 200 44 240 M268 0 C272 50 262 90 266 120 C270 160 276 200 276 240" fill="none" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      // Coluna lombar, sacro e asas do ilíaco, em traço de apoio.
      svg: `<g fill="none" stroke="${P.muted}" stroke-width="2" stroke-linejoin="round">
${[0, 15, 30, 45, 60, 75, 90, 105].map((y) => `<rect x="150" y="${y}" width="20" height="11" rx="2"/>`).join('')}
<path d="M144 120 H176 L160 146 Z"/>
<path d="M142 122 C112 112 84 118 74 140 C70 156 82 172 104 180 M178 122 C208 112 236 118 246 140 C250 156 238 172 216 180"/>
</g>`,
    },
    {
      // Ureteres, do hilo de cada rim à bexiga.
      svg: `<path d="M122 58 C126 88 132 118 138 132 C142 140 144 144 146 148 M198 50 C194 80 188 110 182 130 C178 138 176 144 174 148" fill="none" stroke="${P.accent}" stroke-width="4" stroke-linecap="round"/>`,
    },
    {
      // Rins: o direito do paciente, à esquerda de quem vê, mais baixo.
      svg: kidney(0, false) + kidney(-8, true),
    },
    {
      // Bexiga na pelve e a uretra saindo da base.
      svg: `<path d="M160 176 V236" stroke="${P.accent}" stroke-width="5" stroke-linecap="round"/>
<path d="M134 146 C134 136 186 136 186 146 C188 168 176 180 160 180 C144 180 132 168 134 146 Z" fill="${P.bg}"/>
<path d="M134 146 C134 136 186 136 186 146 C188 168 176 180 160 180 C144 180 132 168 134 146 Z" fill="${P.accent}" fill-opacity="0.35" stroke="${P.accent}" stroke-width="3" stroke-linejoin="round"/>`,
    },
  ],
};
