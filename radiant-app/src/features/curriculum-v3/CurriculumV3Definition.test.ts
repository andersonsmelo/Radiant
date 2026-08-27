import { CURRICULUM_V3_ID, CURRICULUM_V3_ARCS, getPublishableManifest } from './CurriculumV3Definition';

describe('CurriculumV3Definition', () => {
  it('keeps the approved continuous order with mammography directly after radiography', () => {
    expect(CURRICULUM_V3_ID).toBe('curriculum:v3');
    expect(CURRICULUM_V3_ARCS.map((arc) => arc.id)).toEqual([
      'arc:foundations',
      'arc:radiography',
      'arc:mammography',
      'arc:computed-tomography',
      'arc:magnetic-resonance',
      'arc:nuclear-medicine',
      'arc:radiotherapy',
      'arc:other-specializations',
    ]);
    expect(CURRICULUM_V3_ARCS[0].pillars).toEqual(['anatomy', 'physiology', 'physics']);
  });

  it('does not publish the unfinished curriculum as an empty catalog', () => {
    expect(getPublishableManifest()).toBeNull();
  });
});
