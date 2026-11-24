// colimacao-pediatrica: a mesma criança duas vezes, deitada de costas em duas mesas, uma atrás da outra (a da frente à esquerda, a de trás à direita).
// Na da esquerda o campo de luz cobre o corpo todo, da cabeça aos pés; na da direita, só o tórax, com margem pequena. Sem tubo no quadro: a luz do colimador
// aparece como retângulo aceso sobre o corpo.
import { k } from "../kit/base.mjs";
import { pessoa } from "../kit/pessoa.mjs";
import { mesa } from "../kit/mesa.mjs";
import { projecao, sala, W, H } from "./comum/sala.mjs";
import { AMARELO, NUCLEO } from "./comum/campo.mjs";

/** As peças da cena em ordem de pintura: [{ id, svg }]. */
export function pecas() {
  const K = 0.62, YA = 45, YB = -45, XA = -22, XB = -9, ZP = 85.5;
  const P = projecao([[XA - 77, YA, 95], [XA + 65, YA, 85], [XB + 8, YB, 98], [XA - 77, YA + 20, 78]]);
  const opt = { pose: "deitada", idade: "crianca", facing: [1, 0, 0], roupa: "infantil" };
  const patch = (x0, x1, y, op) => `<path d="${k.pathOf([[x0, y - 19], [x1, y - 19], [x1, y + 19], [x0, y + 19]].map(([a, b]) => k.iso([a, b, 91], P)), true)}" fill="${AMARELO}" fill-opacity="${op}" stroke="${NUCLEO}" stroke-opacity=".95" stroke-width="2.4" stroke-linejoin="round"/>`;
  const bb = (pts) => { const q = pts.map((p) => k.iso(p, P)); return [Math.min(...q.map((p) => p[0])), Math.min(...q.map((p) => p[1])), Math.max(...q.map((p) => p[0])), Math.max(...q.map((p) => p[1]))]; };
  const caixa3 = (x0, x1, y0, y1, z0, z1) => bb(k.boxCorners({ x: x0, y: y0, w: x1 - x0, d: y1 - y0 }, z0, z1));
  // região mínima (0,08 x 0,08) centrada num ponto do corpo: o centro da parte, que cresce para os 44 pt do app
  const nucleo = (x, y, z) => { const [cx, cy] = k.iso([x, y, z], P); return [cx - 0.04 * W, cy - 0.04 * H, cx + 0.04 * W, cy + 0.04 * H]; };
  return [
    { id: "sala", svg: sala(P, { x0: -300, x1: 300, yF: 120, h: 330, yw: -112 }) },
    { id: "mesaB", svg: mesa(P, { x: -100, y: YB - 32, w: 200, d: 64, z: 78 }) },
    { id: "criancaB", svg: pessoa(P, [XB, YB, ZP], opt) },
    { id: "campoB", svg: patch(XB - 36, XB - 11, YB, 0.3) },
    { id: "mesaA", svg: mesa(P, { x: -100, y: YA - 32, w: 200, d: 64, z: 78 }) },
    { id: "criancaA", svg: pessoa(P, [XA, YA, ZP], opt) },
    { id: "campoA", svg: patch(XA - 58, XA + 66, YA, 0.22) },
  ];
}
