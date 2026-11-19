import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. A mesma criança duas vezes, deitada e vista de cima, cabeça para o alto,
// sobre a mesa. À esquerda o campo de luz cobre o corpo todo, da cabeça aos pés; à direita ele
// está ajustado ao tórax nos quatro lados (margem pequena além dos ombros), com a cabeça, o abdome
// e a pelve fora dele. Sem texto e sem marca de certo ou errado: o desenho só mostra o campo.
const child = (cx: number) => `<circle cx="${cx}" cy="48" r="12" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="${cx - 20}" y="62" width="40" height="76" rx="12" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="${cx - 17}" y="138" width="34" height="26" rx="10" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="${cx - 15}" y="164" width="12" height="52" rx="6" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="${cx + 3}" y="164" width="12" height="52" rx="6" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<path d="M${cx - 33} 70 V128 M${cx + 33} 70 V128" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>`;

export const colimacaoPediatrica: DiagramSpec = {
  id: 'colimacao-pediatrica',
  alt: 'Duas vezes a mesma criança deitada, vista de cima, cada uma com um retângulo de luz do colimador: um cobre o corpo todo e o outro só o tórax.',
  width: 320,
  height: 240,
  layers: [
    {
      // Contorno da mesa.
      svg: `<rect x="8" y="14" width="304" height="216" rx="10" fill="none" stroke="${P.muted}" stroke-width="2.5" stroke-dasharray="2 6" stroke-linecap="round"/>`,
    },
    { svg: child(80) },
    { svg: child(235) },
    {
      // Campo aberto: cabeça aos pés.
      svg: `<rect x="23" y="30" width="114" height="192" rx="3" fill="${P.beam}" fill-opacity="0.14" stroke="${P.beam}" stroke-width="2.5" stroke-linejoin="round"/>`,
    },
    {
      // Campo ajustado ao tórax, com margem pequena dos lados.
      svg: `<rect x="206" y="63" width="58" height="42" rx="3" fill="${P.beam}" fill-opacity="0.22" stroke="${P.beam}" stroke-width="2.5" stroke-linejoin="round"/>`,
    },
  ],
};
