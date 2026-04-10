import Fastify from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { sql } from './db.js';
import { config } from './config.js';
import {
    buildPasswordResetExpiresAt,
    buildRefreshTokenExpiresAt,
    generateRefreshToken,
    hashPassword,
    hashRefreshToken,
    signAccessToken,
    verifyAccessToken,
    verifyPassword,
} from './auth.js';
import type {
    ApiCatalogResponse,
    ApiCatalogTrackSummary,
    ApiUser,
    AuthSessionResponse,
    PasswordResetConfirmResponse,
    PasswordResetRequestResponse,
} from './types.js';
import { registerAuthRoutes } from './routes/auth.js';
import { registerContentRoutes } from './routes/content.js';
import { registerHealthRoutes } from './routes/health.js';
import { registerReadinessRoutes } from './routes/readiness.js';
import { registerSyncRoutes } from './routes/sync.js';
import { registerBasicRateLimit } from './rateLimit.js';
import { captureException, initializeSentry, registerSentryErrorHandler } from './sentry.js';
import type { FastifyInstance, FastifyRequest } from 'fastify';

type SqlClient = typeof sql;

interface AuthService {
    register(email: string, password: string): Promise<AuthSessionResponse | 'conflict'>;
    login(email: string, password: string): Promise<AuthSessionResponse | 'invalid'>;
    refresh(refreshToken: string): Promise<AuthSessionResponse | 'invalid'>;
    logout(refreshToken: string): Promise<void>;
    requestPasswordReset(email: string): Promise<PasswordResetRequestResponse>;
    confirmPasswordReset(
        email: string,
        resetToken: string,
        password: string
    ): Promise<PasswordResetConfirmResponse | 'invalid'>;
    requireSession(request: FastifyRequest): Promise<ApiUser>;
}

interface SyncService {
    requireSession(request: FastifyRequest): Promise<ApiUser>;
    upsertLessonProgress(user: ApiUser, payload: { lessonId: string; totalQuestions: number; correctAnswers: number; answeredAtIso: string }): Promise<void>;
    upsertReviewCard(
        user: ApiUser,
        payload: {
            lessonId: string;
            easeFactor: number;
            intervalDays: number;
            repetitions: number;
            nextReviewAtIso: string;
            lastReviewedAtIso: string;
            createdAtIso: string;
        }
    ): Promise<void>;
}

function buildCatalogVersion(contentVersions: string[]): string {
    const uniqueVersions = [...new Set(contentVersions.filter(Boolean))].sort();

    if (uniqueVersions.length === 0) {
        return 'v1';
    }

    if (uniqueVersions.length === 1) {
        return uniqueVersions[0];
    }

    return `mixed:${uniqueVersions.join('|')}`;
}

async function getNow(database: SqlClient): Promise<string> {
    const [{ now }] = await database<{ now: string }[]>`select now()::text as now`;
    return now;
}

async function checkReady(database: SqlClient): Promise<void> {
    await database`select 1`;
}

