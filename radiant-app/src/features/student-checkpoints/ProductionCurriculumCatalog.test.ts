import { MATERIA_ENERGIA_E_RADIACAO_PRODUCTION_BATCH } from './production-batches';
import { ProductionCurriculumCatalog } from './ProductionCurriculumCatalog';
import { createProductionCurriculumCatalog } from './createProductionCurriculumCatalog';

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

describe('catálogo de múltiplos lotes independentes', () => {
    const original = MATERIA_ENERGIA_E_RADIACAO_PRODUCTION_BATCH;
    const presentation = {
        slug: 'materia-energia-e-radiacao', title: 'Matéria, energia e radiação',
        description: 'Da estrutura atômica à formação de contraste no detector.',
        unitTitle: 'Matéria, energia e radiação',
        reward: { id: 'node:reward:materia-energia-e-radiacao', title: 'Fundamentos da radiação consolidados', description: 'Marca a conclusão do primeiro corte curricular por competências.' },
    };
    function secondEntry() {
        // Fixture estrutural: jamais registrada na produção ou aprovada como conteúdo.
        const batch = JSON.parse(JSON.stringify(original)
            .replaceAll('materia-energia-e-radiacao', 'fixture-segundo-lote')
            .replaceAll('track:fundamentos-e-seguranca-radiologica', 'track:fixture-segundo-lote')) as typeof original;
        return { batch, presentation: {
            slug: 'fixture-segundo-lote', title: 'Segundo lote sintético', description: 'Somente teste.',
            unitTitle: 'Segunda unidade sintética',
            reward: { id: 'node:reward:fixture-segundo-lote', title: 'Segunda conquista', description: 'Fixture.' },
        } };
    }
    function catalogFor(entries: { batch: typeof original; presentation: typeof presentation }[]) {
        return createProductionCurriculumCatalog(entries);
    }
    it('usa os metadados e a conquista de cada lote, sem colisão', () => {
        const second = secondEntry();
        const catalog = catalogFor([{ batch: original, presentation }, second]);
        expect(catalog.listTracks()[1]).toMatchObject({ title: second.presentation.title, slug: second.presentation.slug });
        const journey = catalog.getJourneyTrackDefinition(second.batch.trackId)!;
        expect(journey.units[0].title).toBe(second.presentation.unitTitle);
        expect(journey.units[0].nodes.at(-1)).toMatchObject(second.presentation.reward);
        const nodes = catalog.listTracks().flatMap(t => catalog.getJourneyTrackDefinition(t.id)!.units.flatMap(u => u.nodes));
        expect(new Set(nodes.map(n => n.id)).size).toBe(nodes.length);
        for (const node of journey.units[0].nodes) {
            if (node.blockId) expect(catalog.getActivityById(node.blockId)?.id).toBe(node.blockId);
            if (node.type === 'checkpoint') expect(catalog.getBatchByCheckpointNodeId(node.id)?.batchId).toBe(second.batch.batchId);
        }
    });
    it('recusa IDs de conquista duplicados', () => {
        const second = secondEntry(); second.presentation.reward.id = presentation.reward.id;
        expect(() => catalogFor([{ batch: original, presentation }, second])).toThrow(/duplicate.*node:reward/u);
    });
    it('recusa sobrepor dois lotes na mesma trilha sem contrato de composição', () => {
        const second = secondEntry(); second.batch = { ...second.batch, trackId: original.trackId };
        expect(() => catalogFor([{ batch: original, presentation }, second])).toThrow(/duplicate.*track:/u);
    });
    it('recusa estágio sem itens', () => {
        const second = secondEntry(); second.batch = { ...second.batch, checkpoint: { ...second.batch.checkpoint, items: [] } };
        expect(() => catalogFor([second])).toThrow(/empty-stage-checkpoint/u);
    });
    it('recusa item de avaliação sem estágio correspondente', () => {
        const second = secondEntry(); second.batch = { ...second.batch, checkpoint: { ...second.batch.checkpoint,
            items: second.batch.checkpoint.items.map((item, i) => i ? item : { ...item, competencyIds: ['competency:orphan'] }),
        } };
        expect(() => catalogFor([second])).toThrow(/orphan-checkpoint-item/u);
    });
    it('preserva integralmente a projeção histórica dos IDs de progresso', () => {
        const catalog = catalogFor([{ batch: original, presentation }]);
        const tracks = catalog.listTracks();
        const view = { tracks, summaries: catalog.listLessonSummaries(), journeys: tracks.map(t => catalog.getJourneyTrackDefinition(t.id)) };
        const { createHash } = jest.requireActual<typeof import('node:crypto')>('node:crypto');
        expect(createHash('sha256').update(JSON.stringify(view)).digest('hex')).toBe('317fcdfb56a98493100bb1e2e884ca860bbf301451ce1bf25e5e447a81c5d5b8');
    });
    it('não altera o snapshot quando o chamador modifica a entrada', () => {
        const entry = secondEntry();
        const catalog = catalogFor([entry]);
        entry.presentation.title = 'Mutação posterior';
        entry.batch.activities[0].provenance.contentVersion = 'mutada';
        expect(catalog.listTracks()[0].title).toBe('Segundo lote sintético');
        expect(catalog.getActivityById(entry.batch.activities[0].id)?.provenance.contentVersion).not.toBe('mutada');
        expect(Object.isFrozen(catalog.getJourneyTrackDefinition(entry.batch.trackId)?.units[0].nodes)).toBe(true);
    });
    it('recusa IDs de atividade reutilizados por outro lote', () => {
        const entry = secondEntry();
        entry.batch = { ...entry.batch, activities: entry.batch.activities.map((a, i) => i ? a : { ...a, id: original.activities[0].id }) };
        expect(() => catalogFor([{ batch: original, presentation }, entry])).toThrow(/duplicate.*activity:/u);
    });
    it('não omite um lote promovido que ainda não tem metadados de apresentação', () => {
        jest.doMock('./production-batches', () => ({
            MATERIA_ENERGIA_E_RADIACAO_PRODUCTION_BATCH: original,
            PRODUCTION_BATCHES: [original, secondEntry().batch],
        }));
        try {
            expect(() => jest.isolateModules(() => {
                jest.requireActual('./production-catalog-entries');
            })).toThrow(/missing-presentation/u);
        } finally { jest.dontMock('./production-batches'); }
    });
    it('projeta 100 lotes / 1.200 atividades e resolve todos os destinos', () => {
        const entries = Array.from({ length: 100 }, (_, i) => JSON.parse(JSON.stringify(secondEntry()).replaceAll('fixture-segundo-lote', `fixture-lote-${i}`)) as ReturnType<typeof secondEntry>);
        const catalog = catalogFor(entries);
        expect(catalog.listTracks()).toHaveLength(100);
        expect(catalog.listLessonSummaries()).toHaveLength(1200);
        const nodes = catalog.listTracks().flatMap(t => catalog.getJourneyTrackDefinition(t.id)!.units.flatMap(u => u.nodes));
        expect(new Set(nodes.map(n => n.id)).size).toBe(nodes.length);
        for (const summary of catalog.listLessonSummaries()) expect(catalog.getActivityById(summary.id)?.id).toBe(summary.id);
    });
});
