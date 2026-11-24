import { P } from '../diagramPalette';
import type { DiagramSpec } from '../diagramTypes';

// Quadro 320x240, três faixas de 80 empilhadas, todas com o mesmo pico (28).
// (a) alternada: dois ciclos, zero em y=40. (b) onda completa: só os meios ciclos
// positivos, cada um cai a zero (linha de base y=120). (c) quase constante:
// ondulação pequena logo abaixo do pico (linha de base y=200).
const X0 = 24;
const X1 = 304;
const PEAK = 28;
const r1 = (v: number) => Math.round(v * 10) / 10;
const trace = (base: number, f: (x: number) => number) => {
  const pts: string[] = [];
  for (let x = X0; x <= X1; x += 2) pts.push(`${x},${r1(base + f(x))}`);
  return pts;
};
const area = (base: number, pts: string[]) => `M${X0},${base} L${pts.join(' L')} L${X1},${base} Z`;
const S = 2 * Math.PI * 2 / (X1 - X0); // dois ciclos de rede entre X0 e X1
const sine = (x: number) => Math.sin(S * (x - X0));

const a = trace(40, (x) => -PEAK * sine(x));
const b = trace(120, (x) => -PEAK * Math.abs(sine(x)));
// Ondulação de 5: sobe de zero ao pico em 12 unidades e oscila com período 35.
const c = trace(200, (x) => {
  const ripple = 2.5 * (1 - Math.cos((2 * Math.PI * (x - X0)) / 35));
  const rise = Math.min(1, (x - X0) / 12);
  return -(PEAK - ripple) * Math.sin((rise * Math.PI) / 2);
});
const stroke = `fill="none" stroke="${P.accent}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;

export const retificacaoDeOnda: DiagramSpec = {
  id: 'retificacao-de-onda',
  alt: 'Três traçados de tensão empilhados: onda alternada, onda retificada que cai a zero a cada meio ciclo e tensão quase constante com ondulação pequena.',
  width: 320,
  height: 240,
  layers: [
    {
      // Linhas de base e eixos de tensão de cada faixa.
      svg: `<g stroke="${P.muted}" stroke-width="2" stroke-linecap="round">
<line x1="${X0 - 8}" y1="40" x2="${X1 + 8}" y2="40"/><line x1="${X0 - 8}" y1="120" x2="${X1 + 8}" y2="120"/><line x1="${X0 - 8}" y1="200" x2="${X1 + 8}" y2="200"/>
<line x1="${X0 - 8}" y1="8" x2="${X0 - 8}" y2="72"/><line x1="${X0 - 8}" y1="86" x2="${X0 - 8}" y2="122"/><line x1="${X0 - 8}" y1="164" x2="${X0 - 8}" y2="202"/>
</g>`,
    },
    { svg: `<path d="${area(40, a)}" fill="${P.accent}" fill-opacity="0.15" stroke="none"/><polyline points="${a.join(' ')}" ${stroke}/>` },
    { svg: `<path d="${area(120, b)}" fill="${P.accent}" fill-opacity="0.15" stroke="none"/><polyline points="${b.join(' ')}" ${stroke}/>` },
    { svg: `<path d="${area(200, c)}" fill="${P.accent}" fill-opacity="0.15" stroke="none"/><polyline points="${c.join(' ')}" ${stroke}/>` },
  ],
};
