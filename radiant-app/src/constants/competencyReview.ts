// radiant-app/src/constants/competencyReview.ts

import type { MemoryParams } from '../types/competencyReview';

export const COMPETENCY_REVIEW_SCHEMA_VERSION = 1;

export const COMPETENCY_REVIEW_STORAGE_KEYS = {
    STORE: '@radiant:competency_review_v1',
    QUARANTINE: '@radiant:competency_review_v1:quarantine',
} as const;

/**
 * Oito constantes de modelo e cinco de política. O FSRS traz 17–21, otimizadas
 * sobre históricos enormes de flashcards; herdá-las aqui seria adotar números
 * que ninguém neste projeto pode justificar nem reajustar. O formato do estado
 * é o mesmo, então promover a fórmula completa depois troca a matemática sem
 * remodelar dados.
 *
 * INVARIANTE, travada por teste em `competencyReview.test.ts`:
 *   minIntervalDays * 24 >= delayedRetentionMinHours
 * Sem ela, uma revisão agendada pode acontecer antes do limiar e não contar
 * como retenção — e o sistema não daria sinal nenhum.
 */
export const DEFAULT_MEMORY_PARAMS: MemoryParams = {
    alpha: 0.5,
    stabilityGain: 2.5,
    lapseFactor: 0.4,
    hintPenalty: 0.5,
    difficultyStep: 0.1,
    initialStabilityCorrect: 3,
    initialStabilityIncorrect: 1,
    initialDifficulty: 0.3,
    targetRetention: 0.9,
    targetRetentionCriticalSafety: 0.95,
    delayedRetentionMinHours: 20,
    minIntervalDays: 1,
    maxIntervalDays: 365,
};
