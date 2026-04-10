import type { QuizDifficulty, QuizLesson, QuizLessonId, QuizQuestion } from '../../types/quiz';

export type ContentCatalogSource = 'local' | 'remote';

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
    payload?: QuizLesson;
};

export type LessonCatalogManifest = {
    version: string;
    initialLessonId: QuizLessonId | null;
    tracks: LearningTrack[];
    lessons: LessonCatalogSummary[];
    source?: ContentCatalogSource;
    refreshedAtIso?: string;
};

export type ContentLesson = QuizLesson;

export type RemoteLessonCatalogPayload = {
    version: string;
    initialLessonId?: QuizLessonId | null;
    tracks: LearningTrack[];
    lessons: LessonCatalogSummary[];
    refreshedAtIso?: string;
};

export type CatalogLessonQuestionSummary = Pick<QuizQuestion, 'id' | 'prompt' | 'options'>;
