import type { LearningActivityV2 } from '../../../types/learningActivity';
import { COLIMACAO } from './colimacao';
import { EXPOSICAO } from './exposicao';

/**
 * O catálogo das aulas-bancada de exemplo. Fica fora do catálogo de produção
 * de propósito: cada frase de física passa pela revisão de conteúdo do dono
 * (`docs/conteudo-bancada/2026-10-24-aulas-de-exemplo.md`) antes de ir ao app.
 *
 * Por isso só responde em build de desenvolvimento (`__DEV__`). A rota
 * `radiantapp://learn?blockId=…` vale em qualquer build, e sem esta guarda um
 * deep link abriria a aula ainda não revisada num build de produção.
 */

export const BENCH_LESSON_IDS = ['bancada:exposicao', 'bancada:colimacao'] as const;

export type BenchLessonId = (typeof BENCH_LESSON_IDS)[number];

const LESSONS: Record<BenchLessonId, LearningActivityV2> = {
  'bancada:exposicao': EXPOSICAO,
  'bancada:colimacao': COLIMACAO,
};

/** O id é de uma aula deste catálogo, em qualquer build. */
export function isBenchLessonId(id: string): id is BenchLessonId {
  return (BENCH_LESSON_IDS as readonly string[]).includes(id);
}

export const BenchLessonCatalog = {
  /** A aula de exemplo com este id, só em `__DEV__`; `null` para qualquer outro id ou build. */
  getActivityById(id: string): LearningActivityV2 | null {
    // Lido a cada chamada, e não na carga do módulo, para o teste poder trocar.
    // Fora do React Native (os scripts de QA em Node) `__DEV__` não existe, e
    // isso conta como build que não é de desenvolvimento.
    if (typeof __DEV__ === 'undefined' || !__DEV__) return null;
    return isBenchLessonId(id) ? LESSONS[id] : null;
  },
};
