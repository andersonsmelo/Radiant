// Pecas novas da cena pontos-de-contato-da-sala, no estilo do kit.
import { k, helpers } from "../kit/base.mjs";
import { cabecote, colimador } from "../kit/tubo.mjs";
import { YW, hx, ln } from "./comum/sala.mjs";
// barra de apoio do receptor vertical: alca em U que sai da placa, na altura do peito
export function barraDeApoio(P, { x, y, z = 112 }) {
  const { tube, slab } = helpers(P);
  const o = [];
  for (const dx of [-46, 46]) o.push(slab({ x: x + dx - 4, y: y + 2, w: 8, d: 8, r: 2 }, z - 5, 10, { tone: "mid", className: "c-dark" }, 3, 0.3));
  o.push(tube([[x - 46, y + 8, z], [x - 46, y + 32, z], [x + 46, y + 32, z], [x + 46, y + 8, z]], 4.2, { tone: "hi", fillet: 6 }));
  return o.join("");
}
// tubo suspenso: trilho no teto, carro, coluna telescopica, cabecote, colimador e manopla lateral (para o espectador)
export function tuboDeTeto(P, { x, y = 0, zc = 198, parte = "corpo" }) {
  const { slab, cyl, tube } = helpers(P);
  const o = [], corpo = parte === "corpo", man = parte === "manopla";
  if (corpo) {
  o.push(slab({ x: x - 56, y: y - 5, w: 160, d: 10, r: 2 }, 236, 9, { tone: "mid", className: "c-mach" }, 3, 0.5));
  o.push(slab({ x: x - 16, y: y - 9, w: 32, d: 18, r: 3 }, 222, 15, { tone: "hi", className: "c-mach" }, 3, 0.6));
  o.push(cyl(x, y, 6.5, zc + 9, 223 - zc - 9, { tone: "hi", className: "c-mach" }, 18));
  o.push(cyl(x, y, 8, 220, 4, { tone: "mid", className: "c-dark" }, 18));
  o.push(colimador(P, { f0: [x, y, zc - 6], b: [0, 0, -1] }));
  o.push(cabecote(P, { f0: [x - 0.1, y, zc], eixo: [1, 0, 0] }));
  }
  // manopla lateral: alca em U na frente do cabecote
  if (man) {
  o.push(slab({ x: x - 22, y: y + 8, w: 8, d: 8, r: 2 }, zc - 6, 12, { tone: "mid", className: "c-dark" }, 3, 0.3));
  o.push(slab({ x: x + 14, y: y + 8, w: 8, d: 8, r: 2 }, zc - 6, 12, { tone: "mid", className: "c-dark" }, 3, 0.3));
  o.push(tube([[x - 18, y + 10, zc], [x - 18, y + 46, zc], [x + 18, y + 46, zc], [x + 18, y + 10, zc]], 4.6, { tone: "hi", fillet: 6 }));
  }
  return o.join("");
}
// mesa do comando: tampo, pernas, monitor com a tela e teclado com as fileiras de teclas
export function comando(P, { x, y = -70, z = 74, parte = "corpo" }) {
  const { slab, shadow } = helpers(P);
  const o = [], t = z + 5;
  if (parte === "corpo") {
  o.push(shadow({ x: x - 52, y: y - 30, w: 104, d: 70, r: 6 }));
  for (const [dx, dy] of [[-56, -26], [50, -26], [-56, 26], [50, 26]]) o.push(slab({ x: x + dx, y: y + dy - 2, w: 6, d: 6, r: 1 }, 0, z, { tone: "mid", className: "c-dark" }, 3, 0.3));
  o.push(slab({ x: x - 62, y: y - 30, w: 124, d: 66, r: 4 }, z, 5, { tone: "hi", className: "c-mat" }, 4, 0.6));
  o.push(slab({ x: x - 8, y: y - 18, w: 16, d: 8, r: 2 }, t, 6, { tone: "mid", className: "c-dark" }, 3, 0.3));
  o.push(slab({ x: x - 26, y: y - 20, w: 52, d: 4, r: 2 }, t + 6, 34, { tone: "hi", className: "c-dark" }, 3, 0.4));
  const ys = y - 15.6, zs = t + 9;
  o.push(`<path class="screen" d="${k.pathOf([[x - 22, zs], [x + 22, zs], [x + 22, zs + 26], [x - 22, zs + 26]].map(([a, b]) => k.iso([a, ys, b], P)), true)}"/>`);
  } else {
  // teclado: base e tres fileiras de teclas
  o.push(slab({ x: x - 44, y: y - 2, w: 88, d: 36, r: 4 }, t, 5, { tone: "hi", className: "c-mach" }, 3, 0.5));
  for (const dy of [8, 16, 24]) o.push(`<path d="${k.pathOf([[x - 38, y + dy], [x + 38, y + dy]].map(([a, b]) => k.iso([a, b, t + 5], P)))}" fill="none" stroke="${hx.lo}" stroke-width=".9" stroke-dasharray="1.6 1.4" stroke-linecap="round"/>`);
  }
  return o.join("");
}
