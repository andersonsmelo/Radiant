import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Sala de raios X vista de frente, com cinco situações lado a lado:
// da esquerda para a direita, a porta aberta sob a lâmpada de exposição acesa (risco), o campo
// de luz que cobre o paciente inteiro, com a região de interesse pequena dentro (risco), o
// acompanhante ao lado da mesa, sem avental, no caminho do espalhamento (risco), o operador
// atrás do biombo (correto) e o avental pendurado no suporte (correto). O avental é sempre a
// mesma forma azul; a figura não tem texto, e quem rotula cada situação é o conteúdo.
export const salaComRiscos: DiagramSpec = {
  id: 'sala-com-riscos',
  alt: 'Sala de raios X de frente: porta aberta sob a lâmpada acesa, tubo com campo de luz sobre o paciente, acompanhante, operador atrás do biombo e avental.',
  width: 320,
  height: 240,
  layers: [
    {
      // Piso e trilho do teto.
      svg: `<line x1="8" y1="214" x2="312" y2="214" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>
<line x1="60" y1="14" x2="156" y2="14" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      // Porta aberta: batente, folha de lado e maçaneta; acima, a lâmpada de exposição acesa.
      svg: `<rect x="12" y="76" width="36" height="138" fill="none" stroke="${P.muted}" stroke-width="3" stroke-linejoin="round"/>
<polygon points="12,76 34,86 34,204 12,214" fill="${P.fill}" stroke="${P.line}" stroke-width="3" stroke-linejoin="round"/>
<circle cx="30" cy="146" r="2.5" fill="${P.line}"/>
<rect x="17" y="33" width="26" height="26" rx="5" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>
<circle cx="30" cy="46" r="6" fill="${P.beam}"/>
<path d="M30 22 V28 M10 46 H12 M48 46 H50 M16 28 L19 31 M44 28 L41 31" stroke="${P.beam}" stroke-width="2.5" stroke-linecap="round" fill="none"/>`,
    },
    {
      // Campo de luz: do colimador, abre até cobrir a mesa e o paciente inteiros.
      svg: `<polygon points="98,62 118,62 158,150 58,150" fill="${P.beam}" fill-opacity="0.22" stroke="${P.beam}" stroke-width="2.5" stroke-linejoin="round"/>`,
    },
    {
      // Tubo no trilho, colimador, mesa com pedestal, paciente deitado e a região de interesse, pequena.
      svg: `<line x1="108" y1="14" x2="108" y2="26" stroke="${P.muted}" stroke-width="3"/>
<rect x="88" y="26" width="40" height="26" rx="6" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<polygon points="96,52 120,52 124,62 92,62" fill="${P.fill}" stroke="${P.muted}" stroke-width="3" stroke-linejoin="round"/>
<rect x="95" y="160" width="26" height="54" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>
<rect x="58" y="150" width="100" height="10" rx="3" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<circle cx="70" cy="141" r="9" fill="none" stroke="${P.muted}" stroke-width="3"/>
<rect x="80" y="133" width="74" height="17" rx="8" fill="none" stroke="${P.muted}" stroke-width="3"/>
<rect x="104" y="124" width="24" height="22" rx="3" fill="none" stroke="${P.line}" stroke-width="2.5" stroke-dasharray="4 4"/>`,
    },
    {
      // Acompanhante ao lado da mesa, sem avental, com o espalhamento chegando nele.
      svg: `<line x1="150" y1="118" x2="182" y2="140" stroke="${P.beam}" stroke-width="3" stroke-dasharray="6 5" stroke-linecap="round"/>
<line x1="156" y1="130" x2="182" y2="152" stroke="${P.beam}" stroke-width="3" stroke-dasharray="6 5" stroke-linecap="round"/>
<circle cx="196" cy="122" r="9" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="184" y="133" width="24" height="40" rx="7" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<path d="M190 173 V214 M202 173 V214" stroke="${P.line}" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      // Biombo com vidro e o operador atrás dele.
      svg: `<rect x="226" y="96" width="12" height="118" rx="2" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<rect x="229" y="106" width="6" height="34" fill="${P.accent}" fill-opacity="0.5"/>
<circle cx="262" cy="122" r="9" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="250" y="133" width="24" height="40" rx="7" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<path d="M256 173 V214 M268 173 V214" stroke="${P.line}" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      // Avental pendurado no suporte da parede.
      svg: `<line x1="272" y1="48" x2="304" y2="48" stroke="${P.line}" stroke-width="3" stroke-linecap="round"/>
<path d="M283 48 C283 58 293 58 293 48" fill="none" stroke="${P.accent}" stroke-width="3"/>
<polygon points="278,56 298,56 301,64 299,94 277,94 275,64" fill="${P.accent}" fill-opacity="0.35" stroke="${P.accent}" stroke-width="3" stroke-linejoin="round"/>`,
    },
  ],
};
