// Cinemática do braço da pessoa do kit (mesma conta de kit/pessoa.mjs): dado o ombro e o alvo do punho, acha { abd, bend }.
import { G } from "../../kit/base.mjs";
const { add3, sub3, mul3, dot3, cross3, unit3 } = G;
const RAD = Math.PI / 180, Z = [0, 0, 1];
const orth = (v, a) => unit3(sub3(v, mul3(a, dot3(a, v))));
const rot = (a, toward, deg) => unit3(add3(mul3(a, Math.cos(deg * RAD)), mul3(orth(toward, a), Math.sin(deg * RAD))));
// eixos do corpo por pose (os mesmos de pessoa())
export function eixos(pose, facing, tilt = 25, curva = 0) {
  const f = unit3(facing);
  if (pose === "deitada") return { A: mul3(f, -1), Fw: Z };
  if (pose === "recostada") { const t = tilt * RAD; return { A: add3(mul3(Z, Math.cos(t)), mul3(f, -Math.sin(t))), Fw: add3(mul3(f, Math.cos(t)), mul3(Z, Math.sin(t))) }; }
  const tc = curva * RAD; return { A: add3(mul3(Z, Math.cos(tc)), mul3(f, Math.sin(tc))), Fw: add3(mul3(f, Math.cos(tc)), mul3(Z, -Math.sin(tc))) };
}
export function punho({ o, pose, facing, curva = 0, K = 1, sd, abd, bend, bracoDir }) {
  const { A, Fw } = eixos(pose, facing, 25, curva), Lt = cross3(Fw, A);
  const sh = add3(o, add3(mul3(Lt, sd * 17.6 * K), mul3(A, 47.6 * K)));
  const up = unit3(add3(mul3(A, -Math.cos(abd * RAD)), mul3(Lt, sd * Math.sin(abd * RAD))));
  const el = add3(sh, mul3(up, 29 * K));
  const fore = rot(up, bracoDir ?? Fw, bend);
  return add3(el, mul3(fore, 25 * K));
}
export function alcancar({ alvo, ...cfg }) {
  let best = null;
  for (let abd = 0; abd <= 175; abd += 5) for (let bend = 0; bend <= 150; bend += 5) {
    const w = punho({ ...cfg, abd, bend }), d = Math.hypot(...sub3(w, alvo));
    if (!best || d < best.d) best = { abd, bend, d, w };
  }
  return best;
}
