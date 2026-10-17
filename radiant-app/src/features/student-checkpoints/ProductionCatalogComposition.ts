import type { JourneyTrackDefinition } from '../../types/journey';

/** Ordem e pré-requisitos são dados curriculares explícitos, nunca inferidos
 * da posição de importação ou de uma conquista. Não ativa lotes em produção.
 */
export type ProductionTrackComposition = Readonly<{
    trackId: string;
    units: readonly Readonly<{ unitId: string; requiresNodeIds: readonly string[] }>[];
}>;

export function composeProductionTrack(journeys: JourneyTrackDefinition[], composition?: ProductionTrackComposition): JourneyTrackDefinition {
    if (!composition) return journeys[0];
    const byUnit = new Map(journeys.flatMap(journey => journey.units).map(unit => [unit.id, unit]));
    const ids = composition.units.map(unit => unit.unitId);
    if (!ids.length || ids.length !== byUnit.size || new Set(ids).size !== ids.length || ids.some(id => !byUnit.has(id))) {
        throw new Error('[production-catalog] composition-unit-set');
    }
    const units = composition.units.map(entry => {
        const unit = byUnit.get(entry.unitId)!;
        return { ...unit, nodes: unit.nodes.map((node, i) => i === 0 && entry.requiresNodeIds.length
            ? { ...node, unlockRule: { ...node.unlockRule, requiresNodeIds: [...entry.requiresNodeIds] } }
            : node.type === 'reward' ? { ...node, optionalForProgression: true } : node) };
    });
    const nodes = units.flatMap(unit => unit.nodes);
    const indegree = new Map<string, number>();
    const dependents = new Map<string, string[]>();
    const nodeIds = new Set(nodes.map(node => node.id));
    for (const node of nodes) {
        const dependencies = [...new Set(node.unlockRule?.requiresNodeIds ?? [])];
        indegree.set(node.id, dependencies.length);
        for (const required of dependencies) {
            if (!nodeIds.has(required)) throw new Error(`[production-catalog] composition-missing-prerequisite: ${required}`);
            const next = dependents.get(required) ?? [];
            next.push(node.id); dependents.set(required, next);
        }
    }
    const ready = [...indegree].filter(([, value]) => value === 0).map(([id]) => id);
    for (let i = 0; i < ready.length; i += 1) {
        for (const next of dependents.get(ready[i]) ?? []) {
            const remaining = indegree.get(next)! - 1; indegree.set(next, remaining);
            if (!remaining) ready.push(next);
        }
    }
    if (ready.length !== nodes.length) throw new Error('[production-catalog] composition-cycle');
    // Decisão de Anderson em 2026-10-16: avaliação final libera a unidade
    // seguinte; a coleta da conquista não é condição de avanço.
    for (let index = 0; index < composition.units.length; index += 1) {
        const required = composition.units[index].requiresNodeIds;
        if (index === 0) {
            if (required.length) throw new Error('[production-catalog] composition-initial-unit-prerequisite');
        } else {
            const finalCheckpoint = units[index - 1].nodes.filter(node => node.type === 'checkpoint').at(-1);
            if (!finalCheckpoint || required.length !== 1 || required[0] !== finalCheckpoint.id) {
                throw new Error('[production-catalog] composition-requires-final-checkpoint');
            }
        }
    }
    return { ...journeys[0], initialUnitId: units[0].id, units };
}
