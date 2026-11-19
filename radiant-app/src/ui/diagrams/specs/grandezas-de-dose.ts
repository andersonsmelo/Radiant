import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Três painéis separados por espaço, cada um com uma moldura fina.
// Painel 1 (dose absorvida): feixe de fótons entra num bloco de tecido e deixa energia (pontos) na massa.
// Painel 2 (dose equivalente): o mesmo bloco, com um fóton (traço fino e ondulado) e uma partícula
// pesada (barra grossa e curta); a marca de dano da partícula é bem maior que a do fóton.
// Painel 3 (dose efetiva): contorno de corpo de frente (pulmão direito do paciente à esquerda de
// quem vê) com órgãos de intensidades diferentes. A figura não tem texto; o conteúdo rotula.
const r = (v: number) => Math.round(v * 100) / 100;
const wave = (x: number, y1: number, y2: number, amp: number, cycles: number) => {
  const n = Math.round((y2 - y1) / 3);
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    return `${r(x + amp * Math.sin(t * cycles * 2 * Math.PI))},${r(y1 + (y2 - y1) * t)}`;
  });
  return `<polyline points="${pts.join(' ')}" fill="none" stroke="${P.beam}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;
};
const arrowDown = (x: number, y: number) => `<polyline points="${x - 5},${y - 8} ${x},${y} ${x + 5},${y - 8}" fill="none" stroke="${P.beam}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;
const block = (x: number) => `<rect x="${x}" y="110" width="68" height="90" rx="4" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>`;

export const grandezasDeDose: DiagramSpec = {
  id: 'grandezas-de-dose',
  alt: 'Três painéis: bloco de tecido sob um feixe; o bloco com um fóton fino e uma partícula grossa de dano maior; um corpo com órgãos de intensidades diferentes.',
  width: 320,
  height: 240,
  layers: [
    {
      // Molduras dos três painéis.
      svg: [12, 116, 220]
        .map((x) => `<rect x="${x}" y="16" width="88" height="208" rx="8" fill="none" stroke="${P.muted}" stroke-width="1.5" stroke-opacity="0.6"/>`)
        .join('\n'),
    },
    {
      // Painel 1: três fótons entram no bloco e a energia depositada fica na massa (pontos).
      svg: `${[40, 56, 72].map((x) => `${wave(x, 28, 100, 2.5, 4)}${arrowDown(x, 106)}`).join('\n')}
${block(22)}
<circle cx="40" cy="132" r="3" fill="${P.beam}"/><circle cx="58" cy="148" r="3" fill="${P.beam}"/><circle cx="74" cy="130" r="3" fill="${P.beam}"/>
<circle cx="48" cy="170" r="3" fill="${P.beam}"/><circle cx="68" cy="176" r="3" fill="${P.beam}"/><circle cx="82" cy="156" r="3" fill="${P.beam}"/>`,
    },
    {
      // Painel 2: bloco, fóton fino à esquerda e partícula pesada à direita.
      svg: `${block(126)}
${wave(144, 28, 100, 2.5, 4)}${arrowDown(144, 106)}`,
    },
    {
      // A partícula pesada: barra grossa e curta, ciano, com ponta.
      svg: `<line x1="180" y1="48" x2="180" y2="90" stroke="${P.electron}" stroke-width="10" stroke-linecap="round"/>
<polyline points="171,92 180,106 189,92" fill="none" stroke="${P.electron}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
    },
    {
      // Marcas de dano: pequena para o fóton, grande (com raios) para a partícula pesada.
      svg: `<circle cx="144" cy="132" r="4" fill="${P.beam}"/>
<circle cx="180" cy="148" r="15" fill="${P.beam}" fill-opacity="0.35" stroke="${P.beam}" stroke-width="3"/>
<circle cx="180" cy="148" r="6" fill="${P.beam}"/>
<path d="M180 124 V118 M180 172 V178 M156 148 H150 M204 148 H210 M163 131 l-4 -4 M197 131 l4 -4 M163 165 l-4 4 M197 165 l4 4" fill="none" stroke="${P.beam}" stroke-width="2.5" stroke-linecap="round"/>`,
    },
    {
      // Painel 3: contorno do corpo (cabeça, tronco, braços e pernas).
      svg: `<circle cx="264" cy="46" r="12" fill="none" stroke="${P.muted}" stroke-width="3"/>
<rect x="238" y="66" width="52" height="98" rx="14" fill="none" stroke="${P.muted}" stroke-width="3"/>
<path d="M238 76 L228 142 M290 76 L300 142 M252 164 V214 M276 164 V214" fill="none" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      // Órgãos: pulmões (mais escuros no total), estômago e fígado, tireoide e gônadas (menos).
      svg: `<ellipse cx="253" cy="94" rx="9" ry="14" fill="${P.accent}" fill-opacity="0.8" stroke="${P.accent}" stroke-width="2"/>
<ellipse cx="275" cy="94" rx="9" ry="14" fill="${P.accent}" fill-opacity="0.8" stroke="${P.accent}" stroke-width="2"/>
<ellipse cx="264" cy="128" rx="14" ry="8" fill="${P.accent}" fill-opacity="0.5" stroke="${P.accent}" stroke-width="2"/>
<ellipse cx="264" cy="68" rx="6" ry="3" fill="${P.accent}" fill-opacity="0.35" stroke="${P.accent}" stroke-width="2"/>
<circle cx="264" cy="151" r="6" fill="${P.accent}" fill-opacity="0.2" stroke="${P.accent}" stroke-width="2"/>`,
    },
  ],
};
