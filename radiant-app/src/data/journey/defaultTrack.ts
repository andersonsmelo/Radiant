import { LESSON_CATALOG } from '../catalog';
import type { JourneyTrackDefinition } from '../../types/journey';

function requireLessonTitle(lessonId: string): string {
    const lesson = LESSON_CATALOG.lessons.find((entry) => entry.id === lessonId);

    if (!lesson) {
        throw new Error(`[journey] Missing lesson catalog entry for "${lessonId}"`);
    }

    return lesson.title;
}

const UNIT_ID = 'unit-radiology-foundations-1';
const LESSON_1_ID = 'lesson-1';
const LESSON_2_ID = 'lesson-2';

export const DEFAULT_JOURNEY_TRACK_DEFINITION: JourneyTrackDefinition = {
    id: LESSON_CATALOG.tracks[0]?.id ?? 'track-radiology-foundations',
    title: 'Estrada de aprendizado',
    initialUnitId: UNIT_ID,
    units: [
        {
            id: UNIT_ID,
            title: 'Fundamentos de Radiologia',
            theme: 'base',
            nodes: [
                {
                    id: 'node:lesson-1',
                    unitId: UNIT_ID,
                    type: 'lesson',
                    title: requireLessonTitle(LESSON_1_ID),
                    lessonId: LESSON_1_ID,
                    blockId: 'block:lesson-1:intro',
                },
                {
                    id: 'node:review:lesson-1',
                    unitId: UNIT_ID,
                    type: 'review',
                    title: `Revisar ${requireLessonTitle(LESSON_1_ID)}`,
                    lessonId: LESSON_1_ID,
                    blockId: 'block:review:lesson-1',
                    unlockRule: {
                        requiresNodeIds: ['node:lesson-1'],
                    },
                },
                {
                    id: 'node:checkpoint:foundations',
                    unitId: UNIT_ID,
                    type: 'checkpoint',
                    title: 'Checkpoint da unidade',
                    description: 'Fecha a primeira etapa antes de avançar.',
                    unlockRule: {
                        requiresNodeIds: ['node:lesson-1'],
                    },
                },
                {
                    id: 'node:lesson-2',
                    unitId: UNIT_ID,
                    type: 'lesson',
                    title: requireLessonTitle(LESSON_2_ID),
                    lessonId: LESSON_2_ID,
                    blockId: 'block:lesson-2:intro',
                    unlockRule: {
                        requiresNodeIds: ['node:checkpoint:foundations'],
                    },
                },
                {
                    id: 'node:review:lesson-2',
                    unitId: UNIT_ID,
                    type: 'review',
                    title: `Revisar ${requireLessonTitle(LESSON_2_ID)}`,
                    lessonId: LESSON_2_ID,
                    blockId: 'block:review:lesson-2',
                    unlockRule: {
                        requiresNodeIds: ['node:lesson-2'],
                    },
                },
                {
                    id: 'node:reward:foundations',
                    unitId: UNIT_ID,
                    type: 'reward',
                    title: 'Conquista inicial',
                    description: 'Marca a conclusão da primeira unidade.',
                    unlockRule: {
                        requiresNodeIds: ['node:lesson-2'],
                    },
                },
            ],
        },
    ],
};
