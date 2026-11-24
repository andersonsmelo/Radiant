// tubo-emitindo: a mesma ampola de tubo-raios-x (geometria compartilhada), em funcionamento e PARADA: filamento aceso,
// cinco filas de elétrons, ponto focal brilhando e o feixe pela janela.
// Regenera fontes/tubo-emitindo.svg: node scripts/content/figuras/cenas/tubo-emitindo.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { montar, W, H } from "./comum/lib.mjs";
import { camera, pecas, feixe, eletrons, brilhoFocal } from "./comum/tubo-pecas.mjs";

export const FONTE = fileURLToPath(new URL("../fontes/tubo-emitindo.svg", import.meta.url));
export function gerar() {
  const P = camera(W, H), pc = pecas(P);
  const label = "Tubo de raios X em funcionamento: o filamento aquecido do cátodo libera uma corrente de elétrons que corre até o alvo do disco do ânodo; do ponto de impacto sai o feixe, para baixo, pela janela.";
  const partes = [
    { nome: "anodo", svg: pc.anodo },
    { nome: "catodo", svg: pc.catodo + pc.filamento(true) },
    { nome: "eletrons", svg: eletrons(P, 5) },
    { nome: "ponto focal", svg: brilhoFocal(P) },
    { nome: "terminais", svg: pc.terminais },
    { nome: "ampola (vidro)", svg: pc.vidro },
    { nome: "janela", svg: pc.janela },
    { nome: "feixe", svg: feixe(P) },
  ];
  return montar({ partes, label });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) writeFileSync(FONTE, gerar());
