import { auditJourneyCatalog } from './JourneyCatalogAudit';
import type { JourneyNodeDefinition, JourneyTrackDefinition } from '../../../types/journey';

const nodes: JourneyNodeDefinition[] = [
    { id: 'n1', unitId: 'u', type: 'lesson', lessonId: 'l', blockId: 'b', title: 'L' },
    { id: 'n2', unitId: 'u', type: 'reward', title: 'R', unlockRule: { requiresNodeIds: ['n1'] } },
];
function inspect(changedNodes = nodes) {
    const journey: JourneyTrackDefinition = { id: 't', title: 'T', initialUnitId: 'u', units: [{ id: 'u', title: 'U', nodes: changedNodes }] };
    return auditJourneyCatalog({
        tracks: [{ id: 't', slug: 't', title: 'T', description: '', lessonIds: ['l'] }],
        summaries: [{ id: 'l', trackId: 't', slug: 'l', title: 'L', difficulty: 'beginner', order: 1 }],
        getJourney: () => journey, getActivity: () => null, getCheckpoint: () => null,
    });
}
describe('auditoria estrutural do percurso', () => {
    it('detecta atividade sem payload, mesmo quando há resumo e nó', () => {
        expect(inspect().issues).toContainEqual(expect.objectContaining({ code: 'unresolved-activity', id: 'n1' }));
    });
    it('detecta pré-requisito inexistente e impede considerá-lo alcançável', () => {
        const report = inspect([{ ...nodes[0], unlockRule: { requiresNodeIds: ['missing'] } }, nodes[1]]);
        expect(report.issues).toContainEqual(expect.objectContaining({ code: 'missing-prerequisite', id: 'n1' }));
        expect(report.tracks[0].structurallyReachableNodes).toBe(0);
    });
    it('detecta ciclo e seus destinos bloqueados', () => {
        const report = inspect([{ ...nodes[0], unlockRule: { requiresNodeIds: ['n2'] } }, nodes[1]]);
        expect(report.tracks[0].structurallyReachableNodes).toBe(0);
        expect(report.issues.filter(i => i.code === 'unreachable-node').map(i => i.id)).toEqual(['n1', 'n2']);
    });
    it('detecta ID duplicado, unidade incorreta e resumo sem destino', () => {
        const report = inspect([{ ...nodes[1], id: 'n1', unitId: 'wrong' }, nodes[0]]);
        expect(report.issues).toContainEqual(expect.objectContaining({ code: 'duplicate-node', id: 'n1' }));
        expect(report.issues).toContainEqual(expect.objectContaining({ code: 'node-unit-mismatch', id: 'n1' }));
        expect(inspect([nodes[1]]).issues).toContainEqual(expect.objectContaining({ code: 'summary-without-node', id: 'l' }));
    });
    it('detecta checkpoint sem payload', () => {
        expect(inspect([{ id: 'c', unitId: 'u', type: 'checkpoint', title: 'C' }]).issues)
            .toContainEqual(expect.objectContaining({ code: 'unresolved-checkpoint', id: 'c' }));
    });
});
