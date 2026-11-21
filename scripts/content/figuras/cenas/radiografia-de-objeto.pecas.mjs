// radiografia-de-objeto (m31): quadro num cavalete no feixe horizontal, detector atras, area isolada por cordao e sinal de aviso,
// operador fora da area ao lado do painel de comando. PARADO.
import { k, G, helpers, roundRect, at, grp } from "../kit/base.mjs";
import { TONS, EFEITOS } from "../kit/paleta.mjs";
import { pessoa, alturaPelve } from "../kit/pessoa.mjs";
import { aparelhoMovel, braco, feixe } from "../kit/tubo.mjs";
import { brilho } from "../kit/detector.mjs";
import { xp, hx, W, H } from "./comum/sala.mjs";

/** As peças da cena em ordem de pintura: [{ id, svg }]. */
export function pecas() {
  const AZ = 68;
  const Y = [0, 1, 0], Z = [0, 0, 1], B = [-1, 0, 0];
  const GT = 1.3, ZH = 130;
  const UX = 80, YC = -105, F0 = [UX, 0, ZH], XD = -74;      // coluna do aparelho, centro do cabecote, face ativa do detector
  const box = (x0, x1, y0, y1, z0, z1) => k.boxCorners({ x: x0, y: y0, w: x1 - x0, d: y1 - y0 }, z0, z1);
  const P = k.fitProjection([...box(-86, 284, -56, 112, 0, 190)], W, H, { pad: 6, azimuth: AZ });
  const { S, slab, cyl, tube, shadow } = helpers(P);
  const pc = {};
  pc.chao = slab({ x: -90, y: -140, w: 360, d: 280, r: 0.01 }, -4, 4, { tone: "lo", className: "c-bed" }, 2, 0);
  // aparelho movel (carro e coluna) atras; braco e cabecote na altura do feixe
  pc.aparelho = aparelhoMovel(P, { ux: UX, yc: YC });
  pc.braco = braco(P, { ux: UX, yc: YC, za: ZH + 14, f0: F0 });
  const cabecote = () => S(G.solidOf([[0, 7.5 * GT], [1.6 * GT, 9.5 * GT, 1], [34.4 * GT, 9.5 * GT, 1], [36 * GT, 7.5 * GT]], G.frameAlong([F0[0] - 18 * GT, F0[1], F0[2]], [1, 0, 0]), P, { steps: 20 }), { tone: "hi", className: "c-mach" });
  const colim = () => { const FC = G.frameOf(F0, B, Y, G.cross3(B, Y)); return S(G.prismOf(FC, roundRect(-8 * GT, 8 * GT, -8 * GT, 8 * GT, 2), 8 * GT, 20 * GT, P), { tone: "hi", className: "c-mach" }) + S(G.prismOf(FC, roundRect(-6 * GT, 6 * GT, -6 * GT, 6 * GT, 1.5), 20 * GT, 22 * GT, P), { tone: "mid", className: "c-dark" }); };
  pc.tubo = cabecote() + colim();
  // detector em pe, num pedestal, bem atras do quadro (face ativa para o tubo)
  pc.suportedet = shadow({ x: XD - 12, y: -30, w: 24, d: 60, r: 6 })
    + slab({ x: XD - 10, y: -26, w: 20, d: 52, r: 3 }, 0, 5, { tone: "mid", className: "c-dark" }, 3, 0.5)
    + slab({ x: XD - 5, y: -4, w: 5, d: 8, r: 1.5 }, 5, 78, { tone: "hi", className: "c-mach" }, 3, 0.5);
  pc.detector = slab({ x: XD - 3.5, y: -50, w: 3.5, d: 100, r: 2 }, 82, 96, { tone: "hi", className: "c-blue" }, 4, 0.6)
    + brilho(P, { o: [XD + 0.15, 0, 130], ea: Y, eb: Z, a: [-44, 44], b: [-43, 43] });
  // cavalete e quadro
  pc.cavalete = shadow({ x: -24, y: -52, w: 34, d: 104, r: 6 })
    + slab({ x: -22, y: -48, w: 28, d: 96, r: 3 }, 0, 6, { tone: "mid", className: "c-hair" }, 3, 0.6)
    + [-38, 34].map((y) => slab({ x: -10, y, w: 5, d: 4, r: 1 }, 6, 156, { tone: "mid", className: "c-hair" }, 3, 0.4)).join("")
    + slab({ x: -9, y: -46, w: 10, d: 92, r: 1.5 }, 89, 5, { tone: "hi", className: "c-hair" }, 3, 0.4)
    + slab({ x: -8, y: -42, w: 8, d: 84, r: 1.5 }, 160, 4, { tone: "hi", className: "c-hair" }, 3, 0.4);
  const XQ = 0; // face da frente do quadro (para o tubo)
  pc.quadro = slab({ x: -4, y: -44, w: 4, d: 88, r: 1 }, 94, 66, { tone: "hi", className: "c-hairKid" }, 3, 0.5)
    + slab({ x: XQ, y: -39, w: 0.8, d: 78, r: 0.8 }, 99, 56, { tone: "hi", className: "c-shirt" }, 3, 0.2)
    + xp(P, XQ + 0.9, [[-39, 99], [-39, 118], [-22, 130], [0, 117], [20, 128], [39, 114], [39, 99]], `fill="${TONS.kid2.s3}" stroke="${TONS.kid2.top}" stroke-width=".5" stroke-linejoin="round"`)
    + xp(P, XQ + 0.9, Array.from({ length: 18 }, (_, i) => [-20 + 8.5 * Math.cos((i / 18) * 2 * Math.PI), 145 + 8.5 * Math.sin((i / 18) * 2 * Math.PI)]), `fill="${TONS.kid1.top}" stroke="${TONS.kid1.s3}" stroke-width=".5"`)
    + xp(P, XQ + 0.9, [[12, 99], [12, 110], [28, 110], [28, 99]], `fill="${TONS.hair.s2}" stroke="none"`);
  // feixe: do colimador ao detector, atravessando o quadro
  pc.feixe = feixe(P, { f0: at(F0, [B, 22 * GT - 22]), b: B, c: [XD, 0, 130], u: Z, v: Y, campo: 60 });
  // area isolada: dois postes com cordao entre eles e o sinal de aviso num pe proprio na frente
  const CX = 168, PA = -10, PB = 60;
  const poste = (y) => cyl(CX, y, 8, 0, 3, { tone: "mid", className: "c-dark" }, 14) + cyl(CX, y, 1.7, 3, 76, { tone: "hi", className: "c-lead" }, 10) + cyl(CX, y, 3.2, 79, 3.5, { tone: "hi", className: "c-lead" }, 10);
  pc.cordao = poste(PA) + poste(PB) + grp("c-kid1", tube([[CX, PA, 78], [CX, (PA + PB) / 2 - 8, 70], [CX, (PA + PB) / 2 + 8, 70], [CX, PB, 78]], 1.1, { tone: "hi", fillet: 6 }));
  const SY = 118, SX = 116;
  pc.pesinal = cyl(SX, SY, 7, 0, 2.5, { tone: "mid", className: "c-dark" }, 14) + cyl(SX, SY, 1.4, 2.5, 100, { tone: "hi", className: "c-lead" }, 8);
  pc.sinal = xp(P, SX + 1.8, [[SY - 21, 102], [SY + 21, 102], [SY, 140]], `fill="${EFEITOS.feixe}" stroke="${EFEITOS.nucleo}" stroke-width=".8" stroke-linejoin="round"`)
    + xp(P, SX + 2, [[SY - 1.9, 111], [SY + 1.9, 111], [SY + 1.4, 126], [SY - 1.4, 126]], `fill="${hx.papel}" stroke="none"`)
    + xp(P, SX + 2, Array.from({ length: 10 }, (_, i) => [SY + 2.1 * Math.cos((i / 10) * 2 * Math.PI), 106.6 + 2.1 * Math.sin((i / 10) * 2 * Math.PI)]), `fill="${hx.papel}" stroke="none"`);
  // painel de comando (mesa com tela) e o operador, fora da area, de frente para a area
  const OX = 262, OY = 16;
  pc.painel = shadow({ x: 204, y: OY - 36, w: 26, d: 72, r: 6 })
    + slab({ x: 208, y: OY - 30, w: 18, d: 60, r: 3 }, 0, 74, { tone: "mid", className: "c-dark" }, 3, 0.6)
    + slab({ x: 204, y: OY - 34, w: 24, d: 68, r: 3 }, 74, 6, { tone: "hi", className: "c-mach" }, 3, 0.6)
    + slab({ x: 207, y: OY - 14, w: 4, d: 28, r: 1.5 }, 80, 26, { tone: "hi", className: "c-mach" }, 3, 0.4)
    + xp(P, 211.2, [[OY - 11, 84], [OY + 11, 84], [OY + 11, 103], [OY - 11, 103]], `class_="x"`.replace("class_=\"x\"", `fill="${EFEITOS.tela}" fill-opacity=".35" stroke="${EFEITOS.tela}" stroke-width=".7"`));
  pc.operador = shadow({ x: OX - 22, y: OY - 20, w: 44, d: 40, r: 16 }) + pessoa(P, [OX, OY, alturaPelve()], { pose: "em-pe", facing: B, roupa: "scrub" });
  const ORDEM = ["chao", "aparelho", "braco", "suportedet", "detector", "feixe", "cavalete", "quadro", "tubo", "cordao", "pesinal", "sinal", "painel", "operador"];
  return ORDEM.map((id) => ({ id, svg: pc[id] }));
}
