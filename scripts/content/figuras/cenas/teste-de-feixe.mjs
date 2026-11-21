// teste-de-feixe (m32): tubo no alto, colimador, tres laminas de filtro num suporte, medidor sobre a mesa e mostrador com tres barras. PARADO.
// Regenera fontes/teste-de-feixe.svg: node scripts/content/figuras/cenas/teste-de-feixe.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { emitir } from "./comum/emitir.mjs";
import { pecas } from "./teste-de-feixe.pecas.mjs";

export const FONTE = fileURLToPath(new URL("../fontes/teste-de-feixe.svg", import.meta.url));
export function gerar() {
  const label = "Esquema do teste de feixe: no alto, a caixa do tubo de raios X com um ponto amarelo na janela; logo abaixo, o colimador, de onde o feixe desce abrindo; no meio do caminho, três lâminas finas de filtro num suporte; sobre a mesa, o medidor baixo que o feixe atinge, ligado por um cabo a um mostrador à direita, com três barras de alturas diferentes.";
  return emitir({ label, pecas: pecas() });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) writeFileSync(FONTE, gerar());
