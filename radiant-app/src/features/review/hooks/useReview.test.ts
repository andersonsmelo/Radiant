import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useReview } from './useReview';
import { SpacedRepetitionService } from '../../spaced-repetition/services/SpacedRepetitionService';
import { LessonCatalogService } from '../../content/services/LessonCatalogService';
import { OnboardingService } from '../../onboarding/OnboardingService';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

jest.mock('../../spaced-repetition/services/SpacedRepetitionService', () => ({
    SpacedRepetitionService: {
        getDueLessons: jest.fn(),
        recordQuizResult: jest.fn(),
        getCardState: jest.fn(),
    },
}));

jest.mock('../../content/services/LessonCatalogService', () => ({
    LessonCatalogService: { getReviewQuestionsForLesson: jest.fn() },
}));

jest.mock('../../gamification/services/GamificationService', () => ({
    GamificationService: { addManualXp: jest.fn() },
}));

jest.mock('../../telemetry/TelemetryService', () => ({
    TelemetryService: {
        track: jest.fn(),
        markDayReviewed: jest.fn(),
        startTimer: jest.fn(),
        stopTimer: jest.fn(),
    },
}));

jest.mock('../../sync/SyncQueueService', () => ({
    SyncQueueService: { enqueueReviewCard: jest.fn(), flush: jest.fn() },
}));

const question = (id: string) => ({
    id,
    type: 'multiple-choice',
    prompt: id,
    options: [{ label: 'A' }, { label: 'B' }],
    correctAnswerIndex: 0,
    explanation: 'Explicação',
});

describe('useReview resume', () => {
    beforeEach(async () => {
        jest.clearAllMocks();
        await AsyncStorage.clear();
        await OnboardingService.reset();
        (SpacedRepetitionService.getDueLessons as jest.Mock).mockResolvedValue(['lesson-1', 'lesson-2']);
        (LessonCatalogService.getReviewQuestionsForLesson as jest.Mock)
            .mockImplementation((lessonId: string) => [question(`question-${lessonId}`)]);
    });

    it('persists first review value before exposing the finished state to the prompt caller', async () => {
        const { result } = renderHook(() => useReview());
        await waitFor(() => expect(result.current.loading).toBe(false));
        act(() => result.current.startReview());
        await act(async () => result.current.submitRating(true));
        expect(JSON.parse((await AsyncStorage.getItem('@radiant/onboarding'))!).firstReviewAt).toBeNull();
        await act(async () => result.current.submitRating(true));
        expect(result.current.state).toBe('finished');
        expect(JSON.parse((await AsyncStorage.getItem('@radiant/onboarding'))!).firstReviewAt).toEqual(expect.any(Number));
    });

    it('enters the explicitly resumed due card after the external CTA', async () => {
        const { result } = renderHook(() => useReview({ resumeCursorId: 'question-lesson-2' }));

        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.state).toBe('review');
        expect(result.current.currentIndex).toBe(1);
        expect(result.current.currentItem?.question.id).toBe('question-lesson-2');
    });

    it('falls back to the review intro when the saved card is no longer due', async () => {
        const { result } = renderHook(() => useReview({ resumeCursorId: 'question-missing' }));

        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.state).toBe('start');
        act(() => result.current.startReview());
        expect(result.current.state).toBe('review');
    });
});
