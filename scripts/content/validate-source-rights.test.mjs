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

// SONDA sobre o repositorio real. A versao anterior desta sonda afirmava que
// "vencida a excecao, o estado real precisa reprovar" — e com isso codificava a
// EXISTENCIA da divida como assercao: no dia em que a fonte foi reclassificada
// por decisao humana (2026-09-11) e a excecao perdeu o objeto, a sonda leu a
// resolucao como se fosse a remocao silenciosa que ela existia para pegar.
// Ela nao distinguia os dois casos porque olhava o estado, nao o invariante.
//
// O invariante e: o verde de hoje e sustentado por uma decisao registrada —
// classificacao explicita na triagem, ou excecao datada que morde ao vencer —
// e nunca por ausencia de checagem. Cada fonte usada cai num dos dois ramos.
test('SONDA — o verde do estado real e sustentado por decisao registrada, nao por ausencia', () => {
  const entrada = carregar(process.cwd());
  const hoje = avaliar({ ...entrada, agora: new Date('2026-09-11T12:00:00Z') });
  assert.deepEqual(hoje, [], 'hoje deve estar verde');
  assert.ok(entrada.usadas.size > 0, 'o catalogo precisa usar ao menos uma fonte');

  const excecoes = new Map((entrada.politica.exceptions ?? []).map((e) => [e.sourceId, e]));
  const classesQueLiberam = new Set(['authorized', 'reference-only']);

  for (const sourceId of entrada.usadas) {
    const declarada = entrada.declaradas.get(sourceId);
    const obra = entrada.triagem.get(normalizarCaminho(declarada.caminho));
    assert.ok(obra, `${sourceId} precisa de entrada na triagem`);

    if (obra.rightsClass === 'blocked') {
      // Ramo 1: divida viva. A excecao tem de existir E tem de morder ao vencer.
      assert.ok(excecoes.has(sourceId), `${sourceId} esta blocked e nao tem excecao`);
      const depois = avaliar({ ...entrada, agora: new Date('2999-01-01T12:00:00Z') });
      assert.ok(depois.some((v) => v.sourceId === sourceId && /venceu/.test(v.motivo)),
        `vencida a excecao de ${sourceId}, o estado real precisa reprovar`);
    } else {
      // Ramo 2: decisao humana. A classe tem de ser uma que libera de proposito,
      // com a base escrita — "desconhecida" ou vazio nao e decisao, e ausencia
      // de bloqueio nao e autorizacao.
      assert.ok(classesQueLiberam.has(obra.rightsClass),
        `${sourceId} tem classe \`${obra.rightsClass}\`, que nao e decisao explicita`);
      assert.ok(typeof obra.decisionBasis === 'string' && obra.decisionBasis.trim().length > 0,
        `${sourceId} foi liberada sem \`decisionBasis\``);
      // E o verde nao pode depender do relogio: sem excecao, o futuro e igual a hoje.
      const depois = avaliar({ ...entrada, agora: new Date('2999-01-01T12:00:00Z') });
      assert.ok(!depois.some((v) => v.sourceId === sourceId),
        `${sourceId} esta liberada por decisao e nao pode voltar a reprovar com o tempo`);
    }
  }

  // Excecao sem fonte bloqueada e divida fantasma: ninguem a le, ninguem a vence.
  for (const [sourceId] of excecoes) {
    const declarada = entrada.declaradas.get(sourceId);
    const obra = declarada && entrada.triagem.get(normalizarCaminho(declarada.caminho));
    assert.equal(obra?.rightsClass, 'blocked',
      `a excecao de ${sourceId} aponta para uma fonte que nao esta blocked — remova-a ou reclassifique`);
  }
});
