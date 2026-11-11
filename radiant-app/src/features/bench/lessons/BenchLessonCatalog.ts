import type { LearningActivityV2 } from '../../../types/learningActivity';

export const BENCH_LESSON_IDS: readonly string[] = [];
export type BenchLessonId = string;

export function isBenchLessonId(id: string): id is BenchLessonId {
    return BENCH_LESSON_IDS.includes(id);
}

export const BenchLessonCatalog = {
    getActivityById(_id: string): LearningActivityV2 | null { return null; },
};
