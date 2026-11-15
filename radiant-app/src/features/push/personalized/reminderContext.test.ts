import { gatherReminderContext, nextLessonTitle, usualStudyHour, type ReminderContextPorts } from './reminderContext';
import { ALL_ON } from './composeReminder';
import { EMPTY_LEAGUE_STANDING } from './LeagueStandingSource';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

const at = (d: number, h: number) => new Date(2026, 10, d, h, 15).toISOString();

describe('usualStudyHour', () => {
  it('menos de 5 tentativas: sem hora usual', () => {
    expect(usualStudyHour([at(1, 8), at(2, 8), at(3, 8), at(4, 8)])).toBeNull();
  });

  it('a hora local mais frequente nas últimas 40', () => {
    // 30 antigas às 7 h ficam fora: das 40 mais recentes, 22 são às 20 h e 18 às 8 h.
    const antigas = Array.from({ length: 30 }, () => at(1, 7));
    const recentes = Array.from({ length: 40 }, (_, i) => at(2 + (i % 10), i < 22 ? 20 : 8));
    expect(usualStudyHour([...antigas, ...recentes])).toBe(20);
  });

  it('empate fica com a hora da tentativa mais recente; data inválida não conta', () => {
    expect(usualStudyHour([at(10, 9), at(11, 9), at(12, 18), at(13, 18), 'x', at(14, 18), at(15, 9)])).toBe(9);
  });
});

describe('nextLessonTitle', () => {
  const unit = (nodes: object[]) => ({ nodes });
  it('o título da aula recomendada; nó que não é aula não serve', () => {
    const trail = { recommendedNodeId: 'b', segments: [{ units: [unit([{ id: 'a', type: 'lesson', title: 'A' }, { id: 'b', type: 'lesson', title: 'Colimação' }])] }] };
    expect(nextLessonTitle(trail as never)).toBe('Colimação');
    const review = { recommendedNodeId: 'r', segments: [{ units: [unit([{ id: 'r', type: 'review', title: 'Revisão' }])] }] };
    expect(nextLessonTitle(review as never)).toBeNull();
    expect(nextLessonTitle({ segments: [] } as never)).toBeNull();
  });
});

describe('gatherReminderContext', () => {
  const now = new Date(2026, 10, 15, 10);
  const ports = (over: Partial<ReminderContextPorts> = {}): ReminderContextPorts => ({
    gamification: async () => ({ totalXp: 40, streakDays: 4, lastActiveDate: '2026-11-14' }),
    goal: async () => ({ isCompleted: false } as never),
    dueReviews: async () => 2,
    trail: async () => ({ segments: [] }),
    attempts: async () => [],
    league: EMPTY_LEAGUE_STANDING,
    lastScheduledIso: async () => null,
    preferences: async () => ALL_ON,
    ...over,
  });

  it('monta o contexto a partir das fontes existentes', async () => {
    expect(await gatherReminderContext(now, ports())).toEqual({
      now, lastStudyDateKey: '2026-11-14', streakDays: 4, dueReviews: 2, nextLessonTitle: null,
      goalCompletedToday: false, usualHour: null, league: null, firedTodayAlready: false, preferences: ALL_ON,
    });
  });

  it('lembrete de hoje com horário já passado conta como disparado; o de amanhã, não', async () => {
    const fired = await gatherReminderContext(now, ports({ lastScheduledIso: async () => new Date(2026, 10, 15, 9).toISOString() }));
    expect(fired.firedTodayAlready).toBe(true);
    const later = await gatherReminderContext(now, ports({ lastScheduledIso: async () => new Date(2026, 10, 15, 19).toISOString() }));
    expect(later.firedTodayAlready).toBe(false);
    const yesterday = await gatherReminderContext(now, ports({ lastScheduledIso: async () => new Date(2026, 10, 14, 19).toISOString() }));
    expect(yesterday.firedTodayAlready).toBe(false);
    // 23h30 de ontem no Brasil já é hoje em UTC: o dia é o do aparelho.
    const lateYesterday = await gatherReminderContext(now, ports({ lastScheduledIso: async () => new Date(2026, 10, 14, 23, 30).toISOString() }));
    expect(lateYesterday.firedTodayAlready).toBe(false);
  });

  it('uma fonte que falha não derruba o lembrete: vira ausência, nunca inventa dado', async () => {
    const boom = async () => { throw new Error('falhou'); };
    const c = await gatherReminderContext(now, ports({ dueReviews: boom, trail: boom, attempts: boom, league: { getStanding: boom } }));
    expect([c.dueReviews, c.nextLessonTitle, c.usualHour, c.league]).toEqual([0, null, null, null]);
  });
});
