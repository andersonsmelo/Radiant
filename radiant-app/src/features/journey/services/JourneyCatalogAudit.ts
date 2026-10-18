import type { LearningTrack, LessonCatalogSummary } from '../../content/content.types';
import type { JourneyTrackDefinition } from '../../../types/journey';
import type { LearningActivityV2 } from '../../../types/learningActivity';
import { validateLearningActivity } from '../../../types/learningActivity';
import type { ProductionBatchV1 } from '../../student-checkpoints/ProductionBatch';

type AuditInput = {
    tracks: LearningTrack[];
    summaries: LessonCatalogSummary[];
    getJourney: (id: string) => JourneyTrackDefinition;
    getActivity: (id: string) => LearningActivityV2 | null;
    getCheckpoint: (id: string) => ProductionBatchV1['checkpoint'] | null;
};
type AuditIssue = { code: string; id: string; detail?: string };

/** Auditoria sem storage/rede. Alcançabilidade é do grafo, supondo requisitos
 * concluídos; não prova disponibilidade por vidas, calendário ou perfil real.
 */
export function auditJourneyCatalog(input: AuditInput) {
    const issues: AuditIssue[] = [];
    const globalNodes = new Set<string>();
    const globalUnits = new Set<string>();
    const trackIds = new Set<string>();
    const summaryIds = new Set<string>();
    const add = (code: string, id: string, detail?: string) => issues.push({ code, id, ...(detail ? { detail } : {}) });
    for (const track of input.tracks) {
        if (trackIds.has(track.id)) add('duplicate-track', track.id);
        trackIds.add(track.id);
    }
    for (const summary of input.summaries) {
        if (summaryIds.has(summary.id)) add('duplicate-summary', summary.id);
        summaryIds.add(summary.id);
        if (!trackIds.has(summary.trackId)) add('summary-without-track', summary.id);
    }
    const tracks = input.tracks.map(track => {
        const journey = input.getJourney(track.id);
        if (journey.id !== track.id) add('journey-track-mismatch', track.id);
        if (!journey.units.some(unit => unit.id === journey.initialUnitId)) add('missing-initial-unit', track.id);
        for (const unit of journey.units) {
            if (globalUnits.has(unit.id)) add('duplicate-unit', unit.id);
            globalUnits.add(unit.id);
            for (const node of unit.nodes) if (node.unitId !== unit.id) add('node-unit-mismatch', node.id);
        }
        const nodes = journey.units.flatMap(unit => unit.nodes);
        const byId = new Map(nodes.map(node => [node.id, node]));
        const dependencies = new Map<string, number>();
        const dependents = new Map<string, string[]>();
        for (const node of nodes) {
            if (globalNodes.has(node.id)) add('duplicate-node', node.id);
            globalNodes.add(node.id);
            const required = [...new Set(node.unlockRule?.requiresNodeIds ?? [])];
            dependencies.set(node.id, required.length);
            for (const prerequisite of required) {
                if (!byId.has(prerequisite)) add('missing-prerequisite', node.id, prerequisite);
                const next = dependents.get(prerequisite) ?? [];
                next.push(node.id); dependents.set(prerequisite, next);
            }
        }
        const ready = [...dependencies].filter(([, count]) => count === 0).map(([id]) => id);
        const reached = new Set<string>();
        for (let index = 0; index < ready.length; index += 1) {
            const id = ready[index]; reached.add(id);
            for (const dependent of dependents.get(id) ?? []) {
                const remaining = dependencies.get(dependent)! - 1;
                dependencies.set(dependent, remaining);
                if (remaining === 0) ready.push(dependent);
            }
        }
        for (const node of nodes) if (!reached.has(node.id)) add('unreachable-node', node.id);
        const trackSummaries = input.summaries.filter(summary => summary.trackId === track.id);
        for (const summary of trackSummaries) {
            if (!track.lessonIds.includes(summary.id)) add('summary-outside-track-list', summary.id);
            if (!nodes.some(node => node.lessonId === summary.id && node.blockId)) add('summary-without-node', summary.id);
        }
        for (const id of track.lessonIds) if (!trackSummaries.some(summary => summary.id === id)) add('track-lesson-without-summary', id);
        const interactionTypes: Record<string, number> = {};
        const evidenceKinds: Record<string, number> = {};
        const nodeTypes: Record<string, number> = {};
        const competencyIds = new Set<string>();
        const sourceIds = new Set<string>();
        const contentVersions = new Set<string>();
        const mediaRefs = new Set<string>();
        const optionIds = new Set<string>();
        let resolvedActivityNodes = 0;
        let resolvedCheckpointNodes = 0;
        let checkpointItems = 0;
        for (const node of nodes) {
            nodeTypes[node.type] = (nodeTypes[node.type] ?? 0) + 1;
            if (node.type === 'checkpoint') {
                const checkpoint = input.getCheckpoint(node.id);
                if (!checkpoint) add('unresolved-checkpoint', node.id);
                else {
                    resolvedCheckpointNodes += 1; checkpointItems += checkpoint.items.length;
                    if (!checkpoint.items.length) add('empty-checkpoint', node.id);
                }
            }
            if (node.type !== 'lesson' && node.type !== 'review') continue;
            let activity: LearningActivityV2 | null = null;
            try { activity = node.blockId ? input.getActivity(node.blockId) : null; }
            catch (error) { add('activity-resolution-error', node.id, String(error)); }
            if (!activity) { add('unresolved-activity', node.id); continue; }
            resolvedActivityNodes += 1;
            for (const issue of validateLearningActivity(activity)) add('invalid-activity', node.id, `${issue.path}:${issue.rule}`);
            activity.competencyIds.forEach(id => competencyIds.add(id));
            activity.provenance.sourceIds.forEach(id => sourceIds.add(id));
            contentVersions.add(activity.provenance.contentVersion);
            for (const step of activity.steps) {
                if (step.kind === 'presentation') {
                    if (step.payload.imageRef) mediaRefs.add(step.payload.imageRef);
                } else {
                    const interaction = step.interaction;
                    interactionTypes[interaction.type] = (interactionTypes[interaction.type] ?? 0) + 1;
                    evidenceKinds[interaction.evidenceKind] = (evidenceKinds[interaction.evidenceKind] ?? 0) + 1;
                    if (interaction.type === 'multiple-choice') interaction.payload.options.forEach(option => optionIds.add(option.id));
                }
            }
        }
        return {
            trackId: track.id, nodes: nodes.length, structurallyReachableNodes: reached.size,
            resolvedActivityNodes, resolvedCheckpointNodes, checkpointItems, nodeTypes, interactionTypes, evidenceKinds,
            competencyIds: [...competencyIds], sourceIds: [...sourceIds], contentVersions: [...contentVersions],
            presentationMediaRefs: [...mediaRefs], multipleChoiceOptionIds: [...optionIds],
        };
    });
    return { issues, tracks };
}
