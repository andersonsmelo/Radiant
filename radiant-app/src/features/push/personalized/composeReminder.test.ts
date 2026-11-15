import { ALL_ON, planReminder, type ReminderContext, type ReminderPlan } from './composeReminder';

// Datas sempre locais (`new Date(a, m, d, h)`): "hoje" é o dia do aparelho, nunca o de UTC.
const NOW = new Date(2026, 10, 15, 10, 0); // domingo, 15/11, 10 h

function ctx(over: Partial<ReminderContext> = {}): ReminderContext {
  return {
    now: NOW,
    lastStudyDateKey: '2026-11-14',
    streakDays: 5,
    dueReviews: 0,
    nextLessonTitle: 'Colimação e campo',
    goalCompletedToday: false,
    usualHour: null,
    league: null,
    firedTodayAlready: false,
    preferences: ALL_ON,
    ...over,
  };
}

function plan(over: Partial<ReminderContext> = {}): ReminderPlan {
  const decision = planReminder(ctx(over));
  if ('skip' in decision) throw new Error(`esperava um lembrete, veio ${decision.skip}`);
  return decision;
}

describe('planReminder: tipo, voz e rota', () => {
  it.each<[string, Partial<ReminderContext>, ReminderPlan['kind'], ReminderPlan['voice'], string]>([
    ['sequência em risco hoje', {}, 'sequencia', 'Pixel', '/'],
    ['revisão devida, sem sequência', { streakDays: 1, dueReviews: 3 }, 'revisao', 'Profa. Lia', '/review'],
    ['posição na liga', { streakDays: 1, league: { rank: 3, totalPlayers: 12 } }, 'liga', 'Duda', '/'],
    ['próxima aula pelo nome', { streakDays: 1 }, 'aula', 'Caio', '/'],
    ['só a meta', { streakDays: 1, nextLessonTitle: null }, 'meta', 'Duda', '/'],
    ['volta depois de 3 dias', { lastStudyDateKey: '2026-11-12', dueReviews: 4 }, 'retorno', 'Pixel', '/'],
    ['aluno que nunca estudou', { lastStudyDateKey: null, streakDays: 0 }, 'aula', 'Caio', '/'],
  ])('%s', (_caso, over, kind, voice, route) => {
    const p = plan(over);
    expect([p.kind, p.voice, p.route]).toEqual([kind, voice, route]);
    expect(p.body.startsWith(`${voice}: `)).toBe(true);
  });

  it('a revisão vence a liga, e a liga só entra até a 10ª posição', () => {
    expect(plan({ streakDays: 1, dueReviews: 1, league: { rank: 1, totalPlayers: 9 } }).kind).toBe('revisao');
    expect(plan({ streakDays: 1, league: { rank: 11, totalPlayers: 30 } }).kind).toBe('aula');
  });

  it('nomeia a aula, a sequência e a contagem de revisões no texto', () => {
    expect(plan({ streakDays: 1 }).title).toContain('Colimação e campo');
    expect(plan().title).toContain('5 dias');
    expect(plan({ streakDays: 1, dueReviews: 1 }).title).toBe('1 revisão para hoje');
    expect(plan({ streakDays: 1, dueReviews: 3 }).title).toBe('3 revisões para hoje');
  });
});

describe('planReminder: limites duros', () => {
  it('já estudou hoje: nada hoje, o lembrete vai para amanhã', () => {
    const p = plan({ lastStudyDateKey: '2026-11-15' });
    expect(p.fireAt.getDate()).toBe(16);
    // Estudou hoje e tem sequência: amanhã ela é que está em jogo.
    expect(p.kind).toBe('sequencia');
  });

  it('o lembrete de hoje já disparou: o próximo só amanhã (no máximo um por dia)', () => {
    expect(plan({ firedTodayAlready: true }).fireAt.getDate()).toBe(16);
  });

  it('horário de hoje a menos de 15 min: amanhã', () => {
    expect(plan({ now: new Date(2026, 10, 15, 18, 50) }).fireAt.getDate()).toBe(16);
    expect(plan({ now: new Date(2026, 10, 15, 18, 40) }).fireAt.getDate()).toBe(15);
  });

  it.each([
    [null, 19], [7, 9], [3, 9], [13, 13], [21, 21], [22, 21], [23, 21],
  ])('hora usual %p vira %p h: nunca no silêncio da noite', (usualHour, hour) => {
    const p = plan({ usualHour, now: new Date(2026, 10, 15, 0, 30) });
    expect(p.fireAt.getHours()).toBe(hour);
    expect(p.fireAt.getMinutes()).toBe(0);
  });

  it('às 23 h, sem ter estudado, agenda para amanhã de manhã ou de tarde, nunca à noite', () => {
    const p = plan({ now: new Date(2026, 10, 15, 23, 0), usualHour: 22 });
    expect([p.fireAt.getDate(), p.fireAt.getHours()]).toEqual([16, 21]);
  });

  it('o dia-alvo amanhã recalcula o risco: sem estudo ontem nem hoje, não é sequência', () => {
    const p = plan({ lastStudyDateKey: '2026-11-14', firedTodayAlready: true, streakDays: 5 });
    // Amanhã (16) a véspera é 15, e o último estudo foi 14: a sequência já não está em jogo.
    expect(p.kind).toBe('aula');
  });

  it('retorno é um convite único: só depois de 3 dias, nunca fala de sequência', () => {
    const p = plan({ lastStudyDateKey: '2026-11-01', streakDays: 9 });
    expect(p.kind).toBe('retorno');
    expect(p.title + p.body).not.toMatch(/sequência/i);
  });

  it('preferência desligada pula o tipo; tudo desligado não agenda', () => {
    expect(plan({ preferences: { ...ALL_ON, sequencia: false } }).kind).toBe('aula');
    const off = { sequencia: false, revisao: false, aula: false, meta: false, liga: false };
    expect(planReminder(ctx({ preferences: off }))).toEqual({ skip: 'nada-a-dizer' });
  });

  it('meta fechada hoje e nada mais a dizer: não agenda', () => {
    expect(planReminder(ctx({ streakDays: 1, nextLessonTitle: null, goalCompletedToday: true }))).toEqual({ skip: 'nada-a-dizer' });
  });
});

describe('planReminder: tom de convite', () => {
  const casos: Partial<ReminderContext>[] = [
    {}, { streakDays: 1, dueReviews: 2 }, { streakDays: 1, league: { rank: 2, totalPlayers: 5 } },
    { streakDays: 1 }, { streakDays: 1, nextLessonTitle: null }, { lastStudyDateKey: '2026-11-01' },
  ];
  const dias = [new Date(2026, 10, 15, 8), new Date(2026, 10, 16, 8)]; // as duas variantes
  it.each(casos.flatMap(c => dias.map(now => ({ ...c, now }))))('sem culpa nem ameaça de perda: %#', (over) => {
    const p = plan(over);
    expect(`${p.title} ${p.body}`).not.toMatch(/perd|perca|acab|última chance|culpa|vergonha|decepcion|especialista|!/i);
    expect(p.title.length).toBeGreaterThan(0);
    expect(p.body.length).toBeLessThanOrEqual(178);
  });
});
