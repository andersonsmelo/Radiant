import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Parede da sala de frente, da esquerda para a direita: a porta de saída com a barra de
// empurrar e a placa de seta, o carrinho de emergência com o desfibrilador em cima, a saída de oxigênio na parede,
// o botão de chamada com o cordão e o telefone de parede. Sem texto: a aula diz o que cada item é.
export const itensDeEmergenciaDaSala: DiagramSpec = {
  id: 'itens-de-emergencia-da-sala',
  alt: 'Parede de uma sala de exame: porta de saída com placa, carrinho de emergência com gavetas, saída de oxigênio, botão de chamada com cordão e telefone.',
  width: 320,
  height: 240,
  layers: [
    {
      // Piso.
      svg: `<line x1="8" y1="214" x2="312" y2="214" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      // Porta de saída: batente, folha, barra de empurrar e placa de seta acima.
      svg: `<rect x="12" y="66" width="52" height="148" fill="none" stroke="${P.muted}" stroke-width="3" stroke-linejoin="round"/>
<rect x="17" y="71" width="42" height="143" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="23" y="138" width="30" height="8" rx="3" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="22" y="36" width="32" height="22" rx="4" fill="none" stroke="${P.beam}" stroke-width="3"/>
<polygon points="28,47 38,47 38,42 49,47 38,52 38,47" fill="${P.beam}" stroke="${P.beam}" stroke-width="1.5" stroke-linejoin="round"/>`,
    },
    {
      // Carrinho de emergência: aparelho em cima, corpo com gavetas, cruz, puxador e rodas.
      svg: `<rect x="100" y="124" width="34" height="20" rx="4" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<path d="M106 134 H128" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round"/>
<rect x="84" y="144" width="72" height="8" rx="2" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="88" y="152" width="64" height="48" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<path d="M88 168 H152 M88 184 H152" stroke="${P.muted}" stroke-width="2.5"/>
<path d="M120 154 V166 M114 160 H126" stroke="${P.accent}" stroke-width="3" stroke-linecap="round"/>
<path d="M156 148 H164" stroke="${P.line}" stroke-width="3" stroke-linecap="round"/>
<circle cx="98" cy="206" r="6" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>
<circle cx="142" cy="206" r="6" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>`,
    },
    {
      // Saída de oxigênio na parede: placa e encaixe redondo.
      svg: `<rect x="172" y="130" width="32" height="34" rx="4" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>
<circle cx="188" cy="147" r="9" fill="none" stroke="${P.accent}" stroke-width="3"/>
<circle cx="188" cy="147" r="3" fill="${P.accent}"/>`,
    },
    {
      // Botão de chamada: placa, botão e cordão com argola.
      svg: `<rect x="232" y="80" width="28" height="30" rx="5" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>
<circle cx="246" cy="95" r="8" fill="${P.beam}" stroke="${P.beam}" stroke-width="2"/>
<path d="M246 110 V132" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round"/>
<circle cx="246" cy="137" r="5" fill="none" stroke="${P.accent}" stroke-width="3"/>`,
    },
    {
      // Telefone de parede: corpo, fone no topo e teclas.
      svg: `<rect x="274" y="150" width="32" height="38" rx="5" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="272" y="140" width="36" height="10" rx="4" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<g fill="${P.muted}"><circle cx="283" cy="161" r="1.5"/><circle cx="290" cy="161" r="1.5"/><circle cx="297" cy="161" r="1.5"/><circle cx="283" cy="169" r="1.5"/><circle cx="290" cy="169" r="1.5"/><circle cx="297" cy="169" r="1.5"/><circle cx="283" cy="177" r="1.5"/><circle cx="290" cy="177" r="1.5"/><circle cx="297" cy="177" r="1.5"/></g>`,
    },
  ],
};
