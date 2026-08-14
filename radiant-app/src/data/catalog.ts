// AUTO-GENERATED — do not edit by hand.
// Source: conteúdo/governança/wave-1-priority-tracks.json
// Run: node scripts/content/sync-catalog-to-app.mjs

import { LESSONS } from './lessons';
import { AI_LESSONS } from './ai-lessons';
import type { LessonCatalogManifest, LessonCatalogSummary, LearningTrack } from '../features/content/content.types';

const WAVE1_CATALOG_VERSION = "wave-1-2026-04-09";

const WAVE1_TRACKS: LearningTrack[] = [
  {
    "id": "track-radiology-foundations",
    "order": 1,
    "slug": "fundamentos",
    "title": "Fundamentos de Radiologia",
    "description": "Base física da radiação e primeiras lições do curso técnico: energia, matéria, núcleo atômico, radioatividade e a descoberta dos raios X.",
    "lessonIds": [
      "lesson-1",
      "lesson-2",
      "ai-lesson:profissao-e-atuacao-do-tecnico-em-radiologia",
      "ai-lesson:energia-e-materia",
      "ai-lesson:estrutura-da-materia-e-nucleo-atomico",
      "ai-lesson:radioatividade-particulas-e-atividade",
      "ai-lesson:raios-x-descoberta-e-propriedades"
    ]
  },
  {
    "id": "track-thorax-patterns",
    "order": 2,
    "slug": "torax",
    "title": "Radiação, Modalidades e Equipamento",
    "description": "Proteção radiológica, medicina nuclear, tomografia, ressonância magnética e o equipamento de radiologia convencional com seus componentes.",
    "lessonIds": [
      "ai-lesson:interacao-das-radiacoes-e-protecao-radiologica",
      "ai-lesson:aplicacoes-radioisotopicas-e-medicina-nuclear",
      "ai-lesson:tomografia-computadorizada",
      "ai-lesson:ressonancia-magnetica",
      "ai-lesson:equipamentos-de-radiologia-convencional",
      "ai-lesson:componentes-basicos-do-equipamento"
    ]
  },
  {
    "id": "track-abdomen-essentials",
    "order": 3,
    "slug": "abdome",
    "title": "Prática, Qualidade e Profissão",
    "description": "Produção dos raios X, processamento radiográfico, qualidade de imagem, aplicações não-médicas da radiação e a atuação do técnico em radiologia.",
    "lessonIds": [
      "ai-lesson:preservacao-de-alimentos-por-irradicao",
      "ai-lesson:acessorios-radiologicos",
      "ai-lesson:processamento-radiografico",
      "ai-lesson:producao-dos-raios-x",
      "ai-lesson:qualidade-de-imagem"
    ]
  }
];

const WAVE1_LESSON_LINKS = [
  {
    "lessonId": "lesson-1",
    "trackId": "track-radiology-foundations",
    "order": 1
  },
  {
    "lessonId": "lesson-2",
    "trackId": "track-radiology-foundations",
    "order": 2
  },
  {
    "lessonId": "ai-lesson:profissao-e-atuacao-do-tecnico-em-radiologia",
    "trackId": "track-radiology-foundations",
    "order": 3
  },
  {
    "lessonId": "ai-lesson:energia-e-materia",
    "trackId": "track-radiology-foundations",
    "order": 4
  },
  {
    "lessonId": "ai-lesson:estrutura-da-materia-e-nucleo-atomico",
    "trackId": "track-radiology-foundations",
    "order": 5
  },
  {
    "lessonId": "ai-lesson:radioatividade-particulas-e-atividade",
    "trackId": "track-radiology-foundations",
    "order": 6
  },
  {
    "lessonId": "ai-lesson:raios-x-descoberta-e-propriedades",
    "trackId": "track-radiology-foundations",
    "order": 7
  },
  {
    "lessonId": "ai-lesson:interacao-das-radiacoes-e-protecao-radiologica",
    "trackId": "track-thorax-patterns",
    "order": 1
  },
  {
    "lessonId": "ai-lesson:aplicacoes-radioisotopicas-e-medicina-nuclear",
    "trackId": "track-thorax-patterns",
    "order": 2
  },
  {
    "lessonId": "ai-lesson:tomografia-computadorizada",
    "trackId": "track-thorax-patterns",
    "order": 3
  },
  {
    "lessonId": "ai-lesson:ressonancia-magnetica",
    "trackId": "track-thorax-patterns",
    "order": 4
  },
  {
    "lessonId": "ai-lesson:equipamentos-de-radiologia-convencional",
    "trackId": "track-thorax-patterns",
    "order": 5
  },
  {
    "lessonId": "ai-lesson:componentes-basicos-do-equipamento",
    "trackId": "track-thorax-patterns",
    "order": 6
  },
  {
    "lessonId": "ai-lesson:preservacao-de-alimentos-por-irradicao",
    "trackId": "track-abdomen-essentials",
    "order": 1
  },
  {
    "lessonId": "ai-lesson:acessorios-radiologicos",
    "trackId": "track-abdomen-essentials",
    "order": 2
  },
  {
    "lessonId": "ai-lesson:processamento-radiografico",
    "trackId": "track-abdomen-essentials",
    "order": 3
  },
  {
    "lessonId": "ai-lesson:producao-dos-raios-x",
    "trackId": "track-abdomen-essentials",
    "order": 4
  },
  {
    "lessonId": "ai-lesson:qualidade-de-imagem",
    "trackId": "track-abdomen-essentials",
    "order": 5
  }
];

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
      throw new Error(`Missing lesson payload for ${lessonId}`);
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
