import { MATERIA_ENERGIA_E_RADIACAO_PRODUCTION_BATCH } from './production-batches';
import { ProductionCurriculumCatalog } from './ProductionCurriculumCatalog';

describe('ProductionCurriculumCatalog', () => {
    it('expõe o lote H4 promovido como uma unidade de 12 sessões', () => {
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
        expect(unit?.nodes.at(-1)).toMatchObject({ type: 'reward' });
    });

    // A regra do dono, decidida em 2026-08-21: **depois de um estágio, uma
    // avaliação abre o estágio seguinte.** Três das quatro trilhas já faziam
    // isso; esta era a exceção — 12 atividades seguidas e uma única avaliação de
    // 10 itens no fim. O estágio aqui é a COMPETÊNCIA, que é o agrupamento que
    // o lote já declarava no dado: as 12 atividades cobrem 5 competências, e os
    // 10 itens da avaliação vinham marcados dois por competência.
    describe('a avaliação por competência fecha cada estágio', () => {
        const track = ProductionCurriculumCatalog.listTracks()[0];
        const unit = ProductionCurriculumCatalog.getJourneyTrackDefinition(track.id)?.units[0];
        const nodes = unit?.nodes ?? [];

        it('intercala uma avaliação ao fim de cada competência', () => {
            const checkpoints = nodes.filter((node) => node.type === 'checkpoint');

            expect(checkpoints).toHaveLength(
                MATERIA_ENERGIA_E_RADIACAO_PRODUCTION_BATCH.competencyIds.length,
            );
            // Nenhuma avaliação é a última coisa antes da conquista por acaso:
            // a sequência termina em atividade, avaliação, conquista.
            expect(nodes.at(-2)?.type).toBe('checkpoint');
        });

        it('nunca deixa duas avaliações seguidas, nem estágio sem avaliação', () => {
            const shape = nodes.map((node) => node.type).join(' ');

            expect(shape).not.toMatch(/checkpoint checkpoint/u);
            // Toda avaliação é precedida por atividade.
            nodes.forEach((node, index) => {
                if (node.type !== 'checkpoint') return;
                expect(nodes[index - 1]?.type).toBe('lesson');
            });
        });

        it('tranca a primeira atividade do estágio seguinte atrás da avaliação anterior', () => {
            const checkpointIndexes = nodes
                .map((node, index) => ({ node, index }))
                .filter(({ node }) => node.type === 'checkpoint');

            for (const { node, index } of checkpointIndexes) {
                const next = nodes[index + 1];
                if (!next || next.type !== 'lesson') continue;
                expect(next.unlockRule).toEqual({ requiresNodeIds: [node.id] });
            }
        });

        it('reparte os dez itens entre as avaliações, dois por competência', () => {
            const checkpoints = nodes.filter((node) => node.type === 'checkpoint');
            const resolved = checkpoints.map((node) =>
                ProductionCurriculumCatalog.getCheckpointByNodeId(node.id),
            );

            expect(resolved.every(Boolean)).toBe(true);
            expect(resolved.map((checkpoint) => checkpoint?.items.length)).toEqual([2, 2, 2, 2, 2]);
            // Nenhum item se perde nem se repete na repartição.
            const repartidos = resolved.flatMap((checkpoint) =>
                (checkpoint?.items ?? []).map((item) => item.id),
            );
            expect(new Set(repartidos).size).toBe(10);
        });

        it('mantém o limiar de aprovação de 80% em cada avaliação', () => {
            // Repartir os itens não afrouxa o critério: 80% de dois itens são os
            // dois. O limiar é do lote e continua sendo, por avaliação.
            const checkpoints = nodes.filter((node) => node.type === 'checkpoint');

            for (const node of checkpoints) {
                expect(
                    ProductionCurriculumCatalog.getCheckpointByNodeId(node.id)?.targetScoreBasisPoints,
                ).toBe(MATERIA_ENERGIA_E_RADIACAO_PRODUCTION_BATCH.checkpoint.targetScoreBasisPoints);
            }
        });
    });

    it('resolve somente atividades e checkpoints pertencentes ao lote promovido', () => {
        const activity = ProductionCurriculumCatalog.getActivityById('activity:materia-energia-e-radiacao:01');

        expect(activity?.provenance.contentVersion).toBe(
            MATERIA_ENERGIA_E_RADIACAO_PRODUCTION_BATCH.contentVersion,
        );
        expect(ProductionCurriculumCatalog.getActivityById('activity:nao-promovida')).toBeNull();
        expect(ProductionCurriculumCatalog.getCheckpointByNodeId('node:checkpoint:nao-promovido')).toBeNull();
    });
});
