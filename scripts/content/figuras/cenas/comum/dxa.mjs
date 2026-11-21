// Ponto de vista e peças comuns às duas cenas do lote 2D (densitometria): azimute 55, elevação do kit, mesa do densitômetro (tampo fino sobre dois pedestais).
import { k, helpers } from "../../kit/base.mjs";
import { sala } from "./sala.mjs";
export const AZ = 50, EL = 40, W = 640, H = 480, ZM = 80;
export const proj = (pts, azimuth = AZ, elevation = EL) => k.fitProjection(pts, W, H, { pad: 6, azimuth, elevation });
export const caixa = (x0, x1, y0, y1, z0, z1) => k.boxCorners({ x: x0, y: y0, w: x1 - x0, d: y1 - y0 }, z0, z1);
export const bbox2 = (P, pts) => { const q = pts.map((p) => k.iso(p, P)); return [Math.min(...q.map((p) => p[0])), Math.min(...q.map((p) => p[1])), Math.max(...q.map((p) => p[0])), Math.max(...q.map((p) => p[1]))]; };
export const salaD = (P, o) => sala(P, o);
// bloco arredondado: x0..x1, y0..y1, z0..z1
export function bloco(P, [x0, x1, y0, y1, z0, z1], o, r = 2, bevel = 0.8) {
  const { slab } = helpers(P);
  return slab({ x: x0, y: y0, w: x1 - x0, d: y1 - y0, r }, z0, z1 - z0, o, 3, bevel);
}
// mesa: tampo (escuro) + colchão (claro) com a face de cima em z = ZM; dois pedestais sob as pontas (o meio fica livre, onde fica a fonte)
export function mesaD(P, { x0 = -112, x1 = 118, y = 0, d = 54 }) {
  const ped = [[x0 + 14, x0 + 38], [x1 - 38, x1 - 14]].map(([a, b]) => bloco(P, [a, b, y - d / 2 + 6, y + d / 2 - 6, 0, ZM - 9], { tone: "mid", className: "c-mach" }, 3, 1)).join("");
  const topo = bloco(P, [x0, x1, y - d / 2, y + d / 2, ZM - 9, ZM - 4], { tone: "mid", className: "c-dark" }, 5, 0.6) + bloco(P, [x0, x1, y - d / 2, y + d / 2, ZM - 4, ZM], { tone: "hi", className: "c-mat" }, 5, 0.9);
  return { ped, topo };
}
