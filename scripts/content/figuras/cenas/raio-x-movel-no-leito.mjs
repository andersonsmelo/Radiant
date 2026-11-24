// raio-x-movel-no-leito (m25): raio X móvel no leito, com o operador longe, uma pessoa sem avental junto à cabeceira e o leito vizinho no sentido do feixe.
// Regenera fontes/raio-x-movel-no-leito.svg: node scripts/content/figuras/cenas/raio-x-movel-no-leito.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { emitir } from "./comum/emitir.mjs";
import { pecas } from "./raio-x-movel-no-leito.pecas.mjs";

export const FONTE = fileURLToPath(new URL("../fontes/raio-x-movel-no-leito.svg", import.meta.url));
export function gerar() {
  const label = "Raio X móvel no leito: o tubo aponta para o tórax do paciente recostado, com o detector atrás das costas. O operador de avental fica afastado; uma pessoa sem avental está junto à cabeceira e o leito vizinho fica no sentido do feixe.";
  return emitir({ label, pecas: pecas() });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) writeFileSync(FONTE, gerar());
