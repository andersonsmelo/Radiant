// Pessoa isometrica do kit Radiant: modulo unico, trocavel sem tocar nas cenas.
// Contrato: pessoa(P, o, opt) -> string de SVG (classes c-*), onde P e a projecao da cena, o o centro da pelve (cm) e
//   opt = { pose: "em-pe"|"sentada"|"recostada"|"deitada", facing: [x,y,z] horizontal (frente do corpo; na deitada, para onde vao os pes),
//           idade: "adulto"|"crianca", avental: bool, roupa: "camisa"|"scrub"|"camisola"|"infantil", tilt: graus (recostada),
//           bracos: { [-1|1]: { abd, bend } } em graus, joelho: graus,
//           curva: graus de inclinacao do tronco para a frente (em pe), cabelo: classe c-* do cabelo,
//           perna: { [-1|1]: { thigh, shin, toe } } vetores, extras: [{ c, svg, bias }] entram na ordenacao por profundidade,
//           saida: objeto que recebe pulso e pernas[sd] = { hip, kn, an, heel, toe, dAx, wAx } }.
// Tronco: uma casca unica por revolucao com secao eliptica (quadril, cintura, peito, ombro no mesmo solido); sem prismas empilhados.
import { k, G, T, helpers, grp, frame3 } from "./base.mjs";
const { add3, sub3, mul3, dot3, cross3, unit3 } = G;
const RAD = Math.PI / 180;
const DIM = { adulto: { K: 1, head: 1, rK: 1 }, crianca: { K: 0.62, head: 1.28, rK: 1.08 } };
export const alturaPelve = (idade = "adulto") => 96.5 * DIM[idade].K;

const piece = (f, pts) => (t) => {
  for (let i = 1; i < pts.length; i++) if (t <= pts[i][0]) { const [a, b] = [pts[i - 1], pts[i]]; return a[1] + ((b[1] - a[1]) * (t - a[0])) / (b[0] - a[0] || 1); }
  return pts[pts.length - 1][1] * f;
};
const orth = (v, a) => unit3(sub3(v, mul3(a, dot3(a, v))));
const rot = (a, toward, deg) => unit3(add3(mul3(a, Math.cos(deg * RAD)), mul3(orth(toward, a), Math.sin(deg * RAD))));

