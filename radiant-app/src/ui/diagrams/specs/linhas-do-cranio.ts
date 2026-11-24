import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, parado. Duas vistas da mesma cabeça. Na metade esquerda, perfil com a face para
// a esquerda: a linha orbitomeatal (amarela) sai do meato acústico externo, passa pelo canto
// externo do olho e segue à frente do rosto; a infraorbitomeatal (ciano) sai do mesmo meato e
// passa pela margem inferior da órbita. As duas abrem cerca de 7 graus entre si. Na metade
// direita, a cabeça de frente: a linha interpupilar (azul) atravessa as pupilas, e o plano
// sagital mediano, visto de lado, é a linha tracejada vertical que divide a cabeça ao meio. O
// lado direito do paciente fica à esquerda de quem vê.
export const linhasDoCranio: DiagramSpec = {
  id: 'linhas-do-cranio',
  alt: 'Cabeça de perfil com duas linhas que partem da orelha para o rosto, e cabeça de frente com uma linha horizontal pelos olhos e outra vertical no meio.',
  width: 320,
  height: 240,
  layers: [
    {
      // Perfil: contorno da cabeça e do pescoço, olho, margem infraorbital, orelha e meato.
      svg: `<path d="M150,232 C152,204 162,186 178,170 C198,148 200,96 184,66 C166,36 120,26 88,34 C62,42 48,62 46,84 C46,90 47,92 48,94 L30,124 L40,128 C43,133 39,138 41,142 L37,147 C40,152 40,160 46,166 C58,172 80,170 92,178 L96,232" fill="none" stroke="${P.line}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
<path d="M58,98 Q63,95 68,100 Q63,103 58,102 Z" fill="none" stroke="${P.line}" stroke-width="2" stroke-linejoin="round"/>
<path d="M55,110 Q63,112 71,108" fill="none" stroke="${P.muted}" stroke-width="2" stroke-linecap="round"/>
<path d="M136,98 C148,94 154,108 149,118 C146,126 140,129 135,124" fill="none" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round"/>
<circle cx="132" cy="110" r="4" fill="${P.bg}" stroke="${P.line}" stroke-width="2"/>`,
    },
    {
      // Linha orbitomeatal: do meato, pelo canto externo do olho, até à frente do rosto.
      svg: `<line x1="18" y1="92.2" x2="132" y2="110" stroke="${P.beam}" stroke-width="2.5" stroke-linecap="round"/>
<circle cx="68" cy="100" r="2.5" fill="${P.beam}"/>`,
    },
    {
      // Linha infraorbitomeatal: do meato, pela margem inferior da órbita.
      svg: `<line x1="44" y1="107.4" x2="132" y2="110" stroke="${P.electron}" stroke-width="2.5" stroke-linecap="round"/>
<circle cx="64" cy="108" r="2.5" fill="${P.electron}"/>`,
    },
    {
      // Frente: contorno da cabeça, orelhas, órbitas com os olhos, nariz, boca, pescoço e ombros.
      svg: `<path d="M252,36 C280,36 292,62 292,96 C292,128 280,154 262,162 C256,165 248,165 242,162 C224,154 212,128 212,96 C212,62 224,36 252,36 Z" fill="none" stroke="${P.line}" stroke-width="2.5"/>
<path d="M212,90 C206,92 206,108 213,112 M292,90 C298,92 298,108 291,112 M240,163 L240,190 C226,196 204,200 194,214 M264,163 L264,190 C278,196 300,200 310,214" fill="none" stroke="${P.line}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="236" cy="97" r="11" fill="none" stroke="${P.muted}" stroke-width="2"/>
<circle cx="268" cy="97" r="11" fill="none" stroke="${P.muted}" stroke-width="2"/>
<path d="M228,98 Q236,92 244,98 Q236,104 228,98 Z M260,98 Q268,92 276,98 Q268,104 260,98 Z" fill="none" stroke="${P.line}" stroke-width="2" stroke-linejoin="round"/>
<circle cx="236" cy="98" r="2.5" fill="${P.line}"/>
<circle cx="268" cy="98" r="2.5" fill="${P.line}"/>
<path d="M248,108 L245,126 L259,126 L256,108 M243,142 Q252,147 261,142" fill="none" stroke="${P.muted}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
    },
    {
      // Linha interpupilar.
      svg: `<line x1="198" y1="98" x2="306" y2="98" stroke="${P.accent}" stroke-width="2.5" stroke-linecap="round"/>`,
    },
    {
      // Plano sagital mediano, visto de lado como linha vertical.
      svg: `<line x1="252" y1="16" x2="252" y2="232" stroke="${P.line}" stroke-width="2.5" stroke-dasharray="7 5" stroke-linecap="round"/>`,
    },
  ],
};
