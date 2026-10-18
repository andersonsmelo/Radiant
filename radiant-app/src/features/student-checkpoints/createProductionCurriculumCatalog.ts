import { composeProductionTrack, type ProductionTrackComposition } from './ProductionCatalogComposition';
import type { LearningTrack, LessonCatalogSummary } from '../content/content.types';
import type { JourneyNodeDefinition, JourneyTrackDefinition } from '../../types/journey';
import type { LearningActivityV2 } from '../../types/learningActivity';
import type { ProductionBatchV1 } from './ProductionBatch';

export type ProductionCatalogEntry = Readonly<{
    batch: ProductionBatchV1;
    presentation: Readonly<{
        slug: string;
        title: string;
        description: string;
        unitTitle: string;
        reward: Readonly<{ id: string; title: string; description: string }>;
    }>;
}>;

type ProductionCheckpoint = ProductionBatchV1['checkpoint'];

function activityTitle(activity: LearningActivityV2): string {
    const presentation = activity.steps.find((step) => step.kind === 'presentation');
    return presentation?.kind === 'presentation' ? presentation.payload.title : activity.id;
}

function trackFor(batch: ProductionBatchV1, presentation: ProductionCatalogEntry['presentation']): LearningTrack {
    return {
        id: batch.trackId,
        slug: presentation.slug,
        title: presentation.title,
        description: presentation.description,
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

function journeyFor(batch: ProductionBatchV1, presentation: ProductionCatalogEntry['presentation']): JourneyTrackDefinition {
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
            description: `${checkpoint.items.length} itens desta competência. A aprovação exige ${checkpoint.targetScoreBasisPoints / 100}%.`,
            ...(lastActivity ? { unlockRule: { requiresNodeIds: [`node:${lastActivity.id}`] } } : {}),
        });

        gate = checkpointNodeId;
    });

    nodes.push({
        id: presentation.reward.id,
        unitId: batch.unitId,
        type: 'reward',
        title: presentation.reward.title,
        description: presentation.reward.description,
        ...(gate ? { unlockRule: { requiresNodeIds: [gate] } } : {}),
    });

    return {
        id: batch.trackId,
        title: presentation.title,
        initialUnitId: batch.unitId,
        units: [{ id: batch.unitId, title: presentation.unitTitle, theme: 'base', nodes }],
    };
}

/** Um catálogo é uma fotografia imutável de lotes já promovidos.
 * Não promove conteúdo, não migra progresso e não registra fixtures em produção.
 * IDs persistidos são explícitos; colisões impedem compor o catálogo.
 */
