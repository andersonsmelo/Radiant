// dosimetro-no-corpo (m21): profissional de avental com os dosímetros no corpo e o de referência na parede.
// Regenera fontes/dosimetro-no-corpo.svg: node scripts/content/figuras/cenas/dosimetro-no-corpo.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { emitir } from "./comum/emitir.mjs";
import { pecas } from "./dosimetro-no-corpo.pecas.mjs";

export const FONTE = fileURLToPath(new URL("../fontes/dosimetro-no-corpo.svg", import.meta.url));
export function gerar() {
  const label = "Profissional de avental, de frente: crachá de dosimetria no peito, sobre o avental, anel dosimétrico em volta da mão do braço estendido, dosímetro preso à haste dos óculos, junto ao olho; à direita, um quadro de parede com o dosímetro de referência pendurado.";
  return emitir({ label, pecas: pecas() });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) writeFileSync(FONTE, gerar());
