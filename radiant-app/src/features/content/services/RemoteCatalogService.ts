import { AppConfig } from '../../../config';
import { apiRequest, isApiConfigured } from '../../../lib/api';
import type { LessonCatalogManifest, RemoteLessonCatalogPayload } from '../content.types';

function normalizeRemoteCatalog(
    payload: RemoteLessonCatalogPayload,
    fallback: LessonCatalogManifest
): LessonCatalogManifest {
    return {
        version: payload.version || fallback.version,
        initialLessonId: payload.initialLessonId ?? fallback.initialLessonId,
        tracks: Array.isArray(payload.tracks) ? payload.tracks : fallback.tracks,
        lessons: Array.isArray(payload.lessons) ? payload.lessons : fallback.lessons,
        source: 'remote',
        refreshedAtIso: payload.refreshedAtIso ?? new Date().toISOString(),
    };
}

class RemoteCatalogServiceImpl {
    async fetchManifest(fallback: LessonCatalogManifest): Promise<LessonCatalogManifest | null> {
        if (!AppConfig.ENABLE_REMOTE_CONTENT_CATALOG || !isApiConfigured()) {
            return null;
        }

        try {
            const payload = await apiRequest<RemoteLessonCatalogPayload>('/v1/content/catalog');
            if (!payload || !payload.version || !Array.isArray(payload.tracks) || !Array.isArray(payload.lessons)) {
                return null;
            }
            return normalizeRemoteCatalog(payload, fallback);
        } catch (error) {
            console.error('[RemoteCatalogService] Failed to fetch remote catalog:', error);
            return null;
        }
    }
}

export const RemoteCatalogService = new RemoteCatalogServiceImpl();
