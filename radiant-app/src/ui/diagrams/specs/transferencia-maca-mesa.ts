import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Maca encostada na mesa de exame, vista de lado, com o paciente deitado e as coisas
// que a equipe confere antes de passá-lo: duas rodas da maca (uma com freio travado, a calço apertado contra a
// roda, outra com o calço levantado), a grade lateral abaixada, o vão entre a maca e a mesa, a prancha de
// transferência encostada no pedestal da mesa e o suporte de soro com a linha esticada até o paciente.
export const transferenciaMacaMesa: DiagramSpec = {
  id: 'transferencia-maca-mesa',
  alt: 'Vista lateral: maca ao lado da mesa de exame com um vão entre elas, paciente deitado, suporte de soro com a linha até o braço e uma prancha encostada.',
  width: 320,
  height: 240,
  layers: [
    {
      // Piso e mesa de exame: tampo, pedestal e base.
      svg: `<line x1="8" y1="216" x2="312" y2="216" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>
<rect x="172" y="140" width="98" height="12" rx="3" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="204" y="152" width="32" height="56" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>
<rect x="190" y="208" width="60" height="8" rx="2" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>`,
    },
    {
      // Maca: colchão, grade abaixada (pendurada abaixo do colchão), pernas, rodas e calços de freio.
      svg: `<rect x="12" y="140" width="138" height="12" rx="3" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<path d="M66 152 V158 M100 152 V158" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>
<rect x="60" y="158" width="46" height="18" rx="3" fill="none" stroke="${P.line}" stroke-width="3"/>
<path d="M64 164 H102 M64 170 H102" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round"/>
<path d="M30 152 V199 M136 152 V199" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>
<circle cx="30" cy="207" r="8" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<circle cx="136" cy="207" r="8" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="23" y="192" width="14" height="7" rx="2" fill="${P.accent}" stroke="${P.accent}" stroke-width="2"/>
<rect x="129" y="181" width="14" height="7" rx="2" fill="none" stroke="${P.muted}" stroke-width="2.5"/>`,
    },
    {
      // Paciente deitado de costas, cabeça à esquerda, o braço junto ao corpo e o cateter no antebraço.
      svg: `<circle cx="36" cy="128" r="10" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="48" y="124" width="92" height="14" rx="7" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="88" y="127" width="46" height="8" rx="4" fill="${P.fill}" stroke="${P.muted}" stroke-width="2.5"/>
<circle cx="137" cy="128" r="3" fill="${P.line}"/>`,
    },
    {
      // Suporte de soro: haste, gancho, bolsa e a linha reta até o braço do paciente.
      svg: `<path d="M292 32 V216" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>
<path d="M282 32 H302" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>
<rect x="281" y="42" width="22" height="26" rx="6" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<rect x="284" y="54" width="16" height="11" rx="3" fill="${P.accent}" fill-opacity="0.45"/>
<line x1="292" y1="68" x2="292" y2="76" stroke="${P.line}" stroke-width="2.5" stroke-linecap="round"/>
<line x1="292" y1="76" x2="138" y2="128" stroke="${P.line}" stroke-width="2.5" stroke-linecap="round"/>`,
    },
    {
      // Prancha de transferência encostada no pedestal da mesa.
      svg: `<polygon points="238,156 246,156 270,214 260,214" fill="${P.fill}" stroke="${P.accent}" stroke-width="3" stroke-linejoin="round"/>`,
    },
  ],
};
