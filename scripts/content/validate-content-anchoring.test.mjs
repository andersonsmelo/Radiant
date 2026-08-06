import assert from 'node:assert/strict';
import test from 'node:test';
import { anchoringErrors } from './validate-content-anchoring.mjs';

const manifesto = [
  { id: 'excerpt:fundamentos:p12:c1', hash: 'abc', rightsClass: 'authorized' },
];

test('aula com toda afirmacao ancorada passa', () => {
  const aula = { claims: [{ excerptId: 'excerpt:fundamentos:p12:c1', hash: 'abc' }] };
  assert.deepEqual(anchoringErrors({ aula, manifesto }), []);
});

test('MUTACAO: afirmacao sem excerto reprova', () => {
  const aula = { claims: [{ excerptId: null, hash: null }] };
  assert.equal(anchoringErrors({ aula, manifesto }).length, 1);
});

test('MUTACAO: hash divergente reprova', () => {
  const aula = { claims: [{ excerptId: 'excerpt:fundamentos:p12:c1', hash: 'zzz' }] };
  assert.match(anchoringErrors({ aula, manifesto })[0], /hash/);
});

test('MUTACAO: excerto nao autorizado reprova', () => {
  const restrito = [{ id: 'excerpt:x:p1:c1', hash: 'abc', rightsClass: 'reference-only' }];
  const aula = { claims: [{ excerptId: 'excerpt:x:p1:c1', hash: 'abc' }] };
  assert.match(anchoringErrors({ aula, manifesto: restrito })[0], /autoriza/);
});
