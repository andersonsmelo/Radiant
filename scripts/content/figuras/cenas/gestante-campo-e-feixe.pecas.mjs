// gestante-campo-e-feixe: gestante de perfil em pé diante do receptor vertical, o tubo longe à esquerda emitindo na horizontal.
// Campo ajustado (cheio) só sobre o tórax; campo aberto demais (tracejado) alcançaria o abdome. Sem proteção desenhada: a aula diz que é o serviço que define.
import { k, G, helpers, grp } from "../kit/base.mjs";
import { pessoa, alturaPelve } from "../kit/pessoa.mjs";
import { cabecote, colimador } from "../kit/tubo.mjs";
import { projecao, sala } from "./comum/sala.mjs";
import { AMARELO, NUCLEO } from "./comum/campo.mjs";

/** As peças da cena em ordem de pintura: [{ id, svg }]. */
export function pecas() {
  const YW = -110, YP = -10, TX = -135, ZT = 135, PX = 22, FP = 20;
  const PES = [PX, YP, alturaPelve()];
  const P = projecao([[TX - 14, YP, 160], [TX - 14, 20, 0], [PX + 50, YP, 188], [PX + 50, 40, 0], [-60, 40, 0]]);
  const { S, slab } = helpers(P);
  const pt = (p) => k.iso(p, P);
  const { add3, mul3, cross3 } = G;
  // barriga: casca de revolução ao longo da frente do corpo (+x), tom da camisola
  const barriga = (() => {
    const Fw = [1, 0, 0], Lt = cross3(Fw, [0, 0, 1]);
    const c = [PX + 1, YP, PES[2] + 4];
    const F = G.frameOf(c, Fw, Lt, [0, 0, 1]);
    const prof = [[0, 11], [6, 14.5, 1], [13, 16, 1], [20, 11, 1], [24, 3]].map(([s, r, f]) => (f ? [s, r, 1] : [s, r]));
    return grp("c-gown", S(G.solidOf(prof, F, P, { steps: 16, smooth: false }), { tone: "mid" }));
  })();
  const tubo = slab({ x: TX - 6, y: YP - 6, w: 12, d: 12, r: 2 }, ZT + 12, 120, { tone: "hi", className: "c-mach" }, 3, 0.6)
    + cabecote(P, { f0: [TX + 18, YP - 18, ZT], eixo: [0, 1, 0] }) + colimador(P, { f0: [TX, YP, ZT], b: [1, 0, 0] });
  const receptor = slab({ x: PX + 24, y: YP - 38, w: 36, d: 60, r: 3 }, 0, 6, { tone: "mid", className: "c-mach" }, 4, 0.8)
    + slab({ x: PX + 40, y: YP - 8, w: 10, d: 12, r: 2 }, 6, 180, { tone: "hi", className: "c-mach" }, 3, 0.6)
    + slab({ x: PX + 36, y: YP - 34, w: 5, d: 52, r: 2 }, 84, 84, { tone: "hi", className: "c-blue" }, 3, 0.5);
  const EX = TX + 22;
  const campo = (zz, hy, cls) => [[FP, YP - hy, zz[0]], [FP, YP + hy, zz[0]], [FP, YP + hy, zz[1]], [FP, YP - hy, zz[1]]];
  const exit = [[-5, -5], [5, -5], [5, 5], [-5, 5]].map(([a, b]) => [EX, YP + a, ZT + b]);
  const TIGHT = campo([118, 152], 16), WIDE = campo([88, 156], 20);
  const dashed = `fill="none" stroke="${AMARELO}" stroke-opacity=".9" stroke-width="2.2" stroke-dasharray="6 6" stroke-linecap="round" stroke-linejoin="round"`;
  const casco = (c) => [0, 1, 2, 3].map((i) => `<path d="${k.pathOf([pt(exit[i]), pt(exit[(i + 1) % 4]), pt(c[(i + 1) % 4]), pt(c[i])], true)}" fill="${AMARELO}" fill-opacity=".1" stroke="none"/>`).join("");
  const feixeAberto = `<path d="${k.pathOf(WIDE.map(pt), true)}" ${dashed}/>` + WIDE.map((p, i) => `<path d="${k.pathOf([pt(exit[i]), pt(p)])}" ${dashed}/>`).join("");
  const feixeAjustado = casco(TIGHT) + TIGHT.map((p, i) => `<path d="${k.pathOf([pt(exit[i]), pt(p)])}" fill="none" stroke="${AMARELO}" stroke-opacity=".9" stroke-width="1.8" stroke-linecap="round"/>`).join("")
    + `<path d="${k.pathOf(TIGHT.map(pt), true)}" fill="${AMARELO}" fill-opacity=".32" stroke="${NUCLEO}" stroke-opacity=".95" stroke-width="2.2" stroke-linejoin="round"/>`;
  const bb = (pts) => { const q = pts.map(pt); return [Math.min(...q.map((p) => p[0])), Math.min(...q.map((p) => p[1])), Math.max(...q.map((p) => p[0])), Math.max(...q.map((p) => p[1]))]; };
  return [
    { id: "sala", svg: sala(P, { x0: -300, x1: 300, yF: 60, h: 330, yw: YW }) },
    { id: "tubo", svg: tubo },
    { id: "receptor", svg: receptor },
    { id: "gestante", svg: helpers(P).shadow({ x: PX - 24, y: YP - 24, w: 48, d: 48, r: 22 }) + pessoa(P, PES, { pose: "em-pe", facing: [1, 0, 0], roupa: "camisola" }) },
    { id: "barriga", svg: barriga },
    { id: "campo-aberto", svg: feixeAberto },
    { id: "campo-ajustado", svg: feixeAjustado },
  ];
}
