// idoso-apoios-e-riscos: pessoa idosa em pé diante do receptor vertical, com a mão na barra de apoio da parede; banco ao lado, degrau e tapete solto
// Regenera fontes/idoso-apoios-e-riscos.svg: node scripts/content/figuras/cenas/idoso-apoios-e-riscos.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { emitir } from "./comum/emitir.mjs";
import { pecas } from "./idoso-apoios-e-riscos.pecas.mjs";

export const FONTE = fileURLToPath(new URL("../fontes/idoso-apoios-e-riscos.svg", import.meta.url));
export function gerar() {
  const label = "Pessoa idosa em pé junto ao receptor vertical na parede, com a mão numa barra de apoio; há um banco ao lado, um degrau e um tapete com a ponta levantada no chão, e o andador, longe dela, do outro lado da sala.";
  return emitir({ label, pecas: pecas() });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) writeFileSync(FONTE, gerar());
