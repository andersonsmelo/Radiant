import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240. Doze barras crescentes (dose típica de cada sala para o mesmo
// exame); a linha tracejada deixa nove abaixo e três acima.
export const nivelDeReferencia: DiagramSpec = {
  id: 'nivel-de-referencia',
  alt: 'Gráfico de doze barras crescentes e uma linha horizontal tracejada: as três barras mais altas passam da linha e têm cor de destaque.',
  width: 320,
  height: 240,
  layers: [
    {
      // Eixos.
      svg: `<path d="M44 20 V200 H300" fill="none" stroke="${P.muted}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
    },
    {
      // Nove barras abaixo da referência.
      svg: `<rect x="62" y="170" width="13" height="30" fill="${P.accent}"/>
<rect x="81" y="160" width="13" height="40" fill="${P.accent}"/>
<rect x="100" y="150" width="13" height="50" fill="${P.accent}"/>
<rect x="119" y="140" width="13" height="60" fill="${P.accent}"/>
<rect x="138" y="130" width="13" height="70" fill="${P.accent}"/>
<rect x="157" y="120" width="13" height="80" fill="${P.accent}"/>
<rect x="176" y="110" width="13" height="90" fill="${P.accent}"/>
<rect x="195" y="100" width="13" height="100" fill="${P.accent}"/>
<rect x="214" y="90" width="13" height="110" fill="${P.accent}"/>`,
    },
    {
      // Três barras acima da referência, em destaque.
      svg: `<rect x="233" y="65" width="13" height="135" fill="${P.beam}"/>
<rect x="252" y="45" width="13" height="155" fill="${P.beam}"/>
<rect x="271" y="25" width="13" height="175" fill="${P.beam}"/>`,
    },
    {
      // Linha de referência (altura 122).
      svg: `<line x1="44" y1="78" x2="300" y2="78" stroke="${P.line}" stroke-width="2.5" stroke-dasharray="8 6"/>`,
    },
  ],
};
