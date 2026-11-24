// Peças e posições comuns das duas cenas da m26 (fluoroscopia-cadeia, sala-de-fluoroscopia-espalhada): mesmo ponto de vista
// (azimute da sala da m17), mesma mesa, mesmo tubo sob a mesa, mesmo receptor, mesmo paciente e mesmo operador. Mundo em cm, z para cima,
// a mesa corre ao longo de x (cabeça do paciente em -x), a parede de fundo fica em y = YW e o espectador olha de +y.
import { k, G, helpers, at } from "../../kit/base.mjs";
import { pessoa, alturaPelve } from "../../kit/pessoa.mjs";
import { cabecote, colimador, feixe } from "../../kit/tubo.mjs";
import { sala, hx, wp, ln, projecao, YW } from "./sala.mjs";
export { k, helpers, hx, sala, projecao, YW, feixe };

// ---- posições (cm)
export const POS = {
  mesa: { x: -110, y: -30, w: 220, d: 60, z: 78 },   // tampo de 220 x 60, face de cima a 78 cm
  tubo: [-30, 0, 30],                                // centro do cabeçote sob a mesa (eixo ao longo de x)
  rec: { cx: -30, w: 66, z0: 124, z1: 152 },         // receptor: face de baixo a 124 cm (46 cm acima do tampo), 28 cm de espessura
  coluna: { x: -30, y: -62 },                        // coluna do arco, atrás da mesa
  paciente: [-12, 0, 93],                            // pelve do paciente deitado, cabeça em -x
  operador: [58, 72, alturaPelve()],                 // de pé ao lado da mesa (lado +y, o do espectador), na altura das pernas do paciente, de frente para ela (-y)
  pedal: { x: 102, y: 66 },
  monitor: { x: 150, y: -60 },
  saiote: { x0: -4, x1: 68, y: 30 },                 // preso à lateral do tampo, do lado do operador, entre a mesa e ele; a câmera vê a face de fora
  biombo: { x: 136, y: -80 },
  segunda: [198, -80, alturaPelve()],
};
export const Z_CAMPO = POS.rec.z0;
const f3 = (x, y, z) => [x, y, z];

export function mesaFluoro(P) {
  const { slab, shadow } = helpers(P);
  const m = POS.mesa, o = [];
  o.push(shadow({ x: -132, y: -42, w: 88, d: 84, r: 8 }));
  o.push(slab({ x: -128, y: -38, w: 80, d: 76, r: 7 }, 0, 10, { tone: "mid", className: "c-mach" }, 4, 1));
  o.push(slab({ x: -108, y: -17, w: 36, d: 34, r: 5 }, 10, 54, { tone: "hi", className: "c-mach" }, 4, 1));
  o.push(slab({ x: m.x + 6, y: m.y + 6, w: m.w - 12, d: m.d - 12, r: 4 }, m.z - 12, 8, { tone: "mid", className: "c-dark" }, 3, 0.6));
  o.push(slab({ x: m.x, y: m.y, w: m.w, d: m.d, r: 5 }, m.z - 4, 4, { tone: "hi", className: "c-mat" }, 4, 0.8));
  return o.join("");
}
// base e coluna do arco, atrás da mesa, com o braço de baixo (até o cabeçote) e o de cima (até o receptor)
export function arco(P) {
  const { slab } = helpers(P);
  const { x, y } = POS.coluna, [tx, , tz] = POS.tubo, o = [];
  o.push(slab({ x: x - 22, y: y - 20, w: 44, d: 40, r: 6 }, 0, 10, { tone: "mid", className: "c-mach" }, 4, 0.8));
  o.push(slab({ x: x - 7, y: y - 7, w: 14, d: 14, r: 3 }, 10, 168, { tone: "hi", className: "c-mach" }, 3, 0.6));
  o.push(slab({ x: tx - 4, y: y - 7, w: 8, d: -9.5 - (y - 7), r: 2 }, tz - 5, 10, { tone: "hi", className: "c-mach" }, 3, 0.4));
  o.push(slab({ x: tx - 4, y: y - 7, w: 8, d: 0 - (y - 7) + 4, r: 2 }, POS.rec.z1 + 14, 10, { tone: "hi", className: "c-mach" }, 3, 0.4));
  o.push(slab({ x: tx - 6, y: -6, w: 12, d: 12, r: 2 }, POS.rec.z1, 14, { tone: "mid", className: "c-dark" }, 3, 0.4));
  return o.join("");
}
// cabeçote exagerado em 1,45 vezes no raio e 1,35 no comprimento (peça nova: o do kit é pequeno demais para o ponto de 12 pt e o tampo cobre o resto)
const SR = 1.45, SL = 1.35, F0C = [POS.tubo[0], POS.tubo[1], POS.tubo[2] + 5];
export function tubo(P) {
  const { S } = helpers(P);
  const [tx, ty, tz] = POS.tubo, L = 36 * SL;
  const FH = G.frameAlong([tx - L / 2, ty, tz], [1, 0, 0]);
  const cab = S(G.solidOf([[0, 7.5 * SR], [1.6 * SL, 9.5 * SR, 1], [L - 1.6 * SL, 9.5 * SR, 1], [L, 7.5 * SR]], FH, P, { steps: 20 }), { tone: "hi", className: "c-mach" });
  return cab + colimador(P, { f0: F0C, b: [0, 0, 1] });
}
export function receptor(P) {
  const { slab } = helpers(P);
  const { cx, w, z0, z1 } = POS.rec;
  return slab({ x: cx - w / 2, y: -w / 2, w, d: w, r: 5 }, z0 + 5, z1 - z0 - 5, { tone: "hi", className: "c-mach" }, 4, 1)
    + slab({ x: cx - w / 2 + 3, y: -w / 2 + 3, w: w - 6, d: w - 6, r: 3 }, z0, 5, { tone: "hi", className: "c-blue" }, 3, 0.5);
}
// cone: do colimador até o campo na face de baixo do receptor
export const cone = (P) => feixe(P, { f0: F0C, b: [0, 0, 1], c: [POS.rec.cx, 0, Z_CAMPO], u: [1, 0, 0], v: [0, 1, 0], campo: 32, id: "gx" });

