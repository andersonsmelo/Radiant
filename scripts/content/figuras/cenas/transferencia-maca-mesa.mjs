// transferencia-maca-mesa (m17): maca ao lado da mesa de exame, com um vão entre elas, paciente deitada, suporte de soro e prancha de transferência.
// Regenera fontes/transferencia-maca-mesa.svg: node scripts/content/figuras/cenas/transferencia-maca-mesa.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { emitir } from "./comum/emitir.mjs";
import { pecas } from "./transferencia-maca-mesa.pecas.mjs";

export const FONTE = fileURLToPath(new URL("../fontes/transferencia-maca-mesa.svg", import.meta.url));
export function gerar() {
  const label = "Maca ao lado da mesa de exame, com um vão entre elas, paciente deitada, suporte de soro com a linha esticada até o braço e uma prancha de transferência encostada no pedestal da mesa. A roda da maca do lado da cabeceira tem o bloco do freio pousado sobre ela; a do lado dos pés, com o bloco erguido.";
  return emitir({ label, pecas: pecas() });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) writeFileSync(FONTE, gerar());
