import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Tronco de frente, do fim do tórax à pelve: o lado direito
// do paciente fica à esquerda de quem vê. O esôfago desce pelo meio até o estômago,
// à esquerda do paciente; o fígado ocupa o alto à direita; o pâncreas aparece numa
// faixa sob o estômago, com a cauda escondida atrás dele; o intestino grosso faz a
// moldura (ascendente, transverso, descendente, sigmoide) em volta do delgado.
const tube = (d: string, w: number) =>
  `<path d="${d}" fill="none" stroke="${P.line}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${d}" fill="none" stroke="${P.fill}" stroke-width="${w - 6}" stroke-linecap="round" stroke-linejoin="round"/>`;

export const tratoDigestivo: DiagramSpec = {
  id: 'trato-digestivo',
  alt: 'Tronco de frente com esôfago, estômago, fígado, pâncreas, o intestino delgado enovelado no centro e o intestino grosso em moldura ao redor.',
  width: 320,
  height: 240,
  layers: [
    {
      // Contorno do tronco, da cintura à pelve.
      svg: `<path d="M48 0 C44 60 56 110 52 140 C48 180 40 210 40 240 M272 0 C276 60 264 110 268 140 C272 180 280 210 280 240" fill="none" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      // Pâncreas: cabeça junto ao duodeno, corpo e cauda indo para trás do estômago.
      svg: `<path d="M132 128 C150 132 180 136 210 132 C222 130 232 126 238 120 L242 130 C232 138 214 144 196 146 C170 148 148 148 134 144 C126 140 126 132 132 128 Z" fill="${P.accent}" fill-opacity="0.35" stroke="${P.accent}" stroke-width="3" stroke-linejoin="round"/>`,
    },
    {
      // Esôfago, do alto até a cárdia do estômago.
      svg: tube('M158 -4 C158 30 160 50 176 66', 12),
    },
    {
      // Fígado: lobo direito grande, lobo esquerdo afinando até a linha média.
      svg: `<path d="M62 46 C92 36 150 36 180 46 C184 54 176 62 164 68 C136 86 108 106 80 118 C62 112 52 92 54 68 C54 58 56 50 62 46 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="3" stroke-linejoin="round"/>`,
    },
    {
      // Estômago em J, do fundo à direita de quem vê até o piloro perto da linha média.
      svg: `<path d="M174 68 C178 54 200 48 216 54 C236 62 246 86 240 106 C232 126 206 134 184 132 C170 131 156 128 148 124 C142 122 142 114 148 112 C160 116 176 118 190 114 C204 108 206 92 196 82 C188 76 180 76 174 68 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="3" stroke-linejoin="round"/>`,
    },
    {
      // Intestino delgado: alças no centro, terminando no ceco, embaixo à esquerda de quem vê.
      svg: tube('M112 172 H222 C234 172 234 186 222 186 H112 C100 186 100 200 112 200 H222 C234 200 234 214 222 214 H112 C104 214 98 210 92 206', 10),
    },
    {
      // Intestino grosso: ceco e ascendente, transverso, descendente e sigmoide até o reto.
      svg: tube('M80 222 V162 C80 152 88 150 98 152 C140 162 200 162 240 148 C252 144 258 148 258 158 V206 C258 222 236 226 214 222 C196 218 172 222 164 244', 16),
    },
  ],
};
