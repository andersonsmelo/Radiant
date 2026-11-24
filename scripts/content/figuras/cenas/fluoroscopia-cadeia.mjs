// fluoroscopia-cadeia: 
// Regenera fontes/fluoroscopia-cadeia.svg: node scripts/content/figuras/cenas/fluoroscopia-cadeia.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { emitir } from "./comum/emitir.mjs";
import { pecas } from "./fluoroscopia-cadeia.pecas.mjs";

export const FONTE = fileURLToPath(new URL("../fontes/fluoroscopia-cadeia.svg", import.meta.url));
export function gerar() {
  const label = "Cadeia da fluoroscopia em perspectiva: paciente deitado na mesa, tubo de raios X sob a mesa, cone de feixe subindo até o receptor de imagem acima do paciente, monitor num suporte, operador de avental ao lado da mesa e o pedal no chão, aos pés dele.";
  return emitir({ label, pecas: pecas() });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) writeFileSync(FONTE, gerar());
