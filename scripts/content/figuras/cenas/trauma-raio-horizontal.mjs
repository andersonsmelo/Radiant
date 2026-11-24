// trauma-raio-horizontal (m25): paciente deitado de costas na prancha, colar cervical, feixe horizontal e detector em pé.
// Regenera fontes/trauma-raio-horizontal.svg: node scripts/content/figuras/cenas/trauma-raio-horizontal.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { emitir } from "./comum/emitir.mjs";
import { pecas } from "./trauma-raio-horizontal.pecas.mjs";

export const FONTE = fileURLToPath(new URL("../fontes/trauma-raio-horizontal.svg", import.meta.url));
export function gerar() {
  const label = "Paciente deitado de costas na prancha sobre a maca, com colar no pescoço; o tubo do aparelho móvel fica de um lado e o feixe sai paralelo ao piso, atravessa o pescoço e chega a um detector em pé, junto ao ombro do outro lado.";
  return emitir({ label, pecas: pecas() });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) writeFileSync(FONTE, gerar());
