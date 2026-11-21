// Peças de dosimetro-no-corpo (m21): profissional de avental, de frente, com os dosímetros no peito, na mão (anel) e junto ao olho (haste dos óculos), e o
// quadro de parede com o dosímetro de referência. Dosímetros em dourado do kit, de tamanho exagerado de propósito (ver a evidência do lote 2B).
import { k, G, helpers, at, roundRect } from "../kit/base.mjs";
import { pessoa, alturaPelve } from "../kit/pessoa.mjs";
import { projecao, sala, YW } from "./comum/sala.mjs";

const RAD = Math.PI / 180;
const { add3, sub3, mul3, dot3, cross3, unit3 } = G;
const Z = [0, 0, 1];
const BX = 34, BZ = 106, BW = 62, BH = 88; // quadro de parede (cm)
const O = [-20, YW + 110, alturaPelve()];
const FACE = unit3([0.35, 0.94, 0]);
const LT = cross3(FACE, Z); // lado do corpo; sd = +1 e o braco estendido (direita de quem ve)
const SD = 1, ABD = 64, BEND = 30;
const POP = { pose: "em-pe", facing: FACE, roupa: "scrub", avental: true, bracos: { [SD]: { abd: ABD, bend: BEND } } };
const pt = (l, f, s) => at(O, [LT, l], [FACE, f], [Z, s]);
// os dosimetros sao amarelos (tom dourado do kit); tamanhos EXAGERADOS para o marcador do app esconder menos
const OURO = { tone: "hi", className: "c-kid1" };
const AUM = { tronco: [24, 16], olho: [13, 11], anel: 10.4, ref: [34, 24] }; // ver relatorio: tamanho no desenho

function geometriaDaMao() {
  const sh = pt(SD * 17.6, 0, 47.6);
  const up = unit3(add3(mul3(Z, -Math.cos(ABD * RAD)), mul3(LT, SD * Math.sin(ABD * RAD))));
  const el = add3(sh, mul3(up, 29));
  const orth = (v, a) => unit3(sub3(v, mul3(a, dot3(a, v))));
  const fore = unit3(add3(mul3(up, Math.cos(BEND * RAD)), mul3(orth(FACE, up), Math.sin(BEND * RAD))));
  const wr = add3(el, mul3(fore, 25));
  return { wr, fore };
}
const { wr, fore } = geometriaDaMao();

function pecasDe(P) {
  const { S, slab, cyl, tube, shadow } = helpers(P);
  const prisma = (F, poly, s0, s1) => S(G.prismOf(F, poly, s0, s1, P), OURO);
  const p = {};
  p.sala = sala(P, { x0: -300, x1: 300, yF: YW + 230, h: 400 });
  // quadro de parede com o dosimetro de referencia pendurado (longe do corpo)
  const bx = BX, bz = BZ;
  p.quadro = slab({ x: bx, y: YW, w: BW, d: 3, r: 2 }, bz, BH, { tone: "hi", className: "c-lead" }, 3, 0.5)
    + slab({ x: bx + 5, y: YW + 3, w: BW - 10, d: 0.8, r: 1.5 }, bz + 5, BH - 10, { tone: "mid", className: "c-dark" }, 3, 0.2)
    + cyl(bx + BW / 2, YW + 3.8, 1.4, bz + BH - 8, 2.4, { tone: "hi", className: "c-lead" }, 8);
  const [rw, rh] = AUM.ref;
  p.ref = slab({ x: bx + BW / 2 - rw / 2, y: YW + 3.8, w: rw, d: 2.2, r: 2 }, bz + BH - 12 - rh, rh, OURO, 3, 0.3);
  p.sombra = shadow({ x: O[0] - 24, y: O[1] - 22, w: 52, d: 44, r: 18 });
  p.pessoa = pessoa(P, O, POP);
  // dosimetro de tronco: cracha na frente do avental, no peito
  const [tw, th] = AUM.tronco;
  const Ft = G.frameOf(at(O, [FACE, 12.9], [LT, 1], [Z, 22]), Z, LT, FACE);
  p.tronco = prisma(Ft, roundRect(-tw / 2, tw / 2, 0, 2.6, 1.2), -th / 2, th / 2);
  // oculos (aro e hastes) com o cracha do olho preso na haste do lado de quem ve
  const hz = 70.2;
  const lente = (l) => S(G.ringBand(0, 1.1, 2.1, 3.3, G.frameOf(at(O, [LT, l], [FACE, 8.4], [Z, hz]), FACE, LT, Z), P, { steps: 14, smooth: false }), { tone: "hi", className: "c-lead" });
  const haste = (sd) => tube([pt(sd * 6.5, 9.0, hz), pt(sd * 8.3, 5, hz + 0.3), pt(sd * 8.6, -3.5, hz - 0.4)], 0.75, { tone: "hi", fillet: 2.2 });
  const ponte = tube([pt(-3.3, 9.3, hz + 1.2), pt(0, 9.8, hz + 1.5), pt(3.3, 9.3, hz + 1.2)], 0.6, { tone: "hi", fillet: 1.5 });
  p.oculos = lente(-3.8) + lente(3.8) + ponte + haste(-1) + haste(1);
  const [ow, oh] = AUM.olho;
  const Fo = G.frameOf(at(O, [LT, SD * 8.9], [FACE, 5.2], [Z, hz - 1.4]), mul3(LT, SD), FACE, Z);
  p.olho = prisma(Fo, roundRect(-ow / 2 + 0.5, ow / 2 + 0.5, 0, oh, 1), 0, 2.4);
  // anel: banda amarela em volta da mao estendida
  const Fa = G.frameOf(add3(wr, mul3(fore, 6.4)), fore, LT, cross3(fore, LT));
  p.anel = S(G.ringBand(0, 3.6, 3.9, AUM.anel, Fa, P, { steps: 16, smooth: false }), OURO);
  return p;
}
const ORDEM = ["sala", "quadro", "ref", "sombra", "pessoa", "tronco", "oculos", "olho", "anel"];

export function pecas() {
  const box = (x0, x1, y0, y1, z0, z1) => k.boxCorners({ x: x0, y: y0, w: x1 - x0, d: y1 - y0 }, z0, z1);
  const P = projecao([...box(-34, 62, O[1] - 36, O[1] + 30, 58, 186), ...box(BX, BX + BW, YW, YW + 4, BZ, BZ + BH)]);
  const pc = pecasDe(P);
  return ORDEM.map((id) => ({ id, svg: pc[id] }));
}
