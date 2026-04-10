import type { LessonBlock } from '../../types/lessonFlow';
import { LESSONS } from '../lessons';

function getLesson(lessonId: string) {
    const lesson = LESSONS.find((entry) => entry.id === lessonId);

    if (!lesson) {
        throw new Error(`[lesson-flow] Missing lesson "${lessonId}"`);
    }

    return lesson;
}

const lesson1 = getLesson('lesson-1');
const lesson2 = getLesson('lesson-2');

export const DEFAULT_LESSON_BLOCKS: LessonBlock[] = [
    {
        id: 'block:lesson-1:intro',
        lessonId: lesson1.id,
        steps: [
            {
                contract: {
                    id: 'lesson-1-context',
                    type: 'context',
                    completionRule: 'displayed',
                    retryRule: 'allow_continue',
                    branching: 'none',
                },
                step: {
                    type: 'context',
                    payload: {
                        eyebrow: 'Unidade 1',
                        title: lesson1.title,
                        body: 'Você vai começar pelo papel dos raios-X e pelo raciocínio básico de contraste e radiopacidade.',
                    },
                },
            },
            {
                contract: {
                    id: 'lesson-1-teach',
                    type: 'teach',
                    completionRule: 'displayed',
                    retryRule: 'allow_continue',
                    branching: 'none',
                },
                step: {
                    type: 'teach',
                    payload: {
                        title: 'Ideia-chave',
                        body: 'Radiologia diagnóstica existe para tornar estruturas internas visíveis de modo comparável, útil e clinicamente interpretável.',
                    },
                },
            },
            {
                contract: {
                    id: 'lesson-1-question',
                    type: 'multiple-choice',
                    completionRule: 'answered',
                    retryRule: 'allow_continue',
                    branching: 'none',
                },
                step: {
                    type: 'multiple-choice',
                    payload: {
                        prompt: lesson1.questions[0].prompt,
                        options: lesson1.questions[0].options.map((option, index) => ({
                            id: `${lesson1.questions[0].id}:option:${index}`,
                            label: option.label,
                        })),
                        correctOptionId: `${lesson1.questions[0].id}:option:${lesson1.questions[0].correctAnswerIndex}`,
                        explanation: lesson1.questions[0].explanation,
                    },
                },
            },
            {
                contract: {
                    id: 'lesson-1-reinforce',
                    type: 'reinforce',
                    completionRule: 'confirmed',
                    retryRule: 'allow_continue',
                    branching: 'none',
                },
                step: {
                    type: 'reinforce',
                    payload: {
                        title: 'Fixe este ponto',
                        body: 'O valor do exame está em distinguir estruturas internas com contraste suficiente para guiar decisão clínica.',
                        tone: 'neutral',
                    },
                },
            },
        ],
    },
    {
        id: 'block:review:lesson-1',
        lessonId: lesson1.id,
        steps: [
            {
                contract: {
                    id: 'review-lesson-1-context',
                    type: 'context',
                    completionRule: 'displayed',
                    retryRule: 'allow_continue',
                    branching: 'none',
                },
                step: {
                    type: 'context',
                    payload: {
                        eyebrow: 'Revisão',
                        title: `Revisar ${lesson1.title}`,
                        body: 'Retome rapidamente o conceito central antes de seguir adiante.',
                    },
                },
            },
            {
                contract: {
                    id: 'review-lesson-1-question',
                    type: 'multiple-choice',
                    completionRule: 'answered',
                    retryRule: 'allow_continue',
                    branching: 'none',
                },
                step: {
                    type: 'multiple-choice',
                    payload: {
                        prompt: lesson1.questions[1].prompt,
                        options: lesson1.questions[1].options.map((option, index) => ({
                            id: `${lesson1.questions[1].id}:option:${index}`,
                            label: option.label,
                        })),
                        correctOptionId: `${lesson1.questions[1].id}:option:${lesson1.questions[1].correctAnswerIndex}`,
                        explanation: lesson1.questions[1].explanation,
                    },
                },
            },
            {
                contract: {
                    id: 'review-lesson-1-reinforce',
                    type: 'reinforce',
                    completionRule: 'confirmed',
                    retryRule: 'allow_continue',
                    branching: 'none',
                },
                step: {
                    type: 'reinforce',
                    payload: {
                        title: 'Revisão consolidada',
                        body: 'Quando a densidade sobe, a estrutura tende a absorver mais raios-X e aparecer mais radiopaca.',
                        tone: 'neutral',
                    },
                },
            },
        ],
    },
    {
        id: 'block:lesson-2:intro',
        lessonId: lesson2.id,
        steps: [
            {
                contract: {
                    id: 'lesson-2-context',
                    type: 'context',
                    completionRule: 'displayed',
                    retryRule: 'allow_continue',
                    branching: 'none',
                },
                step: {
                    type: 'context',
                    payload: {
                        eyebrow: 'Unidade 1',
                        title: lesson2.title,
                        body: 'Agora você entra no raciocínio seccional da tomografia e nas diferenças entre voxel, atenuação e sobreposição.',
                    },
                },
            },
            {
                contract: {
                    id: 'lesson-2-teach',
                    type: 'teach',
                    completionRule: 'displayed',
                    retryRule: 'allow_continue',
                    branching: 'none',
                },
                step: {
                    type: 'teach',
                    payload: {
                        title: 'Ideia-chave',
                        body: 'A tomografia reduz a sobreposição anatômica ao gerar cortes, o que muda a clareza com que enxergamos estruturas internas.',
                    },
                },
            },
            {
                contract: {
                    id: 'lesson-2-question',
                    type: 'multiple-choice',
                    completionRule: 'answered',
                    retryRule: 'allow_continue',
                    branching: 'none',
                },
                step: {
                    type: 'multiple-choice',
                    payload: {
                        prompt: lesson2.questions[2].prompt,
                        options: lesson2.questions[2].options.map((option, index) => ({
                            id: `${lesson2.questions[2].id}:option:${index}`,
                            label: option.label,
                        })),
                        correctOptionId: `${lesson2.questions[2].id}:option:${lesson2.questions[2].correctAnswerIndex}`,
                        explanation: lesson2.questions[2].explanation,
                    },
                },
            },
            {
                contract: {
                    id: 'lesson-2-advance',
                    type: 'advance',
                    completionRule: 'confirmed',
                    retryRule: 'allow_continue',
                    branching: 'none',
                },
                step: {
                    type: 'advance',
                    payload: {
                        title: 'Unidade avançando',
                        body: 'Você fechou mais um nó da estrada e liberou o próximo trecho.',
                    },
                },
            },
        ],
    },
    {
        id: 'block:review:lesson-2',
        lessonId: lesson2.id,
        steps: [
            {
                contract: {
                    id: 'review-lesson-2-context',
                    type: 'context',
                    completionRule: 'displayed',
                    retryRule: 'allow_continue',
                    branching: 'none',
                },
                step: {
                    type: 'context',
                    payload: {
                        eyebrow: 'Revisão',
                        title: `Revisar ${lesson2.title}`,
                        body: 'Faça uma verificação rápida do conceito mais importante desta etapa.',
                    },
                },
            },
            {
                contract: {
                    id: 'review-lesson-2-question',
                    type: 'multiple-choice',
                    completionRule: 'answered',
                    retryRule: 'allow_continue',
                    branching: 'none',
                },
                step: {
                    type: 'multiple-choice',
                    payload: {
                        prompt: lesson2.questions[0].prompt,
                        options: lesson2.questions[0].options.map((option, index) => ({
                            id: `${lesson2.questions[0].id}:option:${index}`,
                            label: option.label,
                        })),
                        correctOptionId: `${lesson2.questions[0].id}:option:${lesson2.questions[0].correctAnswerIndex}`,
                        explanation: lesson2.questions[0].explanation,
                    },
                },
            },
            {
                contract: {
                    id: 'review-lesson-2-reinforce',
                    type: 'reinforce',
                    completionRule: 'confirmed',
                    retryRule: 'allow_continue',
                    branching: 'none',
                },
                step: {
                    type: 'reinforce',
                    payload: {
                        title: 'Revisão consolidada',
                        body: 'Voxel é a unidade volumétrica que sustenta a leitura seccional da tomografia.',
                        tone: 'neutral',
                    },
                },
            },
        ],
    },
];
