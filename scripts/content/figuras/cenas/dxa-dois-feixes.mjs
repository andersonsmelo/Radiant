// dxa-dois-feixes (m30): densitômetro em vista isométrica, paciente deitada de costas, fonte sob o tampo, detector no braço acima e feixe estreito de duas energias.
// Regenera fontes/dxa-dois-feixes.svg: node scripts/content/figuras/cenas/dxa-dois-feixes.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { emitir } from "./comum/emitir.mjs";
import { pecas } from "./dxa-dois-feixes.pecas.mjs";

export const FONTE = fileURLToPath(new URL("../fontes/dxa-dois-feixes.svg", import.meta.url));
export function gerar() {
  const label = "Densitômetro em vista isométrica: paciente deitada de costas na mesa, a fonte de raios X, um bloco azul, sob o tampo, o detector, outro bloco azul, no alto do braço acima do corpo, e dois feixes finos, um amarelo e um ciano, subindo retos da fonte, pelo corpo, até o detector.";
  return emitir({ label, pecas: pecas() });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) writeFileSync(FONTE, gerar());
