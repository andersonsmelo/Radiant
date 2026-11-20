// Emite o SVG de uma cena de sala (conferencia-de-identidade, pontos-de-contato-da-sala, itens-de-emergencia-da-sala) a partir
// das peças em ordem de pintura. Prévias, alvos e medidas por cor não moram aqui: os alvos estão em
// content-manifest/rtg-2026/figuras/<id>.alvos.json e a medida, em docs/evidence/2026-11-19-figuras/lote-2A/medidas.md.
import { achatar, svgBruto } from "../../kit/base.mjs";
import { HEX_REGISTRADOS } from "../../kit/paleta.mjs";
import { W, H } from "./sala.mjs";

export function emitir({ label, pecas }) {
  const svg = achatar(svgBruto(pecas.map((p) => p.svg).join(""), W, H, label));
  const proibidos = ["<text", "<image", "<style", "filter", "<mask", "<clipPath", "<use", "<pattern", "class=", "var(", "href", "'"].filter((t) => svg.includes(t));
  const foraDaPaleta = [...new Set(svg.match(/#[0-9a-fA-F]{6}\b/g) ?? [])].filter((h) => !HEX_REGISTRADOS.has(h.toUpperCase()));
  const corNaoHex = (svg.match(/\b(?:fill|stroke)="[^"]*"/g) ?? []).filter((a) => !/="(#[0-9A-Fa-f]{6}|none|url\(#gx\))"/.test(a));
  if (proibidos.length || foraDaPaleta.length || corNaoHex.length) throw new Error(`SVG fora das réguas: ${JSON.stringify({ proibidos, foraDaPaleta, corNaoHex: [...new Set(corNaoHex)] })}`);
  return svg;
}
