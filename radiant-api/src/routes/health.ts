import type { FastifyInstance } from 'fastify';
import type { ApiHealthResponse } from '../types.js';

export interface HealthRouteDependencies {
    serviceName: string;
    getNow: () => Promise<string>;
}

export async function registerHealthRoutes(app: FastifyInstance, deps: HealthRouteDependencies) {
    app.get('/health', async () => {
        const now = await deps.getNow();

        return {
            ok: true,
            service: deps.serviceName,
            now,
        } satisfies ApiHealthResponse;
    });
}