async function buildCatalog(database: SqlClient): Promise<ApiCatalogResponse> {
    const rows = await database<
        {
            track_id: string;
            track_slug: string;
            track_title: string;
            track_description: string;
            id: string;
            slug: string;
            title: string;
            difficulty: 'beginner' | 'intermediate' | 'advanced';
            sort_order: number;
            content_version: string;
            payload: {
                id: string;
                title: string;
                difficulty: 'beginner' | 'intermediate' | 'advanced';
                journey?: {
                    intro?: {
                        questionIndex?: number;
                        contextBody?: string;
                        teachBody?: string;
                        reinforceBody?: string;
                    };
                    review?: {
                        questionIndex?: number;
                        contextBody?: string;
                        teachBody?: string;
                        reinforceBody?: string;
                    };
                };
                questions: {
                    id: string;
                    type: 'multiple-choice' | 'image';
                    prompt: string;
                    imageUrl?: string;
                    options: {
                        label: string;
                    }[];
                    correctAnswerIndex: number;
                    explanation: string;
                    hint?: string;
                }[];
            };
        }[]
    >`
        select
            ct.id as track_id,
            ct.slug as track_slug,
            ct.title as track_title,
            ct.description as track_description,
            cl.id,
            cl.slug,
            cl.title,
            cl.difficulty,
            cl.sort_order,
            cl.content_version,
            cl.payload
        from content_lessons cl
        inner join content_tracks ct on ct.id = cl.track_id
        where cl.is_published = true
          and ct.is_published = true
        order by ct.sort_order asc, cl.sort_order asc, cl.created_at asc
    `;

    const trackMap = new Map<string, ApiCatalogTrackSummary>();

    for (const row of rows) {
        const existingTrack = trackMap.get(row.track_id);

        if (existingTrack) {
            existingTrack.lessonIds.push(row.id);
            continue;
        }

        trackMap.set(row.track_id, {
            id: row.track_id,
            slug: row.track_slug,
            title: row.track_title,
            description: row.track_description,
            lessonIds: [row.id],
        });
    }

    return {
        version: buildCatalogVersion(rows.map((row) => row.content_version)),
        initialLessonId: rows[0]?.id ?? null,
        tracks: [...trackMap.values()],
        lessons: rows.map((row) => ({
            id: row.id,
            slug: row.slug,
            title: row.title,
            difficulty: row.difficulty,
            trackId: row.track_id,
            order: row.sort_order,
            payload: row.payload,
        })),
    };
}

async function buildSessionResponse(database: SqlClient, user: ApiUser): Promise<AuthSessionResponse> {
    const access = await signAccessToken({ sub: user.id, email: user.email });
    const refreshToken = generateRefreshToken();
    const refreshTokenHash = hashRefreshToken(refreshToken);
    const refreshTokenExpiresAt = buildRefreshTokenExpiresAt();

    await database`
        insert into auth_refresh_tokens (user_id, token_hash, expires_at)
        values (${user.id}, ${refreshTokenHash}, ${refreshTokenExpiresAt})
    `;

    return {
        accessToken: access.token,
        refreshToken,
        expiresAt: access.expiresAt,
        user,
    };
}

