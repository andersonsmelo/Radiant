import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../../constants/storageKeys';
import type { HybridSummary } from './HybridLessonSession';

export type HybridLessonOutcome = 'completed' | 'out_of_hearts' | 'abandoned';

export type HybridLessonRecord = Readonly<{
  finishedAt: string;
  outcome: HybridLessonOutcome;
  abandonedAtItemId: string | null;
  summary: HybridSummary;
}>;

export const MAX_RECORDS = 20;

type MetricsStorage = Readonly<{ getItem(key: string): Promise<string | null>; setItem(key: string, value: string): Promise<void> }>;

function isRecord(value: unknown): value is HybridLessonRecord {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<HybridLessonRecord>;
  return typeof candidate.finishedAt === 'string' && typeof candidate.outcome === 'string' && typeof candidate.summary === 'object' && candidate.summary !== null;
}

/** Medidas do piloto (spec §5.4). Ficam no aparelho; nada é enviado. */
export class HybridLessonMetricsRepository {
  constructor(private readonly storage: MetricsStorage = AsyncStorage) {}

  async list(): Promise<readonly HybridLessonRecord[]> {
    try {
      const raw = await this.storage.getItem(STORAGE_KEYS.HYBRID_LESSON_METRICS);
      const value: unknown = raw ? JSON.parse(raw) : [];
      return Array.isArray(value) ? value.filter(isRecord) : [];
    } catch {
      return [];
    }
  }

  async append(record: HybridLessonRecord): Promise<void> {
    const next = [record, ...(await this.list())].slice(0, MAX_RECORDS);
    await this.storage.setItem(STORAGE_KEYS.HYBRID_LESSON_METRICS, JSON.stringify(next));
  }
}

export const hybridLessonMetricsRepository = new HybridLessonMetricsRepository();
