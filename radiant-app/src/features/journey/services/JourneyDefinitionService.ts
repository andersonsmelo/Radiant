import { LessonCatalogService } from '../../content/services/LessonCatalogService';
import type { ContentLesson, LearningTrack } from '../../content/content.types';
import type { LessonBlock, LessonStepDefinition } from '../../../types/lessonFlow';
import type { JourneyNodeDefinition, JourneyNodeType, JourneyTrackDefinition, JourneyUnitDefinition } from '../../../types/journey';
import { ProductionCurriculumCatalog } from '../../student-checkpoints/ProductionCurriculumCatalog';

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

function questionSteps(lesson: ContentLesson, prefix: string): LessonStepDefinition[] {
    return lesson.questions.map((question, index) => buildMultipleChoiceStep(
        index === 0 ? `${prefix}-question` : `${prefix}-question:${question.id}`,
        lesson,
        index,
    ));
}

function buildIntroBlock(track: LearningTrack, lesson: ContentLesson, lessonOrder: number): LessonBlock {
    const introCopy = lesson.journey?.intro;
    const steps: LessonStepDefinition[] = [{
        contract: {
            id: `${lesson.id}-context`, type: 'context', completionRule: 'displayed',
            retryRule: 'allow_continue', branching: 'none',
        },
        step: { type: 'context', payload: {
            eyebrow: `Unidade ${lessonOrder}`, title: lesson.title,
            body: introCopy?.contextBody ??
                `Agora você entra em ${lesson.title.toLowerCase()} dentro de ${track.title.toLowerCase()}.`,
        } },
    }];
    if (introCopy?.teachBody?.trim()) {
        steps.push({
            contract: {
                id: `${lesson.id}-teach`, type: 'teach', completionRule: 'displayed',
                retryRule: 'allow_continue', branching: 'none',
            },
            step: { type: 'teach', payload: { title: 'Ideia-chave', body: introCopy.teachBody } },
        });
    }
    steps.push(...questionSteps(lesson, lesson.id));
    return { id: `block:${lesson.id}:intro`, lessonId: lesson.id, sessionMode: 'hybrid-lesson', steps };
}

function displayLessonTitle(rawTitle: string): string {
    return rawTitle.replace(/^Quiz:\s*/i, '').trim();
}

function buildReviewBlock(lesson: ContentLesson): LessonBlock {
    const lessonTitle = displayLessonTitle(lesson.title);
    return {
        id: `block:review:${lesson.id}`,
        lessonId: lesson.id,
        sessionMode: 'hybrid-review',
        steps: [{
            contract: {
                id: `review-${lesson.id}-context`, type: 'context', completionRule: 'displayed',
                retryRule: 'allow_continue', branching: 'none',
            },
            step: { type: 'context', payload: {
                eyebrow: 'Revisão', title: `Revisar ${lessonTitle}`,
                body: lesson.journey?.review?.contextBody ??
                    `Retome rapidamente o conceito central de ${lessonTitle.toLowerCase()} antes de avançar.`,
            } },
        }, ...questionSteps(lesson, `review-${lesson.id}`)],
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

    // Sem checkpoint entre as lições (ADR de 2026-09-28): nas trilhas do
    // catálogo ele era só um botão, sem pergunta nem custo de vida. A lição
    // seguinte exige a anterior. As avaliações da V2 são montadas em
    // `ProductionCurriculumCatalog.journeyFor` e continuam.
    lessons.forEach((lesson, lessonIndex) => {
        const previousLessonNodeId = lessonIndex > 0 ? `node:${lessons[lessonIndex - 1].id}` : null;
        const lessonTitle = displayLessonTitle(lesson.title);

        nodes.push({
            id: `node:${lesson.id}`,
            unitId,
            type: 'lesson',
            title: lessonTitle,
            lessonId: lesson.id,
            blockId: `block:${lesson.id}:intro`,
            unlockRule: previousLessonNodeId
                ? {
                      requiresNodeIds: [previousLessonNodeId],
                  }
                : undefined,
        });

        nodes.push({
            id: `node:review:${lesson.id}`,
            unitId,
            type: 'review',
            title: `Revisar ${lessonTitle}`,
            lessonId: lesson.id,
            blockId: `block:review:${lesson.id}`,
            unlockRule: {
                requiresNodeIds: [`node:${lesson.id}`],
            },
        });
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

    /**
     * O tipo de um nó em qualquer trilha do percurso, ou `null` se o id não
     * existe. A lição usa isto para tratar revisão como prática, sem custo de
     * vida (ADR de 2026-10-16): a rota só carrega o id, e o nó pode estar numa
     * trilha que não é a ativa.
     */
    getNodeType(nodeId: string): JourneyNodeType | null {
        for (const track of LessonCatalogService.listTracks()) {
            const node = this.getTrackDefinition(track.id)
                .units.flatMap((unit) => unit.nodes)
                .find((candidate) => candidate.id === nodeId);
            if (node) return node.type;
        }
        return null;
    }

    getDefaultTrackId(): string | null {
        return LessonCatalogService.listTracks()[0]?.id ?? null;
    }

    getTrackDefinition(trackId?: string): JourneyTrackDefinition {
        if (trackId) {
            const production = ProductionCurriculumCatalog.getJourneyTrackDefinition(trackId);
            if (production) return production;
        }
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
