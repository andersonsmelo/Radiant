import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Osso longo genérico deitado, em corte longitudinal. À esquerda, a
// epífise proximal em cúpula (como a cabeça de um úmero); à direita, a distal, larga e com um
// entalhe no meio (como os côndilos do fêmur). Entre cada epífise e a metáfise, a placa de
// crescimento; nas pontas, a cartilagem articular. A diáfise tem parede de osso compacto e a
// cavidade medular no meio; as pontas são de osso esponjoso.
export const ossoLongo: DiagramSpec = {
  id: 'osso-longo',
  alt: 'Osso longo deitado, em corte: duas pontas largas de osso esponjoso, uma faixa clara perto de cada ponta e o tubo do meio com cavidade.',
  width: 320,
  height: 240,
  layers: [
    {
      // Contorno do osso.
      svg: `<path d="M110,98 L210,98 C232,98 244,80 250,64 C290,56 306,72 306,96 C306,108 300,114 300,120 C300,126 306,132 306,144 C306,168 290,184 250,176 C244,160 232,142 210,142 L110,142 C88,142 76,160 70,176 C30,184 12,150 12,120 C12,90 30,56 70,64 C76,80 88,98 110,98 Z" fill="${P.fill}" stroke="${P.line}" stroke-width="3" stroke-linejoin="round"/>`,
    },
    {
      // Osso esponjoso (trabéculas) nas epífises e metáfises.
      svg: `<circle cx="45.5" cy="81.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="56.5" cy="81.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="78.5" cy="81.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="243.5" cy="81.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="254.5" cy="81.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="265.5" cy="81.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="276.5" cy="81.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="40" cy="91" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="51" cy="91" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="62" cy="91" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="84" cy="91" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="238" cy="91" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="260" cy="91" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="271" cy="91" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="282" cy="91" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="34.5" cy="100.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="45.5" cy="100.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="56.5" cy="100.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="78.5" cy="100.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="89.5" cy="100.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="100.5" cy="100.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="221.5" cy="100.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="232.5" cy="100.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="243.5" cy="100.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="254.5" cy="100.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="265.5" cy="100.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="276.5" cy="100.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="287.5" cy="100.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="29" cy="110" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="40" cy="110" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="51" cy="110" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="62" cy="110" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="84" cy="110" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="95" cy="110" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="106" cy="110" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="216" cy="110" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="227" cy="110" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="238" cy="110" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="260" cy="110" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="271" cy="110" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="282" cy="110" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="293" cy="110" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="23.5" cy="119.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="34.5" cy="119.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="45.5" cy="119.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="56.5" cy="119.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="78.5" cy="119.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="89.5" cy="119.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="100.5" cy="119.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="221.5" cy="119.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="232.5" cy="119.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="243.5" cy="119.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="254.5" cy="119.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="265.5" cy="119.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="276.5" cy="119.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="287.5" cy="119.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="298.5" cy="119.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="29" cy="129" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="40" cy="129" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="51" cy="129" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="62" cy="129" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="84" cy="129" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="95" cy="129" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="106" cy="129" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="216" cy="129" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="227" cy="129" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="238" cy="129" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="260" cy="129" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="271" cy="129" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="282" cy="129" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="293" cy="129" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="34.5" cy="138.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="45.5" cy="138.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="56.5" cy="138.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="78.5" cy="138.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="89.5" cy="138.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="100.5" cy="138.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="221.5" cy="138.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="232.5" cy="138.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="243.5" cy="138.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="254.5" cy="138.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="265.5" cy="138.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="276.5" cy="138.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="287.5" cy="138.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="40" cy="148" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="51" cy="148" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="62" cy="148" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="84" cy="148" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="227" cy="148" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="238" cy="148" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="260" cy="148" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="271" cy="148" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="282" cy="148" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="45.5" cy="157.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="56.5" cy="157.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="78.5" cy="157.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="243.5" cy="157.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="254.5" cy="157.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="265.5" cy="157.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="276.5" cy="157.5" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="62" cy="167" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>
<circle cx="260" cy="167" r="3" fill="none" stroke="${P.muted}" stroke-width="1.2"/>`,
    },
    {
      // Osso compacto, a parede grossa da diáfise.
      svg: `<path d="M104,99 H216 V108 H104 Z M104,132 H216 V141 H104 Z" fill="${P.muted}" fill-opacity="0.55"/>`,
    },
    {
      // Cavidade medular.
      svg: `<rect x="104" y="108" width="112" height="24" rx="12" fill="${P.accent}" fill-opacity="0.3" stroke="${P.accent}" stroke-width="2"/>`,
    },
    {
      // Placas (linhas) de crescimento entre epífise e metáfise.
      svg: `<path d="M70,66 C66,96 74,144 70,174 M250,66 C254,96 246,144 250,174" fill="none" stroke="${P.beam}" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      // Cartilagem articular nas duas pontas.
      svg: `<path d="M44,66 C22,76 12,98 12,120 C12,142 22,164 44,174 M278,64 C298,66 306,80 306,96 C306,108 300,114 300,120 C300,126 306,132 306,144 C306,160 298,174 278,176" fill="none" stroke="${P.electron}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`,
    },
  ],
};
