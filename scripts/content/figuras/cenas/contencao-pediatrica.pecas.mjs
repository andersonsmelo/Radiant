// contencao-pediatrica: criança deitada na mesa sob o tubo de teto; acompanhante de avental sentado à cabeceira segurando os braços dela
// (mãos fora do campo); faixa sobre as pernas, apoio de espuma no fim da mesa; outra pessoa, sem avental, junto aos pés da mesa, com o espalhamento.
import { k, helpers } from "../kit/base.mjs";
import { pessoa } from "../kit/pessoa.mjs";
import { mesa } from "../kit/mesa.mjs";
import { projecao, sala } from "./comum/sala.mjs";
import { tuboDeTeto } from "./pontos-de-contato-da-sala.pecas.mjs";
import { punho, alcancar } from "./comum/ik.mjs";
import { campoDeLuz, espalhamento } from "./comum/campo.mjs";

/** As peças da cena em ordem de pintura: [{ id, svg }]. */
export function pecas() {
  const box = (x0, x1, y0, y1, z0, z1) => k.boxCorners({ x: x0, y: y0, w: x1 - x0, d: y1 - y0 }, z0, z1);
  const YW = -110, TOPO = 78;
  const FILHA = { o: [-6, 0, 85.5], facing: [1, 0, 0], K: 0.62 };
  const CUID = { o: [-100, 0, 54], facing: [1, 0, 0] };
  const PE = { o: [84, -50, 96.5], facing: [-0.15, 0.99, 0] };
  const P = projecao([[-95, 0, 0], [-95, 0, 142], [-29, 0, 172], [84, -50, 200], [84, -50, 0], [100, -50, 0]]);
  const { slab, cyl } = helpers(P);
  // braços da criança erguidos ao lado da cabeça; o acompanhante os alcança
  const kid = { pose: "deitada", idade: "crianca", facing: FILHA.facing, roupa: "infantil" };
  const kidBr = { abd: 168, bend: 12 };
  const punhos = [-1, 1].map((sd) => punho({ o: FILHA.o, pose: "deitada", facing: FILHA.facing, K: FILHA.K, sd, ...kidBr }));
  const bracosCuid = {};
  const hands = [];
  [-1, 1].forEach((sd, i) => { const r = alcancar({ o: CUID.o, pose: "sentada", facing: CUID.facing, sd, alvo: punhos[i] }); bracosCuid[sd] = { abd: r.abd, bend: r.bend }; hands.push(r); });
  const sombra = (o, r) => helpers(P).shadow({ x: o[0] - r, y: o[1] - r, w: 2 * r, d: 2 * r, r: r - 1 });
  const cuidOpt = { pose: "sentada", facing: CUID.facing, roupa: "scrub", avental: true, bracos: bracosCuid };
  const peOpt = { pose: "em-pe", facing: PE.facing, roupa: "camisa", bracos: { 1: { abd: 1, bend: 8 }, [-1]: { abd: 1, bend: 8 } } };
  const banco = slab({ x: CUID.o[0] - 16, y: -16, w: 32, d: 32, r: 4 }, 38, 6, { tone: "hi", className: "c-dark" }, 3, 0.4) + cyl(CUID.o[0], 0, 3, 0, 38, { tone: "mid", className: "c-dark" }, 10);
  const xc = -29;
  const faixa = slab({ x: 6, y: -17, w: 14, d: 34, r: 1.5 }, 88.6, 3.4, { tone: "hi", className: "c-blanket" }, 3, 0.3) + [-17, 14].map((y) => slab({ x: 6, y, w: 14, d: 3, r: 1 }, 79, 12.5, { tone: "mid", className: "c-blanket" }, 3, 0.3)).join("");
  const espuma = slab({ x: 54, y: 10, w: 22, d: 20, r: 4 }, 78, 17, { tone: "hi", className: "c-shirt" }, 4, 1.2);
  const wr = hands.map((h) => h.w);
  const maos = (() => { const pts = wr.flatMap((w) => box(w[0] - 3, w[0] + 15, w[1] - 6, w[1] + 6, w[2] - 5, w[2] + 5)).map((p) => k.iso(p, P)); return [Math.min(...pts.map((p) => p[0])), Math.min(...pts.map((p) => p[1])), Math.max(...pts.map((p) => p[0])), Math.max(...pts.map((p) => p[1]))]; })();
  const patch = (() => { const pts = box(xc - 14, xc + 14, -14, 14, 91, 94).map((p) => k.iso(p, P)); return [Math.min(...pts.map((p) => p[0])), Math.min(...pts.map((p) => p[1])), Math.max(...pts.map((p) => p[0])), Math.max(...pts.map((p) => p[1]))]; })();
  const tronco = (() => { const pts = box(-110, -76, -20, 20, 44, 140).map((p) => k.iso(p, P)); return [Math.min(...pts.map((p) => p[0])), Math.min(...pts.map((p) => p[1])), Math.max(...pts.map((p) => p[0])), Math.max(...pts.map((p) => p[1]))]; })();
  return [
    { id: "sala", svg: sala(P, { x0: -300, x1: 300, yF: 100, h: 330, yw: YW }) },
    { id: "mesa", svg: mesa(P, { x: -75, y: -32, w: 165, d: 64, z: TOPO }) },
    { id: "tubo", svg: tuboDeTeto(P, { x: xc, y: 0, zc: 168 }) },
    { id: "banco", svg: sombra(CUID.o, 22) + banco },
    { id: "acomp", svg: pessoa(P, CUID.o, cuidOpt) },
    { id: "crianca", svg: pessoa(P, FILHA.o, { ...kid, bracos: { 1: kidBr, [-1]: kidBr } }) },
    { id: "faixa", svg: faixa },
    { id: "espuma", svg: espuma },
    { id: "sombra-pessoa", svg: sombra(PE.o, 18) },
    { id: "pessoa", svg: pessoa(P, PE.o, peOpt) },
    { id: "campo", svg: campoDeLuz(P, { f0: [xc, 0, 140], z1: 92.5, r: [xc - 14, xc + 14, -14, 14] }) },
    { id: "espalha", svg: espalhamento(P, { de: [xc + 4, 8, 98], para: [PE.o[0] - 8, PE.o[1] - 6, 138], alto: 22 }) + espalhamento(P, { de: [xc + 6, 14, 96], para: [PE.o[0] - 10, PE.o[1] - 2, 118], alto: 14 }) },
  ];
}
