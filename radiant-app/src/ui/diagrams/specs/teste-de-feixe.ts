import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, vista de lado. Tubo e colimador em cima, o feixe desce, três
// lâminas de filtro num suporte, o medidor sobre a mesa e o mostrador ao lado.
export const testeDeFeixe: DiagramSpec = {
  id: 'teste-de-feixe',
  alt: 'Vista de lado: tubo de raios X com colimador, feixe descendo por três lâminas finas até um medidor sobre a mesa, ligado por cabo a um mostrador de barras.',
  width: 320,
  height: 240,
  layers: [
    {
      // Mesa e mostrador (tela com barras, sem números), com o cabo do medidor.
      svg: `<rect x="16" y="200" width="288" height="10" rx="2" fill="${P.fill}" stroke="${P.muted}" stroke-width="2"/>
<rect x="232" y="128" width="64" height="54" rx="5" fill="${P.bg}" stroke="${P.line}" stroke-width="3"/>
<line x1="264" y1="182" x2="264" y2="200" stroke="${P.muted}" stroke-width="3"/>
<rect x="244" y="158" width="8" height="16" fill="${P.accent}"/>
<rect x="257" y="146" width="8" height="28" fill="${P.accent}"/>
<rect x="270" y="152" width="8" height="22" fill="${P.accent}"/>
<path d="M182 193 C206 193 206 155 232 155" fill="none" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round"/>`,
    },
    {
      // Cabeçote do tubo, com o ponto focal.
      svg: `<rect x="118" y="8" width="84" height="40" rx="8" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<circle cx="160" cy="40" r="4" fill="${P.beam}"/>`,
    },
    {
      // Colimador: caixa com abertura.
      svg: `<rect x="126" y="62" width="68" height="40" rx="3" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>
<polygon points="150,62 170,62 181,102 139,102" fill="${P.bg}"/>`,
    },
    {
      // Feixe: mais forte antes das lâminas, mais fraco depois.
      svg: `<polygon points="150,62 170,62 181,102 139,102" fill="${P.beam}" fill-opacity="0.4"/>
<polygon points="139,102 181,102 189,128 131,128" fill="${P.beam}" fill-opacity="0.3"/>
<polygon points="131,152 189,152 208,200 112,200" fill="${P.beam}" fill-opacity="0.16" stroke="${P.beam}" stroke-width="2" stroke-linejoin="round"/>
<line x1="139" y1="102" x2="131" y2="128" stroke="${P.beam}" stroke-width="2"/>
<line x1="181" y1="102" x2="189" y2="128" stroke="${P.beam}" stroke-width="2"/>`,
    },
    {
      // Suporte com três lâminas finas empilhadas.
      svg: `<path d="M114 128 V152 H206 V128" fill="none" stroke="${P.muted}" stroke-width="3" stroke-linejoin="round"/>
<line x1="206" y1="140" x2="220" y2="140" stroke="${P.muted}" stroke-width="3"/>
<line x1="220" y1="140" x2="220" y2="200" stroke="${P.muted}" stroke-width="3"/>
<rect x="120" y="131" width="80" height="5" fill="${P.accent}" stroke="${P.line}" stroke-width="1.5"/>
<rect x="120" y="137" width="80" height="5" fill="${P.accent}" stroke="${P.line}" stroke-width="1.5"/>
<rect x="120" y="143" width="80" height="5" fill="${P.accent}" stroke="${P.line}" stroke-width="1.5"/>`,
    },
    {
      // Medidor de estado sólido: caixa baixa no centro do feixe.
      svg: `<rect x="140" y="186" width="40" height="14" rx="3" fill="${P.fill}" stroke="${P.electron}" stroke-width="3"/>
<circle cx="160" cy="193" r="3" fill="${P.electron}"/>`,
    },
  ],
};
