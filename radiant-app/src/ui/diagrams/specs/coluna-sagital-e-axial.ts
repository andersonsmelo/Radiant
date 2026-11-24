import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado, duas vistas. À esquerda, a coluna lombar em corte sagital mediano,
// frente do corpo para a esquerda: cinco corpos vertebrais (L1 a L5, mais o alto do sacro)
// em lordose, discos entre eles, o canal atrás com a medula terminando em cone na altura de
// L1-L2 e as raízes descendo abaixo, e os processos espinhosos atrás. À direita, o corte
// axial no disco L4-L5, frente no alto, ampliado cerca de 1,4 vez: disco (núcleo e anel em
// tons diferentes), canal atrás, articulações facetárias, lâminas e processo espinhoso. A
// linha tracejada na vista sagital marca a altura do corte axial.
const bone = `fill="${P.muted}" fill-opacity="0.5" stroke="${P.line}" stroke-width="2.5" stroke-linejoin="round"`;
const annulus = `fill="${P.fill}" stroke="${P.line}" stroke-width="2" stroke-linejoin="round"`;
const nucleus = `fill="${P.accent}" fill-opacity="0.4" stroke="${P.accent}" stroke-width="1.5"`;
const canal = `fill="${P.accent}" fill-opacity="0.18" stroke="${P.muted}" stroke-width="1.5" stroke-linejoin="round"`;
/** Espelha o desenho do lado de quem vê à esquerda para o outro lado da vista axial. */
const mirror = (svg: string) => `${svg}\n<g transform="matrix(-1 0 0 1 500 0)">${svg}</g>`;

/** Topo e borda da frente de cada corpo (L1 a L5 e S1); a lordose leva os do meio para a frente. */
const LEVELS = [
  { top: 12, ant: 40 },
  { top: 54, ant: 34 },
  { top: 96, ant: 30 },
  { top: 138, ant: 30 },
  { top: 180, ant: 36 },
  { top: 222, ant: 42 },
];
const H = 30; // altura do corpo
const W = 44; // profundidade do corpo, da frente para trás
const C = 22; // profundidade do canal
const lumbar = LEVELS.slice(0, 5);
const back = LEVELS.flatMap(({ top, ant }) => [`${ant + W},${top}`, `${ant + W},${top + H}`]);
const backRev = LEVELS.flatMap(({ top, ant }) => [`${ant + W + C},${top}`, `${ant + W + C},${top + H}`]).reverse();

export const colunaSagitalEAxial: DiagramSpec = {
  id: 'coluna-sagital-e-axial',
  alt: 'Coluna lombar em duas vistas: corte sagital com a frente do corpo à esquerda e, ao lado, corte axial com a frente no alto, na altura da linha tracejada.',
  width: 320,
  height: 240,
  layers: [
    {
      // Corpos vertebrais (o de baixo é o alto do sacro, cortado pela borda).
      svg: LEVELS.map(({ top, ant }) => `<rect x="${ant}" y="${top}" width="${W}" height="${H}" rx="4" ${bone}/>`).join('\n'),
    },
    {
      // Discos entre os corpos, com o núcleo no meio.
      svg: LEVELS.slice(0, 5)
        .map(({ top, ant }, i) => {
          const next = LEVELS[i + 1];
          const y0 = top + H;
          const y1 = next.top;
          const mid = (ant + next.ant) / 2;
          return `<path d="M${ant},${y0} L${ant + W},${y0} L${next.ant + W},${y1} L${next.ant},${y1} C${mid - 3},${y1 - 2} ${mid - 3},${y0 + 2} ${ant},${y0} Z" ${annulus}/>
<ellipse cx="${mid + W / 2}" cy="${(y0 + y1) / 2}" rx="9" ry="3" ${nucleus}/>`;
        })
        .join('\n'),
    },
    {
      // Canal vertebral atrás dos corpos; a medula termina em cone no alto e as raízes descem.
      svg: `<polygon points="84,0 ${back.join(' ')} ${backRev.join(' ')} 106,0" ${canal}/>
<path d="M89,-2 L101,-2 L101,30 C101,40 97,48 95,54 C93,48 89,40 89,30 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="2" stroke-linejoin="round"/>
<path d="M93,52 C88,80 82,110 83,140 C84,170 88,200 95,240 M95,54 C91,80 86,110 87,140 C88,170 92,200 99,240 M97,52 C94,80 90,110 91,140 C92,170 96,200 103,240" fill="none" stroke="${P.muted}" stroke-width="1.5" stroke-linecap="round"/>`,
    },
    {
      // Processos espinhosos, atrás do canal.
      svg: lumbar
        .map(({ top, ant }) => {
          const x = ant + W + C;
          return `<path d="M${x},${top + 2} L${x + 36},${top + 10} C${x + 41},${top + 12} ${x + 41},${top + 22} ${x + 36},${top + 24} L${x},${top + 30} Z" ${bone}/>`;
        })
        .join('\n'),
    },
    {
      // Linha tracejada na altura do disco L4-L5 e divisória entre as vistas.
      svg: `<path d="M16,174 L158,174" fill="none" stroke="${P.beam}" stroke-width="2.5" stroke-dasharray="6 4" stroke-linecap="round"/>
<path d="M172,16 L172,224" fill="none" stroke="${P.muted}" stroke-width="1.5" stroke-opacity="0.5"/>`,
    },
    {
      // Vista axial: articulações facetárias (com a fenda), lâminas e processo espinhoso.
      svg: `${mirror(`<path d="M214,100 C222,94 232,98 236,108 C238,118 234,128 226,130 C216,130 210,120 210,110 C210,105 212,102 214,100 Z" ${bone}/>
<path d="M231,101 C227,110 221,118 214,125" fill="none" stroke="${P.bg}" stroke-width="2" stroke-linecap="round"/>
<path d="M228,124 L250,140 L250,150 L234,140 L222,130 Z" ${bone}/>`)}
<path d="M243,142 L257,142 L254,204 C253,208 247,208 246,204 Z" ${bone}/>`,
    },
    {
      // Vista axial: disco em forma de rim, anel por fora e núcleo no centro.
      svg: `<path d="M208,64 C208,40 228,32 250,32 C272,32 292,40 292,64 C292,84 282,94 270,94 C262,94 258,90 250,90 C242,90 238,94 230,94 C218,94 208,84 208,64 Z" ${annulus}/>
<ellipse cx="250" cy="62" rx="18" ry="13" ${nucleus}/>`,
    },
    {
      // Vista axial: canal vertebral atrás do disco.
      svg: `<path d="M230,94 C238,94 242,90 250,90 C258,90 262,94 270,94 L264,114 C259,126 254,134 250,136 C246,134 241,126 236,114 Z" ${canal}/>`,
    },
  ],
};
