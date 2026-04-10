import * as Sentry from '@sentry/node';
import type { FastifyInstance } from 'fastify';
import { config } from './config.js';

let sentryInitialized = false;

function isEnabled(): boolean {
    return Boolean(config.sentryDsn);
}

export function initializeSentry(): void {
    if (sentryInitialized || !isEnabled()) {
        return;
    }

    Sentry.init({
        dsn: config.sentryDsn,
        environment: config.sentryEnvironment,
        release: config.sentryRelease || undefined,
        tracesSampleRate: Number.isFinite(config.sentryTracesSampleRate)
            ? config.sentryTracesSampleRate
            : 0,
        integrations: [Sentry.fastifyIntegration()],
    });

    sentryInitialized = true;
}

export function registerSentryErrorHandler(app: FastifyInstance): void {
    if (!isEnabled()) {
        return;
    }

    Sentry.setupFastifyErrorHandler(app);
}

export function captureException(error: unknown, context?: Record<string, unknown>): void {
    if (!isEnabled()) {
        return;
    }

    Sentry.withScope((scope) => {
        if (context) {
            Object.entries(context).forEach(([key, value]) => {
                scope.setExtra(key, value);
            });
        }

        if (error instanceof Error) {
            Sentry.captureException(error);
            return;
        }

        scope.setLevel('error');
        Sentry.captureMessage('non_error_exception');
    });
}
