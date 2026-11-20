// Pecas novas da cena itens-de-emergencia-da-sala, no estilo do kit (slabs e tubos com as classes c-*).
import { k, helpers } from "../kit/base.mjs";
import { YW, wp, wcirc, ln, hx } from "./comum/sala.mjs";
const cor = (f, s, w = 0.5) => `fill="${f}" stroke="${s}" stroke-width="${w}" stroke-linejoin="round"`;
// carrinho de emergencia: corpo com quatro gavetas, tampo, desfibrilador azul em cima, puxador lateral e rodas
export function carrinho(P, { cx, cy = YW + 36 }) {
  const { slab, shadow, wheel, tube, S } = helpers(P);
  const o = [shadow({ x: cx - 40, y: cy - 28, w: 80, d: 56, r: 6 })];
  for (const [x, y] of [[cx - 24, cy - 18], [cx + 24, cy - 18], [cx - 24, cy + 18], [cx + 24, cy + 18]]) o.push(wheel(x, y, 5));
  o.push(slab({ x: cx - 32, y: cy - 22, w: 64, d: 44, r: 2 }, 10, 74, { tone: "hi", className: "c-lead" }, 3, 0.6));
  const yf = cy + 22.4;
  for (const z of [34, 52, 68]) o.push(wp(P, yf, [[cx - 32, z], [cx + 32, z]], ln(hx.lo, 0.6), false));
  for (const z of [22, 43, 60, 76]) o.push(wp(P, yf, [[cx - 7, z], [cx + 7, z]], ln(hx.claro, 0.8), false));
  o.push(slab({ x: cx - 36, y: cy - 25, w: 72, d: 50, r: 3 }, 84, 4, { tone: "hi", className: "c-dark" }, 3, 0.5));
  // desfibrilador: caixa azul, tela e alca
  o.push(slab({ x: cx - 22, y: cy - 16, w: 44, d: 32, r: 4 }, 88, 22, { tone: "hi", className: "c-blue" }, 4, 0.6));
  o.push(wp(P, cy + 16.4, [[cx - 17, 96], [cx + 5, 96], [cx + 5, 106], [cx - 17, 106]], cor(hx.azulBorda, hx.claro, 0.5)));
  o.push(wcirc(P, cy + 16.4, cx + 14, 101, 3.5, cor(hx.amarelo, hx.nucleo, 0.5), 12));
  o.push(tube([[cx - 12, cy, 110], [cx - 12, cy, 118], [cx + 12, cy, 118], [cx + 12, cy, 110]], 1.5, { tone: "hi", fillet: 4 }));
  // puxador lateral
  o.push(tube([[cx + 32, cy - 14, 70], [cx + 41, cy - 14, 70], [cx + 41, cy + 14, 70], [cx + 32, cy + 14, 70]], 1.5, { tone: "hi", fillet: 4 }));
  return o.join("");
}
export const FO = 2.2, FB = 2.5, FT = 2.0; // crescimento do desenho sobre o tamanho real // pecas de parede maiores que o real, para ler no quadro e no toque
// saida de oxigenio: placa na parede, encaixe redondo verde (cor do oxigenio na rede de gases medicinais) e a entrada no centro
export function oxigenio(P, { x, z = 112 }) {
  const { slab } = helpers(P);
  const y = YW + 4.4;
  return slab({ x: x - 19 * FO, y: YW, w: 38 * FO, d: 4, r: 5 }, z, 40 * FO, { tone: "mid", className: "c-dark" }, 3, 0.5)
    + wcirc(P, y, x, z + 20 * FO, 12.5 * FO, ln(hx.verde, 1.5), 24) + wcirc(P, y, x, z + 20 * FO, 4.2 * FO, cor(hx.verde, hx.verdeBorda, 0.4), 12);
}
// botao de chamada: placa, disco amarelo e cordao com argola
export function botao(P, { x, z = 150 }) {
  const { slab } = helpers(P);
  const y = YW + 4.4;
  return slab({ x: x - 15 * FB, y: YW, w: 30 * FB, d: 4, r: 5 }, z, 34 * FB, { tone: "mid", className: "c-dark" }, 3, 0.5)
    + wcirc(P, y, x, z + 17 * FB, 10 * FB, cor(hx.amarelo, hx.nucleo, 0.6), 20)
    + wp(P, y, [[x, z], [x + 3, z - 14], [x - 3, z - 28], [x, z - 42]], ln(hx.mid, 0.9), false)
    + wcirc(P, y, x, z - 52, 9, ln(hx.azul, 1.5), 16);
}
// telefone de parede: corpo, fone no alto e teclas
export function telefone(P, { x, z = 100 }) {
  const { slab } = helpers(P);
  const y = YW + 8.4;
  let o = slab({ x: x - 16 * FT, y: YW, w: 32 * FT, d: 8, r: 4 }, z, 46 * FT, { tone: "hi", className: "c-lead" }, 3, 0.5)
    + slab({ x: x - 21 * FT, y: YW + 0.5, w: 42 * FT, d: 10, r: 5 }, z + 46 * FT, 11 * FT, { tone: "hi", className: "c-dark" }, 3, 0.4);
  for (const dz of [10, 20, 30]) for (const dx of [-8, 0, 8]) o += wcirc(P, y, x + dx * FT, z + dz * FT, 2.1 * FT, cor(hx.mid, hx.mid, 0.2), 8);
  return o;
}
