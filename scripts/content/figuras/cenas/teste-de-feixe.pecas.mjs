// teste-de-feixe (m32): tubo no alto, colimador, tres laminas de filtro num suporte, medidor sobre a mesa e mostrador com tres barras. PARADO.
import { k, G, helpers, roundRect } from "../kit/base.mjs";
import { mesa } from "../kit/mesa.mjs";
import { feixe } from "../kit/tubo.mjs";
import { wp, wcirc, hx, W, H } from "./comum/sala.mjs";

/** As peças da cena em ordem de pintura: [{ id, svg }]. */
export function pecas() {
  const AZ = 68, Z0 = 70, ZC = 186;            // azimute (o mesmo das cenas da m31), tampo da mesa, centro do cabecote
  const box = (x0, x1, y0, y1, z0, z1) => k.boxCorners({ x: x0, y: y0, w: x1 - x0, d: y1 - y0 }, z0, z1);
  const P = k.fitProjection([...box(-34, 100, -24, 26, 64, 212), [-104, 0, 100]], W, H, { pad: 8, azimuth: AZ });
  const { S, slab, cyl, tube, shadow } = helpers(P);
  const pc = {};
  pc.chao = slab({ x: -90, y: -110, w: 240, d: 190, r: 0.01 }, -4, 4, { tone: "lo", className: "c-bed" }, 2, 0);
  pc.mesa = mesa(P, { x: -46, y: -34, w: 108, d: 68, z: Z0 });
  // medidor: caixa baixa com a janela de leitura em cima (tamanho EXAGERADO para o marcador esconder menos)
  const MW = 38, MD = 24, MH = 12;
  pc.medidor = shadow({ x: -MW / 2 - 2, y: -MD / 2 - 2, w: MW + 4, d: MD + 4, r: 4 })
    + slab({ x: -MW / 2, y: -MD / 2, w: MW, d: MD, r: 3 }, Z0, MH, { tone: "hi", className: "c-lead" }, 4, 0.8)
    + cyl(0, 0, 5.6, Z0 + MH, 0.8, { tone: "mid", className: "c-dark" }, 16);
  // cabo do medidor ate o mostrador (sobre o tampo, depois sobe pelo pedestal)
  pc.cabo = tube([[MW / 2 - 1, 4, Z0 + 3], [30, 6, Z0 + 1.5], [44, 8, Z0 + 1.5], [56, 14, Z0 - 6], [62, 14, 58]], 0.9, { tone: "mid", fillet: 5 });
  // mostrador: pedestal, tela de frente para +y com tres barras de alturas diferentes
  const DX = 62, DZ = 82;
  pc.mostrador = shadow({ x: DX - 14, y: -4, w: 40, d: 40, r: 6 })
    + slab({ x: DX - 12, y: 0, w: 36, d: 30, r: 4 }, 0, 3, { tone: "mid", className: "c-dark" }, 3, 0.5)
    + slab({ x: DX + 2, y: 11, w: 8, d: 8, r: 2 }, 3, DZ - 3, { tone: "hi", className: "c-dark" }, 3, 0.4)
    + slab({ x: DX - 22, y: 8, w: 56, d: 8, r: 3 }, DZ, 40, { tone: "hi", className: "c-mach" }, 4, 0.9);
  const YS = 16.4; // face da frente do mostrador
  pc.mostrador += wp(P, YS, [[DX - 18, DZ + 4], [DX + 30, DZ + 4], [DX + 30, DZ + 36], [DX - 18, DZ + 36]], `fill="${hx.papel}" stroke="${hx.mid}" stroke-width=".6" stroke-linejoin="round"`);
  [[DX - 12, 11], [DX + 3, 24], [DX + 18, 17]].forEach(([x, h]) => { pc.mostrador += wp(P, YS + 0.2, [[x, DZ + 7], [x + 9, DZ + 7], [x + 9, DZ + 7 + h], [x, DZ + 7 + h]], `fill="#5EEAF7" fill-opacity=".85" stroke="#5EEAF7" stroke-width=".5" stroke-linejoin="round"`); });
  // suporte das laminas: base no tampo, dois montantes e tres laminas finas e de espessuras crescentes
  const ZL = [104, 114, 124], TL = [0.9, 1.8, 2.7];
  pc.suporte = [-27, 23].map((x) => slab({ x, y: -9, w: 4, d: 5, r: 1 }, Z0 + 2, ZL[2] + 7 - Z0, { tone: "hi", className: "c-dark" }, 3, 0.4)).join("");
  pc.laminas = ZL.map((z, i) => slab({ x: -24, y: -7, w: 48, d: 14, r: 2 }, z, TL[i], { tone: "hi", className: "c-lead" }, 3, 0.3)).join("");
  // feixe: do colimador (22 cm abaixo do ponto F0) ao medidor
  const F0 = [0, 0, ZC - 18];
  pc.feixe = feixe(P, { f0: F0, b: [0, 0, -1], c: [0, 0, Z0 + MH + 0.8], u: [1, 0, 0], v: [0, 1, 0], campo: 15 });
  // coluna e braco atras da mesa; cabecote em caixa com janela e ponto amarelo na frente
  pc.coluna = shadow({ x: -22, y: -112, w: 44, d: 34, r: 6 })
    + slab({ x: -20, y: -110, w: 40, d: 30, r: 4 }, 0, 6, { tone: "mid", className: "c-mach" }, 4, 0.8)
    + slab({ x: -7, y: -101, w: 14, d: 14, r: 3 }, 6, ZC + 30 - 6, { tone: "hi", className: "c-mach" }, 3, 0.5)
    + slab({ x: -6, y: -101, w: 12, d: 100, r: 3 }, ZC + 18, 11, { tone: "hi", className: "c-mach" }, 3, 0.5);
  pc.tubo = cyl(0, 0, 4, ZC + 14, 6, { tone: "mid", className: "c-dark" }, 12)
    + slab({ x: -17, y: -15, w: 34, d: 30, r: 6 }, ZC - 15, 30, { tone: "hi", className: "c-mach" }, 5, 1.1)
    + wp(P, 15.3, [[-14, ZC - 5], [14, ZC - 5], [14, ZC + 12], [-14, ZC + 12]], `fill="${hx.papel}" stroke="${hx.mid}" stroke-width=".6" stroke-linejoin="round"`)
    + wcirc(P, 15.5, 6.5, ZC + 4.5, 4.6, `fill="${hx.amarelo}" stroke="${hx.nucleo}" stroke-width=".6"`);
  { const FC = G.frameOf([0, 0, ZC - 15], [0, 0, -1], [0, 1, 0], [1, 0, 0]); pc.colimador = S(G.prismOf(FC, roundRect(-10, 10, -10, 10, 2.5), 0, 22, P), { tone: "hi", className: "c-mach" }) + S(G.prismOf(FC, roundRect(-7.5, 7.5, -7.5, 7.5, 1.8), 22, 25, P), { tone: "mid", className: "c-dark" }); }
  const ORDEM = ["chao", "mesa", "coluna", "medidor", "cabo", "mostrador", "feixe", "suporte", "laminas", "tubo", "colimador"];
  return ORDEM.map((id) => ({ id, svg: pc[id] }));
}
