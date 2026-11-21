// radiografia-veterinaria (m31): cao deitado de lado na mesa, em calha de espuma, com sacos de areia nas patas; feixe vertical no torax;
// Regenera fontes/radiografia-veterinaria.svg: node scripts/content/figuras/cenas/radiografia-veterinaria.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { emitir } from "./comum/emitir.mjs";
import { pecas } from "./radiografia-veterinaria.pecas.mjs";

export const FONTE = fileURLToPath(new URL("../fontes/radiografia-veterinaria.svg", import.meta.url));
export function gerar() {
  const label = "Cão deitado de lado sobre a mesa de exame, num leito de calha de espuma e com um saco de areia sobre as patas da frente e outro sobre as de trás; o tubo de raios X, no alto, aponta o feixe para baixo, para o tórax do cão. Quem segura a cabeça do cão usa avental e luvas e mantém as mãos longe do feixe. Duas pessoas estão sem avental: o tutor, ao lado da mesa, com linhas tracejadas de radiação espalhada chegando a ele, e outra pessoa longe, junto à porta.";
  return emitir({ label, pecas: pecas() });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) writeFileSync(FONTE, gerar());
