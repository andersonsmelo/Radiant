import type { ProductionBatchV1 } from './ProductionBatch';
import { RTG_2026_BATCHES } from './batches/index';

/** Só lotes gerados das aulas-fonte por `scripts/content/build-rtg-batches.mjs`; nada é escrito à mão aqui. */
export const PRODUCTION_BATCHES: readonly ProductionBatchV1[] = RTG_2026_BATCHES;
