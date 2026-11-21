import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Gramática de gráficos (fase 3). Quadro 320x240, sem texto. Doze barras crescentes (o valor típico de cada sala para
// o mesmo exame, ordenadas) e uma linha de referência tracejada: nove barras azuis ficam abaixo dela e três âmbar a
// passam. O eixo vertical mede o valor típico e o horizontal enfileira as salas; nenhum dos dois leva escala (a
// figura diz a forma da relação, o eixo é nomeado no corpo do conceito). São doze marcas porque cada barra é uma sala
// e a aula conta nove e três: é o dado, não enfeite. Barras com cantos de cima suaves, sobre o eixo; a linha de
// referência vai por cima, em P.line (a mesma cor do ponto único de um gráfico).
// Alvos da aula (m32.04), na ponta de cada barra para o selo cair no vazio de cima: linha em (100, 90); barra mais alta, âmbar, em (275, 42); quinta barra, azul, em (135, 150);
// menor barra em (53, 186).
const BASE = 204;
const X0 = 48;
const STEP = 20;
const HEIGHTS = [22, 30, 38, 46, 56, 66, 78, 90, 102, 126, 146, 166];
const REF = 90; // y da linha de referência
const bar = (h: number, i: number, color: string) =>
  `<rect x="${X0 + STEP * i}" y="${BASE - h}" width="14" height="${h}" rx="2" fill="${color}"/>`;

export const nivelDeReferencia: DiagramSpec = {
  id: 'nivel-de-referencia',
  alt: 'Gráfico de doze barras crescentes e uma linha horizontal tracejada: as três barras mais altas passam da linha e têm cor de destaque.',
  width: 320,
  height: 240,
  layers: [
    { svg: `<rect x="8" y="8" width="304" height="224" rx="16" fill="${P.fill}"/>` },
    {
      // Nove barras abaixo da referência.
      svg: HEIGHTS.slice(0, 9).map((h, i) => bar(h, i, P.accent)).join(''),
    },
    {
      // Três barras acima da referência, em destaque.
      svg: HEIGHTS.slice(9).map((h, i) => bar(h, i + 9, P.beam)).join(''),
    },
    {
      // Eixos, com seta cheia no fim de cada um.
      svg: `<path d="M32 ${BASE}H292M32 ${BASE}V41" fill="none" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round"/>
<polygon points="304,${BASE} 292,${BASE - 5.5} 292,${BASE + 5.5}" fill="${P.muted}"/>
<polygon points="32,28 26.5,41 37.5,41" fill="${P.muted}"/>`,
    },
    {
      // Linha de referência, por cima das barras.
      svg: `<line x1="32" y1="${REF}" x2="296" y2="${REF}" stroke="${P.line}" stroke-width="2.5" stroke-dasharray="6 5" stroke-linecap="round"/>`,
    },
  ],
};
