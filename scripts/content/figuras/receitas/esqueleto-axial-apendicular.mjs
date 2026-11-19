// HISTÓRICO, não é executado por teste nem pelo gate: registra como a fonte versionada em fontes/esqueleto-axial-apendicular.svg foi feita
// a partir do original (limpar rótulos, recolorir). A regeneração do spec sai da fonte, por build-spec.mjs.
// Os caminhos relativos abaixo valem para a pasta de trabalho de origem (.superpowers/sdd/.../1A/esqueleto-axial-apendicular/), que não é versionada.
// Limpa e recolore o original (Mikael Häggström, domínio público) em fontes/<id>.svg. Sem redesenho de forma.
import { readFileSync, writeFileSync } from 'node:fs';
const [,, src, out] = process.argv;
const t = readFileSync(src, 'utf8');
const s0 = t.indexOf('>', t.indexOf('id="layer3"')) + 1;
const s1 = t.indexOf('<g\n   inkscape:groupmode="layer"\n   id="layer1"');
const inner = t.slice(s0, s1).replace(/<\/g>\s*$/, '');
// grupos de topo por profundidade
const re = /<(\/?)(\w+)([^>]*?)(\/?)>/g; let m, depth = 0, start = -1; const groups = [];
while ((m = re.exec(inner))) {
  const [all, close, tag, , self] = m;
  if (tag !== 'g') continue;
  if (close) { depth--; if (depth === 0) groups.push(inner.slice(start, m.index + all.length)); }
  else { if (depth === 0) start = m.index; if (!self) depth++; else if (depth === 0) groups.push(all); }
}
const BLUE = '#4A9EFF', BLUE_SPINE = '#2F7FE8', BLUE_RIB = '#8CC4FF', AMBER = '#FFC21A';
const baseOf = (id) => {
  if (id === 'Skull') return BLUE;
  if (['CervicalVertebrae', 'ThoracicVertebrae', 'LumbarVertebrae', 'Sacrum', 'Coccyx', 'g801'].includes(id)) return BLUE_SPINE;
  if (['Manubrium', 'g845', 'g1609'].includes(id)) return BLUE_RIB;
  return AMBER;
};
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const toHex = (a) => '#' + a.map((x) => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, '0')).join('');
const shade = (h, k) => toHex(hex(h).map((x) => x * k));
const tint = (h, k) => toHex(hex(h).map((x) => x + (255 - x) * k));
const unknown = new Set();
function fillOf(v, base) {
  const rgb = (/rgb\((\d+), (\d+), (\d+)\)/.exec(v) || []).slice(1).join(',');
  if (/url\(/.test(v)) return { c: '#0B0D12', o: 0.55 };
  const map = { '220,192,109': base, '204,178,92': shade(base, 0.78), '243,212,140': tint(base, 0.25), '249,206,130': tint(base, 0.25),
    '249,227,183': tint(base, 0.5), '244,233,215': tint(base, 0.7), '225,226,227': '#E6E8EE', '187,189,191': '#9AA3B5', '35,31,32': '#0B0D12', '255,255,255': '#E6E8EE' };
  if (v.trim() === 'none') return { c: 'none' };
  if (!map[rgb]) unknown.add(v);
  return { c: map[rgb] ?? base };
}
const strokeOf = (v, base) => /150, 115, 72/.test(v) ? shade(base, 0.45) : /204, 178, 92/.test(v) ? shade(base, 0.78) : (unknown.add(v), shade(base, 0.45));
const q = (n) => Math.round(n * 10) / 10;
const fmt = (n) => { let x = String(q(n)); if (x === '-0') x = '0'; return x.replace(/^(-?)0\./, '$1.'); };
function r1(d) { // M/C/z absolutos -> M absoluto + c relativo, coordenada em décimos (erro < 0,05 unidade)
  const tok = d.match(/[A-Za-z]|-?\d*\.?\d+/g); let i = 0, cx = 0, cy = 0, sx = 0, sy = 0, last = '';
  const X = [], Y = [], out = [];
  const num = () => parseFloat(tok[i++]);
  while (i < tok.length) {
    const c = tok[i++];
    if (c === 'M') { const x = q(num()), y = q(num()); out.push('M', fmt(x), fmt(y)); cx = sx = x; cy = sy = y; last = 'M'; X.push(x); Y.push(y); }
    else if (c === 'C') {
      if (last !== 'c') out.push('c'); last = 'c';
      while (i < tok.length && !/[A-Za-z]/.test(tok[i])) for (let k = 0; k < 3; k++) { const x = q(num()), y = q(num()); out.push(fmt(x - cx), fmt(y - cy)); X.push(x); Y.push(y); if (k === 2) { cx = x; cy = y; } }
    }
    else if (c === 'z' || c === 'Z') { out.push('z'); cx = sx; cy = sy; last = 'z'; }
    else throw new Error('comando ' + c);
  }
  r1.extent = Math.max(Math.max(...X) - Math.min(...X), Math.max(...Y) - Math.min(...Y));
  let str = '';
  out.forEach((t, k) => { const prev = out[k - 1]; const letter = /^[A-Za-z]$/.test(t); str += (k === 0 || letter || /^[A-Za-z]$/.test(prev) || t.startsWith('-') || (t.startsWith('.') && prev.includes('.')) ? '' : ' ') + t; });
  return str;
}
const r1_old = (d) => d.replace(/-?\d+\.\d+/g, (n) => String(Math.round(parseFloat(n) * 10) / 10)).replace(/\s+/g, ' ').trim();
let body = '', paths = 0, dropped = 0;
for (const g of groups) {
  const id = /id="([^"]+)"/.exec(g)[1];
  if (id === 'FootLeft' || id === 'FootRight') continue;
  const base = baseOf(id);
  let o = '';
  for (const p of g.matchAll(/<path\b([^>]*?)\/?>/g)) {
    const a = p[1]; const d = /\bd="([^"]*)"/.exec(a)?.[1]; if (!d) continue;
    const st = Object.fromEntries((/style="([^"]*)"/.exec(a)?.[1] ?? '').split(';').filter(Boolean).map((x) => x.split(/:\s*/)));
    if (st.fill === undefined && st.stroke === undefined) unknown.add('semestilo');
    const f = fillOf(st.fill ?? 'rgb(220, 192, 109)', base);
    let attrs = `fill="${f.c}"` + (f.o ? ` fill-opacity="${f.o}"` : '');
    if (st.stroke && st.stroke !== 'none') attrs += ` stroke="${strokeOf(st.stroke, base)}" stroke-width="${st['stroke-width'] ?? 1}"`;
    const dd = r1(d); if (r1.extent < 2.5) { dropped++; continue; }
    o += `<path d="${dd}" ${attrs}/>`; paths++;
  }
  body += `<g id="${id}">${o}</g>\n`;
}
writeFileSync(out, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 435.687 841.89">\n${body}</svg>\n`);
console.log('grupos', groups.length, groups.map((g) => /id="([^"]+)"/.exec(g)[1]).join(' '), '\ncaminhos', paths, 'desconhecidos', [...unknown]);
