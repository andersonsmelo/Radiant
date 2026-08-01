import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultRepoRoot = path.resolve(__dirname, '..', '..');
const GRAPH_RELATIVE_PATH = path.join('conteúdo', 'governança', 'foundations-safety-competencies.json');

const EXPECTED_UNIT_COUNT = 6;
const EXPECTED_COMPETENCIES_PER_UNIT = 5;

const GRAPH_FIELDS = new Set([
  'schemaVersion', 'trackId', 'trackTitle', 'version', 'criticalSafetyCriterion', 'units',
]);
const UNIT_FIELDS = new Set(['id', 'slug', 'order', 'title', 'competencies']);
const COMPETENCY_FIELDS = new Set([
  'id', 'slug', 'order', 'objective', 'criticalSafety', 'prerequisiteIds', 'evidenceMethods',
]);

const EVIDENCE_METHODS = new Set([
  'guided-practice',
  'independent-recall',
  'applied-transfer',
  'delayed-retention',
]);

const TRACK_ID_PATTERN = /^track:[a-z0-9][a-z0-9-]*$/;
const UNIT_ID_PATTERN = /^unit:[a-z0-9][a-z0-9-]*$/;
const COMPETENCY_ID_PATTERN = /^competency:[a-z0-9][a-z0-9-]*:[a-z0-9][a-z0-9-]*$/;
const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]*$/;

const MIN_OBJECTIVE_LENGTH = 20;
// O verbo pode ser seguido de espaço OU de vírgula: objetivos compostos como
// "registrar, comunicar e escalar incidentes" são legítimos e continuam
// observáveis. Exigir espaço reprovava a redação da própria spec.
const INFINITIVE_PATTERN = /^([a-záàâãéêíóôõúüç]+(?:ar|er|ir))(?=[\s,])/u;

/**
 * Verbos de estado interno. Um objetivo que começa por um destes não produz
 * evidência avaliável — não há como observar alguém "entendendo". Isto é uma
 * lista de recusa, e não uma lista de permissão, de propósito: uma permissão
 * teria de crescer a cada unidade nova e recusaria verbos legítimos por
 * omissão, enquanto o conjunto de verbos não observáveis é pequeno e estável.
 */
const NON_OBSERVABLE_VERBS = new Set([
  'entender', 'compreender', 'saber', 'conhecer', 'aprender', 'estudar',
  'perceber', 'assimilar', 'internalizar', 'familiarizar', 'apreciar',
  'dominar', 'ver', 'memorizar', 'absorver',
]);

function pushError(errors, itemPath, rule) {
  if (!errors.some((error) => error.path === itemPath && error.rule === rule)) {
    errors.push({ path: itemPath, rule });
  }
}

