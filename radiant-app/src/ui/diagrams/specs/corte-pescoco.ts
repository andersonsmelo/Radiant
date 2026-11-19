import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Corte axial do pescoço na altura da tireoide (cerca de C6-C7),
// na convenção da tomografia: visto de baixo, frente do corpo no alto, lado direito do
// paciente à esquerda de quem vê; cerca de 20 unidades por cm. Traqueia (2 cm, com ar) na
// linha média, com a parede de trás reta; tireoide em ferradura, istmo na frente e lobos dos
// lados; esôfago achatado logo atrás da traqueia, um pouco à esquerda do paciente; de cada
// lado a carótida (cheia, mais medial) e a jugular interna (maior, mais lateral); vértebra
// cervical com a medula no canal e o forame transverso. Músculos só como massa neutra.
const organ = `fill="${P.fill}" stroke="${P.line}" stroke-width="2.5" stroke-linejoin="round"`;
const bone = `fill="${P.muted}" fill-opacity="0.5" stroke="${P.line}" stroke-width="2.5" stroke-linejoin="round"`;
const muscle = `fill="${P.fill}" fill-opacity="0.5" stroke="${P.muted}" stroke-width="1.5" stroke-opacity="0.6"`;
/** Espelha o desenho do lado de quem vê à esquerda para o outro lado. */
const mirror = (svg: string) => `${svg}\n<g transform="matrix(-1 0 0 1 320 0)">${svg}</g>`;

export const cortePescoco: DiagramSpec = {
  id: 'corte-pescoco',
  alt: 'Corte axial do pescoço na altura da tireoide, visto de baixo, frente do corpo no alto e lado direito do paciente à esquerda de quem vê: vias, vasos e vértebra.',
  width: 320,
  height: 240,
  layers: [
    {
      // Contorno do pescoço; músculos (esternocleidomastóideos e os de trás) como massa neutra.
      svg: `<ellipse cx="160" cy="118" rx="128" ry="106" fill="none" stroke="${P.muted}" stroke-width="3"/>
${mirror(`<ellipse cx="62" cy="92" rx="24" ry="9" transform="rotate(-35 62 92)" ${muscle}/>
<ellipse cx="124" cy="194" rx="30" ry="18" ${muscle}/>`)}`,
    },
    {
      // Tireoide em ferradura: istmo na frente da traqueia, lobos dos lados.
      svg: mirror(`<path d="M160,36 C140,36 118,42 108,54 C100,64 98,80 102,92 C106,100 118,104 128,100 C138,96 141,88 141,78 C140,66 140,54 148,47 C152,43 156,40 160,40 Z" ${organ}/>`),
    },
    {
      // Traqueia com ar (escura), parede de trás reta.
      svg: `<path d="M148,78 A20,20 0 1 1 172,78 Z" fill="${P.bg}" stroke="${P.line}" stroke-width="3" stroke-linejoin="round"/>`,
    },
    {
      // Esôfago achatado atrás da traqueia, um pouco à esquerda do paciente.
      svg: `<ellipse cx="166" cy="92" rx="15" ry="12" ${organ}/>
<path d="M158,92 L174,92" fill="none" stroke="${P.muted}" stroke-width="1.5" stroke-linecap="round"/>`,
    },
    {
      // Carótida (cheia, medial) e jugular interna (maior, lateral) de cada lado.
      svg: mirror(`<circle cx="94" cy="116" r="8" fill="${P.accent}" stroke="${P.line}" stroke-width="2"/>
<ellipse cx="68" cy="122" rx="13" ry="10" fill="${P.accent}" fill-opacity="0.45" stroke="${P.accent}" stroke-width="2"/>`),
    },
    {
      // Vértebra cervical: corpo, arco com processo transverso e forame, processo espinhoso.
      svg: `<ellipse cx="160" cy="124" rx="24" ry="14" ${bone}/>
${mirror(`<path d="M140,130 L112,128 C106,128 104,134 108,138 L132,144 Z" ${bone}/>
<circle cx="122" cy="134" r="3.5" fill="${P.bg}" stroke="${P.line}" stroke-width="1.5"/>
<path d="M146,136 L138,138 L128,146 L126,158 L132,166 L150,176 L160,180 L160,170 L150,166 L142,158 L140,148 L148,140 Z" ${bone}/>`)}
<path d="M154,178 L166,178 L164,198 C162,202 158,202 156,198 Z" ${bone}/>`,
    },
    {
      // Medula espinhal no canal.
      svg: `<ellipse cx="160" cy="153" rx="11" ry="7" fill="${P.fill}" stroke="${P.line}" stroke-width="2"/>`,
    },
  ],
};
