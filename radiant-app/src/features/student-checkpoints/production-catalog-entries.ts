import { PRODUCTION_BATCHES } from './production-batches';
import { RTG_2026_PRESENTATIONS } from './batches/entries';
import type { ProductionCatalogEntry } from './createProductionCurriculumCatalog';

// New content requires an explicitly reviewed presentation entry; the rtg-2026 ones are generated with their batches.
const PRESENTATION_BY_BATCH: Readonly<Record<string, ProductionCatalogEntry['presentation']>> = RTG_2026_PRESENTATIONS;
export const PRODUCTION_CATALOG_ENTRIES: readonly ProductionCatalogEntry[] = PRODUCTION_BATCHES.map(batch => {
    const presentation = PRESENTATION_BY_BATCH[batch.batchId];
    if (!presentation) throw new Error(`[production-catalog] missing-presentation: ${batch.batchId}`);
    return { batch, presentation };
});
