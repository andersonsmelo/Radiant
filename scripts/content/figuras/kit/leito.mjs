// Leito hospitalar com colchao, cabeceira, grades e encosto reclinavel; manta e pe da cama. Cabeceira em -x.
import { k, G, helpers, roundRect, frame3 } from "./base.mjs";
const Y = [0, 1, 0];
export function leito(P, { x0 = -104, w = 208, colchao = [-30, 130], encosto = null, cabeceira = true, pernas = null, grades = true }) {
  const { S, slab, cyl, tube, shadow, wheel } = helpers(P);
  const o = [];
  const frame = { x: x0, y: -46, w, d: 92, r: 4 };
  o.push(shadow(k.insetPlan(frame, -6)));
  const legs = (pernas ?? k.corners({ x: x0, y: -46, w, d: 92 }, 8)).slice().sort((a, b) => k.depthOf([...a, 0], P) - k.depthOf([...b, 0], P));
  for (const [x, y] of legs) { o.push(cyl(x, y, 2.6, 11, 36, { tone: "mid", className: "c-bed" }, 12)); o.push(wheel(x, y, 4.5, "c-dark")); }
  o.push(slab({ x: x0 + 8, y: -40, w: w - 16, d: 80, r: 3 }, 30, 3, { tone: "lo", className: "c-bed" }, 3, 0.3));
  o.push(slab(frame, 46, 8, { tone: "mid", className: "c-bed" }, 3, 0.6));
  if (cabeceira) {
    o.push(slab({ x: x0 - 8, y: -46, w: 6, d: 92, r: 2 }, 36, 78, { tone: "mid", className: "c-bed" }, 3, 0.6));
    o.push(slab({ x: x0 + 4, y: -44, w: 70, d: 88, r: 4 }, 54, 2, { tone: "lo", className: "c-bed" }, 3, 0.3));
  }
  const mat = { x: colchao[0], y: -44, w: colchao[1], d: 88, r: 8 };
  o.push(slab(mat, 54, 10, { tone: "mid", className: "c-mat" }, 6, 1.2));
  if (grades) {
    for (const x of [mat.x + 16, mat.x + mat.w - 70]) o.push(cyl(x, -46.5, 1.4, 54, 24, { tone: "mid", className: "c-bed" }, 10));
    o.push(slab({ x: mat.x + 10, y: -48, w: 86, d: 3, r: 1.2 }, 76, 4, { tone: "mid", className: "c-bed" }, 2, 0.3));
  }
  if (encosto) {
    const { hinge, D, N } = encosto;
    const FB = G.frameOf([hinge[0], -42, hinge[2]], Y, D, N);
    o.push(S(G.prismOf(FB, roundRect(-2, 80, -3, 0, 1.2), 0, 84, P), { tone: "mid", className: "c-bed" }));
    o.push(S(G.prismOf(FB, roundRect(0, 78, 0, 8, 3), 2, 82, P), { tone: "mid", className: "c-mat" }));
  }
  return o.join("");
}
export const peDoLeito = (P, { x, alto = 40 }) => helpers(P).slab({ x, y: -46, w: 6, d: 92, r: 2 }, 38, alto, { tone: "mid", className: "c-bed" }, 3, 0.6);
// manta sobre as pernas: plano {x,y,w,d,r}, topo em z
export const manta = (P, plan, z = 64, alto = 15) => helpers(P).slab(plan, z, alto, { tone: "hi", className: "c-blanket" }, 6, 1.4);
