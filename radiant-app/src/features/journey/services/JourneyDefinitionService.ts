import { LessonCatalogService } from '../../content/services/LessonCatalogService';
import type { ContentLesson, LearningTrack } from '../../content/content.types';
import type { LessonBlock, LessonStepDefinition } from '../../../types/lessonFlow';
import type { JourneyNodeDefinition, JourneyTrackDefinition, JourneyUnitDefinition } from '../../../types/journey';

const EMPTY_JOURNEY_ID = 'learning-road-v2';
const JOURNEY_TITLE = 'Estrada de aprendizado';

function slugSegment(value: string): string {
    return value.split('-').filter(Boolean).pop() ?? value;
}

function buildMultipleChoiceStep(stepId: string, lesson: ContentLesson, questionIndex: number): LessonStepDefinition {
    const question = lesson.questions[questionIndex] ?? lesson.questions[0];

    return {
        contract: {
            id: stepId,
            type: 'multiple-choice',
            completionRule: 'answered',
            retryRule: 'allow_continue',
            branching: 'none',
        },
        step: {
            type: 'multiple-choice',
            payload: {
                prompt: question.prompt,
                options: question.options.map((option, index) => ({
                    id: `${question.id}:option:${index}`,
                    label: option.label,
                })),
                correctOptionId: `${question.id}:option:${question.correctAnswerIndex}`,
                explanation: question.explanation,
            },
        },
    };
}

function resolveQuestionIndex(lesson: ContentLesson, preferredIndex: number | undefined, fallbackIndex: number): number {
    if (typeof preferredIndex === 'number' && lesson.questions[preferredIndex]) {
        return preferredIndex;
    }

    return lesson.questions[fallbackIndex] ? fallbackIndex : 0;
}

function buildIntroBlock(track: LearningTrack, lesson: ContentLesson, lessonOrder: number): LessonBlock {
    const introCopy = lesson.journey?.intro;
    const questionIndex = resolveQuestionIndex(lesson, introCopy?.questionIndex, 0);

    return {
        id: `block:${lesson.id}:intro`,
        lessonId: lesson.id,
        steps: [
            {
                contract: {
                    id: `${lesson.id}-context`,
                    type: 'context',
                    completionRule: 'displayed',
                    retryRule: 'allow_continue',
                    branching: 'none',
                },
                step: {
                    type: 'context',
                    payload: {
                        eyebrow: `Unidade ${lessonOrder}`,
                        title: lesson.title,
                        body:
                            introCopy?.contextBody ??
                            `Agora você entra em ${lesson.title.toLowerCase()} dentro de ${track.title.toLowerCase()}.`,
                    },
                },
            },
            {
                contract: {
                    id: `${lesson.id}-teach`,
                    type: 'teach',
                    completionRule: 'displayed',
                    retryRule: 'allow_continue',
                    branching: 'none',
                },
                step: {
                    type: 'teach',
                    payload: {
                        title: 'Ideia-chave',
                        body:
                            introCopy?.teachBody ??
                            `O objetivo desta etapa é consolidar o conceito central de ${lesson.title.toLowerCase()} antes do quiz.`,
                    },
                },
            },
            buildMultipleChoiceStep(`${lesson.id}-question`, lesson, questionIndex),
            {
                contract: {
                    id: `${lesson.id}-reinforce`,
                    type: 'reinforce',
                    completionRule: 'confirmed',
                    retryRule: 'allow_continue',
                    branching: 'none',
                },
                step: {
                    type: 'reinforce',
                    payload: {
                        title: 'Fixe este ponto',
                        body:
                            introCopy?.reinforceBody ??
                            `Se este conceito ficar claro, a próxima parte de ${track.title.toLowerCase()} anda com menos atrito.`,
                        tone: 'neutral',
                    },
                },
            },
        ],
    };
}

function buildReviewBlock(lesson: ContentLesson): LessonBlock {
    const reviewCopy = lesson.journey?.review;
    const questionIndex = resolveQuestionIndex(lesson, reviewCopy?.questionIndex, 1);

    return {
        id: `block:review:${lesson.id}`,
        lessonId: lesson.id,
        steps: [
            {
                contract: {
                    id: `review-${lesson.id}-context`,
                    type: 'context',
                    completionRule: 'displayed',
                    retryRule: 'allow_continue',
                    branching: 'none',
                },
                step: {
                    type: 'context',
                    payload: {
                        eyebrow: 'Revisão',
                        title: `Revisar ${lesson.title}`,
                        body:
                            reviewCopy?.contextBody ??
                            `Retome rapidamente o conceito central de ${lesson.title.toLowerCase()} antes de avançar.`,
                    },
                },
            },
            buildMultipleChoiceStep(`review-${lesson.id}-question`, lesson, questionIndex),
            {
                contract: {
                    id: `review-${lesson.id}-reinforce`,
                    type: 'reinforce',
                    completionRule: 'confirmed',
                    retryRule: 'allow_continue',
                    branching: 'none',
                },
                step: {
                    type: 'reinforce',
                    payload: {
                        title: 'Revisão consolidada',
                        body:
                            reviewCopy?.reinforceBody ??
                            `Se essa revisão sair natural, ${lesson.title.toLowerCase()} já está virando repertório.`,
                        tone: 'neutral',
                    },
                },
            },
        ],
    };
}

