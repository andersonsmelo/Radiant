import 'dotenv/config';

function required(name: string, fallback?: string): string {
    const value = process.env[name] ?? fallback;
    if (!value) {
        throw new Error(`Missing required env var: ${name}`);
    }
    return value;
}

export const config = {
    appName: process.env.APP_NAME ?? 'radiant-api',
    host: process.env.HOST ?? '127.0.0.1',
    port: Number(process.env.PORT ?? '3100'),
    logLevel: process.env.LOG_LEVEL ?? 'info',
    sentryDsn: process.env.SENTRY_DSN?.trim() ?? '',
    sentryEnvironment: process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV ?? 'development',
    sentryRelease: process.env.SENTRY_RELEASE?.trim() ?? '',
    sentryTracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? '0'),
    databaseUrl: required('DATABASE_URL'),
    jwtSecret: required('JWT_SECRET'),
    accessTokenTtlHours: Number(process.env.ACCESS_TOKEN_TTL_HOURS ?? '6'),
    refreshTokenTtlDays: Number(process.env.REFRESH_TOKEN_TTL_DAYS ?? '30'),
    passwordResetTokenTtlMinutes: Number(process.env.PASSWORD_RESET_TOKEN_TTL_MINUTES ?? '30'),
    exposePasswordResetToken:
        process.env.EXPOSE_PASSWORD_RESET_TOKEN === 'true' || process.env.NODE_ENV !== 'production',
    rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? '60000'),
    rateLimitMax: Number(process.env.RATE_LIMIT_MAX ?? '120'),
};
