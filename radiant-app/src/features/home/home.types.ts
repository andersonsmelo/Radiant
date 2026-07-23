export type HomePrimaryAction =
  | { kind: 'learn'; lessonId: string; nodeId: string | null; blockId: string | null }
  | { kind: 'review'; dueCount: number }
  | { kind: 'journey' };

export interface HomeMissionViewModel {
  title: string;
  caseCount: number | null;
  durationMinutes: number | null;
  xpReward: number | null;
  action: HomePrimaryAction;
}

export interface HomeDashboardViewModel {
  greeting: string;
  avatarInitials: string | null;
  dateLabel: string;
  streakDays: number;
  totalXp: number;
  hearts: { current: number; maximum: number };
  dailyGoal: { completed: number; target: number };
  mission: HomeMissionViewModel | null;
  masteredCases: number | null;
  accuracyPercent: number | null;
  dueReviewCount: number;
}

export interface HomeCatalogLesson {
  id: string;
  title: string;
  caseCount?: number;
  durationMinutes?: number;
  xpReward?: number;
}

export interface HomeDashboardDependencies {
  now(): Date;
  locale: string;
  getDisplayName(): string | null;
  getCatalog(): Promise<{ lessons: HomeCatalogLesson[] }>;
  getNextActivity(): Promise<{ lessonId: string; nodeId: string | null; blockId: string | null } | null>;
  getDueLessonIds(): Promise<string[]>;
  getGamification(): Promise<{ streakDays: number; totalXp: number; hearts: number; maxHearts: number }>;
  getDailyGoal(): Promise<{ completedToday: number; goalPerDay: number }>;
  getLearningStats(): Promise<{ masteredCases: number | null; accuracyPercent: number | null }>;
}
