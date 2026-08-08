/**
 * sync-catalog-to-app.mjs
 *
 * Reads conteúdo/governança/catalog-payload.json and generates:
 *   radiant-app/src/data/ai-lessons.ts  — QuizLesson[] from quizzes track
 *   radiant-app/src/data/ai-catalog.ts  — LessonCatalogManifest fragment
 *   radiant-app/src/data/catalog.ts     — Wave 1 local catalog slice
 *
 * Run: node scripts/content/sync-catalog-to-app.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { buildRuntimeCatalog } from "./catalog-runtime.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const CATALOG_PAYLOAD_PATH = path.join(
  ROOT,
  "conteúdo/governança/catalog-payload.json"
);
const WAVE1_PRIORITY_TRACKS_PATH = path.join(
  ROOT,
  "conteúdo/governança/wave-1-priority-tracks.json"
);
const AI_LESSONS_PATH = path.join(ROOT, "radiant-app/src/data/ai-lessons.ts");
const AI_CATALOG_PATH = path.join(ROOT, "radiant-app/src/data/ai-catalog.ts");
const APP_CATALOG_PATH = path.join(ROOT, "radiant-app/src/data/catalog.ts");
const TAXONOMY_MAP_PATH = path.join(
  ROOT,
  "content-manifest/taxonomy-catalog-map.json"
);
const PLANETS_PATH = path.join(ROOT, "Conteúdo/taxonomia/planetas.json");
const GALAXY_NODES_PATH = path.join(
  ROOT,
  "radiant-app/src/data/galaxy-nodes.ts"
);

function renderAiLessons(lessons) {
  const json = JSON.stringify(lessons, null, 2);
  return `// AUTO-GENERATED — do not edit by hand.
// Source: conteúdo/governança/catalog-payload.json
// Run: node scripts/content/sync-catalog-to-app.mjs

import type { QuizLesson } from '../types/quiz';

export const AI_LESSONS: QuizLesson[] = ${json} as const;
`;
}

function renderAiCatalog(track, lessonSummaries, version) {
  return `// AUTO-GENERATED — do not edit by hand.
// Source: conteúdo/governança/catalog-payload.json
// Run: node scripts/content/sync-catalog-to-app.mjs

import type { LearningTrack, LessonCatalogSummary } from '../features/content/content.types';

export const AI_CATALOG_VERSION = ${JSON.stringify(version)};

export const AI_TRACK: LearningTrack = ${JSON.stringify(track, null, 2)} as const;

export const AI_LESSON_SUMMARIES: LessonCatalogSummary[] = ${JSON.stringify(lessonSummaries, null, 2)} as const;
`;
}

function renderWave1Catalog(wave1) {
  const tracks = [...wave1.tracks].sort((left, right) => left.priority - right.priority);
  const lessonIds = tracks.flatMap((track) => track.lessonIds ?? []);
  const uniqueLessonIds = new Set(lessonIds);

  if (uniqueLessonIds.size !== lessonIds.length) {
    throw new Error('Wave 1 priority track contract assigns the same lesson id to more than one track');
  }

  const links = tracks.flatMap((track) =>
    track.lessonIds.map((lessonId, index) => ({
      lessonId,
      trackId: track.id,
      order: index + 1,
    }))
  );

  return `// AUTO-GENERATED — do not edit by hand.
// Source: conteúdo/governança/wave-1-priority-tracks.json
// Run: node scripts/content/sync-catalog-to-app.mjs

import { LESSONS } from './lessons';
import { AI_LESSONS } from './ai-lessons';
import type { LessonCatalogManifest, LessonCatalogSummary, LearningTrack } from '../features/content/content.types';

const WAVE1_CATALOG_VERSION = ${JSON.stringify(wave1.version)};

const WAVE1_TRACKS: LearningTrack[] = ${JSON.stringify(
    tracks.map(({ id, slug, title, description, lessonIds }) => ({ id, slug, title, description, lessonIds })),
    null,
    2
  )};

const WAVE1_LESSON_LINKS = ${JSON.stringify(links, null, 2)};

const LOCAL_LESSONS = [...LESSONS, ...AI_LESSONS];
const LESSONS_BY_ID = new Map(LOCAL_LESSONS.map((lesson) => [lesson.id, lesson] as const));

function lessonSlugFromId(lessonId: string): string {
  if (lessonId === 'lesson-1') {
    return 'fundamentos-de-radiologia';
  }

  if (lessonId === 'lesson-2') {
    return 'principios-de-tomografia-computadorizada';
  }

  return lessonId.replace(/^ai-lesson:/, '');
}

function buildLessonSummaries(): LessonCatalogSummary[] {
  return WAVE1_LESSON_LINKS.map(({ lessonId, trackId, order }) => {
    const lesson = LESSONS_BY_ID.get(lessonId);

    if (!lesson) {
      throw new Error(\`Missing lesson payload for \${lessonId}\`);
    }

    return {
      id: lesson.id,
      slug: lessonSlugFromId(lesson.id),
      title: lesson.title,
      difficulty: lesson.difficulty,
      trackId,
      order,
    };
  });
}

export const LESSON_CATALOG: LessonCatalogManifest = {
  version: WAVE1_CATALOG_VERSION,
  initialLessonId: 'lesson-1',
  tracks: WAVE1_TRACKS,
  lessons: buildLessonSummaries(),
};
`;
}

/**
 * O vínculo lição→planeta é FATO DE GOVERNANÇA e por isso é gerado; a
 * apresentação de cada corpo celeste (cor, superfície, posição no mapa) é
 * DECISÃO DE DESIGN e por isso continua escrita à mão em `galaxy-catalog.ts`.
 * A divergência entre os dois catálogos do mesmo universo nasceu justamente de
 * o vínculo ser mantido à mão nos dois lugares.
 */
