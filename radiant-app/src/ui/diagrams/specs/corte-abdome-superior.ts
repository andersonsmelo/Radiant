import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Corte axial do abdome por volta de T12-L1, na convenção da
// tomografia: visto de baixo, frente do corpo no alto, lado direito do paciente à
// esquerda de quem vê. Fígado grande à direita do paciente, com o lobo esquerdo passando
// da linha média na frente; estômago na frente à esquerda do paciente e baço atrás dele;
// pâncreas em faixa transversal na frente dos vasos; rins ao lado da coluna, atrás; aorta
// na frente do corpo vertebral, um pouco à esquerda do paciente, e a cava à direita dela,
// junto ao fígado. Músculos das costas como massa neutra; alças e cólon não desenhados.
const organ = `fill="${P.fill}" stroke="${P.line}" stroke-width="2.5" stroke-linejoin="round"`;
const bone = `fill="${P.muted}" fill-opacity="0.5" stroke="${P.line}" stroke-width="2.5" stroke-linejoin="round"`;

export const corteAbdomeSuperior: DiagramSpec = {
  id: 'corte-abdome-superior',
  alt: 'Corte axial do abdome superior visto de baixo, frente do corpo no alto e lado direito do paciente à esquerda de quem vê: vísceras, vasos e vértebra.',
  width: 320,
  height: 240,
  layers: [
    {
      // Contorno do abdome.
      svg: `<ellipse cx="160" cy="122" rx="146" ry="106" fill="none" stroke="${P.muted}" stroke-width="3"/>`,
    },
    {
      // Músculos das costas, dos dois lados do processo espinhoso: massa neutra.
      svg: `<ellipse cx="128" cy="206" rx="26" ry="13" fill="${P.fill}" fill-opacity="0.5" stroke="${P.muted}" stroke-width="1.5" stroke-opacity="0.6"/>
<ellipse cx="192" cy="206" rx="26" ry="13" fill="${P.fill}" fill-opacity="0.5" stroke="${P.muted}" stroke-width="1.5" stroke-opacity="0.6"/>`,
    },
    {
      // Fígado: lobo direito grande; o lobo esquerdo cruza a linha média na frente.
      svg: `<path d="M24,120 C24,66 62,30 110,26 C134,24 156,22 170,26 C180,30 178,42 166,50 C150,62 142,82 138,100 C136,114 132,126 128,132 C126,140 122,146 112,148 C96,150 84,158 80,172 C78,184 76,192 70,196 C50,186 24,160 24,120 Z" ${organ}/>`,
    },
    {
      // Estômago na frente, à esquerda do paciente; baço atrás, contra a parede.
      svg: `<path d="M184,36 C214,24 250,40 262,66 C270,86 258,104 236,106 C214,108 196,100 188,84 C180,68 176,48 184,36 Z" ${organ}/>
<path d="M278,104 C292,122 294,156 278,180 C266,190 254,186 254,176 C264,160 266,134 258,118 C254,108 266,98 278,104 Z" ${organ}/>`,
    },
    {
      // Pâncreas: faixa transversal da cabeça, junto à cava, até a cauda, perto do baço.
      svg: `<path d="M150,124 C150,116 172,114 196,116 C220,118 240,112 252,116 C258,120 254,128 246,130 C224,132 206,130 190,132 C170,134 150,134 150,124 Z" ${organ}/>`,
    },
    {
      // Rins ao lado da coluna, atrás, com o eixo longo para fora e para a frente.
      svg: `<ellipse cx="106" cy="174" rx="15" ry="22" transform="rotate(-35 106 174)" ${organ}/>
<ellipse cx="214" cy="172" rx="15" ry="22" transform="rotate(35 214 172)" ${organ}/>`,
    },
    {
      // Aorta (cheia) na frente da vértebra, um pouco à esquerda do paciente; cava à direita dela.
      svg: `<circle cx="172" cy="146" r="9" fill="${P.accent}" stroke="${P.line}" stroke-width="2"/>
<ellipse cx="140" cy="140" rx="10" ry="8" fill="${P.accent}" fill-opacity="0.45" stroke="${P.accent}" stroke-width="2"/>`,
    },
    {
      // Vértebra: corpo, arco com o canal, processos transversos e espinhoso.
      svg: `<circle cx="160" cy="176" r="19" ${bone}/>
<path d="M144,190 L126,194 L126,200 L144,200 Z M176,190 L194,194 L194,200 L176,200 Z" ${bone}/>
<path d="M144,188 L176,188 L178,206 C178,216 170,219 160,219 C150,219 142,216 142,206 Z" ${bone}/>
<path d="M155,217 L165,217 L162,225 L158,225 Z" ${bone}/>
<circle cx="160" cy="204" r="7" fill="${P.bg}" stroke="${P.line}" stroke-width="2"/>`,
    },
  ],
};
