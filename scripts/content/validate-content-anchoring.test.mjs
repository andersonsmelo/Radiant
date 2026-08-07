import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { anchoringErrors, main } from './validate-content-anchoring.mjs';

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

// A partir daqui, o runner. Os testes acima medem a funcao pura; estes medem o
// valor que o processo devolve, que e a unica superficie pela qual o gate do
// Loop decide. Uma funcao pura coberta nao cobre o invólucro que a chama.

function arvoreComAula({ manifesto: linhas, aula }) {
  const raiz = mkdtempSync(path.join(tmpdir(), 'ancoragem-'));
  mkdirSync(path.join(raiz, 'content-manifest', 'lessons'), { recursive: true });
  mkdirSync(path.join(raiz, 'content-manifest', 'excerpts'), { recursive: true });

  writeFileSync(
    path.join(raiz, 'content-manifest', 'excerpts', 'manifest.jsonl'),
    linhas.map((linha) => JSON.stringify(linha)).join('\n') + '\n',
    'utf8',
  );
  writeFileSync(
    path.join(raiz, 'content-manifest', 'lessons', 'piloto.anchored.json'),
    JSON.stringify(aula),
    'utf8',
  );
  return raiz;
}

test('MUTACAO: main devolve 1 quando nao ha aula ancorada nenhuma', () => {
  const raiz = mkdtempSync(path.join(tmpdir(), 'ancoragem-'));
  mkdirSync(path.join(raiz, 'content-manifest', 'lessons'), { recursive: true });
  mkdirSync(path.join(raiz, 'content-manifest', 'excerpts'), { recursive: true });
  writeFileSync(path.join(raiz, 'content-manifest', 'excerpts', 'manifest.jsonl'), '', 'utf8');
  assert.equal(main(raiz), 1);
});

test('MUTACAO: main devolve 0 quando toda claim de toda aula esta ancorada', () => {
  const raiz = arvoreComAula({
    manifesto: [{ id: 'excerpt:a:p1:c1', hash: 'h1', rightsClass: 'authorized' }],
    aula: { lessonId: 'ai-lesson:x', claims: [{ claim: 'x', excerptId: 'excerpt:a:p1:c1', hash: 'h1' }] },
  });
  assert.equal(main(raiz), 0);
});

test('MUTACAO: main devolve 1 quando o hash do excerto mudou desde a ancoragem', () => {
  const raiz = arvoreComAula({
    manifesto: [{ id: 'excerpt:a:p1:c1', hash: 'OUTRO', rightsClass: 'authorized' }],
    aula: { lessonId: 'ai-lesson:x', claims: [{ claim: 'x', excerptId: 'excerpt:a:p1:c1', hash: 'h1' }] },
  });
  assert.equal(main(raiz), 1);
});
