// anodo-giratorio: o mesmo ânodo e cátodo de tubo-raios-x, vistos de frente (face com a pista), PARADOS. Mostra a pista em anel,
// o ponto de impacto fixo, o trecho aquecido logo depois do impacto e a seta do sentido do giro.
// Regenera fontes/anodo-giratorio.svg: node scripts/content/figuras/cenas/anodo-giratorio.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { k, G, helpers } from "./comum/tubo-base.mjs";
import { montar, W, H } from "./comum/lib.mjs";
import { GEO, pecas, feixe, eletrons, brilhoFocal } from "./comum/tubo-pecas.mjs";

const AX0 = G.frameAlong([0, 0, 0], [1, 0, 0]);
const sFace = (r) => GEO.FACE0 + (r - 1.5) * GEO.T;
const D = (a) => (a * Math.PI) / 180;
// Ângulo 0 = +y, 90 = +z, -90 = embaixo (ponto focal). O disco gira no sentido do ângulo crescente.
const FOCAL_ANG = -90;
// Peças próprias desta cena: marcas no disco, pista aquecida depois do impacto e seta do giro.
function giro(P) {
  const { p2 } = helpers(P);
  const sob = (r, ang) => p2(G.pointOf(AX0, sFace(r), r, D(ang)));
  const R = (GEO.RTRK[0] + GEO.RTRK[1]) / 2, w = GEO.RTRK[1] - GEO.RTRK[0];
  // Pista aquecida: da posição do impacto para a frente, no sentido do giro, cada vez mais fraca.
  const passos = [[0, 22, 0.9], [22, 44, 0.65], [44, 66, 0.42], [66, 88, 0.2]];
  const trail = passos.map(([a0, a1, o]) => {
    const pts = [];
    for (let i = 0; i <= 10; i++) pts.push(sob(R, FOCAL_ANG + a0 + ((a1 - a0) * i) / 10));
    return `<path class="hot" stroke-opacity="${o}" stroke-width="${(w * P.scale * Math.sqrt(1.6) * 0.62).toFixed(1)}" d="${k.pathOf(pts)}"/>`;
  }).join("");
  // Marcas radiais no disco (mostram que ele gira).
  let ticks = "";
  for (let i = 0; i < 8; i++) { const a = i * 45 + 20; ticks += k.pathOf([sob(2.3, a), sob(3.6, a)]); }
  ticks = `<path class="seta" d="${ticks}"/>`;
  // Seta do sentido do giro, fora da borda do disco, no alto da direita (ângulos 5 a 80).
  const rr = GEO.RD + 2.3, ptsA = [];
  for (let i = 0; i <= 16; i++) ptsA.push(p2(G.pointOf(AX0, sFace(GEO.RD) + 1.2, rr, D(5 + (75 * i) / 16))));
  const [e, f] = [ptsA[16], ptsA[14]];
  const dx = e[0] - f[0], dy = e[1] - f[1], n = Math.hypot(dx, dy), ux = dx / n, uy = dy / n, hs = 9;
  const tip = [[e[0] + ux * hs, e[1] + uy * hs], [e[0] - uy * hs * 0.65, e[1] + ux * hs * 0.65], [e[0] + uy * hs * 0.65, e[1] - ux * hs * 0.65]];
  const seta = `<path class="seta" d="${k.pathOf(ptsA)}"/><path class="seta-tip" d="${k.pathOf(tip, true)}"/>`;
  return { trail, ticks, seta };
}

export const FONTE = fileURLToPath(new URL("../fontes/anodo-giratorio.svg", import.meta.url));
export function gerar() {
  const ext = [[-20, 0, 0], [-14.2, -3.3, -9], [-14.2, 3.3, -9], [3, 9.5, 9.5], [3, -9.5, 9.5], [3, 9.5, -9.5], [3, -9.5, -9.5], [15, 0, 1.2], [-3, -5, -16], [9, 5, -16], [-3, 5, -16], [9, -5, -16]];
  const P = k.fitProjection(ext, W, H, { pad: 8, azimuth: 148 });
  const pc = pecas(P, { hasteAte: 15, bracoDe: -20, filEixo: "y" }), g = giro(P);
  const label = "Disco do ânodo visto de frente, com a pista focal em anel perto da borda. Os elétrons do cátodo batem sempre no mesmo ponto da pista, e dali sai o feixe de raios X, para baixo. O trecho da pista logo depois do impacto está aquecido, e a seta mostra o sentido em que o disco gira.";
  const partes = [
    { nome: "anodo (disco, pista, haste)", svg: pc.anodo },
    { nome: "marcas e seta do giro", svg: g.ticks + g.seta },
    { nome: "pista aquecida", svg: g.trail },
    { nome: "feixe", svg: feixe(P, { FZ: -16, hw: 5 }) },
    { nome: "catodo", svg: pc.catodo + pc.filamento(false) },
    { nome: "eletrons", svg: eletrons(P, 1) + brilhoFocal(P) },
  ];
  return montar({ partes, label });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) writeFileSync(FONTE, gerar());
