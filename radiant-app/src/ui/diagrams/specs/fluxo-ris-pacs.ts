import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Cinco blocos em serpentina, ligados por setas na ordem do fluxo: em cima,
// da esquerda para a direita, o balcão de cadastro (prancheta), a lista de trabalho (lista) e o
// equipamento de raios X (tubo, feixe e mesa); embaixo, da direita para a esquerda, o arquivo de
// imagens (cilindro de armazenamento) e a estação de visualização (monitor com imagem).
const block = (x: number, y: number) =>
  `<rect x="${x}" y="${y}" width="68" height="68" rx="8" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>`;
const head = (x: number, y: number, dir: 'r' | 'l' | 'd') => {
  const pts = { r: `${x - 6},${y - 5} ${x},${y} ${x - 6},${y + 5}`, l: `${x + 6},${y - 5} ${x},${y} ${x + 6},${y + 5}`, d: `${x - 5},${y - 6} ${x},${y} ${x + 5},${y - 6}` };
  return `<polyline points="${pts[dir]}" fill="none" stroke="${P.beam}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
};

export const fluxoRisPacs: DiagramSpec = {
  id: 'fluxo-ris-pacs',
  alt: 'Cinco blocos ligados por setas em serpentina: prancheta, lista, tubo de raios X com mesa, cilindro de armazenamento e monitor com imagem.',
  width: 320,
  height: 240,
  layers: [
    {
      // Setas 1→2, 2→3, 3→4 e 4→5.
      svg: `<path d="M90 62 H123 M196 62 H229 M266 98 V135 M230 172 H197" stroke="${P.beam}" stroke-width="3" stroke-linecap="round" fill="none"/>
${head(125, 62, 'r')}${head(231, 62, 'r')}${head(266, 137, 'd')}${head(195, 172, 'l')}`,
    },
    {
      svg: [block(20, 28), block(126, 28), block(232, 28), block(232, 138), block(126, 138)].join('\n'),
    },
    {
      // 1: prancheta com presilha e linhas. 2: lista com marcadores.
      svg: `<rect x="40" y="42" width="28" height="40" rx="3" fill="none" stroke="${P.line}" stroke-width="3"/>
<rect x="48" y="38" width="12" height="8" rx="2" fill="${P.line}"/>
<path d="M45 58 H63 M45 66 H63 M45 74 H57" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round"/>
<circle cx="144" cy="50" r="2.5" fill="${P.line}"/><circle cx="144" cy="62" r="2.5" fill="${P.line}"/><circle cx="144" cy="74" r="2.5" fill="${P.line}"/>
<path d="M152 50 H178 M152 62 H178 M152 74 H170" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      // 3: tubo, feixe e mesa.
      svg: `<rect x="252" y="38" width="28" height="14" rx="4" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<polygon points="258,54 274,54 284,78 248,78" fill="${P.beam}" fill-opacity="0.25" stroke="${P.beam}" stroke-width="2.5" stroke-linejoin="round"/>
<line x1="244" y1="82" x2="288" y2="82" stroke="${P.line}" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      // 4: cilindro de armazenamento. 5: monitor com imagem.
      svg: `<path d="M250 160 V188 C250 198 282 198 282 188 V160" fill="none" stroke="${P.accent}" stroke-width="3"/>
<ellipse cx="266" cy="160" rx="16" ry="6" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<path d="M250 174 C250 184 282 184 282 174" fill="none" stroke="${P.accent}" stroke-width="2.5"/>
<rect x="142" y="152" width="36" height="26" rx="3" fill="${P.bg}" stroke="${P.line}" stroke-width="3"/>
<circle cx="153" cy="160" r="3" fill="${P.beam}"/>
<polygon points="146,174 156,165 163,171 168,167 174,174" fill="${P.accent}" fill-opacity="0.6"/>
<path d="M160 178 V186 M150 188 H170" stroke="${P.line}" stroke-width="3" stroke-linecap="round"/>`,
    },
  ],
};
