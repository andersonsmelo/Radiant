import type { LessonCatalogManifest } from '../content.types';
import type { ProductionCurriculumCatalog } from '../../student-checkpoints/ProductionCurriculumCatalog';

export function composeCurriculumCatalog(manifest: LessonCatalogManifest, production: Pick<typeof ProductionCurriculumCatalog, 'listTracks' | 'listLessonSummaries'>): LessonCatalogManifest {
    const productionTracks = production.listTracks();
    const productionTrackIds = new Set(productionTracks.map((track) => track.id));
    const productionLessons = production.listLessonSummaries();
    const productionLessonIds = new Set(productionLessons.map((lesson) => lesson.id));
    return {
        ...manifest,
        tracks: [
            ...manifest.tracks.filter((track) => !productionTrackIds.has(track.id)),
            ...productionTracks,
        ],
        lessons: [
            ...manifest.lessons.filter((lesson) => !productionLessonIds.has(lesson.id)),
            ...productionLessons,
        ],
    };
}

