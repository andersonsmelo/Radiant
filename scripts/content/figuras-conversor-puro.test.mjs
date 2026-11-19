// Parte do conversor de figuras que NÃO precisa de Chrome real: roda no CI (glob scripts/content/*.test.mjs).
// O que precisa do Chrome (e a regeneração dos specs) fica em scripts/content/figuras/convert.test.mjs.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { chmodSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { gradientMap, ownDefs } from './figuras/convert.mjs';

const convertUrl = new URL('./figuras/convert.mjs', import.meta.url).href;
const grad = (id) => `<linearGradient id="${id}"><stop offset="0" stop-color="#000000"/></linearGradient>`;

test('gradientMap lê gradientes do defs e do corpo das camadas', () => {
  const m = gradientMap(`<defs>${grad('a')}</defs>`, [`<g>${grad('b')}</g>`]);
  assert.deepEqual(Object.keys(m).sort(), ['a', 'b']);
});

test('ownDefs devolve só os gradientes que o corpo usa e tira o <defs> dele', () => {
  const grads = gradientMap(`<defs>${grad('a')}${grad('b')}</defs>`, []);
  const usa = ownDefs('<defs><x/></defs><rect fill="url(#b)"/>', grads);
  assert.equal(usa.defs, `<defs>${grad('b')}</defs>`);
  assert.equal(usa.body, '<rect fill="url(#b)"/>');
  assert.equal(ownDefs('<rect fill="#ffffff"/>', grads).defs, '');
});

// Chrome falso: um script sh que imita o jeito de o Chrome falhar. Roda em subprocesso, porque
// CHROME_PATH e CHROME_TIMEOUT_MS são lidos quando o módulo carrega.
function comChromeFalso(script, env = {}) {
  const dir = mkdtempSync(path.join(tmpdir(), 'chrome-falso-'));
  try {
    const bin = path.join(dir, 'chrome');
    writeFileSync(bin, `#!/bin/sh\n${script}\n`);
    chmodSync(bin, 0o755);
    const code = `import('${convertUrl}').then(m => { try { m.convertSvg('<svg xmlns="http://www.w3.org/2000/svg"/>'); console.log('OK'); } catch (e) { console.log('ERRO ' + e.message); } });`;
    return execFileSync(process.execPath, ['-e', code], { env: { ...process.env, CHROME_PATH: bin, ...env }, encoding: 'utf8' }).trim();
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
const COMPLETO = `echo '<pre id="out">{"layers":[],"report":{"filters":[]}}</pre>'`;

test('status 2 com o resultado completo é aceito (caso conhecido do Chrome)', () => {
  assert.equal(comChromeFalso(`${COMPLETO}\nexit 2`), 'OK');
});

test('status 0 com o resultado completo é aceito', () => {
  assert.equal(comChromeFalso(`${COMPLETO}\nexit 0`), 'OK');
});

test('status 2 com resultado cortado é erro', () => {
  assert.match(comChromeFalso(`echo '<pre id="out">{"lay'\nexit 2`), /ERRO O Chrome falhou \(status 2/);
});

test('outro status, mesmo com resultado completo, é erro e traz o stderr', () => {
  const saida = comChromeFalso(`${COMPLETO}\necho quebrou-aqui >&2\nexit 1`);
  assert.match(saida, /ERRO O Chrome falhou \(status 1/);
  assert.match(saida, /quebrou-aqui/);
});

test('Chrome travado estoura o prazo com erro claro', () => {
  assert.match(comChromeFalso('sleep 5', { CHROME_TIMEOUT_MS: '300' }), /ERRO O Chrome passou de 0\.3 s/);
});
