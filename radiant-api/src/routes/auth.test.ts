import assert from 'node:assert/strict';
import test from 'node:test';
import Fastify from 'fastify';
import { registerAuthRoutes } from './auth.js';

test('auth routes preserve the public contract', async (t) => {
    const app = Fastify();
    t.after(() => app.close());

    const session = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token-1234567890',
        expiresAt: '2026-03-29T12:00:00.000Z',
        user: {
            id: 'user-1',
            email: 'user@example.com',
        },
    };

    await registerAuthRoutes(app, {
        auth: {
            register: async () => session,
            login: async () => 'invalid',
            refresh: async () => session,
            logout: async () => undefined,
            requestPasswordReset: async () => ({
                accepted: true,
                resetToken: 'reset-token-1234567890',
            }),
            confirmPasswordReset: async () => ({
                success: true,
            }),
            requireSession: async () => session.user,
        },
    });

    const registerResponse = await app.inject({
        method: 'POST',
        url: '/v1/auth/register',
        payload: {
            email: 'user@example.com',
            password: 'password123',
        },
    });

    assert.equal(registerResponse.statusCode, 200);
    assert.deepEqual(registerResponse.json(), session);

    const loginResponse = await app.inject({
        method: 'POST',
        url: '/v1/auth/login',
        payload: {
            email: 'user@example.com',
            password: 'password123',
        },
    });

    assert.equal(loginResponse.statusCode, 401);

    const meResponse = await app.inject({
        method: 'GET',
        url: '/v1/auth/me',
    });

    assert.equal(meResponse.statusCode, 200);
    assert.deepEqual(meResponse.json(), {
        user: session.user,
    });

    const refreshResponse = await app.inject({
        method: 'POST',
        url: '/v1/auth/refresh',
        payload: {
            refreshToken: 'refresh-token-1234567890',
        },
    });

    assert.equal(refreshResponse.statusCode, 200);
    assert.deepEqual(refreshResponse.json(), session);

    const logoutResponse = await app.inject({
        method: 'POST',
        url: '/v1/auth/logout',
        payload: {
            refreshToken: 'refresh-token-1234567890',
        },
    });

    assert.equal(logoutResponse.statusCode, 204);

    const requestResetResponse = await app.inject({
        method: 'POST',
        url: '/v1/auth/password-reset/request',
        payload: {
            email: 'user@example.com',
        },
    });

    assert.equal(requestResetResponse.statusCode, 202);
    assert.deepEqual(requestResetResponse.json(), {
        accepted: true,
        resetToken: 'reset-token-1234567890',
    });

    const confirmResetResponse = await app.inject({
        method: 'POST',
        url: '/v1/auth/password-reset/confirm',
        payload: {
            email: 'user@example.com',
            resetToken: 'reset-token-1234567890',
            password: 'new-password-123',
        },
    });

    assert.equal(confirmResetResponse.statusCode, 200);
    assert.deepEqual(confirmResetResponse.json(), {
        success: true,
    });
});

test('auth routes reject invalid payloads before hitting the service layer', async (t) => {
    const app = Fastify();
    t.after(() => app.close());

    let registerCalls = 0;
    let loginCalls = 0;
    let refreshCalls = 0;
    let logoutCalls = 0;
    let requestResetCalls = 0;
    let confirmResetCalls = 0;

    await registerAuthRoutes(app, {
        auth: {
            register: async () => {
                registerCalls += 1;
                return 'conflict';
            },
            login: async () => {
                loginCalls += 1;
                return 'invalid';
            },
            refresh: async () => {
                refreshCalls += 1;
                return 'invalid';
            },
            logout: async () => {
                logoutCalls += 1;
            },
            requestPasswordReset: async () => {
                requestResetCalls += 1;
                return { accepted: true };
            },
            confirmPasswordReset: async () => {
                confirmResetCalls += 1;
                return { success: true };
            },
            requireSession: async () => ({
                id: 'user-1',
                email: 'user@example.com',
            }),
        },
    });

    const registerResponse = await app.inject({
        method: 'POST',
        url: '/v1/auth/register',
        payload: {
            email: 'invalid-email',
            password: 'short',
        },
    });

    const loginResponse = await app.inject({
        method: 'POST',
        url: '/v1/auth/login',
        payload: {
            email: 'user@example.com',
            password: 'short',
        },
    });

    const refreshResponse = await app.inject({
        method: 'POST',
        url: '/v1/auth/refresh',
        payload: {
            refreshToken: 'too-short',
        },
    });

    const logoutResponse = await app.inject({
        method: 'POST',
        url: '/v1/auth/logout',
        payload: {
            refreshToken: 'too-short',
        },
    });

    const requestResetResponse = await app.inject({
        method: 'POST',
        url: '/v1/auth/password-reset/request',
        payload: {
            email: 'invalid-email',
        },
    });

    const confirmResetResponse = await app.inject({
        method: 'POST',
        url: '/v1/auth/password-reset/confirm',
        payload: {
            email: 'user@example.com',
            resetToken: 'too-short',
            password: 'short',
        },
    });

    assert.equal(registerResponse.statusCode, 400);
    assert.deepEqual(registerResponse.json(), {
        message: 'Invalid credentials payload',
    });

    assert.equal(loginResponse.statusCode, 400);
    assert.deepEqual(loginResponse.json(), {
        message: 'Invalid credentials payload',
    });

    assert.equal(refreshResponse.statusCode, 400);
    assert.deepEqual(refreshResponse.json(), {
        message: 'Invalid refresh payload',
    });

    assert.equal(logoutResponse.statusCode, 400);
    assert.deepEqual(logoutResponse.json(), {
        message: 'Invalid refresh payload',
    });

    assert.equal(requestResetResponse.statusCode, 400);
    assert.deepEqual(requestResetResponse.json(), {
        message: 'Invalid password reset request payload',
    });

    assert.equal(confirmResetResponse.statusCode, 400);
    assert.deepEqual(confirmResetResponse.json(), {
        message: 'Invalid password reset confirmation payload',
    });

    assert.equal(registerCalls, 0);
    assert.equal(loginCalls, 0);
    assert.equal(refreshCalls, 0);
    assert.equal(logoutCalls, 0);
    assert.equal(requestResetCalls, 0);
    assert.equal(confirmResetCalls, 0);
});

test('auth routes surface invalid password reset token responses', async (t) => {
    const app = Fastify();
    t.after(() => app.close());

    let confirmResetCalls = 0;

    await registerAuthRoutes(app, {
        auth: {
            register: async () => 'conflict',
            login: async () => 'invalid',
            refresh: async () => 'invalid',
            logout: async () => undefined,
            requestPasswordReset: async () => ({ accepted: true }),
            confirmPasswordReset: async () => {
                confirmResetCalls += 1;
                return 'invalid';
            },
            requireSession: async () => ({
                id: 'user-1',
                email: 'user@example.com',
            }),
        },
    });

    const response = await app.inject({
        method: 'POST',
        url: '/v1/auth/password-reset/confirm',
        payload: {
            email: 'user@example.com',
            resetToken: 'reset-token-1234567890',
            password: 'new-password-123',
        },
    });

    assert.equal(response.statusCode, 400);
    assert.deepEqual(response.json(), {
        message: 'Invalid or expired password reset token',
    });
    assert.equal(confirmResetCalls, 1);
});
