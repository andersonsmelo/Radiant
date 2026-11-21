// idoso-apoios-e-riscos: pessoa idosa em pé diante do receptor vertical, com a mão na barra de apoio da parede; banco ao lado, degrau e tapete solto
// no chão adiante; o andador longe, no outro lado da sala.
import { k, helpers } from "../kit/base.mjs";
import { TONS } from "../kit/paleta.mjs";
import { pessoa, alturaPelve } from "../kit/pessoa.mjs";
import { buckyMural } from "../kit/bucky-mural.mjs";
import { projecao, sala } from "./comum/sala.mjs";
import { alcancar } from "./comum/ik.mjs";

// Peças próprias: barra de apoio na parede, banco, degrau, tapete com a ponta levantada e andador.
export function barraNaParede(P, { x0, x1, y, z }) {
  const { tube, slab } = helpers(P);
  return [x0 + 4, x1 - 4].map((x) => slab({ x: x - 3, y: y - 9, w: 6, d: 10, r: 1.5 }, z - 3, 6, { tone: "mid", className: "c-dark" }, 3, 0.3)).join("") + tube([[x0, y, z], [x1, y, z]], 4.2, { tone: "hi", fillet: 2 });
}
export function banco(P, { x, y, w = 40, d = 26, h = 44 }) {
  const { slab, shadow } = helpers(P);
  const o = [shadow({ x: x - 4, y: y - 4, w: w + 8, d: d + 8, r: 5 })];
  for (const [lx, ly] of [[x + 2, y + 2], [x + w - 6, y + 2], [x + 2, y + d - 6], [x + w - 6, y + d - 6]]) o.push(slab({ x: lx, y: ly, w: 4, d: 4, r: 1 }, 0, h - 4, { tone: "mid", className: "c-dark" }, 3, 0.2));
  o.push(slab({ x, y, w, d, r: 3 }, h - 5, 5, { tone: "hi", className: "c-mat" }, 4, 0.6));
  return o.join("");
}
export function degrau(P, { x, y, w = 46, d = 30, h = 14 }) {
  const { slab, shadow } = helpers(P);
  return shadow({ x: x - 3, y: y - 3, w: w + 6, d: d + 6, r: 4 }) + slab({ x, y, w, d, r: 2 }, 0, h, { tone: "hi", className: "c-mat" }, 3, 0.5) + slab({ x: x + 1, y: y + d - 6, w: w - 2, d: 5, r: 1 }, h, 0.8, { tone: "hi", className: "c-kid1" }, 3, 0.1);
}
// tapete fino com o canto da frente (x1, y1) levantado: um triângulo claro no alto e a aba escura por baixo
export function tapete(P, { x, y, w = 62, d = 42 }) {
  const { slab } = helpers(P);
  const p = (X, Y, Z) => k.iso([X, Y, Z], P), T = TONS.kid1;
  const x1 = x + w, y1 = y + d, a = 24, up = 17;
  const tri = (pts, fill, stroke) => `<path d="${k.pathOf(pts.map((q) => p(...q)), true)}" fill="${fill}" stroke="${stroke}" stroke-width="1.4" stroke-linejoin="round"/>`;
  const corpo = slab({ x, y, w, d, r: 1.5 }, 0, 1.4, { tone: "hi", className: "c-kid1" }, 3, 0.2);
  return corpo + tri([[x1 - a, y1, 1.4], [x1, y1 - a, 1.4], [x1, y1, up]], T.s0, T.s0) + tri([[x1 - a, y1, 1.4], [x1, y1, up], [x1, y1, up + 1.2], [x1 - a, y1, 2.6]], T.top, T.s2);
}
export function andador(P, { x, y, w = 50, d = 44, h = 82 }) {
  const { tube, slab, shadow, cyl } = helpers(P);
  const o = [shadow({ x: x - 4, y: y - 4, w: w + 8, d: d + 8, r: 5 })];
  const lado = (X) => tube([[X, y, 0], [X, y, h], [X, y + d, h], [X, y + d, 0]], 2.4, { tone: "hi", fillet: 6 });
  o.push(lado(x), lado(x + w));
  o.push(tube([[x, y + d, 52], [x + w, y + d, 52]], 2, { tone: "mid", fillet: 2 }));
  o.push(tube([[x, y, h - 22], [x + w, y, h - 22]], 2, { tone: "mid", fillet: 2 }));
  for (const X of [x - 2, x + w - 2]) o.push(slab({ x: X, y: y + 2, w: 4, d: d - 4, r: 2 }, h, 3, { tone: "hi", className: "c-lead" }, 3, 0.3));
  for (const X of [x, x + w]) for (const Y of [y, y + d]) o.push(cyl(X, Y, 2.2, 0, 3, { tone: "mid", className: "c-dark" }, 10));
  return o.join("");
}

/** As peças da cena em ordem de pintura: [{ id, svg }]. */
export function pecas() {
  const YW = -74;
  const REC = { x: -120, y: YW }, BARRA = { x0: -92, x1: -42, y: -56, z: 108 }, ELD = { o: [-116, -34, alturaPelve()], facing: [0, -1, 0] };
  const BANCO = { x: -188, y: -74, w: 36, d: 24 }, DEGRAU = { x: -50, y: -62 }, TAPETE = { x: 22, y: -70, w: 50, d: 34 }, ANDA = { x: 104, y: -74, w: 44, d: 38 }; // banco encostado à parede, atrás dela; degrau e tapete no caminho até o andador
  const box = (x0, x1, y0, y1, z0, z1) => k.boxCorners({ x: x0, y: y0, w: x1 - x0, d: y1 - y0 }, z0, z1);
  const P = projecao([[BANCO.x - 4, YW, 0], [-116, -34, 188], [ANDA.x + 50, ANDA.y, 0], [ANDA.x + 50, ANDA.y, 90], [TAPETE.x + 50, -4, 0], [BANCO.x - 4, -4, 0]]);
  const CURVA = 14;
  const mao = alcancar({ curva: CURVA, o: ELD.o, pose: "em-pe", facing: ELD.facing, sd: -1, alvo: [-72, -55, 106] });
  const sombra = (o, r) => helpers(P).shadow({ x: o[0] - r, y: o[1] - r, w: 2 * r, d: 2 * r, r: r - 1 });
  return [
    { id: "sala", svg: sala(P, { x0: -300, x1: 300, yF: 60, h: 330, yw: YW }) },
    { id: "receptor", svg: buckyMural(P, { x: REC.x, y: REC.y, zPlaca: 90 }) },
    { id: "barra", svg: barraNaParede(P, BARRA) },
    { id: "banco", svg: banco(P, BANCO) },
    { id: "degrau", svg: degrau(P, DEGRAU) },
    { id: "tapete", svg: tapete(P, TAPETE) },
    { id: "andador", svg: andador(P, ANDA) },
    { id: "idosa", svg: sombra(ELD.o, 20) + pessoa(P, ELD.o, { pose: "em-pe", facing: ELD.facing, roupa: "camisola", costas: true, cabelo: "c-shirt", curva: CURVA, bracos: { [-1]: { abd: mao.abd, bend: mao.bend } } }) },
  ];
}
