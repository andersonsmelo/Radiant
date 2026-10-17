import { PRODUCTION_BATCHES } from './production-batches';
import type { ProductionCatalogEntry } from './createProductionCurriculumCatalog';

/** Registro compilado de apresentação, separado do material clínico aprovado.
 * Preserva a projeção histórica e todos os IDs persistidos do lote H4.
 * Novas entradas exigem lote promovido e apresentação revisada; nenhuma fixture entra aqui.
 */
const PRESENTATION_BY_BATCH: Readonly<Record<string, ProductionCatalogEntry['presentation']>> = {
    'production-batch:materia-energia-e-radiacao:2026-08-13': {
        slug: 'materia-energia-e-radiacao',
        title: 'Matéria, energia e radiação',
        description: 'Da estrutura atômica à formação de contraste no detector.',
        unitTitle: 'Matéria, energia e radiação',
        reward: {
            id: 'node:reward:materia-energia-e-radiacao',
            title: 'Fundamentos da radiação consolidados',
            description: 'Marca a conclusão do primeiro corte curricular por competências.',
        },
    },
};

export const PRODUCTION_CATALOG_ENTRIES: readonly ProductionCatalogEntry[] = PRODUCTION_BATCHES.map(batch => {
    const presentation = PRESENTATION_BY_BATCH[batch.batchId];
    if (!presentation) throw new Error(`[production-catalog] missing-presentation: ${batch.batchId}`);
    return { batch, presentation };
});
