import { resolveLessonStars, resolveAttemptStars } from './resolveLessonStars';

const attempt = (over: Partial<{ lessonId: string; correctAnswers: number; totalQuestions: number; completedAt: string }> = {}) => ({
  lessonId: 'licao-1',
  topicId: 'topico-1',
  correctAnswers: 10,
  totalQuestions: 10,
  completedAt: '2026-08-01T10:00:00.000Z',
  ...over,
});

describe('resolveLessonStars', () => {
  it('reconhece algum acerto e só dá duas estrelas com dois terços', () => {
    expect(resolveLessonStars(1, 100)).toBe(1);
    expect(resolveLessonStars(66, 100)).toBe(1);
    expect(resolveLessonStars(67, 100)).toBe(2);
    expect(resolveLessonStars(0, 100)).toBe(0);
  });
  it('dá três estrelas só em 100%', () => {
    expect(resolveLessonStars(99, 100)).toBe(2);
    expect(resolveLessonStars(10, 10)).toBe(3);
  });
  it('devolve zero quando não há questões', () => {
    expect(resolveLessonStars(0, 0)).toBe(0);
  });
});

// Até 2026-10-16 o resumo mostrava a MELHOR nota já obtida, com a frase dela.
// Visto no simulador: revisão errada (0 de 1) e "Três estrelas. Nada passou
// despercebido." Desde então as estrelas são desta tentativa, e o recorde vem
// à parte (ADR de 2026-10-16).
describe('resolveAttemptStars', () => {
  it('usa a tentativa atual quando não há histórico, e ela é o recorde', () => {
    expect(resolveAttemptStars('licao-1', [], { correctAnswers: 7, totalQuestions: 10, completedAt: 'agora' }))
      .toEqual({ stars: 2, recordStars: 2, improved: true });
  });

  it('mostra as estrelas desta tentativa quando ela é pior, com o recorde à parte', () => {
    const historico = [attempt({ correctAnswers: 10, totalQuestions: 10, completedAt: 'antes' })];
    expect(resolveAttemptStars('licao-1', historico, { correctAnswers: 0, totalQuestions: 1, completedAt: 'agora' }))
      .toEqual({ stars: 0, recordStars: 3, improved: false });
  });

  it('ignora a própria tentativa atual já persistida', () => {
    const historico = [attempt({ correctAnswers: 7, totalQuestions: 10, completedAt: 'agora' })];
    expect(resolveAttemptStars('licao-1', historico, { correctAnswers: 7, totalQuestions: 10, completedAt: 'agora' }))
      .toEqual({ stars: 2, recordStars: 2, improved: true });
  });

  it('ignora tentativas de outras lições', () => {
    const historico = [attempt({ lessonId: 'outra', correctAnswers: 10, totalQuestions: 10, completedAt: 'antes' })];
    expect(resolveAttemptStars('licao-1', historico, { correctAnswers: 7, totalQuestions: 10, completedAt: 'agora' }))
      .toEqual({ stars: 2, recordStars: 2, improved: true });
  });
});


describe('M7 proposta para N perguntas', () => {
  it.each([
    [2, [0, 1, 3]], [3, [0, 1, 2, 3]],
    [10, [0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3]],
    [15, [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3]],
  ])('N=%i reconhece acerto parcial sem declarar perfeição', (n, stars) => {
    expect(stars.map((_, correct) => resolveLessonStars(correct, n))).toEqual(stars);
  });
});
