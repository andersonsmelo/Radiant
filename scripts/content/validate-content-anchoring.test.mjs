import assert from 'node:assert/strict';
import test from 'node:test';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { anchoringErrors, main } from './validate-content-anchoring.mjs';

const manifesto = [
  {
    id: 'excerpt:fundamentos:p12:c1',
    hash: 'abc',
    rightsClass: 'authorized',
    allowedUses: ['factual-reference', 'verbatim-excerpt'],
  },
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
  const restrito = [
    { id: 'excerpt:x:p1:c1', hash: 'abc', rightsClass: 'reference-only', allowedUses: [] },
  ];
  const aula = { claims: [{ excerptId: 'excerpt:x:p1:c1', hash: 'abc' }] };
  assert.match(anchoringErrors({ aula, manifesto: restrito })[0], /sem autorizacao de direitos/);
});

// `rightsClass` e `allowedUses` sao eixos independentes. Esta fonte passa na
// classe e ainda assim nao pode sustentar afirmacao: o direito que ela concede
// e outro. Inferir o segundo eixo do primeiro foi o defeito que este caso trava,
// e a mensagem precisa nomear o USO, nao a classe — senao o operador vai
// procurar o erro no lugar errado do catalogo.
test('MUTACAO: excerto de fonte que nao permite referencia factual reprova', () => {
  const soAdaptacao = [
    { id: 'excerpt:x:p1:c1', hash: 'abc', rightsClass: 'authorized', allowedUses: ['adaptation'] },
  ];
  const aula = { claims: [{ excerptId: 'excerpt:x:p1:c1', hash: 'abc' }] };
  assert.match(
    anchoringErrors({ aula, manifesto: soAdaptacao })[0],
    /nao permite uso como referencia factual/,
  );
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

// As duas linhas de manifesto abaixo carregam `allowedUses` de proposito. Sem
// ele, o caso do caminho feliz reprova e o caso do hash divergente passa a
// devolver 1 pela causa errada — um teste que casa so o codigo de saida nao
// distingue "reprovou pelo hash" de "reprovou por direitos".
const LINHA_PERMITIDA = {
  id: 'excerpt:a:p1:c1',
  hash: 'h1',
  rightsClass: 'authorized',
  allowedUses: ['factual-reference'],
};

test('MUTACAO: main devolve 0 quando toda claim de toda aula esta ancorada', () => {
  const raiz = arvoreComAula({
    manifesto: [LINHA_PERMITIDA],
    aula: { lessonId: 'ai-lesson:x', claims: [{ claim: 'x', excerptId: 'excerpt:a:p1:c1', hash: 'h1' }] },
  });
  assert.equal(main(raiz), 0);
});

// `process.argv[1]` e indefinido num contexto sem script de entrada, e sem a
// guarda `pathToFileURL` lanca no momento do import — o modulo fica impossivel
// de importar por qualquer ferramenta que nao seja `node arquivo.mjs`. Precisa
// de processo filho: dentro do `node --test` o argv[1] esta sempre preenchido,
// entao um caso in-process passaria verde com a guarda morta.
test('MUTACAO: o modulo pode ser importado por um contexto sem script de entrada', () => {
  const modulo = pathToFileURL(
    path.join(import.meta.dirname, 'validate-content-anchoring.mjs'),
  ).href;
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', `await import('${modulo}')`], {
    encoding: 'utf8',
  });
  assert.equal(r.status, 0, r.stderr);
});

test('MUTACAO: main devolve 1 quando o hash do excerto mudou desde a ancoragem', () => {
  const raiz = arvoreComAula({
    manifesto: [{ ...LINHA_PERMITIDA, hash: 'OUTRO' }],
    aula: { lessonId: 'ai-lesson:x', claims: [{ claim: 'x', excerptId: 'excerpt:a:p1:c1', hash: 'h1' }] },
  });
  assert.equal(main(raiz), 1);
});
