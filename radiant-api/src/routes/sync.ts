import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { ApiUser } from '../types.js';
import type { LessonProgressPayload, ReviewCardPayload } from '../schemas/sync.js';
import { lessonProgressSchema, reviewCardSchema } from '../schemas/sync.js';

export interface SyncRouteService {
    requireSession(request: FastifyRequest): Promise<ApiUser>;
    upsertLessonProgress(user: ApiUser, payload: LessonProgressPayload): Promise<void>;
    upsertReviewCard(user: ApiUser, payload: ReviewCardPayload): Promise<void>;
}

export interface SyncRouteDependencies {
    sync: SyncRouteService;
}

export async function registerSyncRoutes(app: FastifyInstance, deps: SyncRouteDependencies) {
    app.put('/v1/sync/lesson-progress', async (request, reply) => {
        const session = await deps.sync.requireSession(request);
        const parsed = lessonProgressSchema.safeParse(request.body);

        if (!parsed.success) {
            return reply.status(400).send({ message: 'Invalid lesson progress payload' });
        }

        await deps.sync.upsertLessonProgress(session, parsed.data);
        return reply.status(204).send();
    });

    app.put('/v1/sync/review-cards', async (request, reply) => {
        const session = await deps.sync.requireSession(request);
        const parsed = reviewCardSchema.safeParse(request.body);

        if (!parsed.success) {
            return reply.status(400).send({ message: 'Invalid review card payload' });
        }

        await deps.sync.upsertReviewCard(session, parsed.data);
        return reply.status(204).send();
    });
}
