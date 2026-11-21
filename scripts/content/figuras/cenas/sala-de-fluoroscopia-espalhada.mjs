// sala-de-fluoroscopia-espalhada: 
// Regenera fontes/sala-de-fluoroscopia-espalhada.svg: node scripts/content/figuras/cenas/sala-de-fluoroscopia-espalhada.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { emitir } from "./comum/emitir.mjs";
import { pecas } from "./sala-de-fluoroscopia-espalhada.pecas.mjs";

export const FONTE = fileURLToPath(new URL("../fontes/sala-de-fluoroscopia-espalhada.svg", import.meta.url));
export function gerar() {
  const label = "Sala de fluoroscopia: paciente deitado na mesa, tubo sob a mesa e receptor acima; do paciente sai radiação espalhada em leque, com raios grossos sob a mesa, do lado do tubo, até o saiote de chumbo, e raios finos acima, até o operador de avental, protetor de tireoide e óculos; mais longe, o biombo e uma segunda pessoa.";
  return emitir({ label, pecas: pecas() });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) writeFileSync(FONTE, gerar());