export function createProductionCurriculumCatalog(input: readonly ProductionCatalogEntry[], compositions: readonly ProductionTrackComposition[] = []) {
    const entries = cloneAndFreeze(input);
    const compositionByTrack = new Map<string, ProductionTrackComposition>();
    for (const composition of compositions) {
        if (compositionByTrack.has(composition.trackId)) throw new Error('[production-catalog] duplicate-track-composition');
        compositionByTrack.set(composition.trackId, cloneAndFreeze(composition));
    }
    const groups = new Map<string, ProductionCatalogEntry[]>();
    const unitJourneys = new Map<string, JourneyTrackDefinition>();
    const tracks: LearningTrack[] = [];
    const summaries: LessonCatalogSummary[] = [];
    const activities = new Map<string, LearningActivityV2>();
    const checkpoints = new Map<string, ProductionCheckpoint>();
    const checkpointBatches = new Map<string, ProductionBatchV1>();
    const journeys = new Map<string, JourneyTrackDefinition>();
    const identities = new Set<string>();
    const slugs = new Set<string>();
    function claim(id: string) {
        if (!id?.trim()) throw new Error('[production-catalog] empty-identity');
        if (identities.has(id)) throw new Error(`[production-catalog] duplicate-identity: ${id}`);
        identities.add(id);
    }
    for (const { batch, presentation } of entries) {
        if (batch.state !== 'promoted') throw new Error('[production-catalog] unpromoted-batch');
        for (const value of [presentation.slug, presentation.title, presentation.description, presentation.unitTitle, presentation.reward.title, presentation.reward.description]) {
            if (!value?.trim()) throw new Error('[production-catalog] missing-presentation-metadata');
        }
        const group = groups.get(batch.trackId);
        if (group) {
            if (!compositionByTrack.has(batch.trackId)) throw new Error(`[production-catalog] duplicate-identity: ${batch.trackId}`);
            const metadata = group[0].presentation;
            if (metadata.slug !== presentation.slug || metadata.title !== presentation.title || metadata.description !== presentation.description) {
                throw new Error('[production-catalog] conflicting-track-metadata');
            }
            group.push({ batch, presentation });
        } else {
            if (slugs.has(presentation.slug)) throw new Error('[production-catalog] duplicate-track-slug');
            slugs.add(presentation.slug);
            claim(batch.trackId);
            groups.set(batch.trackId, [{ batch, presentation }]);
        }
        [batch.batchId, batch.unitId, batch.checkpoint.id].forEach(claim);
        const stages = competencyStages(batch);
        if (!batch.activities.length) throw new Error('[production-catalog] empty-batch');
        for (const activity of batch.activities) {
            claim(activity.id);
            if (!primaryCompetencyOf(activity) || !batch.competencyIds.includes(primaryCompetencyOf(activity)!)) {
                throw new Error('[production-catalog] activity-without-declared-stage');
            }
            activities.set(activity.id, activity);
        }
        for (const item of batch.checkpoint.items) {
            claim(item.id);
            if (!stages.includes(primaryCompetencyOf(item) ?? '')) throw new Error('[production-catalog] orphan-checkpoint-item');
        }
        for (const checkpoint of stageCheckpoints(batch)) {
            claim(checkpoint.id);
            if (!checkpoint.items.length) throw new Error('[production-catalog] empty-stage-checkpoint');
            checkpoints.set(`node:${checkpoint.id}`, cloneAndFreeze(checkpoint));
            checkpointBatches.set(`node:${checkpoint.id}`, batch);
        }
        const journey = journeyFor(batch, presentation);
        journey.units.flatMap(unit => unit.nodes).forEach(node => claim(node.id));
        unitJourneys.set(batch.unitId, journey);
    }
    for (const trackId of compositionByTrack.keys()) {
        if (!groups.has(trackId)) throw new Error('[production-catalog] composition-unknown-track');
    }
    for (const [trackId, group] of groups) {
        const journey = composeProductionTrack(group.map(entry => unitJourneys.get(entry.batch.unitId)!), compositionByTrack.get(trackId));
        const entriesByUnit = new Map(group.map(entry => [entry.batch.unitId, entry]));
        const ordered = journey.units.map(unit => entriesByUnit.get(unit.id)!);
        const track = trackFor(ordered[0].batch, ordered[0].presentation);
        track.lessonIds = ordered.flatMap(entry => entry.batch.activities.map(activity => activity.id));
        const orderedSummaries = ordered.flatMap(entry => summariesFor(entry.batch)).map((summary, i) => ({ ...summary, order: i + 1 }));
        tracks.push(cloneAndFreeze(track));
        summaries.push(...cloneAndFreeze(orderedSummaries));
        journeys.set(trackId, cloneAndFreeze(journey));
    }
    return {
        listTracks: (): LearningTrack[] => [...tracks],
        listLessonSummaries: (): LessonCatalogSummary[] => [...summaries],
        getActivityById: (id: string): LearningActivityV2 | null => activities.get(id) ?? null,
        getCheckpointByNodeId: (id: string): ProductionCheckpoint | null => checkpoints.get(id) ?? null,
        getBatchByCheckpointNodeId: (id: string): ProductionBatchV1 | null => checkpointBatches.get(id) ?? null,
        getJourneyTrackDefinition: (id: string): JourneyTrackDefinition | null => journeys.get(id) ?? null,
    };
}

function cloneAndFreeze<T>(value: T): T {
    if (Array.isArray(value)) return Object.freeze(value.map(entry => cloneAndFreeze(entry))) as T;
    if (value !== null && typeof value === 'object') {
        return Object.freeze(Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, cloneAndFreeze(entry)]))) as T;
    }
    return value;
}
