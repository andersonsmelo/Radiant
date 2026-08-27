import type { CurriculumId } from './curriculum.types';

export type CurriculumRuntimeState = {
  schemaVersion: 'curriculum-runtime.v1';
  activeCurriculumId: CurriculumId;
  preparedCurriculumIds: CurriculumId[];
  legacySnapshotId?: 'legacy-snapshot:v1';
  v3PreparedAt?: string;
};
