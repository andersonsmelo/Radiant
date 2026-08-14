import type { QuizDifficulty, QuizLesson, QuizLessonId, QuizQuestion } from '../../types/quiz';

export type ContentCatalogSource = 'local' | 'remote';

export type LearningTrack = {
    id: string;
    slug: string;
    title: string;
    description: string;
    lessonIds: QuizLessonId[];
    /**
     * Posição da trilha no percurso. Menor vem antes.
     *
     * OPCIONAL de propósito: o catálogo pode chegar de um payload remoto que
     * não conhece este campo, e exigi-lo quebraria a leitura desse payload
     * inteiro por causa de uma ordenação. Quando ausente, a posição no array
     * do manifesto é usada como desempate — ver `JourneyTrackUnlockService`.
     *
     * O catálogo local declara explicitamente porque ordem implícita em array
     * é invisível: nada avisa quem reordena a lista que a sequência do curso
     * mudou junto.
     */
    order?: number;
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
