import type { FastifyInstance, FastifyRequest } from 'fastify';

interface RateLimitState {
    count: number;
    resetAt: number;
}

interface RateLimitOptions {
    windowMs: number;
    max: number;
    skipPaths?: string[];
    keyFromRequest?: (request: FastifyRequest) => string;
}

function clampWindowMs(value: number): number {
    if (!Number.isFinite(value) || value < 1000) {
        return 60_000;
    }

    return Math.trunc(value);
}

function clampMax(value: number): number {
    if (!Number.isFinite(value) || value < 1) {
        return 120;
    }

    return Math.trunc(value);
}

function pathFromUrl(url: string): string {
    const [path] = url.split('?', 1);
    return path ?? '/';
}

export function registerBasicRateLimit(app: FastifyInstance, options: RateLimitOptions): void {
    const states = new Map<string, RateLimitState>();
    const skipPaths = new Set(options.skipPaths ?? []);
    const windowMs = clampWindowMs(options.windowMs);
    const max = clampMax(options.max);

    app.addHook('onRequest', async (request, reply) => {
        const path = pathFromUrl(request.url);
        if (skipPaths.has(path)) {
            return;
        }

        // Pela rota, não pelo caminho: caminhos aleatórios (/a1, /a2…) caem
        // todos em "sem-rota" em vez de abrir um contador novo cada um.
        const key = options.keyFromRequest
            ? options.keyFromRequest(request)
            : `${request.ip}:${request.method}:${request.routeOptions.url ?? 'sem-rota'}`;

        const now = Date.now();
        // Contadores vencidos saem quando a lista cresce; antes ela só crescia.
        if (states.size > 10_000) {
            for (const [stateKey, state] of states) if (now >= state.resetAt) states.delete(stateKey);
        }
        const current = states.get(key);

        if (!current || now >= current.resetAt) {
            states.set(key, {
                count: 1,
                resetAt: now + windowMs,
            });
            return;
        }

        current.count += 1;
        if (current.count <= max) {
            return;
        }

        const retryAfterSeconds = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
        reply.header('retry-after', String(retryAfterSeconds));
        reply.code(429).send({
            ok: false,
            error: 'rate_limit_exceeded',
            retryAfterSeconds,
        });
    });
}
