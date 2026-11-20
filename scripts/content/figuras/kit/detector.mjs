// Detector (cassete / placa plana). F = quadro 3D (a = ao longo do comprimento, u = largura, v = espessura).
import { k, G, helpers, roundRect } from "./base.mjs";
export function detector(P, { F, u = [14, 58], v = [8, 10.6], s = [0, 44], alca = true }) {
  const { S } = helpers(P);
  let out = S(G.prismOf(F, roundRect(u[0], u[1], v[0], v[1], 1), s[0], s[1], P), { tone: "hi", className: "c-blue" });
  if (alca) out += S(G.prismOf(F, roundRect(u[1] - 1, u[1] + 5, v[0] + 0.4, v[1] - 0.4, 1.2), s[0] + 15, s[0] + 29, P), { tone: "hi", className: "c-blue" });
  return out;
}
// brilho sobre a face ativa: retangulo [a0,a1] x [b0,b1] no plano de eixos ea, eb a partir de o
export function brilho(P, { o, ea, eb, a = [-16, 16], b = [17, 49] }) {
  const { p2 } = helpers(P);
  const pt = (x, y) => G.add3(o, G.add3(G.mul3(ea, x), G.mul3(eb, y)));
  return `<path class="glow" d="${k.pathOf([[a[0], b[0]], [a[1], b[0]], [a[1], b[1]], [a[0], b[1]]].map(([x, y]) => p2(pt(x, y))), true)}"/>`;
}
