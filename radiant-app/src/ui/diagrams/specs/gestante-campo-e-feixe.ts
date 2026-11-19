import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Gestante em pé, de perfil, de frente para o receptor vertical, em um
// exame de tórax; o tubo fica longe, à esquerda. O campo ajustado (cheio) cobre só o tórax,
// acima do abdome; o campo aberto demais (tracejado) alcançaria o abdome. Sem texto no desenho.
// Esquemático: o tracejado parte do mesmo ponto do campo ajustado e diverge mais.
export const gestanteCampoEFeixe: DiagramSpec = {
  id: 'gestante-campo-e-feixe',
  alt: 'Gestante de perfil em pé diante do receptor vertical; o tubo, longe, emite um campo cheio só sobre o tórax e um campo tracejado maior que alcançaria o abdome.',
  width: 320,
  height: 240,
  layers: [
    {
      svg: `<line x1="8" y1="214" x2="312" y2="214" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      // Tubo e colimador, à esquerda.
      svg: `<rect x="12" y="52" width="40" height="34" rx="7" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<polygon points="52,60 62,64 62,76 52,80" fill="${P.fill}" stroke="${P.muted}" stroke-width="3" stroke-linejoin="round"/>
<path d="M32 86 V214" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      // Receptor vertical, à direita.
      svg: `<rect x="263" y="20" width="12" height="170" rx="2" fill="${P.accent}" fill-opacity="0.3" stroke="${P.accent}" stroke-width="3"/>
<path d="M269 190 V214" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      // Gestante de perfil: duas pernas defasadas, tronco contínuo com a barriga em curva suave
      // do fim do tórax ao quadril, voltada para o receptor, e um braço discreto.
      svg: `<circle cx="191" cy="28" r="11" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="168" y="124" width="20" height="88" rx="7" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="168" y="205" width="30" height="9" rx="4" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="182" y="124" width="22" height="88" rx="7" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="182" y="205" width="32" height="9" rx="4" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<path d="M184 42 L199 42 L207 52 C211 64 211 78 209 88 C226 92 240 108 234 122 C231 130 220 132 208 131 L176 131 L174 112 C170 92 172 66 184 42 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="3" stroke-linejoin="round"/>
<path d="M188 58 C192 74 196 90 198 106" fill="none" stroke="${P.line}" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      // Campo aberto demais, tracejado: alcança o abdome.
      svg: `<polygon points="62,66 263,18 263,190 62,74" fill="none" stroke="${P.beam}" stroke-width="2.5" stroke-dasharray="7 6" stroke-linejoin="round"/>`,
    },
    {
      // Campo ajustado, só o tórax.
      svg: `<polygon points="62,67.5 263,46 263,88 62,71" fill="${P.beam}" fill-opacity="0.22" stroke="${P.beam}" stroke-width="2.5" stroke-linejoin="round"/>`,
    },
  ],
};
