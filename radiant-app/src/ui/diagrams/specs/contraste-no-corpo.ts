import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Dois troncos de frente, lado a lado (o lado direito do
// paciente fica à esquerda de quem vê). Esquerda: o tubo digestivo preenchido de
// contraste, em amarelo (esôfago, estômago à direita de quem vê, alças do delgado no
// centro e o cólon em moldura). Direita: o trato urinário preenchido, em azul (os dois
// rins ao lado da coluna, o direito mais baixo, ureteres e bexiga na pelve). Esquemático.
const contour = (dx: number) =>
  `<path d="M${12 + dx} 0 C${8 + dx} 60 ${18 + dx} 110 ${14 + dx} 140 C${10 + dx} 180 ${6 + dx} 210 ${6 + dx} 240 M${148 + dx} 0 C${152 + dx} 60 ${142 + dx} 110 ${146 + dx} 140 C${150 + dx} 180 ${154 + dx} 210 ${154 + dx} 240" fill="none" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>`;
const bean = (cx: number, cy: number, sx: number) =>
  `<g transform="translate(${cx} ${cy}) scale(${sx} 1)"><path d="M0 -24 C-14 -24 -18 -10 -18 0 C-18 14 -12 24 0 24 C10 24 14 18 12 12 C10 8 6 6 6 0 C6 -6 10 -8 12 -12 C14 -18 10 -24 0 -24 Z" fill="${P.accent}" fill-opacity="0.6" stroke="${P.accent}" stroke-width="3" stroke-linejoin="round"/></g>`;

export const contrasteNoCorpo: DiagramSpec = {
  id: 'contraste-no-corpo',
  alt: 'Dois troncos de frente: um com o tubo digestivo preenchido em amarelo, outro com rins, ureteres e bexiga preenchidos em azul.',
  width: 320,
  height: 240,
  layers: [
    { svg: contour(0) + contour(160) },
    {
      // Coluna lombar do tronco urinário, em traço de apoio.
      svg: `<g fill="none" stroke="${P.muted}" stroke-width="2" stroke-linejoin="round">${[0, 16, 32, 48, 64, 80, 96, 112].map((y) => `<rect x="231" y="${y}" width="18" height="12" rx="2"/>`).join('')}</g>`,
    },
    {
      // Esôfago e estômago.
      svg: `<path d="M80 -4 C80 20 84 32 98 42" fill="none" stroke="${P.beam}" stroke-width="8" stroke-linecap="round"/>
<path d="M96 40 C100 32 116 32 124 40 C134 52 134 72 124 80 C114 88 100 86 94 80 C90 76 92 70 98 68 C106 70 110 66 108 58 C106 52 98 52 96 40 Z" fill="${P.beam}" fill-opacity="0.65" stroke="${P.beam}" stroke-width="3" stroke-linejoin="round"/>`,
    },
    {
      // Intestino delgado: alças no centro.
      svg: `<path d="M52 114 H112 C120 114 120 126 112 126 H52 C44 126 44 138 52 138 H112 C120 138 120 150 112 150 H52 C44 150 44 162 52 162 H100" fill="none" stroke="${P.beam}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`,
    },
    {
      // Cólon em moldura: ceco e ascendente, transverso, descendente e sigmoide.
      svg: `<path d="M28 180 V108 C28 98 36 96 46 98 C70 104 100 104 122 98 C132 96 136 100 136 110 V158 C136 176 118 184 104 176 C94 172 90 178 88 188 C86 204 88 220 86 240" fill="none" stroke="${P.beam}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M28 180 V108 C28 98 36 96 46 98 C70 104 100 104 122 98 C132 96 136 100 136 110 V158" fill="none" stroke="${P.bg}" stroke-width="11" stroke-dasharray="2 9"/>
<circle cx="28" cy="182" r="8" fill="${P.beam}"/>`,
    },
    {
      // Ureteres e bexiga, em azul; os rins por cima.
      svg: `<path d="M214 66 C218 100 226 130 229 162 M264 58 C260 96 254 130 251 162" fill="none" stroke="${P.accent}" stroke-width="4" stroke-linecap="round"/>
<path d="M222 168 C222 158 258 158 258 168 C260 190 250 198 240 198 C230 198 220 190 222 168 Z" fill="${P.accent}" fill-opacity="0.6" stroke="${P.accent}" stroke-width="3" stroke-linejoin="round"/>
${bean(208, 62, 1)}${bean(272, 54, -1)}`,
    },
  ],
};
