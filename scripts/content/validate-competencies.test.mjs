import test from 'node:test';
import assert from 'node:assert/strict';
import {
  loadCompetencyGraph,
  validateCompetencyGraph,
} from './validate-competencies.mjs';

const EVIDENCE = ['guided-practice', 'independent-recall'];

function competency(unitSlug, index, overrides = {}) {
  return {
    id: `competency:${unitSlug}:c${index}`,
    slug: `${unitSlug}-c${index}`,
    order: index,
    objective: `reconhecer o item ${index} da unidade ${unitSlug} em cenário aplicado`,
    criticalSafety: false,
    prerequisiteIds: [],
    evidenceMethods: [...EVIDENCE],
    ...overrides,
  };
}

function unit(index, overrides = {}) {
  const slug = `unidade-${index}`;
  return {
    id: `unit:${slug}`,
    slug,
    order: index,
    title: `Unidade ${index}`,
    competencies: [1, 2, 3, 4, 5].map((position) => competency(slug, position)),
    ...overrides,
  };
}

function graph(overrides = {}) {
  return {
    schemaVersion: 1,
    trackId: 'track:fundamentos-e-seguranca-radiologica',
    trackTitle: 'Fundamentos e Segurança Radiológica',
    version: 'test-graph-v1',
    criticalSafetyCriterion: 'Erro nesta competência tem consequência de segurança.',
    units: [1, 2, 3, 4, 5, 6].map((index) => unit(index)),
    ...overrides,
  };
}

function rulesFor(result, id) {
  return result.errors.filter((error) => error.path === id).map((error) => error.rule);
}

test('aceita um grafo íntegro de 6 unidades e 30 competências', () => {
  const result = validateCompetencyGraph(graph());

  assert.equal(result.ok, true, JSON.stringify(result.errors));
  assert.equal(result.summary.unitCount, 6);
  assert.equal(result.summary.competencyCount, 30);
  assert.equal(result.summary.cycleCount, 0);
});

test('exige exatamente seis unidades', () => {
  const result = validateCompetencyGraph(graph({ units: [unit(1), unit(2)] }));

  assert.equal(result.ok, false);
  assert.ok(rulesFor(result, 'graph').includes('invalid-unit-count'));
});

test('exige cinco competências por unidade', () => {
  const units = graph().units;
  units[2].competencies = units[2].competencies.slice(0, 4);

  const result = validateCompetencyGraph(graph({ units }));

  assert.equal(result.ok, false);
  assert.ok(rulesFor(result, 'unit:unidade-3').includes('invalid-competency-count'));
});

test('rejeita ids de competência duplicados entre unidades', () => {
  const units = graph().units;
  units[1].competencies[0].id = units[0].competencies[0].id;

  const result = validateCompetencyGraph(graph({ units }));

  assert.equal(result.ok, false);
  assert.ok(rulesFor(result, units[0].competencies[0].id).includes('duplicate-id'));
});

test('rejeita objetivo que não descreve comportamento observável', () => {
  const units = graph().units;
  units[0].competencies[0].objective = 'entender a formação da imagem radiográfica';

  const result = validateCompetencyGraph(graph({ units }));

  assert.equal(result.ok, false);
  assert.ok(rulesFor(result, units[0].competencies[0].id).includes('objective-not-observable'));
});

test('rejeita objetivo que não começa por um verbo de ação', () => {
  const units = graph().units;
  units[0].competencies[0].objective = 'o aluno deve identificar riscos na sala';

  const result = validateCompetencyGraph(graph({ units }));

  assert.equal(result.ok, false);
  assert.ok(rulesFor(result, units[0].competencies[0].id).includes('objective-not-observable'));
});

test('aceita objetivo composto em que o verbo é seguido de vírgula', () => {
  const units = graph().units;
  units[0].competencies[0].objective = 'registrar, comunicar e escalar incidentes pelo canal adequado';

  const result = validateCompetencyGraph(graph({ units }));

  assert.equal(result.ok, true, JSON.stringify(result.errors));
});

test('rejeita pré-requisito inexistente', () => {
  const units = graph().units;
  units[3].competencies[0].prerequisiteIds = ['competency:fantasma:c1'];

  const result = validateCompetencyGraph(graph({ units }));

  assert.equal(result.ok, false);
  assert.ok(rulesFor(result, units[3].competencies[0].id).includes('unknown-prerequisite'));
});

test('rejeita competência que é pré-requisito de si mesma', () => {
  const units = graph().units;
  const target = units[0].competencies[0];
  target.prerequisiteIds = [target.id];

  const result = validateCompetencyGraph(graph({ units }));

  assert.equal(result.ok, false);
  assert.ok(rulesFor(result, target.id).includes('self-prerequisite'));
});

test('detecta ciclo no grafo de pré-requisitos e o reporta', () => {
  const units = graph().units;
  const [first, second, third] = units[0].competencies;
  first.prerequisiteIds = [third.id];
  second.prerequisiteIds = [first.id];
  third.prerequisiteIds = [second.id];

  const result = validateCompetencyGraph(graph({ units }));

  assert.equal(result.ok, false);
  assert.ok(result.summary.cycleCount > 0);
  assert.ok(result.errors.some((error) => error.rule === 'prerequisite-cycle'));
});

test('exige criticalSafety explicitamente booleano', () => {
  const units = graph().units;
  delete units[5].competencies[4].criticalSafety;

  const result = validateCompetencyGraph(graph({ units }));

  assert.equal(result.ok, false);
  assert.ok(rulesFor(result, units[5].competencies[4].id).includes('missing-critical-safety'));
});

test('não aceita criticalSafety representado por string', () => {
  const units = graph().units;
  units[5].competencies[4].criticalSafety = 'true';

  const result = validateCompetencyGraph(graph({ units }));

  assert.equal(result.ok, false);
  assert.ok(rulesFor(result, units[5].competencies[4].id).includes('missing-critical-safety'));
});

test('exige ao menos um método de evidência por competência', () => {
  const units = graph().units;
  units[2].competencies[1].evidenceMethods = [];

  const result = validateCompetencyGraph(graph({ units }));

  assert.equal(result.ok, false);
  assert.ok(rulesFor(result, units[2].competencies[1].id).includes('missing-evidence-method'));
});

test('rejeita método de evidência fora do contrato', () => {
  const units = graph().units;
  units[2].competencies[1].evidenceMethods = ['achismo'];

  const result = validateCompetencyGraph(graph({ units }));

  assert.equal(result.ok, false);
  assert.ok(rulesFor(result, units[2].competencies[1].id).includes('invalid-evidence-method'));
});

test('o grafo versionado do repositório é válido e tem 30 competências sem ciclos', () => {
  const result = validateCompetencyGraph(loadCompetencyGraph());

  assert.equal(result.ok, true, JSON.stringify(result.errors, null, 2));
  assert.equal(result.summary.unitCount, 6);
  assert.equal(result.summary.competencyCount, 30);
  assert.equal(result.summary.cycleCount, 0);
});

test('o grafo versionado marca competências críticas de segurança na unidade de proteção', () => {
  const graphFromRepo = loadCompetencyGraph();
  const protectionUnit = graphFromRepo.units.at(-1);

  assert.equal(protectionUnit.slug, 'protecao-radiologica');
  assert.ok(protectionUnit.competencies.every((item) => item.criticalSafety === true));
});

test('toda competência do grafo versionado é alcançável a partir de uma raiz', () => {
  const result = validateCompetencyGraph(loadCompetencyGraph());

  assert.equal(result.summary.orphanCount, 0, JSON.stringify(result.errors));
  assert.ok(result.summary.rootCount >= 1);
});
