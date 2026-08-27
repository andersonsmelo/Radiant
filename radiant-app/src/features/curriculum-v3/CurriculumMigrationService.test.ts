import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { CurriculumMigration } from './CurriculumMigrationService';

jest.mock('@react-native-async-storage/async-storage', () => ({ getItem: jest.fn(), setItem: jest.fn() }));
const storage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const runtimeKey = '@radiant:curriculum_runtime_v1';
const snapshotKey = '@radiant:legacy_curriculum_snapshot_v1';
const capturedAt = '2026-08-27T15:00:00.000Z';
const legacyState = {
  schemaVersion: 'curriculum-runtime.v1',
  activeCurriculumId: 'curriculum:legacy',
  preparedCurriculumIds: ['curriculum:legacy'],
};
const preparedState = {
  ...legacyState,
  preparedCurriculumIds: ['curriculum:legacy', 'curriculum:v3'],
  legacySnapshotId: 'legacy-snapshot:v1',
  v3PreparedAt: capturedAt,
};
const sourceEntries = [
  ['@radiant:journey_progress_v1', { schemaVersion: 'journey-progress.v2', tracks: { old: { completedNodeIds: ['node:old'] } } }],
  ['@radiant:learning_attempts_v1', { schemaVersion: 'learning-attempts.v1', attempts: [{ lessonId: 'lesson-1', correctAnswers: 1, totalQuestions: 1 }] }],
  ['@radiant:learning_evidence_v1', { evidence: [{ id: 'evidence:old', passed: true }] }],
  ['@radiant:competency_mastery_v1', { levels: { old: 'mastered' } }],
] as const;

const invalidStates: [string, string][] = [
  ['corrupt JSON', '{broken'],
  ['null', 'null'],
  ['unknown schema', JSON.stringify({ ...legacyState, schemaVersion: 'curriculum-runtime.v2' })],
  ['unknown fields', JSON.stringify({ ...legacyState, futureField: true })],
  ['active V3 before cutover', JSON.stringify({ ...preparedState, activeCurriculumId: 'curriculum:v3' })],
  ['missing legacy', JSON.stringify({ ...legacyState, preparedCurriculumIds: [] })],
  ['duplicate IDs', JSON.stringify({ ...legacyState, preparedCurriculumIds: ['curriculum:legacy', 'curriculum:legacy'] })],
  ['unknown curriculum', JSON.stringify({ ...legacyState, preparedCurriculumIds: ['curriculum:legacy', 'curriculum:v4'] })],
  ['partial preparation', JSON.stringify({ ...legacyState, legacySnapshotId: 'legacy-snapshot:v1' })],
  ['missing metadata', JSON.stringify({ ...legacyState, preparedCurriculumIds: ['curriculum:legacy', 'curriculum:v3'] })],
  ['invalid timestamp', JSON.stringify({ ...preparedState, v3PreparedAt: 'not-a-date' })],
  ['impossible calendar date', JSON.stringify({ ...preparedState, v3PreparedAt: '2026-02-30T15:00:00.000Z' })],
];

