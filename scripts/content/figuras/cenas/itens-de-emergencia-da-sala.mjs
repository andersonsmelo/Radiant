// itens-de-emergencia-da-sala: porta de saída, carrinho de emergência, saída de oxigênio, botão de chamada e telefone na parede
// de uma sala de exame, com a mesa de exame no chão.
// Regenera fontes/itens-de-emergencia-da-sala.svg: node scripts/content/figuras/cenas/itens-de-emergencia-da-sala.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { k } from "../kit/base.mjs";
import { mesa } from "../kit/mesa.mjs";
import { projecao, sala, porta, YW } from "./comum/sala.mjs";
import { emitir } from "./comum/emitir.mjs";
import { carrinho, oxigenio, botao, telefone, FO, FB, FT } from "./itens-de-emergencia-da-sala.pecas.mjs";

export const FONTE = fileURLToPath(new URL("../fontes/itens-de-emergencia-da-sala.svg", import.meta.url));
export function gerar() {
  const G = 10, cartCx = -250 + 76 + G + 36 + 26;
  const oxCx = cartCx + 42 + G + 19 * FO, btCx = oxCx + 19 * FO + G + 15 * FB, phCx = btCx + 15 * FB + G + 21 * FT;
  const POS = { porta: -250, carrinho: cartCx, oxigenio: oxCx, botao: btCx, telefone: phCx, mesax: phCx - 150 };
  const box = (x0, x1, y0, y1, z0, z1) => k.boxCorners({ x: x0, y: y0, w: x1 - x0, d: y1 - y0 }, z0, z1);
  const A = {
    porta: box(POS.porta - 4, POS.porta + 76, YW, YW + 5, 0, 241),
    carrinho: box(POS.carrinho - 36, POS.carrinho + 42, YW + 11, YW + 61, 0, 118),
    oxigenio: box(POS.oxigenio - 19 * FO, POS.oxigenio + 19 * FO, YW, YW + 4, 112, 112 + 40 * FO),
    botao: box(POS.botao - 15 * FB, POS.botao + 15 * FB, YW, YW + 4, 150 - 61, 150 + 34 * FB),
    telefone: box(POS.telefone - 21 * FT, POS.telefone + 21 * FT, YW, YW + 10, 100, 100 + 57 * FT),
  };
  const M = 12;
  const ext = [...Object.values(A).flatMap((b) => { const xs = b.map((p) => p[0]), ys = b.map((p) => p[1]), zs = b.map((p) => p[2]); return box(Math.min(...xs) - M, Math.max(...xs) + M, Math.min(...ys) - M, Math.max(...ys) + M, Math.min(...zs), Math.max(...zs) + M); })];
  const P = projecao(ext);
  const pecas = [
    { id: "sala", svg: sala(P, { x0: -420, x1: 420, yF: 160, h: 400 }) },
    { id: "porta", svg: porta(P, { x: POS.porta, w: 72, barra: true, placa: true }) },
    { id: "mesa", svg: mesa(P, { x: POS.mesax - 20, y: -75, w: 170, d: 70, z: 78 }) },
    { id: "carrinho", svg: carrinho(P, { cx: POS.carrinho }) },
    { id: "oxigenio", svg: oxigenio(P, { x: POS.oxigenio }) },
    { id: "botao", svg: botao(P, { x: POS.botao }) },
    { id: "telefone", svg: telefone(P, { x: POS.telefone }) },
  ];
  const label = "Parede de uma sala de exame, vista de frente e de lado: porta de saída com placa e barra, carrinho de emergência com desfibrilador, saída de oxigênio, botão de chamada com cordão, telefone e uma mesa de exame no chão.";
  return emitir({ label, pecas });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) writeFileSync(FONTE, gerar());
