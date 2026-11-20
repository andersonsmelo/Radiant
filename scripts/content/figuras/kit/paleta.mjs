// Tons escuros para o fundo #171920. Toda cor do kit nasce aqui; o teste confere que o SVG so usa estes hex.
const KIT = "./vendor/anatomy/";
export const k = await import(KIT + "iso-kit.mjs");

const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const toHex = (v) => "#" + v.map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, "0")).join("");
const mix = (a, b, t) => toHex(hex(a).map((x, i) => x + (hex(b)[i] - x) * t));
// rampa de 5 tons a partir de uma base
const rampa = (base, extra = {}) => {
  const dk = (t) => mix(base, "#0A0C12", t);
  return { top: mix(base, "#FFFFFF", 0.14), s3: dk(0.08), s2: dk(0.18), s1: dk(0.3), s0: dk(0.42), paper: dk(0.3), ...extra };
};
// tons de equipamento, escritos a mao no piloto (aparelho, leito, colchao, detector, escuro, manta)
// sombreado plano de 3 tons (luz de um lado, sombra do outro) para pessoas: sem as 5 faixas que viram mancha
const rampa3 = (base, extra = {}) => { const l = mix(base, "#FFFFFF", 0.1), m = mix(base, "#0A0C12", 0.2), d = mix(base, "#0A0C12", 0.4); return { top: l, s3: l, s2: m, s1: m, s0: d, paper: m, ...extra }; };
const manual = (top, s3, s2, s1, s0, extra = {}) => ({ top, s3, s2, s1, s0, paper: s1, ...extra });
export const TONS = {
  skin: rampa3("#C9A58D"), skinKid: rampa3("#D2AE96"), hair: rampa3("#6A5A4E"), hairKid: rampa3("#86624A"),
  shirt: rampa3("#C4CAD6"), pants: rampa3("#3F485E"), shoe: rampa3("#2E3442"),
  gown: rampa3("#8FA6C4"), apron: rampa3("#2F63B0"), apron2: rampa3("#4A86D6"), scrub: rampa3("#5C7FA3"),
  kid1: rampa3("#D9A441"), kid2: rampa3("#6E9C7B"),
  mach: manual("#56637A", "#4A566B", "#3F4A5D", "#364051", "#2E3746"),
  blanket: manual("#4D6A8F", "#445F81", "#3B5473", "#334966", "#2B3F59"),
  blue: manual("#2C5A92", "#264E80", "#21446F", "#1C3A60", "#183252", { hi: "#4A9EFF" }),
  dark: manual("#2E3544", "#282E3B", "#232833", "#1E232D", "#1A1E27"),
  bed: manual("#3A4252", "#333A49", "#2C3240", "#262B37", "#20242F", { paper: "#262B37" }),
  mat: manual("#5B6577", "#505A6B", "#454E5E", "#3B4352", "#323947"),
  lead: manual("#6C7585", "#616A7A", "#565F6E", "#4B5361", "#414856", { hi: "#9AA3B5" }),
  wall: manual("#2A303D", "#262C38", "#222834", "#1E232E", "#1A1F29"),
};
const BASE = { paper: "#1C212B", face: "#263040", top: "#3A4558", s0: "#1F2531", s1: "#252C3A", s2: "#2C3445", s3: "#343E51", hi: "#E6E8EE", mid: "#9AA3B5", lo: "#5D6679", faint: "#3B4456", lit: "#FFFFFF", dot: "#E6E8EE", blue: "#4A9EFF" };
export const EFEITOS = { sombra: "#07090D", feixe: "#FFC21A", nucleo: "#FFE08A", tela: "#5EEAF7", brilho: "#4A9EFF", brilhoBorda: "#9CCBFF", led: "#FFC21A" };

const css1 = (t) => `--anatomy-top:${t.top};--anatomy-shade-3:${t.s3};--anatomy-shade-2:${t.s2};--anatomy-shade-1:${t.s1};--anatomy-shade-0:${t.s0};--anatomy-paper:${t.paper};` + (t.hi ? `--anatomy-hi:${t.hi};` : "") + (t.blue ? `--anatomy-blue:${t.blue};` : "");
export const CSS = `.iso{--anatomy-paper:${BASE.paper};--anatomy-face:${BASE.face};--anatomy-top:${BASE.top};--anatomy-shade-0:${BASE.s0};--anatomy-shade-1:${BASE.s1};--anatomy-shade-2:${BASE.s2};--anatomy-shade-3:${BASE.s3};--anatomy-hi:${BASE.hi};--anatomy-mid:${BASE.mid};--anatomy-lo:${BASE.lo};--anatomy-faint:${BASE.faint};--anatomy-lit:${BASE.lit};--anatomy-dot:${BASE.dot};--anatomy-blue:${BASE.blue};--anatomy-weight:.7px}
${Object.entries(TONS).map(([n, t]) => `.c-${n}{${css1(t)}}`).join("\n")}
.shadow{fill:${EFEITOS.sombra};opacity:.42;stroke:none}
.screen{fill:${EFEITOS.tela};fill-opacity:.35;stroke:${EFEITOS.tela};stroke-width:.7px}
.beam-fill{stroke:none}#gx stop{stop-color:${EFEITOS.feixe}}
.beam-edge,.beam-core{fill:none;stroke-width:.8px;stroke-linecap:round}
.beam-edge{stroke:${EFEITOS.feixe};stroke-opacity:.85}.beam-core{stroke:${EFEITOS.nucleo};stroke-opacity:.9}
.scatter{fill:none;stroke:${EFEITOS.feixe};stroke-opacity:.8;stroke-width:1.1px;stroke-dasharray:3 3;stroke-linecap:round}
.glow{fill:${EFEITOS.brilho};fill-opacity:.5;stroke:${EFEITOS.brilhoBorda};stroke-width:.8px}
.led{fill:${EFEITOS.led}}`;
// todo hex que o kit pode produzir (as cores do ISO_CSS da skill entram porque o kit as usa de base)
export const HEX_REGISTRADOS = new Set([
  ...Object.values(TONS).flatMap((t) => Object.values(t)), ...Object.values(BASE), ...Object.values(EFEITOS),
  ...((k.ISO_CSS.match(/#[0-9a-fA-F]{6}\b/g)) ?? []),
].map((h) => h.toUpperCase()));
