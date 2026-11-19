import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Mesa de fluoroscopia vista de lado: o tubo fica sob a mesa e
// aponta para cima; o paciente está deitado sobre o tampo; o receptor de imagem fica
// acima dele; o feixe vai do tubo ao receptor, atravessando mesa e paciente. Um arco em C
// liga tubo e receptor. À direita, o operador (silhueta), o pedal no chão perto dos pés
// dele e o monitor num suporte. Esquemático: sem proporção exata dos equipamentos.
const bar = (d: string) =>
  `<path d="${d}" fill="none" stroke="${P.muted}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
<path d="${d}" fill="none" stroke="${P.fill}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;

export const fluoroscopiaCadeia: DiagramSpec = {
  id: 'fluoroscopia-cadeia',
  alt: 'Mesa de fluoroscopia de lado: paciente deitado, tubo sob a mesa apontando para cima, receptor acima, feixe entre eles, operador, pedal e monitor.',
  width: 320,
  height: 240,
  layers: [
    {
      // Chão, pedestal da mesa e pedal.
      svg: `<line x1="8" y1="206" x2="312" y2="206" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>
<rect x="150" y="126" width="20" height="80" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>
<rect x="204" y="198" width="20" height="8" rx="3" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>`,
    },
    {
      // Feixe, do foco do tubo ao receptor.
      svg: `<polygon points="110,152 126,152 160,60 76,60" fill="${P.beam}" fill-opacity="0.28" stroke="${P.beam}" stroke-width="2.5" stroke-linejoin="round"/>`,
    },
    {
      // Tampo da mesa e paciente deitado (cabeça à esquerda).
      svg: `<rect x="40" y="118" width="156" height="8" rx="3" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<circle cx="56" cy="107" r="9" fill="none" stroke="${P.muted}" stroke-width="3"/>
<rect x="68" y="98" width="122" height="20" rx="9" fill="none" stroke="${P.muted}" stroke-width="3"/>`,
    },
    {
      // Arco em C, tubo sob a mesa e receptor acima do paciente.
      svg: `${bar('M96 164 H24 V49 H76')}
<rect x="96" y="152" width="44" height="24" rx="6" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<circle cx="118" cy="152" r="3.5" fill="${P.beam}"/>
<rect x="76" y="40" width="84" height="18" rx="5" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>`,
    },
    {
      // Operador em silhueta, de frente para a mesa.
      svg: `<circle cx="237" cy="50" r="8" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="226" y="62" width="22" height="80" rx="8" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<path d="M232 142 V206 M242 142 V206" stroke="${P.line}" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      // Monitor num suporte.
      svg: `<line x1="288" y1="86" x2="288" y2="206" stroke="${P.muted}" stroke-width="3"/>
<rect x="264" y="52" width="48" height="34" rx="4" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<rect x="270" y="58" width="36" height="22" fill="${P.accent}" fill-opacity="0.3"/>
<circle cx="288" cy="69" r="7" fill="none" stroke="${P.line}" stroke-width="2"/>`,
    },
  ],
};
