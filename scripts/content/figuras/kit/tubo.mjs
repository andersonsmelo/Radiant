// Tubo de raios X: aparelho movel (carro + coluna), braco, cabecote, colimador e feixe. Mundo em cm, z para cima.
import { k, G, helpers, roundRect, at } from "./base.mjs";
const Y = [0, 1, 0];

// carro com painel e coluna; (ux, yc) = centro da coluna
export function aparelhoMovel(P, { ux, yc = -121 }) {
  const { S, L, slab, cyl, tube, shadow, wheel } = helpers(P);
  const o = [];
  const base = { x: ux - 24, y: yc - 29, w: 108, d: 54, r: 8 };
  o.push(shadow(k.insetPlan(base, -5)));
  for (const [x, y, r] of [[ux - 14, yc - 25, 5.5], [ux + 72, yc - 25, 8.5]]) o.push(wheel(x, y, r));
  o.push(slab(base, 9, 10, { tone: "mid", className: "c-mach" }, 6, 1));
  for (const [x, y, r] of [[ux - 14, yc + 25, 5.5], [ux + 72, yc + 25, 8.5]]) o.push(wheel(x, y, r));
  const cab = { x: ux + 8, y: yc - 25, w: 70, d: 46, r: 6 };
  o.push(slab(cab, 19, 72, { tone: "hi", className: "c-mach" }, 5, 1.2));
  o.push(L(k.sideSeam(cab, 30, P, 5) + k.sideSeam(cab, 78, P, 5), { tone: "lo" }));
  const panel = { x: cab.x + 6, y: cab.y + 6, w: 40, d: 34, r: 3 };
  o.push(slab(panel, 91, 3, { tone: "mid", className: "c-dark" }, 3, 0.5));
  o.push(`<path class="screen" d="${k.onTop(k.ringOf({ x: panel.x + 4, y: panel.y + 5, w: 20, d: 24, r: 1.5 }, 3), 94, P, true)}"/>`);
  o.push(tube([[cab.x + cab.w, yc - 17, 84], [cab.x + cab.w + 12, yc - 17, 92], [cab.x + cab.w + 12, yc + 13, 92], [cab.x + cab.w, yc + 13, 84]], 1.8, { tone: "hi" }));
  o.push(cyl(ux, yc, 11, 19, 7, { tone: "mid", className: "c-mach" }, 24));
  o.push(slab({ x: ux - 7, y: yc - 7, w: 14, d: 14, r: 2.5 }, 26, 192, { tone: "hi", className: "c-mach" }, 3, 0.6));
  o.push(slab({ x: ux - 8, y: yc - 8, w: 16, d: 16, r: 3 }, 218, 3, { tone: "mid", className: "c-mach" }, 3, 0.4));
  return o.join("");
}
// cabecote (carcaca cilindrica do tubo, com eixo ao longo de x) centrado em f0
export function cabecote(P, { f0, eixo = [1, 0, 0] }) {
  const { S } = helpers(P);
  const FH = G.frameAlong([f0[0] - 18, f0[1], f0[2]], eixo);
  return S(G.solidOf([[0, 7.5], [1.6, 9.5, 1], [34.4, 9.5, 1], [36, 7.5]], FH, P, { steps: 20 }), { tone: "hi", className: "c-mach" });
}
// colimador: caixa sob o cabecote, voltada para o feixe b
export function colimador(P, { f0, b }) {
  const { S } = helpers(P);
  const v = G.cross3(b, Y), FC = G.frameOf(f0, b, Y, v);
  return S(G.prismOf(FC, roundRect(-8, 8, -8, 8, 2), 8, 20, P), { tone: "hi", className: "c-mach" }) + S(G.prismOf(FC, roundRect(-6, 6, -6, 6, 1.5), 20, 22, P), { tone: "mid", className: "c-dark" });
}
// braco horizontal que sai da coluna (ux, yc, topo za) ate o cabecote em f0 (a pino em y = f0[1])
export function braco(P, { ux, yc = -121, za, f0 }) {
  const { slab, cyl } = helpers(P);
  const yt = f0[1];
  return slab({ x: ux - 10, y: yc - 10, w: 20, d: 20, r: 3 }, za - 6, 20, { tone: "hi", className: "c-mach" }, 3, 0.6)
    + slab({ x: ux - 6, y: yc + 10, w: 12, d: yt - 53 - (yc + 10), r: 2 }, za - 1, 10, { tone: "hi", className: "c-mach" }, 3, 0.5)
    + slab({ x: ux - 4.5, y: yt - 53, w: 9, d: 57, r: 2 }, za, 8, { tone: "hi", className: "c-mach" }, 3, 0.4)
    + cyl(ux, yt, 4.2, f0[2] + 8, 6, { tone: "mid", className: "c-dark" }, 14);
}
export const tuboCompleto = (P, o) => braco(P, o) + cabecote(P, o) + colimador(P, o);
// feixe: do colimador (saida 10 x 10 a 22 cm de f0) ate o campo no detector (centro c, eixos u e v, lado campo)
export function feixe(P, { f0, b, c, u = [-0.4226, 0, 0.9063], v = Y, campo = 32, id = "gx" }) {
  const { p2 } = helpers(P);
  const h = campo / 2;
  const exit = [[-5, -5], [5, -5], [5, 5], [-5, 5]].map(([a, bb]) => at(f0, [b, 22], [v, a], [u, bb]));
  const field = [[-h, -h], [h, -h], [h, h], [-h, h]].map(([a, bb]) => at(c, [v, a], [u, bb]));
  const hull = G.hullOf([...exit, ...field].map(p2));
  const [a, bb] = [p2(at(f0, [b, 22])), p2(c)];
  const grad = `<defs><linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${bb[0].toFixed(1)}" y2="${bb[1].toFixed(1)}"><stop offset="0" stop-opacity=".75"/><stop offset="1" stop-opacity=".22"/></linearGradient></defs>`;
  const edges = exit.map((e, i) => k.pathOf([p2(e), p2(field[i])])).join("");
  return `${grad}<g><path class="beam-fill" fill="url(#${id})" d="${k.pathOf(hull, true)}"/><path class="beam-edge" d="${edges}"/><path class="beam-core" d="${k.pathOf([a, bb])}"/></g>`;
}
