import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240. Linha do tempo da vida de um equipamento: aceitação (grande,
// amarelo), constância (pequenos, azul), manutenção (chave) e teste depois do
// conserto (médio, ciano).
export const cicloDeTestes: DiagramSpec = {
  id: 'ciclo-de-testes',
  alt: 'Linha do tempo de um equipamento: um marco grande no início, marcos pequenos e regulares, uma chave de boca e, logo depois, um marco médio.',
  width: 320,
  height: 240,
  layers: [
    {
      // Eixo do tempo, com seta, e a haste da chave até a linha.
      svg: `<line x1="16" y1="130" x2="300" y2="130" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>
<polygon points="310,130 298,123 298,137" fill="${P.muted}"/>
<line x1="222" y1="86" x2="222" y2="124" stroke="${P.muted}" stroke-width="2" stroke-dasharray="3 5"/>`,
    },
    {
      // Testes de constância: pequenos e regulares.
      svg: `<circle cx="104" cy="130" r="6" fill="${P.accent}" stroke="${P.line}" stroke-width="2"/>
<circle cx="146" cy="130" r="6" fill="${P.accent}" stroke="${P.line}" stroke-width="2"/>
<circle cx="188" cy="130" r="6" fill="${P.accent}" stroke="${P.line}" stroke-width="2"/>`,
    },
    {
      // Teste de aceitação: marco grande.
      svg: `<circle cx="48" cy="130" r="20" fill="${P.beam}" fill-opacity="0.35" stroke="${P.beam}" stroke-width="3"/>
<polyline points="39,130 46,138 58,122" fill="none" stroke="${P.line}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
    },
    {
      // Equipamento novo: cabeçote com feixe e brilho.
      svg: `<rect x="34" y="46" width="30" height="16" rx="4" fill="${P.fill}" stroke="${P.line}" stroke-width="2"/>
<polygon points="42,66 56,66 62,82 36,82" fill="${P.beam}" fill-opacity="0.3" stroke="${P.beam}" stroke-width="2" stroke-linejoin="round"/>
<path d="M74 44 v10 M69 49 h10" stroke="${P.beam}" stroke-width="2" stroke-linecap="round"/>`,
    },
    {
      // Manutenção: chave de boca.
      svg: `<g transform="translate(222 66) rotate(45)"><rect x="-4" y="-8" width="8" height="32" rx="4" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/><circle cx="0" cy="-14" r="10" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/><rect x="-4" y="-28" width="8" height="14" fill="${P.bg}"/></g>`,
    },
    {
      // Teste depois do conserto: marco médio.
      svg: `<circle cx="262" cy="130" r="12" fill="${P.electron}" fill-opacity="0.3" stroke="${P.electron}" stroke-width="3"/>`,
    },
  ],
};
