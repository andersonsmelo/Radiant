import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Conferência de identidade antes do exame: o paciente deitado na maca (cabeça à
// esquerda) com a pulseira no punho, o profissional de pé com a folha do pedido na mão e a tela do sistema
// ao lado. Sem texto: quem diz o que conferir é a aula.
export const conferenciaDeIdentidade: DiagramSpec = {
  id: 'conferencia-de-identidade',
  alt: 'Paciente deitado numa maca com pulseira no punho; um profissional de pé segura a folha do pedido, e ao lado há uma tela de computador.',
  width: 320,
  height: 240,
  layers: [
    {
      // Piso.
      svg: `<line x1="8" y1="214" x2="312" y2="214" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      // Maca: colchão, pernas e rodas.
      svg: `<rect x="24" y="150" width="172" height="10" rx="3" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<path d="M52 160 V199 M168 160 V199" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>
<circle cx="52" cy="206" r="7" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>
<circle cx="168" cy="206" r="7" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>`,
    },
    {
      // Paciente deitado de costas: cabeça, tronco e perna, o braço ao longo do corpo, a mão e a pulseira no punho.
      svg: `<circle cx="50" cy="138" r="11" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="64" y="138" width="124" height="12" rx="6" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="96" y="140" width="44" height="8" rx="4" fill="${P.fill}" stroke="${P.muted}" stroke-width="2.5"/>
<circle cx="147" cy="144" r="5" fill="${P.fill}" stroke="${P.muted}" stroke-width="2.5"/>
<rect x="129" y="137" width="9" height="14" rx="2" fill="${P.accent}" stroke="${P.accent}" stroke-width="2"/>`,
    },
    {
      // Profissional de pé, o braço estendido segurando a folha do pedido.
      svg: `<circle cx="240" cy="80" r="10" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="226" y="92" width="28" height="60" rx="8" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<path d="M233 152 V214 M247 152 V214" stroke="${P.line}" stroke-width="3" stroke-linecap="round"/>
<line x1="228" y1="104" x2="214" y2="122" stroke="${P.line}" stroke-width="3" stroke-linecap="round"/>
<rect x="192" y="114" width="24" height="32" rx="2" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<path d="M198 124 H210 M198 131 H210 M198 138 H205" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round" fill="none"/>`,
    },
    {
      // Tela do sistema num pedestal: foto, campos e uma linha de confirmação.
      svg: `<rect x="270" y="84" width="42" height="34" rx="3" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<circle cx="281" cy="97" r="5" fill="none" stroke="${P.muted}" stroke-width="2.5"/>
<path d="M290 94 H304 M290 101 H304 M276 110 H304" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round" fill="none"/>
<path d="M291 118 V214 M280 214 H302" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>`,
    },
  ],
};
