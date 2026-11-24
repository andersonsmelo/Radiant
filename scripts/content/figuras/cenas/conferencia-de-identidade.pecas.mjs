// Pecas novas da cena conferencia-de-identidade, no estilo do kit.
import { k, G, helpers, at } from "../kit/base.mjs";
import { xp, wp, wcirc, ln, hx } from "./comum/sala.mjs";
// pulseira: anel azul em volta do punho (eixo ao longo do braco)
export function pulseira(P, { w, eixo = [1, 0, 0], r = 8, larg = 20 }) {
  const { S } = helpers(P);
  const F = G.frameAlong(at(w, [eixo, -larg / 2]), eixo);
  return S(G.solidOf([[0, r - 0.5], [0.5, r, 1], [larg - 0.5, r, 1], [larg, r - 0.5]], F, P, { steps: 14 }), { tone: "hi", className: "c-blue" });
}
// folha do pedido na mao: papel fino com a face voltada para +y (para quem olha) e linhas de campos
export function folha(P, { w, largura = 40, alto = 52 }) {
  const { slab } = helpers(P);
  const x0 = w[0] - largura + 10, y0 = w[1], z0 = w[2] - 10;
  let o = slab({ x: x0, y: y0, w: largura, d: 1.6, r: 0.4 }, z0, alto, { tone: "hi", className: "c-shirt" }, 2, 0.2);
  const yf = y0 + 1.7;
  o += wp(P, yf, [[x0 + 5, z0 + alto - 8], [x0 + largura - 5, z0 + alto - 8]], ln(hx.lo, 1.2), false);
  for (const dz of [14, 22, 30]) o += wp(P, yf, [[x0 + 5, z0 + dz], [x0 + largura - 5 - (dz === 14 ? 12 : 0), z0 + dz]], ln(hx.lo, 1), false);
  o += wp(P, yf, [[x0 + largura - 16, z0 + 5], [x0 + largura - 5, z0 + 5], [x0 + largura - 5, z0 + 11], [x0 + largura - 16, z0 + 11]], `fill="${hx.azul}" stroke="${hx.azulBorda}" stroke-width=".4"`);
  return o;
}
// monitor do sistema em pedestal: base, haste, moldura azul, tela com foto e campos
export function monitorPedestal(P, { x, y, z = 104, w = 84, h = 60, parte = "pedestal" }) {
  const { slab, cyl, shadow } = helpers(P);
  const o = [], s = w / 56;
  if (parte === "pedestal") {
  o.push(shadow({ x: x - 30, y: y - 22, w: 60, d: 44, r: 8 }));
  o.push(slab({ x: x - 26, y: y - 18, w: 52, d: 40, r: 7 }, 0, 4, { tone: "mid", className: "c-mach" }, 4, 0.5));
  o.push(cyl(x, y, 2.8, 4, z - 4, { tone: "mid", className: "c-dark" }, 12));
  return o.join("");
  }
  o.push(slab({ x: x - w / 2, y: y - 2.5, w, d: 5, r: 2.5 }, z, h, { tone: "hi", className: "c-blue" }, 3, 0.5));
  const yf = y + 2.9, zs = z + 4, c = (a, b) => [x - w / 2 + a, zs + b];
  o.push(`<path class="screen" d="${k.pathOf([c(4, 0), c(w - 4, 0), c(w - 4, h - 8 * s), c(4, h - 8 * s)].map(([a, b]) => k.iso([a, yf, b], P)), true)}"/>`);
  o.push(wcirc(P, yf + 0.1, x - w / 2 + 15 * s, zs + 20 * s, 7 * s, ln(hx.papel, 1.3), 16));
  for (const [dz, l] of [[26, 22], [19, 22], [12, 22], [5, 20]]) o.push(wp(P, yf + 0.1, [[x - w / 2 + 27 * s, zs + dz * s], [x - w / 2 + (27 + l) * s, zs + dz * s]], ln(hx.papel, 1.3), false));
  return o.join("");
}
