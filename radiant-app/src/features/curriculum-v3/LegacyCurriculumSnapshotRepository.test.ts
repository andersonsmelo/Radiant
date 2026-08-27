import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { LegacyCurriculumSnapshotRepository } from './LegacyCurriculumSnapshotRepository';
import type { LegacyCurriculumSnapshot } from './legacySnapshot.types';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(), setItem: jest.fn(),
}));

const storage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const snapshotKey = '@radiant:legacy_curriculum_snapshot_v1';
const snapshot: LegacyCurriculumSnapshot = {
  schemaVersion: 'legacy-curriculum-snapshot.v1',
  id: 'legacy-snapshot:v1',
  curriculumId: 'curriculum:legacy',
  capturedAt: '2026-08-27T15:00:00.000Z',
  sources: {
    journeyProgress: { schemaVersion: 'journey-progress.v2', tracks: { first: { done: ['old-node'] } } },
    learningAttempts: [{ lessonId: 'old-lesson', score: 4 }],
    learningEvidence: { evidence: [{ id: 'old-evidence', correct: true }] },
    competencyMastery: null,
  },
};

function storageFixture() {
  const values = new Map<string, string>();
  storage.getItem.mockImplementation(async (key) => values.get(key) ?? null);
  storage.setItem.mockImplementation(async (key, value) => { values.set(key, value); });
  return values;
}

describe('LegacyCurriculumSnapshotRepository', () => {
  let values: Map<string, string>;
  let repository: LegacyCurriculumSnapshotRepository;

  beforeEach(() => {
    jest.resetAllMocks();
    values = storageFixture();
    repository = new LegacyCurriculumSnapshotRepository();
  });

  it('returns null without writing when no snapshot exists', async () => {
    expect(await repository.get()).toBeNull();
    expect(values.size).toBe(0);
  });

  it('stores the four sources and keeps the first snapshot across instances and caller mutations', async () => {
    const result = await repository.createOnce(snapshot);
    expect(JSON.parse(values.get(snapshotKey)!)).toEqual(snapshot);
    result.sources.journeyProgress = null;
    const restarted = new LegacyCurriculumSnapshotRepository();
    const second = await restarted.createOnce({ ...snapshot, capturedAt: '2026-08-28T15:00:00.000Z' });
    expect(second).toEqual(snapshot);
    expect(await restarted.get()).toEqual(snapshot);
    expect(storage.setItem).toHaveBeenCalledTimes(1);
    expect(STORAGE_KEYS.LEGACY_CURRICULUM_SNAPSHOT).toBe(snapshotKey);
  });

  it.each([
    '{broken',
    'null',
    JSON.stringify({ ...snapshot, schemaVersion: 'legacy-curriculum-snapshot.v2' }),
    JSON.stringify({ ...snapshot, id: 'another' }),
    JSON.stringify({ ...snapshot, curriculumId: 'curriculum:v3' }),
    JSON.stringify({ ...snapshot, capturedAt: '2026-02-30T15:00:00.000Z' }),
    JSON.stringify({ ...snapshot, sources: { journeyProgress: null } }),
    JSON.stringify({ ...snapshot, sources: [] }),
    JSON.stringify(snapshot).replace('"competencyMastery":null', '"competencyMastery":1e400'),
  ])('preserves invalid persisted bytes instead of replacing them (%#)', async (raw) => {
    values.set(snapshotKey, raw);
    expect(await repository.get()).toBeNull();
    await expect(repository.createOnce(snapshot)).rejects.toThrow('LEGACY_SNAPSHOT_INVALID');
    expect(values.get(snapshotKey)).toBe(raw);
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it('serializes creation across repositories in the same process', async () => {
    const other = new LegacyCurriculumSnapshotRepository();
    const results = await Promise.all([
      repository.createOnce(snapshot),
      other.createOnce({ ...snapshot, capturedAt: '2026-08-28T15:00:00.000Z' }),
    ]);
    expect(results).toEqual([snapshot, snapshot]);
    expect(storage.setItem).toHaveBeenCalledTimes(1);
  });

  it('propagates I/O failure and allows a later retry', async () => {
    storage.getItem.mockRejectedValueOnce(new Error('read failed'));
    await expect(repository.get()).rejects.toThrow('read failed');
    storage.setItem.mockRejectedValueOnce(new Error('disk full'));
    await expect(repository.createOnce(snapshot)).rejects.toThrow('disk full');
    expect(values.size).toBe(0);
    expect(await repository.createOnce(snapshot)).toEqual(snapshot);
  });

  it.each([undefined, NaN, Infinity, new Date(), { nested: undefined }])(
    'rejects values that JSON serialization would silently alter (%#)', async (invalid) => {
      const input = { ...snapshot, sources: { ...snapshot.sources, journeyProgress: invalid } };
      await expect(repository.createOnce(input as LegacyCurriculumSnapshot)).rejects.toThrow('LEGACY_SNAPSHOT_INVALID');
      expect(values.size).toBe(0);
    }
  );
});
