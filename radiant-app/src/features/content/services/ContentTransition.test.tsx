import { fireEvent, render, screen } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import { router } from 'expo-router';
import LearnRoute from '../../../app/learn';
import QuizRoute from '../../../app/quiz';
import HybridLessonRoute from '../../../app/licao-hibrida';
import { ContentUpdatedScreen, CONTENT_UPDATED_TITLE } from '../components/ContentUpdatedScreen';
import { LessonFlowService } from '../../lesson-flow/services/LessonFlowService';
import { LessonCatalogService } from './LessonCatalogService';
import { JourneyProgressService } from '../../journey/services/JourneyProgressService';
import { isResumeContentAvailable } from './ContentAvailability';
import ReviewScreen from '../../review/screens/ReviewScreen';
import { GamificationService } from '../../gamification/services/GamificationService';
import { heartsRepository } from '../../hearts/HeartsRepository';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(async () => null), setItem: jest.fn(async () => {}),
    removeItem: jest.fn(async () => {}),
}));
jest.mock('../../../ui/accessibility/useReducedMotionPreference', () => ({ useReducedMotionPreference: () => ({ resolved: true, reducedMotionEnabled: true }) }));
jest.mock('../../gamification/services/GamificationService', () => ({ GamificationService: { getSnapshot: jest.fn(async () => ({ totalXp: 12, streakDays: 1 })), addManualXp: jest.fn() } }));
jest.mock('../../hearts/HeartsRepository', () => ({ heartsRepository: { getSnapshot: jest.fn(async () => ({ count: 5, status: 'full' })), rewardReview: jest.fn(), spend: jest.fn() } }));
jest.mock('../../review/hooks/useReview', () => ({ useReview: () => ({ state: 'start', queue: [], loading: false, totalItems: 0, hasUnavailableReviews: true }) }));
const mockParams = jest.fn();
jest.mock('expo-router', () => ({
    router: { replace: jest.fn(), dismissTo: jest.fn(), push: jest.fn() },
    useLocalSearchParams: () => mockParams(), useFocusEffect: jest.fn(),
}));
jest.mock('../../lesson-flow/services/LessonFlowService', () => ({ LessonFlowService: {
    getBlockById: jest.fn(() => null), getActivityById: jest.fn(() => null),
} }));
jest.mock('./LessonCatalogService', () => ({ LessonCatalogService: {
    getLessonById: jest.fn(() => null), getInitialLesson: jest.fn(() => null),
    listTracks: jest.fn(() => []), listLessonSummaries: jest.fn(() => []),
    getReviewQuestionsForLesson: jest.fn(() => []),
} }));
jest.mock('../../journey/services/JourneyProgressService', () => ({ JourneyProgressService: {
    setCurrentNode: jest.fn(), setResumableNode: jest.fn(), markNodeCompleted: jest.fn(),
} }));

describe('PC06-C unavailable content routes', () => {
    beforeEach(() => { jest.clearAllMocks(); mockParams.mockReturnValue({}); });
    it.each([undefined, 'retired-node'])('opens learn with node=%s without starting an attempt', nodeId => {
        mockParams.mockReturnValue({ blockId: 'retired-activity', nodeId, resumeCursorId: 'step-9' });
        const view = render(<LearnRoute />);
        expect(screen.getByText(CONTENT_UPDATED_TITLE)).toBeTruthy();
        expect(JourneyProgressService.setCurrentNode).not.toHaveBeenCalled();
        expect(JourneyProgressService.setResumableNode).not.toHaveBeenCalled();
        expect(JourneyProgressService.markNodeCompleted).not.toHaveBeenCalled();
        fireEvent.press(screen.getByText('Ver a nova trilha'));
        expect(router.replace).toHaveBeenCalledWith('/(tabs)');
        view.unmount();
        render(<LearnRoute />);
        expect(screen.getByText(CONTENT_UPDATED_TITLE)).toBeTruthy();
        expect(JourneyProgressService.setResumableNode).not.toHaveBeenCalled();
    });
    it.each([{ lessonId: 'retired-lesson' }, { mode: 'review', lessonIds: 'retired-a,retired-b' }])('does not fall back to a different quiz: %p', params => {
        mockParams.mockReturnValue(params);
        render(<QuizRoute />);
        expect(screen.getByText(CONTENT_UPDATED_TITLE)).toBeTruthy();
        expect(LessonCatalogService.getInitialLesson).not.toHaveBeenCalled();
    });
    it('explains an ineligible review queue without offering answers or rewards', async () => {
        render(<ReviewScreen />);
        expect(await screen.findByText('Seus dados e conquistas foram preservados. Não há itens de revisão disponíveis no catálogo atual. Conheça a nova trilha.')).toBeTruthy();
        expect(screen.queryByText('Começar')).toBeNull();
        expect(GamificationService.addManualXp).not.toHaveBeenCalled();
        expect(heartsRepository.rewardReview).not.toHaveBeenCalled();
    });
    it('routes the old hybrid entry to the same notice', () => {
        render(<HybridLessonRoute />);
        fireEvent.press(screen.getByText('Ver a nova trilha'));
        expect(router.replace).toHaveBeenCalledWith('/(tabs)');
    });
    it('announces the notice once and exposes an ordinary button', () => {
        const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');
        const onOpenTrail = jest.fn();
        render(<ContentUpdatedScreen onOpenTrail={onOpenTrail} />);
        fireEvent(screen.getByText(CONTENT_UPDATED_TITLE), 'layout', { nativeEvent: { layout: {} } });
        fireEvent(screen.getByText(CONTENT_UPDATED_TITLE), 'layout', { nativeEvent: { layout: {} } });
        expect(announce).toHaveBeenCalledTimes(1);
        fireEvent.press(screen.getByRole('button', { name: 'Ver a nova trilha' }));
        expect(onOpenTrail).toHaveBeenCalledTimes(1);
        announce.mockRestore();
    });
    it('does not map an old review cursor to the first question in the new catalog', () => {
        const summaries = LessonCatalogService.listLessonSummaries as jest.Mock;
        const questions = LessonCatalogService.getReviewQuestionsForLesson as jest.Mock;
        summaries.mockReturnValue([{ id: 'current-lesson' }]);
        questions.mockReturnValue([{ id: 'current-question' }]);
        expect(isResumeContentAvailable({ surface: 'review', flowId: 'review-session-v1', cursorId: 'old-question' })).toBe(false);
        expect(isResumeContentAvailable({ surface: 'review', flowId: 'review-session-v1', cursorId: 'current-question' })).toBe(true);
        summaries.mockReturnValue([]); questions.mockReturnValue([]);
    });
    it('resolves availability from current content, never a cursor index', () => {
        expect(isResumeContentAvailable({ surface: 'lesson', flowId: 'lesson:retired' })).toBe(false);
        expect(isResumeContentAvailable({ surface: 'review', flowId: 'review-session-v1' })).toBe(false);
        expect(isResumeContentAvailable({ surface: 'first-run', flowId: 'first-run-v1' })).toBe(true);
        expect(LessonFlowService.getBlockById).toHaveBeenCalledWith('retired');
    });
});
