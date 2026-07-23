import { HomeDashboardService } from './HomeDashboardService';
import type { HomeDashboardDependencies } from '../home.types';

const fixedNow = new Date('2026-07-23T12:00:00.000Z');

function createDependencies(overrides: Partial<HomeDashboardDependencies> = {}): HomeDashboardDependencies {
  return {
    now: () => fixedNow,
    locale: 'pt-BR',
    getDisplayName: () => 'Dra. Ana Silva',
    getCatalog: async () => ({
      lessons: [{ id: 'lesson-1', title: 'Fundamentos de radiologia', caseCount: 4, durationMinutes: 8, xpReward: 80 }],
    }),
    getNextActivity: async () => ({ lessonId: 'lesson-1', nodeId: 'node:lesson-1', blockId: 'block:lesson-1:intro' }),
    getDueLessonIds: async () => [],
    getGamification: async () => ({ streakDays: 3, totalXp: 120, hearts: 4, maxHearts: 5 }),
    getDailyGoal: async () => ({ completedToday: 1, goalPerDay: 3 }),
    getLearningStats: async () => ({ masteredCases: null, accuracyPercent: null }),
    ...overrides,
  };
}

describe('HomeDashboardService', () => {
  it('prioritizes a due review over the next learning activity', async () => {
    const service = new HomeDashboardService(createDependencies({ getDueLessonIds: async () => ['lesson-1'] }));

    const dashboard = await service.getDashboard();

    expect(dashboard.mission).toEqual({
      title: 'Revisar Fundamentos de radiologia',
      caseCount: null,
      durationMinutes: null,
      xpReward: null,
      action: { kind: 'review', dueCount: 1 },
    });
  });

  it('resolves an eligible local lesson into a learn action', async () => {
    const service = new HomeDashboardService(createDependencies());

    const dashboard = await service.getDashboard();

    expect(dashboard.mission).toEqual({
      title: 'Fundamentos de radiologia',
      caseCount: 4,
      durationMinutes: 8,
      xpReward: 80,
      action: { kind: 'learn', lessonId: 'lesson-1', nodeId: 'node:lesson-1', blockId: 'block:lesson-1:intro' },
    });
  });

  it('keeps greeting and learning metrics honest when identity and statistics are unavailable', async () => {
    const service = new HomeDashboardService(createDependencies({
      getDisplayName: () => null,
      getLearningStats: async () => ({ masteredCases: null, accuracyPercent: null }),
    }));

    const dashboard = await service.getDashboard();

    expect(dashboard.greeting).toBe('Olá');
    expect(dashboard.avatarInitials).toBeNull();
    expect(dashboard.masteredCases).toBeNull();
    expect(dashboard.accuracyPercent).toBeNull();
  });

  it('uses the injected clock and locale for the date label', async () => {
    const service = new HomeDashboardService(createDependencies({ locale: 'en-US' }));

    const dashboard = await service.getDashboard();

    expect(dashboard.dateLabel).toBe(
      new Intl.DateTimeFormat('en-US', { weekday: 'long', day: 'numeric', month: 'long' }).format(fixedNow),
    );
  });

  it('offers no invented mission when the local catalog is empty', async () => {
    const service = new HomeDashboardService(createDependencies({
      getCatalog: async () => ({ lessons: [] }),
      getNextActivity: async () => null,
    }));

    await expect(service.getDashboard()).resolves.toMatchObject({ mission: null });
  });

  it('keeps the local dashboard available when the next activity source fails', async () => {
    const service = new HomeDashboardService(createDependencies({
      getNextActivity: async () => Promise.reject(new Error('remote unavailable')),
    }));

    await expect(service.getDashboard()).resolves.toMatchObject({
      greeting: 'Olá, Dra.',
      totalXp: 120,
      mission: null,
    });
  });
});
