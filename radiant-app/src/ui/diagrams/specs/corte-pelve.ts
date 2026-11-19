import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Corte axial da pelve na altura das cabeças do fêmur, na convenção
// da tomografia: visto de baixo, frente do corpo no alto, lado direito do paciente à esquerda
// de quem vê. Sínfise púbica na frente; bexiga atrás dela, na linha média; reto atrás, na
// frente do cóccix; cabeças do fêmur nas laterais, encaixadas nos acetábulos, com o ramo do
// púbis indo para a frente e o ísquio para trás. Entre a bexiga e o reto fica um espaço
// vazio de propósito: os órgãos dali variam com o sexo e o esquema não os mostra. Músculos e
// vasos femorais não desenhados.
const organ = `fill="${P.fill}" stroke="${P.line}" stroke-width="2.5" stroke-linejoin="round"`;
const bone = `fill="${P.muted}" fill-opacity="0.5" stroke="${P.line}" stroke-width="2.5" stroke-linejoin="round"`;
/** Espelha o desenho do lado de quem vê à direita para o outro lado. */
const mirror = (svg: string) => `${svg}\n<g transform="matrix(-1 0 0 1 320 0)">${svg}</g>`;

export const cortePelve: DiagramSpec = {
  id: 'corte-pelve',
  alt: 'Corte axial da pelve na altura dos quadris, visto de baixo, frente do corpo no alto e lado direito do paciente à esquerda de quem vê: ossos e órgãos.',
  width: 320,
  height: 240,
  layers: [
    {
      // Contorno do corpo.
      svg: `<ellipse cx="160" cy="122" rx="152" ry="100" fill="none" stroke="${P.muted}" stroke-width="3"/>`,
    },
    {
      // Púbis (corpo e ramo, até a frente do acetábulo) e ísquio (atrás do acetábulo).
      svg: mirror(`<path d="M163,36 L176,38 C200,44 226,62 244,86 L236,98 C218,78 196,62 176,56 L163,56 Z" ${bone}/>
<path d="M238,148 C234,166 222,180 208,186 L204,178 C214,172 222,160 228,146 Z" ${bone}/>`),
    },
    {
      // Acetábulos: a concha de osso do lado de dentro de cada cabeça do fêmur.
      svg: mirror(`<path d="M245.9,99.1 A28,28 0 0 0 245.9,144.9 L239.1,154.8 A40,40 0 0 1 239.1,89.2 Z" ${bone}/>`),
    },
    {
      // Cabeças do fêmur, com o espaço da articulação em volta.
      svg: mirror(`<circle cx="262" cy="122" r="24" ${bone}/>`),
    },
    {
      // Bexiga na frente, na linha média, atrás da sínfise.
      svg: `<ellipse cx="160" cy="96" rx="40" ry="24" ${organ}/>`,
    },
    {
      // Reto atrás, na linha média, com a luz no centro.
      svg: `<circle cx="160" cy="160" r="15" ${organ}/>
<circle cx="160" cy="160" r="5" fill="none" stroke="${P.muted}" stroke-width="1.5"/>`,
    },
    {
      // Cóccix, atrás do reto.
      svg: `<path d="M152,204 C152,197 168,197 168,204 L165,215 C164,219 156,219 155,215 Z" ${bone}/>`,
    },
  ],
};
