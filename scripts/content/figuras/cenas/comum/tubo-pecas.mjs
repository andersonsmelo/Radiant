// Pecas novas do lote 2A: ampola de raios X com o interior visivel (vidro fantasma sobre catodo e anodo).
// Usada igual por `tubo-raios-x` e `tubo-emitindo` (mesma geometria). Mundo em cm, eixo do tubo = x, z para cima.
import { k, G, helpers, at, roundRect, EFEITOS_CSS } from "./tubo-base.mjs";

export const GEO = {
  GL: 8.2,            // raio interno do vidro
  FACE0: 1.0,         // x da face do disco no cubo
  T: Math.tan((22 * Math.PI) / 180), // angulo do alvo EXAGERADO (real: 7 a 17 graus) para o bisel ler
  RD: 7.2,            // raio do disco
  RTRK: [4.6, 6.7],   // pista focal (raio interno, externo)
  ZF: -5.6,           // altura do eixo do filamento e do ponto focal (raio medio da pista, abaixo do eixo)
  CATX: [-14.2, -8.6],
};
const sFace = (r) => GEO.FACE0 + (r - 1.5) * GEO.T;
export const FOCAL = [sFace(5.65), 0, GEO.ZF];

const AX = (x, z = 0) => G.frameAlong([x, 0, z], [1, 0, 0]);

// camera propria da cena (vista de lado, ligeiramente de cima)
export const AZ = 105;
export function camera(W, H) {
  const ext = [[-25, -9, -9], [25, 9, -9], [-25, -9, 9.5], [25, 9, 9.5], [-10, -12, -27], [14, 12, -27]];
  return k.fitProjection(ext, W, H, { pad: 10, azimuth: AZ });
}

export function pecas(P, { hasteAte = 26, bracoDe = -26, filEixo = "x" } = {}) {
  const { S, L, slab, p2, tube } = helpers(P);
  const g = GEO;
  const out = {};

  // ---- anodo: disco com bisel, pista de tungstenio, haste e rotor
  const disco = S(G.solidOf([[g.FACE0, 1.5], [sFace(g.RD), g.RD], [sFace(g.RD) + 2.5, g.RD]], AX(0), P, { smooth: false }), { tone: "hi", className: "c-mach" });
  const pista = S(G.bandOfProfile([[sFace(g.RTRK[0]), g.RTRK[0]], [sFace(g.RTRK[1]), g.RTRK[1]]], AX(0), P, {}), { tone: "hi", className: "c-lead" });
  const xb = sFace(g.RD) + 2.5;
  const haste = S(G.solidOf([[0, 1.2], [hasteAte - xb, 1.2]], AX(xb), P), { tone: "hi", className: "c-lead" });
  const rotor = S(G.solidOf([[0, 3.6], [6.5, 3.6]], AX(xb + 3.5), P), { tone: "hi", className: "c-mach" });
  out.anodo = haste + rotor + disco + pista;

  // ---- catodo: braco, copa em C (aberta para +x) e filamento em espiral
  const [cx0, cx1] = g.CATX;
  const braco = tube([[bracoDe, 0, 0], [-15, 0, 0], [-13.2, 0, g.ZF + 1.6], [cx0 + 0.4, 0, g.ZF]], 1.0, { tone: "hi", fillet: 2.4 });
  const wall = (z0, h) => slab({ x: cx0, y: -3.3, w: cx1 - cx0, d: 6.6, r: 0.5 }, z0, h, { tone: "hi", className: "c-dark" }, 3, 0.3);
  const copa = slab({ x: cx0, y: -3.3, w: 1.6, d: 6.6, r: 0.5 }, g.ZF - 3.2, 6.4, { tone: "hi", className: "c-dark" }, 3, 0.3)
    + wall(g.ZF + 1.8, 1.4) + wall(g.ZF - 3.2, 1.4);
  const fil = [];
  for (let i = 0; i <= 50; i++) {
    const a = (i / 50) * 5 * 2 * Math.PI, x = cx0 + 2.1 + (3.6 * i) / 50;
    if (filEixo === "x") fil.push(p2([x, 0.9 * Math.sin(a), g.ZF + 1.15 * Math.cos(a)]));
    else fil.push(p2([cx0 + 3.3 + 0.7 * Math.sin(a), -2.6 + (5.2 * i) / 50, g.ZF + 1.2 * Math.cos(a)]));
  }
  out.catodo = braco + copa;
  out.filamento = (hot) => (hot ? `<path class="fil-glow" d="${k.pathOf(fil)}"/>` : "") + `<path class="${hot ? "fil-hot" : "fil"}" d="${k.pathOf(fil)}"/>`;

  // ---- vidro (fantasma) e janela
  const vidroPaths = G.solidOf([[-20, 3], [-17, 6.2, 1], [-12.5, g.GL, 1], [14, g.GL, 1], [17.5, 6.2, 1], [20.5, 3]], AX(0), P, {});
  out.vidro = `<path class="vidro" d="${vidroPaths.fill}"/>` + L(vidroPaths.outline, { tone: "blue" })
    + L(k.pathOf(G.arcPoints(AX(0), -12.5, g.GL, 0, 2 * Math.PI, 40).map(p2), true), { tone: "blue" })
    + L(k.pathOf(G.arcPoints(AX(0), 14, g.GL, 0, 2 * Math.PI, 40).map(p2), true), { tone: "blue" });
  const FW = G.frameAlong([FOCAL[0], 0, -g.GL - 0.2], [0, 0, -1]);
  out.janela = S(G.ringBand(0, 0.9, 2.5, 3.9, FW, P, {}), { tone: "hi", className: "c-lead" }) + S(G.disc(0.1, 0.5, 2.6, FW, P, {}), { tone: "hi", className: "c-blue" });
  // terminais fora do vidro
  const FT = (x) => AX(x, 0);
  out.terminais = S(G.solidOf([[0, 2.4], [2.2, 2.4]], FT(-24.2), P), { tone: "hi", className: "c-mach" }) + S(G.solidOf([[0, 2.4], [2.2, 2.4]], FT(24.5), P), { tone: "hi", className: "c-mach" });
  return out;
}

