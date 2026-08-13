import { MATERIA_ENERGIA_E_RADIACAO_PRODUCTION_BATCH } from './production-batches';
import { ProductionCurriculumCatalog } from './ProductionCurriculumCatalog';

describe('ProductionCurriculumCatalog', () => {
    it('expõe o lote H4 promovido como uma unidade de 12 sessões e checkpoint final', () => {
        const track = ProductionCurriculumCatalog.listTracks()[0];
        const summaries = ProductionCurriculumCatalog.listLessonSummaries();
        const journey = ProductionCurriculumCatalog.getJourneyTrackDefinition(track.id);
        const unit = journey?.units[0];

        expect(MATERIA_ENERGIA_E_RADIACAO_PRODUCTION_BATCH.state).toBe('promoted');
        expect(track).toMatchObject({
            id: 'track:fundamentos-e-seguranca-radiologica',
            title: 'Matéria, energia e radiação',
        });
        expect(track.lessonIds).toHaveLength(12);
        expect(summaries).toHaveLength(12);
        expect(unit?.id).toBe('unit:materia-energia-e-radiacao');
        expect(unit?.nodes.filter((node) => node.type === 'lesson')).toHaveLength(12);
        expect(unit?.nodes.at(-2)).toMatchObject({
            id: 'node:checkpoint:materia-energia-e-radiacao',
            type: 'checkpoint',
        });
        expect(unit?.nodes.at(-1)?.unlockRule).toEqual({
            requiresNodeIds: ['node:checkpoint:materia-energia-e-radiacao'],
        });
    });

    it('resolve somente atividades e checkpoints pertencentes ao lote promovido', () => {
        const activity = ProductionCurriculumCatalog.getActivityById('activity:materia-energia-e-radiacao:01');
        const checkpoint = ProductionCurriculumCatalog.getCheckpointByNodeId('node:checkpoint:materia-energia-e-radiacao');

        expect(activity?.provenance.contentVersion).toBe(
            MATERIA_ENERGIA_E_RADIACAO_PRODUCTION_BATCH.contentVersion,
        );
        expect(checkpoint?.items).toHaveLength(10);
        expect(ProductionCurriculumCatalog.getActivityById('activity:nao-promovida')).toBeNull();
        expect(ProductionCurriculumCatalog.getCheckpointByNodeId('node:checkpoint:nao-promovido')).toBeNull();
    });
});
