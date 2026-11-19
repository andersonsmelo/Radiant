import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Mesa de densitometria vista de lado, cabeça do paciente à esquerda.
// A fonte fica sob o tampo e o detector acima do paciente, os dois presos ao mesmo braço em C
// (desenhado atrás do paciente). O feixe estreito sobe da fonte ao detector como duas linhas
// paralelas de cores diferentes: as duas energias que atravessam o mesmo ponto do corpo.
export const dxaDoisFeixes: DiagramSpec = {
  id: 'dxa-dois-feixes',
  alt: 'Densitômetro de lado: paciente deitado de costas na mesa, fonte sob o tampo, detector acima e um feixe estreito de duas cores subindo entre eles.',
  width: 320,
  height: 240,
  layers: [
    {
      // Piso e braço em C, que liga a fonte, sob a mesa, ao detector, acima do paciente.
      svg: `<line x1="8" y1="224" x2="312" y2="224" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>
<path d="M190 176 H218 Q228 176 228 166 V40 Q228 30 218 30 H200" fill="none" stroke="${P.muted}" stroke-width="6" stroke-linejoin="round"/>`,
    },
    {
      // Mesa: tampo e dois pés.
      svg: `<rect x="32" y="150" width="22" height="74" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>
<rect x="266" y="150" width="22" height="74" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>
<rect x="14" y="140" width="292" height="10" rx="3" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>`,
    },
    {
      // Fonte de raios X sob o tampo, com a fenda do colimador em cima.
      svg: `<rect x="150" y="164" width="40" height="24" rx="5" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<rect x="162" y="156" width="16" height="8" fill="${P.fill}" stroke="${P.muted}" stroke-width="2.5"/>`,
    },
    {
      // Paciente deitado de costas: cabeça, tronco, pernas e pés apontando para cima.
      svg: `<circle cx="36" cy="124" r="12" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<path d="M50 140 V126 C50 114 60 110 80 108 C110 106 130 112 150 114 C170 114 182 116 186 120 V140" fill="${P.fill}" stroke="${P.line}" stroke-width="3" stroke-linejoin="round"/>
<path d="M186 122 C210 124 236 126 252 128 V140 H186" fill="${P.fill}" stroke="${P.line}" stroke-width="3" stroke-linejoin="round"/>
<path d="M252 140 V108 Q252 102 258 104 L262 106 V140" fill="${P.fill}" stroke="${P.line}" stroke-width="3" stroke-linejoin="round"/>`,
    },
    {
      // Feixe estreito: duas linhas paralelas, uma para cada energia, da fonte ao detector.
      svg: `<line x1="166" y1="156" x2="166" y2="40" stroke="${P.beam}" stroke-width="3"/>
<line x1="174" y1="156" x2="174" y2="40" stroke="${P.electron}" stroke-width="3"/>`,
    },
    {
      // Detector no alto do braço, sobre o paciente.
      svg: `<rect x="140" y="20" width="60" height="20" rx="5" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>`,
    },
  ],
};