export function pedal(P) {
  const { slab, shadow, tube } = helpers(P);
  const { x, y } = POS.pedal;
  return shadow({ x: x - 28, y: y - 22, w: 56, d: 44, r: 8 })
    + slab({ x: x - 26, y: y - 19, w: 52, d: 38, r: 6 }, 0, 6, { tone: "mid", className: "c-dark" }, 4, 0.6)
    + slab({ x: x - 20, y: y - 14, w: 40, d: 28, r: 6 }, 6, 9, { tone: "hi", className: "c-blue" }, 4, 1.2)
    + tube([[x + 26, y + 6, 3], [x + 46, y + 14, 3], [x + 62, y + 4, 3]], 1.6, { tone: "mid", fillet: 8 });
}
export function monitor(P, { parte = "pedestal" } = {}) {
  const { slab, cyl, shadow } = helpers(P);
  const { x, y } = POS.monitor, z = 104, w = 86, h = 64, o = [];
  if (parte === "pedestal") {
    o.push(shadow({ x: x - 30, y: y - 22, w: 60, d: 44, r: 8 }));
    o.push(slab({ x: x - 26, y: y - 18, w: 52, d: 40, r: 7 }, 0, 4, { tone: "mid", className: "c-mach" }, 4, 0.5));
    o.push(cyl(x, y, 3, 4, z - 4, { tone: "mid", className: "c-dark" }, 12));
    return o.join("");
  }
  o.push(slab({ x: x - w / 2, y: y - 2.5, w, d: 5, r: 2.5 }, z, h, { tone: "hi", className: "c-dark" }, 3, 0.5));
  const yf = y + 2.9, zs = z + 5;
  o.push(`<path class="screen" d="${k.pathOf([[x - w / 2 + 5, zs], [x + w / 2 - 5, zs], [x + w / 2 - 5, zs + h - 10], [x - w / 2 + 5, zs + h - 10]].map(([a, b]) => k.iso([a, yf, b], P)), true)}"/>`);
  // a imagem na tela: contorno do tórax em traço fino
  const cx = x, cz = zs + (h - 10) / 2, pts = Array.from({ length: 24 }, (_, i) => [cx + 15 * Math.cos((i / 24) * 2 * Math.PI), cz + 17 * Math.sin((i / 24) * 2 * Math.PI)]);
  o.push(wp(P, yf + 0.1, pts, ln(hx.papel, 1.4)));
  o.push(wp(P, yf + 0.1, [[cx, cz - 17], [cx, cz + 17]], ln(hx.papel, 1.2), false));
  return o.join("");
}
// saiote plumbífero preso à lateral do tampo, do lado de quem opera (y = POS.saiote.y): a placa pende da barra da borda até perto do chão e a câmera
// vê a face do lado da mesa, a que o espalhamento atinge; o biombo móvel é um painel perpendicular a x (barra o que vem de -x)
export function saiote(P) {
  const { slab } = helpers(P);
  const m = POS.mesa, { x0, x1, y } = POS.saiote;
  const s = Math.sign(y), yp = s > 0 ? y + 1 : y - 5;
  return slab({ x: x0, y: yp, w: x1 - x0, d: 4, r: 1 }, 12, m.z - 12 - 12 + 4, { tone: "hi", className: "c-apron" }, 3, 0.4)
    + slab({ x: x0 - 2, y: s > 0 ? y - 1 : y - 7, w: x1 - x0 + 4, d: 8, r: 1.5 }, m.z - 10, 6, { tone: "mid", className: "c-dark" }, 3, 0.3);
}
export function biombo(P, { x = POS.biombo.x, y = 0, w = 84, h = 172 } = {}) {
  const { slab, shadow, wheel } = helpers(P);
  const o = [shadow({ x: x - 14, y: y - w / 2 - 6, w: 36, d: w + 12, r: 8 })];
  for (const fy of [y - w / 2, y + w / 2 - 8]) {
    o.push(slab({ x: x - 12, y: fy - 2, w: 28, d: 12, r: 3 }, 3, 4, { tone: "mid", className: "c-dark" }, 3, 0.5));
  }
  o.push(slab({ x: x - 1, y: y - w / 2, w: 8, d: 5, r: 1.5 }, 7, h - 7, { tone: "hi", className: "c-mach" }, 3, 0.4));
  o.push(slab({ x: x - 1, y: y + w / 2 - 5, w: 8, d: 5, r: 1.5 }, 7, h - 7, { tone: "hi", className: "c-mach" }, 3, 0.4));
  o.push(slab({ x, y: y - w / 2 + 4, w: 6, d: w - 8, r: 1.5 }, 30, h - 44, { tone: "hi", className: "c-lead" }, 3, 0.5));
  o.push(slab({ x: x - 0.6, y: y - 14, w: 7.2, d: 28, r: 1 }, h - 62, 24, { tone: "hi", className: "c-blue" }, 3, 0.3));
  o.push(slab({ x: x - 1, y: y - w / 2 - 1, w: 8, d: w + 2, r: 2 }, h - 4, 4, { tone: "mid", className: "c-mach" }, 3, 0.4));
  return o.join("");
}
// óculos plumbíferos: duas lentes e a ponte, na altura dos olhos, na frente (-y) do rosto da pessoa em pé de frente para -y
export function oculos(P, o3) {
  const { slab } = helpers(P);
  const [px, py, pz] = o3, zE = pz + 57 + 12.5, yf = py - 8.2;
  // lentes na frente do rosto e uma haste até a orelha, do lado que a câmera vê (+x); de costas para a câmera, as lentes ficam atrás da cabeça
  return slab({ x: px - 7.6, y: yf - 1.8, w: 15.2, d: 3.4, r: 1 }, zE - 2.6, 5.2, { tone: "hi", className: "c-blue" }, 3, 0.2)
    + slab({ x: px + 7.0, y: yf, w: 1.8, d: 10, r: 0.6 }, zE - 0.6, 1.8, { tone: "hi", className: "c-blue" }, 2, 0.1);
}

