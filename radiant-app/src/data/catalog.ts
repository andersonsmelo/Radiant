import { LESSON_CATALOG_VERSION } from './lessons';
import { AI_TRACK, AI_LESSON_SUMMARIES, AI_CATALOG_VERSION } from './ai-catalog';
import type { LessonCatalogManifest } from '../features/content/types';

export const LESSON_CATALOG: LessonCatalogManifest = {
    version: `${LESSON_CATALOG_VERSION}+ai-${AI_CATALOG_VERSION}`,
    initialLessonId: AI_LESSON_SUMMARIES[0]?.id ?? 'lesson-1',
    tracks: [
        AI_TRACK,
        {
            id: 'track-radiology-foundations',
            slug: 'radiology-foundations',
            title: 'Fundamentos de Radiologia (Seed)',
            description: 'Base inicial para raciocínio radiológico e introdução à TC.',
            lessonIds: ['lesson-1', 'lesson-2'],
        },
    ],
    lessons: [
        ...AI_LESSON_SUMMARIES,
        {
            id: 'lesson-1',
            slug: 'fundamentos-de-radiologia',
            title: 'Fundamentos de Radiologia',
            difficulty: 'beginner',
            trackId: 'track-radiology-foundations',
            order: 1,
        },
        {
            id: 'lesson-2',
            slug: 'principios-de-tomografia-computadorizada',
            title: 'Princípios de Tomografia Computadorizada',
            difficulty: 'beginner',
            trackId: 'track-radiology-foundations',
            order: 2,
        },
    ],
};
