// Cão deitado de lado numa calha de espuma, com sacos de areia sobre as patas (cena radiografia-veterinaria): tudo na escala DK do cão (grande, para o desenho pesar mais).
// Mundo em cm, z para cima; a calha repousa no tampo da mesa em z = ZT; o cão olha para +x.
import { G, helpers, grp } from "../../kit/base.mjs";
const { add3, mul3, unit3, cross3 } = G;
const X = [1, 0, 0], Y = [0, 1, 0], Z = [0, 0, 1];
/** { calha, calhaFrente, cao, sacos }: calhaFrente (parede da frente da calha) pinta depois do cão. */
export function caoNaCalha(P, { ZT }) {
  const { S, slab, tube } = helpers(P);
  const pc = {};
    // calha de espuma: fundo e parede de tras antes do cao, parede da frente depois (tudo do cao em escala DK: cao grande, para o desenho pesar mais)
    const DK = 1.3, CX0 = -48, CL = 74, ZF = ZT + 2.6, WD = 28;
    const dg = ([x, y, z]) => [x * DK, y * DK, ZF + (z - ZF) * DK];
    pc.calha = slab({ x: CX0, y: -WD, w: CL, d: 2 * WD, r: 4 }, ZF, 4, { tone: "hi", className: "c-gown" }, 4, 0.8) + slab({ x: CX0, y: -WD, w: CL, d: 7, r: 2 }, ZF + 4, 12, { tone: "hi", className: "c-gown" }, 3, 0.6);
    pc.calhaFrente = slab({ x: CX0, y: WD - 7, w: CL, d: 7, r: 2 }, ZF + 4, 12, { tone: "hi", className: "c-gown" }, 3, 0.6);
    const ZD = ZF + 4 + 9.5 * DK; // centro do tronco
    const sc = (prof) => prof.map(([s, r, f]) => (f ? [s * DK, r * DK, f] : [s * DK, r * DK]));
    const ax = (c, a, wS, dS, prof, steps = 18) => S(G.solidOf(sc(prof), G.frameOf(c, a, mul3(Y, wS), mul3(Z, dS)), P, { steps, smooth: false }), { tone: "hi", className: "c-hairKid" });
    const leg = (pts, r) => grp("c-hairKid", tube(pts.map(dg), (t) => r(t) * DK, { tone: "hi", fillet: 5 * DK }));
    const paw = (c) => S(G.solidOf(sc([[0, 2.6], [2, 3.5, 1], [5, 3.4, 1], [7, 1.6]]), G.frameOf(add3(dg(c), [-3 * DK, 0, 0]), X, Y, Z), P, { steps: 10, smooth: false }), { tone: "hi", className: "c-hairKid" });
    let cao = "";
    for (const sd of [-1, 1]) {
      cao += leg([[-26, sd * 8.5, ZF + 4 + 9.5 - 1], [-44, sd * 10, ZF + 6], [-58, sd * 10.5, ZF + 3.4]], (t) => 3.4 - 1.2 * t) + paw([-55, sd * 10.5, ZF + 3.4]);
      cao += leg([[10, sd * 8.5, ZF + 4 + 9.5 - 1], [30, sd * 9.5, ZF + 5], [50, sd * 9.5, ZF + 3.4]], (t) => 3.4 - 1.1 * t) + paw([53, sd * 9.5, ZF + 3.4]);
    }
    const ZB = ZF + 4 + 9.5; // centro do tronco antes da escala
    cao += grp("c-hair", tube([[-34, 0, ZB + 4], [-50, -5, ZB + 6], [-62, -13, ZF + 6]].map(dg), (t) => (2.4 - 1.2 * t) * DK, { tone: "hi", fillet: 6 * DK }));
    cao += ax(dg([-34, 0, ZB]), X, 1, 0.74, [[0, 6], [5, 10, 1], [16, 11.8, 1], [30, 13.6, 1], [42, 14, 1], [48, 10]]);
    cao += ax(dg([13, 0, ZB + 1]), X, 1, 0.8, [[0, 9], [8, 6.8, 1], [11, 6.2]], 14);
    const HC = [20, 0, ZF + 4 + 6.2];
    cao += ax(dg(HC), X, 1, 0.86, [[0, 5], [3, 7.4, 1], [10, 7.9, 1], [16, 5.2, 1], [22, 3.6, 1], [24, 2.2]], 20);
    cao += S(G.solidOf(sc([[0, 2.2], [1.6, 2.6, 1], [3, 1.2]]), G.frameOf(dg([42.4, 0, HC[2] + 0.6]), X, Y, Z), P, { steps: 10, smooth: false }), { tone: "hi", className: "c-dark" });
    for (const sd of [-1, 1]) { const a = unit3([0.1, sd * 0.45, -1]); cao += S(G.solidOf(sc([[0, 1.2], [3, 3.2, 1], [9, 3.1, 1], [11.5, 1]]), G.frameOf(dg([28, sd * 6.5, HC[2] + 6]), a, X, mul3(unit3(cross3(a, X)), 0.4)), P, { steps: 10, smooth: false }), { tone: "hi", className: "c-hair" }); }
    pc.cao = cao;
    // sacos de areia sobre as patas
    pc.sacos = slab({ x: 60, y: -20, w: 10, d: 40, r: 3 }, ZF + 4.4 * DK, 6, { tone: "hi", className: "c-kid1" }, 4, 1.2) + slab({ x: -82, y: -22, w: 10, d: 44, r: 3 }, ZF + 4.4 * DK, 6, { tone: "hi", className: "c-kid1" }, 4, 1.2);
  return { calha: pc.calha, calhaFrente: pc.calhaFrente, cao: pc.cao, sacos: pc.sacos };
}
