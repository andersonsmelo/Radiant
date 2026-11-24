// Montagem comum das cenas do tubo de raios X (tubo-raios-x, tubo-emitindo, anodo-giratorio): junta as peças, achata o CSS
// do kit em atributos e devolve o texto do SVG. Só isso: prévias e medidas ficam fora (alvos-preview.mjs e a evidência do lote).
import { achatar, svgBruto2 } from "./tubo-base.mjs";
export const W = 640, H = 480;
const PROIBIDO = ["<text", "<image", "<style", "filter", "<mask", "<clipPath", "<use", "<pattern", "class=", "var(", "style=", "href"];

// partes: [{ nome, svg }] na ordem de pintura.
export function montar({ partes, label }) {
  const svg = achatar(svgBruto2(partes.map((p) => p.svg).join(""), W, H, label));
  const achados = PROIBIDO.filter((t) => svg.includes(t));
  if (achados.length) throw new Error(`SVG com marca proibida: ${achados.join(", ")}`);
  return svg;
}
