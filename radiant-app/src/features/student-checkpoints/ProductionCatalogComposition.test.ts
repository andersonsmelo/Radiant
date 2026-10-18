import { createProductionCurriculumCatalog, type ProductionCatalogEntry } from './createProductionCurriculumCatalog';
import { PRODUCTION_CATALOG_ENTRIES } from './production-catalog-entries';
import { auditJourneyCatalog } from '../journey/services/JourneyCatalogAudit';

const first = PRODUCTION_CATALOG_ENTRIES[0];
function second(): ProductionCatalogEntry {
    const batch = JSON.parse(JSON.stringify(first.batch).replaceAll('materia-energia-e-radiacao', 'fixture-unidade-2')) as typeof first.batch;
    return { batch, presentation: { ...first.presentation, unitTitle: 'Unidade sintética 2',
        reward: { ...first.presentation.reward, id: 'node:reward:fixture-unidade-2' } } };
}
const originalJourney = createProductionCurriculumCatalog([first]).getJourneyTrackDefinition(first.batch.trackId)!;
const finalCheckpoint = originalJourney.units[0].nodes.filter(n => n.type === 'checkpoint').at(-1)!.id;
function composition(entry: ProductionCatalogEntry) {
    return [{ trackId: first.batch.trackId, units: [
        { unitId: first.batch.unitId, requiresNodeIds: [] as string[] },
        { unitId: entry.batch.unitId, requiresNodeIds: [finalCheckpoint] },
    ] }];
}

describe('composição explícita de unidades', () => {
    it('ordena dois lotes da mesma área e preserva os IDs e a primeira unidade', () => {
        const entry = second();
        const catalog = createProductionCurriculumCatalog([entry, first], composition(entry));
        const track = catalog.listTracks()[0];
        const journey = catalog.getJourneyTrackDefinition(track.id)!;
        expect(catalog.listTracks()).toHaveLength(1);
        expect(track.lessonIds).toHaveLength(24);
        expect(catalog.listLessonSummaries().map(s => s.order)).toEqual(Array.from({ length: 24 }, (_, i) => i + 1));
        expect(journey.initialUnitId).toBe(first.batch.unitId);
        expect(journey.units[0]).toEqual({ ...originalJourney.units[0], nodes: originalJourney.units[0].nodes.map(node => node.type === 'reward' ? { ...node, optionalForProgression: true } : node) });
        expect(journey.units[1].nodes.at(-1)?.optionalForProgression).toBe(true);
        expect(journey.units[1].nodes[0].unlockRule).toEqual({ requiresNodeIds: [finalCheckpoint] });
        expect(journey.units[1].nodes.at(-1)?.id).toBe(entry.presentation.reward.id);
        const report = auditJourneyCatalog({ tracks: catalog.listTracks(), summaries: catalog.listLessonSummaries(),
            getJourney: id => catalog.getJourneyTrackDefinition(id)!, getActivity: id => catalog.getActivityById(id),
            getCheckpoint: id => catalog.getCheckpointByNodeId(id) });
        expect(report.issues).toEqual([]);
        expect(report.tracks[0].structurallyReachableNodes).toBe(36);
    });
    it('não descarta nem duplica unidade declarada', () => {
        const entry = second(); const plan = composition(entry);
        expect(() => createProductionCurriculumCatalog([first, entry], [{ ...plan[0], units: plan[0].units.slice(0, 1) }])).toThrow(/composition-unit-set/u);
        expect(() => createProductionCurriculumCatalog([first, entry], [{ ...plan[0], units: [plan[0].units[0], plan[0].units[0]] }])).toThrow(/composition-unit-set/u);
    });
    it('recusa pré-requisito ausente e ciclo entre unidades', () => {
        const entry = second(); const plan = composition(entry);
        plan[0].units[1].requiresNodeIds = ['node:missing'];
        expect(() => createProductionCurriculumCatalog([first, entry], plan)).toThrow(/composition-missing-prerequisite/u);
        plan[0].units[1].requiresNodeIds = [finalCheckpoint];
        plan[0].units[0].requiresNodeIds = [entry.presentation.reward.id];
        expect(() => createProductionCurriculumCatalog([first, entry], plan)).toThrow(/composition-cycle/u);
    });
    it('recusa metadados contraditórios para a mesma área', () => {
        const entry = second(); const contradictory = { ...entry, presentation: { ...entry.presentation, title: 'Outro nome de área' } };
        expect(() => createProductionCurriculumCatalog([first, contradictory], composition(entry))).toThrow(/conflicting-track-metadata/u);
    });
    it('recusa plano para trilha inexistente', () => {
        expect(() => createProductionCurriculumCatalog([first], [{ trackId: 'missing', units: [] }])).toThrow(/composition-unknown-track/u);
    });
    it('a conquista opcional não pode ser pré-requisito da unidade seguinte', () => {
        const entry = second(); const plan = composition(entry);
        plan[0].units[1].requiresNodeIds = [first.presentation.reward.id];
        expect(() => createProductionCurriculumCatalog([first, entry], plan)).toThrow(/composition-requires-final-checkpoint/u);
    });
    it('aceita 100 unidades na mesma área com ordem e destinos íntegros', () => {
        const entries = Array.from({ length: 100 }, (_, i) => {
            const entry = second();
            return JSON.parse(JSON.stringify(entry).replaceAll('fixture-unidade-2', `fixture-unidade-${i + 1}`)) as ProductionCatalogEntry;
        });
        const units = entries.map((entry, i) => ({ unitId: entry.batch.unitId, requiresNodeIds: i ? [createProductionCurriculumCatalog([entries[i - 1]]).getJourneyTrackDefinition(first.batch.trackId)!.units[0].nodes.filter(node => node.type === 'checkpoint').at(-1)!.id] : [] }));
        const catalog = createProductionCurriculumCatalog(entries, [{ trackId: first.batch.trackId, units }]);
        expect(catalog.listTracks()).toHaveLength(1);
        expect(catalog.getJourneyTrackDefinition(first.batch.trackId)?.units).toHaveLength(100);
        expect(catalog.listLessonSummaries()).toHaveLength(1200);
        expect(catalog.listLessonSummaries().at(-1)?.order).toBe(1200);
    });
});
