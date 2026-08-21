import { resolveLessonStars, resolveBestLessonStars } from './resolveLessonStars';

const attempt = (over: Partial<{ lessonId: string; correctAnswers: number; totalQuestions: number; completedAt: string }> = {}) => ({
  lessonId: 'licao-1',
  topicId: 'topico-1',
  correctAnswers: 10,
  totalQuestions: 10,
  completedAt: '2026-08-01T10:00:00.000Z',
  ...over,
});

describe('resolveLessonStars', () => {
  it('reprova abaixo da nota de corte', () => {
    expect(resolveLessonStars(69, 100)).toBe(0);
  });
  it('dá uma estrela exatamente na nota de corte', () => {
    expect(resolveLessonStars(70, 100)).toBe(1);
  });
  it('dá duas estrelas a partir de 85%', () => {
    expect(resolveLessonStars(84, 100)).toBe(1);
    expect(resolveLessonStars(85, 100)).toBe(2);
  });
  it('dá três estrelas só em 100%', () => {
    expect(resolveLessonStars(99, 100)).toBe(2);
    expect(resolveLessonStars(10, 10)).toBe(3);
  });
  it('devolve zero quando não há questões', () => {
    expect(resolveLessonStars(0, 0)).toBe(0);
  });
});

describe('resolveBestLessonStars', () => {
  it('usa a tentativa atual quando não há histórico', () => {
    expect(resolveBestLessonStars('licao-1', [], { correctAnswers: 7, totalQuestions: 10, completedAt: 'agora' }))
      .toEqual({ stars: 1, improved: true });
  });

  it('mantém a melhor marca quando a tentativa atual é pior', () => {
    const historico = [attempt({ correctAnswers: 10, totalQuestions: 10, completedAt: 'antes' })];
    expect(resolveBestLessonStars('licao-1', historico, { correctAnswers: 7, totalQuestions: 10, completedAt: 'agora' }))
      .toEqual({ stars: 3, improved: false });
  });

  it('ignora a própria tentativa atual já persistida', () => {
    const historico = [attempt({ correctAnswers: 7, totalQuestions: 10, completedAt: 'agora' })];
    expect(resolveBestLessonStars('licao-1', historico, { correctAnswers: 7, totalQuestions: 10, completedAt: 'agora' }))
      .toEqual({ stars: 1, improved: true });
  });

  it('ignora tentativas de outras lições', () => {
    const historico = [attempt({ lessonId: 'outra', correctAnswers: 10, totalQuestions: 10, completedAt: 'antes' })];
    expect(resolveBestLessonStars('licao-1', historico, { correctAnswers: 7, totalQuestions: 10, completedAt: 'agora' }))
      .toEqual({ stars: 1, improved: true });
  });
});
