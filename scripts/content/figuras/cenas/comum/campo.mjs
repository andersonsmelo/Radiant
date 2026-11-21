// Peças de campo e espalhamento das cenas do lote 2C (campo de luz do colimador, linha de espalhamento), no estilo do kit (mundo em cm, z para cima).
import { k, helpers } from "../../kit/base.mjs";
export const AMARELO = "#FFC21A", NUCLEO = "#FFE08A";
const pt = (P, p) => k.iso(p, P);
// campo de luz retangular: cone do colimador (saída ex) até o retângulo r = [x0,x1,y0,y1] na altura z1, com o retângulo aceso
export function campoDeLuz(P, { f0, ex = 5, z1, r, cone = true, opac = 0.35 }) {
  const [x0, x1, y0, y1] = r;
  const exit = [[-ex, -ex], [ex, -ex], [ex, ex], [-ex, ex]].map(([a, b]) => [f0[0] + a, f0[1] + b, f0[2]]);
  const campo = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]].map(([x, y]) => [x, y, z1]);
  const o = [];
  if (cone) {
    // casco do cone: os 4 lados, na ordem do mais ao fundo para o mais perto não importa (translúcido)
    const hull = (idx) => k.pathOf(idx.map((i) => pt(P, i < 4 ? exit[i] : campo[i - 4])), true);
    for (const f of [[0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]]) o.push(`<path d="${hull(f)}" fill="${AMARELO}" fill-opacity=".1" stroke="none"/>`);
    for (let i = 0; i < 4; i++) o.push(`<path d="${k.pathOf([pt(P, exit[i]), pt(P, campo[i])])}" fill="none" stroke="${AMARELO}" stroke-opacity=".85" stroke-width="1.6" stroke-linecap="round"/>`);
  }
  o.push(`<path d="${k.pathOf(campo.map((p) => pt(P, p)), true)}" fill="${AMARELO}" fill-opacity="${opac}" stroke="${NUCLEO}" stroke-opacity=".95" stroke-width="2" stroke-linejoin="round"/>`);
  return o.join("");
}
// linha tracejada de espalhamento: pontos 3D amostrados de uma curva quadrática
export function espalhamento(P, { de, para, alto = 28, n = 14 }) {
  const mid = [(de[0] + para[0]) / 2, (de[1] + para[1]) / 2, Math.max(de[2], para[2]) + alto];
  const pts = Array.from({ length: n + 1 }, (_, i) => { const t = i / n, a = (1 - t) ** 2, b = 2 * t * (1 - t), c = t * t; return pt(P, [a * de[0] + b * mid[0] + c * para[0], a * de[1] + b * mid[1] + c * para[1], a * de[2] + b * mid[2] + c * para[2]]); });
  return `<path d="${k.pathOf(pts)}" fill="none" stroke="${AMARELO}" stroke-opacity=".8" stroke-width="2.2" stroke-dasharray="6 6" stroke-linecap="round"/>`;
}
