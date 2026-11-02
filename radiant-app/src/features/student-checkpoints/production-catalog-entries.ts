import { PRODUCTION_BATCHES } from './production-batches';
import type { ProductionCatalogEntry } from './createProductionCurriculumCatalog';

// New content requires an explicitly reviewed presentation entry.
const PRESENTATION_BY_BATCH: Readonly<Record<string, ProductionCatalogEntry['presentation']>> = {};
export const PRODUCTION_CATALOG_ENTRIES: readonly ProductionCatalogEntry[] = PRODUCTION_BATCHES.map(batch => {
    const presentation = PRESENTATION_BY_BATCH[batch.batchId];
    if (!presentation) throw new Error(`[production-catalog] missing-presentation: ${batch.batchId}`);
    return { batch, presentation };
});
