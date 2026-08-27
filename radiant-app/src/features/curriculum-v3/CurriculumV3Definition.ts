import type { CurriculumArc, CurriculumId } from './curriculum.types';

export const CURRICULUM_V3_ID = 'curriculum:v3' satisfies CurriculumId;

export const CURRICULUM_V3_ARCS: readonly CurriculumArc[] = Object.freeze([
  Object.freeze({
    id: 'arc:foundations',
    title: 'Fundamentos',
    pillars: Object.freeze(['anatomy', 'physiology', 'physics'] as const),
  }),
  Object.freeze({ id: 'arc:radiography', title: 'Radiografia' }),
  Object.freeze({ id: 'arc:mammography', title: 'Mamografia' }),
  Object.freeze({ id: 'arc:computed-tomography', title: 'Tomografia computadorizada' }),
  Object.freeze({ id: 'arc:magnetic-resonance', title: 'Ressonância magnética' }),
  Object.freeze({ id: 'arc:nuclear-medicine', title: 'Medicina nuclear' }),
  Object.freeze({ id: 'arc:radiotherapy', title: 'Radioterapia' }),
  Object.freeze({ id: 'arc:other-specializations', title: 'Outras especializações' }),
]);

/** The draft has no playable path yet. Never use an empty manifest as a fallback. */
export function getPublishableManifest(): null {
  return null;
}
