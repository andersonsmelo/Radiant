// radiografia-de-objeto (m31): quadro num cavalete no feixe horizontal, detector atras, area isolada por cordao e sinal de aviso,
// Regenera fontes/radiografia-de-objeto.svg: node scripts/content/figuras/cenas/radiografia-de-objeto.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { emitir } from "./comum/emitir.mjs";
import { pecas } from "./radiografia-de-objeto.pecas.mjs";

export const FONTE = fileURLToPath(new URL("../fontes/radiografia-de-objeto.svg", import.meta.url));
export function gerar() {
  const label = "Quadro numa moldura, sobre um cavalete, no feixe horizontal que sai do tubo de raios X do aparelho móvel, à direita; atrás do quadro, de pé num pedestal, o detector. Dois postes com um cordão entre eles e um triângulo de aviso num pé limitam a área isolada; do lado de fora dela, uma pessoa fica ao lado do painel de comando.";
  return emitir({ label, pecas: pecas() });
}
if (process.argv[1] === fileURLToPath(import.meta.url)) writeFileSync(FONTE, gerar());