function buildAuthService(app: FastifyInstance, database: SqlClient): AuthService {
    return {
        async register(email, password) {
            const normalizedEmail = email.trim().toLowerCase();
            const existing = await database<{ id: string }[]>`
                select id from app_users where email = ${normalizedEmail} limit 1
            `;

            if (existing.length > 0) {
                return 'conflict';
            }

            const id = randomUUID();
            const passwordHash = await hashPassword(password);

            await database.begin(async (tx) => {
                await tx.unsafe(
                    `
                        insert into app_users (id, email, password_hash)
                        values ($1, $2, $3)
                    `,
                    [id, normalizedEmail, passwordHash]
                );

                await tx.unsafe(
                    `
                        insert into user_preferences (user_id)
                        values ($1)
                        on conflict (user_id) do nothing
                    `,
                    [id]
                );
            });

            return buildSessionResponse(database, { id, email: normalizedEmail });
        },

        async login(email, password) {
            const normalizedEmail = email.trim().toLowerCase();
            const users = await database<{ id: string; email: string; password_hash: string }[]>`
                select id, email, password_hash
                from app_users
                where email = ${normalizedEmail}
                limit 1
            `;

            const user = users[0];
            if (!user) {
                return 'invalid';
            }

            const isValid = await verifyPassword(password, user.password_hash);
            if (!isValid) {
                return 'invalid';
            }

            return buildSessionResponse(database, { id: user.id, email: user.email });
        },

        async refresh(refreshToken) {
            const refreshTokenHash = hashRefreshToken(refreshToken);
            const rows = await database<{ user_id: string; email: string }[]>`
                select art.user_id, au.email
                from auth_refresh_tokens art
                inner join app_users au on au.id = art.user_id
                where art.token_hash = ${refreshTokenHash}
                  and art.revoked_at is null
                  and art.expires_at > now()
                limit 1
            `;

            const row = rows[0];
            if (!row) {
                return 'invalid';
            }

            const response = await database.begin(async (tx) => {
                await tx.unsafe(
                    `
                        update auth_refresh_tokens
                        set revoked_at = now()
                        where token_hash = $1
                    `,
                    [refreshTokenHash]
                );

                const access = await signAccessToken({ sub: row.user_id, email: row.email });
                const nextRefreshToken = generateRefreshToken();
                const nextRefreshTokenHash = hashRefreshToken(nextRefreshToken);
                const nextRefreshTokenExpiresAt = buildRefreshTokenExpiresAt();

                await tx.unsafe(
                    `
                        insert into auth_refresh_tokens (user_id, token_hash, expires_at)
                        values ($1, $2, $3)
                    `,
                    [row.user_id, nextRefreshTokenHash, nextRefreshTokenExpiresAt]
                );

                return {
                    accessToken: access.token,
                    refreshToken: nextRefreshToken,
                    expiresAt: access.expiresAt,
                    user: {
                        id: row.user_id,
                        email: row.email,
                    },
                } satisfies AuthSessionResponse;
            });

            return response;
        },

        async logout(refreshToken) {
            const refreshTokenHash = hashRefreshToken(refreshToken);
            await database`
                update auth_refresh_tokens
                set revoked_at = now()
                where token_hash = ${refreshTokenHash}
                  and revoked_at is null
            `;
        },

        async requestPasswordReset(email) {
            const normalizedEmail = email.trim().toLowerCase();
            const users = await database<{ id: string }[]>`
                select id
                from app_users
                where email = ${normalizedEmail}
                limit 1
            `;

            const user = users[0];
            if (!user) {
                return {
                    accepted: true,
                };
            }

            const resetToken = generateRefreshToken();
            const resetTokenHash = hashRefreshToken(resetToken);
            const expiresAt = buildPasswordResetExpiresAt();

            await database.begin(async (tx) => {
                await tx.unsafe(
                    `
                        update auth_password_reset_tokens
                        set consumed_at = now()
                        where user_id = $1
                          and consumed_at is null
                    `,
                    [user.id]
                );

                await tx.unsafe(
                    `
                        insert into auth_password_reset_tokens (user_id, token_hash, expires_at)
                        values ($1, $2, $3)
                    `,
                    [user.id, resetTokenHash, expiresAt]
                );
            });

            return {
                accepted: true,
                ...(config.exposePasswordResetToken ? { resetToken } : {}),
            };
        },

        async confirmPasswordReset(email, resetToken, password) {
            const normalizedEmail = email.trim().toLowerCase();
            const resetTokenHash = hashRefreshToken(resetToken);

            const result = await database.begin(async (tx) => {
                const rows = await tx.unsafe<{ user_id: string }[]>(
                    `
                        select aprt.user_id
                        from auth_password_reset_tokens aprt
                        inner join app_users au on au.id = aprt.user_id
                        where au.email = $1
                          and aprt.token_hash = $2
                          and aprt.consumed_at is null
                          and aprt.expires_at > now()
                        limit 1
                    `,
                    [normalizedEmail, resetTokenHash]
                );

                const row = rows[0];
                if (!row) {
                    return 'invalid' as const;
                }

                const passwordHash = await hashPassword(password);

                await tx.unsafe(
                    `
                        update app_users
                        set password_hash = $1,
                            updated_at = now()
                        where id = $2
                    `,
                    [passwordHash, row.user_id]
                );

                await tx.unsafe(
                    `
                        update auth_password_reset_tokens
                        set consumed_at = now()
                        where user_id = $1
                          and consumed_at is null
                    `,
                    [row.user_id]
                );

                await tx.unsafe(
                    `
                        update auth_refresh_tokens
                        set revoked_at = now()
                        where user_id = $1
                          and revoked_at is null
                    `,
                    [row.user_id]
                );

                return {
                    success: true,
                } satisfies PasswordResetConfirmResponse;
            });

            return result;
        },

        async requireSession(request) {
            const header = request.headers.authorization;
            const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : null;

            if (!token) {
                throw app.httpErrors.unauthorized('Missing bearer token');
            }

            const session = await verifyAccessToken(token);

            if (!session.userId) {
                throw app.httpErrors.unauthorized('Invalid token');
            }

            return {
                id: session.userId,
                email: session.email,
            };
        },
    };
}

