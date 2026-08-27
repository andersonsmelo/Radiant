import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { LegacyCurriculumSnapshotRepository, type CurriculumStorage } from './LegacyCurriculumSnapshotRepository';
import type { CurriculumRuntimeState } from './curriculumRuntime.types';
import { isIsoTimestamp, isJsonValue, isRecord, type JsonValue, type LegacyCurriculumSnapshot } from './legacySnapshot.types';

const runtimeQueues = new WeakMap<CurriculumStorage, Promise<unknown>>();

function legacyState(): CurriculumRuntimeState {
  return {
    schemaVersion: 'curriculum-runtime.v1',
    activeCurriculumId: 'curriculum:legacy',
    preparedCurriculumIds: ['curriculum:legacy'],
  };
}

function parseRuntime(raw: string): CurriculumRuntimeState | null {
  try {
    const value: unknown = JSON.parse(raw);
    // Activation is intentionally unsupported in this phase, even for a stored V3 state.
    if (!isRecord(value) || value.schemaVersion !== 'curriculum-runtime.v1' ||
        value.activeCurriculumId !== 'curriculum:legacy' || !Array.isArray(value.preparedCurriculumIds)) return null;
    const ids = value.preparedCurriculumIds;
    if (ids[0] !== 'curriculum:legacy') return null;
    if (ids.length === 1 && Object.keys(value).length === 3) return value as CurriculumRuntimeState;
    if (ids.length === 2 && ids[1] === 'curriculum:v3' && Object.keys(value).length === 5 &&
        value.legacySnapshotId === 'legacy-snapshot:v1' && isIsoTimestamp(value.v3PreparedAt)) {
      return value as CurriculumRuntimeState;
    }
    return null;
  } catch {
    return null;
  }
}

function matchesSnapshot(state: CurriculumRuntimeState, snapshot: LegacyCurriculumSnapshot | null): boolean {
  return snapshot !== null && state.legacySnapshotId === snapshot.id &&
    state.v3PreparedAt === snapshot.capturedAt;
}

export class CurriculumMigration {
  private readonly snapshots: LegacyCurriculumSnapshotRepository;

  constructor(
    private readonly storage: CurriculumStorage = AsyncStorage,
    private readonly now: () => string = () => new Date().toISOString(),
  ) {
    this.snapshots = new LegacyCurriculumSnapshotRepository(storage);
  }

  bootstrap(): Promise<CurriculumRuntimeState> {
    return this.exclusively(async () => {
      const raw = await this.storage.getItem(STORAGE_KEYS.CURRICULUM_RUNTIME);
      if (raw === null) {
        const initial = legacyState();
        await this.writeRuntime(initial);
        return initial;
      }
      const state = parseRuntime(raw);
      if (!state) return legacyState();
      if (state.legacySnapshotId && !matchesSnapshot(state, await this.snapshots.get())) return legacyState();
      return state;
    });
  }

  /**
   * Explicit cutover preparation only: all legacy writers must be paused by the caller.
   * The snapshot covers four sources, not SM-2/checkpoints/XP. There is no activation here.
   * An early snapshot is not a final cutover backup; never discard the live legacy stores.
   */
  prepareV3(): Promise<CurriculumRuntimeState> {
    return this.exclusively(async () => {
      const raw = await this.storage.getItem(STORAGE_KEYS.CURRICULUM_RUNTIME);
      const state = raw === null ? legacyState() : parseRuntime(raw);
      if (!state) throw new Error('CURRICULUM_RUNTIME_INVALID');
      let snapshot = await this.snapshots.get();
      if (state.legacySnapshotId) {
        if (!matchesSnapshot(state, snapshot)) throw new Error('CURRICULUM_RUNTIME_INCONSISTENT');
        return state;
      }
      if (!snapshot) {
        const [journeyProgress, learningAttempts, learningEvidence, competencyMastery] = await Promise.all([
          STORAGE_KEYS.JOURNEY_PROGRESS, STORAGE_KEYS.LEARNING_ATTEMPTS,
          STORAGE_KEYS.LEARNING_EVIDENCE, STORAGE_KEYS.COMPETENCY_MASTERY,
        ].map((key) => this.readSource(key)));
        // createOnce refuses to overwrite any invalid existing bytes.
        snapshot = await this.snapshots.createOnce({
          schemaVersion: 'legacy-curriculum-snapshot.v1',
          id: 'legacy-snapshot:v1',
          curriculumId: 'curriculum:legacy',
          capturedAt: this.now(),
          sources: { journeyProgress, learningAttempts, learningEvidence, competencyMastery },
        });
      }
      const prepared: CurriculumRuntimeState = {
        ...legacyState(),
        preparedCurriculumIds: ['curriculum:legacy', 'curriculum:v3'],
        legacySnapshotId: snapshot.id,
        v3PreparedAt: snapshot.capturedAt,
      };
      // Persist the marker last. A retry reuses the snapshot if this write fails.
      await this.writeRuntime(prepared);
      return prepared;
    });
  }

  getLegacySnapshot(): Promise<LegacyCurriculumSnapshot | null> {
    return this.snapshots.get();
  }

  private async readSource(key: string): Promise<JsonValue | null> {
    const raw = await this.storage.getItem(key);
    if (raw === null) return null;
    try {
      const value: unknown = JSON.parse(raw);
      if (isJsonValue(value)) return value;
    } catch {
      // Never include raw JSON or parser excerpts in errors or telemetry.
    }
    throw new Error('LEGACY_SOURCE_INVALID');
  }

  private async writeRuntime(state: CurriculumRuntimeState): Promise<void> {
    await this.storage.setItem(STORAGE_KEYS.CURRICULUM_RUNTIME, JSON.stringify(state));
  }

  private exclusively<T>(work: () => Promise<T>): Promise<T> {
    const operation = (runtimeQueues.get(this.storage) ?? Promise.resolve()).then(work);
    // Serialize bootstrap + prepare across instances; failure must not poison the next attempt.
    // This does not replace pausing legacy writers or provide cross-process atomicity.
    runtimeQueues.set(this.storage, operation.then(() => undefined, () => undefined));
    return operation;
  }
}

export const CurriculumMigrationService = new CurriculumMigration();
