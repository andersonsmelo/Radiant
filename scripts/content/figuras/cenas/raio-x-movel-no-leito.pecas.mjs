// Peças de raio-x-movel-no-leito (m25): paciente recostado, aparelho móvel apontado para o tórax, detector atrás das costas, operador de avental a
// 2,5 m, pessoa sem avental junto à cabeceira e leito vizinho no sentido do feixe. Parte da cena-modelo do kit (cena-leito) com cabeçote, colimador
// e detector aumentados (dito na evidência). Em ordem de pintura; a sala não é desenhada.
import { k, G, RAD, helpers, at, roundRect } from "../kit/base.mjs";
import { pessoa, alturaPelve, silhueta } from "../kit/pessoa.mjs";
import { aparelhoMovel, braco, feixe } from "../kit/tubo.mjs";
import { detector, brilho } from "../kit/detector.mjs";
import { leito, peDoLeito, manta } from "../kit/leito.mjs";

export function pecas() {
  const W = 640, H = 480, TILT = 65, c = Math.cos(TILT * RAD), s = Math.sin(TILT * RAD);
  const D = [-c, 0, s], N = [s, 0, c], Y = [0, 1, 0], B = G.mul3(N, -1);
  const GT = 1.3, GD = 1.3; // aumento do cabecote/colimador e do detector (didatico; dito no relatorio)
  const HINGE = [-30, 0, 64], C = at(HINGE, [D, 33], [N, 10.5]), F0 = at(C, [N, 120]);
  const UX = F0[0], ZA = F0[2] + 14, YC = -121;
  const NSH = -90, LEX = -330, BX = -95, BY = 100;
  const BYST = [BX, BY, alturaPelve()], OPER = [175, -150, alturaPelve()], NEI = [-196 + NSH, 0, 75];
  const BYST_OPT = { pose: "em-pe", facing: [0.72, 0.69, 0], roupa: "camisa" };
  const OPER_OPT = { pose: "em-pe", facing: Y, roupa: "scrub", avental: true, bracos: { [-1]: { abd: 6, bend: 78 } } };
  const extremes = [
    ...k.boxCorners({ x: -112, y: -48, w: 224, d: 96 }, 0, 112), ...k.boxCorners({ x: UX - 26, y: -152, w: 112, d: 60 }, 0, 218),
    [OPER[0] + 25, -170, 165], [OPER[0] + 25, -130, 0], [-135, 120, 175], [-135, 120, 0], [LEX, -46, 100], [LEX, 46, 0],
  ];
  const P = k.fitProjection(extremes, W, H, { pad: 8, azimuth: 58 });
  const { p2, S, cyl, slab, shadow } = helpers(P);
  const sombraPessoa = (o) => shadow({ x: o[0] - 16, y: o[1] - 16, w: 32, d: 32, r: 15 });
  const vizinho = () => leito(P, { x0: -372 + NSH, w: 208, colchao: [-364 + NSH, 192], cabeceira: false, pernas: [[-172 + NSH, -38], [-172 + NSH, 38]], grades: false }) + slab({ x: -172 + NSH, y: -46, w: 6, d: 92, r: 2 }, 36, 40, { tone: "mid", className: "c-bed" }, 3, 0.6)
    + shadow({ x: NEI[0] - 20, y: -20, w: 40, d: 40, r: 18 }) + pessoa(P, NEI, { pose: "deitada", facing: [1, 0, 0], roupa: "camisola", pernas: false }) + manta(P, { x: -214 + NSH, y: -27, w: 66, d: 54, r: 12 });
  const cama = () => leito(P, { encosto: { hinge: HINGE, D, N } });
  const detectorG = () => detector(P, { F: G.frameOf([HINGE[0], -22 - 6, HINGE[2]], Y, D, N), u: [10, 66], v: [8, 10.6], s: [0, 56] });
  const brilhoDet = () => brilho(P, { o: at(HINGE, [N, 10.7]), ea: Y, eb: D, a: [-20, 20], b: [14, 58] });
  function paciente() {
    const O = at(HINGE, [D, -1], [N, 24]);
    let o = pessoa(P, O, { pose: "recostada", facing: [1, 0, 0], tilt: 25, roupa: "camisola", pernas: false });
    o += slab({ x: -16, y: -25, w: 114, d: 50, r: 12 }, 64, 15, { tone: "hi", className: "c-blanket" }, 6, 1.4);
    for (const y of [-9, 9]) o += S(k.cylinder(88, y, 6.5, 79, 5, P, 14), { tone: "hi", className: "c-blanket" });
    return o;
  }
  // cabecote e colimador GT vezes maiores (mesmo desenho do kit), saida do feixe em 22 * GT do centro
  const cabecoteG = () => { const FH = G.frameAlong([F0[0] - 18 * GT, F0[1], F0[2]], [1, 0, 0]); return S(G.solidOf([[0, 7.5 * GT], [1.6 * GT, 9.5 * GT, 1], [34.4 * GT, 9.5 * GT, 1], [36 * GT, 7.5 * GT]], FH, P, { steps: 20 }), { tone: "hi", className: "c-mach" }); };
  const colimadorG = () => { const v = G.cross3(B, Y), FC = G.frameOf(F0, B, Y, v); return S(G.prismOf(FC, roundRect(-8 * GT, 8 * GT, -8 * GT, 8 * GT, 2), 8 * GT, 20 * GT, P), { tone: "hi", className: "c-mach" }) + S(G.prismOf(FC, roundRect(-6 * GT, 6 * GT, -6 * GT, 6 * GT, 1.5), 20 * GT, 22 * GT, P), { tone: "mid", className: "c-dark" }); };
  const operador = () => { const sai = {}; const body = pessoa(P, OPER, { ...OPER_OPT, saida: sai }); const w = sai.pulso[-1];
    return body + cyl(w[0], w[1] + 0.5, 2.2, w[2] - 6, 12, { tone: "hi", className: "c-dark" }, 12) + `<circle class="led" cx="${p2([w[0], w[1] + 0.5, w[2] + 6.5])[0].toFixed(1)}" cy="${p2([w[0], w[1] + 0.5, w[2] + 6.5])[1].toFixed(1)}" r="1.5"/>`; };
  const extras = () => {
    const e = (x) => at(C, [B, (C[0] - x) / s]);
    const line = `<path class="scatter" d="${k.pathOf([p2(at(C, [B, 12])), p2(e(-270))])}"/>`;
    const src = at(HINGE, [D, 40], [N, 14]), hull = silhueta(P, BYST, BYST_OPT);
    const dentro = ([x, y]) => { let r = false; for (let a = 0, cc = hull.length - 1; a < hull.length; cc = a++) { const [xa, ya] = hull[a], [xc, yc] = hull[cc]; if (ya > y !== yc > y && x < ((xc - xa) * (y - ya)) / (yc - ya) + xa) r = !r; } return r; };
    const arcs = [[0, 0], [10, 8], [-10, -6]].map(([dz, dy]) => {
      const t = G.add3(BYST, [0, 0, 36 + dz]), m = G.lerp3(src, t, 0.5), mid = G.add3(m, [0, 8 + dy, 10]);
      const [a, cc, d] = [p2(src), p2(mid), p2(t)], pts = [];
      for (let i = 0; i <= 60; i++) { const u = i / 60, q = [0, 1].map((ee) => (1 - u) ** 2 * a[ee] + 2 * (1 - u) * u * cc[ee] + u * u * d[ee]); if (dentro(q)) { pts.push(q); break; } pts.push(q); }
      return `<path class="scatter" d="${k.pathOf(pts)}"/>`;
    });
    return line + arcs.join("");
  };
  const F0x = at(F0, [B, 22 * GT - 22]);
  return [
    { id: "sala", svg: "" },
    { id: "vizinho", svg: vizinho() },
    { id: "aparelho", svg: aparelhoMovel(P, { ux: UX, yc: YC }) },
    { id: "sombra-operador", svg: sombraPessoa(OPER) },
    { id: "operador", svg: operador() },
    { id: "cama", svg: cama() },
    { id: "detector", svg: detectorG() },
    { id: "paciente", svg: paciente() },
    { id: "pe-do-leito", svg: peDoLeito(P, { x: 106 }) },
    { id: "sombra-circulante", svg: sombraPessoa(BYST) },
    { id: "circulante", svg: pessoa(P, BYST, BYST_OPT) },
    { id: "braco", svg: braco(P, { ux: UX, yc: YC, za: ZA, f0: F0 }) },
    { id: "tubo", svg: cabecoteG() + colimadorG() },
    { id: "feixe", svg: feixe(P, { f0: F0x, b: B, c: C, u: D, v: Y, campo: 32 }) + brilhoDet() },
    { id: "espalhada", svg: extras() },
  ];
}