function buildSyncService(database: SqlClient, auth: AuthService): SyncService {
    return {
        requireSession: auth.requireSession,

        async upsertLessonProgress(user, payload) {
            const score = Math.round((payload.correctAnswers / Math.max(payload.totalQuestions, 1)) * 100);

            await database`
                insert into lesson_progress (
                    user_id,
                    lesson_id,
                    status,
                    attempts_count,
                    best_score,
                    last_score,
                    last_answered_at,
                    updated_at
                )
                values (
                    ${user.id},
                    ${payload.lessonId},
                    'completed',
                    1,
                    ${score},
                    ${score},
                    ${payload.answeredAtIso},
                    now()
                )
                on conflict (user_id, lesson_id)
                do update set
                    status = 'completed',
                    attempts_count = lesson_progress.attempts_count + 1,
                    best_score = greatest(lesson_progress.best_score, excluded.last_score),
                    last_score = excluded.last_score,
                    last_answered_at = excluded.last_answered_at,
                    updated_at = now()
            `;
        },

        async upsertReviewCard(user, payload) {
            await database`
                insert into review_cards (
                    user_id,
                    lesson_id,
                    ease_factor,
                    interval_days,
                    repetitions,
                    next_review_at,
                    last_reviewed_at,
                    created_at,
                    updated_at
                )
                values (
                    ${user.id},
                    ${payload.lessonId},
                    ${payload.easeFactor},
                    ${payload.intervalDays},
                    ${payload.repetitions},
                    ${payload.nextReviewAtIso},
                    ${payload.lastReviewedAtIso},
                    ${payload.createdAtIso},
                    now()
                )
                on conflict (user_id, lesson_id)
                do update set
                    ease_factor = excluded.ease_factor,
                    interval_days = excluded.interval_days,
                    repetitions = excluded.repetitions,
                    next_review_at = excluded.next_review_at,
                    last_reviewed_at = excluded.last_reviewed_at,
                    updated_at = now()
            `;
        },
    };
}

export async function buildApp() {
    initializeSentry();
    const app = Fastify({ logger: { level: config.logLevel } });

    await app.register(cors, {
        origin: true,
    });
    await app.register(sensible);
    registerBasicRateLimit(app, {
        windowMs: config.rateLimitWindowMs,
        max: config.rateLimitMax,
        skipPaths: ['/health', '/ready'],
    });

    const auth = buildAuthService(app, sql);
    const sync = buildSyncService(sql, auth);

    await registerHealthRoutes(app, {
        serviceName: config.appName,
        getNow: () => getNow(sql),
    });

    await registerReadinessRoutes(app, {
        serviceName: config.appName,
        checkReady: () => checkReady(sql),
    });

    await registerContentRoutes(app, {
        getCatalog: () => buildCatalog(sql),
    });

    await registerAuthRoutes(app, {
        auth,
    });

    await registerSyncRoutes(app, {
        sync,
    });

    registerSentryErrorHandler(app);

    return app;
}

const isMainModule = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMainModule) {
    const app = await buildApp();

    app.listen({
        port: config.port,
        host: config.host,
    }).catch((error) => {
        captureException(error, {
            phase: 'server_listen',
            host: config.host,
            port: config.port,
        });
        app.log.error(error);
        process.exit(1);
    });
}
