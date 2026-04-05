import { LESSON_CATALOG } from '../../../data/catalog';
import { LESSONS } from '../../../data/lessons';
import { AI_LESSONS } from '../../../data/ai-lessons';
import type { ContentLesson, LearningTrack, LessonCatalogManifest, LessonCatalogSummary } from '../content.types';
import { RemoteCatalogService } from './RemoteCatalogService';
import { TelemetryService } from '../../telemetry/TelemetryService';

const ALL_LOCAL_LESSONS = [...AI_LESSONS, ...LESSONS];
const LOCAL_LESSONS_BY_ID = new Map(ALL_LOCAL_LESSONS.map((lesson) => [lesson.id, lesson] as const));
const LOCAL_LESSON_IDS = new Set(ALL_LOCAL_LESSONS.map((lesson) => lesson.id));

function createLocalManifest(): LessonCatalogManifest {
    return {
        ...LESSON_CATALOG,
        source: 'local',
        refreshedAtIso: new Date().toISOString(),
    };
}

function sanitizeRemoteManifest(
    remote: LessonCatalogManifest,
    fallback: LessonCatalogManifest
): { manifest: LessonCatalogManifest; lessonsById: Map<string, ContentLesson> } | null {
    const resolvedLessonsById = new Map<string, ContentLesson>();
    const lessons = remote.lessons.filter((lesson) => {
        const resolvedLesson = resolveRemoteLessonPayload(lesson);

        if (!resolvedLesson) {
            return false;
        }

        resolvedLessonsById.set(lesson.id, resolvedLesson);
        return true;
    });

    if (lessons.length === 0) {
        return null;
    }

    const lessonIds = new Set(lessons.map((lesson) => lesson.id));
    const tracks = remote.tracks
        .map((track) => ({
            ...track,
            lessonIds: track.lessonIds.filter((lessonId) => lessonIds.has(lessonId)),
        }))
        .filter((track) => track.lessonIds.length > 0);

    if (tracks.length === 0) {
        return null;
    }

    const validTrackIds = new Set(tracks.map((track) => track.id));
    const normalizedLessons = lessons.filter((lesson) => validTrackIds.has(lesson.trackId));

    if (normalizedLessons.length === 0) {
        return null;
    }

    const resolvedInitialLessonId = normalizedLessons.some((lesson) => lesson.id === remote.initialLessonId)
        ? remote.initialLessonId
        : normalizedLessons.some((lesson) => lesson.id === fallback.initialLessonId)
          ? fallback.initialLessonId
          : normalizedLessons[0].id;

    return {
        manifest: {
            ...remote,
            initialLessonId: resolvedInitialLessonId,
            tracks,
            lessons: normalizedLessons,
            source: 'remote',
        },
        lessonsById: resolvedLessonsById,
    };
}

function isValidQuizLessonPayload(payload: LessonCatalogSummary['payload'], lessonId: string): payload is ContentLesson {
    return Boolean(
        payload &&
        payload.id === lessonId &&
        typeof payload.title === 'string' &&
        (payload.difficulty === 'beginner' ||
            payload.difficulty === 'intermediate' ||
            payload.difficulty === 'advanced') &&
        Array.isArray(payload.questions) &&
        payload.questions.every((question) =>
            typeof question.id === 'string' &&
            (question.type === 'multiple-choice' || question.type === 'image') &&
            typeof question.prompt === 'string' &&
            Array.isArray(question.options) &&
            question.options.every((option) => typeof option.label === 'string') &&
            typeof question.correctAnswerIndex === 'number' &&
            typeof question.explanation === 'string'
        ) &&
        (!payload.journey ||
            (typeof payload.journey === 'object' &&
                isValidJourneyStageCopy(payload.journey.intro) &&
                isValidJourneyStageCopy(payload.journey.review)))
    );
}

