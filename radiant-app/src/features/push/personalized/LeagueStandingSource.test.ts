import { ALL_ON, planReminder } from './composeReminder';
import type { ReminderContextPorts } from './reminderContext';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

// A fábrica só roda quando o módulo entra no registro do Jest: contar as chamadas
// é contar as cargas do `LeagueService`.
let mockLoads = 0;
const mockGetStanding = jest.fn(async () => ({ rank: 3, totalPlayers: 12, xp: 140, endsAt: '2026-11-22T00:00:00Z' }));
jest.mock('../../league/LeagueService', () => {
  mockLoads += 1;
  return { LeagueService: { getStanding: mockGetStanding } };
});

// Registro novo a cada teste, como na abertura do app: vale também para o `require`
// feito na hora da leitura, que `isolateModules` (síncrono) não alcança.
beforeEach(() => { jest.resetModules(); mockLoads = 0; mockGetStanding.mockClear(); });

function fresh() {
  return {
    liveLeagueStanding: require('./LeagueStandingSource').liveLeagueStanding as typeof import('./LeagueStandingSource').liveLeagueStanding,
    gather: require('./reminderContext').gatherReminderContext as typeof import('./reminderContext').gatherReminderContext,
  };
}

const now = new Date(2026, 10, 15, 10);
const ports = (league: ReminderContextPorts['league']): ReminderContextPorts => ({
  gamification: async () => ({ totalXp: 40, streakDays: 1, lastActiveDate: '2026-11-14' } as never),
  goal: async () => ({ isCompleted: false } as never),
  dueReviews: async () => 0,
  trail: async () => ({ segments: [] }),
  attempts: async () => [],
  league,
  lastScheduledIso: async () => null,
  preferences: async () => ALL_ON,
});

describe('liveLeagueStanding', () => {
  it('ligada: o lembrete fala da posição real na liga', async () => {
    const { liveLeagueStanding, gather } = fresh();
    const plan = planReminder(await gather(now, ports(liveLeagueStanding(true))));
    expect('kind' in plan && [plan.kind, plan.body]).toEqual(['liga', expect.stringContaining('3º')]);
    expect(mockGetStanding).toHaveBeenCalledTimes(1);
  });

  it('desligada: o lembrete não fala de liga, mesmo com posição disponível', async () => {
    const { liveLeagueStanding, gather } = fresh();
    const plan = planReminder(await gather(now, ports(liveLeagueStanding(false))));
    expect('kind' in plan && plan.kind).not.toBe('liga');
    expect(mockGetStanding).not.toHaveBeenCalled();
  });

  it('desligada: o módulo da liga não entra no registro, nem na carga nem na leitura', async () => {
    const { liveLeagueStanding } = fresh();
    expect(mockLoads).toBe(0);
    expect(await liveLeagueStanding(false).getStanding()).toBeNull();
    expect(mockLoads).toBe(0);
    // Controle: ligada, a mesma leitura carrega o módulo uma vez.
    await liveLeagueStanding(true).getStanding();
    expect(mockLoads).toBe(1);
  });
});
