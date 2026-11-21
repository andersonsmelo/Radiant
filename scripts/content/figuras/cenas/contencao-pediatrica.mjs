// contencao-pediatrica: criança deitada na mesa sob o tubo de teto; acompanhante de avental sentado à cabeceira segurando os braços dela
// Regenera fontes/contencao-pediatrica.svg: node scripts/content/figuras/cenas/contencao-pediatrica.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { emitir } from "./comum/emitir.mjs";
import { pecas } from "./contencao-pediatrica.pecas.mjs";

export const FONTE = fileURLToPath(new URL("../fontes/contencao-pediatrica.svg", import.meta.url));
export function gerar() {
  const label = "Criança pequena deitada na mesa sob o tubo de raios X, com uma faixa sobre as pernas e um apoio de espuma no fim da mesa; um acompanhante de avental, sentado à cabeceira, segura os braços dela, e outra pessoa, sem avental, está junto aos pés da mesa.";
  return emitir({ label, pecas: pecas() });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) writeFileSync(FONTE, gerar());