export function pessoa(P, o, opt = {}) {
  const { pose = "em-pe", idade = "adulto", avental = false, roupa = idade === "crianca" ? "infantil" : pose === "deitada" || pose === "recostada" ? "camisola" : "camisa", tone = "mid" } = opt;
  const { K, head: HK, rK } = DIM[idade];
  const HS = idade === "crianca" ? 0.82 / K : 1, HR = idade === "crianca" ? 0.7 : 1; // a cabeca da crianca: comprimento (s) escalado por K nao pode achatar o raio, senao a deitada vira disco
  const { S } = helpers(P);
  const facing = unit3(opt.facing ?? [0, 1, 0]);
  const Z = [0, 0, 1];
  // eixos do corpo por pose
  let A, Fw, thigh, bendDef, armDef;
  if (pose === "deitada") { A = mul3(facing, -1); Fw = Z; thigh = rot(facing, Z, 4); bendDef = 12; armDef = { abd: 14, bend: 8 }; }
  else if (pose === "recostada") { const t = (opt.tilt ?? 25) * RAD; A = add3(mul3(Z, Math.cos(t)), mul3(facing, -Math.sin(t))); Fw = add3(mul3(facing, Math.cos(t)), mul3(Z, Math.sin(t))); thigh = rot(facing, Z, 8); bendDef = 32; armDef = { abd: 12, bend: 32 }; }
  else if (pose === "sentada") { A = Z; Fw = facing; thigh = facing; bendDef = 90; armDef = { abd: 6, bend: 62 }; }
  else { const tc = (opt.curva ?? 0) * RAD; A = add3(mul3(Z, Math.cos(tc)), mul3(facing, Math.sin(tc))); Fw = add3(mul3(facing, Math.cos(tc)), mul3(Z, -Math.sin(tc))); thigh = [0, 0, -1]; bendDef = 0; armDef = { abd: 7, bend: 16 }; }
  const Lt = cross3(Fw, A);
  const pt = (l, f, s) => add3(o, add3(mul3(Lt, l * K), add3(mul3(Fw, f * K), mul3(A, s * K))));
  const Q = opt.q ?? 0.4; // fracao de passos da revolucao: peso do SVG
  const parts = [];
  const put = (c, cls, svg) => { if (process.env.PESO) console.log(cls, (svg.length / 1024).toFixed(1), (svg.match(/<path/g) || []).length); parts.push({ d: k.depthOf(c, P), svg: grp(cls, svg) }); };
  const lathe = (cls, c, profile, ax, wAxis, dAxis, wS, dS, steps = 20) => {
    const F = G.frameOf(c, ax, mul3(wAxis, wS), mul3(dAxis, dS));
    put(c, cls, S(G.solidOf(profile.map(([s, r, sf]) => (sf ? [s * K, r * K * rK, 1] : [s * K, r * K * rK])), F, P, { steps: Math.max(8, Math.round(steps * Q)), smooth: false }), { tone }));
  };
  const limb = (c, cls, points, rf, { fillet = 6, from = 0, to = 1, caps = true } = {}) => {
    const rm = rf(0.3) * K * rK;
    let route = G.fillet(points, fillet * K, 5, { P, tube: rm });
    const len = G.pathLength(route);
    if (from > 0 || to < 1) route = G.cut(route, from * len, to * len);
    const rr = (t) => rf(from + t * (to - from)) * K * rK;
    put(c, cls, T.tubePieces(route, rr, P, { maxLength: 400, caps }).map((p) => T.tubeSvg(p, { tone })).join(""));
  };
  const skin = idade === "crianca" ? "c-skinKid" : "c-skin", hair = opt.cabelo ?? (idade === "crianca" ? "c-hairKid" : "c-hair");
  const top = { camisa: "c-shirt", scrub: "c-scrub", camisola: "c-gown", infantil: "c-kid1" }[roupa];
  const bottom = pose === "deitada" || pose === "recostada" ? "c-pants" : idade === "crianca" ? "c-kid2" : "c-pants";
  const longSleeve = roupa === "camisola" ? 1 : 0.5;

  // pernas: quadril -> joelho -> tornozelo; o joelho dobra no plano da coxa e do "para baixo"
  const bend = (opt.joelho ?? bendDef);
  for (const sd of opt.pernas === false ? [] : [-1, 1]) {
    const cf = opt.perna?.[sd] ?? {}; const th = cf.thigh ?? thigh; const hip = pt(sd * 8.6, 0, -6), kn = add3(hip, mul3(th, 43 * K));
    const shinDir = cf.shin ? unit3(cf.shin) : bend ? unit3(add3(mul3(th, Math.cos(bend * RAD)), mul3(orth(opt.down ?? [0, 0, -1], th), Math.sin(bend * RAD)))) : th;
    const an = add3(kn, mul3(shinDir, 41 * K));
    const lr = piece(1, [[0, 8.3], [0.2, 7.6], [0.46, 5.5], [0.56, 5.6], [0.72, 5.3], [1, 3.4]]);
    limb(add3(hip, mul3(th, 20 * K)), bottom, [hip, kn, an], lr, { fillet: 9 });
    // sapato: casca eliptica deitada ao longo do pe; o pe aponta para a frente do corpo
    const toe = cf.toe ? unit3(cf.toe) : orth(Fw, shinDir);
    const heel = add3(an, add3(mul3(shinDir, 3.6 * K), mul3(toe, -5.2 * K)));
    const dAx = cf.toe ? orth(shinDir, toe) : shinDir, wAx = cf.toe ? unit3(cross3(toe, dAx)) : Lt; if (opt.saida) (opt.saida.pernas ??= {})[sd] = { hip, kn, an, heel, toe, dAx, wAx };
    lathe("c-shoe", heel, [[0, 3.1], [3, 4.2, 1], [12, 4.7, 1], [18, 3.5, 1], [21, 1.4]], toe, wAx, dAx, 1, 0.74, 16);
    parts[parts.length - 1].d = parts[parts.length - 2].d - 0.01;
  }
  // quadril + coxas altas: um solido so, de revolucao eliptica
  const body = (cls, s0, prof, ws = 1, ds = 0.6) => { lathe(cls, pt(0, 0, s0), prof.map(([s, r, f]) => [s - s0, r, f]), A, Lt, Fw, 1, ds, 24); const mid = pt(0, 14, (s0 + prof[prof.length - 1][0]) / 2); parts[parts.length - 1].d = k.depthOf(mid, P); };
  body(bottom, -11, [[-11, 14.6], [-8, 16.7, 1], [0, 17.3, 1], [8, 15.8, 1], [14, 14.6]], 1, 0.62);
  // tronco continuo: quadril -> cintura -> peito -> ombros -> pescoco, sem emenda
  body(top, 3, [[3, 15.6], [9, 15.0, 1], [18, 14.4, 1], [28, 15.9, 1], [38, 17.2, 1], [45, 19.0, 1], [49.5, 19.3, 1], [53, 13.2, 1], [55.5, 6.2, 1], [57, 5.4]], 1, 0.57);
  const dHead0 = k.depthOf(pt(0, 4, 60), P);
  if (avental) {
    body("c-apron", -30, [[-30, 15.4], [-26, 17.6, 1], [-12, 19.4, 1], [6, 18.9, 1], [18, 17.3, 1], [32, 18.3, 1], [42, 19.4, 1], [46, 16.8, 1], [47.5, 14]], 1, 0.74);
    { const F = G.frameOf(pt(0, 0.5, 49.6), A, Lt, mul3(Fw, 1)); put(pt(0, 8, 52), "c-apron2", S(G.ringBand(0, 2.6 * K, 5.3 * K, 6.5 * K, F, P, { steps: 14, smooth: false }), { tone })); parts[parts.length - 1].d = dHead0 + 0.4; }
    for (const sd of [-1, 1]) limb(pt(sd * 12, 0, 50), "c-apron2", [pt(sd * 12.5, 8.5, 46), pt(sd * 13.5, 0, 53.5), pt(sd * 12.5, -8.5, 46)], () => 1.5, { fillet: 3 });
  }
  // pescoco e cabeca (ovo, mais profunda que larga); cabelo desloca para tras
  lathe(skin, pt(0, 0, 53), [[0, 5.2], [3, 5.0, 1], [8, 4.9]], A, Lt, Fw, 1, 1, 12);
  const hk = HK;
  lathe(skin, pt(0, 0.4, 57 + (hk - 1) * 0), [[0, 3.6 * hk], [3, 6.4 * hk, 1], [9, 7.7 * hk, 1], [15, 7.9 * hk, 1], [20, 6.8 * hk, 1], [23, 3.2 * hk]].map(([s, r, f]) => [s * HS, r / K * HR, f]), A, Lt, Fw, 1, 1.1, 22);
  const dHead = parts[parts.length - 1].d;
  lathe(hair, add3(pt(0, -1.6, 57), mul3(A, 0)), [[11, 7.4 * hk], [15, 8.8 * hk, 1], [20, 8.4 * hk, 1], [22.6, 6.2 * hk, 1], [24.2, 0.4 * hk]].map(([s, r, f]) => [s * HS, r / K * HR, f]), A, Lt, Fw, 1, 1.12, 20);
  parts[parts.length - 1].d = dHead + 0.5;
  // bracos: ombro dentro do tronco, cotovelo que dobra, mao em luva (sem dedos), manga curta ou longa
  for (const sd of [-1, 1]) {
    const cfg = { ...armDef, ...(opt.bracos?.[sd] ?? {}) };
    const sh = pt(sd * 17.6, 0, 47.6), sIn = pt(sd * 7, 0, 47.6);
    const up = unit3(add3(mul3(A, -Math.cos(cfg.abd * RAD)), mul3(Lt, sd * Math.sin(cfg.abd * RAD))));
    const el = add3(sh, mul3(up, 29 * K));
    const fore = rot(up, opt.bracoDir ?? Fw, cfg.bend);
    const wr = add3(el, mul3(fore, 25 * K));
    const ar2 = piece(1, [[0, 5.2], [0.12, 5.2], [0.3, 4.9], [0.55, 4.0], [0.62, 3.9], [1, 2.9]]);
    limb(add3(sh, mul3(up, 12)), skin, [sIn, sh, el, wr], ar2, { fillet: 5, from: 0.0 });
    limb(add3(sh, mul3(up, 10)), top, [sIn, sh, el, wr], (t) => ar2(t * longSleeve) + 0.75, { fillet: 5, to: longSleeve });
    if (opt.saida) (opt.saida.pulso ??= {})[sd] = wr;
    const wAx = orth(Math.abs(dot3(fore, Fw)) > 0.9 ? A : Fw, fore), tAx = cross3(fore, wAx);
    lathe(skin, add3(wr, mul3(fore, -1.2 * K)), [[0, 2.8], [2, 3.9, 1], [6, 4.4, 1], [10, 3.7, 1], [13.5, 1.6]], fore, tAx, wAx, 0.56, 1, 14);
  }
  for (const e of opt.extras ?? []) parts.push({ d: k.depthOf(e.c, P) + (e.bias ?? 0), svg: e.svg });
  return parts.sort((a, b) => a.d - b.d).map((p) => p.svg).join("");
}

