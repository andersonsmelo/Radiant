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

// Cada teste abaixo casa a **mensagem**, nunca a contagem. Contar erro nao prova
// guarda: com `if (!claim.excerptId)` neutralizado, a afirmacao sem excerto cai
// em `porId.get(null)` -> `undefined` -> o ramo `!linha`, que empurra
// "excerto fora do manifesto: null". Ainda ha exatamente um erro, entao
// `assert.equal(erros.length, 1)` continua verde com a guarda morta — foi o
// defeito que a revisao final de branch encontrou em 2026-08-06.
test('MUTACAO: afirmacao sem excerto reprova', () => {
  const aula = { claims: [{ excerptId: null, hash: null }] };
  assert.match(anchoringErrors({ aula, manifesto })[0], /afirmacao sem excerto/);
});

test('MUTACAO: hash divergente reprova', () => {
  const aula = { claims: [{ excerptId: 'excerpt:fundamentos:p12:c1', hash: 'zzz' }] };
  assert.match(anchoringErrors({ aula, manifesto })[0], /hash divergente/);
});

test('MUTACAO: excerto nao autorizado reprova', () => {
  const restrito = [{ id: 'excerpt:x:p1:c1', hash: 'abc', rightsClass: 'reference-only' }];
  const aula = { claims: [{ excerptId: 'excerpt:x:p1:c1', hash: 'abc' }] };
  assert.match(anchoringErrors({ aula, manifesto: restrito })[0], /sem autorizacao de direitos/);
});

test('MUTACAO: excerto fora do manifesto reprova', () => {
  const aula = { claims: [{ excerptId: 'excerpt:fantasma:p1:c1', hash: 'abc' }] };
  assert.match(anchoringErrors({ aula, manifesto })[0], /excerto fora do manifesto/);
});
