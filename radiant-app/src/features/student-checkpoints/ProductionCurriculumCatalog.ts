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

/** Nome curto da competência, usado no id da avaliação e no título do nó. */
function competencySlug(competencyId: string): string {
    return competencyId.split(':').at(-1) ?? competencyId;
}

/**
 * A competência de uma atividade ou de um item de avaliação.
 *
 * O campo é uma LISTA no dado editorial, mas o corte curricular deste lote
 * mantém um item por competência. Ler a primeira é o contrato; se um dia
 * aparecer item multi-competência, ele cai no estágio da primeira, que é
 * determinístico e revisável — não some.
 */
function primaryCompetencyOf(entry: { competencyIds?: readonly string[] }): string | null {
    return entry.competencyIds?.[0] ?? null;
}

/**
 * As competências na ordem em que o aluno as encontra.
 *
 * Deriva da ordem das ATIVIDADES, e não da lista `competencyIds` do lote: é a
 * sequência que o aluno percorre que define os estágios, e as duas poderiam
 * divergir sem que nada avisasse.
 */
function competencyStages(batch: ProductionBatchV1): string[] {
    const seen: string[] = [];
    for (const activity of batch.activities) {
        const competency = primaryCompetencyOf(activity);
        if (competency && !seen.includes(competency)) seen.push(competency);
    }
    return seen;
}

/**
 * A avaliação de um estágio: os itens do lote que cobrem aquela competência.
 *
 * **Decisão do dono, 2026-08-21:** depois de um estágio, uma avaliação abre o
 * seguinte. Este lote era a exceção — 12 atividades seguidas e uma única
 * avaliação de 10 itens no fim —, e o estágio aqui é a competência, que já era
 * o agrupamento declarado no dado.
 *
 * O limiar não é afrouxado pela repartição: cada avaliação herda o
 * `targetScoreBasisPoints` do lote. 80% de dois itens são os dois.
 */
function checkpointForStage(batch: ProductionBatchV1, competencyId: string): ProductionCheckpoint {
    return {
        ...batch.checkpoint,
        id: `${batch.checkpoint.id}:${competencySlug(competencyId)}`,
        items: batch.checkpoint.items.filter((item) => primaryCompetencyOf(item) === competencyId),
    };
}

function stageCheckpoints(batch: ProductionBatchV1): ProductionCheckpoint[] {
    return competencyStages(batch).map((competencyId) => checkpointForStage(batch, competencyId));
}

function journeyFor(batch: ProductionBatchV1): JourneyTrackDefinition {
    const stages = competencyStages(batch);
    const nodes: JourneyNodeDefinition[] = [];
    /** O nó que a próxima atividade precisa ter concluído — a avaliação do estágio anterior. */
    let gate: string | null = null;

    stages.forEach((competencyId, stageIndex) => {
        const activities = batch.activities.filter(
            (activity) => primaryCompetencyOf(activity) === competencyId,
        );

        activities.forEach((activity, activityIndex) => {
            const previous = activityIndex > 0 ? `node:${activities[activityIndex - 1].id}` : gate;

            nodes.push({
                id: `node:${activity.id}`,
                unitId: batch.unitId,
                type: 'lesson',
                title: activityTitle(activity),
                lessonId: activity.id,
                blockId: activity.id,
                ...(previous ? { unlockRule: { requiresNodeIds: [previous] } } : {}),
            });
        });

        const lastActivity = activities.at(-1);
        const checkpoint = checkpointForStage(batch, competencyId);
        const checkpointNodeId = `node:${checkpoint.id}`;

        nodes.push({
            id: checkpointNodeId,
            unitId: batch.unitId,
            type: 'checkpoint',
            title: `Avaliação ${stageIndex + 1} de ${stages.length}`,
            description: `${checkpoint.items.length} itens desta competência. A aprovação exige 80%.`,
            ...(lastActivity ? { unlockRule: { requiresNodeIds: [`node:${lastActivity.id}`] } } : {}),
        });

        gate = checkpointNodeId;
    });

    nodes.push({
        id: 'node:reward:materia-energia-e-radiacao',
        unitId: batch.unitId,
        type: 'reward',
        title: 'Fundamentos da radiação consolidados',
        description: 'Marca a conclusão do primeiro corte curricular por competências.',
        ...(gate ? { unlockRule: { requiresNodeIds: [gate] } } : {}),
    });

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
        for (const batch of PRODUCTION_BATCHES) {
            const stage = stageCheckpoints(batch).find(
                (checkpoint) => `node:${checkpoint.id}` === nodeId,
            );
            if (stage) return stage;
        }
        return null;
    }

    getBatchByCheckpointNodeId(nodeId: string): ProductionBatchV1 | null {
        return (
            PRODUCTION_BATCHES.find((batch) =>
                stageCheckpoints(batch).some((checkpoint) => `node:${checkpoint.id}` === nodeId),
            ) ?? null
        );
    }

    getJourneyTrackDefinition(trackId: string): JourneyTrackDefinition | null {
        const batch = PRODUCTION_BATCHES.find((entry) => entry.trackId === trackId);
        return batch ? journeyFor(batch) : null;
    }
}

export const ProductionCurriculumCatalog = new ProductionCurriculumCatalogImpl();
