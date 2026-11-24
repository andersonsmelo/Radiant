// Compõe scripts/content/figuras/fontes/respiracao-diafragma.svg: os dois estados do autor (Servier Medical Art) lado a lado.
// Uso: node compor.mjs <pasta-dos-originais> <saida.svg> [passo=0.1]  (sem variáveis de ambiente reproduz a fonte; S, YS, CXE, CXI só para exploração)
// Cada painel é o desenho inteiro do autor (todos os caminhos, texturas e brilhos); só saem a seta, o texto, o retângulo de recorte.
// O passo arredonda TODAS as coordenadas por igual, sem deixar a deriva dos comandos relativos acumular.
import { readFileSync, writeFileSync } from 'node:fs';
const [dir, out, qArg] = process.argv.slice(2);
const Q = Number(qArg ?? 0.1);

const MAP = {
  // ossos
  '#f5d586': '#E6E8EE', '#e7bb6d': '#9AA3B5', '#f5dda7': '#E6E8EE', '#fff': '#FFFFFF', '#343434': '#2A2E3A', '#433b41': '#2A2E3A',
  // pulmões
  '#e172a5': '#4A9EFF', '#d35b99': '#2F7BDB', '#b7607e': '#3A86E0', '#efbbd4': '#A9D1FF', '#bb418d': '#2467B8', '#6e1f42': '#1F4F8F', '#fbddd0': '#CFE5FF',
  // diafragma (a linha roxa do autor e seus pedaços)
  '#5f3167': '#FFC21A', '#62316a': '#FFC21A', '#722068': '#FFC21A', '#87267e': '#FFC21A', '#8f2d81': '#FFC21A', '#933483': '#FFC21A',
  '#945684': '#FFC21A', '#945789': '#FFC21A', '#904e7d': '#FFC21A', '#954a8e': '#FFC21A', '#96609b': '#FFC21A', '#97609b': '#FFC21A',
};

const fmt = (v) => {
  let s = String(Math.round(v * 1e4) / 1e4);
  if (s === '-0') s = '0';
  return s.replace(/^(-?)0\./, '$1.');
};
const snap = (v) => Math.round(v / Q) * Q;
const NARGS = { m: 2, l: 2, h: 1, v: 1, c: 6, s: 4, q: 4, t: 2, a: 7, z: 0 };

