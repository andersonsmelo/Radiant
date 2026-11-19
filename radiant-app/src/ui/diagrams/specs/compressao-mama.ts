import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, mamografia de perfil e esquemática. A parede torácica fica à
// esquerda, o suporte do receptor embaixo e a bandeja de compressão desce de cima.
// A mama alta some (fade) enquanto a achatada, mais larga e com as estruturas
// separadas, aparece; uma cobertura na cor do fundo, presa à bandeja, corta o
// que passa dela. Dobrar a espessura pela metade separa as estruturas que se
// sobrepunham: é isso que o desenho ensina.
const TOP0 = 84; // base da bandeja aberta
const TOP1 = 144; // base da bandeja comprimindo
const DY = TOP1 - TOP0;
const pingpong = { mode: 'pingpong' } as const;
const dot = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r="12" fill="none" stroke="${P.muted}" stroke-width="2"/>`;

export const compressaoMama: DiagramSpec = {
  id: 'compressao-mama',
  alt: 'Mamografia de perfil: a bandeja desce e achata a mama sobre o suporte; ela fica mais baixa e mais larga, e as estruturas internas se separam.',
  width: 320,
  height: 240,
  periodMs: 4800,
  posterAt: 0.5,
  layers: [
    {
      // Suporte do receptor.
      svg: `<rect x="30" y="190" width="266" height="16" rx="3" fill="${P.fill}" stroke="${P.accent}" stroke-width="3" stroke-linejoin="round"/>`,
    },
    {
      // Mama solta: alta, com as estruturas sobrepostas.
      svg: `<path d="M46 190 L46 96 C130 96 205 130 212 190 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="3" stroke-linejoin="round"/>
${dot(100, 150)}${dot(118, 162)}${dot(106, 174)}${dot(126, 148)}`,
      motion: { kind: 'fade', from: 1, to: 0, ...pingpong },
    },
    {
      // Mama comprimida: baixa, larga, com as estruturas separadas.
      svg: `<path d="M46 190 L46 148 C150 142 252 150 272 190 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="3" stroke-linejoin="round"/>
${dot(88, 170)}${dot(140, 168)}${dot(192, 170)}${dot(240, 178)}`,
      motion: { kind: 'fade', from: 0, to: 1, ...pingpong },
    },
    {
      // Cobertura presa à bandeja: esconde o que passa dela.
      svg: `<rect x="0" y="-200" width="320" height="${TOP0 + 200}" fill="${P.bg}"/>`,
      motion: { kind: 'translate', dx: 0, dy: DY, ...pingpong },
    },
    {
      // Bandeja de compressão e a haste.
      svg: `<rect x="46" y="${TOP0 - 10}" width="238" height="10" rx="2" fill="${P.fill}" stroke="${P.accent}" stroke-width="3" stroke-linejoin="round"/>
<rect x="272" y="-100" width="12" height="${TOP0 + 90}" fill="${P.fill}" stroke="${P.accent}" stroke-width="3" stroke-linejoin="round"/>`,
      motion: { kind: 'translate', dx: 0, dy: DY, ...pingpong },
    },
    {
      // Parede torácica.
      svg: `<rect x="8" y="60" width="38" height="130" rx="8" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>`,
    },
  ],
};
