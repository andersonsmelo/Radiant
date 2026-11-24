import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Gramática de gráficos (fase 3). Quadro 320x240, sem texto. Linha do tempo da vida de um equipamento: um eixo só, o
// tempo, com seta cheia. O tamanho do marco é o tamanho da pergunta que o teste responde (as cores são as que as
// aulas nomeiam): aceitação, o grande âmbar com o visto, no início; constância, três pequenos azuis regulares numa
// faixa azul tênue (a rotina que se repete); manutenção, a chave de boca sobre a linha, ligada ao eixo por pontilhado;
// e, logo depois do conserto, o médio ciano. Cada marco leva anel da cor do painel, que o separa do eixo.
// Figura com área de toque: parada. Posições dos alvos da aula (m32) preservadas: marcos em y 130 e x 48, 104 e 262; a
// chave em (222, 66). Diâmetros visíveis: grande 38, médio 27, pequeno 13. A faixa dos pequenos existe para a região
// do alvo cumprir o mínimo de 0,08 do verificador sem esticar a caixa além do objeto.
const AX = 130;
const ring = `stroke="${P.fill}" stroke-width="2.5"`;

export const cicloDeTestes: DiagramSpec = {
  id: 'ciclo-de-testes',
  alt: 'Linha do tempo de um equipamento: um marco grande no início, marcos pequenos e regulares, uma chave de boca e, logo depois, um marco médio.',
  width: 320,
  height: 240,
  layers: [
    { svg: `<rect x="8" y="8" width="304" height="224" rx="16" fill="${P.fill}"/>` },
    {
      // Eixo do tempo, com seta cheia, e o pontilhado que liga a manutenção a ele.
      svg: `<path d="M40 ${AX}H292" fill="none" stroke="${P.muted}" stroke-width="2.5" stroke-linecap="round"/>
<polygon points="304,${AX} 292,${AX - 5.5} 292,${AX + 5.5}" fill="${P.muted}"/>
<line x1="222" y1="98" x2="222" y2="${AX - 6}" stroke="${P.muted}" stroke-width="2" stroke-dasharray="2 5" stroke-linecap="round"/>`,
    },
    {
      // Constância: três marcos pequenos e regulares na faixa. Depois do conserto: um marco médio.
      svg: `<rect x="90" y="117" width="112" height="26" rx="13" fill="${P.accent}" fill-opacity="0.18"/>
<circle cx="104" cy="${AX}" r="7.75" fill="${P.accent}" ${ring}/>
<circle cx="146" cy="${AX}" r="7.75" fill="${P.accent}" ${ring}/>
<circle cx="188" cy="${AX}" r="7.75" fill="${P.accent}" ${ring}/>
<circle cx="262" cy="${AX}" r="14.75" fill="${P.electron}" ${ring}/>`,
    },
    {
      // Aceitação: o marco grande, com o visto.
      svg: `<circle cx="48" cy="${AX}" r="20.25" fill="${P.beam}" ${ring}/>
<polyline points="38,${AX} 45,${AX + 8} 58,${AX - 9}" fill="none" stroke="${P.bg}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,
    },
    {
      // Manutenção: chave de boca (cabo e cabeça num só contorno, com a boca aberta), a 45 graus.
      svg: `<path transform="translate(223 65) rotate(45) scale(0.85)" d="M-5 30V-0.9A14 14 0 0 1 -5 -27.1V-16H5V-27.1A14 14 0 0 1 5 -0.9V30A5 5 0 0 1 -5 30Z" fill="${P.bg}" stroke="${P.line}" stroke-width="3.5" stroke-linejoin="round"/>`,
    },
  ],
};
