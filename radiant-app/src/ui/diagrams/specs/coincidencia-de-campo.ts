import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Gramática de gráficos (fase 3). Quadro 320x240, sem texto, vista de cima do receptor (escuro, dentro do painel).
// Campo de luz 140x90 em (74,76): contorno âmbar e tinta tênue, com um L metálico em cada canto e uma cruz no centro.
// Campo de radiação do mesmo tamanho, deslocado 52 para a direita (e só para a direita, "de lado"): azul, por cima.
// Cinco zonas que a aula cobra, distinguíveis só por cor e posição: luz sem radiação (a faixa amarelada à esquerda, a
// única), luz com radiação (centro azul), radiação sem luz (faixa azul à direita) e o receptor escuro fora dos dois
// campos (alto à direita, embaixo à esquerda). O deslocamento é maior que o do desenho antigo (32 x 14) para que cada
// faixa passe de 44 pt de largura em 280 pt de figura: só assim a região é a caixa justa da faixa e a área de toque de
// 44 pt de uma faixa não pisa na do vizinho. Sem deslocamento vertical, a faixa só de luz é uma só (no desenho antigo
// havia também uma tira só de luz no alto, que não era alvo e podia ser tocada como se fosse). Figura com área de
// toque: parada. Regiões (m32) em aulas.md.
const LX = 64;
const LY = 76;
const W = 140;
const H = 90;
const RX = LX + 52;
const RY = LY;
const cornerL = (x: number, y: number, sx: 1 | -1, sy: 1 | -1) => `M${x} ${y + 20 * sy}V${y}H${x + 20 * sx}`;

export const coincidenciaDeCampo: DiagramSpec = {
  id: 'coincidencia-de-campo',
  alt: 'Vista de cima de um receptor: um retângulo de luz com marcadores nos cantos e no centro e um retângulo de radiação igual, deslocado de lado.',
  width: 320,
  height: 240,
  layers: [
    {
      // Painel e receptor (escuro, com borda cinza).
      svg: `<rect x="8" y="8" width="304" height="224" rx="16" fill="${P.fill}"/>
<rect x="40" y="28" width="240" height="184" rx="8" fill="${P.bg}" stroke="${P.muted}" stroke-width="3"/>`,
    },
    {
      // Campo de luz: tinta tênue âmbar.
      svg: `<rect x="${LX}" y="${LY}" width="${W}" height="${H}" fill="${P.beam}" fill-opacity="0.28"/>`,
    },
    {
      // Campo de radiação: azul, deslocado.
      svg: `<rect x="${RX}" y="${RY}" width="${W}" height="${H}" fill="${P.accent}" fill-opacity="0.45" stroke="${P.accent}" stroke-width="2.5"/>`,
    },
    {
      // Contorno do campo de luz.
      svg: `<rect x="${LX}" y="${LY}" width="${W}" height="${H}" fill="none" stroke="${P.beam}" stroke-width="3"/>`,
    },
    {
      // Marcadores metálicos: um L em cada canto do campo de luz e uma cruz no centro.
      svg: `<path d="${cornerL(LX, LY, 1, 1)}${cornerL(LX + W, LY, -1, 1)}${cornerL(LX, LY + H, 1, -1)}${cornerL(LX + W, LY + H, -1, -1)}" fill="none" stroke="${P.line}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M${LX + W / 2 - 8} ${LY + H / 2}H${LX + W / 2 + 8}M${LX + W / 2} ${LY + H / 2 - 8}V${LY + H / 2 + 8}" fill="none" stroke="${P.line}" stroke-width="3" stroke-linecap="round"/>`,
    },
  ],
};
