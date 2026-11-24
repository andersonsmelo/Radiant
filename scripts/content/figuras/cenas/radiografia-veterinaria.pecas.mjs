// radiografia-veterinaria (m31): cao deitado de lado na mesa, em calha de espuma, com sacos de areia nas patas; feixe vertical no torax;
// quem segura (avental e luvas) com as maos fora do campo; tutor sem avental ao lado da mesa; outra pessoa sem avental junto a porta. PARADO.
import { k, G, helpers, roundRect, at } from "../kit/base.mjs";
import { mesa } from "../kit/mesa.mjs";
import { pessoa, alturaPelve } from "../kit/pessoa.mjs";
import { feixe } from "../kit/tubo.mjs";
import { sala, porta, YW, W, H } from "./comum/sala.mjs";
import { caoNaCalha } from "./comum/animal.mjs";

/** As peças da cena em ordem de pintura: [{ id, svg }]. */
export function pecas() {
  const AZ = 68, ZT = 78, GT = 1.3, ZH = 186;
  const { add3, mul3, unit3, cross3 } = G;
  const X = [1, 0, 0], Y = [0, 1, 0], Z = [0, 0, 1];
  const box = (x0, x1, y0, y1, z0, z1) => k.boxCorners({ x: x0, y: y0, w: x1 - x0, d: y1 - y0 }, z0, z1);
  const P = k.fitProjection([...box(-240, -150, YW, YW + 4, 0, 210), ...box(-90, 92, -40, 40, 0, 120), ...box(-116, -76, 20, 62, 0, 184), ...box(-238, -198, -118, -80, 0, 184), ...box(50, 98, -62, -28, 0, 184), ...box(-30, 20, -128, 10, 150, 218)], W, H, { pad: 8, azimuth: AZ });
  const { S, slab, cyl, tube, shadow } = helpers(P);
  const pc = {};
  pc.sala = sala(P, { x0: -260, x1: 150, yF: 130, h: 225 });
  pc.porta = porta(P, { x: -236, w: 84, h: 205 });
  // pessoa sem avental junto a porta (longe) e tutor sem avental ao lado da mesa
  const PD = { o: [-223, YW + 50, alturaPelve()], opt: { pose: "em-pe", facing: unit3([0.5, 1, 0]), roupa: "camisa" } };
  const PT = { o: [-91, 40, alturaPelve()], opt: { pose: "em-pe", facing: unit3([0.8, -0.5, 0]), roupa: "camisa" } };
  pc.pessoaPorta = shadow({ x: PD.o[0] - 20, y: PD.o[1] - 18, w: 40, d: 36, r: 14 }) + pessoa(P, PD.o, { ...PD.opt, q: 0.34 });
  pc.tutor = shadow({ x: PT.o[0] - 20, y: PT.o[1] - 18, w: 40, d: 36, r: 14 }) + pessoa(P, PT.o, { ...PT.opt, q: 0.34 });
  // quem segura: atras da mesa, de frente para o espectador, avental; as maos (luvas) vao para a cabeca do cao
  const PH = { o: [74, -45, alturaPelve()] };
  const saida = {};
  pc.segura = shadow({ x: PH.o[0] - 20, y: PH.o[1] - 18, w: 40, d: 36, r: 14 }) + pessoa(P, PH.o, { pose: "em-pe", facing: Y, roupa: "scrub", avental: true, q: 0.34, bracos: { [-1]: { abd: -8, bend: 82 }, [1]: { abd: -8, bend: 82 } }, saida });
  // coluna e braco do tubo, atras da mesa
  const CY = YW + 22;
  pc.coluna = shadow({ x: -26, y: CY - 22, w: 44, d: 34, r: 6 }) + slab({ x: -24, y: CY - 20, w: 40, d: 30, r: 4 }, 0, 6, { tone: "mid", className: "c-mach" }, 4, 0.8)
    + slab({ x: -11, y: CY - 11, w: 14, d: 14, r: 3 }, 6, ZH + 30 - 6, { tone: "hi", className: "c-mach" }, 3, 0.5)
    + slab({ x: -10, y: CY - 11, w: 12, d: -CY + 12, r: 3 }, ZH + 18, 11, { tone: "hi", className: "c-mach" }, 3, 0.5);
  pc.mesa = mesa(P, { x: -88, y: -35, w: 180, d: 70, z: ZT });
  pc.detector = slab({ x: -42, y: -30, w: 56, d: 60, r: 2 }, ZT, 2.6, { tone: "hi", className: "c-blue" }, 3, 0.4);
  const ZF = ZT + 2.6;
  Object.assign(pc, caoNaCalha(P, { ZT }));
  // tubo: cabecote horizontal e colimador para baixo; feixe vertical no torax
  const F0 = [-6, 0, ZH];
  const cabecote = S(G.solidOf([[0, 7.5 * GT], [1.6 * GT, 9.5 * GT, 1], [34.4 * GT, 9.5 * GT, 1], [36 * GT, 7.5 * GT]], G.frameAlong([F0[0] - 18 * GT, F0[1], F0[2]], X), P, { steps: 20 }), { tone: "hi", className: "c-mach" });
  const b = [0, 0, -1], FC = G.frameOf(F0, b, Y, cross3(b, Y));
  const colim = S(G.prismOf(FC, roundRect(-8 * GT, 8 * GT, -8 * GT, 8 * GT, 2), 8 * GT, 20 * GT, P), { tone: "hi", className: "c-mach" }) + S(G.prismOf(FC, roundRect(-6 * GT, 6 * GT, -6 * GT, 6 * GT, 1.5), 20 * GT, 22 * GT, P), { tone: "mid", className: "c-dark" });
  pc.braco = slab({ x: -9, y: -12, w: 10, d: 14, r: 2 }, ZH + 8, 8, { tone: "hi", className: "c-mach" }, 3, 0.4) + cyl(F0[0], 0, 4.2, ZH + 8 - 6, 7, { tone: "mid", className: "c-dark" }, 12);
  pc.tubo = cabecote + colim;
  pc.feixe = feixe(P, { f0: at(F0, [b, 22 * GT - 22]), b, c: [-6, 0, ZF + 1], u: X, v: Y, campo: 30 });
  // luvas: duas maos grandes de luva azul nas maos da pessoa que segura (sobre o cao)
  const luva = (w) => S(G.solidOf([[0, 3.4], [3, 5.2, 1], [8, 5.6, 1], [12, 2.6]], G.frameOf(add3(w, [0, 3.5, -0.5]), Y, X, Z), P, { steps: 12, smooth: false }), { tone: "hi", className: "c-apron2" });
  pc.luvas = () => [-1, 1].map((sd) => luva(saida.pulso[sd])).join("");
  // espalhamento do cao em direcao ao tutor (tracejado), por tras da pessoa
  const p2 = (p) => k.iso(p, P);
  pc.espalhada = [118, 128, 138].map((z) => `<path class="scatter" d="${k.pathOf([p2([-10, 6, ZF + 22]), p2([PT.o[0] + 16, PT.o[1] - 10, z])])}"/>`).join("");
  const ORDEM = ["sala", "porta", "pessoaPorta", "coluna", "segura", "mesa", "detector", "calha", "cao", "calhaFrente", "sacos", "espalhada", "tutor", "feixe", "luvas", "braco", "tubo"];
  return ORDEM.map((id) => ({ id, svg: id === "luvas" ? pc.luvas() : pc[id] }));
}
