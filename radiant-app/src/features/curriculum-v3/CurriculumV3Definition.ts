import type { CurriculumArc, CurriculumId } from './curriculum.types';

// Stable schema identity survives; the retired curriculum has no active arcs.
export const CURRICULUM_V3_ID = 'curriculum:v3' satisfies CurriculumId;
export const CURRICULUM_V3_ARCS: readonly CurriculumArc[] = Object.freeze([]);

export function getPublishableManifest(): null {
  return null;
}
