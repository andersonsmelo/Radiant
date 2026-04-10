import assert from 'node:assert/strict';
import test from 'node:test';
import Fastify from 'fastify';
import { registerSyncRoutes } from './sync.js';

test('PUT /v1/sync/lesson-progress preserves the contract', async (t) => {
    const app = Fastify();
    t.after(() => app.close());

    const user = {
        id: 'user-1',
        email: 'user@example.com',
    };

    let requireSessionCalls = 0;
    let receivedPayload:
        | {
              userId: string;
              payload: {
                  lessonId: string;
                  totalQuestions: number;
                  correctAnswers: number;
                  answeredAtIso: string;
              };
          }
        | undefined;

    await registerSyncRoutes(app, {
        sync: {
            requireSession: async () => {
                requireSessionCalls += 1;
                return user;
            },
            upsertLessonProgress: async (sessionUser, payload) => {
                receivedPayload = {
                    userId: sessionUser.id,
                    payload,
                };
            },
            upsertReviewCard: async () => undefined,
        },
    });

    const response = await app.inject({
        method: 'PUT',
        url: '/v1/sync/lesson-progress',
        payload: {
            lessonId: 'lesson-1',
            totalQuestions: 10,
            correctAnswers: 8,
            answeredAtIso: '2026-04-01T12:00:00.000Z',
        },
    });

    assert.equal(response.statusCode, 204);
    assert.equal(requireSessionCalls, 1);
    assert.deepEqual(receivedPayload, {
        userId: 'user-1',
        payload: {
            lessonId: 'lesson-1',
            totalQuestions: 10,
            correctAnswers: 8,
            answeredAtIso: '2026-04-01T12:00:00.000Z',
        },
    });
});

test('PUT /v1/sync/lesson-progress rejects invalid payloads', async (t) => {
    const app = Fastify();
    t.after(() => app.close());

    let upsertLessonProgressCalls = 0;

    await registerSyncRoutes(app, {
        sync: {
            requireSession: async () => ({
                id: 'user-1',
                email: 'user@example.com',
            }),
            upsertLessonProgress: async () => {
                upsertLessonProgressCalls += 1;
            },
            upsertReviewCard: async () => undefined,
        },
    });

    const response = await app.inject({
        method: 'PUT',
        url: '/v1/sync/lesson-progress',
        payload: {
            lessonId: '',
            totalQuestions: -1,
            correctAnswers: 8.5,
            answeredAtIso: 'not-an-iso-date',
        },
    });

    assert.equal(response.statusCode, 400);
    assert.deepEqual(response.json(), {
        message: 'Invalid lesson progress payload',
    });
    assert.equal(upsertLessonProgressCalls, 0);
});

test('PUT /v1/sync/review-cards preserves the contract', async (t) => {
    const app = Fastify();
    t.after(() => app.close());

    const user = {
        id: 'user-1',
        email: 'user@example.com',
    };

    let requireSessionCalls = 0;
    let receivedPayload:
        | {
              userId: string;
              payload: {
                  lessonId: string;
                  easeFactor: number;
                  intervalDays: number;
                  repetitions: number;
                  nextReviewAtIso: string;
                  lastReviewedAtIso: string;
                  createdAtIso: string;
              };
          }
        | undefined;

    await registerSyncRoutes(app, {
        sync: {
            requireSession: async () => {
                requireSessionCalls += 1;
                return user;
            },
            upsertLessonProgress: async () => undefined,
            upsertReviewCard: async (sessionUser, payload) => {
                receivedPayload = {
                    userId: sessionUser.id,
                    payload,
                };
            },
        },
    });

    const response = await app.inject({
        method: 'PUT',
        url: '/v1/sync/review-cards',
        payload: {
            lessonId: 'lesson-1',
            easeFactor: 2.5,
            intervalDays: 3,
            repetitions: 2,
            nextReviewAtIso: '2026-04-05T12:00:00.000Z',
            lastReviewedAtIso: '2026-04-02T12:00:00.000Z',
            createdAtIso: '2026-04-01T12:00:00.000Z',
        },
    });

    assert.equal(response.statusCode, 204);
    assert.equal(requireSessionCalls, 1);
    assert.deepEqual(receivedPayload, {
        userId: 'user-1',
        payload: {
            lessonId: 'lesson-1',
            easeFactor: 2.5,
            intervalDays: 3,
            repetitions: 2,
            nextReviewAtIso: '2026-04-05T12:00:00.000Z',
            lastReviewedAtIso: '2026-04-02T12:00:00.000Z',
            createdAtIso: '2026-04-01T12:00:00.000Z',
        },
    });
});

test('PUT /v1/sync/review-cards rejects invalid payloads', async (t) => {
    const app = Fastify();
    t.after(() => app.close());

    let upsertReviewCardCalls = 0;

    await registerSyncRoutes(app, {
        sync: {
            requireSession: async () => ({
                id: 'user-1',
                email: 'user@example.com',
            }),
            upsertLessonProgress: async () => undefined,
            upsertReviewCard: async () => {
                upsertReviewCardCalls += 1;
            },
        },
    });

    const response = await app.inject({
        method: 'PUT',
        url: '/v1/sync/review-cards',
        payload: {
            lessonId: '',
            easeFactor: '2.5',
            intervalDays: -1,
            repetitions: 1.2,
            nextReviewAtIso: 'not-an-iso-date',
            lastReviewedAtIso: 'still-not-an-iso-date',
            createdAtIso: '2026-04-01',
        },
    });

    assert.equal(response.statusCode, 400);
    assert.deepEqual(response.json(), {
        message: 'Invalid review card payload',
    });
    assert.equal(upsertReviewCardCalls, 0);
});
