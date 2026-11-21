// Maca de transporte do lote 2B: estrado, colchao, quatro rodas e, nas rodas do lado do espectador, o bloco do freio (calco).
// ax = eixo do comprimento ("x" ou "y"); a lado perto da camera (azimute 58/68: +y para ax x, +x para ax y) tem as rodas medidas.
import { k, G, helpers } from "../../kit/base.mjs";
export function maca(P, { ax = "x", l0, len = 200, c = 0, wid = 64, zTop = 80, Rw = 10, calcos = null }) {
  const { S, slab, cyl } = helpers(P);
  const w2 = (l, t) => (ax === "x" ? [l, c + t] : [c + t, l]);
  const plan = (l, t, a, b, r) => (ax === "x" ? { x: l, y: c + t, w: a, d: b, r } : { x: c + t, y: l, w: b, d: a, r });
  const N = ax === "x" ? [0, 1, 0] : [1, 0, 0];
  const wheel = (l, t) => { const [x, y] = w2(l, t); return S(G.disc(-2, 2, Rw, G.frameAlong([x, y, Rw], N), P, {}), { tone: "mid", className: "c-lead" }); };
  const post = (l, t) => { const [x, y] = w2(l, t); return cyl(x, y, 2.3, Rw, zTop - 16 - Rw, { tone: "mid", className: "c-dark" }, 10); };
  const ends = [l0 + 38, l0 + len - 46], T = wid / 2 + 1;
  // lado de trás (longe da câmera): todas as rodas travadas, com o bloco pousado; só a roda do alvo (do lado da câmera) tem o bloco erguido
  const blocoTras = (l) => {
    const [x, y] = w2(l + 9, -T), zb = 2 * Rw + 9;
    return slab(plan(l - 11, -T - 5.5, 22, 11, 2.5), 2 * Rw, 9, { tone: "hi", className: "c-apron2" }, 3, 0.6)
      + cyl(x, y, 1.4, zb, zTop - 16 - zb, { tone: "mid", className: "c-dark" }, 8);
  };
  const tras = [post, wheel].map((f) => ends.map((l) => f(l, -T)).join("")).join("") + (calcos ? ends.map(blocoTras).join("") : "");
  const body = slab(plan(l0 + 2, -wid / 2 + 3, len - 4, wid - 6, 3), zTop - 18, 6, { tone: "mid", className: "c-bed" }, 3, 0.5)
    + slab(plan(l0, -wid / 2, len, wid, 8), zTop - 10, 10, { tone: "mid", className: "c-mat" }, 6, 1.2);
  // hastes do freio (sobem do bloco ate o estrado) ficam no corpo; o bloco fica com a roda
  const corpo = ends.map((l) => post(l, T)).join("");
  const roda = (i) => {
    const l = ends[i], up = calcos ? !calcos[i] : false; // calcos[i] = true: bloco pousado (travada)
    let o = wheel(l, T);
    if (calcos) {
      const zb = 2 * Rw + (up ? 18 : 0);
      o += slab(plan(l - 11, T - 5.5, 22, 11, 2.5), zb, 9, { tone: "hi", className: "c-apron2" }, 3, 0.6);
    }
    return o;
  };
  const hastes = calcos ? ends.map((l, i) => { const [x, y] = w2(l + 9, T), up = !calcos[i], zb = 2 * Rw + (up ? 18 : 0) + 9; return cyl(x, y, 1.4, zb, zTop - 16 - zb, { tone: "mid", className: "c-dark" }, 8); }).join("") : "";
  return { tras, corpo: body + corpo + hastes, cab: roda(0), pes: roda(1), ends, T, Rw };
}
