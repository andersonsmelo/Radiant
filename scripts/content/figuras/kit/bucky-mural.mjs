// Bucky mural (estativa de parede): base, coluna, carro e placa receptora voltada para +y.
import { k, helpers } from "./base.mjs";
export function buckyMural(P, { x = 0, y = -60, zPlaca = 90 }) {
  const { slab, shadow, cyl } = helpers(P);
  const o = [shadow({ x: x - 34, y: y - 10, w: 68, d: 46, r: 8 })];
  o.push(slab({ x: x - 30, y: y - 6, w: 60, d: 36, r: 5 }, 0, 6, { tone: "mid", className: "c-mach" }, 4, 0.8));
  o.push(slab({ x: x - 6, y: y - 4, w: 12, d: 10, r: 2 }, 6, 190, { tone: "hi", className: "c-mach" }, 3, 0.6));
  o.push(slab({ x: x - 26, y: y - 2, w: 52, d: 12, r: 3 }, zPlaca - 4, 60, { tone: "hi", className: "c-mach" }, 4, 0.8));
  o.push(slab({ x: x - 22, y: y + 10, w: 44, d: 3, r: 1.5 }, zPlaca, 52, { tone: "hi", className: "c-blue" }, 3, 0.4));
  for (const dx of [-30, 30]) o.push(cyl(x + dx, y + 8, 1.6, zPlaca + 6, 26, { tone: "mid", className: "c-dark" }, 10));
  o.push(slab({ x: x - 8, y: y + 2, w: 16, d: 8, r: 2 }, 196, 4, { tone: "mid", className: "c-dark" }, 3, 0.3));
  return o.join("");
}
