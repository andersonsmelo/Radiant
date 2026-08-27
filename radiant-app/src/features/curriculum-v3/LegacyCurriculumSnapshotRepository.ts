import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { isLegacyCurriculumSnapshot, type LegacyCurriculumSnapshot } from './legacySnapshot.types';

export type CurriculumStorage = Pick<typeof AsyncStorage, 'getItem' | 'setItem'>;
const creationQueues = new WeakMap<CurriculumStorage, Promise<unknown>>();

function parseSnapshot(raw: string): LegacyCurriculumSnapshot | null {
  try {
    const value: unknown = JSON.parse(raw);
    return isLegacyCurriculumSnapshot(value) ? value : null;
  } catch {
    // Do not expose source payloads through JSON parser error messages.
    return null;
  }
}

/** Append-once history. No update/delete API; the live legacy stores are untouched. */
export class LegacyCurriculumSnapshotRepository {
  constructor(private readonly storage: CurriculumStorage = AsyncStorage) {}

  async get(): Promise<LegacyCurriculumSnapshot | null> {
    // I/O errors must not masquerade as absence.
    const raw = await this.storage.getItem(STORAGE_KEYS.LEGACY_CURRICULUM_SNAPSHOT);
    return raw === null ? null : parseSnapshot(raw);
  }

  async createOnce(snapshot: LegacyCurriculumSnapshot): Promise<LegacyCurriculumSnapshot> {
    if (!isLegacyCurriculumSnapshot(snapshot)) throw new Error('LEGACY_SNAPSHOT_INVALID');
    // Detach from the caller before waiting for the queue.
    const encoded = JSON.stringify(snapshot);
    const operation = (creationQueues.get(this.storage) ?? Promise.resolve()).then(async () => {
      const existingRaw = await this.storage.getItem(STORAGE_KEYS.LEGACY_CURRICULUM_SNAPSHOT);
      if (existingRaw !== null) {
        const existing = parseSnapshot(existingRaw);
        if (!existing) throw new Error('LEGACY_SNAPSHOT_INVALID');
        return existing;
      }
      await this.storage.setItem(STORAGE_KEYS.LEGACY_CURRICULUM_SNAPSHOT, encoded);
      return JSON.parse(encoded) as LegacyCurriculumSnapshot;
    });
    // Shared across instances in this process, not a cross-process storage transaction.
    creationQueues.set(this.storage, operation.then(() => undefined, () => undefined));
    return operation;
  }
}
