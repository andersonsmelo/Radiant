import assert from 'node:assert/strict';
import test from 'node:test';
import { convertSvg, findChrome, gradientMap, ownDefs } from './convert.mjs';

// O conversor precisa do Chrome (o CI não tem): sem ele os testes pulam, com a razão dita.
const skip = findChrome() ? false : 'Chrome não encontrado (defina CHROME_PATH): testes do conversor pulados';
const svg = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${inner}</svg>`;
const body = (r) => r.layers.map((l) => l.svg).join('');

test('classe CSS vira atributo de apresentação', { skip }, () => {
  const r = convertSvg(svg('<style>.a{fill:#ff0000;stroke:#00ff00;stroke-width:3}</style><rect class="a" width="10" height="10"/>'));
  assert.match(body(r), /fill="#ff0000"/);
  assert.match(body(r), /stroke="#00ff00"/);
  assert.doesNotMatch(body(r), /class=|<style/);
});

test('rgba() vira hex mais opacidade', { skip }, () => {
  const r = convertSvg(svg('<style>.a{fill:rgba(255,0,0,0.5)}</style><rect class="a" width="10" height="10"/>'));
  assert.match(body(r), /fill="#ff0000"/);
  assert.match(body(r), /fill-opacity="0.5"/);
  assert.doesNotMatch(body(r), /rgba?\(/);
});

test('regra com seletor de pai mantém a cor do filho (o defeito do piloto)', { skip }, () => {
  const r = convertSvg(svg('<style>.xray .edge{stroke:#112233;stroke-width:2}</style><g class="xray"><path class="edge" d="M0 0L10 10"/></g>'));
  assert.match(body(r), /stroke="#112233"/);
  assert.match(body(r), /stroke-width="2"/);
});

test('gradiente fica na camada que o usa, e só nela', { skip }, () => {
  const src = svg(
    '<defs><linearGradient id="gx"><stop offset="0" stop-color="#ff0000"/><stop offset="1" stop-color="#0000ff"/></linearGradient></defs>' +
      '<rect id="a" width="10" height="10" fill="#00ff00"/><rect id="b" width="10" height="10" fill="url(#gx)"/>',
  );
  const split = `(svg) => [{ name: 'a', nodes: [svg.querySelector('#a')] }, { name: 'b', nodes: [svg.querySelector('#b')] }]`;
  const r = convertSvg(src, { split });
  const grads = gradientMap(r.defs, r.layers.map((l) => l.svg));
  const [a, b] = r.layers.map((l) => ownDefs(l.svg, grads));
  assert.doesNotMatch(a.defs + a.body, /linearGradient/);
  assert.match(b.defs, /<linearGradient id="gx"/);
  assert.match(b.body, /url\(#gx\)/);
});

test('filter sai e o relatório lista a perda', { skip }, () => {
  const r = convertSvg(svg('<style>.s{filter:blur(9px)}</style><ellipse class="s" cx="5" cy="5" rx="4" ry="2" fill="#000000"/>'));
  assert.doesNotMatch(body(r), /filter/);
  assert.equal(r.report.filters.length, 1);
  assert.match(r.report.filters[0], /ellipse.*blur/);
});

test('sem Chrome o aviso diz o que fazer', { skip: skip ? false : 'Chrome presente: o teste vale só sem ele' }, () => {
  assert.throws(() => convertSvg(svg('')), /Chrome/);
});

test('os specs do piloto saem idênticos quando regenerados da fonte versionada', { skip }, async () => {
  const { readFileSync } = await import('node:fs');
  const { FIGURES, buildSpec } = await import('./build-spec.mjs');
  for (const id of Object.keys(FIGURES)) {
    const { file, text } = buildSpec(id);
    const committed = readFileSync(new URL(`../../../radiant-app/src/ui/diagrams/specs/${file}`, import.meta.url), 'utf8');
    assert.equal(text, committed, `${file} difere do que o script gera`);
  }
});
