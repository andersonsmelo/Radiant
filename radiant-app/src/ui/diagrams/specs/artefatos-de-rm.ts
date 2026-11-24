import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240. Três cortes esquemáticos lado a lado, cada um com um artefato.
// 1, movimento: a estrutura clara do centro se repete em fantasmas cada vez mais
//    fracos ao longo de uma direção (a de codificação de fase), dentro e fora do corpo.
// 2, metal: vazio de sinal preto em volta do ponto metálico, com borda clara e
//    distorcida no lado em que o sinal se acumula.
// 3, dobra: o campo de visão (tracejado) é mais estreito que o corpo; o braço fora
//    dele reaparece dentro do campo, do lado oposto, deslocado de uma largura do campo.
const shade = (shape: string, o: number) =>
  `<${shape} fill="${P.bg}"/><${shape} fill="${P.line}" fill-opacity="${o}"/>`;
const body = (cx: number, rx: number, ry: number) =>
  `${shade(`ellipse cx="${cx}" cy="120" rx="${rx}" ry="${ry}"`, 0.3)}
<ellipse cx="${cx}" cy="120" rx="${rx}" ry="${ry}" fill="none" stroke="${P.muted}" stroke-width="1.5"/>`;

// 1: estrutura no centro e cópias a cada 34 de altura.
const ghosts = [-102, -68, -34, 34, 68, 102]
  .map((d) => `<ellipse cx="52" cy="${112 + d}" rx="14" ry="10" fill="${P.line}" fill-opacity="${[0.4, 0.26, 0.14][Math.abs(d) / 34 - 1]}"/>`)
  .join('');

// 2: vazio e a borda acumulada embaixo, ondulada.
const rim = 'M131 112 Q134 128 142 130 Q147 140 156 137 Q165 141 170 131 Q179 128 181 112 Q186 134 172 144 Q164 152 156 147 Q148 153 139 145 Q126 135 131 112 Z';
const voidShape = 'M131 112 Q128 92 140 82 Q152 72 166 78 Q182 86 181 112 Q179 128 170 131 Q165 141 156 137 Q147 140 142 130 Q134 128 131 112 Z';

// 3: campo de visão de x 210 a 278 (largura 68); o braço fora dele, em x 290,
// volta dobrado em x 222.
const FOV_L = 210;
const FOV_R = 278;
const ARM = 290;

export const artefatosDeRm: DiagramSpec = {
  id: 'artefatos-de-rm',
  alt: 'Três cortes ovais: um com cópias fracas da estrutura central, um com buraco preto de borda clara e torta, um com uma parte de fora repetida dentro.',
  width: 320,
  height: 240,
  layers: [
    {
      // 1: movimento.
      svg: `${body(52, 40, 56)}${ghosts}
<ellipse cx="52" cy="112" rx="14" ry="10" fill="${P.line}" fill-opacity="0.85"/>`,
    },
    {
      // 2: metal.
      svg: `${body(156, 42, 56)}
<path d="${rim}" fill="${P.line}" fill-opacity="0.9"/>
<path d="${voidShape}" fill="${P.bg}"/>
<circle cx="156" cy="104" r="3" fill="${P.muted}"/>`,
    },
    {
      // 3: dobra. Braço fora do campo (só o contorno) e o corpo dentro.
      svg: `<ellipse cx="${ARM}" cy="120" rx="9" ry="24" fill="none" stroke="${P.muted}" stroke-width="2" stroke-dasharray="4 3"/>
${body(244, 30, 54)}
<circle cx="248" cy="116" r="9" fill="${P.line}" fill-opacity="0.7"/>`,
    },
    {
      // A cópia dobrada, sobre a borda oposta do corpo, e o campo de visão.
      svg: `<ellipse cx="${ARM - (FOV_R - FOV_L)}" cy="120" rx="9" ry="24" fill="${P.line}" fill-opacity="0.45" stroke="${P.line}" stroke-width="1.5"/>
<rect x="${FOV_L}" y="56" width="${FOV_R - FOV_L}" height="128" fill="none" stroke="${P.accent}" stroke-width="2" stroke-dasharray="6 4"/>`,
    },
  ],
};
