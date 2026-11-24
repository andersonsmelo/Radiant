// colimacao-pediatrica: a mesma criança duas vezes, deitada de costas em duas mesas, uma atrás da outra (a da frente à esquerda, a de trás à direita).
// Regenera fontes/colimacao-pediatrica.svg: node scripts/content/figuras/cenas/colimacao-pediatrica.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { emitir } from "./comum/emitir.mjs";
import { pecas } from "./colimacao-pediatrica.pecas.mjs";

export const FONTE = fileURLToPath(new URL("../fontes/colimacao-pediatrica.svg", import.meta.url));
export function gerar() {
  const label = "Duas vezes a mesma criança deitada de costas, uma mesa atrás da outra: na da frente, à esquerda, um retângulo de luz do colimador cobre o corpo todo, da cabeça aos pés; na de trás, à direita, o retângulo cobre só o tórax.";
  return emitir({ label, pecas: pecas() });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) writeFileSync(FONTE, gerar());
