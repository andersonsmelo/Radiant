import type { FastifyInstance, FastifyRequest } from 'fastify';
import type {
    ApiUser,
    AuthSessionResponse,
    PasswordResetConfirmResponse,
    PasswordResetRequestResponse,
} from '../types.js';
import {
    credentialsSchema,
    passwordResetConfirmSchema,
    passwordResetRequestSchema,
    refreshTokenSchema,
} from '../schemas/auth.js';

export interface AuthRouteService {
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

export interface AuthRouteDependencies {
    auth: AuthRouteService;
}

export async function registerAuthRoutes(app: FastifyInstance, deps: AuthRouteDependencies) {
    app.post('/v1/auth/register', async (request, reply) => {
        const parsed = credentialsSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.status(400).send({ message: 'Invalid credentials payload' });
        }

        const result = await deps.auth.register(parsed.data.email, parsed.data.password);
        if (result === 'conflict') {
            return reply.status(409).send({ message: 'User already exists' });
        }

        return result;
    });

    app.post('/v1/auth/login', async (request, reply) => {
        const parsed = credentialsSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.status(400).send({ message: 'Invalid credentials payload' });
        }

        const result = await deps.auth.login(parsed.data.email, parsed.data.password);
        if (result === 'invalid') {
            return reply.status(401).send({ message: 'Invalid email or password' });
        }

        return result;
    });

    app.get('/v1/auth/me', async (request, reply) => {
        const user = await deps.auth.requireSession(request);
        if (!user.id) {
            return reply.status(401).send({ message: 'Invalid token' });
        }

        return {
            user,
        };
    });

    app.post('/v1/auth/refresh', async (request, reply) => {
        const parsed = refreshTokenSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.status(400).send({ message: 'Invalid refresh payload' });
        }

        const result = await deps.auth.refresh(parsed.data.refreshToken);
        if (result === 'invalid') {
            return reply.status(401).send({ message: 'Invalid refresh token' });
        }

        return reply.send(result);
    });

    app.post('/v1/auth/logout', async (request, reply) => {
        const parsed = refreshTokenSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.status(400).send({ message: 'Invalid refresh payload' });
        }

        await deps.auth.logout(parsed.data.refreshToken);
        return reply.status(204).send();
    });

    app.post('/v1/auth/password-reset/request', async (request, reply) => {
        const parsed = passwordResetRequestSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.status(400).send({ message: 'Invalid password reset request payload' });
        }

        const result = await deps.auth.requestPasswordReset(parsed.data.email);
        return reply.status(202).send(result);
    });

    app.post('/v1/auth/password-reset/confirm', async (request, reply) => {
        const parsed = passwordResetConfirmSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.status(400).send({ message: 'Invalid password reset confirmation payload' });
        }

        const result = await deps.auth.confirmPasswordReset(
            parsed.data.email,
            parsed.data.resetToken,
            parsed.data.password
        );
        if (result === 'invalid') {
            return reply.status(400).send({ message: 'Invalid or expired password reset token' });
        }

        return reply.send(result);
    });
}
