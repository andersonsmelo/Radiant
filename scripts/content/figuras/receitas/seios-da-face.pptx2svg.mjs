// Converte as formas livres de um slide do kit Servier (PPTX) em SVG. Uso: node pptx2svg.mjs slide.xml "Group 3" saida.svg
import { readFileSync, writeFileSync } from 'node:fs';
const [,, slide, groupName, out] = process.argv;
const x = readFileSync(slide, 'utf8');
const gi = x.indexOf(`name="${groupName}"`);
const gs = x.lastIndexOf('<p:grpSp>', gi);
// fim do grupo: balanceia grpSp
let depth = 0, pos = gs, end = -1;
const re = /<p:grpSp>|<\/p:grpSp>/g; re.lastIndex = gs;
for (let m; (m = re.exec(x));) { depth += m[0] === '<p:grpSp>' ? 1 : -1; if (!depth) { end = re.lastIndex; break; } }
const g = x.slice(gs, end);
const num = (s) => Number(s);
const xf = /<p:grpSpPr[^>]*><a:xfrm><a:off x="(-?\d+)" y="(-?\d+)"\/><a:ext cx="(\d+)" cy="(\d+)"\/><a:chOff x="(-?\d+)" y="(-?\d+)"\/><a:chExt cx="(\d+)" cy="(\d+)"\/>/.exec(g);
const [cox, coy, cew, ceh] = [num(xf[5]), num(xf[6]), num(xf[7]), num(xf[8])];
const emuPerUnit = num(xf[3]) / cew;
const color = (blk) => {
  const f = /<a:(solidFill|gradFill)>([\s\S]*?)<\/a:\1>/.exec(blk);
  if (!f) return null;
  const cols = [...f[2].matchAll(/<a:srgbClr val="([0-9A-Fa-f]{6})"/g)].map((m) => m[1]);
  return cols.length ? '#' + cols[Math.floor((cols.length - 1) / 2)] : null;
};
let body = '', n = 0;
for (const m of g.matchAll(/<p:sp>([\s\S]*?)<\/p:sp>/g)) {
  const s = m[1];
  const pr = /<p:spPr[\s\S]*?<\/p:spPr>/.exec(s)?.[0]; if (!pr || !pr.includes('custGeom')) continue;
  const xo = /<a:xfrm([^>]*)><a:off x="(-?\d+)" y="(-?\d+)"\/><a:ext cx="(\d+)" cy="(\d+)"/.exec(pr);
  const [ox, oy, ew, eh] = [num(xo[2]), num(xo[3]), num(xo[4]), num(xo[5])];
  const flipH = /flipH="1"/.test(xo[1]), flipV = /flipV="1"/.test(xo[1]);
  let d = '';
  for (const pm of pr.matchAll(/<a:path w="(\d+)" h="(\d+)"[^>]*>([\s\S]*?)<\/a:path>/g)) {
    const [pw, ph] = [num(pm[1]), num(pm[2])];
    const sx = ew / pw, sy = eh / ph;
    const P = (a) => { let X = a.x * sx, Y = a.y * sy; if (flipH) X = ew - X; if (flipV) Y = eh - Y; return `${+(ox + X).toFixed(1)} ${+(oy + Y).toFixed(1)}`; };
    for (const c of pm[3].matchAll(/<a:(moveTo|lnTo|cubicBezTo|close)\b[^>]*?(?:\/>|>([\s\S]*?)<\/a:\1>)/g)) {
      const pts = [...(c[2] || '').matchAll(/<a:pt x="(-?\d+)" y="(-?\d+)"/g)].map((p) => ({ x: num(p[1]), y: num(p[2]) }));
      d += c[1] === 'moveTo' ? `M${P(pts[0])}` : c[1] === 'lnTo' ? `L${P(pts[0])}` : c[1] === 'cubicBezTo' ? `C${pts.map(P).join(' ')}` : 'Z';
    }
  }
  const lnb = /<a:ln\b[^>]*>[\s\S]*?<\/a:ln>/.exec(pr)?.[0];
  const lw = lnb && /<a:ln[^>]*\bw="(\d+)"/.exec(lnb);
  const stroke = lnb && !lnb.includes('<a:noFill/>') ? color(lnb) : null;
  const fillBlk = pr.replace(/<a:ln\b[\s\S]*?<\/a:ln>/, '');
  const fill = fillBlk.includes('<a:noFill/>') ? null : color(fillBlk);
  n++;
  body += `<path id="${/name="([^"]*)"/.exec(s)[1].replace(/ /g, '-')}-${n}" d="${d}" fill="${fill || 'none'}"${stroke ? ` stroke="${stroke}" stroke-width="${lw ? +(num(lw[1]) / emuPerUnit).toFixed(2) : 1}" stroke-linejoin="round"` : ''}/>\n`;
}
writeFileSync(out, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${cox} ${coy} ${cew} ${ceh}">\n${body}</svg>\n`);
console.log(n, 'formas', out);
