import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Sala de fluoroscopia de lado, com o tubo sob a mesa. A radiação
// espalhada sai do paciente em leque e é mais forte do lado do tubo (abaixo da mesa, na
// altura das pernas): sete raios grossos embaixo, três finos e fracos em cima. O saiote
// plumbífero pendurado na lateral da mesa barra os raios de baixo; o avental e o protetor
// de tireoide barram os de cima. O operador está junto à mesa; o biombo móvel e a segunda
// pessoa ficam mais longe. Simplificação: o operador fica ao lado do fim da mesa, no plano
// do desenho, em vez de à frente dela.
const O = { x: 96, y: 108 };
const ray = (x: number, y: number, w: number, o: number, dash = '') =>
  `<line x1="${O.x}" y1="${O.y}" x2="${x}" y2="${y}" stroke="${P.beam}" stroke-width="${w}" stroke-opacity="${o}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
const person = (cx: number) =>
  `<circle cx="${cx}" cy="50" r="8" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<rect x="${cx - 11}" y="62" width="22" height="80" rx="8" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>
<path d="M${cx - 5} 142 V206 M${cx + 5} 142 V206" stroke="${P.line}" stroke-width="3" stroke-linecap="round"/>`;

export const salaDeFluoroscopiaEspalhada: DiagramSpec = {
  id: 'sala-de-fluoroscopia-espalhada',
  alt: 'Sala de fluoroscopia de lado: do paciente sai radiação em leque, com raios mais grossos sob a mesa; operador de avental, saiote, biombo e outra pessoa.',
  width: 320,
  height: 240,
  layers: [
    {
      // Chão, pedestal da mesa e tampo.
      svg: `<line x1="8" y1="206" x2="312" y2="206" stroke="${P.muted}" stroke-width="3" stroke-linecap="round"/>
<rect x="140" y="126" width="20" height="80" fill="${P.fill}" stroke="${P.muted}" stroke-width="3"/>
<rect x="20" y="118" width="156" height="8" rx="3" fill="${P.fill}" stroke="${P.line}" stroke-width="3"/>`,
    },
    {
      // Braço do teto e receptor, tubo sob a mesa, feixe útil fino e paciente.
      svg: `<line x1="96" y1="0" x2="96" y2="40" stroke="${P.muted}" stroke-width="3"/>
<rect x="56" y="40" width="80" height="18" rx="5" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<rect x="74" y="152" width="44" height="24" rx="6" fill="${P.fill}" stroke="${P.accent}" stroke-width="3"/>
<polygon points="90,152 102,152 124,62 68,62" fill="${P.beam}" fill-opacity="0.2"/>
<circle cx="36" cy="107" r="8" fill="none" stroke="${P.muted}" stroke-width="3"/>
<rect x="46" y="98" width="124" height="20" rx="9" fill="none" stroke="${P.muted}" stroke-width="3"/>`,
    },
    {
      // Espalhada forte, do lado do tubo: raios grossos até o saiote.
      svg: [134, 146, 158, 170, 182, 194, 204].map((y) => ray(176, y, 3, 0.9)).join(''),
    },
    {
      // Espalhada fraca, do lado do receptor: raios finos até o operador.
      svg: [ray(196, 62, 1.5, 0.5, '5 5'), ray(196, 82, 1.5, 0.5, '5 5'), ray(150, 60, 1.5, 0.4, '5 5')].join(''),
    },
    {
      // Saiote plumbífero pendurado na lateral da mesa.
      svg: `<rect x="176" y="126" width="8" height="78" rx="2" fill="${P.accent}" fill-opacity="0.45" stroke="${P.accent}" stroke-width="3" stroke-linejoin="round"/>`,
    },
    {
      // Operador: cabeça, protetor de tireoide, avental e pernas.
      svg: `${person(208)}
<rect x="199" y="57" width="18" height="10" rx="4" fill="${P.accent}" fill-opacity="0.6" stroke="${P.accent}" stroke-width="3"/>
<rect x="195" y="68" width="26" height="74" rx="6" fill="${P.accent}" fill-opacity="0.35" stroke="${P.accent}" stroke-width="3"/>`,
    },
    {
      // Biombo móvel: painel de vidro plumbífero sobre pés.
      svg: `<rect x="256" y="52" width="12" height="136" rx="2" fill="${P.accent}" fill-opacity="0.25" stroke="${P.accent}" stroke-width="3"/>
<path d="M250 188 H274 M262 188 V206" stroke="${P.accent}" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      // Segunda pessoa, mais longe, atrás do biombo.
      svg: person(292),
    },
  ],
};
