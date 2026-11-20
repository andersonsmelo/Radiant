// Fonte de osso-longo: "Bone cross-section.svg" (Pbroks13, 2008, Wikimedia Commons, CC BY 3.0;
// https://commons.wikimedia.org/wiki/File:Bone_cross-section.svg). Entrada versionada: osso-longo.original.svg
// (sha256 093178e2ded1109b309f89bec340fbe8758fa2ddb63a3d549772359154c596da, versão do autor de 2009-01-03). Roda num checkout limpo.
// Uso (da raiz do repositório): node scripts/content/figuras/receitas/osso-longo.mjs
// Tira só o grupo g4604 (linhas de chamada e os 8 textos do autor), os filtros de desfoque (a conversão os removeria de qualquer
// modo) e os metadados do Inkscape. Todos os caminhos ficam, na mesma ordem. Recolore por parte para a paleta do app e arredonda
// as coordenadas de TODOS os caminhos pelo mesmo passo (comandos todos absolutos: sem deriva). Enquadra por viewBox, sem apagar traço.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const D = dirname(fileURLToPath(import.meta.url));
const inp = join(D, 'osso-longo.original.svg'), out = join(D, '..', 'fontes', 'osso-longo.svg');
const Q = 0.5; // passo de arredondamento, em unidades do autor
let s = readFileSync(inp, 'utf8');

function dropGroup(t, id) {
  const at = t.indexOf(`id="${id}"`); if (at < 0) throw new Error('grupo ' + id);
  const st = t.lastIndexOf('<g', at); const re = /<g[\s>]|<\/g>/g; re.lastIndex = st; let d = 0, m;
  while ((m = re.exec(t))) { if (m[0][1] === '/') { if (--d === 0) return [t.slice(0, st) + t.slice(m.index + 4), t.slice(st, m.index + 4)]; } else d++; }
  throw new Error('grupo sem fim');
}
let rem; [s, rem] = dropGroup(s, 'g4604');
const tiposRemovidos = [...rem.matchAll(/<(\w+)/g)].map((m) => m[1]).filter((t) => t !== 'tspan');
if (tiposRemovidos.some((t) => t !== 'g' && t !== 'path' && t !== 'text')) throw new Error('g4604 tem mais que rótulos: ' + tiposRemovidos);
const nTexto = tiposRemovidos.filter((t) => t === 'text').length, nLinha = tiposRemovidos.filter((t) => t === 'path').length;
const caminhosAntes = (s.match(/<path\b/g) || []).length;

