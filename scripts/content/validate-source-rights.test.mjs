// Os dois sentidos, lado a lado. Um contrato que so foi visto passar nao prova
// nada: a versao anterior desta cadeia tinha uma garantia que era acidente de
// implementacao, e ninguem percebeu porque o verde parecia igual.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  avaliar, normalizarCaminho, coletarFontesUsadas,
  indexarTriagem, excecaoAtiva, carregar,
} from './validate-source-rights.mjs';

const AGORA = new Date('2026-08-24T12:00:00Z');
const declaradas = new Map([
  ['source:obra-a', { slug: 'obra-a', caminho: 'conteúdo/A.pdf' }],
  ['source:obra-b', { slug: 'obra-b', caminho: 'conteúdo/B.pdf' }],
]);
const triagem = indexarTriagem({
  sources: [
    { title: 'A', primaryPath: 'Conteúdo/A.pdf', rightsClass: 'blocked' },
    { title: 'B', primaryPath: 'conteúdo/B.pdf', rightsClass: 'authorized' },
  ],
});

test('fonte blocked sem excecao reprova', () => {
  const v = avaliar({ usadas: new Set(['source:obra-a']), declaradas, triagem, politica: { exceptions: [] }, agora: AGORA });
  assert.equal(v.length, 1);
  assert.match(v[0].motivo, /nao ha excecao registrada/);
});

test('fonte blocked com excecao ativa passa', () => {
  const politica = { exceptions: [{ sourceId: 'source:obra-a', expiresOn: '2026-09-30', owner: 'x', reason: 'y' }] };
  assert.deepEqual(avaliar({ usadas: new Set(['source:obra-a']), declaradas, triagem, politica, agora: AGORA }), []);
});

test('excecao vencida volta a reprovar sozinha', () => {
  const politica = { exceptions: [{ sourceId: 'source:obra-a', expiresOn: '2026-08-01', owner: 'x', reason: 'y' }] };
  const v = avaliar({ usadas: new Set(['source:obra-a']), declaradas, triagem, politica, agora: AGORA });
  assert.equal(v.length, 1);
  assert.match(v[0].motivo, /venceu em 2026-08-01/);
});

test('fonte authorized passa sem precisar de excecao', () => {
  assert.deepEqual(avaliar({ usadas: new Set(['source:obra-b']), declaradas, triagem, politica: { exceptions: [] }, agora: AGORA }), []);
});

test('fonte usada sem source.json reprova em vez de passar em silencio', () => {
  const v = avaliar({ usadas: new Set(['source:fantasma']), declaradas, triagem, politica: { exceptions: [] }, agora: AGORA });
  assert.match(v[0].motivo, /nao esta declarada/);
});

test('caixa e forma Unicode nao separam o mesmo caminho', () => {
  // NFD (disco do macOS) e NFC (indice do git) precisam colidir no mesmo indice.
  const nfd = 'Conteúdo/A.pdf';
  const nfc = 'conteúdo/A.pdf';
  assert.equal(normalizarCaminho(nfd), normalizarCaminho(nfc));
  assert.ok(triagem.get(normalizarCaminho(nfd)), 'a triagem deve ser alcancavel pela grafia do disco');
});

test('coletarFontesUsadas encontra sourceId em qualquer profundidade', () => {
  const achados = coletarFontesUsadas({ tracks: [{ units: [{ lessons: [{ sourceId: 'source:x' }] }] }] });
  assert.deepEqual([...achados], ['source:x']);
});

test('excecaoAtiva rejeita registro sem data', () => {
  assert.equal(excecaoAtiva({}, AGORA), false);
  assert.equal(excecaoAtiva({ expiresOn: 'nao-e-data' }, AGORA), false);
});

// SONDA sobre o repositorio real: com o relogio depois do vencimento, o estado
// de hoje TEM de reprovar. Se este teste passar, a excecao nao esta segurando
// nada e o contrato nao vale.
test('SONDA — o estado real reprova quando a excecao vence', () => {
  const entrada = carregar(process.cwd());
  const hoje = avaliar({ ...entrada, agora: new Date('2026-08-24T12:00:00Z') });
  assert.deepEqual(hoje, [], 'hoje deve estar verde, sustentado pela excecao');

  const depois = avaliar({ ...entrada, agora: new Date('2027-01-01T12:00:00Z') });
  assert.ok(depois.length > 0, 'vencida a excecao, o estado real precisa reprovar');
  assert.match(depois[0].motivo, /venceu/);
});
