import { LessonCatalogService } from '../../content/services/LessonCatalogService';
import { DailyGoalService } from '../../daily-goal/services/DailyGoalService';
import { GamificationService } from '../../gamification/services/GamificationService';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';
import { SpacedRepetitionService } from '../../spaced-repetition/services/SpacedRepetitionService';
import { HomeDashboardService } from './HomeDashboardService';

export const localHomeDashboardService = new HomeDashboardService({
  now: () => new Date(),
  locale: 'pt-BR',
  getDisplayName: () => null,
  getCatalog: async () => {
    await LessonCatalogService.bootstrap();
    return { lessons: LessonCatalogService.listLessons().map(({ id, title }) => ({ id, title })) };
  },
  getNextActivity: async () => {
    const node = (await JourneyProgressService.getSnapshot()).nextRecommendedNode;
    if (!node || (node.type !== 'lesson' && node.type !== 'review') || !node.lessonId || !node.blockId) return null;
    return { lessonId: node.lessonId, nodeId: node.id, blockId: node.blockId };
  },
  getDueLessonIds: () => SpacedRepetitionService.getDueLessons(),
  getGamification: () => GamificationService.getSnapshot(),
  getDailyGoal: () => DailyGoalService.getSnapshot(),
  getLearningStats: async () => ({ masteredCases: null, accuracyPercent: null }),
});
