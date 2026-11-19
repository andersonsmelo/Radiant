import { P } from '../diagramPalette';
import type { DiagramLayer, DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Esquema (não imagem real) de uma radiografia de tórax em PA, lida de
// frente: o lado direito do paciente fica à esquerda de quem vê. O filme ocupa x 44..276,
// y 6..234. Ar escuro, partes moles em cinza, osso e mediastino claros. A cúpula direita do
// diafragma (à esquerda de quem vê) é mais alta; o coração pende para a esquerda do paciente.
// `artefatos-de-objeto` e `artefatos-do-detector` reusam esta mesma base, para comparar.
const rib = (y: number) =>
  `<path d="M152 ${y} C122 ${y - 14} 88 ${y - 8} 66 ${y + 22} M168 ${y} C198 ${y - 14} 232 ${y - 8} 254 ${y + 22}"/>`;

export const radiografiaBase: DiagramLayer[] = [
  {
    // Filme (exposto, escuro) e as partes moles do pescoço, dos ombros, das paredes e do abdome.
    svg: `<rect x="44" y="6" width="232" height="228" fill="${P.bg}" stroke="${P.muted}" stroke-width="2"/>
<path d="M138 6 H182 C184 22 196 28 230 32 C258 36 268 50 268 70 L266 234 H54 L52 70 C52 50 62 36 90 32 C124 28 136 22 138 6 Z" fill="${P.muted}" fill-opacity="0.3"/>`,
  },
  {
    // Campos pulmonares, escuros; as bases seguem as cúpulas (a direita mais alta).
    svg: `<path d="M146 34 C120 34 96 50 84 78 C74 104 70 150 68 182 Q106 138 146 172 Z" fill="${P.bg}"/>
<path d="M174 34 C200 34 224 50 236 78 C246 104 250 150 252 192 Q214 150 174 182 Z" fill="${P.bg}"/>`,
  },
  {
    // Coluna com os espaços dos discos, mediastino com o botão aórtico e a silhueta do coração.
    svg: `<rect x="153" y="6" width="14" height="228" fill="${P.line}" fill-opacity="0.35"/>
<path d="M153 30 H167 M153 46 H167 M153 62 H167 M153 78 H167 M153 94 H167 M153 110 H167 M153 126 H167 M153 142 H167 M153 158 H167 M153 174 H167 M153 190 H167 M153 206 H167 M153 222 H167" stroke="${P.bg}" stroke-width="2" stroke-opacity="0.7"/>
<path d="M146 22 H174 L176 84 C188 86 190 100 180 106 C202 114 216 136 218 160 C220 182 204 194 180 194 H152 C146 182 142 160 144 136 C144 122 146 112 146 104 Z" fill="${P.line}" fill-opacity="0.45"/>`,
  },
  {
    // Costelas posteriores em arco, clavículas e o contorno das cúpulas.
    svg: `<g fill="none" stroke="${P.line}" stroke-width="2" stroke-opacity="0.55" stroke-linecap="round">${[44, 66, 88, 110, 132, 154].map(rib).join('')}</g>
<path d="M150 50 C132 52 112 44 92 40 M170 50 C188 52 208 44 228 40" fill="none" stroke="${P.line}" stroke-width="4" stroke-linecap="round"/>
<path d="M68 182 Q106 138 146 172 M174 182 Q214 150 252 192" fill="none" stroke="${P.line}" stroke-width="2.5" stroke-opacity="0.7" stroke-linecap="round"/>`,
  },
];

export const radiografiaRoteiro: DiagramSpec = {
  id: 'radiografia-roteiro',
  alt: 'Esquema de radiografia de tórax em PA: pulmões escuros, coluna, coração, costelas e diafragma, com etiqueta, marcador de lado e margens claras no filme.',
  width: 320,
  height: 240,
  layers: [
    ...radiografiaBase,
    {
      // Colimação: margem sem exposição (clara) em volta da área exposta.
      svg: `<path d="M44 6 H276 V234 H44 Z M58 18 V222 H262 V18 Z" fill="${P.line}" fill-opacity="0.6" fill-rule="evenodd"/>`,
    },
    {
      // Etiqueta de identificação, sem texto, e o marcador de lado, denso, junto ao ombro.
      svg: `<rect x="224" y="16" width="44" height="26" rx="2" fill="${P.fill}" stroke="${P.line}" stroke-width="2"/>
<path d="M230 24 H262 M230 30 H256 M230 36 H260" stroke="${P.muted}" stroke-width="2" stroke-linecap="round"/>
<rect x="64" y="38" width="12" height="12" rx="2" fill="${P.line}"/>`,
    },
  ],
};