export function pacienteOpt(saida) { return { pose: "deitada", facing: [1, 0, 0], roupa: "camisola", saida }; }
export const operadorOpt = { pose: "em-pe", facing: [0, -1, 0], roupa: "scrub", avental: true, bracos: { [-1]: { abd: 10, bend: 40 }, 1: { abd: 10, bend: 40 } } };
export const segundaOpt = { pose: "em-pe", facing: [0, 1, 0], roupa: "camisa", avental: true };
export { pessoa };

// camera: caixa de cada coisa que a cena mostra (mesmo azimute nas duas cenas)
export const caixa = (x0, x1, y0, y1, z0, z1) => k.boxCorners({ x: x0, y: y0, w: x1 - x0, d: y1 - y0 }, z0, z1);
// azimute 112 (espelho do 68 da sala da m17): a câmera fica do lado da cabeça do paciente e do operador, que vê de costas, com o saiote entre ele e a mesa
export const AZM = 112;
export const cameraDe = (caixas, M = 6) => k.fitProjection(caixas.flatMap(([x0, x1, y0, y1, z0, z1]) => caixa(x0 - M, x1 + M, y0 - M, y1 + M, Math.max(0, z0 - M), z1 + M)), 640, 480, { pad: 10, azimuth: AZM });
export { at, G, f3 };