// caixa da pessoa na tela (pontos-chave) e area de toque com o minimo de 44 pt do quadro de largura W (padrao 640 = 2 x 320)
export function caixa(P, o, opt = {}) {
  const { pose = "em-pe", idade = "adulto", facing = [0, 1, 0] } = opt, K = DIM[idade].K;
  const f = unit3(facing), Z = [0, 0, 1], side = cross3(f, Z);
  const pts = pose === "em-pe" ? [[0, 0, 80], [-22, 0, 48], [22, 0, 48], [-12, 0, -92], [12, 0, -92], [-20, 0, -24], [20, 0, -24]]
    : pose === "sentada" ? [[0, 0, 80], [-22, 0, 48], [22, 0, 48], [0, 80, -8], [0, 40, -88]]
    : [[0, 0, 80], [-20, 0, 40], [20, 0, 40], [0, 60, -10], [0, 90, -30]];
  const xs = pts.map(([l, ff, s]) => k.iso(add3(o, add3(mul3(side, l * K), add3(mul3(f, ff * K), mul3(Z, s * K)))), P));
  const x0 = Math.min(...xs.map((p) => p[0])), x1 = Math.max(...xs.map((p) => p[0])), y0 = Math.min(...xs.map((p) => p[1])), y1 = Math.max(...xs.map((p) => p[1]));
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}
export function alvoDeToque(P, o, opt = {}, { W = 640, minPt = 44 } = {}) {
  const b = caixa(P, o, opt), min = (minPt * W) / 320;
  const w = Math.max(b.w, min), h = Math.max(b.h, min), cx = b.x + b.w / 2, cy = b.y + b.h / 2;
  return { x: cx - w / 2, y: cy - h / 2, w, h, caixa: b };
}

// contorno 2D aproximado do corpo (tronco e cabeca), para as cenas cortarem linhas na borda da pessoa
export function silhueta(P, o, opt = {}) {
  const { idade = "adulto", facing = [0, 1, 0] } = opt, K = DIM[idade].K, f = unit3(facing), Z = [0, 0, 1], side = cross3(f, Z);
  const pts = [];
  for (const [s, rw, rd] of [[-8, 17, 10], [20, 16, 9.5], [48, 19, 10.5], [62, 8, 9], [78, 7, 8]]) for (let a = 0; a < 12; a++) { const t = (a / 12) * 2 * Math.PI; pts.push(k.iso(add3(o, add3(mul3(side, Math.cos(t) * rw * K), add3(mul3(f, Math.sin(t) * rd * K), mul3(Z, s * K)))), P)); }
  return G.hullOf(pts);
}
