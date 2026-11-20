// node --test scripts/content/figuras/cenas/cenas.test.mjs  (Node 20, Chrome e o kit da skill `anatomy` instalados)
// Cada cena regenera, byte a byte, a fonte versionada em fontes/<id>.svg e passa nas réguas da arte importada do app.
// O CI não roda esta pasta (o glob é scripts/content/*.test.mjs): sem Chrome ou sem o kit da skill, os testes pulam com a razão dita.
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import test from 'node:test';
import { findChrome } from '../convert.mjs';

export const CENAS = ['tubo-raios-x', 'tubo-emitindo', 'anodo-giratorio', 'conferencia-de-identidade', 'pontos-de-contato-da-sala', 'itens-de-emergencia-da-sala'];
const KIT_DA_SKILL = `${homedir()}/.agents/skills/anatomy/kit/iso-kit.mjs`;
// O kit (kit/base.mjs e kit/paleta.mjs) importa a geometria da skill `anatomy` por caminho absoluto.
const skip = !findChrome() ? 'Chrome não encontrado (defina CHROME_PATH): cenas puladas' : !existsSync(KIT_DA_SKILL) ? `kit da skill anatomy ausente (${KIT_DA_SKILL}): cenas puladas` : false;

const PROIBIDO_TAG = /<(text|image|script|foreignObject|style|filter|mask|clipPath|use|pattern)\b|href/i;
const PROIBIDO_ATTR = /\s(class|style|filter|mask|clip-path|vector-effect)=|var\(|@keyframes|='/;
/** As réguas de diagramRegistry.test.ts para arte importada, mais o quadro 640 x 480 das cenas e o teto de 240 KiB. */
export const reguas = (svg) => [
  PROIBIDO_TAG.test(svg) && 'tag proibida',
  PROIBIDO_ATTR.test(svg) && 'atributo proibido',
  Buffer.byteLength(svg) > 240 * 1024 && 'acima de 240 KiB',
  !/<path\b/.test(svg) && 'sem caminho',
  !/^<svg [^>]*viewBox="0 0 640 480"/.test(svg) && 'quadro diferente de 640 x 480',
].filter(Boolean);
/** Toda cor de fill, stroke e stop-color é hexadecimal registrado na paleta do kit, none ou url(#id). */
export const coresForaDaPaleta = (svg, registrados) => [...svg.matchAll(/\b(?:fill|stroke|stop-color)="([^"]+)"/g)].map((m) => m[1])
  .filter((c) => c !== 'none' && !/^url\(#\w+\)$/.test(c) && !registrados.has(c.toUpperCase()));

test('as réguas e a paleta pegam o defeito que nomeiam (vistas falhando)', () => {
  assert.deepEqual(coresForaDaPaleta('<path fill="#123456" stroke="#E6E8EE"/>', new Set(['#E6E8EE'])), ['#123456']);
  assert.deepEqual(coresForaDaPaleta('<path fill="red"/>', new Set()), ['red']);
  assert.ok(reguas('<svg viewBox="0 0 640 480"><style>.a{}</style><path d="M0 0"/></svg>').includes('tag proibida'));
  assert.ok(reguas('<svg viewBox="0 0 640 480"><path class="a" d="M0 0"/></svg>').includes('atributo proibido'));
  assert.ok(reguas('<svg viewBox="0 0 320 240"><path d="M0 0"/></svg>').includes('quadro diferente de 640 x 480'));
});

for (const id of CENAS) {
  test(`${id}: regenera a fonte versionada byte a byte e passa nas réguas`, { skip }, async () => {
    const { gerar, FONTE } = await import(`./${id}.mjs`);
    const { HEX_REGISTRADOS } = await import('../kit/paleta.mjs');
    const svg = gerar();
    assert.equal(svg, readFileSync(FONTE, 'utf8'), `fontes/${id}.svg difere do que a cena gera: rode node scripts/content/figuras/cenas/${id}.mjs e revise`);
    assert.deepEqual(reguas(svg), []);
    assert.deepEqual(coresForaDaPaleta(svg, HEX_REGISTRADOS), []);
  });
}
