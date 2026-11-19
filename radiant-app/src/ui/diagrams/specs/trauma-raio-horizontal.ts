import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Vista pela cabeceira, em corte na altura do pescoço: o paciente está
// deitado de costas sobre a prancha rígida, e a prancha sobre a maca. Por trás do corte aparece
// o contorno dos ombros. O pescoço é o círculo central, com a vértebra cervical perto da prancha
// e o colar cervical (ciano) em volta. O tubo fica ao lado, numa coluna, na altura do pescoço; o
// feixe (amarelo) sai horizontal, paralelo ao piso, atravessa o pescoço de lado a lado e chega ao
// detector (azul), em pé do outro lado, encostado ao ombro e apoiado na maca. O paciente não sai
// da prancha: quem se move é o equipamento.
export const traumaRaioHorizontal: DiagramSpec = {
  id: 'trauma-raio-horizontal',
  alt: 'Paciente de costas na prancha sobre a maca, visto pela cabeceira, com colar no pescoço; o feixe sai do tubo paralelo ao piso e chega a um detector em pé.',
  width: 320,
  height: 240,
  layers: [
    {
      // Piso, maca (tampo, pés e rodas) e prancha rígida.
      svg: `<line x1="4" y1="226" x2="316" y2="226" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round"/>
<rect x="84" y="151" width="162" height="7" rx="2" fill="${P.fill}" stroke="${P.muted}" stroke-width="2.5"/>
<path d="M96,158 V214 M234,158 V214" fill="none" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round"/>
<circle cx="96" cy="219" r="5" fill="none" stroke="${P.muted}" stroke-width="2"/>
<circle cx="234" cy="219" r="5" fill="none" stroke="${P.muted}" stroke-width="2"/>
<rect x="104" y="141" width="112" height="10" rx="2" fill="${P.muted}" fill-opacity="0.35" stroke="${P.line}" stroke-width="2.5"/>`,
    },
    {
      // Contorno dos ombros, atrás do corte.
      svg: `<path d="M106,141 C104,112 112,92 132,86 L188,86 C208,92 216,112 214,141" fill="${P.fill}" stroke="${P.muted}" stroke-width="2" stroke-linejoin="round"/>`,
    },
    {
      // Pescoço em corte, com o corpo vertebral e o canal vertebral.
      svg: `<circle cx="160" cy="118" r="16" fill="${P.bg}" stroke="${P.line}" stroke-width="2"/>
<circle cx="160" cy="121" r="5" fill="${P.muted}" fill-opacity="0.6" stroke="${P.muted}" stroke-width="1.5"/>
<circle cx="160" cy="130" r="2.5" fill="none" stroke="${P.muted}" stroke-width="1.5"/>`,
    },
    {
      // Colar cervical em volta do pescoço.
      svg: `<circle cx="160" cy="118" r="20" fill="none" stroke="${P.electron}" stroke-width="7"/>`,
    },
    {
      // Detector em pé, encostado ao ombro e apoiado na maca.
      svg: `<rect x="218" y="70" width="8" height="81" rx="2" fill="${P.accent}" fill-opacity="0.5" stroke="${P.accent}" stroke-width="2.5"/>`,
    },
    {
      // Tubo na coluna, com o colimador voltado para o pescoço.
      svg: `<rect x="8" y="212" width="42" height="8" rx="2" fill="${P.fill}" stroke="${P.muted}" stroke-width="2.5"/>
<rect x="18" y="92" width="7" height="120" fill="${P.fill}" stroke="${P.muted}" stroke-width="2.5"/>
<rect x="25" y="108" width="33" height="20" rx="4" fill="${P.fill}" stroke="${P.accent}" stroke-width="2.5"/>
<polygon points="58,111 66,113 66,123 58,125" fill="${P.fill}" stroke="${P.muted}" stroke-width="2" stroke-linejoin="round"/>`,
    },
    {
      // Feixe horizontal, do colimador ao detector, com o raio central tracejado.
      svg: `<polygon points="66,114 66,122 218,140 218,96" fill="${P.beam}" fill-opacity="0.2" stroke="${P.beam}" stroke-width="2" stroke-linejoin="round"/>
<line x1="66" y1="118" x2="218" y2="118" stroke="${P.beam}" stroke-width="2" stroke-dasharray="6 4"/>`,
    },
  ],
};
