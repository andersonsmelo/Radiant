import assert from 'node:assert/strict';
import test from 'node:test';
import { mapErrors } from './validate-taxonomy-map.mjs';

// Os ids seguem a convencao real das duas fontes: taxonomia usa a forma nua
// `star-<slug>`, exatamente como o campo `id` de `Conteúdo/taxonomia/estrelas.json`
// (`star-coluna`, `star-dose-radiacao`), e nao a forma `estrela:<slug>` que estas
// fixtures usavam antes. Os conjuntos sao injetados, entao nada forcava a
// convencao — o primeiro a preencher um `taxonomyId` de verdade colheria
// "mapa aponta para taxonomia inexistente".
//
// O par abaixo e fixture, nao decisao de curriculo: no mapa real toda entrada
// segue com `taxonomyId: null`.
const base = {
  map: [{ taxonomyId: 'star-artefatos-basicos', catalogId: 'ai-lesson:producao-dos-raios-x' }],
  taxonomyIds: new Set(['star-artefatos-basicos']),
  catalogIds: new Set(['ai-lesson:producao-dos-raios-x']),
};

test('mapa integro nao acusa erro', () => {
  assert.deepEqual(mapErrors(base), []);
});

test('acusa taxonomia inexistente', () => {
  const erros = mapErrors({ ...base, taxonomyIds: new Set() });
  assert.equal(erros.length, 1);
  assert.match(erros[0], /taxonomia inexistente: star-artefatos-basicos/);
});

test('acusa no de catalogo sem entrada no mapa', () => {
  const erros = mapErrors({
    ...base,
    catalogIds: new Set(['ai-lesson:producao-dos-raios-x', 'ai-lesson:orfao']),
  });
  assert.equal(erros.length, 1);
  assert.match(erros[0], /catalogo sem entrada no mapa: ai-lesson:orfao/);
});

test('entrada sem taxonomia ainda nao decidida nao e erro', () => {
  const erros = mapErrors({
    map: [{ taxonomyId: null, catalogId: 'ai-lesson:producao-dos-raios-x' }],
    taxonomyIds: new Set(),
    catalogIds: new Set(['ai-lesson:producao-dos-raios-x']),
  });
  assert.deepEqual(erros, []);
});

test('acusa catalogo inexistente mesmo com taxonomyId null', () => {
  const erros = mapErrors({
    map: [{ taxonomyId: null, catalogId: 'ai-lesson:fantasma' }],
    taxonomyIds: new Set(),
    catalogIds: new Set(),
  });
  assert.equal(erros.length, 1);
  assert.match(erros[0], /catalogo inexistente: ai-lesson:fantasma/);
});