describe('CurriculumMigration', () => {
  let values: Map<string, string>;
  let service: CurriculumMigration;
  let now: jest.Mock<string, []>;

  beforeEach(() => {
    jest.resetAllMocks();
    values = new Map();
    storage.getItem.mockImplementation(async (key) => values.get(key) ?? null);
    storage.setItem.mockImplementation(async (key, raw) => { values.set(key, raw); });
    now = jest.fn(() => capturedAt);
    service = new CurriculumMigration(storage, now);
  });

  function seedLegacy() {
    for (const [key, value] of sourceEntries) values.set(key, JSON.stringify(value));
    // Stores outside the partial snapshot must also remain untouched.
    values.set('@radiant:student_checkpoints_active_v1', '{"checkpoint":"active"}');
    values.set('@radiant:sr_schedule_v1', '{"due":"legacy"}');
    values.set('@radiant:v3:journey_progress_v1', '{"unrelated":"preserve"}');
  }

  it('bootstraps a fresh install in legacy without preparing or snapshotting', async () => {
    expect(await service.bootstrap()).toEqual(legacyState);
    expect([...values.entries()]).toEqual([[runtimeKey, JSON.stringify(legacyState)]]);
    expect(now).not.toHaveBeenCalled();
  });

  it('does not rewrite a supported state on repeated bootstrap', async () => {
    values.set(runtimeKey, JSON.stringify(legacyState));
    expect(await service.bootstrap()).toEqual(legacyState);
    expect(await service.bootstrap()).toEqual(legacyState);
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it('prepares an empty install without inventing learning progress', async () => {
    expect(await service.prepareV3()).toEqual(preparedState);
    expect((await service.getLegacySnapshot())?.sources).toEqual({
      journeyProgress: null, learningAttempts: null, learningEvidence: null, competencyMastery: null,
    });
    expect([...values.keys()]).toEqual([snapshotKey, runtimeKey]);
  });

  it('copies only the four source values without assigning legacy IDs to V3 stores', async () => {
    seedLegacy();
    const original = new Map(values);
    expect(await service.prepareV3()).toEqual(preparedState);
    expect(await service.getLegacySnapshot()).toEqual({
      schemaVersion: 'legacy-curriculum-snapshot.v1', id: 'legacy-snapshot:v1',
      curriculumId: 'curriculum:legacy', capturedAt,
      sources: {
        journeyProgress: sourceEntries[0][1], learningAttempts: sourceEntries[1][1],
        learningEvidence: sourceEntries[2][1], competencyMastery: sourceEntries[3][1],
      },
    });
    for (const [key, raw] of original) expect(values.get(key)).toBe(raw);
    expect(storage.setItem.mock.calls.map(([key]) => key)).toEqual([snapshotKey, runtimeKey]);
    const v3Keys = [STORAGE_KEYS.V3_JOURNEY_PROGRESS, STORAGE_KEYS.V3_LEARNING_ATTEMPTS,
      STORAGE_KEYS.V3_LEARNING_EVIDENCE, STORAGE_KEYS.V3_COMPETENCY_MASTERY];
    expect(new Set(v3Keys).size).toBe(4);
    expect(v3Keys.every((key) => key.startsWith('@radiant:v3:'))).toBe(true);
  });

  it('resumes across restarts without recapturing changed legacy data or rewriting preparation', async () => {
    seedLegacy();
    await service.prepareV3();
    const originalSnapshot = values.get(snapshotKey);
    values.set(sourceEntries[0][0], '{"changed":true}');
    const restarted = new CurriculumMigration(storage, () => '2026-08-28T15:00:00.000Z');
    expect(await restarted.bootstrap()).toEqual(preparedState);
    expect(await restarted.prepareV3()).toEqual(preparedState);
    expect(values.get(snapshotKey)).toBe(originalSnapshot);
    expect(storage.setItem).toHaveBeenCalledTimes(2);
  });

  it.each(invalidStates)('falls back without rewriting %s and refuses preparation', async (_name, raw) => {
    values.set(runtimeKey, raw);
    expect(await service.bootstrap()).toEqual(legacyState);
    await expect(service.prepareV3()).rejects.toThrow('CURRICULUM_RUNTIME_INVALID');
    expect(values.get(runtimeKey)).toBe(raw);
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it.each(['missing', 'corrupt', 'timestamp mismatch'])('does not trust prepared metadata with a %s snapshot', async (kind) => {
    await service.prepareV3();
    if (kind === 'missing') values.delete(snapshotKey);
    if (kind === 'corrupt') values.set(snapshotKey, '{broken');
    if (kind === 'timestamp mismatch') {
      const snapshot = JSON.parse(values.get(snapshotKey)!);
      values.set(snapshotKey, JSON.stringify({ ...snapshot, capturedAt: '2026-08-26T15:00:00.000Z' }));
    }
    const before = new Map(values);
    expect(await service.bootstrap()).toEqual(legacyState);
    await expect(service.prepareV3()).rejects.toThrow('CURRICULUM_RUNTIME_INCONSISTENT');
    expect(values).toEqual(before);
  });

  it.each(sourceEntries.map(([key]) => key))('aborts on invalid source JSON in %s without altering any bytes', async (key) => {
    seedLegacy();
    values.set(key, '{private-content-invalid');
    const before = new Map(values);
    await expect(service.prepareV3()).rejects.toThrow('LEGACY_SOURCE_INVALID');
    expect(values).toEqual(before);
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it('rejects non-finite numbers in source JSON rather than converting them to null', async () => {
    values.set(sourceEntries[0][0], '{"invalid":1e400}');
    await expect(service.prepareV3()).rejects.toThrow('LEGACY_SOURCE_INVALID');
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it('does not overwrite a corrupt snapshot left before runtime preparation', async () => {
    values.set(snapshotKey, '{broken');
    await expect(service.prepareV3()).rejects.toThrow('LEGACY_SNAPSHOT_INVALID');
    expect([...values.entries()]).toEqual([[snapshotKey, '{broken']]);
  });

  it.each([runtimeKey, snapshotKey, ...sourceEntries.map(([key]) => key)])(
    'aborts preparation on read failure at %s and allows retry', async (failedKey) => {
      seedLegacy();
      const before = new Map(values);
      storage.getItem.mockImplementation(async (key) => {
        if (key === failedKey) throw new Error('read failed');
        return values.get(key) ?? null;
      });
      await expect(service.prepareV3()).rejects.toThrow('read failed');
      expect(values).toEqual(before);
      storage.getItem.mockImplementation(async (key) => values.get(key) ?? null);
      expect(await service.prepareV3()).toEqual(preparedState);
    }
  );

  it('propagates bootstrap read and write errors so startup can retry', async () => {
    storage.getItem.mockRejectedValueOnce(new Error('read failed'));
    await expect(service.bootstrap()).rejects.toThrow('read failed');
    storage.setItem.mockRejectedValueOnce(new Error('write failed'));
    await expect(service.bootstrap()).rejects.toThrow('write failed');
    expect(values.size).toBe(0);
    expect(await service.bootstrap()).toEqual(legacyState);
  });

  it('does not mark V3 prepared if snapshot persistence fails', async () => {
    storage.setItem.mockRejectedValueOnce(new Error('snapshot write failed'));
    await expect(service.prepareV3()).rejects.toThrow('snapshot write failed');
    expect(values.size).toBe(0);
    expect(await service.prepareV3()).toEqual(preparedState);
  });

  it('resumes after the runtime write fails, retaining the original snapshot and timestamp', async () => {
    seedLegacy();
    storage.setItem.mockImplementation(async (key, raw) => {
      if (key === runtimeKey) throw new Error('runtime write failed');
      values.set(key, raw);
    });
    await expect(service.prepareV3()).rejects.toThrow('runtime write failed');
    const originalSnapshot = values.get(snapshotKey);
    expect(originalSnapshot).toBeDefined();
    expect(values.has(runtimeKey)).toBe(false);
    values.set(sourceEntries[0][0], '{broken after capture');
    storage.setItem.mockImplementation(async (key, raw) => { values.set(key, raw); });
    const restarted = new CurriculumMigration(storage, () => '2026-08-28T15:00:00.000Z');
    expect(await restarted.prepareV3()).toEqual(preparedState);
    expect(values.get(snapshotKey)).toBe(originalSnapshot);
  });

  it.each([snapshotKey, runtimeKey])('recovers when %s persists before rejecting', async (failedKey) => {
    seedLegacy();
    storage.setItem.mockImplementation(async (key, raw) => {
      values.set(key, raw);
      if (key === failedKey) throw new Error('acknowledgement failed');
    });
    await expect(service.prepareV3()).rejects.toThrow('acknowledgement failed');
    const originalSnapshot = values.get(snapshotKey);
    expect(originalSnapshot).toBeDefined();
    values.set(sourceEntries[0][0], '{broken after capture');
    storage.setItem.mockImplementation(async (key, raw) => { values.set(key, raw); });
    const restarted = new CurriculumMigration(storage, () => '2026-08-28T15:00:00.000Z');
    expect(await restarted.prepareV3()).toEqual(preparedState);
    expect(values.get(snapshotKey)).toBe(originalSnapshot);
    expect(storage.setItem.mock.calls.map(([key]) => key)).toEqual([snapshotKey, runtimeKey]);
  });

  it('serializes prepare and bootstrap across instances without losing prepared state', async () => {
    const other = new CurriculumMigration(storage, () => '2026-08-28T15:00:00.000Z');
    const results = await Promise.all([service.prepareV3(), other.bootstrap(), other.prepareV3()]);
    expect(results).toEqual([preparedState, preparedState, preparedState]);
    expect(storage.setItem.mock.calls.map(([key]) => key)).toEqual([snapshotKey, runtimeKey]);
    expect(now).toHaveBeenCalledTimes(1);
  });
});
