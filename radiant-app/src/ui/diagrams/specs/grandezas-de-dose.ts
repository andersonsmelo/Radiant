import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Gramática de gráficos (fase 3). Quadro 320x240, sem texto. Um painel opaco com três colunas separadas por risco fino.
// Coluna 1 (dose absorvida): fótons entram num bloco de tecido (poço escuro) e a energia que ficou nele são pontos.
// Coluna 2 (dose equivalente): o mesmo bloco, com um fóton (traço fino, âmbar) e uma partícula pesada (barra grossa,
// branca); a marca de dano da partícula é bem maior que a do fóton. Coluna 3 (dose efetiva): corpo de frente com
// órgãos de intensidades diferentes (azul; quanto mais opaco, maior o fator do tecido).
// Movimento (um relógio, laço): 0 a 0,06 só o quadro parado; 0,06 a 0,4 os feixes descem, lineares, até o bloco;
// 0,4 a 0,5 a energia fica nos blocos; 0,45 a 0,58 os órgãos se acendem; 0,58 a 0,9 o quadro completo, que é também o
// quadro parado (posterAt 0,75); 0,9 a 1 tudo se apaga. Os feixes partem de fora do painel (a moldura os esconde) e a
// cortina da cor do painel, só sobre o trecho dos feixes, os apaga no fim sem tocar nos risquinhos nem nos blocos.
// Sem alvo de toque nas aulas (m21 usa só como visual do conceito).
const r = (v: number) => Math.round(v * 100) / 100;
const DY = 118; // o feixe parte de fora do painel e desce DY até a posição de repouso
const wave = (x: number, y1: number, y2: number, amp: number, cycles: number, oy: number) => {
  const n = Math.round((y2 - y1) / 3);
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    return `${r(x + amp * Math.sin(t * cycles * 2 * Math.PI))},${r(y1 + (y2 - y1) * t - oy)}`;
  });
  return `<polyline points="${pts.join(' ')}" fill="none" stroke="${P.beam}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;
};
const arrowDown = (x: number, y: number, oy: number, color: string = P.beam) =>
  `<polyline points="${x - 5},${y - 8 - oy} ${x},${y - oy} ${x + 5},${y - 8 - oy}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;
const block = (x: number) => `<rect x="${x}" y="112" width="64" height="84" rx="8" fill="${P.bg}" stroke="${P.muted}" stroke-width="2.5"/>`;
const dot = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r="4.5" fill="${P.beam}" stroke="${P.bg}" stroke-width="2"/>`;

export const grandezasDeDose: DiagramSpec = {
  id: 'grandezas-de-dose',
  alt: 'Três painéis: bloco de tecido sob um feixe; o bloco com um fóton fino e uma partícula grossa de dano maior; um corpo com órgãos de intensidades diferentes.',
  width: 320,
  height: 240,
  periodMs: 6000,
  posterAt: 0.75,
  layers: [
    {
      // Painel, riscos entre as colunas, os dois blocos e o contorno do corpo.
      svg: `<rect x="8" y="8" width="304" height="224" rx="16" fill="${P.fill}"/>
<path d="M109 28 V212 M211 28 V212" fill="none" stroke="${P.muted}" stroke-width="2" stroke-opacity="0.35" stroke-linecap="round"/>
${block(26)}${block(128)}
<circle cx="262" cy="40" r="11" fill="none" stroke="${P.muted}" stroke-width="3"/>
<rect x="240" y="58" width="44" height="92" rx="14" fill="none" stroke="${P.muted}" stroke-width="3"/>
<path d="M240 70 L230 126 M284 70 L294 126 M252 150 V206 M272 150 V206" fill="none" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      // Feixes: três fótons na coluna 1; um fóton e a partícula pesada (barra grossa branca) na coluna 2.
      svg: `${[44, 58, 72].map((x) => `${wave(x, 34, 92, 2.5, 4, DY)}${arrowDown(x, 104, DY)}`).join('\n')}
${wave(142, 34, 92, 2.5, 4, DY)}${arrowDown(142, 104, DY)}
<line x1="170" y1="${50 - DY}" x2="170" y2="${88 - DY}" stroke="${P.line}" stroke-width="10" stroke-linecap="round"/>
${arrowDown(170, 104, DY, P.line).replace('stroke-width="2.5"', 'stroke-width="3"')}`,
      motion: { kind: 'translate', dx: 0, dy: DY, mode: 'loop', keys: [[0, 0], [0.06, 0], [0.4, 1], [1, 1]], ease: 'linear' },
    },
    {
      // Cortina da cor do painel sobre o trecho dos feixes (sem tocar nos riscos de 109 e 211 nem nos blocos).
      svg: `<rect x="24" y="18" width="82" height="90" fill="${P.fill}"/><rect x="112" y="18" width="96" height="90" fill="${P.fill}"/>`,
      motion: { kind: 'fade', from: 0, to: 1, mode: 'loop', keys: [[0, 0], [0.9, 0], [1, 1]], ease: 'inOut' },
    },
    {
      // Energia depositada: pontos na coluna 1; marca pequena do fóton e marca grande, com raios, da partícula na coluna 2.
      svg: `${[[40, 134], [62, 130], [78, 148], [50, 158], [70, 172], [40, 180], [58, 186]].map(([x, y]) => dot(x, y)).join('')}
${dot(142, 134)}
<circle cx="170" cy="152" r="12" fill="${P.beam}" fill-opacity="0.35" stroke="${P.beam}" stroke-width="3"/>
<circle cx="170" cy="152" r="5" fill="${P.beam}"/>
<path d="M170 134 V131 M170 170 V173 M152 152 H149 M188 152 H191 M157 139 l-3 -3 M183 139 l3 -3 M157 165 l-3 3 M183 165 l3 3" fill="none" stroke="${P.beam}" stroke-width="2.5" stroke-linecap="round"/>`,
      motion: { kind: 'fade', from: 0, to: 1, mode: 'loop', keys: [[0, 0], [0.4, 0], [0.5, 1], [0.9, 1], [1, 0]], ease: 'inOut' },
    },
    {
      // Órgãos: pulmões (fator maior), estômago, tireoide e gônadas (menor).
      svg: `<ellipse cx="252" cy="88" rx="8" ry="13" fill="${P.accent}" fill-opacity="0.85" stroke="${P.accent}" stroke-width="2"/>
<ellipse cx="272" cy="88" rx="8" ry="13" fill="${P.accent}" fill-opacity="0.85" stroke="${P.accent}" stroke-width="2"/>
<ellipse cx="262" cy="120" rx="12" ry="7" fill="${P.accent}" fill-opacity="0.55" stroke="${P.accent}" stroke-width="2"/>
<ellipse cx="262" cy="54.5" rx="6" ry="2.5" fill="${P.accent}" fill-opacity="0.35" stroke="${P.accent}" stroke-width="2"/>
<circle cx="262" cy="139" r="5" fill="${P.accent}" fill-opacity="0.2" stroke="${P.accent}" stroke-width="2"/>`,
      motion: { kind: 'fade', from: 0, to: 1, mode: 'loop', keys: [[0, 0], [0.45, 0], [0.58, 1], [0.9, 1], [1, 0]], ease: 'inOut' },
    },
    {
      // Moldura da cor do fundo: esconde os feixes fora do painel e arredonda os cantos.
      svg: `<path fill-rule="evenodd" fill="${P.bg}" d="M0 0H320V240H0Z M24 8H296A16 16 0 0 1 312 24V216A16 16 0 0 1 296 232H24A16 16 0 0 1 8 216V24A16 16 0 0 1 24 8Z"/>`,
    },
  ],
};
