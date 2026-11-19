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

test('strokeScale multiplica o traço de non-scaling-stroke', { skip }, () => {
  const src = svg('<style>.a{vector-effect:non-scaling-stroke;stroke:#000000;stroke-width:3}</style><path class="a" d="M0 0L10 10"/>');
  assert.match(body(convertSvg(src, { strokeScale: 2 })), /stroke-width="6"/);
  assert.match(body(convertSvg(src)), /stroke-width="3"/);
  assert.doesNotMatch(body(convertSvg(src, { strokeScale: 2 })), /vector-effect/);
});

test('variável CSS vira cor resolvida', { skip }, () => {
  const r = convertSvg(svg('<style>:root{--c:#123456}.a{fill:var(--c)}</style><rect class="a" width="10" height="10"/>'));
  assert.match(body(r), /fill="#123456"/);
  assert.doesNotMatch(body(r), /var\(/);
});

test('transform em CSS vira o atributo matrix', { skip }, () => {
  const r = convertSvg(svg('<style>.a{transform:translate(10px,20px)}</style><rect class="a" width="10" height="10"/>'));
  assert.match(body(r), /transform="matrix\(1 0 0 1 10 20\)"/);
});

test('stop-color vindo de regra CSS vai para o atributo do stop', { skip }, () => {
  const src = svg('<style>#g stop{stop-color:#abcdef}</style><defs><linearGradient id="g"><stop offset="0"/><stop offset="1"/></linearGradient></defs><rect width="10" height="10" fill="url(#g)"/>');
  const r = convertSvg(src);
  assert.equal(body(r).match(/stop-color="#abcdef"/g)?.length, 2);
  assert.doesNotMatch(body(r), /<style/);
});

test('@keyframes é neutralizado: vale o estado parado, não o primeiro quadro', { skip }, () => {
  const r = convertSvg(svg('<style>.a{fill:#00ff00;animation:k 1s infinite}@keyframes k{from{fill:#ff0000}to{fill:#0000ff}}</style><rect class="a" width="10" height="10"/>'));
  assert.match(body(r), /fill="#00ff00"/);
  assert.doesNotMatch(body(r), /animation|keyframes|#ff0000/);
});

test('display:none sai do resultado', { skip }, () => {
  const r = convertSvg(svg('<style>.h{display:none}</style><rect class="h" width="10" height="10" fill="#aa0000"/><rect width="5" height="5" fill="#ff00ff"/>'));
  assert.doesNotMatch(body(r), /#aa0000/);
  assert.match(body(r), /#ff00ff/);
});

test('comentário e prólogo XML não chegam ao resultado', { skip }, () => {
  const r = convertSvg('<?xml version="1.0"?>' + svg('<!-- SEGREDO --><rect width="10" height="10" fill="#010203"/>'));
  assert.doesNotMatch(body(r), /SEGREDO|<!--/);
  assert.match(body(r), /#010203/);
});

test('dropBackground tira o rect de fundo da raiz, e só com a opção', { skip }, () => {
  const src = svg('<rect width="100" height="100" fill="#161a22"/><circle cx="5" cy="5" r="4" fill="#ffffff"/>');
  assert.doesNotMatch(body(convertSvg(src, { dropBackground: true })), /#161a22/);
  assert.match(body(convertSvg(src)), /#161a22/);
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
