import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Monitor de frente com um padrão de teste: fileira de oito degraus de cinza
// (do preto ao branco), quadrado escuro com quadradinho quase preto, quadrado claro com quadradinho
// quase branco e dois grupos de pares de linhas finas (verticais e horizontais). À esquerda, uma
// janela, e sobre o canto superior direito da tela o reflexo claro dela. A paleta não tem cinzas
// intermediários: os tons saem de `P.line` com `fill-opacity` sobre o fundo escuro da tela.
const STEPS = [0, 0.14, 0.3, 0.46, 0.62, 0.78, 0.9, 1];
const vlines = [0, 1, 2, 3, 4, 5, 6].map((i) => `M${192 + 4 * i} 32 V68`).join(' ');
const hlines = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => `M222 ${32 + 5 * i} H238`).join(' ');

export const monitorEPadraoDeTeste: DiagramSpec = {
  id: 'monitor-e-padrao-de-teste',
  alt: 'Monitor com padrão de teste: degraus de cinza, dois quadrados com quadradinhos, pares de linhas; janela ao lado e seu reflexo no canto da tela.',
  width: 320,
  height: 240,
  layers: [
    {
      // Janela ao lado, com a vidraça e a cruz do caixilho.
      svg: `<rect x="8" y="50" width="46" height="100" fill="${P.accent}" fill-opacity="0.22" stroke="${P.accent}" stroke-width="3" stroke-linejoin="round"/>
<path d="M31 50 V150 M8 100 H54" stroke="${P.accent}" stroke-width="3"/>`,
    },
    {
      // Moldura do monitor, tela escura, haste e base.
      svg: `<rect x="66" y="12" width="244" height="164" rx="8" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>
<rect x="74" y="20" width="228" height="144" fill="${P.bg}" stroke="${P.muted}" stroke-width="2"/>
<path d="M178 176 V198 M150 206 H226" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      // Oito degraus de cinza, do preto ao branco.
      svg: STEPS.map(
        (o, i) =>
          `<rect x="${84 + 24 * i}" y="132" width="24" height="26" fill="${P.line}" fill-opacity="${o}" stroke="${P.muted}" stroke-width="1.5"/>`,
      ).join('\n'),
    },
    {
      // Quadrado preto com quadradinho quase preto; quadrado branco com quadradinho quase branco.
      svg: `<rect x="84" y="30" width="40" height="40" fill="${P.bg}" stroke="${P.muted}" stroke-width="1.5"/>
<rect x="97" y="43" width="14" height="14" fill="${P.line}" fill-opacity="0.09"/>
<rect x="140" y="30" width="40" height="40" fill="${P.line}"/>
<rect x="153" y="43" width="14" height="14" fill="${P.bg}" fill-opacity="0.09"/>`,
    },
    {
      // Pares de linhas finas: verticais e horizontais.
      svg: `<path d="${vlines}" stroke="${P.line}" stroke-width="1.5"/>
<path d="${hlines}" stroke="${P.line}" stroke-width="1.5"/>`,
    },
    {
      // Reflexo claro da janela no canto da tela: faixa inclinada com o caixilho.
      svg: `<polygon points="264,22 300,22 300,64 244,64" fill="${P.line}" fill-opacity="0.2"/>
<path d="M272 22 L252 64 M282 43 H296" stroke="${P.line}" stroke-opacity="0.4" stroke-width="2"/>`,
    },
  ],
};
