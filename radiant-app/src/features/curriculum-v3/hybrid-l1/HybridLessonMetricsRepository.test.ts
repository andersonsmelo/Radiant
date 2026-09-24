import { HybridLessonMetricsRepository, MAX_RECORDS, type HybridLessonRecord } from './HybridLessonMetricsRepository';

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

function memoryStorage(initial: Record<string, string> = {}) {
  const data = { ...initial };
  return { getItem: jest.fn(async (key: string) => data[key] ?? null), setItem: jest.fn(async (key: string, value: string) => { data[key] = value; }) };
}

const record = (n: number): HybridLessonRecord => ({
  finishedAt: `2026-09-23T10:${String(n).padStart(2, '0')}:00.000Z`,
  outcome: 'completed',
  abandonedAtItemId: null,
  summary: { xp: 18, accuracy: 1, durationMs: 200_000, bestStreak: 12, requeued: 0, heartsSpent: 0, misconceptions: {}, itemTimesMs: {} },
});

describe('medidas locais da lição híbrida', () => {
  it('guarda a sessão mais recente primeiro', async () => {
    const repository = new HybridLessonMetricsRepository(memoryStorage());
    await repository.append(record(1));
    await repository.append(record(2));
    expect((await repository.list()).map((entry) => entry.finishedAt)).toEqual([record(2).finishedAt, record(1).finishedAt]);
  });

  it(`mantém no máximo ${MAX_RECORDS} sessões`, async () => {
    const repository = new HybridLessonMetricsRepository(memoryStorage());
    for (let n = 0; n < MAX_RECORDS + 5; n += 1) await repository.append(record(n));
    expect(await repository.list()).toHaveLength(MAX_RECORDS);
  });

  it('dado corrompido vira lista vazia, sem lançar', async () => {
    const repository = new HybridLessonMetricsRepository(memoryStorage({ '@radiant:v3:hybrid_lesson_metrics_v1': '{x' }));
    expect(await repository.list()).toEqual([]);
  });
});
