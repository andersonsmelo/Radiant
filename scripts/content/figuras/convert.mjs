// Conversor de SVG de acervo ou de gerador externo para o SVG "plano" que o SvgXml aceita:
// só atributos de apresentação, sem <style>, classe, variável CSS, filtro nem vector-effect.
// O Chrome headless resolve o CSS (classes, variáveis, transformações) em valores computados.
// Uso (biblioteca): convertSvg(textoSvg, { strokeScale, dropBackground, split, wrapAttrs }).
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const CANDIDATES = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
];

/** Caminho do Chrome, ou null: os testes pulam quando não há (o CI não tem). */
export function findChrome() {
  return CANDIDATES.find((c) => c && existsSync(c)) ?? null;
}

const TIMEOUT_MS = Number(process.env.CHROME_TIMEOUT_MS) || 120_000;

const PAGE = String.raw`
const PROPS = { 'fill': 'rgb(0, 0, 0)', 'fill-opacity': '1', 'fill-rule': 'nonzero', 'stroke': 'none', 'stroke-width': '1px',
  'stroke-opacity': '1', 'stroke-linecap': 'butt', 'stroke-linejoin': 'miter', 'stroke-dasharray': 'none', 'stroke-dashoffset': '0px', 'stroke-miterlimit': '4' };
const SHAPES = new Set(['path','circle','rect','ellipse','line','polygon','polyline']);
const r2 = (v) => String(Math.round(parseFloat(v) * 1000) / 1000);
function color(v) {
  const m = v.match(/^rgba?\(([^)]+)\)$/); if (!m) return { c: v.replace(/url\("?([^")]+)"?\)/, 'url($1)') , a: 1 };
  const [r, g, b, a = '1'] = m[1].split(/[ ,\/]+/);
  return { c: '#' + [r, g, b].map((x) => (+x).toString(16).padStart(2, '0')).join(''), a: +a };
}
const REFS = document.body.innerHTML;
const report = { filters: [], nonScaling: 0, cssTransforms: 0, removedAttrs: {} };
function flatten(svg, strokeScale) {
  const todo = [];
  for (const el of [...svg.querySelectorAll('*')]) {
    const cs = getComputedStyle(el); const tag = el.localName;
    if (tag === 'style' || cs.display === 'none' || cs.visibility === 'hidden') { todo.push([el, null]); continue; }
    const set = {};
    if (SHAPES.has(tag)) {
      for (const [p, d] of Object.entries(PROPS)) {
        let v = cs.getPropertyValue(p);
        if (p === 'fill' || p === 'stroke') { const { c, a } = color(v); v = c; if (a < 1) set[p + '-opacity'] = r2(a * parseFloat(cs.getPropertyValue(p + '-opacity'))); }
        if (v !== d && !(p + '-opacity' in set && p.endsWith('opacity'))) set[p] = v.replace(/px/g, '');
      }
      if (cs.getPropertyValue('vector-effect') === 'non-scaling-stroke' && set['stroke-width']) { set['stroke-width'] = r2(parseFloat(set['stroke-width']) * strokeScale); report.nonScaling++; }
      if (set.stroke === undefined) { for (const k of Object.keys(set)) if (k.startsWith('stroke-')) delete set[k]; }
    }
    if (tag === 'stop') { const { c, a } = color(cs.getPropertyValue('stop-color')); set['stop-color'] = c; const o = a * parseFloat(cs.getPropertyValue('stop-opacity')); if (o < 1) set['stop-opacity'] = r2(o); }
    let op = parseFloat(cs.opacity);
    if (cs.filter && cs.filter !== 'none') { report.filters.push(tag + ': ' + cs.filter); op = 0.4; } // o borrão some: a sombra fica dura e fraca
    if (op < 1 && tag !== 'stop') set.opacity = r2(op);
    if (cs.transform && cs.transform !== 'none' && !['stop','linearGradient','defs'].includes(tag)) { set.transform = cs.transform.replace(/,\s*/g, ' '); if (!el.hasAttribute('transform')) report.cssTransforms++; }
    const keep = new Set(['d','cx','cy','r','rx','ry','x','y','width','height','x1','y1','x2','y2','points','offset','gradientUnits','gradientTransform','fx','fy','spreadMethod']);
    if (el.id && REFS.includes('url(#' + el.id + ')')) keep.add('id');
    todo.push([el, set, keep]);
  }
  // Segunda volta: só depois de ler tudo, porque tirar a classe do pai muda o estilo do filho.
  for (const [el, set, keep] of todo) {
    if (!set) { el.remove(); continue; }
    for (const a of [...el.attributes]) if (!keep.has(a.name)) { report.removedAttrs[a.name] = (report.removedAttrs[a.name] || 0) + 1; el.removeAttribute(a.name); }
    for (const [k, v] of Object.entries(set)) el.setAttribute(k, v);
  }
  // Grupo sem atributo não muda nada: some, e os filhos sobem.
  for (const g of [...svg.querySelectorAll('g')].reverse()) if (!g.attributes.length) g.replaceWith(...g.childNodes);
}

const ser = (n) => new XMLSerializer().serializeToString(n).replace(/ xmlns="[^"]*"/g, '').replace(/\s*\n\s*/g, ' ').replace(/>\s+</g, '><').trim();
const cfg = JSON.parse(document.getElementById('cfg').textContent);
const svg = document.querySelector('body > svg');
const out = { report, layers: [], defs: '', bbox: null, viewBox: svg.getAttribute('viewBox') };
if (cfg.dropBackground) svg.querySelector(':scope > rect')?.remove(); // fundo: quem pinta é o quadro do app
{ let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9; const ps = svg.querySelectorAll('path'); for (const p of ps) { const q=p.getBBox(); x0=Math.min(x0,q.x); y0=Math.min(y0,q.y); x1=Math.max(x1,q.x+q.width); y1=Math.max(y1,q.y+q.height);} if (ps.length) out.bbox = [x0, y0, x1-x0, y1-y0]; }
if (!cfg.split) {
  flatten(svg, cfg.strokeScale);
  out.layers.push({ name: 'all', svg: [...svg.childNodes].map(ser).join('') });
} else {
  // A função de divisão marca as partes antes de achatar (as classes somem) e devolve [{name, nodes}] na ordem de pintura.
  const layers = (0, eval)('(' + cfg.split + ')')(svg);
  const defs = svg.querySelector('defs');
  // Achata cada camada dentro de um svg próprio, ainda no documento, para o CSS valer.
  const wrap = (nodes) => { const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); for (const [k, v] of Object.entries(cfg.wrapAttrs || {})) s.setAttribute(k, v); svg.appendChild(s); nodes.forEach((n) => s.appendChild(n)); return s; };
  // Conserva o defs no lugar para resolver as cores dos stops.
  if (defs) flatten(defs, cfg.strokeScale);
  const holders = layers.map((l) => ({ name: l.name, s: wrap(l.nodes) }));
  for (const h of holders) flatten(h.s, cfg.strokeScale);
  if (defs) out.defs = ser(defs).replace(/^<defs>|<\/defs>$/g, '');
  for (const h of holders) out.layers.push({ name: h.name, svg: [...h.s.childNodes].map(ser).join('') });
}
document.body.innerHTML = '';
const pre = document.createElement('pre'); pre.id = 'out'; pre.textContent = JSON.stringify(out); document.body.appendChild(pre);
`;

