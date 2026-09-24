import { buildL1HybridPlan } from './l1HybridLessonPlan';
import { createHybridLessonSession } from './HybridLessonSession';
import type { HybridItem } from './hybridItem.types';

const plan = buildL1HybridPlan();
const wrongOf = (item: HybridItem) => item.options.find((option) => option.id !== item.correctOptionId)!.id;

function clock() {
  let t = 1_000;
  return { now: () => t, tick: (ms: number) => { t += ms; } };
}

function answerAll(session: ReturnType<typeof createHybridLessonSession>, choose: (item: HybridItem) => string) {
  let guard = 0;
  while (!session.isComplete() && guard < 50) {
    const item = session.current()!;
    session.answer(choose(item));
    session.advance();
    guard += 1;
  }
}

describe('plano da L1 híbrida', () => {
  it('tem 4 itens de primeiro contato seguidos de 8 de desafio, nos três formatos', () => {
    expect(plan.map((item) => item.phase)).toEqual([...Array(4).fill('first_contact'), ...Array(8).fill('challenge')]);
    expect(new Set(plan.map((item) => item.format))).toEqual(new Set(['tap', 'choice', 'true_false']));
  });

  it('é determinístico', () => {
    expect(buildL1HybridPlan()).toEqual(buildL1HybridPlan());
  });
});

describe('sessão da lição híbrida', () => {
  it('erro de primeiro contato não custa vida, mostra a dica e repete o mesmo item', () => {
    const session = createHybridLessonSession({ plan });
    const first = session.current()!;
    const result = session.answer(wrongOf(first));
    expect(result).toMatchObject({ correct: false, costsHeart: false, retrySameItem: true, hint: first.hint, requeuedItemId: null });
    session.advance();
    expect(session.current()!.id).toBe(first.id);
  });

  it('erro de desafio custa vida e o item volta no fim em outro cenário', () => {
    const session = createHybridLessonSession({ plan });
    for (let i = 0; i < 4; i += 1) { session.answer(session.current()!.correctOptionId); session.advance(); }
    const challenge = session.current()!;
    const result = session.answer(wrongOf(challenge));
    expect(result).toMatchObject({ correct: false, costsHeart: true, retrySameItem: false, requeuedItemId: `${challenge.id}-v` });
    expect(result.events).toContain('heart_lost');
    expect(session.position().total).toBe(13);
  });

  it('a variante errada custa vida mas não volta de novo', () => {
    const session = createHybridLessonSession({ plan });
    answerAll(session, (item) => (item.id === 'h06-prox-dist' || item.id === 'h06-prox-dist-v' ? wrongOf(item) : item.correctOptionId));
    expect(session.position().total).toBe(13);
    expect(session.summary().heartsSpent).toBe(2);
  });

  it('só a primeira tentativa de um desafio original é evidência independente', () => {
    const session = createHybridLessonSession({ plan });
    // Erra só a primeira vez: o primeiro contato repete o item até o acerto.
    const missed = new Set<string>();
    answerAll(session, (item) => {
      if ((item.id === 'h01-lat-frente' || item.id === 'h07-sup-prof') && !missed.has(item.id)) {
        missed.add(item.id);
        return wrongOf(item);
      }
      return item.correctOptionId;
    });
    const kinds = new Map(session.evidence().map((entry) => [entry.itemId, entry.evidenceKind]));
    for (const item of plan) {
      expect(kinds.get(item.id)).toBe(item.phase === 'challenge' ? 'initial_independent' : 'assisted_practice');
    }
    expect(kinds.get('h07-sup-prof-v')).toBe('assisted_practice');
    expect(session.evidence().filter((entry) => entry.itemId === 'h01-lat-frente')).toHaveLength(1);
  });

  it('a sequência de acertos avisa aos 3 e aos 5, uma vez cada', () => {
    const session = createHybridLessonSession({ plan });
    const events: string[] = [];
    answerAll(session, (item) => item.correctOptionId);
    const replay = createHybridLessonSession({ plan });
    while (!replay.isComplete()) { events.push(...replay.answer(replay.current()!.correctOptionId).events); replay.advance(); }
    expect(events.filter((event) => event === 'streak3')).toHaveLength(1);
    expect(events.filter((event) => event === 'streak5')).toHaveLength(1);
    expect(session.summary().bestStreak).toBe(12);
  });

  it('resumo: acerto total dá 100% e 18 XP; seis de oito dão 75% e 10 XP', () => {
    const perfect = createHybridLessonSession({ plan });
    answerAll(perfect, (item) => item.correctOptionId);
    expect(perfect.summary()).toMatchObject({ accuracy: 1, xp: 18, requeued: 0, heartsSpent: 0 });

    const partial = createHybridLessonSession({ plan });
    answerAll(partial, (item) => (item.id === 'h05-lat-dorsal' || item.id === 'h08-ant-post' ? wrongOf(item) : item.correctOptionId));
    expect(partial.summary()).toMatchObject({ accuracy: 0.75, xp: 10, requeued: 2, heartsSpent: 2 });
    expect(partial.summary().misconceptions).toEqual({ 'E-LAT-OBS': 1, 'E-GRV': 1 });
  });

  it('mede o tempo de cada item e da lição pelo relógio injetado', () => {
    const { now, tick } = clock();
    const session = createHybridLessonSession({ plan, now });
    tick(2_000);
    session.answer(session.current()!.correctOptionId);
    session.advance();
    tick(3_000);
    answerAll(session, (item) => item.correctOptionId);
    expect(session.summary().itemTimesMs['h01-lat-frente']).toBe(2_000);
    expect(session.summary().durationMs).toBe(5_000);
  });
});
