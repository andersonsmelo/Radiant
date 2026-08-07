import assert from 'node:assert/strict';
import test from 'node:test';
import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  chavesForaDoContrato,
  excertosCopiadosPorHash,
  claimsCopiadasDaFonte,
  main,
} from './validate-no-verbatim.mjs';

const sha = (texto) => createHash('sha256').update(texto, 'utf8').digest('hex');

const TEXTO_DA_FONTE =
  'A resolução espacial de um sistema de imagem é a menor distância entre dois objetos que ainda podem ser distinguidos.';

const LINHA_OK = {
  id: 'excerpt:a:p1:c1',
  sourceSlug: 'a',
  pageStart: 1,
  pageEnd: 1,
  hash: sha(TEXTO_DA_FONTE),
  rightsClass: 'authorized',
  allowedUses: ['factual-reference'],
};

// ---------------------------------------------------------------------------
// 1. Contrato de chaves. É a garantia que vale sem material bruto na máquina.
// ---------------------------------------------------------------------------

test('linha de manifesto com as chaves do contrato passa', () => {
  assert.deepEqual(chavesForaDoContrato({ manifesto: [LINHA_OK], aulas: [] }), []);
});

test('MUTACAO: chave a mais na linha de manifesto reprova, e a mensagem nomeia a chave', () => {
  const vazando = [{ ...LINHA_OK, text: TEXTO_DA_FONTE }];
  const erros = chavesForaDoContrato({ manifesto: vazando, aulas: [] });
  assert.match(erros[0], /text/);
});

test('MUTACAO: chave a mais numa claim ancorada reprova', () => {
  const aula = {
    nome: 'piloto.anchored.json',
    dados: {
      lessonId: 'ai-lesson:x',
      unanchored: 0,
      claims: [
        { claim: 'x', excerptId: 'excerpt:a:p1:c1', hash: 'h1', excerpto: TEXTO_DA_FONTE },
      ],
    },
  };
  const erros = chavesForaDoContrato({ manifesto: [], aulas: [aula] });
  assert.match(erros[0], /excerpto/);
});

// ---------------------------------------------------------------------------
// 2. Coincidência de hash. Pega a cópia integral SEM precisar do material bruto:
//    o manifesto ja carrega o sha256 de cada excerto, entao qualquer string
//    rastreada cujo hash bata com um deles E o excerto, com outro nome de campo.
// ---------------------------------------------------------------------------

test('MUTACAO: string rastreada cujo hash bate com um excerto reprova', () => {
  const aula = {
    nome: 'piloto.anchored.json',
    dados: { lessonId: 'ai-lesson:x', claims: [{ claim: TEXTO_DA_FONTE, excerptId: 'excerpt:a:p1:c1', hash: LINHA_OK.hash }] },
  };
  const erros = excertosCopiadosPorHash({ manifesto: [LINHA_OK], aulas: [aula] });
  assert.match(erros[0], /excerpt:a:p1:c1/);
});

test('claim escrita a mao, que nao e copia, passa', () => {
  const aula = {
    nome: 'piloto.anchored.json',
    dados: {
      lessonId: 'ai-lesson:x',
      claims: [{ claim: 'A resolucao espacial esta entre os requisitos de qualidade.', excerptId: 'excerpt:a:p1:c1', hash: LINHA_OK.hash }],
    },
  };
  assert.deepEqual(excertosCopiadosPorHash({ manifesto: [LINHA_OK], aulas: [aula] }), []);
});

// ---------------------------------------------------------------------------
// 3. Substring contra o material bruto. So roda onde as extracoes existem, e
//    pega o que o hash nao pega: a copia PARCIAL — uma frase do original
//    transplantada para dentro de uma claim.
// ---------------------------------------------------------------------------

test('MUTACAO: claim que e trecho literal do excerto reprova', () => {
  const aula = {
    nome: 'piloto.anchored.json',
    dados: { lessonId: 'ai-lesson:x', claims: [{ claim: 'a menor distância entre dois objetos que ainda podem ser distinguidos', excerptId: 'excerpt:a:p1:c1', hash: LINHA_OK.hash }] },
  };
  const erros = claimsCopiadasDaFonte({ aulas: [aula], textos: [TEXTO_DA_FONTE] });
  assert.match(erros[0], /trecho literal/);
});

test('claim que reformula o mesmo fato passa', () => {
  const aula = {
    nome: 'piloto.anchored.json',
    dados: { lessonId: 'ai-lesson:x', claims: [{ claim: 'Dois objetos proximos so se distinguem acima de certa distancia.', excerptId: 'excerpt:a:p1:c1', hash: LINHA_OK.hash }] },
  };
  assert.deepEqual(claimsCopiadasDaFonte({ aulas: [aula], textos: [TEXTO_DA_FONTE] }), []);
});

// ---------------------------------------------------------------------------
// 4. O runner.
// ---------------------------------------------------------------------------

function arvore({ manifesto, aula }) {
  const raiz = mkdtempSync(path.join(tmpdir(), 'verbatim-'));
  mkdirSync(path.join(raiz, 'content-manifest', 'lessons'), { recursive: true });
  mkdirSync(path.join(raiz, 'content-manifest', 'excerpts'), { recursive: true });
  writeFileSync(
    path.join(raiz, 'content-manifest', 'excerpts', 'manifest.jsonl'),
    manifesto.map((l) => JSON.stringify(l)).join('\n') + '\n',
    'utf8',
  );
  writeFileSync(
    path.join(raiz, 'content-manifest', 'lessons', 'piloto.anchored.json'),
    JSON.stringify(aula),
    'utf8',
  );
  return raiz;
}

test('MUTACAO: main devolve 0 quando nenhum artefato carrega texto de fonte', () => {
  const raiz = arvore({
    manifesto: [LINHA_OK],
    aula: { lessonId: 'ai-lesson:x', claims: [{ claim: 'Afirmacao propria.', excerptId: 'excerpt:a:p1:c1', hash: LINHA_OK.hash }] },
  });
  assert.equal(main(raiz), 0);
});

test('MUTACAO: main devolve 1 quando um artefato carrega texto de fonte', () => {
  const raiz = arvore({
    manifesto: [LINHA_OK],
    aula: { lessonId: 'ai-lesson:x', claims: [{ claim: TEXTO_DA_FONTE, excerptId: 'excerpt:a:p1:c1', hash: LINHA_OK.hash }] },
  });
  assert.equal(main(raiz), 1);
});
