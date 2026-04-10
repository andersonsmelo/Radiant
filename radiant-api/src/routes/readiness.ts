import type { FastifyInstance } from 'fastify';
import type { ApiReadinessResponse } from '../types.js';

export interface ReadinessRouteDependencies {
    serviceName: string;
    checkReady: () => Promise<void>;
}

export async function registerReadinessRoutes(app: FastifyInstance, deps: ReadinessRouteDependencies) {
    app.get('/ready', async (_request, reply) => {
        await deps.checkReady();

        return reply.send({
            ok: true,
            service: deps.serviceName,
            ready: true,
        } satisfies ApiReadinessResponse);
    });
}
