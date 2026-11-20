// HISTÓRICO, não é executado por teste nem pelo gate: registra como a fonte versionada em fontes/marcos-de-superficie.svg foi feita
// a partir do original (idem). A regeneração do spec sai da fonte, por build-spec.mjs.
// Os caminhos relativos valem para a pasta de trabalho de origem (.superpowers/sdd/2026-11-19-figuras-fase-1/1C/marcos-de-superficie/), que não é versionada.

// Mede o retângulo de cada <path> da fonte (coordenadas do original) com o Chrome.
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const ws = process.argv[2];
const svg = readFileSync(`${ws}/original.svg`, 'utf8').replace(/<\?xml[^>]*\?>/, '').replace(/<!DOCTYPE[^>]*>/, '').replace(/<!--[\s\S]*?-->/, '');
const html = `<!doctype html><html><body style="margin:0">${svg}<pre id="o"></pre><script>
const r=[...document.querySelectorAll('svg path')].map(p=>{const b=p.getBoundingClientRect();return [b.x,b.y,b.width,b.height].map(v=>Math.round(v*10)/10)});
document.getElementById('o').textContent=JSON.stringify(r);</script></body></html>`;
writeFileSync(`${ws}/bbox.html`, html);
const out = execFileSync('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless', '--disable-gpu', '--dump-dom', `file://${process.cwd()}/${ws}/bbox.html`], { encoding: 'utf8', maxBuffer: 1e8, stdio: ['ignore', 'pipe', 'ignore'] });
const m = /<pre id="o">([^<]*)<\/pre>/.exec(out);
writeFileSync(`${ws}/bbox.json`, m[1]);
console.log(JSON.parse(m[1]).length);
