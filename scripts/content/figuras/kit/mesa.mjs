// Mesa de exames radiograficos: base, coluna, tampo e gaveta do bucky. Comprimento ao longo de x.
import { k, helpers } from "./base.mjs";
export function mesa(P, { x = -110, y = -35, w = 220, d = 70, z = 78 }) {
  const { slab, shadow } = helpers(P);
  const o = [shadow(k.insetPlan({ x: x + 20, y: y - 14, w: w - 40, d: d + 28, r: 10 }, -4))];
  o.push(slab({ x: x + 50, y: y - 8, w: w - 100, d: d + 16, r: 6 }, 0, 10, { tone: "mid", className: "c-mach" }, 4, 1));
  o.push(slab({ x: x + w / 2 - 30, y: y + d / 2 - 14, w: 60, d: 28, r: 5 }, 10, z - 24, { tone: "hi", className: "c-mach" }, 4, 1));
  o.push(slab({ x: x + 30, y: y + 6, w: w - 60, d: d - 12, r: 4 }, z - 14, 10, { tone: "mid", className: "c-dark" }, 3, 0.6));
  o.push(slab({ x, y, w, d, r: 5 }, z - 4, 4, { tone: "hi", className: "c-mat" }, 4, 0.8));
  o.push(slab({ x: x + 30, y: y - 2, w: 34, d: 4, r: 1.5 }, z - 10, 6, { tone: "hi", className: "c-dark" }, 3, 0.3));
  return o.join("");
}
