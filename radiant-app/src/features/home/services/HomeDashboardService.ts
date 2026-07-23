import type {
  HomeCatalogLesson,
  HomeDashboardDependencies,
  HomeDashboardViewModel,
  HomeMissionViewModel,
} from '../home.types';

async function recover<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await operation();
  } catch {
    return fallback;
  }
}

function resolveGreeting(displayName: string | null): string {
  const firstName = displayName?.trim().split(/\s+/)[0];
  return firstName ? `Olá, ${firstName}` : 'Olá';
}

function resolveInitials(displayName: string | null): string | null {
  const words = displayName?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (words.length === 0) return null;
  return words.length === 1 ? words[0].slice(0, 2).toUpperCase() : `${words[0][0]}${words.at(-1)?.[0]}`.toUpperCase();
}

function reviewMission(lesson: HomeCatalogLesson | undefined, dueCount: number): HomeMissionViewModel {
  return {
    title: lesson ? `Revisar ${lesson.title}` : 'Revisões pendentes',
    caseCount: null,
    durationMinutes: null,
    xpReward: null,
    action: { kind: 'review', dueCount },
  };
}

export class HomeDashboardService {
  constructor(private readonly dependencies: HomeDashboardDependencies) {}

  async getDashboard(): Promise<HomeDashboardViewModel> {
    const [catalog, nextActivity, dueLessonIds, gamification, dailyGoal, learningStats] = await Promise.all([
      recover(() => this.dependencies.getCatalog(), { lessons: [] }),
      recover(() => this.dependencies.getNextActivity(), null),
      recover(() => this.dependencies.getDueLessonIds(), []),
      recover(() => this.dependencies.getGamification(), { streakDays: 0, totalXp: 0, hearts: 0, maxHearts: 0 }),
      recover(() => this.dependencies.getDailyGoal(), { completedToday: 0, goalPerDay: 1 }),
      recover(() => this.dependencies.getLearningStats(), { masteredCases: null, accuracyPercent: null }),
    ]);
    const lessonsById = new Map(catalog.lessons.map((lesson) => [lesson.id, lesson]));
    const dueCount = dueLessonIds.length;
    const dueLesson = dueLessonIds.length > 0 ? lessonsById.get(dueLessonIds[0]) : undefined;
    const nextLesson = nextActivity ? lessonsById.get(nextActivity.lessonId) : undefined;
    const mission: HomeMissionViewModel | null = dueCount > 0
      ? reviewMission(dueLesson, dueCount)
      : nextActivity && nextLesson
        ? {
            title: nextLesson.title,
            caseCount: nextLesson.caseCount ?? null,
            durationMinutes: nextLesson.durationMinutes ?? null,
            xpReward: nextLesson.xpReward ?? null,
            action: {
              kind: 'learn',
              lessonId: nextLesson.id,
              nodeId: nextActivity.nodeId,
              blockId: nextActivity.blockId,
            },
          }
        : null;

    return {
      greeting: resolveGreeting(this.dependencies.getDisplayName()),
      avatarInitials: resolveInitials(this.dependencies.getDisplayName()),
      dateLabel: new Intl.DateTimeFormat(this.dependencies.locale, { weekday: 'long', day: 'numeric', month: 'long' }).format(this.dependencies.now()),
      streakDays: gamification.streakDays,
      totalXp: gamification.totalXp,
      hearts: { current: gamification.hearts, maximum: gamification.maxHearts },
      dailyGoal: { completed: dailyGoal.completedToday, target: dailyGoal.goalPerDay },
      mission,
      masteredCases: learningStats.masteredCases,
      accuracyPercent: learningStats.accuracyPercent,
      dueReviewCount: dueCount,
    };
  }
}
