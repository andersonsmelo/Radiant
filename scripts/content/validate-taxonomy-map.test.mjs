import assert from 'node:assert/strict';
import test from 'node:test';
import { mapErrors } from './validate-taxonomy-map.mjs';

const base = {
  map: [{ taxonomyId: 'estrela:raios-x', catalogId: 'ai-lesson:producao-dos-raios-x' }],
  taxonomyIds: new Set(['estrela:raios-x']),
  catalogIds: new Set(['ai-lesson:producao-dos-raios-x']),
};

test('mapa integro nao acusa erro', () => {
  assert.deepEqual(mapErrors(base), []);
});

test('acusa taxonomia inexistente', () => {
  const erros = mapErrors({ ...base, taxonomyIds: new Set() });
  assert.equal(erros.length, 1);
  assert.match(erros[0], /estrela:raios-x/);
});

test('acusa no de catalogo sem entrada no mapa', () => {
  const erros = mapErrors({
    ...base,
    catalogIds: new Set(['ai-lesson:producao-dos-raios-x', 'ai-lesson:orfao']),
  });
  assert.equal(erros.length, 1);
  assert.match(erros[0], /ai-lesson:orfao/);
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
  assert.match(erros[0], /ai-lesson:fantasma/);
});
