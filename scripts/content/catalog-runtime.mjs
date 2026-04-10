export const AI_TRACK_ID = "track-ai-fundamentos";
export const AI_TRACK_SLUG = "ai-fundamentos-de-radiologia";
export const AI_TRACK_TITLE = "Fundamentos de Radiologia (IA)";
export const AI_TRACK_DESCRIPTION =
  "16 conceitos essenciais de radiologia gerados pelo Radiant AI, ordenados por sequência de aprendizagem.";

export function slugFromBundleId(bundleId) {
  return bundleId.split(":")[3] ?? "";
}

export function lessonIdFromBundleId(bundleId) {
  return `ai-lesson:${slugFromBundleId(bundleId)}`;
}

export function slugFromLessonId(lessonId) {
  return lessonId.replace(/^ai-lesson:/, "");
}

export function mapQuizBundle(bundle) {
  const lessonId = lessonIdFromBundleId(bundle.id);
  const questions = (bundle.aiContent ?? []).map((question, index) => ({
    id: `${lessonId}:q${index + 1}`,
    type: "multiple-choice",
    prompt: question.question,
    options: question.options.map((label) => ({ label })),
    correctAnswerIndex: question.correct,
    explanation: question.explanation,
    ...(question.hint ? { hint: question.hint } : {}),
  }));

  return {
    id: lessonId,
    title: bundle.title,
    difficulty: "beginner",
    questions,
  };
}

export function buildRuntimeCatalog(catalogPayload) {
  const quizBundles = catalogPayload?.tracks?.quizzes;

  if (!Array.isArray(quizBundles) || quizBundles.length === 0) {
    throw new Error("No quizzes found in catalog-payload.json");
  }

  const lessons = quizBundles.map(mapQuizBundle);
  const track = {
    id: AI_TRACK_ID,
    slug: AI_TRACK_SLUG,
    title: AI_TRACK_TITLE,
    description: AI_TRACK_DESCRIPTION,
    lessonIds: lessons.map((lesson) => lesson.id),
  };

  const lessonSummaries = lessons.map((lesson, index) => ({
    id: lesson.id,
    slug: slugFromLessonId(lesson.id),
    title: lesson.title,
    difficulty: lesson.difficulty,
    trackId: track.id,
    order: index + 1,
  }));

  return {
    version: catalogPayload.version,
    track,
    lessonSummaries,
    lessons,
  };
}
