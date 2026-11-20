// HISTÓRICO, não é executado por teste nem pelo gate: registra como a fonte versionada em fontes/coluna-regioes.svg foi feita
// a partir do original (Wikimedia Commons, 202410_Vertebral_column_spine.svg, DBCLS, CC BY 4.0). A regeneração do spec sai da fonte, por build-spec.mjs.
// Os caminhos relativos abaixo valem para a pasta de trabalho de origem (.superpowers/sdd/2026-11-19-figuras-fase-1/1B/coluna-regioes/), que não é versionada.
// Passo 1: prep.mjs <original.svg> <fonte.svg> <caixa x0,y0,x1,y1>: só a vista de perfil, espelhada, recolorida, sem <style>.
// Prepara a fonte: só a vista de perfil (primeiro grupo de nível 1), espelhada, recolorida, sem <style>.
import { readFileSync, writeFileSync } from 'node:fs';
const src = readFileSync(process.argv[2], 'utf8').split('\n');
const body = src.slice(30, 197).join('\n'); // linhas 31..197 do original: grupo da vista de perfil
const COR = { st0: '#E6E8EE', st1: '#171920', st2: '#5EEAF7', st3: '#9AA3B5', st4: '#FFC21A', st5: '#4A9EFF' };
const OUT = '#0D0E12';
const [x0, y0, x1, y1] = process.argv[4].split(',').map(Number); // caixa do desenho no original
let b = body.replace(/<path class="(st\d)"/g, (_, c) => `<path fill="${COR[c]}"`).replace(/<path d=/g, `<path fill="${OUT}" d=`);
// Espelha na horizontal: a frente do corpo (que no original fica à direita) vai para a esquerda.
const w = x1 - x0, h = y1 - y0, pad = 2;
const out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x0 - pad} ${y0 - pad} ${w + 2 * pad} ${h + 2 * pad}"><g transform="translate(${x0 + x1} 0) scale(-1 1)">\n${b}\n</g></svg>\n`;
writeFileSync(process.argv[3], out);
console.log(out.length, 'bytes');

// ---- O gerar.mjs original (spec a partir da fonte) foi substituído pela entrada de build-spec.mjs. ----
