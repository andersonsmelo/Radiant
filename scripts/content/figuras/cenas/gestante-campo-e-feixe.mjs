// gestante-campo-e-feixe: gestante de perfil em pé diante do receptor vertical, o tubo longe à esquerda emitindo na horizontal.
// Regenera fontes/gestante-campo-e-feixe.svg: node scripts/content/figuras/cenas/gestante-campo-e-feixe.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { emitir } from "./comum/emitir.mjs";
import { pecas } from "./gestante-campo-e-feixe.pecas.mjs";

export const FONTE = fileURLToPath(new URL("../fontes/gestante-campo-e-feixe.svg", import.meta.url));
export function gerar() {
  const label = "Gestante de perfil, em pé diante do receptor vertical; o tubo de raios X, longe, à esquerda, emite na horizontal: um campo cheio, ajustado, cobre só o tórax e um campo tracejado, aberto demais, alcançaria o abdome.";
  return emitir({ label, pecas: pecas() });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) writeFileSync(FONTE, gerar());
