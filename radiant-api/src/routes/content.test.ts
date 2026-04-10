import assert from 'node:assert/strict';
import test from 'node:test';
import Fastify from 'fastify';
import { registerContentRoutes } from './content.js';

test('GET /v1/content/catalog returns the launch catalog contract', async (t) => {
    const app = Fastify();
    t.after(() => app.close());

    await registerContentRoutes(app, {
        getCatalog: async () => ({
            version: 'v1-local-seed',
            initialLessonId: 'lesson-1',
            meta: {
                source: 'local',
                generatedAt: '2026-04-09T00:00:00.000Z',
            },
            tracks: [
                {
                    id: 'track-radiology-foundations',
                    slug: 'radiology-foundations',
                    title: 'Fundamentos de Radiologia',
                    description: 'Base inicial para raciocinio radiologico e introducao a TC.',
                    lessonIds: ['lesson-1'],
                },
            ],
            lessons: [
                {
                    id: 'lesson-1',
                    slug: 'fundamentos-de-radiologia',
                    title: 'Fundamentos de Radiologia',
                    difficulty: 'beginner',
                    trackId: 'track-radiology-foundations',
                    order: 1,
                    payload: {
                        id: 'lesson-1',
                        title: 'Fundamentos de Radiologia',
                        difficulty: 'beginner',
                        journey: {
                            intro: {
                                questionIndex: 0,
                                contextBody: 'Contexto remoto de introdução',
                                teachBody: 'Ensino remoto principal',
                                reinforceBody: 'Reforço remoto principal',
                            },
                            review: {
                                questionIndex: 0,
                                contextBody: 'Contexto remoto de revisão',
                                reinforceBody: 'Reforço remoto de revisão',
                            },
                        },
                        questions: [
                            {
                                id: 'q1',
                                type: 'multiple-choice',
                                prompt: 'Pergunta de teste',
                                options: [{ label: 'A' }, { label: 'B' }],
                                correctAnswerIndex: 0,
                                explanation: 'Explicação de teste',
                            },
                        ],
                    },
                },
            ],
        }),
    });

    const response = await app.inject({
        method: 'GET',
        url: '/v1/content/catalog',
    });

    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.json(), {
        version: 'v1-local-seed',
        initialLessonId: 'lesson-1',
        meta: {
            source: 'local',
            generatedAt: '2026-04-09T00:00:00.000Z',
        },
        tracks: [
            {
                id: 'track-radiology-foundations',
                slug: 'radiology-foundations',
                title: 'Fundamentos de Radiologia',
                description: 'Base inicial para raciocinio radiologico e introducao a TC.',
                lessonIds: ['lesson-1'],
            },
        ],
        lessons: [
            {
                id: 'lesson-1',
                slug: 'fundamentos-de-radiologia',
                title: 'Fundamentos de Radiologia',
                difficulty: 'beginner',
                trackId: 'track-radiology-foundations',
                order: 1,
                payload: {
                    id: 'lesson-1',
                    title: 'Fundamentos de Radiologia',
                    difficulty: 'beginner',
                    journey: {
                        intro: {
                            questionIndex: 0,
                            contextBody: 'Contexto remoto de introdução',
                            teachBody: 'Ensino remoto principal',
                            reinforceBody: 'Reforço remoto principal',
                        },
                        review: {
                            questionIndex: 0,
                            contextBody: 'Contexto remoto de revisão',
                            reinforceBody: 'Reforço remoto de revisão',
                        },
                    },
                    questions: [
                        {
                            id: 'q1',
                            type: 'multiple-choice',
                            prompt: 'Pergunta de teste',
                            options: [{ label: 'A' }, { label: 'B' }],
                            correctAnswerIndex: 0,
                            explanation: 'Explicação de teste',
                        },
                    ],
                },
            },
        ],
    });
});
