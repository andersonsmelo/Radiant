import type { LearningTrack, LessonCatalogSummary } from '../content/content.types';
import type { JourneyNodeDefinition, JourneyTrackDefinition } from '../../types/journey';
import type { LearningActivityV2 } from '../../types/learningActivity';
import { PRODUCTION_BATCHES } from './production-batches';
import type { ProductionBatchV1 } from './ProductionBatch';

type ProductionCheckpoint = ProductionBatchV1['checkpoint'];

function activityTitle(activity: LearningActivityV2): string {
    const presentation = activity.steps.find((step) => step.kind === 'presentation');
    return presentation?.kind === 'presentation' ? presentation.payload.title : activity.id;
}

function trackFor(batch: ProductionBatchV1): LearningTrack {
    return {
        id: batch.trackId,
        slug: 'materia-energia-e-radiacao',
        title: 'Matéria, energia e radiação',
        description: 'Da estrutura atômica à formação de contraste no detector.',
        lessonIds: batch.activities.map((activity) => activity.id),
    };
}

function summariesFor(batch: ProductionBatchV1): LessonCatalogSummary[] {
    return batch.activities.map((activity, index) => ({
        id: activity.id,
        slug: activity.id.split(':').at(-1) ?? String(index + 1),
        title: activityTitle(activity),
        difficulty: index < 4 ? 'beginner' : index < 9 ? 'intermediate' : 'advanced',
        trackId: batch.trackId,
        order: index + 1,
    }));
}

function journeyFor(batch: ProductionBatchV1): JourneyTrackDefinition {
    const lessonNodes: JourneyNodeDefinition[] = batch.activities.map((activity, index) => ({
        id: `node:${activity.id}`,
        unitId: batch.unitId,
        type: 'lesson',
        title: activityTitle(activity),
        lessonId: activity.id,
        blockId: activity.id,
        ...(index > 0 ? { unlockRule: { requiresNodeIds: [`node:${batch.activities[index - 1].id}`] } } : {}),
    }));
    const lastLessonNodeId = lessonNodes.at(-1)?.id;
    const checkpointNodeId = `node:${batch.checkpoint.id}`;
    const nodes: JourneyNodeDefinition[] = [
        ...lessonNodes,
        {
            id: checkpointNodeId,
            unitId: batch.unitId,
            type: 'checkpoint',
            title: 'Checkpoint — Matéria, energia e radiação',
            description: 'Dez itens, dois por competência. A aprovação exige 80%.',
            ...(lastLessonNodeId ? { unlockRule: { requiresNodeIds: [lastLessonNodeId] } } : {}),
        },
        {
            id: 'node:reward:materia-energia-e-radiacao',
            unitId: batch.unitId,
            type: 'reward',
            title: 'Fundamentos da radiação consolidados',
            description: 'Marca a conclusão do primeiro corte curricular por competências.',
            unlockRule: { requiresNodeIds: [checkpointNodeId] },
        },
    ];

    return {
        id: batch.trackId,
        title: 'Matéria, energia e radiação',
        initialUnitId: batch.unitId,
        units: [{ id: batch.unitId, title: 'Matéria, energia e radiação', theme: 'base', nodes }],
    };
}

class ProductionCurriculumCatalogImpl {
    listTracks(): LearningTrack[] {
        return PRODUCTION_BATCHES.map(trackFor);
    }

    listLessonSummaries(): LessonCatalogSummary[] {
        return PRODUCTION_BATCHES.flatMap(summariesFor);
    }

    getActivityById(activityId: string): LearningActivityV2 | null {
        return PRODUCTION_BATCHES.flatMap((batch) => batch.activities)
            .find((activity) => activity.id === activityId) ?? null;
    }

    getCheckpointByNodeId(nodeId: string): ProductionCheckpoint | null {
        return PRODUCTION_BATCHES.find((batch) => `node:${batch.checkpoint.id}` === nodeId)?.checkpoint ?? null;
    }

    getBatchByCheckpointNodeId(nodeId: string): ProductionBatchV1 | null {
        return PRODUCTION_BATCHES.find((batch) => `node:${batch.checkpoint.id}` === nodeId) ?? null;
    }

    getJourneyTrackDefinition(trackId: string): JourneyTrackDefinition | null {
        const batch = PRODUCTION_BATCHES.find((entry) => entry.trackId === trackId);
        return batch ? journeyFor(batch) : null;
    }
}

export const ProductionCurriculumCatalog = new ProductionCurriculumCatalogImpl();
