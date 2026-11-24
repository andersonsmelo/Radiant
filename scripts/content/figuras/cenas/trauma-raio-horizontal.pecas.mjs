// Peças de trauma-raio-horizontal (m25): paciente deitado de costas na prancha sobre a maca, colar cervical, tubo do aparelho móvel de um lado com o
// feixe horizontal (perpendicular ao eixo do corpo, paralelo ao piso) e detector em pé do outro lado, junto ao ombro. Em ordem de pintura; sem sala.
import { k, G, helpers, roundRect, at } from "../kit/base.mjs";
import { pessoa } from "../kit/pessoa.mjs";
import { aparelhoMovel, braco, feixe } from "../kit/tubo.mjs";
import { detector, brilho } from "../kit/detector.mjs";
import { maca } from "./comum/maca.mjs";

export function pecas() {
  const W = 640, H = 480, Y = [0, 1, 0], Z = [0, 0, 1], B = [-1, 0, 0];
  const GT = 1.3, ZT = 80, SID = 150, DY = 18, YB = -15;
  const PO = [0, -10, ZT + 3 + 11.5];                 // pelve; cabeca para -y, pes para +y
  const NECK = [0, PO[1] - 53, PO[2]];                  // centro do pescoco
  const XD = -34;                                       // face do detector voltada para o tubo
  const C = [XD, NECK[1], NECK[2]], F0 = at(C, [[1, 0, 0], SID]);
  const UX = F0[0], ZA = F0[2] + 14, YC = -121;
  const box = (x0, x1, y0, y1, z0, z1) => k.boxCorners({ x: x0, y: y0, w: x1 - x0, d: y1 - y0 }, z0, z1);
  const P = k.fitProjection([...box(-45, 20 + SID - 30 + 30, -130, YB, 70, 150)], W, H, { pad: 10, azimuth: 58 });
  const { S, slab } = helpers(P);
  const M = maca(P, { ax: "y", l0: -100, len: 200, zTop: ZT, Rw: 10 });
  const prancha = slab({ x: -24, y: -97, w: 48, d: 170, r: 4 }, ZT, 3, { tone: "hi", className: "c-lead" }, 4, 0.8);
  const pac = pessoa(P, PO, { pose: "deitada", facing: Y, roupa: "camisola" });
  // colar cervical: anel claro em volta do pescoco, entre o queixo e o ombro
  const colar = S(G.solidOf([[0, 7.6], [1, 9.4, 1], [9, 9.4, 1], [10, 7.6]], G.frameAlong([0, NECK[1] + 4.5, NECK[2]], [0, -1, 0]), P, { steps: 22 }), { tone: "mid", className: "c-shirt" });
  const FD = G.frameOf([XD, NECK[1] + DY, ZT + 3], Z, Y, [-1, 0, 0]);
  const det = detector(P, { F: FD, u: [-26, 26], v: [0, 2.6], s: [0, 56] });
  const brilhoDet = brilho(P, { o: [XD + 0.15, NECK[1] + DY, ZT + 3], ea: Y, eb: Z, a: [-21, 21], b: [4, 48] });
  const cabecoteG = () => S(G.solidOf([[0, 7.5 * GT], [1.6 * GT, 9.5 * GT, 1], [34.4 * GT, 9.5 * GT, 1], [36 * GT, 7.5 * GT]], G.frameAlong([F0[0] - 18 * GT, F0[1], F0[2]], [1, 0, 0]), P, { steps: 20 }), { tone: "hi", className: "c-mach" });
  const colimadorG = () => { const FC = G.frameOf(F0, B, Y, G.cross3(B, Y)); return S(G.prismOf(FC, roundRect(-8 * GT, 8 * GT, -8 * GT, 8 * GT, 2), 8 * GT, 20 * GT, P), { tone: "hi", className: "c-mach" }) + S(G.prismOf(FC, roundRect(-6 * GT, 6 * GT, -6 * GT, 6 * GT, 1.5), 20 * GT, 22 * GT, P), { tone: "mid", className: "c-dark" }); };
  const F0x = at(F0, [B, 22 * GT - 22]);
  return [
    { id: "sala", svg: "" },
    { id: "aparelho", svg: aparelhoMovel(P, { ux: UX, yc: YC }) },
    { id: "maca-tras", svg: M.tras },
    { id: "maca", svg: M.corpo + M.cab + M.pes },
    { id: "prancha", svg: prancha },
    { id: "detector", svg: det + brilhoDet },
    { id: "paciente", svg: pac },
    { id: "feixe", svg: feixe(P, { f0: F0x, b: B, c: [XD, NECK[1], NECK[2]], u: Z, v: Y, campo: 16 }) },
    { id: "colar", svg: colar },
    { id: "braco", svg: braco(P, { ux: UX, yc: YC, za: ZA, f0: F0 }) },
    { id: "tubo", svg: cabecoteG() + colimadorG() },
  ];
}
