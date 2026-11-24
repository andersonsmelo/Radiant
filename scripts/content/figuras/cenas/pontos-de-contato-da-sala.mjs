// pontos-de-contato-da-sala: porta com maçaneta, receptor vertical com barra de apoio, mesa de exame, tubo de teto com manopla
// e mesa do comando com teclado (as superfícies que a limpeza precisa alcançar).
// Regenera fontes/pontos-de-contato-da-sala.svg: node scripts/content/figuras/cenas/pontos-de-contato-da-sala.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { k } from "../kit/base.mjs";
import { buckyMural } from "../kit/bucky-mural.mjs";
import { mesa } from "../kit/mesa.mjs";
import { projecao, sala, porta, YW } from "./comum/sala.mjs";
import { emitir } from "./comum/emitir.mjs";
import { barraDeApoio, tuboDeTeto, comando } from "./pontos-de-contato-da-sala.pecas.mjs";

export const FONTE = fileURLToPath(new URL("../fontes/pontos-de-contato-da-sala.svg", import.meta.url));
export function gerar() {
  const POS = { porta: -238, recx: -70, recy: -132, mesax: 22, tubox: 92, cmdx: 250 };
  const box = (x0, x1, y0, y1, z0, z1) => k.boxCorners({ x: x0, y: y0, w: x1 - x0, d: y1 - y0 }, z0, z1);
  const A = {
    macaneta: box(POS.porta + 78 - 66, POS.porta + 78 - 8, YW, YW + 16, 84, 120),
    apoio: box(POS.recx - 50, POS.recx + 50, POS.recy + 13 + 8, POS.recy + 13 + 38, 107, 117),
    mesa: box(POS.mesax, POS.mesax + 150, -35, 35, 74, 82),
    manopla: box(POS.tubox - 23, POS.tubox + 23, 8, 52, 191, 205),
    teclado: box(POS.cmdx - 44, POS.cmdx + 44, -72, -34, 79, 84),
  };
  const M = 20;
  const ext = Object.values(A).flatMap((b) => { const xs = b.map((p) => p[0]), ys = b.map((p) => p[1]), zs = b.map((p) => p[2]); return box(Math.min(...xs) - M, Math.max(...xs) + M, Math.min(...ys) - M, Math.max(...ys) + M, Math.min(...zs) - M, Math.max(...zs) + M); });
  const P = projecao(ext);
  const pecas = [
    { id: "sala", svg: sala(P, { x0: -420, x1: 420, yF: 160, h: 400 }) },
    { id: "porta", svg: porta(P, { x: POS.porta, w: 78, alavanca: true, parte: "base" }) },
    { id: "maçaneta", svg: porta(P, { x: POS.porta, w: 78, alavanca: true, parte: "alavanca" }) },
    { id: "receptor", svg: buckyMural(P, { x: POS.recx, y: POS.recy, zPlaca: 90 }) },
    { id: "barra", svg: barraDeApoio(P, { x: POS.recx, y: POS.recy + 13 }) },
    { id: "comando", svg: comando(P, { x: POS.cmdx }) },
    { id: "teclado", svg: comando(P, { x: POS.cmdx, parte: "teclado" }) },
    { id: "mesa", svg: mesa(P, { x: POS.mesax, y: -35, w: 150, d: 70, z: 78 }) },
    { id: "tubo", svg: tuboDeTeto(P, { x: POS.tubox }) },
    { id: "manopla", svg: tuboDeTeto(P, { x: POS.tubox, parte: "manopla" }) },
  ];
  const label = "Sala de exame de frente e de lado: porta com maçaneta, receptor vertical com barra de apoio, mesa de exame, tubo de raios X no teto com manopla lateral e a mesa do comando com monitor e teclado.";
  return emitir({ label, pecas });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) writeFileSync(FONTE, gerar());
