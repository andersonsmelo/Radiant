// Pecas do produto-dose-area: tubo de teto (copiado de lote-2A/pontos-de-contato-da-sala/pecas.mjs, so o corpo) e a camara de produto dose-area.
import { k, G, helpers, at, roundRect } from "../kit/base.mjs";
import { cabecote, colimador } from "../kit/tubo.mjs";
export const ZF = 198, ZEXIT = 170; // ponto focal e saida do colimador (cm)
export function tuboDeTeto(P, { x, y = 0, zc = ZF }) {
  const { slab, cyl } = helpers(P);
  return [
    slab({ x: x - 56, y: y - 5, w: 160, d: 10, r: 2 }, 236, 9, { tone: "mid", className: "c-mach" }, 3, 0.5),
    slab({ x: x - 16, y: y - 9, w: 32, d: 18, r: 3 }, 222, 15, { tone: "hi", className: "c-mach" }, 3, 0.6),
    cyl(x, y, 6.5, zc + 9, 223 - zc - 9, { tone: "hi", className: "c-mach" }, 18),
    cyl(x, y, 8, 220, 4, { tone: "mid", className: "c-dark" }, 18),
    colimador(P, { f0: [x, y, zc - 6], b: [0, 0, -1] }),
    cabecote(P, { f0: [x - 0.1, y, zc], eixo: [1, 0, 0] }),
  ].join("");
}
// camara: placa fina e larga (lado L, espessura T) com moldura azul e janela mais clara, presa ao colimador por duas hastes
export function camaraDAP(P, { x, y = 0, z, L = 36, T = 2.4 }) {
  const { slab, tube, S } = helpers(P);
  const hastes = [-1, 1].map((sd) => tube([[x + sd * 8.6, y, 179], [x + sd * 15.4, y, 179], [x + sd * 15.4, y, z + T - 0.2]], 0.9, { tone: "hi", fillet: 2.2 })).join("");
  const placa = slab({ x: x - L / 2, y: y - L / 2, w: L, d: L, r: 2.5 }, z, T, { tone: "hi", className: "c-blue" }, 3, 0.5)
    + slab({ x: x - L / 2 + 3, y: y - L / 2 + 3, w: L - 6, d: L - 6, r: 1.5 }, z + T, 0.5, { tone: "hi", className: "c-lead" }, 3, 0.1);
  return { hastes, placa };
}
// segmento de feixe entre dois planos z (quadrado de meia-largura h(z) = hExit * (ZF - z) / (ZF - ZEXIT)), centrado em (x, y)
export function segFeixe(P, { x, y = 0, zA, zB, hExit, tipo, grad = true }) {
  const { p2 } = helpers(P);
  const h = (z) => (hExit * (ZF - z)) / (ZF - ZEXIT);
  const sq = (z) => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => [x + a * h(z), y + b * h(z), z]);
  const A = sq(zA), B = sq(zB);
  const hull = G.hullOf([...A, ...B].map(p2));
  const a = p2([x, y, ZEXIT]), b = p2([x, y, 100]);
  const defs = grad ? `<defs><linearGradient id="gx" gradientUnits="userSpaceOnUse" x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}"><stop offset="0" stop-opacity=".75"/><stop offset="1" stop-opacity=".22"/></linearGradient></defs>` : "";
  const edges = A.map((e, i) => k.pathOf([p2(e), p2(B[i])])).join("");
  const wide = tipo === "largo";
  return `${defs}<g><path class="beam-fill" ${wide ? 'opacity=".5" ' : ""}fill="url(#gx)" d="${k.pathOf(hull, true)}"/><path class="${wide ? "scatter" : "beam-edge"}" d="${edges}"/></g>`;
}
// marca do campo sobre uma superficie horizontal z
export function marcaCampo(P, { x, y = 0, z, hExit, tipo }) {
  const { p2 } = helpers(P);
  const h = (hExit * (ZF - z)) / (ZF - ZEXIT);
  const pts = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => p2([x + a * h, y + b * h, z]));
  return `<path class="${tipo === "largo" ? "scatter" : "beam-edge"}" d="${k.pathOf(pts, true)}"/>`;
}
