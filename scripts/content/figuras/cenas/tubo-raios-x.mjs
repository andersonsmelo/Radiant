// tubo-raios-x: ampola com o interior visível (cátodo à esquerda, ânodo à direita, janela embaixo, feixe para baixo).
// Regenera fontes/tubo-raios-x.svg: node scripts/content/figuras/cenas/tubo-raios-x.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { montar, W, H } from "./comum/lib.mjs";
import { camera, pecas, feixe, eletrons } from "./comum/tubo-pecas.mjs";

export const FONTE = fileURLToPath(new URL("../fontes/tubo-raios-x.svg", import.meta.url));
export function gerar() {
  const P = camera(W, H), pc = pecas(P);
  const label = "Tubo de raios X com o vidro transparente: o cátodo, com o filamento, fica à esquerda e emite elétrons para o disco inclinado do ânodo, à direita; do ponto de impacto sai o feixe, para baixo, pela janela da ampola.";
  const partes = [
    { nome: "anodo", svg: pc.anodo },
    { nome: "catodo", svg: pc.catodo + pc.filamento(false) },
    { nome: "eletrons", svg: eletrons(P, 1) },
    { nome: "terminais", svg: pc.terminais },
    { nome: "ampola (vidro)", svg: pc.vidro },
    { nome: "janela", svg: pc.janela },
    { nome: "feixe", svg: feixe(P) },
  ];
  return montar({ partes, label });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) writeFileSync(FONTE, gerar());
