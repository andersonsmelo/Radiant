// Sala de exame comum as tres cenas do lote 2A: mesmo ponto de vista (azimute 58, elevacao 30), mesma parede, piso e porta.
// Mundo em cm, z para cima; a parede de fundo fica no plano y = YW e as coisas penduradas nela olham para +y (o espectador).
import { k, helpers } from "../../kit/base.mjs";
export const AZ = 68, YW = -150, W = 640, H = 480;
export const projecao = (pts) => k.fitProjection(pts, W, H, { pad: 10, azimuth: AZ });
const hx = { amarelo: "#FFC21A", nucleo: "#FFE08A", azul: "#4A9EFF", azulBorda: "#9CCBFF", mid: "#9AA3B5", lo: "#5D6679", papel: "#1C212B", claro: "#E6E8EE", verde: "#3FA66A", verdeBorda: "#A6E3BC" };
export { hx };
// desenho cru sobre o plano da parede (y fixo): pontos [x, z]
export const wp = (P, y, pts, attrs, closed = true) => `<path d="${k.pathOf(pts.map(([x, z]) => k.iso([x, y, z], P)), closed)}" ${attrs}/>`;
export const wcirc = (P, y, cx, cz, r, attrs, n = 20) => wp(P, y, Array.from({ length: n }, (_, i) => [cx + r * Math.cos((i / n) * 2 * Math.PI), cz + r * Math.sin((i / n) * 2 * Math.PI)]), attrs);
// desenho cru sobre um plano de x fixo: pontos [y, z]
export const xp = (P, x, pts, attrs, closed = true) => `<path d="${k.pathOf(pts.map(([y, z]) => k.iso([x, y, z], P)), closed)}" ${attrs}/>`;
export const ln = (c, w = 0.6) => `fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
export function sala(P, { x0, x1, yF = 70, h = 245, yw = YW }) {
  const { slab } = helpers(P);
  return [
    slab({ x: x0, y: yw - 6, w: x1 - x0, d: 6, r: 0.01 }, 0, h, { tone: "lo", className: "c-wall" }, 2, 0),
    slab({ x: x0, y: yw, w: x1 - x0, d: yF - yw, r: 0.01 }, -4, 4, { tone: "lo", className: "c-bed" }, 2, 0),
    slab({ x: x0, y: yw, w: x1 - x0, d: 2, r: 0.01 }, 0, 8, { tone: "lo", className: "c-dark" }, 2, 0),
  ].join("");
}
// porta na parede: batente, folha, e opcionalmente macaneta de alavanca, barra de empurrar e placa de saida com seta
export function porta(P, { x, w = 82, h = 205, alavanca = false, barra = false, placa = false, parte = "tudo" }) {
  const { slab, shadow } = helpers(P);
  const o = [];
  if (parte === "alavanca") { const q = porta(P, { x, w, h, alavanca, parte: "so-alavanca" }); return q; }
  if (parte !== "so-alavanca") o.push(slab({ x: x - 4, y: YW, w: w + 8, d: 4, r: 0.01 }, 0, h + 4, { tone: "mid", className: "c-dark" }, 2, 0));
  if (parte !== "so-alavanca") o.push(slab({ x, y: YW + 1, w, d: 4, r: 0.5 }, 0, h, { tone: "hi", className: "c-mat" }, 2, 0.4));
  if (alavanca && parte !== "base") {
    o.push(slab({ x: x + w - 26, y: YW + 4, w: 15, d: 4, r: 3 }, 84, 36, { tone: "hi", className: "c-lead" }, 3, 0.3));
    o.push(slab({ x: x + w - 66, y: YW + 8, w: 58, d: 8, r: 4 }, 92, 15, { tone: "hi", className: "c-lead" }, 3, 0.4));
  }
  if (barra && parte !== "so-alavanca") o.push(slab({ x: x + 8, y: YW + 4, w: w - 16, d: 5, r: 2.5 }, 92, 7, { tone: "hi", className: "c-lead" }, 3, 0.4));
  if (placa && parte !== "so-alavanca") {
    const sx = x + w / 2, z0 = h + 12;
    o.push(slab({ x: sx - 24, y: YW, w: 48, d: 4, r: 3 }, z0, 24, { tone: "mid", className: "c-dark" }, 3, 0.4));
    const y = YW + 4.4, c = z0 + 12;
    o.push(wp(P, y, [[sx - 17, c], [sx - 6, c + 8], [sx - 6, c + 3.5], [sx + 17, c + 3.5], [sx + 17, c - 3.5], [sx - 6, c - 3.5], [sx - 6, c - 8]], `fill="${hx.amarelo}" stroke="${hx.nucleo}" stroke-width=".5" stroke-linejoin="round"`));
  }
  return o.join("");
}
