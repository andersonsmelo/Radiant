import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Sala de exame vista de frente, da esquerda para a direita: a porta com a maçaneta, o
// receptor vertical com a barra de apoio, a mesa de exame, o tubo no trilho do teto com a manopla lateral e o
// comando com o teclado. Sem texto: a aula diz quais superfícies são tocadas.
export const pontosDeContatoDaSala: DiagramSpec = {
  id: 'pontos-de-contato-da-sala',
  alt: 'Sala de exame de frente: porta com maçaneta, receptor vertical com barra de apoio, mesa de exame, tubo de raios X no teto e a mesa do comando com teclado.',
  width: 320,
  height: 240,
  layers: [
    {
      // Piso e trilho do teto.
      svg: `<line x1="8" y1="214" x2="312" y2="214" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>
<line x1="150" y1="14" x2="250" y2="14" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      // Porta fechada: batente, folha e maçaneta de alavanca.
      svg: `<rect x="10" y="84" width="42" height="130" fill="none" stroke="${P.muted}" stroke-width="3" stroke-linejoin="round"/>
<rect x="15" y="89" width="32" height="125" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<circle cx="40" cy="152" r="5" fill="${P.fill}" stroke="${P.line}" stroke-width="2.5"/>
<line x1="34" y1="152" x2="24" y2="152" stroke="${P.line}" stroke-width="4" stroke-linecap="round"/>`,
    },
    {
      // Receptor vertical: coluna, placa do receptor e barra de apoio para as mãos e o queixo.
      svg: `<rect x="78" y="52" width="14" height="152" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>
<rect x="92" y="62" width="20" height="124" rx="3" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<rect x="112" y="98" width="24" height="8" rx="3" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<path d="M136 98 V90" stroke="${P.line}" stroke-width="3" stroke-linecap="round"/>
<rect x="74" y="204" width="52" height="10" rx="2" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>`,
    },
    {
      // Mesa de exame: tampo, pedestal e base.
      svg: `<rect x="146" y="164" width="90" height="10" rx="3" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="180" y="174" width="22" height="32" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>
<rect x="164" y="206" width="54" height="8" rx="2" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>`,
    },
    {
      // Tubo pendurado no trilho: carro, cabeçote, colimador e a manopla lateral.
      svg: `<line x1="191" y1="14" x2="191" y2="26" stroke="${P.muted}" stroke-width="3"/>
<rect x="170" y="26" width="42" height="26" rx="6" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<polygon points="177,52 205,52 209,64 173,64" fill="${P.fill}" stroke="${P.muted}" stroke-width="3" stroke-linejoin="round"/>
<rect x="214" y="32" width="12" height="12" rx="3" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>`,
    },
    {
      // Mesa do comando com monitor e teclado.
      svg: `<rect x="270" y="120" width="36" height="32" rx="3" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<line x1="288" y1="152" x2="288" y2="162" stroke="${P.muted}" stroke-width="3"/>
<rect x="264" y="162" width="36" height="9" rx="2" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<path d="M270 166.5 H294" stroke="${P.muted}" stroke-width="2" stroke-dasharray="3 3" stroke-linecap="round"/>
<rect x="256" y="171" width="58" height="6" rx="2" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>
<path d="M262 177 V214 M308 177 V214" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>`,
    },
  ],
};
