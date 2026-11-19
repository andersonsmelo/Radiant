import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Coluna vertebral de perfil, com a frente do corpo à esquerda e os
// processos espinhosos apontando para trás (direita). Contagem: 7 cervicais, 12 torácicas, 5
// lombares, sacro (5 fundidas) e cóccix; os corpos crescem de cima para baixo. Curvaturas:
// lordose cervical e lombar (convexas para a frente, à esquerda) e cifose torácica e sacral
// (convexas para trás). Regiões em cores alternadas: ciano, azul, amarelo, ciano, azul.
export const colunaRegioes: DiagramSpec = {
  id: 'coluna-regioes',
  alt: 'Coluna vertebral de perfil, com a frente do corpo à esquerda: cinco regiões em cores alternadas e quatro curvas em S duplo.',
  width: 320,
  height: 240,
  layers: [
    {
      // Arcos posteriores e processos espinhosos, para trás.
      svg: `<path d="M156.7,17.4 L163.1,22.2 M154.6,22.8 L161,27.7 M153.1,27.6 L159.9,31.7 M152.5,31.4 L160.1,33.9 M153,34.6 L161,34.9 M154.5,38.7 L162.5,37.7 M157,43.7 L164.8,42.2 M161.2,51.6 L171,53.9 M165,58 L174.9,59.6 M169.5,64.9 L179.4,66.3 M174,72.1 L183.8,74.1 M178,80 L187.5,83.1 M180.8,88.8 L189.5,93.7 M181.5,98.3 L188.6,105.4 M179.9,107.3 L185.4,115.7 M177,115.5 L181.4,124.5 M173.5,123.1 L177.4,132.4 M170,130.2 L173.9,139.4 M167,136.8 L171.4,145.7 M163.6,148.6 L171.7,154.4 M159.3,158.8 L167.8,164.1 M157.7,165.9 L167.4,168.4 M158.8,172.8 L168.7,172.3 M162.1,181.4 L171.8,179.2" fill="none" stroke="${P.muted}" stroke-width="2" stroke-linecap="round"/>`,
    },
    {
      // Região cervical: 7 corpos pequenos, curva convexa para a frente.
      svg: `<rect x="144.8" y="12.9" width="11" height="3.6" rx="1.5" fill="${P.electron}" fill-opacity="0.75" stroke="${P.electron}" stroke-width="1.5" transform="rotate(22.3 150.3 14.7)"/>
<rect x="142.3" y="18.3" width="11.3" height="3.6" rx="1.5" fill="${P.electron}" fill-opacity="0.75" stroke="${P.electron}" stroke-width="1.5" transform="rotate(22.2 148 20.1)"/>
<rect x="140.2" y="23.7" width="11.7" height="3.6" rx="1.5" fill="${P.electron}" fill-opacity="0.75" stroke="${P.electron}" stroke-width="1.5" transform="rotate(16.3 146 25.5)"/>
<rect x="139" y="29.1" width="12" height="3.6" rx="1.5" fill="${P.electron}" fill-opacity="0.75" stroke="${P.electron}" stroke-width="1.5" transform="rotate(3.5 145 30.9)"/>
<rect x="139.3" y="34.5" width="12.3" height="3.6" rx="1.5" fill="${P.electron}" fill-opacity="0.75" stroke="${P.electron}" stroke-width="1.5" transform="rotate(-12.8 145.5 36.3)"/>
<rect x="141" y="39.9" width="12.7" height="3.6" rx="1.5" fill="${P.electron}" fill-opacity="0.75" stroke="${P.electron}" stroke-width="1.5" transform="rotate(-22.3 147.3 41.7)"/>
<rect x="143.2" y="45.3" width="13" height="3.6" rx="1.5" fill="${P.electron}" fill-opacity="0.75" stroke="${P.electron}" stroke-width="1.5" transform="rotate(-25.4 149.7 47.1)"/>`,
    },
    {
      // Região torácica: 12 corpos, curva convexa para trás.
      svg: `<rect x="146.7" y="52.9" width="14" height="5.2" rx="1.5" fill="${P.accent}" fill-opacity="0.75" stroke="${P.accent}" stroke-width="1.5" transform="rotate(-27.1 153.7 55.5)"/>
<rect x="150.4" y="59.9" width="14.4" height="5.2" rx="1.5" fill="${P.accent}" fill-opacity="0.75" stroke="${P.accent}" stroke-width="1.5" transform="rotate(-31.1 157.6 62.5)"/>
<rect x="154.6" y="66.9" width="14.7" height="5.2" rx="1.5" fill="${P.accent}" fill-opacity="0.75" stroke="${P.accent}" stroke-width="1.5" transform="rotate(-31.6 161.9 69.5)"/>
<rect x="158.5" y="73.9" width="15.1" height="5.2" rx="1.5" fill="${P.accent}" fill-opacity="0.75" stroke="${P.accent}" stroke-width="1.5" transform="rotate(-28.9 166 76.5)"/>
<rect x="161.7" y="80.9" width="15.5" height="5.2" rx="1.5" fill="${P.accent}" fill-opacity="0.75" stroke="${P.accent}" stroke-width="1.5" transform="rotate(-22.2 169.5 83.5)"/>
<rect x="163.7" y="87.9" width="15.8" height="5.2" rx="1.5" fill="${P.accent}" fill-opacity="0.75" stroke="${P.accent}" stroke-width="1.5" transform="rotate(-10.6 171.6 90.5)"/>
<rect x="163.8" y="94.9" width="16.2" height="5.2" rx="1.5" fill="${P.accent}" fill-opacity="0.75" stroke="${P.accent}" stroke-width="1.5" transform="rotate(4.9 171.9 97.5)"/>
<rect x="162.3" y="101.9" width="16.5" height="5.2" rx="1.5" fill="${P.accent}" fill-opacity="0.75" stroke="${P.accent}" stroke-width="1.5" transform="rotate(16.7 170.5 104.5)"/>
<rect x="159.4" y="108.9" width="16.9" height="5.2" rx="1.5" fill="${P.accent}" fill-opacity="0.75" stroke="${P.accent}" stroke-width="1.5" transform="rotate(23.9 167.9 111.5)"/>
<rect x="155.8" y="115.9" width="17.3" height="5.2" rx="1.5" fill="${P.accent}" fill-opacity="0.75" stroke="${P.accent}" stroke-width="1.5" transform="rotate(27.2 164.5 118.5)"/>
<rect x="152" y="122.9" width="17.6" height="5.2" rx="1.5" fill="${P.accent}" fill-opacity="0.75" stroke="${P.accent}" stroke-width="1.5" transform="rotate(27.2 160.8 125.5)"/>
<rect x="148.4" y="129.9" width="18" height="5.2" rx="1.5" fill="${P.accent}" fill-opacity="0.75" stroke="${P.accent}" stroke-width="1.5" transform="rotate(23.9 157.4 132.5)"/>`,
    },
    {
      // Região lombar: 5 corpos grandes, curva convexa para a frente.
      svg: `<rect x="142.3" y="139.4" width="21" height="8" rx="1.5" fill="${P.beam}" fill-opacity="0.75" stroke="${P.beam}" stroke-width="1.5" transform="rotate(25.5 152.8 143.4)"/>
<rect x="136.9" y="150.2" width="21.8" height="8" rx="1.5" fill="${P.beam}" fill-opacity="0.75" stroke="${P.beam}" stroke-width="1.5" transform="rotate(21.9 147.8 154.2)"/>
<rect x="133.8" y="161" width="22.5" height="8" rx="1.5" fill="${P.beam}" fill-opacity="0.75" stroke="${P.beam}" stroke-width="1.5" transform="rotate(4.1 145 165)"/>
<rect x="134.4" y="171.8" width="23.3" height="8" rx="1.5" fill="${P.beam}" fill-opacity="0.75" stroke="${P.beam}" stroke-width="1.5" transform="rotate(-13.1 146 175.8)"/>
<rect x="137.6" y="182.6" width="24" height="8" rx="1.5" fill="${P.beam}" fill-opacity="0.75" stroke="${P.beam}" stroke-width="1.5" transform="rotate(-22.7 149.6 186.6)"/>`,
    },
    {
      // Sacro: 5 vértebras fundidas numa cunha inclinada, convexa para trás.
      svg: `<polygon points="142.8,200.2 144.9,202.6 147.2,204.8 149.4,206.8 151.6,208.7 153.7,210.4 155.8,212 157.7,213.5 159.4,215 161.6,217 163.8,218.8 165.8,220.5 167.6,221.9 169.1,223.3 170.3,224.4 180.2,219.6 179.1,216.7 177.7,214.1 176.3,211.5 174.9,209.2 173.6,207 172.6,205 171.2,202.5 169.7,200 168.3,197.6 166.9,195.3 165.6,193.2 164.6,191.2 163.8,189.4 163.4,187.8" fill="${P.electron}" fill-opacity="0.75" stroke="${P.electron}" stroke-width="1.5" stroke-linejoin="round"/>
<path d="M149.4,204.9 L163.9,193.1 M155.9,210.2 L167.9,199.8 M161.7,215.1 L171.9,206.9 M167.9,220.3 L175.9,213.7" stroke="${P.bg}" stroke-width="1.5" fill="none"/>`,
    },
    {
      // Cóccix: segmentos pequenos na ponta, curvados para a frente.
      svg: `<rect x="172.1" y="223.1" width="8" height="2.8" rx="1" fill="${P.accent}" transform="rotate(-7.2 176.1 224.5)"/>
<rect x="172.1" y="227.1" width="6" height="2.8" rx="1" fill="${P.accent}" transform="rotate(27.6 175.1 228.5)"/>
<rect x="171" y="230.6" width="4" height="2.8" rx="1" fill="${P.accent}" transform="rotate(30.1 173 232)"/>`,
    },
  ],
};
