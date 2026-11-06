import { CURRICULUM_V3_ID, CURRICULUM_V3_ARCS, getPublishableManifest } from './CurriculumV3Definition';

describe('retired V3 definition', () => {
  it('retains the schema identity without a curricular sequence', () => {
    expect(CURRICULUM_V3_ID).toBe('curriculum:v3');
    expect(CURRICULUM_V3_ARCS).toEqual([]);
    expect(Object.isFrozen(CURRICULUM_V3_ARCS)).toBe(true);
  });
  it('never publishes a manifest', () => expect(getPublishableManifest()).toBeNull());
});
