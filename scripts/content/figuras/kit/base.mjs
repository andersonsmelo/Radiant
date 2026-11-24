// Ajudantes comuns do kit (derivados da amostra da fase 2) e o passo de achatar CSS em atributos.
import { k, CSS } from "./paleta.mjs";
const KIT = "./vendor/anatomy/";
export { k, CSS };
export const G = await import(KIT + "lathe.mjs");
export const T = await import(KIT + "tube.mjs");
export const RAD = Math.PI / 180;
export const roundRect = (u0, u1, v0, v1, r, steps = 3) => {
  const pts = [];
  const corner = (cu, cv, a0) => { for (let i = 0; i <= steps; i++) { const a = a0 + (i / steps) * 90 * RAD; pts.push([cu + r * Math.cos(a), cv + r * Math.sin(a)]); } };
  corner(u1 - r, v0 + r, -90 * RAD); corner(u1 - r, v1 - r, 0); corner(u0 + r, v1 - r, 90 * RAD); corner(u0 + r, v0 + r, 180 * RAD);
  return pts;
};
export const frame3 = (o, a, hint) => {
  a = G.unit3(a);
  const v = G.unit3(G.sub3(hint, G.mul3(a, G.dot3(a, hint))));
  return G.frameOf(o, a, G.cross3(v, a), v);
};
export const at = (o, ...terms) => terms.reduce((p, [v, m]) => G.add3(p, G.mul3(v, m)), o);
export function helpers(P) {
  const p2 = (pt) => k.iso(pt, P);
  const S = (paths, o = {}) => k.solidSvg(paths, o);
  const L = (d, o = {}) => k.lineSvg(d, o);
  const slab = (plan, z, h, o = {}, steps = 3, bevel = 0.6) => S(k.slabOf(plan, z, h, P, steps, bevel), o);
  const cyl = (x, y, r, z, h, o = {}, steps = 16) => S(k.cylinder(x, y, r, z, h, P, steps), o);
  const tube = (points, r, o = {}) => {
    const rm = typeof r === "function" ? Math.max(r(0), r(1)) : r;
    const route = G.fillet(points, o.fillet ?? Math.max(3, rm * 2.6), 5, { P, tube: rm });
    return T.tubePieces(route, r, P, { maxLength: 400, caps: o.caps ?? true }).map((piece) => T.tubeSvg(piece, { tone: o.tone ?? "mid" })).join("");
  };
  const shadow = (plan) => `<path class="shadow" d="${k.haloOf(plan, 0, 0.1, P)}"/>`;
  const wheel = (x, y, r, cls = "c-dark") => S(G.disc(-2, 2, r, G.frameAlong([x, y, r], [0, 1, 0]), P, {}), { tone: "mid", className: cls });
  return { p2, S, L, slab, cyl, tube, shadow, wheel };
}
// grupo com classe de tom
export const grp = (cls, svg) => `<g class="${cls}">${svg}</g>`;