function hasOnlyFields(value, allowed) {
  return value && typeof value === 'object' && !Array.isArray(value)
    && Object.keys(value).every((key) => allowed.has(key));
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isObservableObjective(value) {
  if (typeof value !== 'string') {
    return false;
  }
  const match = INFINITIVE_PATTERN.exec(value.trim().toLowerCase());
  if (!match) {
    return false;
  }
  return !NON_OBSERVABLE_VERBS.has(match[1]);
}

/**
 * Percorre o grafo de pré-requisitos em profundidade e devolve os ciclos
 * encontrados, cada um como a lista de ids que o fecham. Uma competência que
 * participa de um ciclo é inalcançável a partir de qualquer raiz, então o
 * relatório de ciclos e o de órfãos se sustentam mutuamente.
 */
function findCycles(competenciesById) {
  const WHITE = 0;
  const GREY = 1;
  const BLACK = 2;
  const colors = new Map([...competenciesById.keys()].map((id) => [id, WHITE]));
  const stack = [];
  const cycles = [];
  const seenCycleKeys = new Set();

  function visit(id) {
    colors.set(id, GREY);
    stack.push(id);

    for (const prerequisiteId of competenciesById.get(id)?.prerequisiteIds ?? []) {
      if (!competenciesById.has(prerequisiteId)) {
        continue;
      }
      const color = colors.get(prerequisiteId);
      if (color === GREY) {
        const cycle = stack.slice(stack.indexOf(prerequisiteId));
        const key = [...cycle].sort().join('|');
        if (!seenCycleKeys.has(key)) {
          seenCycleKeys.add(key);
          cycles.push(cycle);
        }
      } else if (color === WHITE) {
        visit(prerequisiteId);
      }
    }

    stack.pop();
    colors.set(id, BLACK);
  }

  for (const id of competenciesById.keys()) {
    if (colors.get(id) === WHITE) {
      visit(id);
    }
  }

  return cycles;
}

/**
 * Alcançabilidade a partir das raízes, seguindo as arestas na direção do
 * estudo (pré-requisito → dependente). Órfão aqui não é "sem pré-requisito" —
 * isso é uma raiz legítima —, e sim uma competência que nenhuma rota de estudo
 * alcança.
 */
function findOrphans(competenciesById) {
  const dependentsByPrerequisite = new Map();
  const roots = [];

  for (const [id, competency] of competenciesById) {
    const prerequisiteIds = (competency.prerequisiteIds ?? [])
      .filter((prerequisiteId) => competenciesById.has(prerequisiteId));
    if (prerequisiteIds.length === 0) {
      roots.push(id);
    }
    for (const prerequisiteId of prerequisiteIds) {
      const dependents = dependentsByPrerequisite.get(prerequisiteId) ?? [];
      dependents.push(id);
      dependentsByPrerequisite.set(prerequisiteId, dependents);
    }
  }

  const reached = new Set(roots);
  const queue = [...roots];
  while (queue.length > 0) {
    const current = queue.shift();
    for (const dependent of dependentsByPrerequisite.get(current) ?? []) {
      if (!reached.has(dependent)) {
        reached.add(dependent);
        queue.push(dependent);
      }
    }
  }

  return {
    roots,
    orphans: [...competenciesById.keys()].filter((id) => !reached.has(id)),
  };
}

export function validateCompetencyGraph(graph) {
  const errors = [];
  const root = graph && typeof graph === 'object' && !Array.isArray(graph) ? graph : {};
  const units = Array.isArray(root.units) ? root.units : [];

  if (!hasOnlyFields(root, GRAPH_FIELDS)) {
    pushError(errors, 'graph', 'disallowed-field');
  }
  for (const field of GRAPH_FIELDS) {
    if (!Object.hasOwn(root, field)) {
      pushError(errors, 'graph', 'required-field');
    }
  }
  if (root.schemaVersion !== 1) {
    pushError(errors, 'graph', 'invalid-schema-version');
  }
  if (!TRACK_ID_PATTERN.test(root.trackId ?? '')) {
    pushError(errors, 'graph', 'invalid-track-id');
  }
  if (!isNonEmptyString(root.trackTitle) || !isNonEmptyString(root.version)) {
    pushError(errors, 'graph', 'invalid-track-metadata');
  }
  if (!isNonEmptyString(root.criticalSafetyCriterion)
    || root.criticalSafetyCriterion.trim().length < MIN_OBJECTIVE_LENGTH) {
    pushError(errors, 'graph', 'missing-critical-safety-criterion');
  }
  if (!Array.isArray(root.units)) {
    pushError(errors, 'graph', 'invalid-collection');
  }
  if (units.length !== EXPECTED_UNIT_COUNT) {
    pushError(errors, 'graph', 'invalid-unit-count');
  }

  const competenciesById = new Map();
  const seenUnitIds = new Set();
  const seenUnitSlugs = new Set();
  const seenCompetencySlugs = new Set();
  let criticalSafetyCount = 0;

  for (const [unitIndex, unit] of units.entries()) {
    const unitPath = UNIT_ID_PATTERN.test(unit?.id ?? '') ? unit.id : `units[${unitIndex}]`;
    const competencies = Array.isArray(unit?.competencies) ? unit.competencies : [];

    if (!hasOnlyFields(unit, UNIT_FIELDS)) {
      pushError(errors, unitPath, 'disallowed-field');
    }
    for (const field of UNIT_FIELDS) {
      if (!Object.hasOwn(unit ?? {}, field)) {
        pushError(errors, unitPath, 'required-field');
      }
    }
    if (!UNIT_ID_PATTERN.test(unit?.id ?? '')) {
      pushError(errors, unitPath, 'invalid-id');
    } else if (seenUnitIds.has(unit.id)) {
      pushError(errors, unitPath, 'duplicate-id');
    } else {
      seenUnitIds.add(unit.id);
    }
    if (!SLUG_PATTERN.test(unit?.slug ?? '')) {
      pushError(errors, unitPath, 'invalid-slug');
    } else if (seenUnitSlugs.has(unit.slug)) {
      pushError(errors, unitPath, 'duplicate-slug');
    } else {
      seenUnitSlugs.add(unit.slug);
    }
    if (!isNonEmptyString(unit?.title)) {
      pushError(errors, unitPath, 'invalid-title');
    }
    if (!Number.isInteger(unit?.order) || unit.order !== unitIndex + 1) {
      pushError(errors, unitPath, 'invalid-order');
    }
    if (!Array.isArray(unit?.competencies) || competencies.length !== EXPECTED_COMPETENCIES_PER_UNIT) {
      pushError(errors, unitPath, 'invalid-competency-count');
    }

    for (const [competencyIndex, competency] of competencies.entries()) {
      const competencyPath = COMPETENCY_ID_PATTERN.test(competency?.id ?? '')
        ? competency.id
        : `${unitPath}/competencies[${competencyIndex}]`;

      if (!hasOnlyFields(competency, COMPETENCY_FIELDS)) {
        pushError(errors, competencyPath, 'disallowed-field');
      }
      for (const field of COMPETENCY_FIELDS) {
        if (!Object.hasOwn(competency ?? {}, field)) {
          pushError(errors, competencyPath, 'required-field');
        }
      }
      if (!COMPETENCY_ID_PATTERN.test(competency?.id ?? '')) {
        pushError(errors, competencyPath, 'invalid-id');
      } else if (competenciesById.has(competency.id)) {
        pushError(errors, competencyPath, 'duplicate-id');
      } else {
        competenciesById.set(competency.id, competency);
      }
      if (!SLUG_PATTERN.test(competency?.slug ?? '')) {
        pushError(errors, competencyPath, 'invalid-slug');
      } else if (seenCompetencySlugs.has(competency.slug)) {
        pushError(errors, competencyPath, 'duplicate-slug');
      } else {
        seenCompetencySlugs.add(competency.slug);
      }
      if (!Number.isInteger(competency?.order) || competency.order !== competencyIndex + 1) {
        pushError(errors, competencyPath, 'invalid-order');
      }
      if (typeof competency?.objective !== 'string'
        || competency.objective.trim().length < MIN_OBJECTIVE_LENGTH) {
        pushError(errors, competencyPath, 'objective-too-short');
      } else if (!isObservableObjective(competency.objective)) {
        pushError(errors, competencyPath, 'objective-not-observable');
      }
      if (typeof competency?.criticalSafety !== 'boolean') {
        pushError(errors, competencyPath, 'missing-critical-safety');
      } else if (competency.criticalSafety) {
        criticalSafetyCount += 1;
      }
      if (!Array.isArray(competency?.prerequisiteIds)) {
        pushError(errors, competencyPath, 'invalid-prerequisites');
      } else if (new Set(competency.prerequisiteIds).size !== competency.prerequisiteIds.length) {
        pushError(errors, competencyPath, 'duplicate-prerequisite');
      }
      if (!Array.isArray(competency?.evidenceMethods) || competency.evidenceMethods.length === 0) {
        pushError(errors, competencyPath, 'missing-evidence-method');
      } else {
        if (new Set(competency.evidenceMethods).size !== competency.evidenceMethods.length) {
          pushError(errors, competencyPath, 'duplicate-evidence-method');
        }
        for (const method of competency.evidenceMethods) {
          if (!EVIDENCE_METHODS.has(method)) {
            pushError(errors, competencyPath, 'invalid-evidence-method');
          }
        }
      }
    }
  }

  // Só resolve referências depois de conhecer todas as competências: um
  // pré-requisito pode apontar para uma unidade posterior sem ser um erro,
  // porque a rota recomendada e a dependência conceitual são independentes.
  for (const [id, competency] of competenciesById) {
    for (const prerequisiteId of competency.prerequisiteIds ?? []) {
      if (prerequisiteId === id) {
        pushError(errors, id, 'self-prerequisite');
      } else if (!competenciesById.has(prerequisiteId)) {
        pushError(errors, id, 'unknown-prerequisite');
      }
    }
  }

  const cycles = findCycles(competenciesById);
  for (const cycle of cycles) {
    for (const id of cycle) {
      pushError(errors, id, 'prerequisite-cycle');
    }
  }

  const { roots, orphans } = findOrphans(competenciesById);
  for (const id of orphans) {
    pushError(errors, id, 'unreachable-competency');
  }

  return {
    ok: errors.length === 0,
    errors,
    summary: {
      trackId: root.trackId ?? null,
      version: root.version ?? null,
      unitCount: units.length,
      competencyCount: competenciesById.size,
      criticalSafetyCount,
      cycleCount: cycles.length,
      rootCount: roots.length,
      orphanCount: orphans.length,
    },
  };
}

export function loadCompetencyGraph({ repoRoot = defaultRepoRoot } = {}) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, GRAPH_RELATIVE_PATH), 'utf8'));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = validateCompetencyGraph(loadCompetencyGraph());
  const output = JSON.stringify(result, null, 2);
  if (!result.ok) {
    console.error(output);
    process.exit(1);
  }
  console.log(output);
}