function resolveTrackLessons(track: LearningTrack): ContentLesson[] {
    const lessonSummaries = LessonCatalogService.listLessonSummaries()
        .filter((lesson) => lesson.trackId === track.id)
        .sort((left, right) => left.order - right.order);

    if (lessonSummaries.length > 0) {
        return lessonSummaries
            .map((lesson) => LessonCatalogService.getLessonById(lesson.id))
            .filter((lesson): lesson is ContentLesson => Boolean(lesson));
    }

    return track.lessonIds
        .map((lessonId) => LessonCatalogService.getLessonById(lessonId))
        .filter((lesson): lesson is ContentLesson => Boolean(lesson));
}

function checkpointNodeId(track: LearningTrack, lesson: ContentLesson, lessonIndex: number, lessonCount: number): string {
    const trackSegment = slugSegment(track.slug || track.id);

    if (lessonCount === 2 && lessonIndex === 0) {
        return `node:checkpoint:${trackSegment}`;
    }

    return `node:checkpoint:${trackSegment}:${lesson.id}`;
}

function rewardNodeId(track: LearningTrack, lessonCount: number): string {
    const trackSegment = slugSegment(track.slug || track.id);

    if (lessonCount <= 2) {
        return `node:reward:${trackSegment}`;
    }

    return `node:reward:${trackSegment}:final`;
}

function buildUnit(track: LearningTrack, trackIndex: number, lessons: ContentLesson[]): JourneyUnitDefinition {
    const unitId = trackIndex === 0 ? 'unit-radiology-foundations-1' : `unit:${track.id}`;
    const nodes: JourneyNodeDefinition[] = [];

    lessons.forEach((lesson, lessonIndex) => {
        const previousCheckpointId =
            lessonIndex > 0 ? checkpointNodeId(track, lessons[lessonIndex - 1], lessonIndex - 1, lessons.length) : null;

        nodes.push({
            id: `node:${lesson.id}`,
            unitId,
            type: 'lesson',
            title: lesson.title,
            lessonId: lesson.id,
            blockId: `block:${lesson.id}:intro`,
            unlockRule: previousCheckpointId
                ? {
                      requiresNodeIds: [previousCheckpointId],
                  }
                : undefined,
        });

        nodes.push({
            id: `node:review:${lesson.id}`,
            unitId,
            type: 'review',
            title: `Revisar ${lesson.title}`,
            lessonId: lesson.id,
            blockId: `block:review:${lesson.id}`,
            unlockRule: {
                requiresNodeIds: [`node:${lesson.id}`],
            },
        });

        if (lessonIndex < lessons.length - 1) {
            nodes.push({
                id: checkpointNodeId(track, lesson, lessonIndex, lessons.length),
                unitId,
                type: 'checkpoint',
                title: lessonIndex === lessons.length - 2 ? 'Checkpoint da unidade' : `Checkpoint ${lessonIndex + 1}`,
                description:
                    lessonIndex === lessons.length - 2
                        ? 'Fecha a etapa atual antes de avançar.'
                        : 'Valida este trecho antes de abrir a próxima lição.',
                unlockRule: {
                    requiresNodeIds: [`node:${lesson.id}`],
                },
            });
        }
    });

    const lastLesson = lessons[lessons.length - 1];

    if (lastLesson) {
        nodes.push({
            id: rewardNodeId(track, lessons.length),
            unitId,
            type: 'reward',
            title: lessons.length <= 2 ? 'Conquista inicial' : 'Conquista da unidade',
            description: 'Marca a conclusão desta etapa da trilha.',
            unlockRule: {
                requiresNodeIds: [`node:${lastLesson.id}`],
            },
        });
    }

    return {
        id: unitId,
        title: track.title,
        theme: 'base',
        nodes,
    };
}

type TrackLessonEntry = {
    track: LearningTrack;
    lessons: ContentLesson[];
    trackIndex: number;
};

class JourneyDefinitionServiceImpl {
    getLessonBlocks(): LessonBlock[] {
        return LessonCatalogService.listTracks().flatMap((track) =>
            resolveTrackLessons(track).flatMap((lesson, lessonIndex) => [
                buildIntroBlock(track, lesson, lessonIndex + 1),
                buildReviewBlock(lesson),
            ])
        );
    }

    getBlockById(blockId: string): LessonBlock | null {
        return this.getLessonBlocks().find((block) => block.id === blockId) ?? null;
    }

    getDefaultTrackId(): string | null {
        return LessonCatalogService.listTracks()[0]?.id ?? null;
    }

    getTrackDefinition(trackId?: string): JourneyTrackDefinition {
        const entries: TrackLessonEntry[] = LessonCatalogService.listTracks()
            .map((track, trackIndex) => ({
                track,
                lessons: resolveTrackLessons(track),
                trackIndex,
            }))
            .filter((entry) => entry.lessons.length > 0);

        const selectedEntry = trackId
            ? entries.find((entry) => entry.track.id === trackId)
            : entries[0];

        if (!selectedEntry) {
            return {
                id: trackId ?? EMPTY_JOURNEY_ID,
                title: JOURNEY_TITLE,
                initialUnitId: 'unit-empty',
                units: [
                    {
                        id: 'unit-empty',
                        title: 'Sua trilha',
                        theme: 'base',
                        nodes: [],
                    },
                ],
            };
        }

        const unit = buildUnit(selectedEntry.track, selectedEntry.trackIndex, selectedEntry.lessons);

        return {
            id: selectedEntry.track.id,
            title: selectedEntry.track.title,
            initialUnitId: unit.id,
            units: [unit],
        };
    }
}

export const JourneyDefinitionService = new JourneyDefinitionServiceImpl();
