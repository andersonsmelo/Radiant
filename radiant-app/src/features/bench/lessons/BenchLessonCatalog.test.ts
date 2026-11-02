import { BENCH_LESSON_IDS, BenchLessonCatalog, isBenchLessonId } from './BenchLessonCatalog';

const runtime = globalThis as typeof globalThis & { __DEV__: boolean };

describe('retirada integral dos exemplos da bancada', () => {
  it.each([true, false])('não expõe conteúdo com __DEV__=%s', dev => {
    const previous = runtime.__DEV__;
    try {
      runtime.__DEV__ = dev;
      expect(BENCH_LESSON_IDS).toEqual([]);
      for (const id of ['bancada:exposicao', 'bancada:colimacao', 'bancada:unknown']) {
        expect(BenchLessonCatalog.getActivityById(id)).toBeNull();
        expect(isBenchLessonId(id)).toBe(false);
      }
    } finally { runtime.__DEV__ = previous; }
  });
});