// ---- achatar CSS em atributos hex, via Chrome headless; reescrever d="" em relativo ----
import { execFileSync } from "node:child_process";
import { findChrome } from "../convert.mjs";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
// O mesmo Chrome do conversor e dos testes (respeita CHROME_PATH); sem ele, falha dizendo por quê.
const chrome = () => findChrome() ?? (() => { throw new Error("Chrome não encontrado (defina CHROME_PATH)"); })();
const BASEARGS = ["--headless=new", "--disable-gpu", "--no-sandbox", "--allow-file-access-from-files", "--hide-scrollbars"];
const tmp = mkdtempSync(join(tmpdir(), "kit-"));
const FLAT = `<script>
const hx=(s)=>{const m=s.match(/rgba?\\(([^)]+)\\)/);if(!m)return null;const p=m[1].split(/[ ,\\/]+/).map(Number);return['#'+p.slice(0,3).map(x=>Math.round(x).toString(16).padStart(2,'0')).join('').toUpperCase(),p[3]===undefined?1:p[3]]};
const svg=document.querySelector('svg');const SC=+svg.dataset.sc||2;
svg.querySelectorAll('.iso-halo').forEach(e=>e.remove());
for(const el of svg.querySelectorAll('path,circle,rect,line,polygon,stop')){
 const cs=getComputedStyle(el);
 if(el.tagName==='stop'){const c=hx(cs.stopColor);if(c)el.setAttribute('stop-color',c[0]);continue}
 const set=(a,v)=>el.setAttribute(a,v);
 let fo=+cs.fillOpacity,so=+cs.strokeOpacity;
 if(cs.fill.startsWith('url'))set('fill',cs.fill.replace(/url\\("?([^")]+)"?\\)/,'url($1)'));
 else if(cs.fill==='none')set('fill','none');
 else{const c=hx(cs.fill);set('fill',c[0]);fo*=c[1]}
 if(cs.stroke!=='none'&&!cs.stroke.startsWith('url')){const c=hx(cs.stroke);set('stroke',c[0]);so*=c[1];
  set('stroke-width',+(parseFloat(cs.strokeWidth)*SC).toFixed(2));
  if(cs.strokeLinecap!=='butt')set('stroke-linecap',cs.strokeLinecap);if(cs.strokeLinejoin!=='miter')set('stroke-linejoin',cs.strokeLinejoin);
  if(cs.strokeDasharray!=='none')set('stroke-dasharray',cs.strokeDasharray.split(/[ ,]+/).map(v=>+(parseFloat(v)*SC).toFixed(2)).join(' '));
  if(so<0.995)set('stroke-opacity',+so.toFixed(2))}
 if(fo<0.995&&cs.fill!=='none')set('fill-opacity',+fo.toFixed(2));
 if(+cs.opacity<0.995)set('opacity',+(+cs.opacity).toFixed(2));
}
svg.querySelectorAll('*').forEach(e=>{for(const a of [...e.attributes])if(a.name==='class'||a.name==='style'||a.name.startsWith('data-')||a.name==='vector-effect')e.removeAttribute(a.name)});
svg.querySelectorAll('style').forEach(e=>e.remove());
for(const a of ['class','style','data-theme','data-sc'])svg.removeAttribute(a);
svg.setAttribute('xmlns','http://www.w3.org/2000/svg');const o=document.createElement('script');o.type='text/plain';o.id='out';o.textContent=svg.outerHTML;document.body.appendChild(o);
</script>`;
const num = (v) => { let s = (Math.round(v * 10) / 10).toString(); if (s === "-0") s = "0"; return s.replace(/^(-?)0\./, "$1."); };
const jn = (arr) => arr.reduce((o, n, i) => o + (i && !n.startsWith("-") ? " " : "") + n, "");
// Douglas-Peucker nos trechos de L: tira pontos que desviam menos de eps (px do quadro) da reta; a curva amostrada pesa menos sem mudar o tracado
const rdp = (pts, eps) => {
  if (pts.length < 3) return pts;
  const [a, b] = [pts[0], pts[pts.length - 1]], dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1;
  let m = 0, at = 0;
  for (let i = 1; i < pts.length - 1; i++) { const d = Math.abs(dy * (pts[i][0] - a[0]) - dx * (pts[i][1] - a[1])) / n; if (d > m) { m = d; at = i; } }
  return m > eps ? [...rdp(pts.slice(0, at + 1), eps).slice(0, -1), ...rdp(pts.slice(at), eps)] : [a, b];
};
export const EPS = +(process.env.EPS ?? 0.3);
function simplifyD(d, eps = EPS) {
  const tk = d.match(/[MLQZ]|-?\d*\.?\d+/g) ?? [];
  let i = 0, out = "", run = [], cur = null;
  const flush = () => { if (run.length) { const r = rdp(run, eps); for (const p of r.slice(1)) out += "L" + p[0] + " " + p[1]; run = []; } };
  while (i < tk.length) {
    const c = tk[i++];
    if (c === "Z") { flush(); out += "Z"; continue; }
    if (c === "M") { flush(); cur = [+tk[i++], +tk[i++]]; out += "M" + cur[0] + " " + cur[1]; run = [cur]; continue; }
    if (c === "L") { cur = [+tk[i++], +tk[i++]]; run.push(cur); continue; }
    if (c === "Q") { flush(); const q = [tk[i++], tk[i++], tk[i++], tk[i++]]; out += "Q" + q.join(" "); cur = [+q[2], +q[3]]; run = [cur]; }
  }
  flush();
  return out;
}
export function optimizeD(d0) {
  const d = simplifyD(d0);
  const tk = d.match(/[MLQZ]|-?\d*\.?\d+/g) ?? [];
  let i = 0, cx = 0, cy = 0, sx = 0, sy = 0, out = "", cmd = "", buf = [];
  const flush = () => { if (buf.length) { out += cmd + jn(buf); buf = []; } };
  const R = (v) => Math.round(v * 10) / 10;
  while (i < tk.length) {
    const c = tk[i++];
    if (c === "Z") { flush(); out += "z"; cmd = ""; cx = sx; cy = sy; continue; }
    if (c === "M" || c === "L") {
      const x = R(+tk[i++]), y = R(+tk[i++]);
      if (c === "M") { flush(); out += (out ? "m" : "M") + jn([num(out ? x - cx : x), num(out ? y - cy : y)]); sx = x; sy = y; cx = x; cy = y; cmd = "l"; buf = []; continue; }
      if (x === cx && y === cy) continue;
      if (cmd !== "l") { flush(); cmd = "l"; }
      buf.push(num(x - cx), num(y - cy)); cx = x; cy = y; continue;
    }
    if (c === "Q") { flush(); const a = [+tk[i++], +tk[i++], +tk[i++], +tk[i++]].map(R); out += "q" + jn([num(a[0] - cx), num(a[1] - cy), num(a[2] - cx), num(a[3] - cy)]); cx = a[2]; cy = a[3]; cmd = ""; }
  }
  flush();
  return out;
}
// svg bruto (com <style>) -> svg de arte importada
export function achatar(svgText) {
  const f = join(tmp, "flat" + Math.random().toString(36).slice(2) + ".html");
  writeFileSync(f, `<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0">${svgText}${FLAT}</body></html>`);
  const dom = execFileSync(chrome(), [...BASEARGS, "--dump-dom", "file://" + f], { maxBuffer: 1 << 28, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  const m = dom.match(/<script type="text\/plain" id="out">([\s\S]*?)<\/script>/);
  if (!m) throw new Error("achatar falhou");
  return m[1].replace(/ d="([^"]*)"/g, (_, d) => ` d="${optimizeD(d)}"`).replace(/ xmlns:xlink="[^"]*"/, "").replace(/&nbsp;/g, " ");
}
export const svgBruto = (inner, W, H, label = "", sc = 2) => `<svg xmlns="http://www.w3.org/2000/svg" class="iso-svg iso" data-theme="dark" data-sc="${sc}" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"${label ? ` role="img" aria-label="${label}"` : ""}><style>${k.ISO_CSS}${CSS}</style>${inner}</svg>`;
export function shot(html, png, w, h) {
  const f = join(tmp, "p" + Math.random().toString(36).slice(2) + ".html");
  writeFileSync(f, html);
  execFileSync(chrome(), [...BASEARGS, `--screenshot=${png}`, `--window-size=${w},${h}`, "--force-device-scale-factor=1", "file://" + f], { stdio: "ignore" });
}
export const page = (inner, w, h, bg = "#171920") => `<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0;background:${bg};width:${w}px;height:${h}px;overflow:hidden">${inner}</body></html>`;
// prova rapida de uma peca: svg bruto -> png, sem achatar
export const SVGPAGE = (inner, W, H, bg = "#171920") => page(`<style>${k.ISO_CSS}${CSS}</style>${inner}`, W, H, bg);
