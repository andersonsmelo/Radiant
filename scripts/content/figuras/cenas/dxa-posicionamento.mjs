// dxa-posicionamento (m30): duas mesas de densitômetro lado a lado, vistas dos pés (azimute 20, elevação 40).
// Regenera fontes/dxa-posicionamento.svg: node scripts/content/figuras/cenas/dxa-posicionamento.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { emitir } from "./comum/emitir.mjs";
import { pecas } from "./dxa-posicionamento.pecas.mjs";

export const FONTE = fileURLToPath(new URL("../fontes/dxa-posicionamento.svg", import.meta.url));
export function gerar() {
  const label = "Duas mesas de densitômetro lado a lado, vistas dos pés, com a mesma pessoa deitada de costas em cada uma. Na da esquerda, quadril e joelhos dobrados e as panturrilhas sobre um bloco acolchoado, com a coluna reta na mesa. Na da direita, pernas estendidas e abertas, um posicionador entre os pés e o pé da esquerda do desenho girado para dentro e preso ao posicionador por uma faixa.";
  return emitir({ label, pecas: pecas() });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) writeFileSync(FONTE, gerar());