function isValidJourneyStageCopy(stage: ContentLesson['journey'] extends infer T
    ? T extends { intro?: infer S; review?: infer S }
        ? S | undefined
        : never
    : never): boolean {
    if (!stage) {
        return true;
    }

    return (
        typeof stage === 'object' &&
        (stage.questionIndex === undefined || typeof stage.questionIndex === 'number') &&
        (stage.contextBody === undefined || typeof stage.contextBody === 'string') &&
        (stage.teachBody === undefined || typeof stage.teachBody === 'string') &&
        (stage.reinforceBody === undefined || typeof stage.reinforceBody === 'string')
    );
}

function resolveRemoteLessonPayload(summary: LessonCatalogSummary): ContentLesson | null {
    if (isValidQuizLessonPayload(summary.payload, summary.id)) {
        return summary.payload;
    }

    return LOCAL_LESSONS_BY_ID.get(summary.id) ?? null;
}

class LessonCatalogServiceImpl {
    private manifest: LessonCatalogManifest = createLocalManifest();
    private lessonsById = new Map(LOCAL_LESSONS_BY_ID);
    private refreshPromise: Promise<LessonCatalogManifest> | null = null;

    async bootstrap(): Promise<LessonCatalogManifest> {
        if (this.refreshPromise) {
            return this.refreshPromise;
        }

        void TelemetryService.track('catalog_bootstrap', { source: this.getCatalogSource() });
        this.refreshPromise = this.refresh().finally(() => {
            this.refreshPromise = null;
        });

        return this.refreshPromise;
    }

    async refresh(): Promise<LessonCatalogManifest> {
        void TelemetryService.track('catalog_refresh', { source: this.getCatalogSource() });
        const remote = await RemoteCatalogService.fetchManifest(this.manifest);
        const sanitizedRemote = remote ? sanitizeRemoteManifest(remote, this.manifest) : null;

        if (sanitizedRemote) {
            this.manifest = sanitizedRemote.manifest;
            this.lessonsById = new Map(LOCAL_LESSONS_BY_ID);
            sanitizedRemote.lessonsById.forEach((lesson, lessonId) => {
                this.lessonsById.set(lessonId, lesson);
            });
            void TelemetryService.track('catalog_remote_success', { version: sanitizedRemote.manifest.version });
        } else {
            this.manifest = createLocalManifest();
            this.lessonsById = new Map(LOCAL_LESSONS_BY_ID);
            void TelemetryService.track('catalog_remote_fallback', {
                source: this.getCatalogSource(),
                reason: remote ? 'manifest_incompatible_with_local_content' : 'remote_unavailable',
            });
        }

        return this.manifest;
    }

    getCatalogVersion(): string {
        return this.manifest.version;
    }

    getCatalogSource(): 'local' | 'remote' {
        return this.manifest.source ?? 'local';
    }

    getCatalogSourceLabel(): string {
        return this.getCatalogSource() === 'remote' ? 'catálogo remoto' : 'catálogo local';
    }

    getManifest(): LessonCatalogManifest {
        return this.manifest;
    }

    listTracks(): LearningTrack[] {
        return [...this.manifest.tracks];
    }

    listLessonSummaries(): LessonCatalogSummary[] {
        return [...this.manifest.lessons];
    }

    getInitialLessonId(): string | null {
        return this.manifest.initialLessonId ?? null;
    }

    listLessons(): ContentLesson[] {
        return this.manifest.lessons
            .map((lesson) => this.lessonsById.get(lesson.id))
            .filter((lesson): lesson is ContentLesson => Boolean(lesson));
    }

    getInitialLesson(): ContentLesson | null {
        const initialLessonId = this.getInitialLessonId();

        return initialLessonId ? this.getLessonById(initialLessonId) : null;
    }

    getLessonById(lessonId: string): ContentLesson | null {
        return this.lessonsById.get(lessonId) ?? null;
    }

    getReviewQuestionsForLesson(lessonId: string) {
        const lesson = this.getLessonById(lessonId);
        return lesson?.questions ?? [];
    }
}

export const LessonCatalogService = new LessonCatalogServiceImpl();