// Lê o `d` e o reescreve com as coordenadas absolutas encaixadas na grade e os comandos relativos recalculados contra o ponto JÁ
// arredondado (sem deriva)..
function requant(d) {
  const re = /([a-zA-Z])|([-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?)/g;
  const toks = [];
  let m;
  while ((m = re.exec(d))) toks.push(m[1] ?? Number(m[2]));
  let i = 0, cmd = '', cx = 0, cy = 0, ex = 0, ey = 0, sx = 0, sy = 0, sex = 0, sey = 0, first = true;
  const outp = [];
  let lastCmd = '';
  const emit = (c, nums) => { outp.push((c === lastCmd && c !== 'M' && c !== 'm' ? ' ' : c) + nums.map(fmt).join(' ')); lastCmd = c; };
  const flag = () => { const t = toks[i++]; if (t !== 0 && t !== 1) throw new Error('flag inválida ' + t); return t; };
  while (i < toks.length) {
    if (typeof toks[i] === 'string') cmd = toks[i++];
    const lc = cmd.toLowerCase(), rel = cmd === lc;
    if (lc === 'z') { outp.push('z'); lastCmd = 'z'; cx = sx; cy = sy; ex = sex; ey = sey; continue; }
    const n = NARGS[lc];
    if (n === undefined) throw new Error('comando ' + cmd);
    const a = [];
    if (lc === 'a') {
      a.push(toks[i++], toks[i++], toks[i++], flag(), flag(), toks[i++], toks[i++]);
    } else {
      for (let k = 0; k < n; k++) a.push(toks[i++]);
    }
    if (a.some((v) => v === undefined || typeof v === 'string')) throw new Error('args inválidos em ' + cmd);
    // pontos verdadeiros (absolutos) e arredondados
    const pts = []; // pares [verdadeiro x, y]
    let args;
    if (lc === 'h') { pts.push([rel ? cx + a[0] : a[0], cy]); }
    else if (lc === 'v') { pts.push([cx, rel ? cy + a[0] : a[0]]); }
    else if (lc === 'a') { pts.push([rel ? cx + a[5] : a[5], rel ? cy + a[6] : a[6]]); }
    else { for (let k = 0; k < n; k += 2) pts.push([rel ? cx + a[k] : a[k], rel ? cy + a[k + 1] : a[k + 1]]); }
    const q = pts.map(([x, y]) => [snap(x), snap(y)]);
    // emissão: relativo = (arredondado - ponto emitido anterior); absoluto = arredondado
    const R = (p) => (rel ? [p[0] - ex, p[1] - ey] : p);
    let c = cmd;
    if (first) { c = 'M'; }
    if (lc === 'h') args = [rel ? q[0][0] - ex : q[0][0]];
    else if (lc === 'v') args = [rel ? q[0][1] - ey : q[0][1]];
    else if (lc === 'a') args = [Math.max(Q, snap(a[0])), Math.max(Q, snap(a[1])), a[2], a[3], a[4], ...R(q[0])];
    else args = q.flatMap(R);
    if (first) { // moveto inicial em absoluto
      args = [q[0][0], q[0][1]];
    }
    emit(first ? 'M' : cmd, args);
    const last = pts[pts.length - 1], lq = q[q.length - 1];
    cx = last[0]; cy = last[1]; ex = lq[0]; ey = lq[1];
    if (lc === 'm') { sx = cx; sy = cy; sex = ex; sey = ey; if (rel && !first) { /* mantém */ } cmd = rel ? 'l' : 'L'; }
    first = false;
  }
  return outp.join('').replace(/ -/g, '-').replace(/ \./g, ' .');
}

const paths = (f) => {
  const t = readFileSync(`${dir}/${f}.svg`, 'utf8').replace(/<defs>[\s\S]*?<\/defs>/, '');
  return [...t.matchAll(/<path [^>]*>/g)].map((m) => m[0]);
};
const fix = (p) => {
  const d = /d="([^"]*)"/.exec(p)[1];
  const fill = /fill="([^"]*)"/.exec(p)?.[1];
  if (!fill || !MAP[fill]) throw new Error('cor sem mapa ' + fill);
  const rule = /fill-rule="([^"]*)"/.exec(p)?.[1];
  return { a: `<path fill="${MAP[fill]}"${rule ? ` fill-rule="${rule}"` : ''}`, d: requant(d), arrow: fill === '#6ac5dc' };
};
// Sem união de caminhos: caminho `evenodd` unido a vizinhos cancela subcaminhos que se sobrepõem e apaga traço do autor.
const state = (f) => paths(f).filter((p) => !/fill="#6ac5dc"/.test(p)).map(fix).map(({ a, d }) => `${a} d="${d}"/>`).join('');

// Alinhamento: o topo do esterno (a silhueta #343434 do esterno inteiro) e o eixo dele no mesmo ponto de cada painel.
// Medidas no original (getBBox): expiração x 112,2 a 186,0, topo 48,6; inspiração x 138,0 a 209,0, topo 37,9.
const REF = { exp: [(112.2 + 186.0) / 2, 48.6], ins: [(138.0 + 209.0) / 2, 37.9] };
const S = Number(process.env.S ?? 0.46), YS = Number(process.env.YS ?? 34), CX = [Number(process.env.CXE ?? 72), Number(process.env.CXI ?? 234)];
const place = (ref, cx) => `translate(${fmt(cx - ref[0] * S)} ${fmt(YS - ref[1] * S)}) scale(${S})`;
writeFileSync(out, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" width="320" height="240"><g id="expiracao" transform="${place(REF.exp, CX[0])}">${state('breathing-expiration')}</g><g id="inspiracao" transform="${place(REF.ins, CX[1])}">${state('breathing-inspiration')}</g></svg>`);
console.log('KiB', (readFileSync(out).length / 1024).toFixed(1));
