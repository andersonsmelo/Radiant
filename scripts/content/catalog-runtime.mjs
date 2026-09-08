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

// As questões nascem com a alternativa correta na primeira posição — é como o
// gerador de conteúdo as escreve. Medido em 2026-09-08: 32 de 32. Quem responde
// sempre "a" acerta o catálogo inteiro sem ler o enunciado, então a ordem é
// decidida aqui, no ponto que app e API compartilham.
//
// A permutação é semeada pelo id da questão, e não por acaso: o mesmo payload
// precisa gerar sempre os mesmos arquivos, senão cada `sync` reescreve tudo e o
// diff do repositório vira ruído permanente.
function sementeDoTexto(texto) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < texto.length; i += 1) {
    hash ^= texto.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash || 1;
}

function embaralhaDeterministico(itens, semente) {
  let estado = sementeDoTexto(semente);
  const proximo = () => {
    estado ^= estado << 13;
    estado >>>= 0;
    estado ^= estado >>> 17;
    estado ^= estado << 5;
    estado >>>= 0;
    return estado / 0x100000000;
  };

  const saida = [...itens];
  for (let i = saida.length - 1; i > 0; i -= 1) {
    const j = Math.floor(proximo() * (i + 1));
    [saida[i], saida[j]] = [saida[j], saida[i]];
  }
  return saida;
}

export function mapQuizBundle(bundle) {
  const lessonId = lessonIdFromBundleId(bundle.id);
  const questions = (bundle.aiContent ?? []).map((question, index) => {
    const id = `${lessonId}:q${index + 1}`;
    const rotuloCorreto = question.options?.[question.correct];

    // Falhar aqui é melhor que emitir -1: um gabarito fora de alcance vira uma
    // questão sem resposta certa, e nenhum validador de tipo enxerga isso.
    if (rotuloCorreto === undefined) {
      throw new Error(
        `Questao ${id} aponta correct=${question.correct} fora das ${question.options?.length ?? 0} alternativas`
      );
    }

    const alternativas = embaralhaDeterministico(question.options, id);

    return {
      id,
      type: "multiple-choice",
      prompt: question.question,
      options: alternativas.map((label) => ({ label })),
      correctAnswerIndex: alternativas.indexOf(rotuloCorreto),
      explanation: question.explanation,
      ...(question.hint ? { hint: question.hint } : {}),
    };
  });

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
