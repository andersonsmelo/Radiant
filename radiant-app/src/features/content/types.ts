import type { QuizDifficulty, QuizLessonId } from '../../types/quiz';

export type LearningTrack = {
    id: string;
    slug: string;
    title: string;
    description: string;
    lessonIds: QuizLessonId[];
};

export type LessonCatalogSummary = {
    id: QuizLessonId;
    slug: string;
    title: string;
    difficulty: QuizDifficulty;
    trackId: LearningTrack['id'];
    order: number;
};

export type LessonCatalogManifest = {
    version: string;
    initialLessonId: QuizLessonId;
    tracks: LearningTrack[];
    lessons: LessonCatalogSummary[];
};
