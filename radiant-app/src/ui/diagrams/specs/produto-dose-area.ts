import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. De cima para baixo: o cabeçote do tubo (largo, com o ponto focal), o
// colimador, a câmara de medição (placa fina e larga logo na saída) e, no fim do feixe, o
// paciente deitado na mesa, visto de lado. Dois campos saem do mesmo ponto focal (160,30): um
// estreito (traço forte) e um largo (traço fraco, tracejado). Na câmara, o campo largo cobre um
// trecho maior da placa. A figura não tem texto; o conteúdo rotula.
const FX = 160;
const FY = 30;
const PT = 184; // topo do paciente
const CH = 74; // câmara
/** Meia-largura de um campo de meia-largura `h` no paciente, na altura `y`. */
const half = (h: number, y: number) => Math.round(((h * (y - FY)) / (PT - FY)) * 10) / 10;

const field = (h: number, fillOp: number, strokeOp: number, dash: string) => {
  const e = half(h, 58);
  return `<polygon points="${FX - e},58 ${FX + e},58 ${FX + h},${PT} ${FX - h},${PT}" fill="${P.beam}" fill-opacity="${fillOp}" stroke="${P.beam}" stroke-opacity="${strokeOp}" stroke-width="2.5" stroke-linejoin="round"${dash}/>`;
};

export const produtoDoseArea: DiagramSpec = {
  id: 'produto-dose-area',
  alt: 'Tubo com colimador e uma placa fina na saída; dois feixes do mesmo foco, um estreito e um largo, chegam ao paciente deitado; o largo cobre mais da placa.',
  width: 320,
  height: 240,
  layers: [
    {
      // Mesa e paciente deitado (cabeça à esquerda), visto de lado.
      svg: `<rect x="30" y="208" width="260" height="10" rx="3" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="62" y="184" width="200" height="22" rx="10" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>
<circle cx="50" cy="196" r="12" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>`,
    },
    {
      // Campo largo: contorno fraco e tracejado, chega mais longe nos dois lados.
      svg: field(70, 0.1, 0.55, ' stroke-dasharray="6 5"'),
    },
    {
      // Campo estreito: contorno forte.
      svg: field(24, 0.28, 1, ''),
    },
    {
      // Marcas dos campos sobre o paciente: faixa larga fraca, faixa estreita forte.
      svg: `<line x1="${FX - 70}" y1="${PT}" x2="${FX + 70}" y2="${PT}" stroke="${P.beam}" stroke-opacity="0.55" stroke-width="4" stroke-linecap="round"/>
<line x1="${FX - 24}" y1="${PT}" x2="${FX + 24}" y2="${PT}" stroke="${P.beam}" stroke-width="5" stroke-linecap="round"/>`,
    },
    {
      // Cabeçote do tubo, largo, com o ponto focal.
      svg: `<rect x="84" y="12" width="152" height="30" rx="8" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<circle cx="${FX}" cy="${FY}" r="3.5" fill="${P.beam}"/>`,
    },
    {
      // Colimador: caixa de lâminas logo abaixo do cabeçote, com a abertura no meio.
      svg: `<polygon points="124,44 196,44 192,62 128,62" fill="${P.fill}" stroke="${P.muted}" stroke-width="3" stroke-linejoin="round"/>
<line x1="${FX - 8}" y1="53" x2="${FX + 8}" y2="53" stroke="${P.bg}" stroke-width="5"/>`,
    },
    {
      // Câmara de medição: placa fina e larga; os dois campos marcam seu trecho na placa.
      svg: `<rect x="120" y="${CH - 3}" width="84" height="6" rx="2" fill="${P.accent}" fill-opacity="0.35" stroke="${P.accent}" stroke-width="3"/>
<line x1="${FX - half(70, CH)}" y1="${CH}" x2="${FX + half(70, CH)}" y2="${CH}" stroke="${P.beam}" stroke-opacity="0.55" stroke-width="3"/>
<line x1="${FX - half(24, CH)}" y1="${CH}" x2="${FX + half(24, CH)}" y2="${CH}" stroke="${P.beam}" stroke-width="4"/>`,
    },
  ],
};
