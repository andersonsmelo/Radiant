// transferencia-maca-mesa (m17): maca paralela à mesa de exame, com um vão lateral entre elas, paciente deitada, suporte de soro e prancha de transferência.
// Regenera fontes/transferencia-maca-mesa.svg: node scripts/content/figuras/cenas/transferencia-maca-mesa.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { emitir } from "./comum/emitir.mjs";
import { pecas } from "./transferencia-maca-mesa.pecas.mjs";

export const FONTE = fileURLToPath(new URL("../fontes/transferencia-maca-mesa.svg", import.meta.url));
export function gerar() {
  const label = "Maca paralela à mesa de exame, do lado do espectador, com um vão lateral entre as duas, paciente deitada na maca, suporte de soro com a linha esticada até o braço e uma prancha de transferência encostada no pedestal da mesa. As rodas da maca têm o bloco do freio, em alturas diferentes.";
  return emitir({ label, pecas: pecas() });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) writeFileSync(FONTE, gerar());