// ---- cores ----
const hex = (h) => { h = h.replace('#', ''); if (h.length === 3) h = [...h].map((c) => c + c).join(''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); };
const toHex = (a) => '#' + a.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
const luma = ([r, g, b]) => (0.299 * r + 0.587 * g + 0.114 * b) / 255;
const RAMPS = {
  osso: ['#6F7A90', '#E6E8EE'], // osso esponjoso e periósteo: cinza
  cortical: ['#C48F00', '#FFE08A'], // osso compacto: âmbar
  cartilagem: ['#2AA6B5', '#B6F6FB'], // cartilagem articular: ciano
  medula: ['#2B6CC4', '#A9D1FF'], // medula e cavidade: azul
  vaso: ['#2B6CC4', '#2B6CC4'],
};
const ramp = (nome, h) => {
  const [a, b] = RAMPS[nome].map(hex); const t = Math.min(1, Math.max(0, (luma(hex(h)) - 0.5) / 0.5));
  return toHex(a.map((v, i) => v + (b[i] - v) * t));
};
const POR_ID = {};
const dar = (nome, ids) => ids.forEach((i) => (POR_ID['path' + i] = nome));
dar('osso', [4250, 3133, 3135, 3139, 4043, 3143, 3145, 3122, 3124, 3126, 3128, 3246, 3248, 3250, 3252, 3254, 3256, 3258, 3214, 3221, 3242, 3265]);
dar('cortical', [3179, 3181, 3189, 3187]);
dar('cartilagem', [3638, 4434]);
dar('medula', [3197, 3199, 3201, 3203, 3205]);
dar('vaso', [3211, 3218, 3239, 3263]);
// gradientes (pela base de cada href)
const GRAD = { 4270: 'osso', 3326: 'medula', 4596: 'medula', 3247: 'medula', 3268: 'osso', 3248: 'osso', 3516: 'osso' };
const gradRamp = {};
for (const m of s.matchAll(/<(?:linear|radial)Gradient\b[^>]*?>/g)) {
  const id = /\bid="([^"]*)"/.exec(m[0])[1]; const href = /xlink:href="#([^"]*)"/.exec(m[0]);
  gradRamp[id] = GRAD[(href ? href[1] : id).replace(/\D+/, '')];
}
// stops: cada gradiente-base herda a rampa pelo seu id
s = s.replace(/<(linear|radial)Gradient\b[\s\S]*?<\/\1Gradient>/g, (g) => {
  const id = /\bid="([^"]*)"/.exec(g)[1]; const nome = GRAD[id.replace(/\D+/, '')] ?? gradRamp[id];
  if (!nome) return g;
  return g.replace(/stop-color:(#[0-9a-fA-F]{3,6})/g, (m, c) => 'stop-color:' + ramp(nome, c));
});
// Degradês do Inkscape em cadeia: o conversor descarta xlink:href e deixaria o degradê sem <stop> (a forma ficaria transparente).
// Copia os <stop> do degradê-base (já recolorido) para cada degradê que o referencia e tira o href.
const stopsDe = {};
for (const m of s.matchAll(/<linearGradient\b[^>]*\bid="([^"]*)"[^>]*>((?:(?!<\/linearGradient>)[\s\S])*?<stop[\s\S]*?)<\/linearGradient>/g)) stopsDe[m[1]] = m[2];
let resolvidos = 0;
s = s.replace(/<(linear|radial)Gradient\b([^>]*?)\sxlink:href="#([^"]*)"([^>]*?)\s*\/>/g, (m, tipo, a, base, b) => {
  if (!stopsDe[base]) throw new Error('degradê-base sem stops: ' + base);
  resolvidos++;
  return `<${tipo}Gradient${a}${b}>${stopsDe[base]}</${tipo}Gradient>`;
});
if (resolvidos !== 7 || /xlink:href/.test(s)) throw new Error('degradês resolvidos: ' + resolvidos);
const recolor = (tag, nome) => tag.replace(/(fill|stroke):(#[0-9a-fA-F]{3,6})/g, (m, k, c) => {
  const v = c.toLowerCase();
  if (v === '#ffffff' || v === '#fff') return `${k}:#FFFFFF`;
  if (v === '#000000') return `${k}:#0B0D12`;
  return `${k}:${ramp(nome, c)}`;
});
// ---- coordenadas ----
const fmt = (v) => { let t = String(Math.round(v / Q) * Q); t = String(+(+t).toFixed(4)); if (t === '-0') t = '0'; return t.replace(/^(-?)0\./, '$1.'); };
const requant = (d) => d.replace(/([MCLz])|(-?\d*\.?\d+(?:e-?\d+)?)/gi, (m, c, n) => (c ? c : fmt(Number(n)))).replace(/\s+/g, ' ').replace(/ ?([MCLz]) ?/g, '$1').replace(/(\d) (-)/g, '$1 $2').replace(/,/g, ' ').replace(/(?<=C[^MLzC]*)C/g, ' ');
// o regex acima deixa vírgula: trocada por espaço
s = s.replace(/<path\b[^>]*?\/?>/g, (tag) => {
  const id = /\bid="(path\d+)"/.exec(tag)?.[1]; const nome = POR_ID[id]; if (!nome) throw new Error('caminho sem parte: ' + id);
  tag = recolor(tag, nome);
  tag = tag.replace(/;?filter:url\(#[^)]*\)/g, '');
  tag = tag.replace(/\sd="([^"]*)"/, (m, d) => ` d="${requant(d.replace(/,/g, ' '))}"`);
  tag = tag.replace(/\s(?:inkscape|sodipodi):[\w-]+="[^"]*"/g, '');
  return tag;
});
// limpeza: metadados, filtros (só desfoque), namedview, atributos do Inkscape
s = s.replace(/<metadata[\s\S]*?<\/metadata>/, '').replace(/<sodipodi:namedview[\s\S]*?\/>/, '').replace(/<filter\b[\s\S]*?<\/filter>/g, '');
s = s.replace(/\s(?:inkscape|sodipodi):[\w-]+="[^"]*"/g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/<\?xml[^>]*\?>/, '');
s = s.replace(/<svg\b[\s\S]*?>/, '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="160 -5 620 465">');
s = s.replace(/\s+/g, ' ').replace(/> </g, '><').trim() + '\n';
const caminhosDepois = (s.match(/<path\b/g) || []).length;
if (caminhosAntes !== caminhosDepois) throw new Error('caminhos mudaram');
writeFileSync(out, s);
console.log(`removidos: ${nLinha} linhas de chamada e ${nTexto} textos; caminhos mantidos ${caminhosDepois}; ${(s.length / 1024).toFixed(1)} KiB`);