/**
 * Converte um SVG. Devolve { layers: [{ name, svg }], defs, bbox, viewBox, report }.
 * - strokeScale: multiplicador do traço de non-scaling-stroke (2 quando o quadro vai a 0,5x).
 * - dropBackground: tira o <rect> de fundo da raiz.
 * - split: fonte de uma função (svg) => [{ name, nodes }] que separa camadas; sem ela, uma camada só.
 * - wrapAttrs: atributos do <svg> que embrulha cada camada (o CSS da fonte pode depender deles).
 * report.filters lista cada filter removido: é a perda visível (sombra macia vira dura).
 */
export function convertSvg(text, { strokeScale = 1, dropBackground = false, split = null, wrapAttrs = null } = {}) {
  const chrome = findChrome();
  if (!chrome) throw new Error('Chrome não encontrado (defina CHROME_PATH)');
  const svg = text.replace(/<\?xml[^>]*>|<!--[\s\S]*?-->/g, '');
  const cfg = JSON.stringify({ strokeScale, dropBackground, split, wrapAttrs }).replace(/</g, '\\u003c');
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>*{animation:none!important;transition:none!important}</style></head><body>${svg}<script type="application/json" id="cfg">${cfg}</script><script>${PAGE}</script></body></html>`;
  const dir = mkdtempSync(path.join(tmpdir(), 'figuras-'));
  try {
    const htmlPath = path.join(dir, 'convert.html');
    writeFileSync(htmlPath, html);
    const args = ['--headless=new', '--disable-gpu', '--no-first-run', `--user-data-dir=${path.join(dir, 'perfil')}`, '--dump-dom', `file://${htmlPath}`];
    let dom;
    try {
      dom = execFileSync(chrome, args, { maxBuffer: 64 << 20, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: TIMEOUT_MS });
    } catch (e) {
      if (e.code === 'ETIMEDOUT') throw new Error(`O Chrome passou de ${TIMEOUT_MS / 1000} s sem terminar a conversão (travado?)`);
      // Caso conhecido: o Chrome sai com status 2 ao encerrar mesmo depois de despejar o DOM inteiro.
      // Qualquer outro status é erro; o status 2 só vale se o resultado veio completo.
      if (e.status !== 2 || !/<pre id="out">[\s\S]*<\/pre>/.test(e.stdout ?? '')) {
        throw new Error(`O Chrome falhou (status ${e.status}, sinal ${e.signal}): ${String(e.stderr ?? '').slice(-500)}`);
      }
      dom = e.stdout;
    }
    const m = dom.match(/<pre id="out">([\s\S]*?)<\/pre>/);
    if (!m) throw new Error('A página do conversor não devolveu resultado: ' + dom.slice(0, 500));
    return JSON.parse(m[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&'));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/** Mapa id -> <linearGradient> inteiro, lido do defs e do corpo das camadas. */
export function gradientMap(defs, bodies) {
  return Object.fromEntries([...(defs + bodies.join('')).matchAll(/<linearGradient id="(\w+)"[\s\S]*?<\/linearGradient>/g)].map((m) => [m[1], m[0]]));
}

/** Tira o <defs> do corpo e devolve só os gradientes que ele usa: cada camada é um SvgXml separado. */
export function ownDefs(body, grads) {
  const bare = body.replace(/<defs>[\s\S]*?<\/defs>/g, '');
  const used = [...new Set([...bare.matchAll(/url\(#(\w+)\)/g)].map((m) => m[1]))];
  return { body: bare, defs: used.length ? `<defs>${used.map((id) => grads[id]).join('')}</defs>` : '' };
}
