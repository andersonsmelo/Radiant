import type { FastifyInstance } from 'fastify';
import type { ApiCatalogMeta, ApiCatalogResponse } from '../types.js';

export interface ContentRouteDependencies {
    getCatalog: () => Promise<ApiCatalogResponse>;
}

export async function registerContentRoutes(app: FastifyInstance, deps: ContentRouteDependencies) {
    app.get('/v1/content/catalog', async () => {
        const catalog = await deps.getCatalog();

        return {
            ...catalog,
            meta: catalog.meta ?? buildRemoteCatalogMeta(),
        };
    });
}

function buildRemoteCatalogMeta(): ApiCatalogMeta {
    return {
        source: 'remote',
        generatedAt: new Date().toISOString(),
    };
}