// feixe util: do ponto focal, pela janela, ate o campo (retangulo em z = -26)
export function feixe(P, { id = "gx", FZ = -26, hw = 9 } = {}) {
  const { p2 } = helpers(P);
  const f = FOCAL, h = [[-3.1, -2.2], [3.1, -2.2], [3.1, 2.2], [-3.1, 2.2]];
  const win = h.map(([dx, dy]) => [FOCAL[0] + dx * 1.0, dy * 1.4, -GEO.GL - 0.2]);
  const field = [[-hw, -hw], [hw, -hw], [hw, hw], [-hw, hw]].map(([dx, dy]) => [FOCAL[0] + dx, dy, FZ]);
  const hull = G.hullOf([p2(f), ...field.map(p2)]);
  const a = p2(f), b = p2([FOCAL[0], 0, FZ]);
  const grad = `<defs><linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}"><stop offset="0" stop-opacity=".8"/><stop offset="1" stop-opacity=".2"/></linearGradient></defs>`;
  const edges = field.map((e) => k.pathOf([p2(f), p2(e)])).join("");
  return `${grad}<g><path class="beam-fill" fill="url(#${id})" d="${k.pathOf(hull, true)}"/><path class="beam-edge" d="${edges}"/><path class="beam-core" d="${k.pathOf([a, b])}"/></g>`;
}

// eletrons: do filamento ao ponto focal (cada fila = uma linha de pontos; n filas)
export function eletrons(P, n = 1) {
  const { p2 } = helpers(P);
  const x0 = GEO.CATX[1] + 0.5, x1 = FOCAL[0] - 0.4;
  const ys = n === 1 ? [0] : n === 3 ? [-1.3, 0, 1.3] : [-1.7, -0.85, 0, 0.85, 1.7];
  let s = ys.map((y) => `<path class="elec" d="${k.pathOf([p2([x0, y, GEO.ZF]), p2([x1, y, GEO.ZF])])}"/>`).join("");
  const sz = n === 1 ? 1 : 0.7;
  for (const y of ys) s += `<path class="elec-tip" d="${k.pathOf([p2([x1 + 0.9 * sz, y, GEO.ZF]), p2([x1 - 0.7 * sz, y + 0.9 * sz, GEO.ZF]), p2([x1 - 0.7 * sz, y - 0.9 * sz, GEO.ZF])], true)}"/>`;
  return s;
}
export const brilhoFocal = (P, r = 1.9) => {
  const { p2 } = helpers(P);
  const c = p2([FOCAL[0] - 0.2, 0, GEO.ZF]), s = P.scale * Math.sqrt(1.6);
  const pts = Array.from({ length: 20 }, (_, i) => [c[0] + r * 0.6 * s * Math.cos((i / 20) * 2 * Math.PI), c[1] + r * s * Math.sin((i / 20) * 2 * Math.PI)]);
  return `<path class="spot" d="${k.pathOf(pts, true)}"/>`;
};
