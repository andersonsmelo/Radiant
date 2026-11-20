// Reexporta o kit da fase 2 e acrescenta o CSS dos efeitos novos do lote 2A (filamento, eletrons, ponto focal).
export * from "../../kit/base.mjs";
import { k, CSS, achatar } from "../../kit/base.mjs";
import { EFEITOS } from "../../kit/paleta.mjs";
export const EFEITOS_CSS = `
.fil{fill:none;stroke:#E6E8EE;stroke-width:1px;stroke-linecap:round;stroke-linejoin:round}
.fil-hot{fill:none;stroke:${EFEITOS.nucleo};stroke-width:1.1px;stroke-linecap:round;stroke-linejoin:round}
.vidro{fill:#4A9EFF;fill-opacity:.1;stroke:none}
.elec{fill:none;stroke:${EFEITOS.tela};stroke-width:2.4px;stroke-linecap:round;stroke-dasharray:.1 4.2}
.fil-glow{fill:none;stroke:${EFEITOS.feixe};stroke-opacity:.35;stroke-width:5px;stroke-linecap:round;stroke-linejoin:round}
.elec-tip{fill:${EFEITOS.tela};stroke:none}
.spot{fill:${EFEITOS.feixe};fill-opacity:.55;stroke:${EFEITOS.nucleo};stroke-width:.8px}
.hot{fill:none;stroke:${EFEITOS.feixe};stroke-linecap:butt;stroke-linejoin:round}
.seta{fill:none;stroke:#9AA3B5;stroke-width:1.4px;stroke-linecap:round;stroke-linejoin:round}
.seta-tip{fill:#9AA3B5;stroke:none}`;
export const svgBruto2 = (inner, W, H, label = "", sc = 2) => `<svg xmlns="http://www.w3.org/2000/svg" class="iso-svg iso" data-theme="dark" data-sc="${sc}" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"${label ? ` role="img" aria-label="${label}"` : ""}><style>${k.ISO_CSS}${CSS}${EFEITOS_CSS}</style>${inner}</svg>`;
export { achatar };
