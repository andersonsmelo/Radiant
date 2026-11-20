import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Quadril direito de frente (AP), cerca de 16 unidades por cm: o lado
// de fora do paciente (lateral) fica à esquerda de quem vê, a linha média à direita. Parte do
// osso do quadril com o acetábulo, o forame obturado e o ramo do púbis; cabeça do fêmur (4,6 cm)
// no acetábulo, colo a 125 graus da diáfise, trocânter maior lateral e acima, trocânter menor
// medial, por trás da diáfise. A diáfise desce levemente para dentro. Crista ilíaca cortada.
export const femurProximalEQuadril: DiagramSpec = {
  id: 'femur-proximal-e-quadril',
  alt: 'Quadril direito de frente: osso do quadril em cima e à direita, cabeça do fêmur no encaixe, colo inclinado e a diáfise descendo; lado de fora à esquerda.',
  width: 320,
  height: 240,
  layers: [
    {
      // Osso do quadril (ílio, ísquio e púbis num só contorno), com o forame obturado.
      svg: `<path d="M48,-4 L48,8 C56,20 70,28 86,30 C106,32 126,36 152.6,50.7 C158.6,54.7 159.6,58.7 160.6,60.7 A41,41 0 1 1 219.2,108.2 C222,132 218,150 214,172 C212,186 218,198 230,202 C246,206 262,200 276,190 C290,180 304,172 324,168 L324,124 C300,124 276,120 262,112 C268,80 286,40 300,-4 Z" fill="${P.fill}" stroke="${P.muted}" stroke-width="2.5" stroke-linejoin="round"/>
<path d="M244,152 C240,136 252,124 266,128 C280,132 294,142 296,156 C298,170 284,180 268,178 C254,176 246,166 244,152 Z" fill="${P.bg}" stroke="${P.muted}" stroke-width="2"/>`,
    },
    {
      // Acetábulo: o rebordo do encaixe sobre a cabeça.
      svg: `<path d="M160.6,60.7 A41,41 0 1 1 219.2,108.2" fill="none" stroke="${P.accent}" stroke-width="4" stroke-linecap="round"/>`,
    },
    {
      // Trocânter menor, medial e posterior: aparece por trás da diáfise, em traço mais fraco.
      svg: `<path d="M159.7,146 C172,150 180,158 178,166 C176,174 166,176 164,178 Z" fill="${P.fill}" stroke="${P.muted}" stroke-width="2.5" stroke-linejoin="round"/>`,
    },
    {
      // Fêmur proximal: cabeça, colo, trocânter maior e diáfise.
      svg: `<path d="M130.5,250 L115.4,144 C114,134 96,126 94,112 C92,100 94,90 100,84 C106,82 112,84 116,90 C122,98 130,98 141.3,94.1 L163.2,73.6 A37,37 0 1 1 196,108.7 L174,129.2 C163.4,144 160.9,152 161.7,160 L174.5,250 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5" stroke-linejoin="round"/>`,
    },
    {
      // Eixos do colo e da diáfise, em traço fino, mostrando o ângulo obtuso entre eles.
      svg: `<path d="M200,72 L135.7,132.1 L149.1,226" fill="none" stroke="${P.beam}" stroke-width="1.5" stroke-dasharray="4 4" stroke-linejoin="round"/>`,
    },
  ],
};
