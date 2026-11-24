// Biombo plumbifero movel: pes, montantes, painel de chumbo e visor. Largura ao longo de x.
import { k, helpers } from "./base.mjs";
export function biombo(P, { x = 0, y = 0, w = 80, h = 170 }) {
  const { slab, shadow, wheel } = helpers(P);
  const o = [shadow({ x: x - 4, y: y - 12, w: w + 8, d: 40, r: 8 })];
  for (const fx of [x, x + w - 8]) { o.push(slab({ x: fx - 2, y: y - 8, w: 12, d: 28, r: 3 }, 3, 4, { tone: "mid", className: "c-dark" }, 3, 0.5)); o.push(wheel(fx + 4, y - 4, 3, "c-dark")); o.push(wheel(fx + 4, y + 16, 3, "c-dark")); }
  o.push(slab({ x, y, w: 5, d: 8, r: 1.5 }, 7, h - 7, { tone: "hi", className: "c-mach" }, 3, 0.4));
  o.push(slab({ x: x + w - 5, y, w: 5, d: 8, r: 1.5 }, 7, h - 7, { tone: "hi", className: "c-mach" }, 3, 0.4));
  o.push(slab({ x: x + 4, y: y + 1, w: w - 8, d: 6, r: 1.5 }, 30, h - 44, { tone: "hi", className: "c-lead" }, 3, 0.5));
  o.push(slab({ x: x + w / 2 - 14, y: y - 0.6, w: 28, d: 2, r: 1 }, h - 62, 24, { tone: "hi", className: "c-blue" }, 3, 0.3));
  o.push(slab({ x: x - 1, y: y - 1, w: w + 2, d: 10, r: 2 }, h - 4, 4, { tone: "mid", className: "c-mach" }, 3, 0.4));
  return o.join("");
}