export function buildGalaxyNodes({ map, planetIds, lessonTitleById, ordemPedagogica }) {
  const porPlaneta = new Map();

  for (const entrada of map) {
    if (entrada.taxonomyId === null) continue;
    // O mapa também pode apontar para galáxia ou estrela; só planeta vira corpo
    // com nós no app.
    if (!planetIds.has(entrada.taxonomyId)) continue;

    const titulo = lessonTitleById.get(entrada.catalogId);
    if (!titulo) {
      throw new Error(`Lição do mapa de taxonomia sem título no catálogo: ${entrada.catalogId}`);
    }

    if (!porPlaneta.has(entrada.taxonomyId)) porPlaneta.set(entrada.taxonomyId, []);
    porPlaneta.get(entrada.taxonomyId).push(entrada.catalogId);
  }

  const resultado = {};

  for (const [planetaId, licoes] of [...porPlaneta].sort(([a], [b]) => a.localeCompare(b))) {
    // O agrupamento vem da taxonomia; a ORDEM vem da sequência pedagógica que a
    // trilha já declara. O mapa é alfabético por id, que não é ordem de ensino.
    const ordenadas = [...licoes].sort(
      (a, b) => ordemPedagogica.indexOf(a) - ordemPedagogica.indexOf(b)
    );

    resultado[planetaId] = ordenadas.map((catalogId, indice) => ({
      id: `node-${planetaId.replace(/^planet-/, '')}-${String(indice + 1).padStart(2, '0')}`,
      unitId: planetaId,
      type: 'lesson',
      // "Quiz:" é rótulo de formato, não título — e o campo `type` já diz o que
      // o nó é. Manter o prefixo faria o mapa repetir a palavra em 16 nós.
      title: lessonTitleById.get(catalogId).replace(/^Quiz:\s*/, ''),
      lessonId: catalogId,
      // Todas nascem `available`, e isso não é descuido: as 16 já são
      // alcançáveis hoje pela trilha plana. Nascer `locked` no mapa REDUZIRIA o
      // acesso que o usuário tem — o mapa acrescenta um caminho, não fecha o
      // que existe. O progresso real vem da camada de progresso, não daqui.
      status: 'available',
    }));
  }

  return resultado;
}

function renderGalaxyNodes(nodesByBody) {
  return `// AUTO-GENERATED — do not edit by hand.
// Source: content-manifest/taxonomy-catalog-map.json + Conteúdo/taxonomia/planetas.json
// Run: node scripts/content/sync-catalog-to-app.mjs

import type { JourneyNode } from '../types/journey';

/**
 * Nós de jornada por corpo celeste, derivados do mapa de taxonomia.
 * A apresentação do corpo (cor, superfície, posição) vive em galaxy-catalog.ts,
 * escrita à mão; só o vínculo lição→planeta é gerado.
 */
export const GALAXY_NODES_BY_BODY: Record<string, JourneyNode[]> = ${JSON.stringify(nodesByBody, null, 2)};
`;
}

// ─── main ─────────────────────────────────────────────────────────────────────

const payload = JSON.parse(readFileSync(CATALOG_PAYLOAD_PATH, "utf8"));
const wave1 = JSON.parse(readFileSync(WAVE1_PRIORITY_TRACKS_PATH, "utf8"));
const { version, lessons, track, lessonSummaries } = buildRuntimeCatalog(payload);

const taxonomyMap = JSON.parse(readFileSync(TAXONOMY_MAP_PATH, "utf8"));
const planets = JSON.parse(readFileSync(PLANETS_PATH, "utf8"));

const galaxyNodes = buildGalaxyNodes({
  map: taxonomyMap,
  planetIds: new Set(planets.map((planeta) => planeta.id)),
  lessonTitleById: new Map(lessons.map((licao) => [licao.id, licao.title])),
  ordemPedagogica: track.lessonIds,
});

writeFileSync(AI_LESSONS_PATH, renderAiLessons(lessons), "utf8");
writeFileSync(AI_CATALOG_PATH, renderAiCatalog(track, lessonSummaries, version), "utf8");
writeFileSync(APP_CATALOG_PATH, renderWave1Catalog(wave1), "utf8");
writeFileSync(GALAXY_NODES_PATH, renderGalaxyNodes(galaxyNodes), "utf8");

const totalNos = Object.values(galaxyNodes).reduce((soma, nos) => soma + nos.length, 0);
console.log(
  `Synced ${lessons.length} lessons → ai-lessons.ts + ai-catalog.ts + catalog.ts, ` +
    `e ${totalNos} nós em ${Object.keys(galaxyNodes).length} corpos → galaxy-nodes.ts`
);
