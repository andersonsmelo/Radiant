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

import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { loadInputs, main } from './validate-taxonomy-map.mjs';

function arvoreDeFixture({ map, galaxias, planetas, estrelas, tracks }) {
  const raiz = mkdtempSync(path.join(tmpdir(), 'taxonomia-'));
  mkdirSync(path.join(raiz, 'content-manifest'), { recursive: true });
  mkdirSync(path.join(raiz, 'Conteúdo', 'taxonomia'), { recursive: true });
  mkdirSync(path.join(raiz, 'Conteúdo', 'governança'), { recursive: true });

  const escrever = (relativo, valor) =>
    writeFileSync(path.join(raiz, relativo), JSON.stringify(valor), 'utf8');

  escrever(path.join('content-manifest', 'taxonomy-catalog-map.json'), map);
  escrever(path.join('Conteúdo', 'taxonomia', 'galaxias.json'), galaxias);
  escrever(path.join('Conteúdo', 'taxonomia', 'planetas.json'), planetas);
  escrever(path.join('Conteúdo', 'taxonomia', 'estrelas.json'), estrelas);
  escrever(path.join('Conteúdo', 'governança', 'wave-1-priority-tracks.json'), { version: 1, tracks });
  return raiz;
}

const FIXTURE_VALIDA = {
  map: [{ taxonomyId: 'star-torax', catalogId: 'ai-lesson:qualidade-de-imagem', rationale: 'x' }],
  galaxias: [{ id: 'galaxy-anatomia' }],
  planetas: [{ id: 'planet-torax' }],
  estrelas: [{ id: 'star-torax' }],
  tracks: [{ id: 'track-a', lessonIds: ['ai-lesson:qualidade-de-imagem', 'lesson-1'] }],
};

test('loadInputs une os tres arquivos de taxonomia num so conjunto', () => {
  const { taxonomyIds } = loadInputs(arvoreDeFixture(FIXTURE_VALIDA));
  assert.deepEqual([...taxonomyIds].sort(), ['galaxy-anatomia', 'planet-torax', 'star-torax']);
});

test('loadInputs colhe catalogIds da uniao de lessonIds, com e sem prefixo', () => {
  const { catalogIds } = loadInputs(arvoreDeFixture(FIXTURE_VALIDA));
  assert.equal(catalogIds.has('ai-lesson:qualidade-de-imagem'), true);
  assert.equal(catalogIds.has('lesson-1'), true);
});

test('MUTACAO: main devolve 0 quando o mapa fecha', () => {
  assert.equal(main(arvoreDeFixture(FIXTURE_VALIDA)), 0);
});

test('MUTACAO: main devolve 1 quando o mapa aponta para taxonomia inexistente', () => {
  const raiz = arvoreDeFixture({
    ...FIXTURE_VALIDA,
    map: [{ taxonomyId: 'star-fantasma', catalogId: 'ai-lesson:qualidade-de-imagem', rationale: 'x' }],
  });
  assert.equal(main(raiz), 1);
});

// ════════════════════════════════════════════════════════════════════════
// Dado real — o eixo técnico da taxonomia
// Os testes acima usam fixture; os daqui para baixo leem os arquivos do
// repositório. Fixture prova que a função funciona; dado real prova que o
// currículo está montado.
// ════════════════════════════════════════════════════════════════════════

import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

function lerReal(...partes) {
  return JSON.parse(readFileSync(path.join(RAIZ, ...partes), 'utf8'));
}

// A galáxia de destino de cada planeta do eixo técnico. Escrito à mão porque é
// a decisão de currículo, não uma derivação: `galaxy-fisica` recebe dois e
// `galaxy-tecnologia` recebe quatro.
const PLANETAS_DO_EIXO_TECNICO = {
  'planet-fisica-da-radiacao': 'galaxy-fisica',
  'planet-producao-e-protecao': 'galaxy-fisica',
  'planet-equipamento': 'galaxy-tecnologia',
  'planet-modalidades': 'galaxy-tecnologia',
  'planet-imagem-na-pratica': 'galaxy-tecnologia',
  'planet-profissao-e-aplicacoes': 'galaxy-tecnologia',
};

test('galaxy-tecnologia existe, ativa, com o titulo que o app ja reservou', () => {
  const galaxias = lerReal('Conteúdo', 'taxonomia', 'galaxias.json');
  const tecnologia = galaxias.find((g) => g.id === 'galaxy-tecnologia');
  assert.ok(tecnologia, 'galaxy-tecnologia ausente de galaxias.json');
  assert.equal(tecnologia.status, 'active');
  // O titulo nao e livre: galaxy-catalog.ts:204 ja embarca este id com este
  // titulo, travado e vazio. Divergir aqui recria a divergencia que a decisao
  // do dono resolveu de graca.
  assert.equal(tecnologia.title, 'Tecnologia em Imagem');
});

test('os seis planetas do eixo tecnico existem, ativos, na galaxia certa', () => {
  const planetas = lerReal('Conteúdo', 'taxonomia', 'planetas.json');
  const porId = new Map(planetas.map((p) => [p.id, p]));

  for (const [planetaId, galaxiaId] of Object.entries(PLANETAS_DO_EIXO_TECNICO)) {
    const planeta = porId.get(planetaId);
    assert.ok(planeta, `planeta ausente de planetas.json: ${planetaId}`);
    assert.equal(planeta.galaxyId, galaxiaId, `${planetaId} na galaxia errada`);
    // Nasce 'active' porque as licoes existem e embarcam hoje. Os dois planetas
    // de interpretacao seguem 'planned' e sao a contraprova viva desta regra.
    assert.equal(planeta.status, 'active', `${planetaId} deveria nascer active`);
    assert.equal(planeta.trackKind, 'long-form');
  }
});

test('os planetas de interpretacao seguem planned, intocados', () => {
  const planetas = lerReal('Conteúdo', 'taxonomia', 'planetas.json');
  const porId = new Map(planetas.map((p) => [p.id, p]));
  for (const id of ['planet-formacao-imagem', 'planet-radiopacidade']) {
    assert.equal(porId.get(id)?.status, 'planned', `${id} nao devia ter mudado`);
  }
});

test('toda galaxyId de planeta resolve numa galaxia existente', () => {
  const galaxias = lerReal('Conteúdo', 'taxonomia', 'galaxias.json');
  const planetas = lerReal('Conteúdo', 'taxonomia', 'planetas.json');
  const idsDeGalaxia = new Set(galaxias.map((g) => g.id));
  for (const planeta of planetas) {
    assert.ok(
      idsDeGalaxia.has(planeta.galaxyId),
      `${planeta.id} aponta para galaxia inexistente ${planeta.galaxyId}`,
    );
  }
});

test('slugs de galaxia e de planeta seguem unicos dentro do proprio arquivo', () => {
  const galaxias = lerReal('Conteúdo', 'taxonomia', 'galaxias.json');
  const planetas = lerReal('Conteúdo', 'taxonomia', 'planetas.json');
  const slugsDeGalaxia = galaxias.map((g) => g.slug);
  const slugsDePlaneta = planetas.map((p) => p.slug);
  assert.equal(new Set(slugsDeGalaxia).size, slugsDeGalaxia.length);
  assert.equal(new Set(slugsDePlaneta).size, slugsDePlaneta.length);
});
